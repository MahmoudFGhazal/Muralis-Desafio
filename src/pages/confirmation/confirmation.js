//Capita a chamada do modal de confirmação
//Adiciona os eventos do modal
document.addEventListener("DOMContentLoaded", function() {
    function showModal(data) {
        document.getElementById('confirmationModal').style.display = 'flex';

        const modalContent = document.querySelector('#info-content');
        
        if (modalContent) {
            modalContent.innerHTML = data; 
        } else {
            console.error("Elemento 'info-content' não encontrado.");
        }

        document.getElementById('confirmationModal').style.display = 'flex';
    }


    function hideModal() {
        document.getElementById('confirmationModal').style.display = 'none';
    }


    window.addEventListener("message", function(event) {
        if (event.data.action === "showModal") {
            showModal(event.data.data); 
        }
    });

    document.getElementById('confirmBtn').addEventListener('click', function() {
        window.parent.postMessage("confirmed", "*");
        hideModal();
    });

    document.getElementById('cancelBtn').addEventListener('click', function() {
        window.parent.postMessage("cancelled", "*");
        hideModal();
    });
});