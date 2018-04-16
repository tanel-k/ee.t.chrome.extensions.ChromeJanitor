/**
 * https://developer.chrome.com/extensions/alarms
 */
chrome.runtime.onInstalled.addListener(withConfig(function(cfg) {
  // TODO: configuration: cleaning options, interval,
  startAlarm();
  flipIcon(cfg);
}));
