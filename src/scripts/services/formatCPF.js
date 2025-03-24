window.formatCPF = function(cpf) {
    console.log(cpf);
    cpf = String(cpf);
    cpf = cpf.replace(/\D/g, "");
    return `${cpf.substring(0, 3)}.${cpf.substring(3,6)}.${cpf.substring(6,9)}-${cpf.substring(9,11)}`;
};

window.checkCpfExists = async function(cpf) {
    const response = await fetch(`http://localhost:8080/cliente/check-cpf/${cpf}`);
    if (response.ok) return await response.json();
    return false;
};