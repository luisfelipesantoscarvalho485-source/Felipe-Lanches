let carrinho = [];

carregarCarrinho();
atualizarCarrinho();


function salvarCarrinho() {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

function carregarCarrinho() {
    const dados = localStorage.getItem("carrinho");
    if (dados) {
        carrinho = JSON.parse(dados);
    }
}


function limparCarrinho() {
    carrinho.length = 0; // esvazia o array
    atualizarCarrinho(); // atualiza a tela
}


function adicionar(nome, preco) {
    const itemExistente = carrinho.find(item => item.nome === nome);

    if (itemExistente) {
        itemExistente.quantidade++;
    } else {
        carrinho.push({
            nome: nome,
            preco: preco,
            quantidade: 1
        });
    }

    salvarCarrinho();
    atualizarCarrinho();
    mostrarToast(nome);
}

function removerItem(index) {
    carrinho.splice(index, 1);
    atualizarCarrinho();
}
function atualizarCarrinho() {
    const lista = document.getElementById("lista-carrinho");
    const totalEl = document.getElementById("total");

    lista.innerHTML = "";

    let total = 0;

    carrinho.forEach((item, index) => {
        const subtotal = item.preco * item.quantidade;
        total += subtotal;

        const li = document.createElement("li");
        li.innerHTML = `
    ${item.nome}
    
    <div class="qtd">
        <button onclick="diminuirQuantidade(${index})">➖</button>
        <span>${item.quantidade}</span>
        <button onclick="aumentarQuantidade(${index})">➕</button>
    </div>

    <span>R$ ${subtotal.toFixed(2)}</span>
`;



        lista.appendChild(li);
    });

    totalEl.innerText = `Total: R$ ${total.toFixed(2)}`;
}
function aumentarQuantidade(index) {
    carrinho[index].quantidade++;
    atualizarCarrinho();
    salvarCarrinho();

}

function diminuirQuantidade(index) {
    if (carrinho[index].quantidade > 1) {
        carrinho[index].quantidade--;
    } else {
        carrinho.splice(index, 1); // remove se chegar a 0
    }

    atualizarCarrinho();
}
function mostrarToast(nome) {
    const toast = document.getElementById("toast");
    toast.innerText = `${nome} adicionado 🛒`;

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);
}
let nota = 0;

function avaliar(valor) {
    nota = valor;

    const estrelas = document.querySelectorAll(".estrelas span");

    estrelas.forEach((estrela, index) => {
        if (index < valor) {
            estrela.classList.add("ativa");
        } else {
            estrela.classList.remove("ativa");
        }
    });
}

let comentario = "";

function enviarFeedback() {
    comentario = document.getElementById("feedback").value;

    const mensagem = gerarMensagem();

    if (!mensagem) return;

    window.open(`https://wa.me/${numero}?text=${mensagem}`, "_blank");

    mostrarToast("Pedido + Feedback enviados ✅");
    fecharFeedback();

    setTimeout(() => {
        document.getElementById("mesa").value = "";

        nota = 0;
        comentario = "";
        document.getElementById("feedback").value = "";

        document.querySelectorAll(".estrelas span")
            .forEach(e => e.classList.remove("ativa"));

        carrinho = [];
        localStorage.removeItem("carrinho");

        atualizarCarrinho();
    }, 1000);
}

function gerarNumeroPedido() {
    let numero = localStorage.getItem("pedidoNumero");

    if (!numero) {
        numero = 1;
    } else {
        numero = parseInt(numero) + 1;
    }

    localStorage.setItem("pedidoNumero", numero);
    return numero;
}
function pegarHorario() {
    const agora = new Date();

    return agora.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit"
    });
}

function abrirFeedback() {
    document.getElementById("popup-feedback").style.display = "flex";
}

function fecharFeedback() {
    document.getElementById("popup-feedback").style.display = "none";
}










function gerarMensagem() {
    const mesa = document.getElementById("mesa").value.trim();
    const pagamento = document.getElementById("pagamento").value;

   if (carrinho.length === 0) {
    mostrarToast("Adicione itens ao carrinho 🛒");
    return null;
}



    if (!mesa) {
        mostrarToast("Digite o número da mesa!");
        return null;
    }
    if (!pagamento) {
        mostrarToast("Escolha A Forma De Pagamento!");
        return null;
    }

    if (nota === 0) {
    mostrarToast("Avalie com estrelas antes de finalizar o pedido! Seu Feedback Importa😀");
    return null;
}
     const numeroPedido = gerarNumeroPedido();
     const horario = pegarHorario();

    let mensagem = `🍔 Pedido - Felipe Lanches\n`;
    mensagem += `⏰ Horario: ${horario}\n\n`
    mensagem += `📝 Pedido Nº: ${numeroPedido}\n`
    mensagem += `📍 Mesa: ${mesa}\n\n`;
     mensagem += `💳 Pagamento: ${pagamento}\n\n`;

    mensagem += `Avaliação Do Cliente: ${nota} estrelas\n\n`;

if (comentario.trim() !== "") {
    mensagem += `💬 Comentário: ${comentario}\n\n`;
}


    let total = 0;

    carrinho.forEach(item => {
        const subtotal = item.preco * item.quantidade;
        mensagem += `• ${item.nome} (x${item.quantidade}) - R$ ${subtotal.toFixed(2)}\n`;
        total += subtotal;
    });

    mensagem += `\n💰 Total: R$ ${total.toFixed(2)}`;

    return encodeURIComponent(mensagem);
}

const numero = "5521983609954"; // coloca o número do dono

const btn = document.getElementById("btn-whatsapp");

btn.addEventListener("click", enviarFeedback);
   

