const token = localStorage.getItem("token")

async function loadHistory(){

try{

const res = await fetch(
"https://skin-disease-prediction-website-1-nsua.onrender.com/api/v1/predict/predicthistory",
{
headers:{
Authorization:`Bearer ${token}`
}
})

const data = await res.json()

const table = document.getElementById("historyTable")

if(data.length === 0){

document.getElementById("noHistory").innerText =
"No prediction history found"

return

}

data.forEach(item=>{

const row = document.createElement("tr")
const imagePath = item.image.replace(/\\/g,'/').replace("uploads/","")
row.innerHTML = `

<td>${new Date(item.createdAt).toLocaleDateString()}</td>

<td>
<img src="https://skin-disease-prediction-website-1-nsua.onrender.com/uploads/${imagePath}" width="60"/>
</td>

<td>${item.disease}</td>

<td>${(item.confidence*100).toFixed(1)}%</td>

<td>
<a class="report-btn"
href="https://skin-disease-prediction-website-1-nsua.onrender.com/api/v1/predict/pdf/${item._id}"
target="_blank">
Download
</a>
</td>

`

table.appendChild(row)
})
}catch(err){
console.log(err)
}
}

loadHistory()