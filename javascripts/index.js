document.addEventListener('DOMContentLoaded', function () {

    loadHome()
    homeLink()
    shoppingCartLink()
    wishlistLink()


})





/** Event Listeners */
function homeLink() {
    const homeLink = document.querySelector('.home-link')
    homeLink.addEventListener('click', loadHome)

}

function shoppingCartLink() {
    // const dealsByStoreLink = document.querySelector('.deals-by-store')
    shoppingCart().addEventListener('click', loadShoppingCart)
}

function wishlistLink() {
    const wishlistLink = document.querySelector('.wishlist')
    wishlistLink.addEventListener('click', loadWishList)
}

function mousePointerChange() {

    const mouseOver = document.querySelectorAll('.add-to-wishlist')

    mouseOver.forEach(item => item.addEventListener('mouseover', function (e) {
        e.target.style.cursor = 'pointer'

    }))
    const mouseOut = document.querySelectorAll('.add-to-wishlist')
    mouseOut.forEach(item => item.addEventListener('mouseout', function (e) {
        e.target.style.cursor = 'default'


    }))
}

function gameContainerHover(container) {

    const mouseOver = document.querySelectorAll(container)


    mouseOver.forEach(item => item.addEventListener('mouseover', function (e) {
        e.target.style.filter = 'drop-shadow(0 0 .8rem #00d659)'


    }))
    const mouseOut = document.querySelectorAll(container)
    mouseOut.forEach(item => item.addEventListener('mouseout', function (e) {
        e.target.style.filter = 'none'


    }))
}

/**Node Getters */
let main = () => document.getElementById('main')
let shoppingCart = () => document.getElementById('shopping-cart')
let cart = () => document.getElementById('cart')
let wishlist = () => document.getElementById('wishlist')
let homeGames = () => document.getElementById('home-games')


/**Navbar Functions */
/**Resets all divs on navigation */
const divReset = () => {
    main().innerHTML = ''
    cart().innerHTML = ''
    wishlist().innerHTML = ''
}

// Home screen load 
function loadHome() {
    divReset()
    let h1 = document.createElement('h1')
    h1.textContent = "Deals of the Day!"
    h1.className = 'center-align'
    main().appendChild(h1)
    fetchOnSaleGames()
    searchGames()
    searchAndLoadHome()
    setTimeout(postWishlistGame, 2000)
    setTimeout(mousePointerChange, 2000)
    setTimeout(gameContainerHover, 2000, '.game-container')
}


function loadShoppingCart() {
    divReset()
    let h1 = document.createElement('h1')
    h1.textContent = "Your Cart"
    h1.className = 'center-align'
    cart().appendChild(h1)
}

function loadWishList() {
    divReset()
    let h1 = document.createElement('h1')
    h1.textContent = 'WishList'
    h1.className = 'center-align'
    wishlist().appendChild(h1)
    wishlistGamesToDOM()
    setTimeout(gameContainerHover, 1000, '.wishlist-container')
    setTimeout(deleteWishlistGame, 500)

}



/**Fetch Functions */
/**Fetch the games on sale from api which are used on homepage
-Games come in from api with duplicates - duplicates pulled out with filterUniqueGames
-Games come in from api with a deal rating 1-10; 10 being the best deal - filterGameDeals 
sets games based on rating to be rendered pn home
-The games are rendered on homepage with function gameOnDom
*/
async function fetchOnSaleGames() {
    const response = await fetch('https://www.cheapshark.com/api/1.0/deals?onSale')
    const data = await response.json()
    const filteredBrokenData = data.filter(item => {
        return item.gameID !== '223187'
    })

    const games = await filterUniqueGames(filteredBrokenData)

    const filterGames = filterGameDeals(games)

    gameOnDom(filterGames)

}

function filterGameDeals(game) {
    let gameDeal = []
    game.map(games => {
        if (games.dealRating >= 9.5) {

            gameDeal.push(games)
        }
    })
    return gameDeal
}



//Search bar for games on homepage
function searchGames() {
    const div = document.createElement('div')
    div.className = 'form-div'
    const form = document.createElement('form')
    form.className = 'home-search'
    const searchBar = document.createElement('input')
    searchBar.type = 'text'
    searchBar.className = 'title-input'
    searchBar.name = 'search'
    searchBar.placeholder = 'Search By Game Title'
    const input = document.createElement('input')
    input.className = 'input-button'
    input.type = 'submit'
    input.name = 'submit'
    input.value = 'Search'
    const span = document.createElement('span')
    span.className = 'text-under-search'
    span.textContent = 'Add A Game To Your Wishlist To Track The Daily Price'
    main().appendChild(div)
    div.append(form, span)
    form.append(searchBar, input)

}

function searchAndLoadHome() {


    document.querySelector('form').addEventListener('submit', e => {
        e.preventDefault()
        const homeGames = document.getElementById('home-games')
        homeGames.innerHTML = ''
        homeGames.remove()
        const searchArea = document.querySelector('.title-input')
        const h1 = document.querySelector('h1')
        h1.textContent = 'Search Results'

        const searchTerms = e.target[0].value


        fetch(`https://www.cheapshark.com/api/1.0/deals?title=${searchTerms}`)
            .then(response => response.json())
            .then(response => {

                const uniqueSearchedGames = filterUniqueGames(response)
                gameOnDom(uniqueSearchedGames)
                searchArea.value = ''
                setTimeout(postWishlistGame, 1000)
                setTimeout(mousePointerChange, 1500)
                setTimeout(gameContainerHover, 1000)
            })
    })



}



//Need to add alert once successful post is made
//Posts game from home page to the wishlist page
function postWishlistGame() {

    const addWishListEvent = document.querySelectorAll('.add-to-wishlist')

    addWishListEvent.forEach(item => item.addEventListener('click', e => {

        const gameID = (e.target.id)
        e.target.textContent = 'Game Added to Wishlist'
        e.target.style.color = 'crimson'
        e.target.style.background = 'black'
        console.log(gameID)


        fetch('http://localhost:3000/posts', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify({
                id: gameID
            })
        })

        fetch(`https://www.cheapshark.com/api/1.0/games?id=${gameID}`)
            .then(response => response.json())
            .then(response => {
                const gameInfo = response


                console.log(gameInfo)


                fetch(`http://localhost:3000/posts/${gameID}`, {
                    method: 'PATCH',
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json"
                    },
                    body: JSON.stringify(gameInfo)
                })

            })



    }))
}

//This function deletes games from the wishlist page and json server
function deleteWishlistGame() {
    const deleteBtn = document.querySelectorAll('.wishlist-delete-btn')

    deleteBtn.forEach(item => item.addEventListener('click', e => {

        const wishlistGameDelete = e.target.id

        const parentElement = e.target.parentElement
        parentElement.innerHTML = ''

        fetch(`http://localhost:3000/posts/${wishlistGameDelete}`, {
            method: "DELETE",
            headers: {
                'Content-type': 'application/json'
            }
        })
    }))
}

//Loads games that were added to json wishlist on wishlist page
async function wishlistGamesToDOM() {
    const response = await fetch('http://localhost:3000/posts')
    const wishlistData = await response.json()

    const apiResponse = await fetch('https://www.cheapshark.com/api/1.0/stores')
    const storeData = await apiResponse.json()
    // console.log(storeData)
    // storeData.map(id => {
    // const storeID = id.storeID
    // console.log(storeData)
    // const bestPrice = 

    const div = document.createElement('div')
    div.id = 'wishlist-games'
    wishlist().appendChild(div)
    const ul = document.createElement('ul')
    ul.id = 'wishlist-grid'
    div.appendChild(ul)

    const [firstElement, ...restArray] = wishlistData
    // console.log(restArray)
    restArray.map(g => {
        let info = g.info
        const gamesID = g.id
        // console.log(gamesID)

        async function fetchGameId() {
            const gameSearchById = await fetch(`https://www.cheapshark.com/api/1.0/games?id=${gamesID}`)
            const gameIDs = await gameSearchById.json()
            console.log(gameIDs)
            let deals = gameIDs.deals[0].price
            let storeNumber = gameIDs.deals[0].storeID
            let historicalLow = gameIDs.cheapestPriceEver.price
            console.log(historicalLow)
            const storeID = storeData.find(item => item.storeID === storeNumber)
            console.log(storeID)
            console.log(storeID.images.icon)


            //was geting undefined to access nested object - this accesses next leve key from existing object or empty object
            const title = ((info || {}).title)
            const thumb = ((info || {}).thumb)
            const id = g.id


            const li = document.createElement('li')
            li.className = 'wishlist-container'
            const h4 = document.createElement('h4')
            h4.textContent = `${title}`
            const img = document.createElement('img')
            img.className = 'wishlistGameImg'
            img.src = thumb
            const spanBestPrice = document.createElement('span')
            spanBestPrice.className = 'best-price'
            spanBestPrice.textContent = `Best Price ${deals}`
            const cheapestPriceEver = document.createElement('span')
            cheapestPriceEver.className = 'cheapest-price-ever'
            cheapestPriceEver.textContent = `Cheapest Price Ever ${historicalLow}`
            const spanStoreName = document.createElement('span')
            spanStoreName.className = 'store-name'
            spanStoreName.textContent = `Online Store: ${storeID.storeName}`
            const storeImg = document.createElement('img')
            storeImg.className = 'store-banner'
            storeImg.src = `https://www.cheapshark.com${storeID.images.banner}`
            const btn = document.createElement('button')
            btn.className = 'wishlist-delete-btn'
            btn.textContent = 'Remove'
            btn.id = id
            ul.appendChild(li)
            li.append(h4, img, spanBestPrice, cheapestPriceEver, spanStoreName, storeImg, btn)
        }
        fetchGameId()
    })


}




// filters the onSaleGames so no repeat games are rendered
function filterUniqueGames(data) {
    const uniqueId = new Set()
    const uniqueGames = data.filter(game => {
        const isDuplicate = uniqueId.has(game.gameID)
        uniqueId.add(game.gameID)

        if (!isDuplicate) {
            return true
        }
        return false
    });

    return uniqueGames

}

//adds games to the homepage DOM
function gameOnDom(uniqueGames) {

    const div = document.createElement('div')
    div.id = 'home-games'
    main().appendChild(div)
    const ul = document.createElement('ul')
    ul.id = 'game-grid'
    div.appendChild(ul)

    uniqueGames.map(g => {

        const li = document.createElement('li')
        li.className = 'game-container'
        const h4 = document.createElement('h4')
        h4.textContent = `${g.title}`
        const spanSalePrice = document.createElement('span')
        spanSalePrice.className = 'sale-price'
        spanSalePrice.textContent = `Sale Price ${g.salePrice}`
        const spanNormalPrice = document.createElement('span')
        spanNormalPrice.textContent = `Normal Price ${g.normalPrice}`
        const img = document.createElement('img')
        img.className = 'homeGameImg'
        img.src = g.thumb
        const shoppingCartBtn = document.createElement('button')
        shoppingCartBtn.className = 'add-to-shopping-cart'
        shoppingCartBtn.id = g.gameID
        shoppingCartBtn.textContent = 'Add to Cart'
        const addWishlist = document.createElement('button')
        addWishlist.className = 'add-to-wishlist'
        addWishlist.id = g.gameID
        addWishlist.textContent = 'Add Wishlist'
        ul.appendChild(li)
        li.append(h4, img, spanNormalPrice, spanSalePrice, shoppingCartBtn, addWishlist)


    })
}