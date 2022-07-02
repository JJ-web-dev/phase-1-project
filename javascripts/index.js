document.addEventListener('DOMContentLoaded', function () {
    fetchOnSaleGames()
    loadHome()
    homeLink()
    dealsByStoreLink()

})


/** Global Variables */


/** Event Listeners */
function homeLink() {
    const homeLink = document.querySelector('.home-link')
    homeLink.addEventListener('click', loadHome)

}

function dealsByStoreLink() {
    const dealsByStoreLink = document.querySelector('.deals-by-store')
    dealsByStoreLink.addEventListener('click', loadDealsByStore)
}

/**Node Getters */
let main = () => document.getElementById('main')
let storeDeals = () => document.getElementById('store-deals')
let homeGames = () => document.getElementById('home-games')


/**Navbar Functions */
/**Resets all divs on navigation */
const divReset = () => {
    main().innerHTML = ''
    storeDeals().innerHTML = ''
    // homeGames().innerHTML = ''
}

// Home screen load 
function loadHome() {
    divReset()
    let h1 = document.createElement('h1')
    h1.textContent = "Deals of the Day!"
    h1.className = 'center-align'
    main().appendChild(h1)
    fetchOnSaleGames()

}


function loadDealsByStore() {
    divReset()
    let h1 = document.createElement('h1')
    h1.textContent = "Shop By Store"
    h1.className = 'center-align'
    storeDeals().appendChild(h1)
}

/**Fetch Functions */
async function fetchOnSaleGames() {
    const response = await fetch('https://www.cheapshark.com/api/1.0/deals?onSale')
    const data = await response.json()

    // filterUniqueGames(data) 
    //value of the new Set() can only occur once will, delete repeats
    const uniqueId = new Set()
    const uniqueGames = data.filter(game => {
        const isDuplicate = uniqueId.has(game.gameID)
        uniqueId.add(game.gameID)

        if (!isDuplicate) {
            return true
        }
        return false
    });

    const div = document.createElement('div')
    div.id = 'home-games'
    main().appendChild(div)
    const ul = document.createElement('ul')
    ul.id = 'game-grid'
    div.appendChild(ul)

    uniqueGames.map(g => {
        if (g.dealRating >= 9.8) {
            const li = document.createElement('li')
            li.className = 'game-container'
            li.innerText = `${g.title}`
            const pSalePrice = document.createElement('p')
            pSalePrice.innerText = `Sale Price ${g.salePrice}`
            const spanNormalPrice = document.createElement('span')
            spanNormalPrice.innerText = `Normal Price ${g.normalPrice}`
            const img = document.createElement('img')
            img.className = 'homeGameImg'
            img.src = g.thumb
            ul.appendChild(li)
            li.appendChild(img)
            li.appendChild(spanNormalPrice)
            li.appendChild(pSalePrice)

        }

    })


}

/**Fetch data manipulation */