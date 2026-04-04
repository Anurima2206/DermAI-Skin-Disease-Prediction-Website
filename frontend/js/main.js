/* =========================
   MOBILE NAVBAR
========================= */

const toggle = document.getElementById("menu-toggle")
const navLinks = document.getElementById("nav-links")

if(toggle){

toggle.addEventListener("click",()=>{

navLinks.classList.toggle("active")

})

}


/* =========================
   HERO SLIDER
========================= */

/* HERO SLIDER */

const slides = document.querySelectorAll(".slide")
const dots = document.querySelectorAll(".dot")
const slider = document.querySelector(".hero-slider")

let currentSlide = 0

function showSlide(index){

slides.forEach((slide,i)=>{
slide.classList.toggle("active", i === index)
})

dots.forEach((dot,i)=>{
dot.classList.toggle("active", i === index)
})

currentSlide = index
}

/* auto slide */

setInterval(()=>{

let next = (currentSlide + 1) % slides.length
showSlide(next)

},5000)

/* click anywhere on hero to change slide */

slider.addEventListener("click",()=>{

let next = (currentSlide + 1) % slides.length
showSlide(next)

})

/* dots click */

dots.forEach((dot,index)=>{

dot.addEventListener("click",(e)=>{

e.stopPropagation()
showSlide(index)

})

})


/* =========================
   FAQ ACCORDION
========================= */

const questions = document.querySelectorAll(".faq-question")

questions.forEach(q=>{

q.addEventListener("click",()=>{

const answer = q.nextElementSibling

answer.style.display =
answer.style.display === "block" ? "none" : "block"

})

})


/* =========================
   PIE CHART (LIVE)
========================= */

const pieCanvas = document.getElementById("usagePie")

let pieChart

if(pieCanvas){

pieChart = new Chart(pieCanvas,{

type:"pie",

data:{
labels:["ML","Eczema","Psoriasis","Other"],

datasets:[{
data:[45,25,20,10],

backgroundColor:[
"#ff6384",
"#36a2eb",
"#ffcd56",
"#9966ff"
]

}]
},

options:{
responsive:true,
maintainAspectRatio:false
}

})

}


/* =========================
   BAR CHART (LIVE)
========================= */

const barCanvas = document.getElementById("usageBar")

let barChart

if(barCanvas){

barChart = new Chart(barCanvas,{

type:"bar",

data:{
labels:["2022","2023","2024","2025","2026"],

datasets:[{

label:"Predictions Made",

data:[120,340,820,2100,4200],

backgroundColor:[
"#ff6384",
"#36a2eb",
"#ffcd56",
"#4bc0c0",
"#9966ff"
]

}]
},

options:{
responsive:true,
maintainAspectRatio:false,
scales:{
y:{
beginAtZero:true
}
}
}

})

}


/* =========================
   LIVE DATA UPDATE
========================= */

setInterval(()=>{

/* update pie chart */

if(pieChart){

pieChart.data.datasets[0].data = [

Math.floor(Math.random()*50)+10,
Math.floor(Math.random()*40)+10,
Math.floor(Math.random()*30)+5,
Math.floor(Math.random()*20)+5

]

pieChart.update()

}


/* update bar chart */

if(barChart){

barChart.data.datasets[0].data = barChart.data.datasets[0].data.map(()=>{

return Math.floor(Math.random()*5000)+200

})

barChart.update()

}

},1500)