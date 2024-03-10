export function createItemCard(parent, itemData) {
    let div = document.createElement('div');
    let attr = document.createAttribute('class')
    attr.value = 'item-card'
    div.setAttributeNode(attr);

    parent.appendChild(div);

    div.setAttributeNode(attr);

    div.innerHTML = `
        <p>item id: ${itemData.id}<br/>
        brand: ${itemData.brand}<br/>
        price: ${itemData.price}<br/>
        name: ${itemData.product}</p>
    `
    parent.appendChild(div);
}
