const imgs = document.querySelectorAll('.delete-img');
let selectionLength = document.querySelector('#selection-length');

// Makes the images change style when selected
for (let img of imgs) {
    img.addEventListener('click', () => {
        img.classList.toggle('selected');
        selectionLength.textContent = document.querySelectorAll('.selected').length;
    })
}