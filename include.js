//global header and footer//
const isWorldPage = window.location.pathname.includes('/world/');

const basePath = isWorldPage ? '../' : '';

fetch(basePath + 'header.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('header').innerHTML = data;
    });

fetch(basePath + 'footer.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('footer').innerHTML = data;
    });