(function () {
  'use strict';

  function initPreloader() {
    var preloader = document.getElementById('preloader');
    var bar = document.getElementById('preloaderBar');
    var status = document.getElementById('preloaderStatus');
    if (!preloader) return;

    document.body.classList.add('preloader-active');

    var messages = [
      'Initializing laboratory systems…',
      'Loading genomics modules…',
      'Preparing diagnostics data…',
      'Almost ready…'
    ];
    var minDuration = 2000;
    var maxWait = 8000;
    var startTime = Date.now();
    var progress = 0;
    var messageIndex = 0;
    var loadComplete = false;
    var finished = false;

    function setProgress(value) {
      progress = Math.min(100, Math.round(value));
      if (bar) bar.style.width = progress + '%';

      var nextMsg = Math.min(messages.length - 1, Math.floor(progress / 28));
      if (status && nextMsg !== messageIndex) {
        messageIndex = nextMsg;
        status.textContent = messages[messageIndex];
      }
    }

    var tick = setInterval(function () {
      if (finished) {
        clearInterval(tick);
        return;
      }

      if (!loadComplete) {
        setProgress(progress + (progress < 80 ? 2.5 + Math.random() * 3.5 : 1));
      } else {
        setProgress(progress + 8);
      }
    }, 160);

    function revealPage() {
      var reveal = document.querySelector('.page-reveal');
      if (reveal) {
        requestAnimationFrame(function () {
          reveal.classList.add('page-reveal--ready');
        });
      }
    }

    function hidePreloader() {
      if (finished) return;
      finished = true;
      clearInterval(tick);
      loadComplete = true;
      setProgress(100);
      if (status) status.textContent = 'Welcome';

      var wait = Math.max(0, minDuration - (Date.now() - startTime));
      setTimeout(function () {
        preloader.setAttribute('aria-busy', 'false');
        preloader.classList.add('preloader--hidden');
        document.body.classList.remove('preloader-active');
        revealPage();

        setTimeout(function () {
          if (preloader.parentNode) {
            preloader.parentNode.removeChild(preloader);
          }
        }, 650);
      }, wait + 400);
    }

    if (document.readyState === 'complete') {
      hidePreloader();
    } else {
      window.addEventListener('load', hidePreloader);
      setTimeout(hidePreloader, maxWait);
    }
  }

  initPreloader();
})();
