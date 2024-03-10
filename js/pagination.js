import { createItemCard } from './card.js'

export function pagination(itemsArray) {
    const content = document.getElementById('pagination')
    content.innerHTML = ''
    let parent = document.getElementById('parent');

    const itemsPerPage = 50
    let currentPage = 0
    const items = itemsArray

    function showPage(page) {
        parent.innerHTML = ''

        const startIndex = page * itemsPerPage
        const endIndex = startIndex + itemsPerPage

        let currentItems = items.slice(startIndex, endIndex)
    
        for (let i = 0; i <= currentItems.length - 1; i++) {
            createItemCard(parent, currentItems[i])
        }

        updateActiveButtonStates()
    }

    function createPageButton() {
        const totalPages = Math.ceil(items.length / itemsPerPage)

        const paginationContainer = document.createElement('div');
        paginationContainer.classList.add('pagination');
    
        for (let i = 0; i < totalPages; i++) {
            const pageButton = document.createElement('button')
            pageButton.classList.add('pagination-button')
            pageButton.textContent = i + 1    
            pageButton.addEventListener('click', function(){
                currentPage = i
                showPage(currentPage)
                updateActiveButtonStates()
            })    
            content.appendChild(paginationContainer);
            paginationContainer.appendChild(pageButton);
        }
    }

    function updateActiveButtonStates() {
        const pageButtons = document.querySelectorAll('.pagination button')
        pageButtons.forEach((button, index) => {
            if(index == currentPage) {
                button.classList.add('active')
            } else {
                button.classList.remove('active')
            }
        })
    }

    createPageButton()
    showPage(currentPage)
}