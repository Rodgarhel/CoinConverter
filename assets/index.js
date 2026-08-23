// URL
const API = "https://mindicador.cl/api/" ;

//  elements
const CLPamount = document.querySelector("#CLPinput")
const select = document.querySelector("#coinSelect")
const result = document.querySelector("#result")
const msj =document.querySelector("#msj")
const mathBtn = document.querySelector(".convertBtn")

const graphDiv =  document.querySelector(".boxGraph")
const graph = document.querySelector("#coinChart")

// Store API data so other functions can access it
let coinData;
let coinChart;

//--------------------
// fetch Indicators
//--------------------
async function fetchData() {
    try {
        msj.textContent = "Loading..."
        
        const res = await fetch(API);
    // capture Error
            if(!res.ok){
                throw new Error ("No Data")
            }
        coinData = await res.json();
        const coinObj =  Object.entries(coinData);

    //Function to build the list of coins automatically using the API data.
        for (const [key, coin] of coinObj) {
            if(typeof coin === "object" && Object.hasOwn(coin, "valor")) {
                const option = document.createElement("option");

                option.value = key;
                option.textContent = coin.nombre;
                select.appendChild(option);
            }
        }
        msj.textContent  =  ""  
    } catch  (error) {
        msj.textContent = "No existen datos"
        console.log(error);
    }
}


//---------------------
//    Calculator
//---------------------

function math() {
    if(!coinData) {return;}
    result.innerHTML = "";

    const CLPinput = Number(CLPamount.value);
    const selectedCoin = select.value; 
    const exchangeRate = coinData[selectedCoin].valor;
    
    //Math
        const mathResult = (CLPinput / exchangeRate).toFixed(2);
    
    result.innerHTML = `
    <h3>Resultado: $ ${mathResult}</h3>
    `
}
/*
mathBtn.addEventListener("click", (e) => {
    e.preventDefault();
    math();    
});
*/
//---------------------
// CHART
//---------------------

async function getChartData() {   
    const selectedCoin  = select.value;
    const res = await fetch(`${API}${selectedCoin}`);
        if (!res.ok) {
        throw new Error("No se pudo obtener el historial");
    }
    
    const data = await res.json();

    const last10 = data.serie.slice(0,10);
    const labels = last10.map(item => {
        return new Date(item.fecha).toLocaleDateString("es-CL");
    });

    const values = last10.map(item => item.valor)

    // Check if a chart already exists on this canvas
    const existingChart = Chart.getChart(graph);

    if (existingChart) {
        existingChart.destroy();
    }

    // Create new chart
    coinChart   = new Chart(graph, {
        type: "line",
        data: {
            // X axis
            labels: labels,
            // Y axis
            datasets: [{
                label: "Historial de los últimos 10 días",
                data: values
                
            }]
        },
        
    })
}

mathBtn.addEventListener("click", (e) => {
    e.preventDefault();

    math();
    getChartData();
});
//-------------
// On Start
//-------------
fetchData();
