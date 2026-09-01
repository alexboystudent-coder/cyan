document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');
    const scene = document.querySelector('.scene');

    cards.forEach(card => {
        // Dinamikus 3D Dőlés Egerészés közben
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // Kurzor X pozíciója a kártyán belül
            const y = e.clientY - rect.top;  // Kurzor Y pozíciója a kártyán belül

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Forgatási szögek kiszámítása (max +- 20 fok)
            const rotateX = ((y - centerY) / centerY) * -18;
            const rotateY = ((x - centerX) / centerX) * 18;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(30px)`;
        });

        // Kurzor elhagyásakor visszááll alaphelyzetbe
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        });

        // Átirányítás és Zoom animáció kattintásra
        card.addEventListener('click', (e) => {
            e.preventDefault();
            const targetUrl = card.getAttribute('href');

            if (scene) scene.classList.add('zooming');
            card.classList.add('selected');

            setTimeout(() => {
                window.location.href = targetUrl;
            }, 550);
        });
    });
});