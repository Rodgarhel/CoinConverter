const form = document.querySelector("#formCoin")
const select = document.querySelector("#foreign")
const result = document.querySelector("#result")

async function getCoins() {
    const res =  await fetch(
       "https://mindicador.cl/api/" 
    );
    const data = await res.json();
    console.log(data);
}
getCoins()