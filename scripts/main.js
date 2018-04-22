const ALARM_CLEANUP = "cleanup";
const DEFAULT_PERIOD = 30;
const PAUSED_ICON = "/images/broom-paused.png";
const UNPAUSED_ICON = "/images/broom.png";
const DEFAULT_CONFIG = {
  isPaused: false,
  periodInMinutes: DEFAULT_PERIOD,
  nextTrigger: null,
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
  let cb = function() {};

  chrome.browsingData.remove({
    since: 0,
    originTypes: {
      protectedWeb: true
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

function executeCleaning(cfg) {
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
    let nextTrigger = Date.now() + (cfg.periodInMinutes * 60000);

    executeCleaning(cfg);

    cfg.nextTrigger = nextTrigger;
    storeConfig(cfg);
  }
}

function startAlarm(cb) {
  withConfig(function(cfg) {
    let nowMillis = Date.now();

    let initMillis;
    if (cfg['nextTrigger'] && cfg['nextTrigger'] > (nowMillis + 1000)) {
      initMillis = cfg.nextTrigger;
    } else {
      initMillis = nowMillis  + (cfg.periodInMinutes * 60000);
    }

    chrome.alarms.create(ALARM_CLEANUP, {
      when: initMillis,
      periodInMinutes: cfg.periodInMinutes
    });

    chrome.alarms.onAlarm.addListener(withConfig(handleAlarm));

    if (typeof cb == 'function') {
      cb(cfg);
    }

    cfg.nextTrigger = initMillis;
    storeConfig(cfg);
  })();
}

function clearAlarm(cb) {
  withConfig(function(cfg) {
    chrome.alarms.clear(ALARM_CLEANUP);

    if (typeof cb == 'function') {
      cb(cfg);
    }

    cfg.nextTrigger = null;
    storeConfig(cfg);
  })();
}

function storeConfig(cfg) {
  let config = cfg || DEFAULT_CONFIG;
  chrome.storage.sync.set({'config': config});
  return config;
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
