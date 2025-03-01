// Selectors
let searchForm = document.querySelector("#searchForm");
let departure = document.querySelector("#departure");
let arive = document.querySelector("#arive");
let departureDate = document.querySelector("#departureDate");
let trainsListSection = document.querySelector(".trainsList");

// Past days selection disabled in calendar
let today = new Date().toISOString().split("T")[0];
departureDate.setAttribute("min", today);

// Fetch train stations
function getStations() {
  fetch("https://railway.stepprojects.ge/api/stations")
    .then((resp) => resp.json())
    .then((stations) => {
      stations.forEach((station) => {
        let option1 = document.createElement("option");
        option1.value = station.name;
        option1.textContent = station.name;
        departure.appendChild(option1);

        let option2 = document.createElement("option");
        option2.value = station.name;
        option2.textContent = station.name;
        arive.appendChild(option2);
      });
    })
    .catch((error) => console.error("Error fetching stations:", error));
}

// Search and Fetch trains
function searchTrains() {
  let from = departure.value;
  let to = arive.value;
  let date = departureDate.value;

  if (!from || !to || !date) {
    Swal.fire({
      text: "გთხოვთ, შეავსოთ ყველა ველი",
      icon: "warning",
    });
    return;
  }

  if (from === to) {
    Swal.fire({
      text: "გთხოვთ, აირჩიოთ განსხვავებული სადგურები.",
      icon: "warning",
    });
    return;
  }

  fetch(
    `https://railway.stepprojects.ge/api/getdeparture?from=${from}&to=${to}&date=${date}`
  )
    .then((resp) => resp.json())
    .then((data) => {
      console.log("fetched trains:", data);
      displayTrains(data[0].trains);
    })
    .catch((error) => {
      console.error("Error fetching train data:", error);
      trainsListSection.innerHTML = `<h3 class="trainsListHeading">მატარებლის რეისი ვერ მოიძებნა</h3>`;
      Swal.fire({
        text: "მატარებლის რეისი ვერ მოიძებნა.",
        icon: "warning",
      });
    });
}

// Display trains in the trains list section
function displayTrains(arr) {
  trainsListSection.innerHTML = "";
  trainsListSection.innerHTML = `<h3 class="trainsListHeading">აირჩიე რეისი <span>${departure.value} - ${arive.value}ს</span> მიმართულებით </h3>`;

  arr.forEach((train) => {
    trainsListSection.innerHTML += `<div class="trainsListItem flex-row">
            <div class="travelInfo flex-row">
              <div class="from flex-column">
                <p class="station">${train.from}</p>
                <p class="date">${train.date}</p>
                <p class="time">${train.departure}</p>
              </div>

              <span class="line"></span>
              <div class="trainInfo flex-column">
                <p><img src="./assets/icons/favicon.svg" alt="" /></p>
                <p class="trainNumber">${train.number}</p>
              </div>
              <span class="line"></span>

              <div class="to flex-column">
                <p class="station">${train.to}</p>
                <p class="date">${train.date}</p>
                <p class="time">${train.arrive}</p>
              </div>
            </div>

            <div class="trainChoose flex-column">
              <button class="trainChooseBtn" value="${train.id}">
                არჩევა
              </button>

              <div class="features">
                <span class="trainName">STADLER</span>
                <span>|</span>
                <i class="fa-solid fa-mug-hot" title="ყავის აპარატი"></i>
                <i class="fa-solid fa-plug" title="დამტენი"></i>
                <i class="fa-solid fa-restroom" title="საპირფარეშო"></i>
                <i class="fa-solid fa-fan" title="კონდიცირება"></i>
              </div>
            </div>
          </div>`;
  });

  attachEventListeners();
}

// Event listeners for the vagon buttons
function attachEventListeners() {
  document.querySelectorAll(".trainChooseBtn").forEach((button) => {
    button.addEventListener("click", function () {
      let trainId = this.value;
      sessionStorage.setItem("selectedTrainId", trainId);
      window.location.href = "./pages/tickets.html";
    });
  });
}

// Search form submit event
searchForm.addEventListener("submit", function (e) {
  e.preventDefault();
  searchTrains();
});

getStations();

