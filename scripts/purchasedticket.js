let ticketNumber = localStorage.getItem("ticketNumber");
let ticketContainer = document.querySelector("#ticketContainer");
let ticketConfirmMessage = document.querySelector(".ticketConfirmMessage");
let returnBtn = document.querySelector(".returnBtn");

if (!ticketNumber) {
  Swal.fire({
    text: "ბილეთი ვერ მოიძებნა. მთავარ გვერდზე დაბრუნება.",
    icon: "warning",
  }).then(() => {
    setTimeout(() => {
      window.location.href = "../index.html";
    }, 100);
  });
  ticketConfirmMessage.textContent = `ბილეთი ვერ მოიძებნა.`;
  throw new Error("Ticket not found. Redirecting to index.");
}

ticketConfirmMessage.textContent = `ბილეთი დადასტურებულია.`;
console.log(ticketNumber);

fetch(`https://railway.stepprojects.ge/api/tickets/checkstatus/${ticketNumber}`)
  .then((resp) => resp.json())
  .then((data) => {
    console.log("Ticket Data:", data);
    generateTickets(data);
  })
  .catch((error) => {
    console.error("Error fetching ticket:", error);
  });

function generateTickets(ticketData) {
  if (!ticketData || !ticketData.train || !ticketData.persons.length) return;
  ticketContainer.innerHTML = "";

  ticketData.persons.forEach((person) => {
    let ticketHTML = `
        <div class="ticket flex-column">
          <div class="mainTicket flex-column">
            <p class="ticketHeader flex-column">Kukushka Express</p>
  
            <div class="infoTicketPassanger flex-column">
              <p class="infoTicketHeadings">passenger</p>
              <p class="infoTickettext">${person.name} ${person.surname}</p>
            </div>
  
            <div class="flex-row ticketStations">
              <div class="infoTicketFrom flex-column">
                <p class="infoTicketHeadings">departure</p>
                <p class="infoTickettext">${ticketData.train.from}</p>
              </div>
              <div class="infoTicketTo flex-column">
                <p class="infoTicketHeadings">arrival</p>
                <p class="infoTickettext">${ticketData.train.to}</p>
              </div>
            </div>
  
            <div class="infoTicketDate flex-column">
              <p class="infoTicketHeadings">date</p>
              <p class="infoTickettext">${ticketData.date}</p>
            </div>
  
            <div class="flex-row ticketTimes">
              <div class="infoTicketTimeFrom flex-column">
                <p class="infoTicketHeadings">depart time</p>
                <p class="infoTickettext">${ticketData.train.departure}</p>
              </div>
              <div class="infoTicketTimeTo flex-column">
                <p class="infoTicketHeadings">arrive time</p>
                <p class="infoTickettext">${ticketData.train.arrive}</p>
              </div>
            </div>
  
            <div class="mainTicketInfo flex-row">
              <div class="mainTicketSeat flex-column">
                <p class="mainTicketNumber">${person.seat.number}</p>
                <p class="mainTicketText">ადგილი</p>
              </div>
              <div class="mainTicketVagon flex-column">
                <p class="mainTicketNumber">${person.seat.vagonId}</p>
                <p class="mainTicketText">ვაგონი</p>
              </div>
              <div class="mainTicketTrain flex-column">
                <p class="mainTicketNumber">${ticketData.train.number}</p>
                <p class="mainTicketText">მატარებელი</p>
              </div>
            </div>
          </div>
  
          <div class="ticketFooter flex-column">
            <p class="ticketFooterText">
              მარტივად მოძებნე და შეიძინე ბილეთები სასურველი მიმართულებით
              მთელი საქართველოს მასშტაბით
            </p>
  
            <div class="ticketContacts flex-row">
              <span>
                <i class="fa-solid fa-phone"></i>
                #000</span>
              <span>
                <i class="fa-solid fa-envelope"></i>
                support@tre.ge</span>
              <span>
                <i class="fa-brands fa-facebook"></i>
                TRE.Tickets</span>
            </div>
  
            <div class="ticketBarcode flex-column">
              <div class="barcode"></div>
              <p class="barcodeText">${ticketData.id}</p>
            </div>
          </div>
        </div>`;

    ticketContainer.innerHTML += ticketHTML;
  });
}

function moveLocalStorageItem(key1, key2) {
  let value = localStorage.getItem(key1);
  let array = JSON.parse(localStorage.getItem(key2)) || [];

  if (value !== null) {
    array.push(value);
    localStorage.setItem(key2, JSON.stringify(array));
    localStorage.removeItem(key1);
  } else {
    console.log(`No data found for "${key1}".`);
  }
}

returnBtn.addEventListener("click", (e) => {
  e.preventDefault();
  moveLocalStorageItem("ticketNumber", "savedTicketNumberArray");
  window.location.href = "../index.html";
});
