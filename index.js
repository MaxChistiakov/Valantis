import { showLoader } from './js/loader.js'
import { rangeSlider } from "./js/slider.js"
import { pagination } from "./js/pagination.js"
import { searchByName } from "./js/searchByName.js"
import { searchByBrand } from "./js/searchByBrand.js"


// подготавливаем дату для авторизации
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

const AUTH_KEY = md5(`Valantis_${serializeDate()}`)
const URL_KEY = 'http://api.valantis.store:40000/'
const RESERVED_URL = 'https://api.valantis.store:41000/'

const IDdata = {
	"action": "get_ids",
	"params": {"limit": 300}
}

async function fetchRequest (url, data) {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'X-Auth': AUTH_KEY,
        'Content-type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    return response.json(); 
}

let uniqArray = []

document.querySelector('.filters').style.display = 'none'
document.querySelector('.item-list').style.display = 'none'
document.getElementById('pagination').style.display = 'none'

showLoader()

fetchRequest(RESERVED_URL, IDdata)
.then((data) => {
    const ItemsData = {
        "action": "get_items",
        "params": {"ids": data.result}
    }

    fetchRequest(RESERVED_URL, ItemsData)
    .then((data) => {
        
        uniqArray.push(data.result[0])

        for (let i = 1; i < data.result.length - 1; i++) {

            if(data.result[i].id !== uniqArray[uniqArray.length - 1].id) {
                uniqArray.push(data.result[i])
            }
        }

        document.querySelector('.filters').style.display = 'flex'
        document.querySelector('.item-list').style.display = 'flex'
        document.getElementById('pagination').style.display = 'flex'

        rangeSlider(uniqArray)
        pagination(uniqArray)
        searchByName(uniqArray)
        searchByBrand(uniqArray)

        document.querySelector('.loader').remove()
    })
})