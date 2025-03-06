let ticketNumber = localStorage.getItem("ticketNumber");
let ticketDeleteBtn = document.querySelector(".ticketDelete");
console.log(ticketNumber);

if (!ticketNumber) {
  Swal.fire({
    text: "ბილეთი ვერ მოიძებნა. მთავარ გვერდზე დაბრუნება.",
    icon: "warning",
  }).then(() => {
    setTimeout(() => {
      window.location.href = "../index.html";
    }, 100);
  });

  throw new Error("Ticket not fount. Redirecting to index.");
}

let ticketNumberMessage = document.querySelector(".ticketNumberMessage");
ticketNumberMessage.textContent = ticketNumber;

fetch(`https://railway.stepprojects.ge/api/tickets/checkstatus/${ticketNumber}`)
.then(resp => resp.json())
.then(data => {
  console.log(data);
  let totalPayment = document.querySelector(".totalPayment");
  totalPayment.textContent = data.ticketPrice;
})
.catch(error => console.log("total price fetch error:", error))

function confirm() {
  fetch(`https://railway.stepprojects.ge/api/tickets/confirm/${ticketNumber}`)
  .then(resp => resp.json())
  .then(data => {
    console.log("confirm:", data);
    Swal.fire({
      text: "თქვენ შეიძინეთ ბილეთი. ბილეთის დეტალების ნახვა.",
      icon: "success",
    }).then(() => {
      setTimeout(() => {
        window.location.href = "./purchasedticket.html";
      }, 100);
    });
  })
  .catch((error) => {
    console.log(error);
    Swal.fire({
      text: "ბილეთის შეძენა ვერ მოხერხდა. გთხოვთ, სცადოთ თავიდან.",
      icon: "warning",
    })
  })
}

function ticketDelete () {
  fetch(`https://railway.stepprojects.ge/api/tickets/cancel/${ticketNumber}`, {
    method: "DELETE",
  })
    .then((response) => response.text())
    .then((text) => {
      console.log(text);
      Swal.fire({
        text: "ჯავშანი წარმატებით წაიშალა. მთავარ გვერდზე დაბრუნება.",
        icon: "success",
      }).then(() => {
        setTimeout(() => {
          window.location.href = "../index.html";
        }, 100);
      });
      localStorage.removeItem("ticketNumber"); 
    })
    .catch((error) => {
      console.log(error);
      Swal.fire({
        text: "ბილეთი ვერ წაიშალა. გთხოვთ, სცადოთ თავიდან.",
        icon: "warning",
      }).then(() => {
        setTimeout(() => {
          window.location.href = "../index.html";
        }, 100);
      });
    });
}

document.querySelector(".ticketDelete").addEventListener("click", () => {
  ticketDelete();
})



document.querySelector("#transactionForm").addEventListener("submit", (e) => {
  e.preventDefault();
  confirm();
})