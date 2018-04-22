/**
 * https://developer.chrome.com/extensions/alarms
 */
// https://groups.google.com/a/chromium.org/forum/#!topic/chromium-extensions/6p3VqOq2qIY
// On every background page reload:
startAlarm(function(cfg) {
  flipIcon(cfg);
});
