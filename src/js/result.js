import { questions } from "../data/questions.js";
var useranswers = JSON.parse(localStorage.getItem("userAnswers"));
var flaggedquestions =
  JSON.parse(localStorage.getItem("flaggedQuestions")) || [];
let score = questions.length;
for (var i = 0; i < questions.length; i++) {
  if (useranswers[i + 1] == questions[i].correctAnswer) {
    continue;
  }
  score--;
}

var percentage = (score / questions.length) * 100;

var circle = document.querySelector(".progress-circle");
var text = circle.querySelector("span");
var message = document.querySelector(".score-message");

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
}

// performance summary

document.querySelector(".total-ques").textContent = questions.length;
document.querySelector(".total-correct-ques").textContent = score;
document.querySelector(".total-incorrect-ques").textContent =
  questions.length - score;

document.querySelector(".total-flagged-ques").textContent =
  flaggedquestions.length;
