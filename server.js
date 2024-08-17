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


app.listen(port, () => {
    console.log(`Servidor iniciado em http://localhost:${port}`)
})