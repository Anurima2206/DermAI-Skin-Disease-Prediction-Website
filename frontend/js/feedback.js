const token = localStorage.getItem("token")

const stars = document.querySelectorAll(".stars span")
const ratingInput = document.getElementById("rating")

let rating = 0


/* STAR SELECTION */

stars.forEach(star=>{

star.addEventListener("click",()=>{

rating = star.dataset.value

ratingInput.value = rating

stars.forEach(s=>s.classList.remove("active"))

for(let i=0;i<rating;i++){
stars[i].classList.add("active")
}

})

})


/* SUBMIT FEEDBACK */

document.getElementById("feedbackForm")
.addEventListener("submit", async(e)=>{

e.preventDefault()

const comment = document.getElementById("comment").value

if(rating == 0){

alert("Please select rating")
return

}

try{

const res = await fetch(
"http://localhost:8080/api/v1/feedback/submit",
{

method:"POST",

headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${token}`
},

body:JSON.stringify({
rating,
comment
})

})

const data = await res.json()

alert(data.message)

document.getElementById("feedbackForm").reset()

stars.forEach(s=>s.classList.remove("active"))

}catch(err){

alert("Feedback submission failed")

}

})