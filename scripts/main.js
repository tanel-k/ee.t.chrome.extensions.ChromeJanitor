const ALARM_CLEANUP = "cleanup";
const DEFAULT_PERIOD = 30;
const PAUSED_ICON = "/images/broom-paused.png";
const UNPAUSED_ICON = "/images/broom.png";
const DEFAULT_CONFIG = {
  periodInMinutes: DEFAULT_PERIOD,
  historyConfig: {
    clearSiteCache: true,
    clearFileCache: true,
    clearDownloads: true,
    clearHistory: true,
    clearFormData: false,
    clearPasswords: false
  }
}


/**
 * https://developer.chrome.com/extensions/browsingData
 */
function cleanHistory(cfg) {
  let cb = function() {
    // TODO
  };
  
  chrome.browsingData.remove({
    "since": 0,
    "originTypes": {
      "protectedWeb": true
    }
  }, {
    appcache: cfg.historyConfig.clearSiteCache,
    cache: cfg.historyConfig.clearFileCache,
    downloads: cfg.historyConfig.clearDownloads,
    history: cfg.historyConfig.clearHistory,
    passwords: cfg.historyConfig.clearPasswords,
    formData: cfg.historyConfig.clearFormData
  }, cb);
}

function runClean(cfg) {
  cleanHistory(cfg);
}

function setIcon(path) {
  chrome.browserAction.setIcon({path: path});
}

function flipIcon(cfg) {
  setIcon(cfg.isPaused ? PAUSED_ICON : UNPAUSED_ICON);
}

function handleAlarm(alarm, cfg) {
  if (alarm.name == ALARM_CLEANUP) {
    runClean(cfg);
  }
}

function startAlarm() {
  withConfig(function(cfg) {
    chrome.alarms.create(ALARM_CLEANUP, {
      periodInMinutes: cfg.periodInMinutes
    });
    chrome.alarms.onAlarm.addListener(withConfig(handleAlarm));
  })();
}

function clearAlarm() {
  chrome.alarms.clear(ALARM_CLEANUP);
}

function storeConfig(cfg) {
  cfg = cfg || DEFAULT_CONFIG;
  chrome.storage.sync.set({'config': cfg});
  return cfg;
}

function withConfig(cb) {
  return function() {
    let args = Array.prototype.slice.call(arguments);
    
    chrome.storage.sync.get(['config'], function(result) {
      let cfg = result.config || DEFAULT_CONFIG;
      args.push(cfg);
      return cb.apply(null, args);
    });
  }
}
