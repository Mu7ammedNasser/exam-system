var FullscreenExamGuard = (function () {
  var fullscreenExits = 0;
  var isExamActive = true;
  var maxExits = 3; // Maximum allowed fullscreen exits

  //** Request fullscreen
  function enterFullscreen() {
    var element = document.documentElement;

    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen(); // Safari
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen(); // Firefox
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen(); // IE11
    }
  }

  //** Exit fullscreen
  function exitFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }

  //** Check if in fullscreen
  function isFullscreen() {
    return !!(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    );
  }

  //** Show warning overlay when try to exist from full screen
  function showFullscreenWarning(exitsRemaining) {
    var overlay = document.getElementById("fullscreen-warning-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "fullscreen-warning-overlay";
      overlay.className =
        "fixed inset-0 z-[100] bg-red-600 flex items-center justify-center";
      overlay.innerHTML =
        '<div class="text-center text-white p-8">' +
        '<i class="fa-solid fa-expand text-6xl mb-4 animate-pulse"></i>' +
        '<h2 class="text-3xl font-bold mb-4">⚠️ FULLSCREEN REQUIRED</h2>' +
        '<p class="text-xl mb-6">You exited fullscreen mode!</p>' +
        '<p class="text-lg mb-6">Exits remaining: <span id="exits-count" class="font-bold text-yellow-300">' +
        exitsRemaining +
        "</span></p>" +
        '<p class="text-sm mb-8">Excessive exits will result in automatic exam submission.</p>' +
        '<button id="return-fullscreen-btn" class="bg-white text-red-600 px-8 py-4 rounded-lg text-xl font-bold hover:bg-gray-100 transition-all">' +
        "Return to Fullscreen" +
        "</button>" +
        "</div>";
      document.body.appendChild(overlay);

      document
        .getElementById("return-fullscreen-btn")
        .addEventListener("click", function () {
          enterFullscreen();
          overlay.remove();
        });
    } else {
      document.getElementById("exits-count").textContent = exitsRemaining;
      overlay.classList.remove("hidden");
    }
  }

  //** Show final warning before auto-submit
  function showFinalWarning() {
    var overlay = document.createElement("div");
    overlay.className =
      "fixed inset-0 z-[100] bg-black flex items-center justify-center";
    overlay.innerHTML =
      '<div class="text-center text-white p-8 max-w-md">' +
      '<i class="fa-solid fa-circle-exclamation text-6xl mb-4 text-red-500 animate-bounce"></i>' +
      '<h2 class="text-3xl font-bold mb-4">EXAM TERMINATED</h2>' +
      '<p class="text-xl mb-6">You exited fullscreen mode too many times!</p>' +
      '<p class="text-lg mb-8">Your exam is being submitted automatically...</p>' +
      '<div class="flex justify-center">' +
      '<i class="fa-solid fa-spinner fa-spin text-4xl"></i>' +
      "</div>" +
      "</div>";
    document.body.appendChild(overlay);
  }

  // Handle fullscreen change
  function handleFullscreenChange() {
    if (!isExamActive) return;

    if (!isFullscreen()) {
      fullscreenExits++;

      console.warn("⚠️ Fullscreen exit detected! Count:", fullscreenExits);

      if (fullscreenExits >= maxExits) {
        //** Too many exits - auto submit exam
        showFinalWarning();

        setTimeout(function () {
          if (typeof autoSubmitExam === "function") {
            autoSubmitExam("Too many fullscreen exits");
          } else if (typeof confirmExamHandler === "function") {
            confirmExamHandler();
          } else {
            window.location.href = "/pages/result.html";
          }
        }, 3000);
      } else {
        //** Show warning
        var remaining = maxExits - fullscreenExits;
        showFullscreenWarning(remaining);
      }
    }
  }

  //** Initialize fullscreen guard
  function init() {
    //** Show initial prompt
    // showInitialPrompt();

    //** Listen for fullscreen changes
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    //** Prevent F11 from being used (we want controlled fullscreen)
    document.addEventListener(
      "keydown",
      function (e) {
        if (e.key === "F11") {
          e.preventDefault();
          if (!isFullscreen()) {
            enterFullscreen();
          }
          return false;
        }
      },
      true
    );
  }

  //** Show initial prompt before exam starts
  function showInitialPrompt() {
    var overlay = document.createElement("div");
    overlay.id = "fullscreen-initial-overlay";
    overlay.className =
      "fixed inset-0 z-[100] bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center";
    overlay.innerHTML =
      '<div class="bg-white rounded-2xl p-8 max-w-lg text-center shadow-2xl">' +
      '<i class="fa-solid fa-shield-halved text-6xl mb-4 text-blue-600"></i>' +
      '<h2 class="text-3xl font-bold mb-4 text-gray-800">Exam Security Notice</h2>' +
      '<div class="text-left mb-6 space-y-3 text-gray-700">' +
      '<p class="flex items-start gap-2">' +
      '<i class="fa-solid fa-check text-green-500 mt-1"></i>' +
      "<span>Fullscreen mode is required for this exam</span>" +
      "</p>" +
      '<p class="flex items-start gap-2">' +
      '<i class="fa-solid fa-check text-green-500 mt-1"></i>' +
      "<span>You have <strong>3 chances</strong> to exit fullscreen</span>" +
      "</p>" +
      '<p class="flex items-start gap-2">' +
      '<i class="fa-solid fa-check text-green-500 mt-1"></i>' +
      "<span>Excessive exits will auto-submit your exam</span>" +
      "</p>" +
      '<p class="flex items-start gap-2">' +
      '<i class="fa-solid fa-check text-green-500 mt-1"></i>' +
      "<span>Your activity is being monitored</span>" +
      "</p>" +
      "</div>" +
      '<div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">' +
      '<p class="text-sm text-yellow-800">' +
      '<i class="fa-solid fa-info-circle"></i> ' +
      "<strong>Note:</strong> Press ESC to exit fullscreen anytime, but use it wisely!" +
      "</p>" +
      "</div>" +
      '<button id="start-exam-fullscreen-btn" class="w-full bg-blue-600 text-white px-8 py-4 rounded-lg text-xl font-bold hover:bg-blue-700 transition-all shadow-lg">' +
      '<i class="fa-solid fa-expand mr-2"></i>Start Exam in Fullscreen' +
      "</button>" +
      "</div>";

    document.body.appendChild(overlay);

    document
      .getElementById("start-exam-fullscreen-btn")
      .addEventListener("click", function () {
        enterFullscreen();
        overlay.remove();
      });
  }

  //** Disable fullscreen guard (when exam ends)
  function disable() {
    isExamActive = false;
    if (isFullscreen()) {
      exitFullscreen();
    }
  }

  //** Get exit count
  function getExitCount() {
    return fullscreenExits;
  }

  //** make it global
  return {
    init: init,
    disable: disable,
    getExitCount: getExitCount,
    enterFullscreen: enterFullscreen,
    exitFullscreen: exitFullscreen,
    isFullscreen: isFullscreen,
  };
})();

// Make it available globally
window.FullscreenExamGuard = FullscreenExamGuard;
