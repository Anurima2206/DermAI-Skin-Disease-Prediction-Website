const form = document.getElementById("loginForm")

form.addEventListener("submit", async(e)=>{

e.preventDefault()

const email = document.getElementById("email").value
const password = document.getElementById("password").value

try{

const res = await fetch("http://localhost:8080/api/v1/auth/login",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
email,
password
})

})

const data = await res.json()
console.log(data);

if(data.success){

localStorage.setItem("token",data.token)
localStorage.setItem("userName", data.user.username);

window.location.href="dashboard.html"

}
else{

alert(data.message)

}

}catch(err){

alert("Server error")

}

})
