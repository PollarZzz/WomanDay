// js/script.js

// 1. CONFIGURAÇÕES INICIAIS
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const btnPresente = document.getElementById('btn-presente');
const uiContainer = document.getElementById('ui-container');
const bgGradient = document.getElementById('bg-gradient');
const mensagemFinal = document.getElementById('mensagem-final');

// Variáveis de Controle de Estado da Animação
let estado = "aguardando";
let semente = { y: 0, x: 0, velocidade: 0 };
let flores = [];
let particulas = [];

// Frases para as nuvens flutuantes
const frasesNuvens = [
    "Você é minha inspiração",
    "Sua força me encanta",
    "Meu porto seguro",
    "Dona do meu coração",
    "Minha parceira de vida",
    "Seu sorriso ilumina tudo",
    "Mulher incrível",
    "Eu te amo mil milhões",
    "Você é meu bem maior",
    "Você é minha paz",
    "Meu universo inteiro",
    "Amor da minha vida",
    "Sua luz me guia",
    "Perfeita em cada detalhe"
];

// Fila de frases para controlar a ordem de aparecimento
let filaDeFrases = [...frasesNuvens];
const maxNuvensNaTela = 6;

// Ajustar o tamanho do canvas com responsividade
function resizeCanvas() {
    const oldWidth = canvas.width || window.innerWidth;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Se as flores já existem, reposicioná-las proporcionalmente
    if (flores && flores.length > 0) {
        const widthRatio = canvas.width / oldWidth;
        flores.forEach(flor => {
            flor.x = flor.x * widthRatio;
            flor.y = canvas.height;
        });
    }
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// 2. CLASSES DOS OBJETOS DA ANIMAÇÃO

// Classe Flor
class Flor {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height;
        this.alturaMaxima = canvas.height * 0.2 + Math.random() * (canvas.height * 0.4);
        this.alturaAtual = 0;
        this.curva = (Math.random() - 0.5) * 100;
        this.espessuraCaule = 1.5 + Math.random() * 2;
        
        // Sistema de Diferentes Tipos de Flores
        const tiposDeFlores = ['girassol', 'rosa_vermelha', 'rosa_branca', 'margarida', 'violeta', 'lirio'];
        this.tipo = tiposDeFlores[Math.floor(Math.random() * tiposDeFlores.length)];
        
        this.tamanhoPetala = 0;
        this.tamanhoMaxPetala = 10 + Math.random() * 15;
        this.desabrochando = false;
        
        this.velocidadeCrescimento = 1 + Math.random() * 2;
        this.velocidadeDesabrochar = 0.1 + Math.random() * 0.3;

        // Definir as cores e formatos conforme o tipo de flor
        switch(this.tipo) {
            case 'girassol':
                this.corCentro = '#4B3621';
                this.corPetala = '#FFD700';
                this.quantidadePetalas = 15 + Math.floor(Math.random() * 5);
                this.proporcaoCentro = 0.45;
                this.formato = 'pontuda';
                this.tamanhoMaxPetala *= 1.3;
                break;
            case 'rosa_vermelha':
                this.corCentro = '#600000';
                this.corPetala = '#DC143C';
                this.quantidadePetalas = 7 + Math.floor(Math.random() * 3);
                this.proporcaoCentro = 0.2;
                this.formato = 'redonda';
                break;
            case 'rosa_branca':
                this.corCentro = '#F5F5DC';
                this.corPetala = '#FFFAFA';
                this.quantidadePetalas = 7 + Math.floor(Math.random() * 3);
                this.proporcaoCentro = 0.2;
                this.formato = 'redonda';
                break;
            case 'margarida':
                this.corCentro = '#FFA500';
                this.corPetala = '#FFFFFF';
                this.quantidadePetalas = 12 + Math.floor(Math.random() * 4);
                this.proporcaoCentro = 0.25;
                this.formato = 'oval';
                break;
            case 'violeta':
                this.corCentro = '#FFD700';
                this.corPetala = '#8A2BE2';
                this.quantidadePetalas = 5;
                this.proporcaoCentro = 0.15;
                this.formato = 'redonda';
                break;
            case 'lirio':
                this.corCentro = '#FFF0F5';
                this.corPetala = '#FF69B4';
                this.quantidadePetalas = 6;
                this.proporcaoCentro = 0.1;
                this.formato = 'pontuda';
                this.tamanhoMaxPetala *= 1.2;
                break;
        }
    }

    atualizar() {
        if (this.alturaAtual < this.alturaMaxima) {
            this.alturaAtual += this.velocidadeCrescimento;
        } else {
            this.desabrochando = true;
        }

        if (this.desabrochando && this.tamanhoPetala < this.tamanhoMaxPetala) {
            this.tamanhoPetala += this.velocidadeDesabrochar;
        }
    }

    desenhar() {
        let progresso = this.alturaAtual / this.alturaMaxima;
        let pontaX = this.x + (this.curva * progresso);
        let pontaY = this.y - this.alturaAtual;

        // Desenhar Caule
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.quadraticCurveTo(this.x + (this.curva * 0.5), this.y - (this.alturaAtual * 0.5), pontaX, pontaY);
        ctx.strokeStyle = '#4a7c59';
        ctx.lineWidth = this.espessuraCaule;
        ctx.stroke();

        // Desenhar Flor
        if (this.desabrochando && this.tamanhoPetala > 0) {
            ctx.save();
            ctx.translate(pontaX, pontaY);
            
            for (let i = 0; i < this.quantidadePetalas; i++) {
                ctx.rotate((Math.PI * 2) / this.quantidadePetalas);
                ctx.beginPath();
                ctx.moveTo(0, 0);
                
                if (this.formato === 'pontuda') {
                    ctx.quadraticCurveTo(this.tamanhoPetala * 0.3, -this.tamanhoPetala * 0.5, 0, -this.tamanhoPetala);
                    ctx.quadraticCurveTo(-this.tamanhoPetala * 0.3, -this.tamanhoPetala * 0.5, 0, 0);
                } else if (this.formato === 'redonda') {
                    ctx.quadraticCurveTo(this.tamanhoPetala * 0.8, -this.tamanhoPetala * 0.3, 0, -this.tamanhoPetala * 0.8);
                    ctx.quadraticCurveTo(-this.tamanhoPetala * 0.8, -this.tamanhoPetala * 0.3, 0, 0);
                } else if (this.formato === 'oval') {
                    ctx.quadraticCurveTo(this.tamanhoPetala * 0.5, -this.tamanhoPetala * 0.8, 0, -this.tamanhoPetala);
                    ctx.quadraticCurveTo(-this.tamanhoPetala * 0.5, -this.tamanhoPetala * 0.8, 0, 0);
                }
                
                ctx.fillStyle = this.corPetala;
                ctx.fill();
                
                ctx.strokeStyle = 'rgba(0,0,0,0.1)';
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
            
            ctx.beginPath();
            ctx.arc(0, 0, this.tamanhoPetala * this.proporcaoCentro, 0, Math.PI * 2);
            ctx.fillStyle = this.corCentro;
            ctx.fill();
            
            ctx.restore();
        }
    }
}

// Classe Particula
class Particula {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 100;
        this.tamanho = Math.random() * 2.5;
        this.velocidadeY = -(0.2 + Math.random() * 0.5);
        this.balanco = Math.random() * Math.PI * 2;
        this.opacidade = Math.random();
    }

    atualizar() {
        this.y += this.velocidadeY;
        this.x += Math.sin(this.balanco) * 0.5;
        this.balanco += 0.02;

        if (this.y < 0) {
            this.y = canvas.height;
            this.x = Math.random() * canvas.width;
        }
    }

    desenhar() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.tamanho, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 230, 150, ${this.opacidade})`;
        ctx.fill();
    }
}

// 3. MOTOR DA ANIMAÇÃO
function animar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (estado === "caindo") {
        ctx.beginPath();
        ctx.arc(semente.x, semente.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = "#ffd700";
        ctx.shadowBlur = 15;
        ctx.shadowColor = "#ffd700";
        ctx.fill();
        ctx.shadowBlur = 0;

        semente.velocidade += 0.2;
        semente.y += semente.velocidade;

        if (semente.y >= canvas.height) {
            estado = "crescendo";
            iniciarPrimavera();
        }
    }

    if (estado === "crescendo") {
        particulas.forEach(p => {
            p.atualizar();
            p.desenhar();
        });

        flores.forEach(flor => {
            flor.atualizar();
            flor.desenhar();
        });
    }

    requestAnimationFrame(animar);
}

// 4. LÓGICA DE INTERAÇÃO
btnPresente.addEventListener('click', () => {
    uiContainer.style.opacity = '0';
    setTimeout(() => uiContainer.style.display = 'none', 1000);

    semente.x = canvas.width / 2;
    semente.y = -10;
    semente.velocidade = 2;
    
    estado = "caindo";
});

function iniciarPrimavera() {
    document.body.classList.add('blooming');
    bgGradient.style.opacity = '1';

    let quantidadeFlores = Math.floor(canvas.width / 15);
    for (let i = 0; i < quantidadeFlores; i++) {
        setTimeout(() => {
            flores.push(new Flor());
        }, Math.random() * 2000);
    }

    for (let i = 0; i < 50; i++) {
        particulas.push(new Particula());
    }

    setTimeout(() => {
        mensagemFinal.style.opacity = '1';
        iniciarNuvens();
    }, 4000);
}

// 5. SISTEMA DE NUVENS INTELIGENTES
let posicoesOcupadas = [];

function obterPosicaoSegura() {
    let posX, posY;
    let tentativa = 0;
    let segura = false;

    while (!segura && tentativa < 50) {
        posX = 15 + Math.random() * 70;
        posY = 40 + Math.random() * 45;

        segura = true;
        for (let pos of posicoesOcupadas) {
            let distancia = Math.sqrt(Math.pow(posX - pos.x, 2) + Math.pow(posY - pos.y, 2));
            if (distancia < 15) {
                segura = false;
                break;
            }
        }
        tentativa++;
    }
    return { x: posX, y: posY };
}

function mostrarNuvem(frase) {
    const nuvem = document.createElement('div');
    nuvem.className = 'nuvem-frase';
    nuvem.innerText = frase;
    
    const pos = obterPosicaoSegura();
    nuvem.style.left = `${pos.x}%`;
    nuvem.style.top = `${pos.y}%`;
    
    const objPos = { x: pos.x, y: pos.y };
    posicoesOcupadas.push(objPos);

    const duracaoFlutuar = 4 + Math.random() * 3;
    nuvem.style.animation = `flutuar ${duracaoFlutuar}s ease-in-out infinite alternate`;
    
    document.body.appendChild(nuvem);

    setTimeout(() => {
        nuvem.style.opacity = '1';
    }, 100);

    setTimeout(() => {
        nuvem.style.opacity = '0';
        posicoesOcupadas = posicoesOcupadas.filter(p => p !== objPos);

        setTimeout(() => {
            nuvem.remove();
            filaDeFrases.push(frase);
            const proximaFrase = filaDeFrases.shift();
            setTimeout(() => mostrarNuvem(proximaFrase), 1000 + Math.random() * 1000);
        }, 1500);
    }, 6000);
}

function iniciarNuvens() {
    for(let i = 0; i < maxNuvensNaTela; i++) {
        setTimeout(() => {
            const fraseInicial = filaDeFrases.shift();
            mostrarNuvem(fraseInicial);
        }, i * 2000);
    }
}

// Inicia a animação
animar();
