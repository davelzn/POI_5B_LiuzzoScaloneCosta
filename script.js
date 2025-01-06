import { createNavigator } from './navigator.js';
import { carica, salva, list } from "./carica_salva.js";

//const navigator = createNavigator(document.querySelector('#container'));



const apriBtn = document.getElementById("apriBtn");
const apriLog = document.getElementById("apriLog");
const loginModal = document.getElementById("loginModal");
const luoghiModal = document.getElementById("luoghiModal")
const tableCont = document.getElementById('table-container');
// inizializzazione mappa
let zoom = 5;
let maxZoom = 19;
let map = L.map('map').setView([-27.3585804, 132.5606708], zoom);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: maxZoom,
  attribution:
    '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

//componente tabella 
const cTable = (parentElement, data) => {
  let html =
    '<table class="table"><tr><th>Indirizzo</th><th>Targhe</th><th>Date e Ora</th><th>Feriti</th><th>Morti</th></tr>';
  for (let i = 0; i < data.length; i++) {
    let luogo = data[i];
    html += `<tr><td>${luogo.indirizzo}</td><td>${luogo.targhe.join(
      ', '
    )}</td><td>${luogo.datetime[0]} ${luogo.datetime[1]}</td><td>${luogo.feriti
      }</td><td>${luogo.morti}</td></tr>`;
  }
  html += '</table>';
  parentElement.innerHTML = html;
};

let tokenMap,myToken;
fetch('./conf.json') // carica le variabili da conf.json
  .then((response) => {
    if (!response.ok) {
      console.log('Errore nel caricamento del file JSON');
    }
    return response.json();
  })
  .then((data) => {
    tokenMap = data.tokenMap;
    myToken=data.cacheToken;
    console.log(tokenMap);
    carica().then(() => {
      console.log(list);
      renderLuoghi();
      cTable(tableCont, list);
    });
  })
  .catch((error) => console.error('Errore:', error));

//Bottoni della modale
apriLog.onclick = () => {
  loginModal.style.display = "block";
}

apriBtn.onclick = () => {
   luoghiModal.style.display = 'block';
}
document.getElementById("chiudiBtn").onclick = () => {
   luoghiModal.style.display = 'none';
};
document.getElementById("submit").onclick = () => {
    SubmForm();
}

//funzione per inviare i dati del form
function SubmForm() {
  let indirizzo = document.getElementById('address').value;
  const esitoDiv = document.getElementById('esito');
  let indAU = indirizzo + ', Australia';
  let url = `https://us1.locationiq.com/v1/search?key=${tokenMap}&q=${encodeURIComponent(
    indAU
  )}&format=json`;
  if (!indirizzo || !datetime || !feriti || !morti) {
    esitoDiv.innerHTML = '<div class="alert alert-danger">Compila tutti i campi!</div>';
    return;
}
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.error === 'Unable to geocode') {
        esitoDiv.innerHTML =
          '<div class="alert alert-danger">Indirizzo non valido o inesistente!</div>';
      } else {
        let targhe = document.getElementById('targhe').value.split(',');
        let datetime = document.getElementById('datetime').value.split('T');
        let feriti = document.getElementById('feriti').value;
        let morti = document.getElementById('morti').value;
        const k = {
          indirizzo: indAU,
          targhe: targhe,
          datetime: datetime,
          feriti: feriti,
          morti: morti,
          lat : data[0].lat,
          lon: data[0].lon
        };
        console.log(list);
        list.push(k);
        console.log(list);
        salva().then(() => {
          renderLuoghi();
        });

        esitoDiv.innerHTML ='<div class="alert alert-success">Prenotazione aggiunta con successo!</div>';
        //reset dei campi
        document.getElementById('address').value = '';
        document.getElementById('targhe').value = '';
        document.getElementById('datetime').value = '';
        document.getElementById('feriti').value = '';
        document.getElementById('morti').value = '';
        // Chiudere la modale e rimuovere eventuali overlay
        document.getElementById('luoghiModal').style.display = 'none';
        document.body.classList.remove('modal-open'); // Rimuove la classe che mantiene l'overlay
        document.querySelector('.modal-backdrop').remove(); // Rimuove il backdrop oscuro

        cTable(tableCont, list);
      }
    })
    .catch((error) => {
      console.error("Errore durante il controllo dell'indirizzo:", error);
      esitoDiv.innerHTML =
        '<div class="alert alert-danger">Si è verificato un errore durante la verifica dell\'indirizzo!</div>';
    });
}



function renderLuoghi() {
    for (let i = 0; i < list.length; i++) {
      let luogo = list[i];
      const coords = [luogo.lat, luogo.lon];
      const marker = L.marker(coords).addTo(map);
      const popupContent = `
        <b>Indirizzo:</b> ${luogo.indirizzo}<br>
        <b>Targhe:</b> ${luogo.targhe.join(', ')}<br>
        <b>Data e Ora:</b> ${luogo.datetime[0]} ${
        luogo.datetime[1]
      }<br>
        <b>Feriti:</b> ${luogo.feriti}<br>
        <b>Morti:</b> ${luogo.morti}
      `;
      marker.bindPopup(popupContent).openPopup();
}
  }

  
  const filterBtn = document.getElementById('filtroBtn');
  const resetBtn = document.getElementById('resetBtn');
  
  filterBtn.onclick = () => {
    console.log('Funzione filtro');
    let ind1 = document.getElementById('filtro').value;
    console.log(ind1);
    let filteredList = list.filter((k) =>
      k.indirizzo.toLowerCase().includes(ind1.toLowerCase())
    );
    console.log(filteredList);
    cTable(tableCont, filteredList);
    document.getElementById('filtro').value = '';
  };
  resetBtn.onclick = () => {
    cTable(tableCont, list);
  };
const createLogin = () => {
  const inputName = document.querySelector("#user");
  const inputPassword = document.querySelector("#psw");
  const loginButton = document.querySelector("#loginBtn");
  const divPrivate = document.querySelector("#private");
  const divLogin = document.querySelector("#login");
  const esitoLog = document.getElementById("esitoLog");
  const userDiv = document.getElementById("userDiv");
  

  let isLogged = false;

  // Funzione login
  const login = (name, password) => {
    return new Promise((resolve, reject) => {
      fetch("http://ws.cipiaceinfo.it/credential/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "key": myToken
        },
        body: JSON.stringify({
          username: name,
          password: password
        })
      })
        .then(r => r.json())
        .then(r => {
          console.log(r)
          resolve(r.result);
        })
        .catch(reject);
    });
  };

  loginButton.onclick = () => {
    console.log(inputName.value, inputPassword.value)
    login(inputName.value, inputPassword.value).then(result => {
      if (result) {
        isLogged = true;
        console.log(isLogged)
        divPrivate.classList.remove("hidden");
        divPrivate.classList.add("visible");
        divLogin.classList.add("hidden");
        loginModal.style.display = "none";
        document.body.classList.remove('modal-open');
        document.querySelector('.modal-backdrop').remove();
        apriBtn.classList.remove("hidden");
        userDiv.innerHTML = inputName.value;
        userDiv.classList.remove("hidden");

      } else {
        esitoLog.innerHTML =
          '<div class="alert alert-danger">Credenziali Errate!</div>';
      }
    });
  };

  return {
    isLogged: () => isLogged
  };
};
createLogin();
