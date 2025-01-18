//COMPONENTE TABELLA
export const cTable = (parentElement, data) => {
    let html =
        '<table><thead><tr><th>Name</th><th>Description</th><th>Type</th><th>Average price</th><th>Best season</th><th>Recommended duration</th><th>Family-friendly</th><th>Score</th></tr></thead>';
    for (let i = 0; i < data.length; i++) {
        let luogo = data[i];
        html += `<tr>
                    <td>${luogo.nome}</td>
                    <td>${luogo.desc}</td>
                    <td>${luogo.tipo}</td>
                    <td>${luogo.prz}</td>
                    <td>${luogo.per}</td>
                    <td>${luogo.dur}</td>
                    <td>${luogo.ff}</td>
                    <td>${luogo.punt}</td>
                 </tr>`;
    }
    html += '</table>';
    parentElement.innerHTML = html;
};

export const cTableAdmin = (parentElement, data, cancellaCB, modificaCB) => {
    let html =
        '<table class="table-ad"><thead><tr><th>Name</th><th>Description</th><th>Type</th><th>Average price</th><th>Best season</th><th>Recommended duration</th><th>Coordinates</th><th>Family-friendly</th><th>Close to</th><th>Score</th><th>Edit</th><th>Delete</th></tr></thead>';
    for (let i = 0; i < data.length; i++) {
        let luogo = data[i];
        let coordinates = `${luogo.lat}, ${luogo.lon}`;
        html += `<tr>
                    <td>${luogo.nome}</td>
                    <td>${luogo.desc}</td>
                    <td>${luogo.tipo}</td>
                    <td>${luogo.prz}</td>
                    <td>${luogo.per}</td>
                    <td>${luogo.dur}</td>
                    <td>${coordinates}</td>
                    <td>${luogo.ff}</td>
                    <td>${luogo.vic}</td>
                    <td>${luogo.punt}</td>
                    <td><button id="editBtn${i}" class="edit-btn" data-bs-toggle="modal" data-bs-target="#luoghiModal">Edit</button></td>
                    <td><button id="delBtn${i}" class="del-btn">Delete</button></td>
                 </tr>`;
    }
    html += '</table>';
    parentElement.innerHTML = html;

    for (let i = 0; i < data.length; i++) {
        document.getElementById(`delBtn${i}`).onclick = () => cancellaCB(i);
        document.getElementById(`editBtn${i}`).onclick = () => modificaCB(i);
    }
};
