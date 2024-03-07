

function serializeDate() {
    const dateObj = new Date()
    const currentYear = dateObj.getFullYear()
    let currentMonth = (dateObj.getMonth() + 1).toString()
    let currentDay = dateObj.getDate().toString()

    if(currentDay.length === 1) {
        currentDay = '0' + currentDay
    } 

    if(currentMonth.length === 1) {
        currentMonth = '0' + currentMonth
    }

    return `${currentYear + currentMonth + currentDay}`
}


let items = []

console.log(items)

const authStr = md5(`Valantis_${serializeDate()}`)


const IDdata = {
	"action": "get_ids",
	"params": {"limit": 50}
}


function addElem(parent, itemData) {
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

console.log(JSON.stringify(IDdata))

const postIDs = async (url, data) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'X-Auth': authStr,
        'Content-type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    return response.json(); 
  }

  let uniqArray = []

  postIDs('http://api.valantis.store:40000/', IDdata)
  .then((data) => {
    const ItemsData = {
        "action": "get_items",
        "params": {"ids": data.result}
    }


    postIDs('http://api.valantis.store:40000/', ItemsData)
    .then((data) => {

        
        uniqArray.push(data.result[0])

        for (let i = 1; i < data.result.length - 1; i++) {

            if(data.result[i].id !== uniqArray[uniqArray.length - 1].id) {
                uniqArray.push(data.result[i])
            }
        }
        console.log(uniqArray)
    }).then(() => {
        let parent = document.querySelector('#parent');

        for (let i = 1; i <= uniqArray.length - 1; i++) {
            addElem(parent, uniqArray[i])
        }
    })
  })