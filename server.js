const fs = require('fs')
const path = require('path')
const express = require('express')
const app = express()

//PORT
const port = 4000

const plantasPath = path.join(__dirname, './assets/json/plantas.json')
const plantasData = fs.readFileSync(plantasPath, 'utf-8')
const plantas = JSON.parse(plantasData)

app.use(express.static(path.join(__dirname, 'assets')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
        <td style="paddin-top: 35px;">
        <a href="/atualizar-planta?id=${encodeURIComponent(planta.id)}" class="btn btn-primary btn-sm">Alterar</a> |
        <a href="/excluir-planta?id=${encodeURIComponent(planta.id)}" class="btn btn-danger btn-sm">Excluir</a>
        </td>
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
        <td>
        <a href="/atualizar-planta?descricao=${encodeURIComponent(planta.id)}" class="btn btn-primary btn-sm">Alterar</a> |
        <a href="/excluir-planta?descricao=${encodeURIComponent(planta.id)}" class="btn btn-danger btn-sm">Excluir</a>
        </td>
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


function salvarDados() {
    fs.writeFileSync(plantasPath, JSON.stringify(plantas, null, 2));
}

app.get('/adicionar-planta', (req, res) => {
    res.sendFile(path.join(__dirname, 'assets/html/adicionarPlanta.html'));
});


app.post('/adicionar-planta', (req, res) => {
    const novaPlanta = req.body;

    if (plantas.find(planta => planta.id.toLowerCase() === novaPlanta.id.toLowerCase())) {
        res.send(`
        '<script>alert("Altere o ID da planta."); window.location.href = "/adicionar-planta";</script>'
        `);
        return;
    }

    plantas.push(novaPlanta);
    console.log(plantas);

    salvarDados();

    res.redirect('/'); //Voltando para a rota principal depois de salvar

});


// LISTEN PORT
app.listen(port, () => {
    console.log(`Servidor iniciado em http://localhost:${port}`)
})