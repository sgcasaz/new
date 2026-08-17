// menu toggle

document.addEventListener('DOMContentLoaded', () => {

    setTimeout(() => {

        const toggle = document.getElementById('menu-toggle');
        const nav = document.getElementById('nav');

        if (toggle && nav) {

            toggle.addEventListener('click', () => {
                nav.classList.toggle('active');
            });

        }

    }, 300);

});



