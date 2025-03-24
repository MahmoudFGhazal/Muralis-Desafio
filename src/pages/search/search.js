let clientes;
let curclientes;
let curclient;

//Requisita os usuários e coloca eles em ordem alfabetica
document.addEventListener("DOMContentLoaded", async function () {
    try{
        //Requisito para a api
        const response = await fetch("http://localhost:8080/cliente");
        if(!response.ok) throw new Error("Erro ao buscar clientes");

        clientes = await response.json();

        clientes.forEach(client => {
            let dataNascimento = client.data_nascimento.split('-'); 
            client.data_nascimento = `${dataNascimento[2]}/${dataNascimento[1]}/${dataNascimento[0]}`; 
        });

        //Ordenação dos clientes
        clientes.sort((a, b) => a.nome.localeCompare(b.nome));
        curclientes = clientes;
        renderTable(clientes);
    }catch(error){
        console.error("Erro ao carregar clientes", error);
    }

});

//Renderiza a tabela
function renderTable(clientList){
    if (!Array.isArray(clientList)) {
        console.error('Erro: O parâmetro passado não é um array.');
        return;
    }

    //pegar e limpar o corpo da tabela
    let tbody = document.querySelector('table tbody');
    tbody.innerHTML = '';

    //inseri os clientes no corpo da tabela
    clientList.forEach((client) => {
        let tr = document.createElement('tr');

        tr.innerHTML = `
            <td class="client-name" data-cpf="${client.cpf}">${client.nome}</td>
            <td>${client.cpf}</td>
            <td>${client.data_nascimento}</td>
            <td>${client.endereco}</td>
            <td><span class="selectable" onclick="deleteClient(${client.id}, event)">Excluir</span></td>
        `;

        tr.addEventListener('click', function (event) {
            event.stopPropagation();
            if (!event.target.classList.contains('selectable')) {
                openDetails(this.querySelector('.client-name'), event);
            }
        });


        tbody.appendChild(tr);
    });

}

//Obtém o CPF pelo ID do cliente
async function getCpf(id){
    try {
        const response = await fetch(`http://localhost:8080/cliente/${id}/cpf`);
        
        if (response.ok) {
            const cpf = await response.text(); 
            console.log('CPF:', cpf);
            return cpf;
        } else {
            console.error('Cliente não encontrado ou erro ao buscar CPF');
            return null;
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        return null;
    }
}

//Envia as alterações no cliente
async function editCliente(updatedClientcliente){
    fetch(`http://localhost:8080/cliente/${curclient}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedClient)
    })
    .then(response => {
        if (response.ok) {
            alert("Cliente atualizado com sucesso.");
            window.location.href = "search.html";
        } else {
            alert("Erro ao atualizar o cliente.");
        }
    })
    .catch(error => {
        console.error("Erro ao enviar a requisição de atualização", error);
        alert("Erro ao atualizar o cliente.");
    });

}

//Exclui o cliente pelo ID
async function deleteClient(clientId, event) {
    event.stopPropagation();

    showDeleteConfirmation(async () => {
        try {
            const response = await fetch(`http://localhost:8080/cliente/${clientId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert("Cliente excluído com sucesso.");
                window.location.href = "search.html";
            } else {
                alert("Erro ao excluir o cliente.");
            }
        } catch (error) {
            console.error("Erro ao excluir o cliente", error);
            alert("Erro ao excluir o cliente.");
        }
    });;
}

//Deleta o contato pelo ID
async function deleteContact(contactId, event) {
    event.stopPropagation(); 

     showDeleteConfirmation(async () => {
        try {
            const response = await fetch(`http://localhost:8080/contato/${contactId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert("Contato excluído com sucesso.");
                window.location.href = "search.html";
            } else {
                alert("Erro ao excluir o contato.");
            }
        } catch (error) {
            console.error("Erro ao excluir o contato", error);
            alert("Erro ao excluir o contato.");
        }
    });
}

//Manda para api o novo contato
async function editContact(contactId, event) {
    event.stopPropagation(); 


    window.location.href = "search.html";
}

//Pega um contato especifico pelo seu id
async function getContactById(id) {
    try {
        const response = await fetch(`http://localhost:8080/contato/${id}`);
        if (!response.ok) throw new Error("Erro ao buscar o contato");

        const contact = await response.json();

        return contact; 
    } catch (error) {
        console.error("Erro ao buscar contato:", error);
        return null; 
    }
}

//Aparece o modal para confirmar a exclusão do cliente e/ou dos contatos
function showDeleteConfirmation(deleteCallback) {
    const modal = document.getElementById("deleteModal");
    modal.style.display = "block";

    document.getElementById("confirmDelete").onclick = function () {
        modal.style.display = "none";
        deleteCallback(); 
    };

    document.getElementById("cancelDelete").onclick = function () {
        modal.style.display = "none";
    };
}

//Aparece o modal para confirmar a alteração de alguma informação do cliente
async function showConfirmation(event) {
    console.log(event);
    event.preventDefault();
    var iframe = document.getElementById('modalIframe');
    
    if (!iframe) {
        console.error("Erro: O iframe não foi encontrado.");
        return;
    }

    
    iframe.style.display = 'block';

    const buttonId = event.target.id;

    //Analisa se usuário está editando o cliente ou um contato
    if(buttonId === "editClient"){

        const editName = document.getElementById("edit-name").value;
        const editCpf = formatCPF(document.getElementById("edit-cpf").value);
        const editDataNascimento = document.getElementById("edit-data-nascimento").value;
        const editAddress = document.getElementById("edit-address").value;
        const curCPF = await getCpf(curclient);

        //Mostra os dados alterado
        let formDetails = `
            <p><strong>Nome:</strong> ${editName}</p>
            <p><strong>CPF:</strong> ${editCpf}</p>
            <p><strong>Data de Nascimento:</strong> ${editDataNascimento}</p>
            <p><strong>Endereço:</strong> ${editAddress}</p>
        `;
        iframe.contentWindow.postMessage({ action: "showModal", data: formDetails }, "*"); 

        window.addEventListener("message", async function(event) {
            event.stopPropagation();
            if (event.data === "confirmed") { 
                //Analisa se o CPF foi alterado
                if(editCpf !== curCPF){
                    //Analisa se o novo CPF já existe no banco
                    const cpfExists = await checkCpfExists(editCpf);
                    if(cpfExists){
                        alert("Este CPF já está cadastrado.");
                        const element = document.querySelector(`[data-cpf="${curCPF}"]`);
                        RecoverDetails(element);
                        return;
                    }
                }

                iframe.style.display = 'none';
                
                const updatedClient = {
                    nome: editName,
                    cpf: editCpf,
                    data_nascimento: editDataNascimento,
                    endereco: editAddress
                };

                await editCliente(updatedClient);
            } else if (event.data === "cancelled") {
            }
            iframe.style.display = 'none';
        });
    }else if(buttonId.startsWith("edit-contato")){
        const form = event.target;
        const id = form.getAttribute("data-contact-id");

        console.log();

        const editTipo = form.querySelector(`#tipo-${id}`).value;
        const editValor = form.querySelector(`#valor-${id}`).value;
        let editObservacao = "";
        if(form.querySelector(`#observacao-${id}`)){
            editObservacao = form.querySelector(`#observacao-${id}`).value;
        }

        //Mostra as informações que o usuário vai alterar
        let formDetails = `
            <p><strong>Tipo:</strong> ${editTipo}</p>
            <p><strong>Valor:</strong> ${editValor}</p>
            <p><strong>Observação:</strong> ${editObservacao}</p>
        `;

        iframe.contentWindow.postMessage({ action: "showModal", data: formDetails }, "*");

        window.addEventListener("message", function(event) {
            iframe.style.display = 'none';

            if(editTipo === "telefone"){
                if (editValor.length > 11 || editValor.length < 9) {
                    alert("Telefone Inválido.\nColoque somente números.");
                    RecoverDetailsContact(id);
                    return;
                }
            }else{
                if (!editValor.includes("@")) {
                    alert("E-mail Inválido.");
                    RecoverDetailsContact(id);
                    return;
                }
            }

            if (event.data === "confirmed") { 
                const updatedContact = {
                    tipo: editTipo,
                    valor: editValor,
                    observacao: editObservacao
                };

                fetch(`http://localhost:8080/contato/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedContact)
                })
                .then(response => {
                    if (response.ok) {
                        alert("Contato atualizado com sucesso.");
                        window.location.href = "search.html";
                    } else {
                        alert("Erro ao atualizar o contato.");
                    }
                })
                .catch(error => {
                    console.error("Erro ao enviar a requisição de atualização", error);
                    alert("Erro ao atualizar o contato.");
                });
            } else if (event.data === "cancelled") {
                iframe.style.display = 'none'; 
            }
        });
    }
}

let isAscending = true;

//Ordena a tabela
function sortTable(){
    curclientes.sort((a, b) => {
        return isAscending
            ? a.nome.localeCompare(b.nome)
            : b.nome.localeCompare(a.nome);
    });

    isAscending = !isAscending;

    document.getElementById("sort-icon").innerHTML = isAscending 
                                                        ? "&#8593" 
                                                        : "&#8595";

    renderTable(curclientes);
}

//Filtra clientes pela search-bar
function filterClients() {
    const searchTerm = document.getElementById('search-bar').value.toLowerCase();
    
    return clientes.filter(client => {
        return client.nome.toLowerCase().startsWith(searchTerm) || client.cpf.startsWith(searchTerm);
    });
}

//Recebe o evento de clicar no nome
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("sortable-name").addEventListener("click", sortTable);
});

let curcontato;

//Recebe o evento de digitar no search-bar
document.getElementById('search-bar').addEventListener('input', () => {
    console.log(document.getElementById('search-bar').value.toLowerCase())
    curclientes = filterClients();
    console.log(curclientes);
    renderTable(curclientes);  
});

let clickOutsideListener = null;

//Abrir a parte de editar e os contatos do cliente
//Adicionar listeners para as funções relacionadas a exlcluir e editar o cliente e seus contatos
async function openDetails(element, event) {

    //Fecha a aba, se houver, para abrir a nova
    const existingDetailsRow = element.closest('tr').nextElementSibling;

    if (existingDetailsRow && existingDetailsRow.classList.contains("details-row")) {
        closeDetails();
        return;
    }

    closeDetails();

    //Pega as informações do cliente selecionado
    let cpf = element.getAttribute("data-cpf");
    let client = clientes.find(c => c.cpf === cpf);
    if (!client) return;

    curclient = client.id;

    let dataNascimento = client.data_nascimento.split('/');
    let formattedDate = `${dataNascimento[2]}-${dataNascimento[1]}-${dataNascimento[0]}`;

    let detailsRow = document.createElement("tr");
    detailsRow.classList.add("details-row");

    let detailsCell = document.createElement("td");
    detailsCell.colSpan = 5;

    //Pega os contatos do cliente seleciona
    const contatos = await fetch(`http://localhost:8080/contato/cliente/${client.id}`)
                        .then(response => response.ok ? response.json() : [])
                        .catch(error => {
                            console.error("Erro ao buscar os contatos", error);
                            return [];
                        });

    //Renderiza as informações do cliente
    detailsCell.innerHTML = `
        <div class="client-details">
            <div class="left">
                <form id="editClient" action="#" method="POST" onsubmit="showConfirmation(event)">
                    <div class="header">
                        <p><strong>Nome:</strong> 
                            <input type="text" id="edit-name" value="${client.nome}" disabled maxlength="100">
                        </p>
                        <p class="selectable" id="edit-button">Editar</p>
                    </div>
                    <p><strong>CPF:</strong> 
                        <input type="text" id="edit-cpf" value="${client.cpf}" disabled maxlength="14">
                    </p>
                    <p><strong>Data de Nascimento:</strong> 
                        <input type="date" id="edit-data-nascimento" value="${formattedDate}" disabled>
                    </p>
                    <p><strong>Endereço:</strong> 
                        <input type="text" id="edit-address" value="${client.endereco}" disabled maxlength="255">
                    </p>
                    <div id="buttons" class="button-group" style="display: none;">
                        <button id="save-edit" type="submit">Salvar</button>
                        <p id="cancel-edit" class="cancel">Cancelar</p>
                    </div>
                </form>
                <div class="header">
                    <p><strong>Contatos:</strong></p>
                    <a href="../create-contact/create.html?curClient=${curclient}" class="selectable">Adicionar</a>
                </div>
                <ul>
                    ${contatos.map(c => `
                        <li>
                            <form class="edit-contact-form" data-contact-id="${c.id}" id="edit-contato-${c.id}" action="#" method="POST" onsubmit="showConfirmation(event)">
                                <p>
                                    <select class="contact-type" id="tipo-${c.id}" disabled>
                                        <option value="telefone" ${c.tipo === "telefone" ? "selected" : ""}>Telefone</option>
                                        <option value="email" ${c.tipo === "email" ? "selected" : ""}>E-mail</option>
                                    </select>
                                    :
                                    <input type="text" class="contact-value" value="${c.valor}" maxlength="100" disabled id="valor-${c.id}">
                                    <span class="selectable" id="edit-button-contact-${c.id}">Editar</span> | 
                                    <span class="selectable" onclick="deleteContact(${c.id}, event)">Excluir</span>
                                </p>
                                <p style="display: ${c.observacao && c.observacao.trim() !== "" ? "block" : "none"};" id="observacao-area-${c.id}">
                                    <input type="text" class="contact-observacao" value="${c.observacao || ''}" disabled id="observacao-${c.id}" maxlength="255">
                                </p>
                                <div id="buttons-contact-${c.id}" class="button-group" style="display: none;">
                                    <button id="save-edit-contact-${c.id}" type="submit">Salvar</button>
                                    <p id="cancel-edit-contact-${c.id}" class="cancel">Cancelar</p>
                                </div>
                            </form>
                        </li>
                    `).join("")}
                </ul>
            </div>
        </div>
    `;

    detailsRow.appendChild(detailsCell);
    element.closest('tr').after(detailsRow);

    //Adiciona um evento para o clique editar o cliente
    document.getElementById("edit-button").addEventListener("click", function () {
        document.getElementById("edit-name").disabled = false;
        document.getElementById("edit-cpf").disabled = false;
        document.getElementById("edit-data-nascimento").disabled = false;
        document.getElementById("edit-address").disabled = false;

        document.getElementById("buttons").style.display = "flex";
        removeEditButtons();
    });

    //Adiciona um evento para o clique editar o contato
    document.querySelectorAll("[id^='edit-button-contact-']").forEach(editButton => {
        editButton.addEventListener("click", function () {
            const form = this.closest("form");
            const id = form.getAttribute('data-contact-id');
    
            curcontato = id;

            removeEditButtons();
    
            form.querySelector(`#tipo-${id}`).disabled = false;
            form.querySelector(`#valor-${id}`).disabled = false;
            form.querySelector(`#observacao-area-${id}`).style.display = "flex";
            form.querySelector(`#observacao-${id}`).disabled = false;
            
            form.querySelector(`#buttons-contact-${id}`).style.display = "flex";
            form.querySelector(`#edit-button-contact-${id}`).style.display = "none";
        });
    });
    
    //Adiciona um evento para o clique salvar as alterações do contato
    document.querySelectorAll("[id^='save-edit-contact-']").forEach(saveButton => {
        saveButton.addEventListener("click", function () {
            const form = this.closest("form");
            const id = form.getAttribute("data-contact-id");
            disableInputsContact(id);
        });
    });
    
    //Adiciona um evento para o clique cancelar as alterações do contato
    document.querySelectorAll("[id^='cancel-edit-contact-']").forEach(cancelButton => {
        cancelButton.addEventListener("click", function () {
            const form = this.closest("form");
            const id = form.getAttribute("data-contact-id");
            
            RecoverDetailsContact(id);
            disableInputsContact(id);
        });
    });

        //Adiciona um evento para o clique cancelar as alterações do cliente
    document.getElementById("cancel-edit").addEventListener("click", function () {
        // Restaura os valores originais dos campos
        RecoverDetails(element);
    
        disableInputs();
    });

    //Adiciona um evento para o clique salvar as alterações do cliente
    document.getElementById("save-edit").addEventListener("click", function () {
        disableInputs();
    });

    //Analise se o cliente clicou fora da aba
    if (clickOutsideListener) {
        document.removeEventListener('click', clickOutsideListener);
    }

    clickOutsideListener = (event) => {
        const detailsRow = document.querySelector('.details-row');
        if (detailsRow && !detailsRow.contains(event.target)) {
            closeDetails();
            document.removeEventListener('click', clickOutsideListener);
            clickOutsideListener = null; 
        }
    };
 

    document.addEventListener('click', clickOutsideListener);
}

//Desabilita os botões de editar
function removeEditButtons(){
    document.querySelectorAll("[id^='edit-button-contact-']").forEach(button => {
        button.style.display = "none";
    });
    document.getElementById("edit-button").style.display = "none";
}

//Restaura os botões de editar
function restoreEditButtons(){
    document.querySelectorAll("[id^='edit-button-contact-']").forEach(button => {
        button.style.display = "inline";
    });
    document.getElementById("edit-button").style.display = "flex";
}

//Disabilita os inputs e botões de enviar e cancelar quando for editar o cliente
function disableInputs(id){
    document.getElementById("edit-name").disabled = true;
    document.getElementById("edit-cpf").disabled = true;
    document.getElementById("edit-data-nascimento").disabled = true;
    document.getElementById("edit-address").disabled = true;

    document.getElementById("buttons").style.display = "none";
    restoreEditButtons();
}

//Disabilita os inputs e botões de enviar e cancelar quando for editar os contatos
function disableInputsContact(id) {
    const form = document.querySelector(`form[data-contact-id="${id}"]`);
    
    form.querySelector(`#tipo-${id}`).disabled = true;
    form.querySelector(`#valor-${id}`).disabled = true;
    form.querySelector(`#observacao-${id}`).disabled = true;


    if(form.querySelector(`#observacao-${id}`).value.trim() === "") form.querySelector(`#observacao-area-${id}`).style.display = "none";
    console.log(form.querySelector(`#observacao-area-${id}`).style)
    form.querySelector(`#buttons-contact-${id}`).style.display = "none";
    
    restoreEditButtons();
}

//Restaura as informações que o usuário alterou algo e depois cancelou a ação nas informações do cliente
 function RecoverDetails(element){
    let cpf = element.getAttribute("data-cpf");
    let client = clientes.find(c => c.cpf === cpf);

    if (!client) {
        closeDetails()
        return;
    }

    let dataNascimento = client.data_nascimento.split('/');
    let formattedDate = `${dataNascimento[2]}-${dataNascimento[1]}-${dataNascimento[0]}`;

    const editName = document.getElementById("edit-name");
    const editCpf = document.getElementById("edit-cpf");
    const editDataNascimento = document.getElementById("edit-data-nascimento");
    const editAddress = document.getElementById("edit-address");

    if (editName && editCpf && editDataNascimento && editAddress) {
        editName.value = client.nome;
        editCpf.value = client.cpf;
        editDataNascimento.value = formattedDate;
        editAddress.value = client.endereco;
        return;
    }

    closeDetails()
}

//Restaura as informações que o usuário alterou algo e depois cancelou a ação nas informações dos contatos
async function RecoverDetailsContact(id){
    const contact = await getContactById(id);

    if (!contact) {
        closeDetails()
        return;
    }

    const form = document.querySelector(`form[data-contact-id="${id}"]`);

    form.querySelector(`#tipo-${id}`).value = contact.tipo.toLowerCase();
    form.querySelector(`#valor-${id}`).value = contact.valor; 
    form.querySelector(`#observacao-${id}`).value = contact.observacao || '';
}

//Fecha os detalhes do cliente
function closeDetails() {
    document.querySelectorAll(".details-row").forEach(row => row.remove());
}