const fs = require('fs')
const path = require('path')
const express = require('express')
 
const app = express()
 
const port = 3002

const plantasPath = path.join(__dirname, './assets/json/plantas.json')
const plantasData = fs.readFileSync(plantasPath, 'utf-8')
const plantas = JSON.parse(plantasData)

app.use(express.static(path.join(__dirname, 'assets')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'))
})


function buscarPlanta(nomePopular) {

    return plantas.find(planta => planta.nomePopular.toLowerCase() === nomePopular.toLowerCase())
}


app.get('/buscar-planta', (req, res) => {
    const nomeDaPlantaBuscada = req.query.nomePopular
    const plantaEncontrada = buscarPlanta(nomeDaPlantaBuscada)

    if (plantaEncontrada) {
        const templatePath = path.join(__dirname, 'dadosplanta.html')
        const templateData = fs.readFileSync(templatePath, 'utf-8')

        const html = templateData
            .replace('{{nomeCientifico}}', plantaEncontrada.nomeCientifico)
            .replace('{{nomePopular}}', plantaEncontrada.nomePopular)
            .replace('{{desc}}', plantaEncontrada.desc)
            .replace('{{venenosa}}', plantaEncontrada.venenosa)
            .replace('{{foto}}', plantaEncontrada.foto)

        res.send(html)
    } else {
        res.send('<h1>planta não encontrada.</h1>')
    }
})


app.get('/filtrarPorGenero', (req, res) => {
    const genero = req.query.genero.toLowerCase();
    const filmesFiltrados = filmes.filter(filme => filme.genero.toLowerCase() === genero);

        let filmesTable = '';

    filmesFiltrados.forEach(filme => {


        filmesTable += `
        <tr>
            <td><h3>${filme.titulo}</h3></td>
            <td><h4>${filme.ano}</h4></td>
            <td><h4>${filme.diretor}</h4></td>
            <td><h4>${filme.genero}</h4></td>
            <td><img src="${filme.cartaz}" alt="${filme.titulo}" style="max-width: 100px;"></td>
        </tr>
        `;
    });

    const htmlContent = fs.readFileSync('filmes.html', 'utf-8');
    const finalHtml = htmlContent.replace('{{filmesTable}}', filmesTable);

    res.send(finalHtml);

       
})

app.listen(port, () => {
    console.log(`Servidor iniciado em http://localhost:${port}`)
})