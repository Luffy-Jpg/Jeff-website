// Smooth scrolling when 'Learn More' button is clicked
document.querySelector('.btn-main').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' });
});
