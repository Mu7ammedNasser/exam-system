import { questions } from "../data/questions.js";
var useranswers = JSON.parse(localStorage.getItem("userAnswers"));

let score = questions.length;
for (var i = 0; i < questions.length; i++) {
  if (useranswers[i + 1] == questions[i].correctAnswer) {
    continue;
  }
  score--;
}

const percentage = (score / questions.length) * 100;

console.log(`${percentage.toFixed(2)}%`);
