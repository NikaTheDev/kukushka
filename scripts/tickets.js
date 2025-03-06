// let trainId = sessionStorage.getItem("selectedTrainId") || null;
let train = document.querySelector(".train");
let vagons = document.querySelector(".vagons");
let seatContainer = document.getElementById("seatContainer");

let trainId = 15;
let selectedSeats = [];

if (!trainId) {
  Swal.fire({
    text: "მატარებელი ვერ მოიძებნა. მთავარ გვერდზე დაბრუნება.",
    icon: "warning",
  }).then(() => {
    setTimeout(() => {
      window.location.href = "../index.html";
    }, 100);
  });

  throw new Error("No train ID found. Redirecting to index.");
}

fetch(`https://railway.stepprojects.ge/api/trains/${trainId}`)
  .then((resp) => resp.json())
  .then((train) => {
    showTrain(train);
    showVagons(train.vagons);
  });

function showTrain(obj) {
  train.innerHTML = "";
  train.innerHTML += `<div class="trainsListItem flex-row">
                  <div class="travelInfo flex-row">
                    <div class="from flex-column">
                      <p class="station">${obj.from}</p>
                      <p class="date">${obj.date}</p>
                      <p class="time">${obj.departure}</p>
                    </div>
      
                    <span class="line"></span>
                    <div class="trainInfo flex-column">
                      <p><img src="../assets/icons/favicon.svg" alt="" /></p>
                      <p class="trainNumber">${obj.number}</p>
                    </div>
                    <span class="line"></span>
      
                    <div class="to flex-column">
                      <p class="station">${obj.to}</p>
                      <p class="date">${obj.date}</p>
                      <p class="time">${obj.arrive}</p>
                    </div>
                  </div>
                </div>`;
}

function showVagons(data) {
  vagons.innerHTML = "";

  data.forEach((vagon) => {
    let vagonBtn = document.createElement("button");
    vagonBtn.classList.add("vagonBtn");
    vagonBtn.setAttribute("id", `${vagon.id}`);
    vagonBtn.textContent = vagon.name;
    vagons.append(vagonBtn);
    showSeats(vagon.id);
    vagonBtn.addEventListener("click", () => {
      showHideSeats(vagon.id);
    });
  });
}

function showSeats(id) {
  fetch(`https://railway.stepprojects.ge/api/getvagon/${id}`)
    .then((resp) => resp.json())
    .then((vagonData) => {
      let vagon = vagonData[0];

      let seatContainerId = document.createElement("div");
      seatContainerId.setAttribute("id", `vagon-${vagon.id}`);
      seatContainerId.classList.add("seatContainerId");
      seatContainer.append(seatContainerId);

      const sortedSeats = vagon.seats.sort((a, b) => {
        const regex = /^(\d+)([A-Za-z])$/;
        const [, numA, letterA] = a.number.match(regex);
        const [, numB, letterB] = b.number.match(regex);

        return letterA.localeCompare(letterB) || numA - numB;
      });

      sortedSeats.forEach((seat) => {
        let seatBtn = document.createElement("button");
        seatBtn.classList.add("seat", "flex-column");
        seatBtn.innerHTML = `
                <p class="seatNumber">${seat.number}</p>
                <p class="price">${seat.price}₾</p>`;
        seatBtn.dataset.seatId = seat.seatId;
        seatBtn.dataset.number = seat.number;
        seatBtn.dataset.price = seat.price;
        seatBtn.dataset.vagonId = seat.vagonId;
        seatBtn.dataset.isOccupied = seat.isOccupied;

        if (seat.isOccupied) {
          seatBtn.classList.add("occupied");
          seatBtn.setAttribute("disabled", "");
          seatBtn.title = "ადგილი დაკავებულია";
        }

        seatBtn.addEventListener("click", () => toggleSeatSelection(seatBtn));
        seatContainerId.appendChild(seatBtn);
      });
    });
}

function showHideSeats(id) {
  let vagonSeats = document.querySelector(`#vagon-${id}`);
  document.querySelectorAll(".seatContainerId").forEach((div) => {
    if (div !== vagonSeats) {
      div.style.display = "none";
    }
  });
  if (vagonSeats.style.display === "none" || vagonSeats.style.display === "") {
    vagonSeats.style.display = "grid";
  } else {
    vagonSeats.style.display = "none";
  }
}

function toggleSeatSelection(seatBtn) {
  let seatId = seatBtn.dataset.seatId;
  let seatIndex = selectedSeats.findIndex((seat) => seat.seatId === seatId);

  if (seatIndex === -1) {
    selectedSeats.push({
      seatId: seatBtn.dataset.seatId,
      number: seatBtn.dataset.number,
      price: seatBtn.dataset.price,
      vagonId: seatBtn.dataset.vagonId,
      isOccupied: seatBtn.dataset.isOccupied,
    });
    seatBtn.classList.add("selected");
  } else {
    selectedSeats.splice(seatIndex, 1);
    seatBtn.classList.remove("selected");
  }
  updateInvoice();
  updatePassengerInfo();
  console.log("Selected Seats:", selectedSeats);
}

function updateInvoice() {
  let invoiceSeatsList = document.querySelector(".invoiceSeatsList");
  invoiceSeatsList.innerHTML = "";

  selectedSeats.forEach((seat) => {
    console.log(seat);
    let seatRow = document.createElement("div");
    seatRow.classList.add("invoiceSeatRow", "flex-row");

    let vagonNumber = document.createElement("p");
    vagonNumber.classList.add("seatRowItem");
    vagonNumber.textContent = seat.vagonId;

    let seatNumber = document.createElement("p");
    seatNumber.classList.add("seatRowItem");
    seatNumber.textContent = seat.number;

    let seatPrice = document.createElement("p");
    seatPrice.classList.add("seatRowItem");
    seatPrice.textContent = `${seat.price}₾`;

    seatRow.appendChild(vagonNumber);
    seatRow.appendChild(seatNumber);
    seatRow.appendChild(seatPrice);

    invoiceSeatsList.appendChild(seatRow);
  });
  let totalPrice = selectedSeats.reduce(
    (acc, seat) => acc + parseFloat(seat.price),
    0
  );
  document.querySelector(".totalPriceItem").textContent = totalPrice;
}

function updatePassengerInfo() {
  let passengerContainer = document.querySelector(".passangerInfoList");

  selectedSeats.forEach((seat) => {
    let existingPassengerInfo = passengerContainer.querySelector(
      `#passanger-${seat.seatId}`
    );

    if (!existingPassengerInfo) {
      let passengerRow = document.createElement("div");
      passengerRow.classList.add("passangerInfo", "flex-row");
      passengerRow.setAttribute("id", `passanger-${seat.seatId}`);

      let seatDetails = document.createElement("div");
      seatDetails.classList.add("seatInfo", "flex-column");
      seatDetails.innerHTML = `<p class="seatNumber">${seat.number}</p>
     <p class="vagonId">${seat.vagonId}</p>`;

      let nameInput = document.createElement("input");
      nameInput.setAttribute("type", "text");
      nameInput.setAttribute("placeholder", "სახელი");
      nameInput.setAttribute("required", "");
      nameInput.setAttribute("id", `nameInput-${seat.seatId}`);

      let lastNameInput = document.createElement("input");
      lastNameInput.setAttribute("type", "text");
      lastNameInput.setAttribute("placeholder", "გვარი");
      lastNameInput.setAttribute("required", "");
      lastNameInput.setAttribute("id", `lastNameInput-${seat.seatId}`);

      let idNumberInput = document.createElement("input");
      idNumberInput.setAttribute("type", "text");
      idNumberInput.setAttribute("placeholder", "პირადი ნომერი");
      idNumberInput.setAttribute("required", "");
      idNumberInput.setAttribute("id", `idNumberInput-${seat.seatId}`);

      passengerRow.appendChild(seatDetails);
      passengerRow.appendChild(nameInput);
      passengerRow.appendChild(lastNameInput);
      passengerRow.appendChild(idNumberInput);

      passengerContainer.appendChild(passengerRow);
    }
  });

  let allPassengerRows = passengerContainer.querySelectorAll(".passangerInfo");
  allPassengerRows.forEach((row) => {
    console.log(row);
    let seatId = row.getAttribute("id").substring("passanger-".length);
    console.log(seatId);
    if (!selectedSeats.some((seat) => seat.seatId === seatId)) {
      row.remove();
    }
  });
}

document
  .querySelector("#passangersForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    let email = document.querySelector("#email").value;
    let phoneNumber = document.querySelector("#phone").value;
    let date = new Date().toISOString();

    let people = selectedSeats.map((seat) => {
      let passengerRow = document.querySelector(`#passanger-${seat.seatId}`);
      let name = passengerRow.querySelector(`#nameInput-${seat.seatId}`).value;
      let surname = passengerRow.querySelector(
        `#lastNameInput-${seat.seatId}`
      ).value;
      let idNumber = passengerRow.querySelector(
        `#idNumberInput-${seat.seatId}`
      ).value;

      return {
        seatId: seat.seatId,
        name: name,
        surname: surname,
        idNumber: idNumber,
        status: "string",
        payoutCompleted: true,
      };
    });

    let requestBody = {
      trainId: trainId,
      date: date,
      email: email,
      phoneNumber: phoneNumber,
      people: people,
    };

    sessionStorage.setItem("ticketData", JSON.stringify(requestBody));

    fetch("https://railway.stepprojects.ge/api/tickets/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.text())
      .then((text) => {
        let ticketNumber = text.split(":")[1];
        localStorage.setItem("ticketNumber", ticketNumber);
        window.location.href = "./transaction.html";
      })
      .catch((error) => {
        console.error("Error registering ticket:", error);
      });
  });
