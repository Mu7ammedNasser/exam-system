import { questions } from "../data/questions.js";
console.log(questions);

var userAnswers = JSON.parse(localStorage.getItem("userAnswers")) || {};
var currentQuestionIndex = 0;
var flaggedQuestions = new Set(
  JSON.parse(localStorage.getItem("flaggedQuestions")) || []
);

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
    optionsRadio.name = toString(question.id);
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
});

document.getElementById("prev-btn").addEventListener("click", function () {
  saveAnswer();
  renderNavigator();
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    renderQuestion();
    renderNavigator();
  }
});

function renderNavigator() {
  var buttons = document.querySelectorAll(".questions-navigator button");
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
}

document.querySelector(".flag-button").addEventListener("click", function () {
  console.log(`flagged question number ${currentQuestionIndex + 1}`);
  if (flaggedQuestions.has(currentQuestionIndex)) {
    flaggedQuestions.delete(currentQuestionIndex);
  } else {
    flaggedQuestions.add(currentQuestionIndex);
  }
  saveFlaggedQuestions();
  renderNavigator();
});

renderNavigator();
renderQuestion();
