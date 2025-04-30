// Smooth Scroll Effect for Internal Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});

// Button Hover Effect: Scaling Button when Hovered Over
const btn = document.querySelector('.btn-main');

if (btn) {
    btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'scale(1.1)';
        btn.style.transition = 'transform 0.3s ease';
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'scale(1)';
    });
}

// WhatsApp Button Animation
const whatsappButton = document.querySelector('.whatsapp-button');

if (whatsappButton) {
    whatsappButton.addEventListener('mouseenter', () => {
        whatsappButton.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.3)';
    });

    whatsappButton.addEventListener('mouseleave', () => {
        whatsappButton.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.3)';
    });
}

// Toggle Dark/Light Mode (Optional)
const modeToggle = document.createElement('button');
modeToggle.textContent = '🌙';
modeToggle.style.position = 'fixed';
modeToggle.style.top = '20px';
modeToggle.style.right = '20px';
modeToggle.style.padding = '10px';
modeToggle.style.borderRadius = '50%';
modeToggle.style.backgroundColor = '#333';
modeToggle.style.color = '#fff';
modeToggle.style.border = 'none';
modeToggle.style.cursor = 'pointer';
modeToggle.style.fontSize = '20px';
document.body.appendChild(modeToggle);

modeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    modeToggle.textContent = document.body.classList.contains('dark-mode') ? '🌞' : '🌙';
});

// Dark Mode Styles
const styleSheet = document.createElement("style");
styleSheet.innerText = `
    body.dark-mode {
        background-color: #181818;
        color: #fff;
    }
    body.dark-mode header {
        background: url('https://wallpaperaccess.com/full/1963701.jpg') no-repeat center center;
        background-size: cover;
    }
    body.dark-mode .whatsapp-button {
        background-color: #075e54;
    }
    body.dark-mode .whatsapp-button:hover {
        background-color: #128C7E;
    }
    body.dark-mode .btn-main {
        background-color: #ff3b30;
    }
`;
document.head.appendChild(styleSheet);
