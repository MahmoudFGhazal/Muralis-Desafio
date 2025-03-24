//Pega o cliente que está relacionado ao contato
const urlParams = new URLSearchParams(window.location.search);
const curClient = urlParams.get('curClient');

//Adiciona o contato
async function enviarContato(tipo, valor, observacao, cliente_id) {
    try {
        const response = await fetch("http://localhost:8080/contato", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                tipo: tipo,
                valor: valor,
                observacao: observacao,
                cliente: {id: cliente_id}
            })
        });

        if (!response.ok) {
            throw new Error(`Erro ao enviar contato: ${response.status}`);
        }

        const result = await response.json();
        alert("Contato enviado com sucesso!");
        console.log("Resposta da API:", result);
    } catch (error) {
        console.error("Erro:", error);
        alert("Erro ao enviar contato.");
    }
}

//Mostra o modal de confirmação
function showConfirmation(event) {
    event.preventDefault();
    var iframe = document.getElementById('modalIframe');
    iframe.style.display = 'block'; 

    let formData;
    const tipo = document.getElementById("tipo").value;
    let valor = "";

    if (tipo === "email") {
        formData = new FormData(document.getElementById('emailForm'));
        valor = formData.get("email");
    } else if (tipo === "telefone") {
        formData = new FormData(document.getElementById('telefoneForm'));
        valor = formData.get("telefone");
    } else{
        return;
    }

    const observacao = formData.get("observacao") || "";

    console.log(tipo)

    //Mostra as informações do contato
    let formDetails = `<p><strong>Tipo:</strong> ${tipo}</p>
                       <p><strong>Valor:</strong> ${valor}</p>
                       <p><strong>Observação:</strong> ${observacao}</p>`;

    iframe.contentWindow.postMessage({ action: "showModal", data: formDetails }, "*");

    window.addEventListener("message", function(event) {
        if (event.data === "confirmed") {
            enviarContato(tipo, valor, observacao, curClient);
            iframe.style.display = 'none';
            window.location.href = "../search/search.html";
        } else if (event.data === "cancelled") {
            iframe.style.display = 'none'; 
        }
    });
}

//Controla os forms dependendo do tipo de contato
document.getElementById('tipo').addEventListener('change', function() {
    const tipo = document.getElementById("tipo").value;
    const emailForm = document.getElementById("emailForm");
    const telefoneForm = document.getElementById("telefoneForm");
    const baseForm = document.getElementById("base");

    emailForm.style.display = "none";
    telefoneForm.style.display = "none";
    baseForm.style.display = "none";

    if (tipo === "email") {
        emailForm.style.display = "flex";
    } else if (tipo === "telefone") {
        telefoneForm.style.display = "flex";
    } 
});
