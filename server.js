const fs = require('fs')
const path = require('path')
const express = require('express')
const app = express()

//PORT
const port = 3000

const plantasPath = path.join(__dirname, './assets/json/plantas.json')
const plantasData = fs.readFileSync(plantasPath, 'utf-8')
const plantas = JSON.parse(plantasData)

app.use(express.static(path.join(__dirname, 'assets')));

//HOME TABLE
app.get('/', (req, res) => {
    let plantasTable = '';


    plantas.forEach(planta => {
        plantasTable += `
    <tr >
        <td style="padding-top: 35px;">${planta.id}</td>
        <td style="padding-top: 35px;">${planta.nomeCientifico} </td>
        <td style="padding-top: 35px;">${planta.nomePopular} </td>
        <td><img src="${planta.foto}" alt="${planta.nomeCientifico}" style ="width: 200px; height: 80px;"></td>
    </tr>
    `
    });

    const htmlContent = fs.readFileSync('index.html', 'utf-8');
    const finalHtml = htmlContent.replace('{{plantasTable}}', plantasTable);

    res.send(finalHtml);
});

//SEARCH TABLE
app.get('/buscarPorNome', (req, res) => {
    const nomePopular = req.query.nome.toLowerCase();
    const nomesFiltrados = plantas.filter(planta => planta.nomePopular.toLowerCase() === nomePopular);

    let plantasTable = '';

    nomesFiltrados.forEach(planta => {

        plantasTable += `
   <tr >
        <td style="padding-top: 35px;">${planta.id}</td>
        <td style="padding-top: 35px;">${planta.nomeCientifico} </td>
        <td style="padding-top: 35px;">${planta.nomePopular} </td>
        <td><img src="${planta.foto}" alt="${planta.nomeCientifico}" style ="width: 200px; height: 80px;"></td>
    </tr>
    `
});

//BACK BUTTON
const voltarLink = `
        <tr>
            <td colspan="4" style="text-align: center; padding-top: 10px; border:0 ">
                <a class="btn btn-success rounded" href="/">Voltar</a>
            </td>
        </tr>
    `;
    
    const htmlContent = fs.readFileSync('index.html', 'utf-8');
    const finalHtml = htmlContent
        .replace('{{plantasTable}}', plantasTable + voltarLink);
    res.send(finalHtml);
});

// LISTEN PORT
app.listen(port, () => {
    console.log(`Servidor iniciado em http://localhost:${port}`)
})