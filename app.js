// Selectors
let searchForm = document.querySelector("#searchForm");
let departure = document.querySelector("#departure");
let arive = document.querySelector("#arive");
let departureDate = document.querySelector("#departureDate");
let trainsListSection = document.querySelector(".trainsList");


// Fetch stations
function getStations() {
  fetch("https://railway.stepprojects.ge/api/stations")
    .then((resp) => resp.json())
    .then((stations) => {
      stations.forEach((station) => {
        let option1 = document.createElement("option");
        option1.value = station.id;
        option1.textContent = station.name;
        departure.appendChild(option1);

        let option2 = document.createElement("option");
        option2.value = station.id;
        option2.textContent = station.name;
        arive.appendChild(option2);
      });
    })
    .catch((error) => console.error("Error fetching stations:", error));
}


// Fetch and display trains
function searchTrains() {
  let from = departure.options[departure.selectedIndex].text;
  let to = arive.options[arive.selectedIndex].text;
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
    .then((data) => displayTrains(data[0].trains))
    .catch((error) => {
      console.error("Error fetching train data:", error);
      let trainsListSection = document.querySelector(".trainsList");
      trainsListSection.innerHTML = `<h3 class="trainsListHeading">მატარებლის რეისი ვერ მოიძებნა</h3>`;
      Swal.fire({
        text: "მატარებლის რეისი ვერ მოიძებნა.",
        icon: "warning",
      });
    });
}


function displayTrains(arr) {
  trainsListSection.innerHTML = "";

  if (!arr || arr.length === 0) {
    trainsListSection.innerHTML = `<h3 class="trainsListHeading">
            მატარებლის რეისი ვერ მოიძებნა
          </h3>`;
    return;
  }

  trainsListSection.innerHTML = `<h3 class="trainsListHeading">
            აირჩიე გასვლა <span>${
              departure.options[departure.selectedIndex].text
            } - ${arive.options[arive.selectedIndex].text}ს</span> მიმართულებით
          </h3>`;

  arr.forEach((train) => {
    trainsListSection.innerHTML += `
          <div class="trainsListItem flex-row">
            <div class="travelInfo flex-row">

              <div class="from flex-column">
                <p class="station">${train.from}</p>
                <p class="date">${departureDate.value}</p>
                <p class="time">${train.departure}</p>
              </div>

              <div class="trainInfo flex-column">
                <p>
                  <img src="./assets/icons/favicon.svg" alt="" />
                </p>
                <p class="trainNumber">${train.number}</p>
                <div class="features">
                  <i class="fa-solid fa-mug-hot" title="ყავის აპარატი"></i>
                  <i class="fa-solid fa-plug" title="დამტენი"></i>
                  <i class="fa-solid fa-restroom" title="საპირფარეშო"></i>
                  <i class="fa-solid fa-fan" title="კონდიცირება"></i>
                </div>
              </div>

              <div class="to flex-column">
                <p class="station">${train.to}</p>
                <p class="date">${departureDate.value}</p>
                <p class="time">${train.arrive}</p>
              </div>
              
            </div>

            <div class="vagonInfo flex-row">
              <button>${train.vagons[0].name}</button>
              <button>${train.vagons[1].name}</button>
              <button>${train.vagons[2].name}</button>
            </div>
            
          </div>`;
  });
}

async function showSeats() {
  await console.log("trains");
}



searchForm.addEventListener("submit", function (e) {
  e.preventDefault();
  searchTrains();
});

getStations();
