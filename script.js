document.getElementById('get-started').addEventListener('click', function() {
    alert('Getting started! Redirecting to the signup page...');
    // Redirect to signup page (you can create one)
    window.location.href = '#contact';
});

// Smooth scrolling for internal links
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
