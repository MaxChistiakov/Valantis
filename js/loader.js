export function showLoader() {
    const content = document.querySelector('.wrapper')
    const loader = document.createElement('span')
    loader.classList.add('loader')
    content.appendChild(loader)
}