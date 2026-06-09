(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var redirectPages = document.querySelector('[data-redirect]');
    if (redirectPages) {
      var target = redirectPages.getAttribute('data-redirect');
      if (target) {
        setTimeout(function () {
          window.location.replace(target);
        }, 800);
      }
    }
  });
})();
