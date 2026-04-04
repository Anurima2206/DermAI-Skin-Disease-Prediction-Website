const token = localStorage.getItem("token")

async function loadDoctors(){

try{

const res = await fetch(
"https://skin-disease-prediction-website-1-nsua.onrender.com/api/v1/doctor/nearby",
{
headers:{
Authorization:`Bearer ${token}`
}
})

const data = await res.json()

const container = document.getElementById("doctorContainer")

if(!data.success || data.doctors.length === 0){

document.getElementById("noDoctor").innerText =
"No nearby doctors found within 5 km"

return

}
const doctorImages = [
 "assets/doctor1.jpg",
 "assets/doctor2.jpg",
]

data.doctors.forEach((doc,index)=>{

const card = document.createElement("div")
card.className = "doctor-card"

const femaleNames = ["Priyanka","Tanaya","Neha","Rituparna","Debolina"]

let image = "assets/doctor1.jpg"  // default male

if(femaleNames.some(name => doc.name.includes(name))){
  image = "assets/doctor2.jpg"
}
const distanceKm = (doc.distance / 1000).toFixed(1)
card.innerHTML = `
<img src="${image}" class="doctor-img">
<h3>${doc.name}</h3>

<p><strong>Hospital:</strong> ${doc.hospital}</p>

<p><strong>Location:</strong> ${doc.location.address}</p>

<p><strong>Phone:</strong> ${doc.phone}</p>

<p><strong>Distance:</strong> ${distanceKm} km away</p>

<a href="https://www.google.com/maps?q=${doc.latitude},${doc.longitude}" target="_blank">
View on Map
</a>

`

container.appendChild(card)

})

}catch(err){

console.log(err)

}

}

loadDoctors()