import { questions } from "../data/questions.js";
if (!localStorage.getItem("currentUser")) {
  window.location.replace("./login.html");
} else {
  console.log(questions);

  var userAnswers = JSON.parse(localStorage.getItem("userAnswers")) || {};
  var currentQuestionIndex = 0;
  var flaggedQuestions = new Set(
    JSON.parse(localStorage.getItem("flaggedQuestions")) || []
  );
  var buttons = document.querySelectorAll(".questions-navigator button");

  function saveAnswer() {
    var selectedChoice = document.querySelector('input[type="radio"]:checked');

    if (selectedChoice) {
      var questionId = questions[currentQuestionIndex].id;
      userAnswers[questionId] = Number(selectedChoice.value);

      localStorage.setItem("userAnswers", JSON.stringify(userAnswers));
    }
  }

  function saveFlaggedQuestions() {
    localStorage.setItem(
      "flaggedQuestions",
      JSON.stringify(Array.from(flaggedQuestions))
    );
  }

  function renderQuestion() {
    var question = questions[currentQuestionIndex];
    document.getElementById("question-counter").textContent = `Question ${
      currentQuestionIndex + 1
    } OF ${questions.length}`;

    document.getElementById(
      "question-header"
    ).textContent = `${question.question}`;

    var optionsRadios = document.querySelectorAll('input[type="radio"]');

    optionsRadios.forEach(function (optionsRadio, index) {
      optionsRadio.value = index;
      optionsRadio.name = String(question.id);
      optionsRadio.nextElementSibling.textContent = question.options[index];

      if (userAnswers[question.id] === index) {
        optionsRadio.checked = true;
      } else {
        optionsRadio.checked = false;
      }
    });
  }

  document.getElementById("next-btn").addEventListener("click", function () {
    saveAnswer();
    if (currentQuestionIndex < questions.length - 1) {
      currentQuestionIndex++;
      renderQuestion();
    }
    renderNavigator();
    updateFlagButtonStyle();
  });

  document.getElementById("prev-btn").addEventListener("click", function () {
    saveAnswer();
    renderNavigator();
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
      renderQuestion();
      renderNavigator();
    }
    updateFlagButtonStyle();
  });

  function renderNavigator() {
    buttons.forEach(function (button, index) {
      //remove style of current of other buttons
      button.classList.remove(
        "border-blue-600",
        "bg-blue-600/10",
        "bg-yellow-100",
        "border-yellow-600"
      );
      //removing "current" from other buttons
      var labelSpan = button.querySelector("span.current");
      if (labelSpan) labelSpan.textContent = "";
      //set current question style
      if (index === currentQuestionIndex) {
        button.classList.add("border-blue-600", "bg-blue-600/10");
        if (labelSpan) labelSpan.textContent = "Current";
      }
      //set answerd questions style
      if (userAnswers[questions[index].id] !== undefined) {
        button.classList.add("bg-green-600/10", "border", "border-green-600");
      }
      //flaged question set
      if (flaggedQuestions.has(index)) {
        button.classList.add("bg-yellow-100", "border", "border-yellow-600");
        return;
      }
    });

    handelLastButton();
  }

  document.querySelector(".flag-button").addEventListener("click", function () {
    if (flaggedQuestions.has(currentQuestionIndex)) {
      updateFlagButtonStyle();
      flaggedQuestions.delete(currentQuestionIndex);
    } else {
      updateFlagButtonStyle();
      flaggedQuestions.add(currentQuestionIndex);
    }
    saveFlaggedQuestions();
    renderNavigator();
    updateFlagButtonStyle();
  });

  function handelLastButton() {
    if (currentQuestionIndex == questions.length - 1) {
      document
        .querySelector("#next-btn")
        .classList.remove("hover:bg-blue-700", "bg-blue-600");
      document
        .querySelector("#next-btn")
        .classList.add("bg-gray-600", "cursor-not-allowed");

      document.querySelector("#next-btn").innerHTML = `
      <span class="content">Last Question</span
            >
    `;
    } else {
      document
        .querySelector("#next-btn")
        .classList.add("hover:bg-blue-700", "bg-blue-600");
      document
        .querySelector("#next-btn")
        .classList.remove("bg-gray-600", "cursor-not-allowed");

      document.querySelector("#next-btn").innerHTML = `
       <span class="content">Next</span
            >
            <img
              src="./assets/icons/icons8-left-arrow-16 (1).png"
              class="w-6"
              alt=""
            />
    `;
    }
  }
  /**************************************** */
  // handle overlay counts
  /******************************************* */
  function displayOverlay() {
    document.querySelector(".overlay").classList.remove("hidden");
  }

  function closeOverlay() {
    document.querySelector(".overlay").classList.add("hidden");
  }

  function submitExam() {
    saveAnswer();
    window.location.replace("./result.html");
  }

  function updateCounts() {
    saveAnswer();
    document.querySelector(".answered-count").textContent =
      Object.keys(userAnswers).length;

    document.querySelector(".flagged-count").textContent =
      flaggedQuestions.size;

    document.querySelector(".unanswered-count").textContent =
      questions.length - Object.keys(userAnswers).length;
  }

  // add event listeners
  document
    .querySelector("#submit-exam-btn")
    .addEventListener("click", displayOverlay);
  document
    .querySelector("#submit-exam-btn")
    .addEventListener("click", updateCounts);
  document.querySelector(".cancel-btn").addEventListener("click", closeOverlay);
  document
    .querySelector(".final-submit-btn")
    .addEventListener("click", submitExam);
  document
    .querySelector("button.close-btn")
    .addEventListener("click", closeOverlay);

  // initialize counts

  function updateFlagButtonStyle() {
    var flagBtn = document.querySelector(".flag-button");
    if (!flagBtn) return;

    flagBtn.classList.remove(
      "bg-yellow-50",
      "border-yellow-400",
      "text-yellow-600"
    );
    if (flaggedQuestions.has(currentQuestionIndex)) {
      flagBtn.classList.add(
        "bg-yellow-50",
        "border-yellow-400",
        "text-yellow-600"
      );
    }
  }

  buttons.forEach(function (button, index) {
    button.addEventListener("click", function () {
      saveAnswer();
      currentQuestionIndex = index;
      console.log(currentQuestionIndex);
      renderQuestion();
      renderNavigator();
      updateCounts();
      updateFlagButtonStyle();
    });
  });

  updateFlagButtonStyle();
  renderNavigator();
  renderQuestion();

  /********************************************** */
  // timing
  /********************************************** */
  var totalSeconds = 605;

  if (!localStorage.getItem("examEndTime")) {
    const endTime = Date.now() + totalSeconds * 1000;
    localStorage.setItem("examEndTime", endTime);
  }

  // var remaining = totalSeconds;
  var ring = document.getElementById("progress-ring");
  var timeEl = document.getElementById("time");
  var perimeter = 496;

  function updateTimer() {
    var endTime = Number(localStorage.getItem("examEndTime"));
    var remaining = Math.floor((endTime - Date.now()) / 1000);

    // Stop check
    if (remaining < 0) {
      clearInterval(timer);
      saveAnswer();
      document.querySelector(".time-out-overLay").classList.remove("hidden");

      setTimeout(() => {
        localStorage.removeItem("examEndTime");
        window.location.replace("./result.html");
      }, 5000);

      return;
    }

    // Update time text
    var m = String(Math.floor(remaining / 60)).padStart(2, "0");
    var s = String(remaining % 60).padStart(2, "0");
    timeEl.textContent = `${m}:${s}`;

    // Calculate progress
    var progress = remaining / totalSeconds;
    ring.style.strokeDashoffset = perimeter * progress;

    // Remove all color classes first
    timeEl.className = "px-6 py-2 rounded-full font-semibold";

    if (remaining <= 300) {
      // Critical -
      ring.style.stroke = "#dc2626"; // red-600
      timeEl.classList.add("bg-red-600/10", "text-red-600");
    } else if (remaining <= 600) {
      // Warning
      ring.style.stroke = "#f59e0b"; // amber-500
      timeEl.classList.add("bg-amber-500/10", "text-amber-600");
    } else {
      // Normal -
      ring.style.stroke = "#2563eb"; // blue-600
      timeEl.classList.add("bg-blue-600/10", "text-blue-600");
    }
  }
  updateTimer();
  // Start interval immediately - first tick happens at 1 second
  var timer = setInterval(updateTimer, 1000);

  /*********************************************************** */
  /*********************************************************** */
  /*********************************************************** */
  // responsive sidebar
  var sidebar = document.getElementById("sidebar");
  var toggleBtn = document.getElementById("mobile-sidebar-toggle");
  var backdrop = document.getElementById("sidebar-backdrop");

  // Toggle sidebar on mobile
  toggleBtn.addEventListener("click", () => {
    sidebar.classList.remove("hidden");
    sidebar.classList.toggle("translate-x-full");
    backdrop.classList.toggle("hidden");
  });

  // Close sidebar when clicking backdrop
  backdrop.addEventListener("click", () => {
    sidebar.classList.add("translate-x-full");
    backdrop.classList.add("hidden");
  });
}
