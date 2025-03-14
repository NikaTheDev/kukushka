let regForm = document.querySelector("#regForm");
let logInForm = document.querySelector("#logInForm");
let regSwitch = document.querySelector("#regSwitch");
let logSwitch = document.querySelector("#logSwitch");
let saveLogIn = document.querySelector("#saveLogIn");
let userpageForms = document.querySelector(".userpageForms");
let userInfoContainer = document.querySelector(".userInfoContainer");

// Check if token is saved in cookies
let savedToken = getCookie("token");
if (savedToken) {
  displayUser();
  userpageForms.style.display = "none";
} else {
  userInfoContainer.style.display = "none";
  logInForm.style.display = "flex";
  regForm.style.display = "none";
  logSwitch.style.backgroundColor = "#f54848";
}

regSwitch.addEventListener("click", () => {
  regForm.style.display = "flex";
  logInForm.style.display = "none";
  regSwitch.style.backgroundColor = "#f54848";
  logSwitch.style.backgroundColor = "#5f5f5f";
});

logSwitch.addEventListener("click", () => {
  regForm.style.display = "none";
  logInForm.style.display = "flex";
  logSwitch.style.backgroundColor = "#f54848";
  regSwitch.style.backgroundColor = "#5f5f5f";
});

regForm.addEventListener("submit", function (e) {
  e.preventDefault();
  let phoneNumber = document.querySelector("#phoneReg").value;
  let password = document.querySelector("#passwordReg").value;
  let email = document.querySelector("#emailReg").value || "randomMail";
  let firstName =
    document.querySelector("#firstNameReg").value || "randomFirstName";
  let lastName =
    document.querySelector("#lastNameReg").value || "randomLastName";
  let role = "user";

  // Input validation
  if (!phoneNumber || !password) {
    Swal.fire({
      text: "გთხოვთ, შეიყვანოთ ყველა საჭირო მონაცემი.",
      icon: "warning",
    });
    return;
  }

  fetch("https://rentcar.stepprojects.ge/api/Users/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      phoneNumber,
      password,
      email,
      firstName,
      lastName,
      role,
    }),
  })
    .then((resp) => resp.text())
    .then((data) => {
      if (data === "User already exists") {
        Swal.fire({
          text: "მომხმარებელი უკვე რეგისტრირებულია.",
          icon: "warning",
        });
        document.querySelector("#phoneReg").value = "";
        document.querySelector("#passwordReg").value = "";
      } else {
        Swal.fire({
          text: "რეგისტრაცია წარმატებულია",
          icon: "success",
        });
        regForm.reset();
        logSwitch.click();
      }
    })
    .catch((err) => console.error("Registration error:", err));
});

logInForm.addEventListener("submit", function (e) {
  e.preventDefault();
  let phoneNumber = document.querySelector("#phoneLogIn").value;
  let password = document.querySelector("#passwordLogIn").value;

  // Input validation
  if (!phoneNumber || !password) {
    Swal.fire({
      text: "გთხოვთ, შეიყვანოთ ყველა საჭირო მონაცემი.",
      icon: "warning",
    });
    return;
  }

  fetch("https://rentcar.stepprojects.ge/api/Users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phoneNumber, password }),
  })
    .then((resp) => {
      if (!resp.ok) {
        Swal.fire({
          text: "შეამოწმეთ შეყვანილი მონაცემები.",
          icon: "warning",
        });
      }
      return resp.json();
    })
    .then((data) => {
      if (data.token) {
        // Set token in cookies
        let storageDays = saveLogIn.checked ? 3 : 0; // Store for 3 days if "Remember Me" is checked, session-only if unchecked
        setCookie("token", data.token, storageDays);

        Swal.fire({
          text: "თქვენ წარმატებით შეხვიდით მომხმარებლის გვერდზე!",
          icon: "success",
        });
        displayUser();
        console.log(data);
      }
    })
    .catch((err) => console.error("Login error:", err));
});

function displayUser() {
  userpageForms.style.display = "none";
  userInfoContainer.style.display = "flex";
  userInfoContainer.innerHTML = `<h3>თქვენ არ გაქვთ შეძენილი ბილეთები.</h3> <button id="logout">გამოსვლა</button>`;
  document.querySelector("#logout").addEventListener("click", logout);
}

function logout() {
  // Delete token cookie on logout
  deleteCookie("token");
  Swal.fire({
    text: "თქვენ გამოხვედით სისტემიდან!",
    icon: "warning",
  });
  userInfoContainer.style.display = "none";
  userpageForms.style.display = "flex";
  logInForm.style.display = "flex";
  regForm.style.display = "none";
}

// Function to set a cookie
function setCookie(name, value, days) {
  let expires = "";
  if (days > 0) {
    let date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + value + "; path=/" + expires;
}

// Function to get a cookie by name
function getCookie(name) {
  let cookies = document.cookie.split("; ");
  for (let cookie of cookies) {
    let [cookieName, cookieValue] = cookie.split("=");
    if (cookieName === name) return cookieValue;
  }
  return null;
}

// Function to delete a cookie
function deleteCookie(name) {
  document.cookie = name + "=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
}
