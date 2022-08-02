const endpoint = 'https://digimon-api.vercel.app/api/digimon';
const btnPesquisar = document.querySelector('[dg-pesquisar]');
const btnProximo = document.querySelector('[dg-proximo]');
const btnAnterior = document.querySelector('[dg-anterior]');
const form = document.querySelector('form');
const inputNome = document.querySelector('[dg-nome]');
const inputLevel = document.querySelector('[dg-level]');
const imagem = document.querySelector('[dg-imagem]');

let nomeDigimon = 'Koromon';

const naoEncontrado = () => {
    inputNome.value = 'Não encontrado';
    inputLevel.value = '';
    imagem.style.display = 'none';
}

const carregandoDados = () => {
    inputNome.value = 'Carregando...';
}

const buscaDados = () => {
    const nomeDigimon = inputNome.value.toLowerCase();
    nomeDigimon[0].toUpperCase(); // Transformar apenas a primeira letra em maiúscula
    APIcomunicao(nomeDigimon);
};

const APIcomunicao = async digimon => {
    carregandoDados();
    if (digimon){
        const APIresposta = await fetch(`${endpoint}/name/${digimon}`);
        if (APIresposta.status === 200){
            const dados = await APIresposta.json();
            const digimon = {
                name: dados[0].name,
                level: dados[0].level,
                img: dados[0].img
            }
            renderizaDigimon(digimon);
        } else{
            naoEncontrado();
        }
    } else{
        const APIresposta = await fetch(endpoint);
        if (APIresposta.status === 200){
            const dados = await APIresposta.json();
            return dados;
        }
    }
}

const renderizaDigimon = dados => {
    if (dados){
        nomeDigimon = dados.name;
        inputNome.value = dados.name;
        inputLevel.value = dados.level;
        imagem.src = `${dados.img}`;
        imagem.style.display = 'block';
    } else{
        naoEncontrado();
    }
}

const encontraProximoOuAnterior = async opcao => {
    const dados = await APIcomunicao();
    const tamanho = dados.length;
    const index = dados.findIndex(element => element.name == nomeDigimon);
    if (opcao == 'anterior'){
        const anterior = index - 1;
        if (anterior >= 0){
            renderizaDigimon(dados[anterior]);
        }
    } else{
        const proximo = index + 1;
        if (proximo < tamanho){
            renderizaDigimon(dados[proximo]);
        }
    }
}

btnPesquisar.addEventListener('click', e => {
    buscaDados();
})

btnProximo.addEventListener('click', e => {
    encontraProximoOuAnterior('proximo');
})

btnAnterior.addEventListener('click', e => {
    encontraProximoOuAnterior('anterior');
})

form.addEventListener('submit', e => {
    e.preventDefault();
    buscaDados();
})

APIcomunicao(nomeDigimon);