import { pagination } from "./pagination.js"

export function searchByBrand(itemsArray) {
    const selector = document.getElementById('brand-selector')

    let brandsArray = []

    let brandsSet = new Set()

    itemsArray.forEach(item => {
        if(item.brand != null) {
            brandsArray.push(item)

            brandsSet.add(item.brand)
        }
    });

    for(let brand of brandsSet) {
        const brandSelectorOption = document.createElement('option')
        brandSelectorOption.classList.add('brand-option')
        brandSelectorOption.setAttribute('value', brand)
        brandSelectorOption.text = brand
        selector.appendChild(brandSelectorOption)
    }

    selector.addEventListener('change', (e) => {

        let filteredByBrandView = []

        brandsArray.forEach(item => {
            if(item.brand === e.target.value) {
                filteredByBrandView.push(item)
            }
        })

        pagination(filteredByBrandView)
    })
}

