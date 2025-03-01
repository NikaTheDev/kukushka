// Redirect if trainId is missing
// let trainId = sessionStorage.getItem("selectedTrainId") || null;
let train = document.querySelector(".train")
let trainId = 37;

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
.then(resp => resp.json())
.then(train => showTrain(train))


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






// Function to show modal window and sort seats
// function showSeatsModal(vagonId) {
//   loadSeatsFromSession(); // Load saved seats when opening the modal
//   fetch(`https://railway.stepprojects.ge/api/getvagon/${vagonId}`)
//     .then((resp) => resp.json())
//     .then((vagonData) => {
//       let vagon = vagonData[0];
//       seatContainer.innerHTML = "";

//       // Sort seats by letter (A, B, C, D) and number (1, 2, 3, 4)
//       const sortedSeats = vagon.seats.sort((a, b) => {
//         const regex = /^(\d+)([A-Za-z])$/;
//         const [, numA, letterA] = a.number.match(regex);
//         const [, numB, letterB] = b.number.match(regex);

//         return letterA.localeCompare(letterB) || numA - numB;
//       });

//       sortedSeats.forEach((seat) => {
//         let seatBtn = document.createElement("button");
//         seatBtn.classList.add("seat", "flex-column");
//         seatBtn.innerHTML = `<p class="seatNumber">${seat.number}</p><p class="price">${seat.price}₾</p>`;
//         seatBtn.id = seat.seatId;

//         if (seat.isOccupied) {
//           seatBtn.classList.add("occupied");
//         }

//         if (selectedSeats.includes(seat.seatId)) {
//           seatBtn.classList.add("selected");
//         }

//         seatBtn.addEventListener("click", () => toggleSeatSelection(seatBtn));
//         seatContainer.appendChild(seatBtn);
//       });

//       seatModal.style.display = "flex";
//     })
//     .catch((error) => {
//       console.error("Error fetching vagon data:", error);
//     });
// }

// Toggle seat selection
// function toggleSeatSelection(seatBtn) {
//   let seatId = seatBtn.id;
//   let seatIndex = selectedSeats.indexOf(seatId);

//   if (seatIndex !== -1) {
//     selectedSeats.splice(seatIndex, 1);
//   } else {
//     selectedSeats.push(seatId);
//   }

//   seatBtn.classList.toggle("selected");
//   saveSeatsToSession(); // Save selected seats to sessionStorage
// }

// Choose button to show ticket details
// chooseBtn.addEventListener("click", () => {
//   if (selectedSeats.length === 0) {
//     Swal.fire({
//       text: "გთხოვთ, აირჩიოთ ბილეთი",
//       icon: "warning",
//     });
//     return;
//   }

//   ticketDetails.innerHTML = `
//     <p class="ticketItems">გამგზავრების ადგილი: <span>${departure.value}</span></p>
//     <p class="ticketItems">ჩასვლის ადგილი: <span>${arive.value}</span></p>
//     <p class="ticketItems">გამგზავრების თარიღი: <span>${departureDate.value}</span></p>
//     <p class="ticketItems">ადგილები: <span id="selectedSeatList"></span></p>
//     <p class="ticketItems">გადასახდელი ჯამში: <span id="totalPrice"></span>₾</p>
//   `;
//   updateTicketDetails();
//   seatModal.style.display = "none";
//   ticketModal.style.display = "flex";
// });

// function updateTicketDetails() {
//   let selectedSeatList = document.getElementById("selectedSeatList");
//   let totalPriceElement = document.getElementById("totalPrice");

//   selectedSeatList.innerHTML = "";
//   let totalPrice = 0;

//   selectedSeats.forEach((seatId) => {
//     let seat = document.getElementById(seatId);
//     let seatNumber = seat.querySelector(".seatNumber").textContent;
//     let seatPrice = parseFloat(seat.querySelector(".price").textContent.replace("₾", ""));
//     totalPrice += seatPrice;

//     let seatBtn = document.createElement("button");
//     seatBtn.textContent = seatNumber;
//     seatBtn.classList.add("seat-remove");
//     seatBtn.addEventListener("click", () => removeSeat(seatId));

//     selectedSeatList.appendChild(seatBtn);
//   });

//   totalPriceElement.textContent = totalPrice;
// }

// function removeSeat(seatId) {
//   let seatIndex = selectedSeats.indexOf(seatId);
//   if (seatIndex !== -1) {
//     selectedSeats.splice(seatIndex, 1);
//     document.getElementById(seatId).classList.remove("selected"); // Unselect seat
//     updateTicketDetails(); // Refresh seat list and price
//   }
// }

// Buy button click
// document.getElementById("buyBtn").addEventListener("click", () => {
//   ticketModal.style.display = "none";
// });

// Close buttons for modals
// document.querySelectorAll(".closeBtn").forEach((button) => {
//   button.addEventListener("click", () => {
//     seatModal.style.display = "none";
//     ticketModal.style.display = "none";
//   });
// });
