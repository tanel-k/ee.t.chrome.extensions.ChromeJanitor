const TIMEOUT_DELAY = 250;

withConfig(function(cfg) {
  let pauseBtn = document.getElementById('pauseBtn');
  let cleanBtn = document.getElementById('cleanBtn');
  
  function exit() {
    window.close();
  }
  
  function flipUI(cfg) {
    let isPaused = cfg.isPaused;
    pauseBtn.textContent = isPaused ? 'Unpause' : 'Pause';
    flipIcon(cfg);
  }
  
  flipUI(cfg);
  
  pauseBtn.addEventListener('click', function() {
    withConfig(function(cfg) {
      let isPaused = cfg.isPaused;
      
      if (isPaused) {
        isPaused = false;
        startAlarm();
      } else {
        isPaused = true;
        clearAlarm();
      }
      
      cfg.isPaused = isPaused;
      
      flipUI(cfg);
      storeConfig(cfg);
      
      // FIXME: the icon swap won't apply if the pop-up is closed immediately
      setTimeout(exit, TIMEOUT_DELAY);
    })();
  });
  
  cleanBtn.addEventListener('click', function() {
    withConfig(function(cfg) {
      runClean(cfg);
      
      // FIXME: the icon swap won't apply if the pop-up is closed immediately
      exit();
    })();
  });
})();
