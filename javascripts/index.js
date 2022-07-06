document.addEventListener('DOMContentLoaded', function () {
    loadHome()
    homeLink()
    dealsByStoreLink()
    // postWishlistGame()
    // mousePointerChange()

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
    filterUniqueGames()

}


function loadDealsByStore() {
    divReset()
    let h1 = document.createElement('h1')
    h1.textContent = "Shop By Store"
    h1.className = 'center-align'
    storeDeals().appendChild(h1)
}

//function loadWishList(){

// }



/**Fetch Functions */
async function fetchOnSaleGames() {
    const response = await fetch('https://www.cheapshark.com/api/1.0/deals?onSale')
    const data = await response.json()

    return data

}

async function filterUniqueGames() {
    const data = await fetchOnSaleGames()
  
    const uniqueId = new Set()
    const uniqueGames = data.filter(game => {
        const isDuplicate = uniqueId.has(game.gameID)
        uniqueId.add(game.gameID)

        if (!isDuplicate) {
            return true
        }
        return false
    });

    gameOnDom(uniqueGames)
    

}

function gameOnDom(uniqueGames) {
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
            const spanSalePrice = document.createElement('span')
            spanSalePrice.innerText = `Sale Price ${g.salePrice}`
            const spanNormalPrice = document.createElement('span')
            spanNormalPrice.innerText = `Normal Price ${g.normalPrice}`
            const img = document.createElement('img')
            img.className = 'homeGameImg'
            img.src = g.thumb
            const addWishlist = document.createElement('span')
            addWishlist.className = 'add-to-wishlist'
            addWishlist.innerText = 'Add to Wishlist'
            ul.appendChild(li)
            li.appendChild(img, spanNormalPrice, spanSalePrice, addWishlist)
            

        }
    })
}

// This function needs to copy the game object
// Can I attach game id to wishlist and post game obejct by id to json
// click on addtoWishlist and fetch game object by id
// then post game object to json
function postWishlistGame(){
    const addWishListEvent = document.querySelector('.add-to-wishlist')
    addWishListEvent.addEventListener('click', e => {
        e.preventDefault()
        console.log(addWishListEvent)
        const [name, image] = e.target

        fetch('http://localhost:3000/wishList', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify({
                name: title.value,
                image: thumb.value
            })
        })
    })
    .then((res => res.json))
    .then(res => {
        console.log(res)
    })
}

/**Fetch data manipulation */