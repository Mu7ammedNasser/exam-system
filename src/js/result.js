import { questions } from "../data/questions.js";
var useranswers = JSON.parse(localStorage.getItem("userAnswers")) || {};
var flaggedquestions =
  JSON.parse(localStorage.getItem("flaggedQuestions")) || [];
var score = questions.length;

for (var i = 0; i < questions.length; i++) {
  if (useranswers[i + 1] == questions[i].correctAnswer) {
    continue;
  }
  score--;
}

var currentUserInfo = JSON.parse(localStorage.getItem("currentUser"));

document.querySelector(
  ".student-name"
).textContent = `${currentUserInfo["firstName"]} ${currentUserInfo["lastName"]}`;

var percentage = (score / questions.length) * 100 || 0;

var circle = document.querySelector(".progress-circle");
var text = circle.querySelector("span");
var message = document.querySelector(".score-message");
var shockMessage = document.querySelector(".shock-message");

circle.style.setProperty("--value", percentage);
text.textContent = percentage + "%";

if (percentage >= 60) {
  console.log("passed");

  circle.style.setProperty("--color", "#22c55e"); // green
  circle.style.background = `conic-gradient(
    var(--color) calc(var(--value) * 1%),
    #e5e7eb 0
  )`;
  message.innerHTML = `
    Congratulations! You passed the exam with
    <strong>${percentage}%</strong>. Keep up the good work!
  `;

  shockMessage.innerHTML = `
    <img src="./assets/icons/icons8-correct-30.png" alt="" class="w-[16px] h-[16px]"> Congratulations
  `;

  shockMessage.classList.add(
    "border-green-600",
    "text-green-600",
    "bg-green-600/10"
  );
} else {
  console.log("failed");

  circle.style.setProperty("--color", "#ef4444"); // red
  circle.style.background = `conic-gradient(
    var(--color) calc(var(--value) * 1%),
    #e5e7eb 0
  )`;
  message.innerHTML = `
    Unfortunately, you did not meet the passing criteria of
    <strong>60%</strong>. Don't be discouraged, review your weak areas and try again.
  `;

  shockMessage.innerHTML = `
  <span
                class="flex items-center text-sm justify-center w-[16px] h-[16px] text-center bg-red-600 text-white rounded-full"
                >!</span
              >Faild
  `;
  shockMessage.classList.add("border-red-600", "text-red-600", "bg-red-600/10");
}

// performance summary

document.querySelector(".total-ques").textContent = questions.length;
document.querySelector(".total-correct-ques").textContent = score || 0;
document.querySelector(".total-incorrect-ques").textContent =
  questions.length - score || 0;

document.querySelector(".total-flagged-ques").textContent =
  flaggedquestions.length || 0;

///logout

document.querySelector(".logout").addEventListener("click", function () {
  localStorage.removeItem("currentUser");
  localStorage.removeItem("userAnswers");
  localStorage.removeItem("flaggedQuestions");
  window.location.replace("./login.html");
});
