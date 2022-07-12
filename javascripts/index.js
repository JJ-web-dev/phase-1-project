document.addEventListener('DOMContentLoaded', function () {
    loadHome()
    homeLink()
    wishlistLink()


})
/** Event Listeners */
function homeLink() {
    const homeLink = document.querySelector('.home-link')
    homeLink.addEventListener('click', loadHome)

}

function wishlistLink() {
    const wishlistLink = document.querySelector('.wishlist')
    wishlistLink.addEventListener('click', loadWishList)
}
//changes mouse pointer to a 'finger' pointer
//should make this with a peram for all btns***
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
//Green hover effect on game containers
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

function purchaseWindow(storedealID){
    const purchase = document.querySelectorAll('.purchase')
    purchase.forEach(item => item.addEventListener('click', e => {
       window.open(`https://www.cheapshark.com/redirect?dealID=${storedealID}`)
    }))
}
/**Node Getters */
let main = () => document.getElementById('main')
let cart = () => document.getElementById('cart')
let wishlist = () => document.getElementById('wishlist')
let homeGames = () => document.getElementById('home-games')


/**Navbar Functions */
/**Resets all divs on navigation */
const divReset = () => {
    main().innerHTML = ''
    wishlist().innerHTML = ''
}
//Home screen load 
//Adds initial deal rated games to DOM with fetchOnSaleGames
//SearchGames creates the search bar
//SearchAndLoadHome provides search function and loads games after search is submitted
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
//Loads the wishlist page
//green hover effect from gameContainerHover
//deletWishlistGame deletes games from wishlist when button clicked
function loadWishList() {
    divReset()
    const div = document.createElement('div')
    div.className = 'wish-list-div'
    const h1 = document.createElement('h1')
    h1.textContent = 'Wish List'
    h1.className = 'center-align'
    const span = document.createElement('span')
    span.className = 'text-under-search'
    span.textContent = 'Click On The Game Website Banner Below The Game Price To Be Redirected To Purchase Game'
    wishlist().appendChild(div)
    div.append(h1, span)
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
    filterGames.map(item => {
        const deal = item.dealID
        setTimeout(purchaseWindow, 800, deal)
    })
}

//This function is used to filter games by a particular game deal rating 1-10, with 10 being the top rated deal
//This is set by dev but could be placed in drop down to let User select which rating to be displayed
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
//search bar - searches by title through fetch after submit
//runs the games through the filter function and those values are passed into gameOnDOM function
//post to wishlist functionality is present after search with postWishlistGame function
function searchAndLoadHome() {

    document.querySelector('form').addEventListener('submit', e => {
        e.preventDefault()
        const homeGames = document.getElementById('home-games')
        homeGames.innerHTML = ''
        //using .remove to remove the previous searched games
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
//Posts game with .add-to-wishlist button
//initial POST is the gameID which is not present in data when fetch by gameID is done / to carry over ID-
//gameID is posted as the id in json / fetch to api with gameID is iniated and gameID data is patched using gameID
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
//Clears entire parentElement when clicked
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
//fetch(1) games that were added to json wishlist on wishlist page
//fetch(2) store data which includes banners and logos
//fetch(3) gets cheapest game price data by gameID and the historical low on game price - fetch of api should occur on every load- 
//to give most recent data  
async function wishlistGamesToDOM() {
    const response = await fetch('http://localhost:3000/posts')
    const wishlistData = await response.json()
      
    const apiResponse = await fetch('https://www.cheapshark.com/api/1.0/stores')
    const storeData = await apiResponse.json()
    
    const div = document.createElement('div')
    div.id = 'wishlist-games'
    wishlist().appendChild(div)
    const ul = document.createElement('ul')
    ul.id = 'wishlist-grid'
    div.appendChild(ul)

    const [firstElement, ...restArray] = wishlistData
    
    restArray.map(g => {
        let info = g.info
        const gamesID = g.id
    

        async function fetchGameId() {
            const gameSearchById = await fetch(`https://www.cheapshark.com/api/1.0/games?id=${gamesID}`)
            const gameIDs = await gameSearchById.json()

            const deals = gameIDs.deals[0].price
            const storeNumber = gameIDs.deals[0].storeID
            const storedealID = gameIDs.deals[0].dealID
            let historicalLow = gameIDs.cheapestPriceEver.price
            const storeID = storeData.find(item => item.storeID === storeNumber)
            
            //was geting undefined to access nested object - this accesses next leve key from existing object or creates empty object to use
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
            const purchaseBtn = document.createElement('button')
            purchaseBtn.className = 'purchase'
            purchaseBtn.textContent = 'Purchase'
            const storeImg = document.createElement('img')
            storeImg.className = 'store-banner'
            storeImg.src = `https://www.cheapshark.com${storeID.images.banner}`
            const btn = document.createElement('button')
            btn.className = 'wishlist-delete-btn'
            btn.textContent = 'Remove'
            btn.id = id
            ul.appendChild(li)
            li.append(h4, img, spanBestPrice, cheapestPriceEver, spanStoreName, storeImg, purchaseBtn, btn)
            setTimeout(purchaseWindow, 800, storedealID)
             
        }
        fetchGameId()
    })
}

//Filters the onSaleGames so no repeat games are rendered
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

//Adds games to the homepage DOM
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
        const purchaseBtn = document.createElement('button')
        purchaseBtn.className = 'purchase'
        purchaseBtn.id = g.gameID
        purchaseBtn.textContent = 'Purchase'
        const addWishlist = document.createElement('button')
        addWishlist.className = 'add-to-wishlist'
        addWishlist.id = g.gameID
        addWishlist.textContent = 'Add Wishlist'
        ul.appendChild(li)
        li.append(h4, img, spanNormalPrice, spanSalePrice, purchaseBtn, addWishlist)
    })
}