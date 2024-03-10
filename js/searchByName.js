import { pagination } from "./pagination.js"

export function searchByName(itemsArray) {

    let result = []
    let searchValue

    const button = document.getElementById('findNameButton')

    button.addEventListener('click', function() {
        searchValue = document.getElementById('findNameInput').value
        
        itemsArray.forEach(el => {
            if(el.product.includes(searchValue)) {
                result.push(el)
            }
        });
        pagination(result)
    })
}


