document.addEventListener('DOMContentLoaded', function () {
    loadHome()
    homeLink()
    dealsByStoreLink()
    wishlistLink()
    // setTimeout(postWishlistGame, 2000)
    wishlistGamesToDOM()






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

function wishlistLink() {
    const wishlistLink = document.querySelector('.wishlist')
    wishlistLink.addEventListener('click', loadWishList)
}

function mousePointerChange() {

    const mousePointer = document.querySelector('#game-grid')
    console.log(mousePointer)
    mousePointer.addEventListener('mouseover', function (e) {
        e.target.style.color = 'orange';
    })
}

/**Node Getters */
let main = () => document.getElementById('main')
let storeDeals = () => document.getElementById('store-deals')
let wishlist = () => document.getElementById('wishlist')
let homeGames = () => document.getElementById('home-games')


/**Navbar Functions */
/**Resets all divs on navigation */
const divReset = () => {
    main().innerHTML = ''
    storeDeals().innerHTML = ''
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
    setTimeout(postWishlistGame, 2000)
}


function loadDealsByStore() {
    divReset()
    let h1 = document.createElement('h1')
    h1.textContent = "Shop By Store"
    h1.className = 'center-align'
    storeDeals().appendChild(h1)
}

function loadWishList() {
    divReset()
    let h1 = document.createElement('h1')
    h1.textContent = 'WishList'
    h1.className = 'center-align'
    wishlist().appendChild(h1)
    wishlistGamesToDOM()

}



/**Fetch Functions */
async function fetchOnSaleGames() {
    const response = await fetch('https://www.cheapshark.com/api/1.0/deals?onSale')
    const data = await response.json()

    const games = await filterUniqueGames(data)

    const filterGames = filterGameDeals(games)

    gameOnDom(filterGames)

}

function filterGameDeals(game) {
    let gameDeal = []
    game.map(games => {
        if (games.dealRating >= 9.6) {

            gameDeal.push(games)
        }
    })
    return gameDeal
}

//Need to add alert once successful post is made
function postWishlistGame() {

    const addWishListEvent = document.querySelectorAll('.add-to-wishlist')

    addWishListEvent.forEach(item => item.addEventListener('click', e => {

        const gameID = e.target.id
          console.log(gameID)

        fetch(`https://www.cheapshark.com/api/1.0/games?id=${gameID}`)
            .then(response => response.json())
            .then(response => {
                const gameInfo = response.info


                fetch('http://localhost:3000/posts', {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json"
                    },
                    body: JSON.stringify(gameInfo)
                })

            })
    }))
}
//Loads games that were added to json wishlist on wishlist page
async function wishlistGamesToDOM(game) {
    const response = await fetch('http://localhost:3000/posts')
    const wishlistData = await response.json()
    

    const div = document.createElement('div')
    div.id = 'wishlist-games'
    wishlist().appendChild(div)
    const ul = document.createElement('ul')
    ul.id = 'game-grid'
    div.appendChild(ul)

    const [firstElement, ...restArray] = wishlistData 
    
    restArray.map(g => {

        const li = document.createElement('li')
        li.className = 'game-container'
        li.innerText = `${g.title}`
        const img = document.createElement('img')
        img.className = 'wishlistGameImg'
        img.src = g.thumb
        ul.appendChild(li)
        li.appendChild(img)


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
    // console.log(uniqueGames)
    const div = document.createElement('div')
    div.id = 'home-games'
    main().appendChild(div)
    const ul = document.createElement('ul')
    ul.id = 'game-grid'
    div.appendChild(ul)

    uniqueGames.map(g => {

        const li = document.createElement('li')
        li.className = 'game-container'
        li.innerText = `${g.title}`
        const spanSalePrice = document.createElement('span')
        spanSalePrice.innerText = `Sale Price ${g.salePrice}`
        const spanNormalPrice = document.createElement('span')
        spanNormalPrice.innerText = `Normal Price ${g.normalPrice}`
        const img = document.createElement('img')
        img.className = 'homeGameImg'
        img.src = g.thumb
        const addWishlist = document.createElement('span')
        addWishlist.className = 'add-to-wishlist'
        addWishlist.id = g.gameID
        addWishlist.innerText = 'Add to Wishlist'
        ul.appendChild(li)
        li.append(img, spanNormalPrice, spanSalePrice, addWishlist)


    })
}