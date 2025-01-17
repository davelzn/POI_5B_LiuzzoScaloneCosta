import { createNavigator } from './navigator.js';
import { carica, salva, list } from "./carica_salva.js";
import { cTable,cTableAdmin } from './tables.js';
import { createLogin } from './login.js';

const navigator = createNavigator(document.querySelector('#container'));

//https://postimg.cc/gallery/WFMGy6d
const apriBtn = document.getElementById("apriBtn");
const apriLog = document.getElementById("apriLog");
const loginModal = document.getElementById("loginModal");
const luoghiModal = document.getElementById("luoghiModal")
const tableCont = document.getElementById('table-container');
const tableContAd = document.getElementById("table-container-ad");
const homeBtn = document.getElementById("home-btn-ad");
const homeBtnSp = document.getElementById("home-btn-sp");
const titleModal = document.getElementById("modal-title");
const addPlaceBtn = document.getElementById("add-btn-ad");
const headerAd = document.getElementById("header-ad");

// inizializzazione mappa
let zoom = 4;
let maxZoom = 19;
let map = L.map('map').setView([-27.3585804, 132.5606708], zoom);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: maxZoom,
  attribution:
    '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);



let tokenMap, myToken;
fetch('./conf.json') // carica le variabili da conf.json
  .then((response) => {
    if (!response.ok) {
      console.log('Errore nel caricamento del file JSON');
    }
    return response.json();
  })
  .then((data) => {
    tokenMap = data.tokenMap;
    myToken = data.cacheToken;
    console.log(tokenMap);
    carica().then(() => {
      console.log(list);
      renderLuoghi();
      cTable(tableCont, list);
      cTableAdmin(tableContAd, list)
    });
  })
  .catch((error) => console.error('Errore:', error));







//funzione per inviare i dati del form
function SubmForm() {
  let nome = document.getElementById('name').value;
  let desc = document.getElementById('desc').value;
  let foto = document.getElementById('foto').value.split(',');
  let per = document.getElementById('per').value;
  let tipo = document.getElementById('tipo').value;
  let att = document.getElementById('att').value;
  let prz = document.getElementById('prz').value;
  let dur = document.getElementById('dur').value;
  let ff = document.getElementById('ff').value;
  let vic = document.getElementById('vic').value;
  let punt = document.getElementById('punt').value;

  const esitoDiv = document.getElementById('esito');

  if (!nome || !foto || !per || !tipo || !att || !prz || !dur || !ff || !vic || !punt) {
    esitoDiv.innerHTML = '<div class="alert alert-danger">Compila tutti i campi!</div>';
    return;
  }

  let indAU = nome + ', Australia';
  let url = `https://us1.locationiq.com/v1/search?key=${tokenMap}&q=${encodeURIComponent(indAU)}&format=json`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.error === 'Unable to geocode') {
        esitoDiv.innerHTML = '<div class="alert alert-danger">Nome non valido o inesistente!</div>';
      } else {
        let lat = data[0].lat;
        let lon = data[0].lon;

        const k = {
          id: uuid.v4(),  //genera un'id unicop
          nome: indAU,
          desc: desc,
          foto: foto,
          per: per,
          tipo: tipo,
          att: att,
          prz: prz,
          dur: dur,
          lat: lat,
          lon: lon,
          ff: ff,
          vic: vic,
          punt: punt
        };

        list.push(k);

        salva().then(() => {
          renderLuoghi();
        });

        esitoDiv.innerHTML = '<div class="alert alert-success">Prenotazione aggiunta con successo!</div>';

        //reset variabili
        document.getElementById('name').value = '';
        document.getElementById('desc').value = '';
        document.getElementById('foto').value = '';
        document.getElementById('per').value = '';
        document.getElementById('tipo').value = '';
        document.getElementById('att').value = '';
        document.getElementById('prz').value = '';
        document.getElementById('dur').value = '';
        document.getElementById('ff').value = '';
        document.getElementById('vic').value = '';
        document.getElementById('punt').value = '';

        //chiusura modale
        luoghiModal.style.display = 'none';
        document.body.classList.remove('modal-open');
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
          backdrop.remove();
        }
        cTable(tableCont, list);
        cTableAdmin(tableContAd,list);
      }
    })
    .catch(error => {
      console.error("Errore durante il controllo dell'nome:", error);
      esitoDiv.innerHTML = '<div class="alert alert-danger">Si è verificato un errore durante la verifica dell\'nome!</div>';
    });
}




function renderLuoghi() {
  for (let i = 0; i < list.length; i++) {
    let luogo = list[i];
    const coords = [luogo.lat, luogo.lon];
    const marker = L.marker(coords).addTo(map);
    const popupContent = `
        <b>Nome:</b> ${luogo.nome}<br>
        <b>Description:</b> ${luogo.desc}<br>
        <b>Type:</b> ${luogo.tipo}<br>
        <b>Main activities:</b> ${luogo.att}<br>
        <b>Best Season:</b> ${luogo.per}<br>
        <b>Recommended Duration:</b> ${luogo.dur}<br>
        <b>Family-Friendly:</b> ${luogo.ff}<br>
      `;
    marker.bindPopup(popupContent).openPopup();
  }
}

//GESTIONE BOTTONI
const filterBtn = document.getElementById('filter-btn');
const resetBtn = document.getElementById('reset-btn');

document.getElementById("submit").onclick = () => {
  SubmForm();
}

filterBtn.onclick = () => {
  console.log('Funzione filtro');
  let ind1 = document.getElementById('filtro').value;
  console.log(ind1);
  let filteredList = list.filter((k) =>
    k.nome.toLowerCase().includes(ind1.toLowerCase())
  );
  console.log(filteredList);
  cTable(tableCont, filteredList);
  document.getElementById('filtro').value = '';
};
resetBtn.onclick = () => {
  cTable(tableCont, list);
};

addPlaceBtn.onclick = () => {
  titleModal.innerHTML = "Add Place"
}

homeBtn.onclick = () => {
  window.location.hash = 'home';
}
homeBtnSp.onclick = () => {
  window.location.hash = 'home';
}

createLogin();