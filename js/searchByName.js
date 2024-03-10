import { pagination } from "./pagination.js"

export function searchByName(itemsArray) {

    let result = []
    let searchValue

    const button = document.getElementById('findNameButton')

    button.addEventListener('click', function() {
        searchValue = document.getElementById('findNameInput')
        
        itemsArray.forEach(el => {
            if(el.product.includes(searchValue.value)) {
                result.push(el)
            }
        });
        searchValue.value = ''

        pagination(result)
    })
}


