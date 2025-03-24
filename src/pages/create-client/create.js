//Adiciona o Cliente
async function addCliente(event) {
    event.preventDefault(); 

    const cpf = formatCPF(document.getElementById("cpf").value);
    const cpfExists = await checkCpfExists(cpf);
    if(cpfExists){
        alert("Este CPF já está cadastrado.");
        return;
    }

    const nome = document.getElementById("nome").value;
    const dataNascimento = document.getElementById("data_nascimento").value;
    const endereco = document.getElementById("endereco").value;

    const cliente = {
        nome: nome,
        cpf: cpf,
        data_nascimento: dataNascimento,
        endereco: endereco
    };
    console.log(JSON.stringify(cliente));
    window.location.href = "create.html"
    try {
        const response = await fetch("http://localhost:8080/cliente", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(cliente)
        });

        if (response.ok) {
            alert("Cliente adicionado com sucesso!");
        } else {
            alert("Erro ao adicionar cliente.");
        }
    } catch (error) {
    }
}

//Formatar o placeholder da data para ser exibida
document.addEventListener("DOMContentLoaded", function () {
    const dateInput = document.getElementById("data_nascimento");

    function updateOpacity() {
        const hasValue = dateInput.value !== "";
        dateInput.style.setProperty("--text-opacity", hasValue ? "1" : "0.3");
    }

    dateInput.addEventListener("input", updateOpacity);
    updateOpacity();
});

//Definir data máxima para a data de nascimento
document.addEventListener("DOMContentLoaded", function () {
    const dateInput = document.getElementById("data_nascimento");

    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    
    const formattedDate = `${year}-${month}-${day}`;
    dateInput.max = formattedDate;
});

//Mostra o modal de confirmação
async function showConfirmation(event) {
    event.preventDefault();
    var iframe = document.getElementById('modalIframe');
    iframe.style.display = 'block';

    const formData = new FormData(document.getElementById('clientForm'));
    let formDetails = '';

    formData.forEach((value, key) => {
        formDetails += `<p><strong>${key}:</strong> ${value}</p>`;
    });

    iframe.contentWindow.postMessage({ action: "showModal", data: formDetails }, "*");

    window.addEventListener("message", async function(event) {
        if (event.data === "confirmed") {
            iframe.style.display = 'none'; 
            await addCliente(event); 
        } else if (event.data === "cancelled") {
            iframe.style.display = 'none'; 
        }
    });
}