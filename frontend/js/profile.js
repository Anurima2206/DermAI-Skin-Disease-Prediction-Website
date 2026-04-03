const token = localStorage.getItem("token")

/* LOAD USER INFO */

async function loadProfile(){

const res = await fetch(
"http://localhost:8080/api/v1/user/getuser",
{
headers:{
Authorization:`Bearer ${token}`
}
})

const data = await res.json()

if(data.success){

const user = data.user

document.getElementById("viewUsername").innerText = user?.username || "-"
document.getElementById("viewEmail").innerText = user?.email || "-"
document.getElementById("viewPhone").innerText = user?.phone || "-"
document.getElementById("viewLocation").innerText = user?.location.address || "-"

}

}

loadProfile()



/* UPDATE PROFILE */

/* UPDATE PROFILE */

const profileForm = document.getElementById("profileForm")

if(profileForm){

profileForm.addEventListener("submit", async (e) => {

e.preventDefault()

const username = document.getElementById("username").value
const phone = document.getElementById("phone").value
const location = document.getElementById("location").value

try{

const res = await fetch(
"http://localhost:8080/api/v1/user/updateuser",
{
method:"POST",
headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${token}`
},
body: JSON.stringify({
username,
phone,
location
})
})

const data = await res.json()

if(data.success){
alert(data.message)
loadProfile()   // refresh profile card
}else{
alert(data.message)
}

}catch(error){

console.log(error)

alert("Something went wrong while updating profile")

}

})

}



/* PASSWORD RESET */
const passwordForm = document.getElementById("passwordForm")

if(passwordForm){
passwordForm.addEventListener("submit", async(e)=>{

e.preventDefault()

const oldPassword = document.getElementById("oldPass").value
const newPassword = document.getElementById("newPass").value

const res = await fetch(
"http://localhost:8080/api/v1/user/updatepass",
{
method:"POST",
headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${token}`
},
body:JSON.stringify({
oldPassword,
newPassword
})
})

const data = await res.json()
alert(data.message)

})
}

/* MEDICAL HISTORY */

let medicalExists = false

async function loadMedical(){

const res = await fetch(
"http://localhost:8080/api/v1/medical/get",
{
headers:{
Authorization:`Bearer ${token}`
}
})

const data = await res.json()

/* backend sends: history */

if(data.success && data.history){

medicalExists = true

const m = data.history


/* READ ONLY MEDICAL DETAILS */

document.getElementById("viewAge").innerText = m.age || "-"
document.getElementById("viewGender").innerText = m.gender || "-"
document.getElementById("viewSkinType").innerText = m.skinType || "-"
document.getElementById("viewAllergies").innerText = m.allergies?.join(", ") || "-"
document.getElementById("viewSymptoms").innerText = m.symptoms?.join(", ") || "-"


/* FORM VALUES */



}

}
loadMedical()

/* SAVE / UPDATE MEDICAL HISTORY */
const medicalForm = document.getElementById("medicalForm")

if(medicalForm){
medicalForm.addEventListener("submit", async (e) => {

e.preventDefault()

const age = document.getElementById("age").value
const gender = document.getElementById("gender").value
const skinType = document.getElementById("skinType").value
const allergies = document.getElementById("allergies").value
const symptoms = document.getElementById("symptoms").value

const url = medicalExists
? "http://localhost:8080/api/v1/medical/update"
: "http://localhost:8080/api/v1/medical/create"

const method = medicalExists ? "PUT" : "POST"

try{

const res = await fetch(url,{
method: method,
headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${token}`
},
body: JSON.stringify({
age,
gender,
skinType,
allergies,
symptoms
})
})

const data = await res.json()

if(data.success){
alert(data.message)
medicalExists = true
loadMedical()
}else{
alert(data.message)
}

}catch(err){
alert("Something went wrong")
}

})

}


/* DELETE PROFILE */

async function deleteProfile(){

if(!confirm("Are you sure?")) return

const res = await fetch(
"http://localhost:8080/api/v1/user/deleteprofile",
{

method:"DELETE",

headers:{
Authorization:`Bearer ${token}`
}

})

const data = await res.json()

alert(data.message)

localStorage.removeItem("token")

window.location.href="login.html"

}