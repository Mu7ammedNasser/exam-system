if (!localStorage.getItem("currentUser")) {
  window.location.replace("./login.html");
} else {
  if (
    localStorage.getItem("examEnded") ||
    localStorage.getItem("examSubmited")
  ) {
    window.location.replace("./result.html");
  } else {
    if (localStorage.getItem("examEndTime")) {
      window.location.replace("./exam.html");
    } else {
      var checkBtn = document.querySelector('input[type="checkbox"]');
      var button = document.getElementById("startExam");
      var warningMsg = document.getElementById("warningMsg");

      var currentUserInfo = JSON.parse(localStorage.getItem("currentUser"));

      document.querySelector(
        ".student-name"
      ).textContent = `${currentUserInfo["firstName"]} ${currentUserInfo["lastName"]}`;
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

      document.querySelector(".logout").addEventListener("click", function () {
        localStorage.removeItem("currentUser");
        window.location.replace("./login.html");
      });
    }
  }
}
