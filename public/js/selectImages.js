const imgs = document.querySelectorAll('.delete-img');
let selectionLength = document.querySelector('#selection-length');

console.log(imgs);

for (let img of imgs) {
    img.addEventListener('click', () => {
        img.classList.toggle('selected');
        selectionLength.textContent = document.querySelectorAll('.selected').length;
    })
}