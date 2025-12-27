const checkBtn = document.querySelector('input[type="checkbox"]');
const button = document.getElementById("startExam");
const warningMsg = document.getElementById("warningMsg");

// button.classList.add("bg-[#9e9d9d]");
// button.classList.add("cursor-not-allowed");
checkBtn.addEventListener("change", () => {
  if (checkBtn.checked) {
    button.disabled = false;
    button.classList.remove("bg-[#9e9d9d]", "cursor-not-allowed");
    button.classList.add("bg-[#09c]", "cursor-allowed");

    return;
  }
  button.classList.remove("bg-[#09c]", "cursor-allowed");
  button.classList.add("bg-[#9e9d9d]", "cursor-not-allowed");

  return;
});

button.addEventListener("click", () => {
  if (!checkBtn.checked) {
    warningMsg.classList.remove("hidden");
    return;
  }

  sessionStorage.setItem("examStarted", "true");
  window.location.replace("./exam.html");
  //   window.location.href = "./exam.html";
});
