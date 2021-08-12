const button = document.querySelector('.navbar-collapse-button');
const dropdown = document.querySelector('.navbar-links');

if (button && flash) {
    button.addEventListener('click', () => {
        dropdown.style.display = 'none';
    })
}