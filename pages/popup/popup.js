const TIMEOUT_DELAY = 250;
const COUNTDOWN_TIMEOUT = 1000;
const MILLIS_PER_SECOND = 1000;
const MILLIS_PER_MINUTE = MILLIS_PER_SECOND * 60;
const MILLIS_PER_HOUR = MILLIS_PER_MINUTE * 60;
const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;

withConfig(function(_cfg) {
  let pauseBtn = document.getElementById('pauseBtn');
  let cleanBtn = document.getElementById('cleanBtn');
  let countdownLabel = document.getElementById('countdown');
  let countdownInterval = null;

  function exit() {
    window.close();
  }

  function formatInterval(millis) {
    let seconds = Math.floor(millis / MILLIS_PER_SECOND) % SECONDS_PER_MINUTE;
    let minutes = Math.floor(millis / MILLIS_PER_MINUTE) % MINUTES_PER_HOUR;
    let hours = Math.floor(millis / MILLIS_PER_HOUR);

    let formatted = '';
    if (hours > 0) {
      formatted += hours + ' h ';
    }

    if (minutes > 0) {
      formatted += minutes + ' min ';
    }

    if (seconds > 0) {
      formatted += seconds + ' s';
    }

    return formatted;
  }

  function startCountdownInterval() {
    stopCountdownInterval();
    if (!countdownInterval) {
      countdownInterval = setInterval(withConfig(updateCountdown), COUNTDOWN_TIMEOUT);
    }
  }

  function stopCountdownInterval() {
    if (countdownInterval) {
      clearInterval(countdownInterval);
      countdownInterval = null;
    }
  }

  function updateCountdown(cfg) {
    if (cfg.isPaused) {
      countdownLabel.innerText = '';
      return;
    }

    if (cfg['nextTrigger']) {
      let millisLeft = cfg.nextTrigger - Date.now();
      countdownLabel.innerText = formatInterval(millisLeft);
    }
  }

  function flipUI(cfg) {
    let isPaused = cfg.isPaused;
    pauseBtn.textContent = isPaused ? 'Unpause' : 'Pause';
    flipIcon(cfg);
  }

  flipUI(_cfg);
  
  pauseBtn.addEventListener('click', function() {
    withConfig(function(cfg) {
      let isPaused = cfg.isPaused;
      let alarmAction = null;

      if (isPaused) {
        isPaused = false;
        alarmAction = startAlarm;
        startCountdownInterval();
      } else {
        isPaused = true;
        alarmAction = clearAlarm;
        stopCountdownInterval();
        countdownLabel.innerText = '';
      }

      alarmAction(function(cfg) {
        cfg.isPaused = isPaused;
        flipUI(cfg);
      });

      // FIXME: the icon swap won't apply if the pop-up is closed immediately
      setTimeout(exit, TIMEOUT_DELAY);
    })();
  });

  cleanBtn.addEventListener('click', function() {
    withConfig(function(cfg) {
      executeCleaning(cfg);
      exit();
    })();
  });

  updateCountdown(_cfg);
  startCountdownInterval();
})();
