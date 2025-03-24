//mudar o nome e a imagem da aba do site
window.onload = function() {
    let link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/png'
    link.href = '../../assets/images/Muralis-Logo.png'

    document.head.appendChild(link);

    document.title = 'Muralis'
};