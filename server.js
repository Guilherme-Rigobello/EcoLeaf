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
        <td style="padding-top: 30px;">
        <a href="/atualizar-planta?id=${encodeURIComponent(planta.id)}" class="btn btn-success btn-sm">Alterar</a>
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
   <tr>
        <td style="padding-top: 35px;">${planta.id}</td>
        <td style="padding-top: 35px;">${planta.nomeCientifico}</td>
        <td style="padding-top: 35px;">${planta.nomePopular}</td>
        <td><img src="${planta.foto}" alt="${planta.nomeCientifico}" style="width: 200px; height: 80px;"></td>
        <td>
            <a href="/atualizar-planta?id=${encodeURIComponent(planta.id)}" class="btn btn-success btn-sm">Alterar</a> 
            <a href="/excluir-planta?id=${encodeURIComponent(planta.id)}" class="btn btn-danger btn-sm">Excluir</a>
        </td>
    </tr>
    `;
    });

    const voltarEAdicionarLinks = `
        <tr>
            <td colspan="5" style="text-align: center; padding-top: 10px; border: 0;">
                <div class="d-flex justify-content-center">
                    <a class="btn btn-success rounded me-2" href="/">Voltar</a>
                    <a class="btn btn-secondary rounded" href="/adicionar-planta">Adicionar Planta</a>
                </div>
            </td>
        </tr>
    `;

    const htmlContent = fs.readFileSync('index.html', 'utf-8');
    const finalHtml = htmlContent.replace('{{plantasTable}}', plantasTable + voltarEAdicionarLinks);

    const script = 

    `<script>
    document.querySelector('.add').style.display = 'none';
    </script>`;

    res.send(finalHtml + script);
});





//SAVE DATA
function salvarDados() {
    fs.writeFileSync(plantasPath, JSON.stringify(plantas, null, 2));
}

app.get('/adicionar-planta', (req, res) => {
    res.sendFile(path.join(__dirname, 'assets/html/adicionarPlanta.html'));
});



//ADD DATA
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

    res.redirect('/');

});



//UPDATE DATA
app.get('/atualizar-planta', (req, res) => {
    const id = req.query.id;
    const planta = plantas.find(planta => planta.id.toLowerCase() === id.toLowerCase());

    if (!planta) {
        return res.send(`
        '<script>alert("Planta não encontrada"); window.location.href = "/atualizar-planta";</script>'
        `);
    }

    let htmlContent = fs.readFileSync('assets/html/atualizarPlanta.html', 'utf-8');

    htmlContent = htmlContent.replace('{{id}}', planta.id)
        .replace('{{nomeCientifico}}', planta.nomeCientifico)
        .replace('{{nomePopular}}', planta.nomePopular)
        .replace('{{foto}}', planta.foto)


    res.send(htmlContent);
});

app.post('/atualizar-planta', (req, res) => {
    const { idOriginal, novoNomeCie, novoNomePop, novaFoto } = req.body;

    const plantaIndex = plantas.findIndex(planta => planta.id == idOriginal);

    if (plantaIndex === -1) {
        return res.send(`
        '<script>alert("Planta não encontrada"); window.location.href = "/atualizar-planta";</script>'
        `);
    }

    plantas[plantaIndex] = {
        ...plantas[plantaIndex],
        nomeCientifico: novoNomeCie,
        nomePopular: novoNomePop,
        foto: novaFoto,
    };

    salvarDados();

    res.redirect('/');
});


//DELETE DATA
app.get('/excluir-planta', (req, res) => {
    const id = req.query.id;
    const planta = plantas.find(planta => planta.id.toLowerCase() === id.toLowerCase());

    if (!planta) {
        res.send(`
        '<script>alert("Planta não encontrada"); window.location.href = "/excluir-planta";</script>'
        `);
        return;
    }

    let htmlContent = fs.readFileSync('assets/html/excluirplanta.html', 'utf-8');
    htmlContent = htmlContent.replace('{{id}}', planta.id);
    res.send(htmlContent);
});


app.post('/excluir-planta-confirmado', (req, res) => {
    const id = req.body.id;
    console.log(id);

    const plantaIndex = plantas.findIndex(planta => planta.id.toLowerCase() === id.toLowerCase());

    if (plantaIndex === -1) {
        res.send(`
        '<script>alert("Planta não encontrada"); window.location.href = "/excluir-planta";</script>'
        `);
        return;
    }

    plantas.splice(plantaIndex, 1);

    salvarDados();

    res.redirect('/');
});


// LISTEN PORT
app.listen(port, () => {
    console.log(`Servidor iniciado em http://localhost:${port}`)
})