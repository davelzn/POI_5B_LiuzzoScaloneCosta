import { createNavigator } from './navigator.js';
import { carica, salva, list } from "./carica_salva.js";

const navigator = createNavigator(document.querySelector('#container'));

//https://postimg.cc/gallery/QWHJ5L
const apriBtn = document.getElementById("apriBtn");
const apriLog = document.getElementById("apriLog");
const loginModal = document.getElementById("loginModal");
const luoghiModal = document.getElementById("luoghiModal")
const tableCont = document.getElementById('table-container');
//componente tabella 
const cTable = (parentElement, data) => {
  let html =
    '<table><thead><tr><th>Name</th><th>Description</th><th>Type</th><th>Average price</th><th>Best season</th><th>Recommended duration</th><th>Family-friendly</th><th>Score</th></tr></thead>';
  for (let i = 0; i < data.length; i++) {
    let luogo = data[i];
    html += `<tr><td>${luogo.nome}</td><td>${luogo.desc}</td><td>${luogo.tipo} ${luogo.att}</td><td>${luogo.per
      }</td><td>${luogo.tipo}</td></tr>`;
  }
  html += '</table>';
  parentElement.innerHTML = html;
};

// inizializzazione mappa
let zoom = 5;
let maxZoom = 19;
let map = L.map('map').setView([-27.3585804, 132.5606708], zoom);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: maxZoom,
  attribution:
    '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);



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
document.getElementById("chiudiBtn").onclick = () => {
   luoghiModal.style.display = 'none';
};
document.getElementById("submit").onclick = () => {
    SubmForm();
}

//funzione per inviare i dati del form
function SubmForm() {
  let nome = document.getElementById('address').value;
  const esitoDiv = document.getElementById('esito');
  let indAU = nome + ', Australia';
  let url = `https://us1.locationiq.com/v1/search?key=${tokenMap}&q=${encodeURIComponent(
    indAU)}&format=json`;
  if (!nome || !foto || !per || !tipo) {
    esitoDiv.innerHTML = '<div class="alert alert-danger">Compila tutti i campi!</div>';
    return;
}
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.error === 'Unable to geocode') {
        esitoDiv.innerHTML =
          '<div class="alert alert-danger">Nome non valido o inesistente!</div>';
      } else {
        let desc = document.getElementById('desc').value.split(',');
        let foto = document.getElementById('foto').value.split(',');
        let per = document.getElementById('per').value;
        let tipo = document.getElementById('tipo').value;
        let att = document.getElementById('att').value;
        let prz = document.getElementById('prz').value;
        let dur = document.getElementById('dur').value;
        let coord = document.getElementById('cord').value.split(',');
        let ff = document.getElementById('ff').value;
        let vic = document.getElementById('vic').value;
        let punt = document.getElementById('punt').value;
        let lat = coord[0]
        let lon = coord[1]
        const k = {
          nome: indAU,
          desc: desc,
          foto: foto,
          per: per,
          tipo: tipo,
          att : att,
          prz : prz,
          dur : dur,
          lat : lat,
          lon: lon,
          ff : ff,
          vic: vic,
          punt: punt
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
        document.getElementById('desc').value = '';
        document.getElementById('foto').value = '';
        document.getElementById('per').value = '';
        document.getElementById('tipo').value = '';
        document.getElementById('luoghiModal').style.display = 'none';
        document.body.classList.remove('modal-open'); 
        document.querySelector('.modal-backdrop').remove(); 

        cTable(tableCont, list);
      }
    })
    .catch((error) => {
      console.error("Errore durante il controllo dell'nome:", error);
      esitoDiv.innerHTML =
        '<div class="alert alert-danger">Si è verificato un errore durante la verifica dell\'nome!</div>';
    });
}



function renderLuoghi() {
    for (let i = 0; i < list.length; i++) {
      let luogo = list[i];
      const coords = [luogo.lat, luogo.lon];
      const marker = L.marker(coords).addTo(map);
      const popupContent = `
        <b>Nome:</b> ${luogo.nome}<br>
        <b>:</b> ${luogo.desc}<br>
        <b>Data e Ora:</b> ${luogo.foto[0]} ${
        luogo.foto[1]
      }<br>
        <b>per:</b> ${luogo.per}<br>
        <b>tipo:</b> ${luogo.tipo}
      `;
      marker.bindPopup(popupContent).openPopup();
}
  }

  
  const filterBtn = document.getElementById('filter-btn');
  const resetBtn = document.getElementById('reset-btn');
  
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
const createLogin = () => {
  const inputName = document.querySelector("#user");
  const inputPassword = document.querySelector("#psw");
  const loginButton = document.getElementById("loginBtn");
  const esitoLog = document.getElementById("esitoLog");  
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
    console.log(inputName.value, inputPassword.value);
    login(inputName.value, inputPassword.value).then(result => {
      if (result) {
        isLogged = true;
        console.log(isLogged);
        loginModal.style.display = "none";
        document.body.classList.remove('modal-open');
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
          backdrop.remove();
        }
        window.location.hash = 'pagina2';
      } else {
        esitoLog.innerHTML =
          '<div class="alert alert-danger">Credenziali Errate!</div>';
      }
    }).catch(error => {
      console.error('Errore durante il login:', error);
      esitoLog.innerHTML =
        '<div class="alert alert-danger">Si è verificato un errore durante il login!</div>';
    });
  };
  return {
    isLogged: () => isLogged
  };
};
createLogin();
