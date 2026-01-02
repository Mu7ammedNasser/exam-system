/***********************
 * UTILITIES
 ***********************/
function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

function hashPassword(password) {
  // hash password
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    hash = (hash << 5) - hash + password.charCodeAt(i);
    hash |= 0;
  }
  return hash.toString();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isStrongPassword(password) {
  return (
    password.length >= 8 && /[0-9]/.test(password) && /[a-zA-Z]/.test(password)
  );
}

/***********************
 * ERROR HANDLING (INLINE)
 ***********************/
function showInputError(inputId, errorId, message) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);

  if (!input || !error) return;

  input.classList.add("border-red-600");
  error.querySelector("span:last-child").textContent = message;
  error.classList.remove("hidden");
}

function clearInputError(inputId, errorId) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);

  if (!input || !error) return;

  input.classList.remove("border-red-600");
  error.classList.add("hidden");
}

/***********************
 * LOGIN VALIDATION
 ***********************/
function validateLoginEmail() {
  const input = document.getElementById("loginEmail");
  const error = document.getElementById("loginEmailError");

  if (!input.value.trim()) {
    input.classList.add("border-red-600");
    error.classList.remove("hidden");
    error.querySelector("span:last-child").textContent = "Email is required";
    return false;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
    input.classList.add("border-red-600");
    error.classList.remove("hidden");
    error.querySelector("span:last-child").textContent =
      "Enter a valid email address";
    return false;
  }

  return true;
}

function clearLoginEmailError() {
  document.getElementById("loginEmail").classList.remove("border-red-600");
  document.getElementById("loginEmailError").classList.add("hidden");
}

function validateLoginPassword() {
  const input = document.getElementById("loginPassword");
  const error = document.getElementById("loginPasswordError");

  if (!input.value.trim()) {
    input.classList.add("border-red-600");
    error.classList.remove("hidden");
    error.querySelector("span:last-child").textContent = "Password is required";
    return false;
  }

  return true;
}

function clearLoginPasswordError() {
  document.getElementById("loginPassword").classList.remove("border-red-600");
  document.getElementById("loginPasswordError").classList.add("hidden");
}

/***********************
 * LOGIN
 ***********************/
function loginUser() {
  const emailInput = document.getElementById("loginEmail");
  const passInput = document.getElementById("loginPassword");

  const email = emailInput.value.trim().toLowerCase();
  const password = passInput.value;

  clearInputError("loginEmail", "loginEmailError");
  clearInputError("loginPassword", "loginPasswordError");
  hideLoginFormError();

  const emailValid = validateLoginEmail();
  const passValid = validateLoginPassword();

  if (!emailValid || !passValid) return;

  const users = getUsers();
  const hashed = hashPassword(password);

  const user = users.find(
    (u) => u.email === email && u.passwordHash === hashed
  );

  if (!user) {
    showLoginFormError();
    return;
  }

  setCurrentUser(user);
  window.location.replace("landing.html");
}

function showLoginFormError() {
  document.getElementById("loginFormError").classList.remove("hidden");
}

function hideLoginFormError() {
  document.getElementById("loginFormError").classList.add("hidden");
}

/***********************
 * REGISTER VALIDATION
 ***********************/
function validateRegisterForm() {
  let valid = true;

  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value;
  const confirm = document.getElementById("confirmPassword").value;
  const agree = document.getElementById("agree").checked;

  if (!firstName) valid = false;
  if (!lastName) valid = false;

  if (!email || !isValidEmail(email)) valid = false;

  if (!isStrongPassword(password)) valid = false;

  if (password !== confirm) valid = false;

  if (!agree) valid = false;

  return valid;
}

/***********************
 * REGISTER
 ***********************/

function showRegisterFormError() {
  const box = document.getElementById("registerFormError");
  if (box) box.classList.remove("hidden");
}

function hideRegisterFormError() {
  const box = document.getElementById("registerFormError");
  if (box) box.classList.add("hidden");
}

function validateRegisterFirstName() {
  const input = document.getElementById("firstName");
  const value = input.value.trim();

  if (!value) {
    showInputError("firstName", "firstNameError", "First name is required");
    return false;
  }

  if (!isOnlyLetters(value)) {
    showInputError(
      "firstName",
      "firstNameError",
      "First name must contain letters only"
    );
    return false;
  }

  return true;
}

function validateRegisterLastName() {
  const input = document.getElementById("lastName");
  const value = input.value.trim();

  if (!value) {
    showInputError("lastName", "lastNameError", "Last name is required");
    return false;
  }

  if (!isOnlyLetters(value)) {
    showInputError(
      "lastName",
      "lastNameError",
      "Last name must contain letters only"
    );
    return false;
  }

  return true;
}

function validateRegisterEmail() {
  const input = document.getElementById("email");

  if (!input.value.trim()) {
    showInputError("email", "emailError", "Email is required");
    return false;
  }

  if (!isValidEmail(input.value)) {
    showInputError("email", "emailError", "Enter a valid email address");
    return false;
  }

  return true;
}

function validateRegisterPassword() {
  const input = document.getElementById("password");
  if (!isStrongPassword(input.value)) {
    showInputError(
      "password",
      "passwordError",
      "Password must be at least 8 characters and contain a number"
    );
    return false;
  }
  return true;
}

function validateRegisterConfirmPassword() {
  const pass = document.getElementById("password").value;
  const confirm = document.getElementById("confirmPassword").value;

  if (pass !== confirm) {
    showInputError(
      "confirmPassword",
      "confirmPasswordError",
      "Passwords do not match"
    );
    return false;
  }
  return true;
}
function validateRegisterAgree() {
  const checkbox = document.getElementById("agree");

  if (!checkbox.checked) {
    showInputError(
      "agree",
      "agreeError",
      "You must agree before creating an account"
    );
    return false;
  }

  return true;
}
function showRegisterSuccess() {
  const box = document.getElementById("registerSuccess");
  if (box) box.classList.remove("hidden");
}

function hideRegisterSuccess() {
  const box = document.getElementById("registerSuccess");
  if (box) box.classList.add("hidden");
}

function registerUser() {
  hideRegisterFormError();
  hideRegisterFormError();
  hideRegisterSuccess();
  clearInputError("firstName", "firstNameError");
  clearInputError("lastName", "lastNameError");
  clearInputError("email", "emailError");
  clearInputError("password", "passwordError");
  clearInputError("confirmPassword", "confirmPasswordError");
  clearInputError("agree", "agreeError");

  const valid =
    validateRegisterFirstName() &&
    validateRegisterLastName() &&
    validateRegisterEmail() &&
    validateRegisterPassword() &&
    validateRegisterConfirmPassword() &&
    validateRegisterAgree();

  if (!valid) return;

  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value;

  const users = getUsers();
  if (users.some((u) => u.email === email)) {
    showRegisterFormError();
    return;
  }

  users.push({
    firstName: document.getElementById("firstName").value.trim(),
    lastName: document.getElementById("lastName").value.trim(),
    email,
    passwordHash: hashPassword(password),
  });

  const newUser = {
    firstName: document.getElementById("firstName").value.trim(),
    lastName: document.getElementById("lastName").value.trim(),
    email,
    passwordHash: hashPassword(password),
  };

  saveUsers(users);
  setCurrentUser(newUser);


  hideRegisterFormError();
  hideRegisterSuccess();

  showRegisterSuccess();

  setTimeout(() => {
    window.location.replace("landing.html");
  }, 2000);
}

function isOnlyLetters(value) {
  // English only
  //return /^[A-Za-z\s]+$/.test(value);
  // English + Arabic letters
  return /^[A-Za-z\u0600-\u06FF\s]+$/.test(value);
}
/***********************
 * AUTH GUARD
 ***********************/
function requireAuth() {
  const user = getCurrentUser();

  if (!user) {
    window.location.href = "login.html";
    return;
  }
  window.location.href = "landing.html";
}

function redirectIfLoggedIn() {
  const user = getCurrentUser();

  if (user) {
    window.location.href = "landing.html";
  }
}

function redirectIfNotLoggedIn() {
  const user = getCurrentUser();

  if (!user) {
    window.location.href = "login.html";
  }
}

/***********************
 * NAVIGATION
 ***********************/
function goToLogin() {
  window.location.href = "login.html";
}

function goToRegister() {
  window.location.href = "signUp.html";
}

function goToHome() {
  window.location.href = "landing.html";
}

/***********************
 * LOGOUT
 ***********************/
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}

/***********************
 * PASSWORD TOGGLE
 ***********************/
function togglePass(id) {
  const input = document.getElementById(id);
  input.type = input.type === "password" ? "text" : "password";
}

/*************************************************** */
// NEW: Get current logged-in user's full info
function getCurrentUser() {
  var currentUserData = localStorage.getItem("currentUser");
  if (!currentUserData) return null;
  return JSON.parse(currentUserData);
}

// NEW: Save current user's full info (without password hash)
function setCurrentUser(user) {
  var userData = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  };
  localStorage.setItem("currentUser", JSON.stringify(userData));
}
