// LOGOUT

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "login.html";
});


// FAQ ACCORDION

document.querySelectorAll(".faq-question").forEach(q => {
  q.addEventListener("click", () => {
    q.parentElement.classList.toggle("active");
  });
});

// SHOW USER NAME

const userName = localStorage.getItem("userName");

if(userName){

document.getElementById("welcomeText").innerText =
"Welcome Back, " + userName + "!";

}

// PIE CHART DATA

let diseaseData = [35, 30, 20, 10];

const pieChart = new Chart(
  document.getElementById("pieChart"),
  {
    type: "pie",
    data: {
      labels: ["Eczema", "Psoriasis", "Melanoma", "Other"],
      datasets: [
        {
          data: diseaseData,
          backgroundColor: [
            "#1fa2a6",
            "#f6bd60",
            "#ff6384",
            "#84a59d"
          ]
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true
    }
  }
);



// BAR CHART DATA

let monthlyData = [3, 5, 2, 6, 3, 6];

const barChart = new Chart(
  document.getElementById("barChart"),
  {
    type: "bar",
    data: {
      labels: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
      datasets: [
        {
          label: "Predictions",
          data: monthlyData,
          backgroundColor: [
            "#1fa2a6",
            "#f6bd60",
            "#ff6384",
            "#84a59d",
            "#4cc9f0",
            "#c77dff"
          ],
          borderRadius: 0
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  }
);



// LIVE SMOOTH UPDATE

setInterval(() => {

  // PIE CHART SMALL CHANGES
  diseaseData = diseaseData.map(v => {
    let change = Math.floor(Math.random() * 3) - 1;
    let newVal = v + change;
    return Math.max(5, newVal);
  });


  // BAR CHART SMALL CHANGES
  monthlyData = monthlyData.map(v => {
    let change = Math.floor(Math.random() * 3) - 1;
    let newVal = v + change;
    return Math.max(2, newVal);
  });


  // UPDATE CHARTS
  pieChart.data.datasets[0].data = diseaseData;
  barChart.data.datasets[0].data = monthlyData;

  pieChart.update();
  barChart.update();

}, 1300);
