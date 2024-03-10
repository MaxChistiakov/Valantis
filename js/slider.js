import { pagination } from './pagination.js'

const partition = (arr, start, end) => {

	const pivot = arr[end]
	let i = start

	for (let j = start; j <= end - 1; j++) {
		if(arr[j].price <= pivot.price) {
			[arr[i], arr[j]] = [arr[j], arr[i]]
			i++
		}
	}

	[arr[i], arr[end]] = [arr[end], arr[i]]
	return i
}

const quickSort = (arr, start, end) => {
	if(start < end) {
		const pi = partition(arr, start, end)

		quickSort(arr, start, pi - 1)
		quickSort(arr, pi + 1, end)
	}
}


export function rangeSlider(itemsArray) {

	const removeHistogramActiveClass = (() => {
		document.querySelectorAll('.histogram-list li').forEach(item => {
			item.classList.remove('ui-histogram-active')
		})
	})

	quickSort(itemsArray, 0, itemsArray.length - 1)

    let maxRangeValue = itemsArray[itemsArray.length - 1].price

	document.querySelector('.upper').addEventListener('input', setFill);
	document.querySelector('.lower').addEventListener('input', setFill);

    document.querySelector('.easy-basket-upper').setAttribute('max', maxRangeValue)
    document.querySelector('.easy-basket-upper').setAttribute('value', maxRangeValue)

	document.querySelector('.upper').setAttribute('max', maxRangeValue)
    document.querySelector('.upper').setAttribute('value', maxRangeValue)

	document.querySelector('.lower').setAttribute('max', maxRangeValue)

	const max = document.querySelector('.upper').getAttribute('max');
	const min = document.querySelector('.lower').getAttribute('min');

	function setFill(evt) {
		const valUpper = document.getElementById('upper').value;
		const valLower = document.getElementById('lower').value;

		if (parseInt(valLower, 10) > parseInt(valUpper, 10)) {
			let trade = valLower;
			valLower = valUpper;
			valUpper = trade;
		}
		
		const width = valUpper * 100 / max;
		const left = valLower * 100 / max;
		document.querySelector('.fill').style.left = 'calc(' + left + '%)';
		document.querySelector('.fill').style.width = width - left + '%';
		
		// Update info
		if (parseInt(valLower, 10) == min) {
			document.querySelector('.easy-basket-lower').value = 0;
		} else {
			document.querySelector('.easy-basket-lower').value = (parseInt(valLower, 10));
		}

		if (parseInt(valUpper) == max) {
			document.querySelector('.easy-basket-upper').value = maxRangeValue;
		} else {
			document.querySelector('.easy-basket-upper').value = (parseInt(valUpper, 10));
		}
		document.querySelector('.histogram-list li').classList.remove('ui-histogram-active');

		let startIndex = itemsArray.findIndex(el => el.price >= valLower)
		let endIndex = itemsArray.findLastIndex(el => el.price <= valUpper)
		let rangeArr = itemsArray.slice(startIndex, endIndex)

		pagination(rangeArr)
	}
	
	// изменяем диапазон цен вручную
	document.querySelector('.easy-basket-filter-info p input').addEventListener('keyup', function() {
		removeHistogramActiveClass()

		const valUpper = document.querySelector('.easy-basket-upper').value
		const valLower = document.querySelector('.easy-basket-lower').value
		const width = valUpper * 100 / max
		let left = valLower * 100 / max

		document.querySelector('.fill').style.left = 'calc(' + left + '%)'
		document.querySelector('.fill').style.width = width - left + '%'
		
		document.querySelector('.lower').value = valLower
		document.querySelector('.upper').value = valUpper
	});

	document.querySelectorAll('.easy-basket-filter-info p input').forEach((el) => {
		el.addEventListener('focus', function() {
			el.value = ''	
		});
	})

	document.querySelector('.easy-basket-filter-info .iLower input').addEventListener('blur', function() {
		const valLower = document.querySelector('.lower').value
		document.querySelector('.easy-basket-filter-info .iLower input').value = Math.floor(valLower)
	});

	document.querySelector('.easy-basket-filter-info .iUpper input').addEventListener('blur', function() {
		const valUpper = document.querySelector('.upper').value
		document.querySelector('.easy-basket-filter-info .iUpper input').value = Math.floor(valUpper)
	});

	let histogramPriceRanges = []

	let histogramRange = Math.round(itemsArray[itemsArray.length - 1].price / 5)

	for (let i = 0; i < 5; i++) {
		if(i === 0) {
			histogramPriceRanges.push({
				from: 0,
				to: histogramRange
			})
		} else if(i === 4) {
			histogramPriceRanges.push({
				from: i * histogramRange,
				to: itemsArray[itemsArray.length - 1].price
			})
		} else {
			histogramPriceRanges.push({
				from: i * histogramRange,
				to: (i + 1) * histogramRange
			})
		}
	}

	let histogramAllocation = []
	let lastLimit = 0

	let histogramRangeIndexes = []

	document.querySelectorAll('.histogram-baloon').forEach((el, index) => {

		let limit = histogramPriceRanges[index].to

		let quantity = (itemsArray.findLastIndex((item) => {
			return item.price <= limit
		}) + 1)

		histogramAllocation.push(quantity - lastLimit)

		el.textContent = `в этом диапазоне ${quantity - lastLimit} товаров`

		histogramRangeIndexes.push({
			from: lastLimit,
			to: quantity
		})

		lastLimit = quantity
	})


	 let biggerAllocationQuantity = 0

	 for (let i = 0; i < histogramAllocation.length - 1; i++) {
		if(histogramAllocation[i] > biggerAllocationQuantity) {
			biggerAllocationQuantity = histogramAllocation[i]
		}
	 }

	document.querySelectorAll('.histogram-height').forEach((el, index) => {
		let percentage = ((histogramAllocation[index] / biggerAllocationQuantity) * 100)

		el.style.height = `${(100 - percentage)}%`
	})

	document.querySelectorAll('.histogram-list li').forEach((item, index) => {

		document.getElementById(`price-range-${index + 1}`).setAttribute('price-range-from', histogramPriceRanges[index].from)
		document.getElementById(`price-range-${index + 1}`).setAttribute('price-range-to', histogramPriceRanges[index].to)

		item.addEventListener('click', function() {
			removeHistogramActiveClass()

			let startIndex = histogramRangeIndexes[index].from
			let endIndex = histogramRangeIndexes[index].to
			let rangeArr = itemsArray.slice(startIndex, endIndex)

			pagination(rangeArr)

			const range_from = item.getAttribute('price-range-from')
			const range_to = item.getAttribute('price-range-to');

			let width = range_to * 100 / max;
			let left = range_from * 100 / max;

			document.querySelector('.easy-basket-lower').value = range_from;
			document.querySelector('.easy-basket-upper').value = range_to;
			document.querySelector('.fill').style.left = 'calc(' + left + '%)'
			document.querySelector('.fill').style.width = width - left + '%'
			document.querySelector('.lower').value = range_from
			document.querySelector('.upper').value = range_to
			item.classList.add('ui-histogram-active');
		});
	})
}