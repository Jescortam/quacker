const button = document.querySelector('.btn-close');
const flash = document.querySelector('.card-flash');

// Closes the flash banner
if (button && flash) {
    button.addEventListener('click', () => {
        flash.style.display = 'none';
    })
}