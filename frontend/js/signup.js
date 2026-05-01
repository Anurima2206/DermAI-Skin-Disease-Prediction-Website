const form = document.getElementById("signupForm")

form.addEventListener("submit", async(e)=>{

e.preventDefault()

const username = document.getElementById("username").value
const email = document.getElementById("email").value
const password = document.getElementById("password").value
const phone = document.getElementById("phone").value
const location = document.getElementById("location").value
const answer = document.getElementById("answer").value
const latitude = document.getElementById("latitude").value
const longitude = document.getElementById("longitude").value

try{

const res = await fetch("https://skin-disease-prediction-website-1-nsua.onrender.com/api/v1/auth/register",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

username,
email,
password,
phone,
location,
latitude,
longitude,
answer

})

})

const data = await res.json()

if(data.success){

alert("Registration Successful")

window.location.href="login.html"

}
else{

alert(data.message)

}

}catch(err){

alert("Server error")

}

})

function togglePassword(){

const passwordInput = document.getElementById("password")

if(passwordInput.type === "password"){
passwordInput.type = "text"
}else{
passwordInput.type = "password"
}

}

async function getCoordinates(address){

const response = await fetch(
`https://nominatim.openstreetmap.org/search?format=json&q=${address}`
)

const data = await response.json()

if(data.length > 0){

document.getElementById("latitude").value = data[0].lat
document.getElementById("longitude").value = data[0].lon

}else{

alert("Location not found")

}

}
document.getElementById("location")
.addEventListener("blur",function(){

getCoordinates(this.value)

})