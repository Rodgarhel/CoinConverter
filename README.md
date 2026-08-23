# 💱 Conversor de Monedas Nacional

**GitHub Pages:**  
https://rodgarhel.github.io/CoinConverter/

Aplicación web de conversión de monedas desarrollada con **HTML, CSS y JavaScript**, utilizando la API pública de [Mindicador](https://mindicador.cl/api/) para obtener valores actualizados de diferentes indicadores económicos de Chile.

La aplicación permite ingresar un monto en pesos chilenos (CLP), seleccionar una moneda y obtener su conversión. Además, muestra un gráfico con la variación histórica del valor de la moneda seleccionada.

---

## 🚀 Funcionalidades

- Ingresar un monto en pesos chilenos (CLP).
- Seleccionar una moneda desde un `<select>` generado automáticamente.
- Obtener los indicadores disponibles directamente desde una API.
- Convertir CLP a la moneda seleccionada.
- Consultar datos históricos de la moneda seleccionada.
- Mostrar un gráfico con la variación de los últimos valores disponibles.
- Manejar errores cuando la API no está disponible.
- Diseño adaptable a diferentes tamaños de pantalla.

---

## 🛠️ Tecnologías utilizadas

- **HTML5**
- **CSS3**
- **JavaScript**
- **Fetch API**
- **Async / Await**
- **Chart.js**
- **Mindicador API**

---

## 🔌 API utilizada

El proyecto utiliza la API pública de **Mindicador**:

https://mindicador.cl/api/

Esta API proporciona información sobre diferentes indicadores económicos de Chile, entre ellos:

- Dólar
- Euro
- UF
- UTM
- IPC
- Entre otros

En este proyecto se utilizan los indicadores que contienen la propiedad `valor`.

---

## 📂 Estructura del proyecto

```text
Desafio_04_Arrays/
│
├── index.html
├── README.md
│
└── assets/
    ├── index.js
    └── style.css
````

---

## ⚙️ Funcionamiento

### 1. Conexión con la API

La aplicación comienza realizando una petición a la API mediante `fetch()`:

```javascript
const API = "https://mindicador.cl/api/";

const res = await fetch(API);
```

Luego se comprueba si la respuesta fue correcta:

```javascript
if (!res.ok) {
    throw new Error("No Data");
}
```

Finalmente, los datos se convierten desde JSON a un objeto JavaScript:

```javascript
coinData = await res.json();
```

Los datos se almacenan en una variable externa para poder utilizarlos posteriormente en otras funciones.

---

## 📋 Creación automática del `<select>`

Una de las características principales del proyecto es que las opciones del `<select>` no están escritas manualmente en HTML.

Los indicadores se obtienen directamente desde la API.

Primero se utiliza `Object.entries()`:

```javascript
const coinObj = Object.entries(coinData);
```

Esto permite obtener tanto la clave como el valor de cada propiedad:

```javascript
for (const [key, coin] of coinObj) {
```
Luego se filtran los objetos que contienen la propiedad `valor`:

```javascript
if (
    typeof coin === "object" &&
    Object.hasOwn(coin, "valor")
) {
```

De esta manera se ignoran propiedades de la API que no corresponden a indicadores.

Finalmente, se crea cada opción dinámicamente:

```javascript
const option = document.createElement("option");

option.value = key;
option.textContent = coin.nombre;

select.appendChild(option);
```

Esto permite que el `<select>` se actualice automáticamente según los datos disponibles en la API.

---

## 🧮 Conversión de moneda

Cuando el usuario presiona el botón **Buscar**, la aplicación obtiene el monto ingresado:

```javascript
const CLPinput = Number(CLPamount.value);
```

Luego obtiene la moneda seleccionada:

```javascript
const selectedCoin = select.value;
```

Como el valor del `<option>` corresponde a la clave utilizada por la API, podemos acceder directamente al indicador seleccionado:

```javascript
const exchangeRate = coinData[selectedCoin].valor;
```

Finalmente se realiza la conversión:

```javascript
const mathResult = (CLPinput / exchangeRate).toFixed(2);
```

---

## 📈 Gráfico histórico

Además de realizar la conversión, la aplicación obtiene información histórica de la moneda seleccionada.

Para esto se utiliza nuevamente la API, pero agregando el identificador de la moneda:

```javascript
const res = await fetch(`${API}${selectedCoin}`);
```

Por ejemplo, si el usuario selecciona dólar, la URL será:

```text
https://mindicador.cl/api/dolar
```

La respuesta contiene una propiedad llamada `serie`, que almacena los valores históricos.

Se obtienen los últimos 10 registros:

```javascript
const last10 = data.serie.slice(0, 10);
```

Luego se utilizan `map()` para obtener las fechas:

```javascript
const labels = last10.map(item => {
    return new Date(item.fecha).toLocaleDateString("es-CL");
});
```

Y los valores:

```javascript
const values = last10.map(item => item.valor);
```

Finalmente, estos datos se utilizan con **Chart.js** para generar un gráfico de líneas:

---

## 🔄 Actualización del gráfico

Cada vez que el usuario selecciona una moneda y presiona el botón **Buscar**, se ejecutan dos funciones:

```javascript
math();
getChartData();
```

La primera realiza la conversión:

```text
CLP → Moneda seleccionada
```

Mientras que la segunda obtiene los datos históricos y actualiza el gráfico.

Antes de crear un nuevo gráfico, se comprueba si ya existe uno asociado al `<canvas>`:

```javascript
const existingChart = Chart.getChart(graph);

if (existingChart) {
    existingChart.destroy();
}
```

Esto evita el error:

```text
Canvas is already in use
```

y permite reutilizar el mismo `<canvas>` para mostrar diferentes monedas.

---

## 🔄 Flujo de la aplicación

```text
              API Mindicador
                    │
                    ▼
              Obtener datos
                    │
                    ▼
             Object.entries()
                    │
                    ▼
       Filtrar objetos con "valor"
                    │
                    ▼
        Crear opciones del <select>
                    │
                    ▼
            Usuario selecciona
                una moneda
                    │
                    ▼
             Presiona "Buscar"
                    │
          ┌─────────┴─────────┐
          ▼                   ▼
      math()             getChartData()
          │                   │
          ▼                   ▼
     Obtener valor       Obtener historial
     de la moneda              │
          │                    ▼
          ▼                 Chart.js
     Conversión                │
          │                    ▼
          ▼                Gráfico
      Resultado
```

---

## 🧠 Conceptos de JavaScript practicados

Este proyecto fue desarrollado como ejercicio práctico para trabajar los siguientes conceptos:

* Variables y constantes.
* Manipulación del DOM.
* `querySelector()`.
* `addEventListener()`.
* Eventos `click` y `change`.
* `fetch()`.
* Promesas.
* `async / await`.
* Manejo de errores con `try / catch`.
* Objetos.
* Arrays.
* `Object.entries()`.
* `Object.hasOwn()`.
* Destructuring.
* `map()`.
* `slice()`.
* Template literals.
* Conversión de strings a números con `Number()`.
* Creación dinámica de elementos con `createElement()`.
* Manipulación de `innerHTML`.
* Consumo de APIs externas.
* Uso de datos obtenidos desde una API.
* Visualización de datos mediante Chart.js.

---

## 🎯 Objetivo del proyecto

El objetivo principal de este proyecto es practicar el consumo de una API externa utilizando JavaScript y utilizar los datos obtenidos para generar contenido dinámicamente en la interfaz.

El proyecto también busca reforzar el trabajo con:

* Arrays y objetos.
* Manipulación del DOM.
* Eventos.
* Funciones.
* Datos dinámicos.
* APIs.
* Visualización de información.

Una de las características importantes del ejercicio es que las opciones del conversor **no están escritas manualmente**, sino que se generan automáticamente a partir de la información proporcionada por la API.

---

## 🌐 Demo

Puedes probar la aplicación directamente desde GitHub Pages:

**[https://rodgarhel.github.io/Desafio_04_Arrays/](https://rodgarhel.github.io/Desafio_04_Arrays/)**

---

## 👨‍💻 Autor

**Rodrigo García**

Proyecto desarrollado como ejercicio práctico de JavaScript, manipulación del DOM y consumo de APIs.

```
```
