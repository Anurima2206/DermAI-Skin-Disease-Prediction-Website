const token = localStorage.getItem("token")

async function loadHistory(){

try{

const res = await fetch(
"http://localhost:8080/api/v1/predict/predicthistory",
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
<img src="http://localhost:8080/uploads/${imagePath}" width="60"/>
</td>

<td>${item.disease}</td>

<td>${(item.confidence*100).toFixed(1)}%</td>

<td>
<a class="report-btn"
href="http://localhost:8080/api/v1/predict/pdf/${item._id}"
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