import { carica, salva, list } from "./carica_salva.js";

export function viewDetails(id) {
    const homePage = document.getElementById("home");
    const detailPageCont = document.getElementById('details-container');
    const hash = "details_" + id; 
    console.log(hash);
    window.location.hash = hash;
    homePage.style.display = 'none';
    detailPageCont.innerHTML = ""; 

    const luogo = list.find(l => l.id === id);
    if (luogo) {
        const detailPage = `
            <div id="detail_${id}" class="page">
                <div class="container">
                    <div class="header-sp">
                        <h1 class="text-center my-4">${luogo.nome}</h1>
                        <a href="#home" id="home-btn-ad" class="home-button">
                            <svg class="home-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                            </svg>
                        </a>
                    </div>
                    <main>
                        <div class="content">
                            <div id="myCarousel" class="carousel slide" data-bs-ride="carousel">
                                <div id="carousel" class="carousel-inner"></div>
                                <button class="carousel-control-prev" type="button" data-bs-target="#myCarousel" data-bs-slide="prev">
                                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                    <span class="visually-hidden">Precedente</span>
                                </button>
                                <button class="carousel-control-next" type="button" data-bs-target="#myCarousel" data-bs-slide="next">
                                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                    <span class="visually-hidden">Successivo</span>
                                </button>
                            </div>
                            <div class="description mt-4">
                                <h2 id="title-sp">${luogo.tipo}</h2>
                                <p id="desc-sp">${luogo.descL}</p>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        `;

        detailPageCont.innerHTML = detailPage;

        const carouselInner = document.getElementById('carousel');
        luogo.foto.forEach((foto, index) => {
            const activeClass = index === 0 ? 'active' : '';
            const imgElement = `
                <div class="carousel-item ${activeClass}">
                    <img src="${foto}" class="d-block w-100 car-img" alt="Immagine ${index + 1}">
                </div>
            `;
            carouselInner.innerHTML += imgElement;
        });

        const homeBtn = document.getElementById("home-btn-ad");
        homeBtn.onclick = () => {
            window.location.hash = "#home";  
            homePage.style.display = 'block';  
            detailPageCont.style.display = 'none';  
        };
    }
}

window.addEventListener("hashchange", () => {
    const currentHash = window.location.hash;

    const homePage = document.getElementById("home");
    const detailPageCont = document.getElementById('details-container');

    if (currentHash === "#home") {
        homePage.style.display = 'block';
        detailPageCont.style.display = 'none';
    } else if (currentHash.startsWith("#details_")) {
        homePage.style.display = 'none';
        detailPageCont.style.display = 'block';
    }
});

const currentHash = window.location.hash;
if (currentHash === "#home") {
    document.getElementById("home").style.display = 'block';
    document.getElementById('details-container').style.display = 'none';
} else if (currentHash.startsWith("#details_")) {
    document.getElementById("home").style.display = 'none';
    document.getElementById('details-container').style.display = 'block';
}