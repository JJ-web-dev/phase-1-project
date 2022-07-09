document.addEventListener('DOMContentLoaded', function () {
    loadHome()
    homeLink()
    dealsByStoreLink()
    wishlistLink()
    

})





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

    const mouseOver = document.querySelectorAll('.add-to-wishlist')
    
    mouseOver.forEach(item => item.addEventListener('mouseover', function (e) {
        e.target.style.cursor = 'pointer'
        
    }))
    const mouseOut = document.querySelectorAll('.add-to-wishlist')
    mouseOut.forEach(item => item.addEventListener('mouseout', function (e) {
        e.target.style.cursor = 'default'
       
        
    }))
}

function gameContainerHover() {

    const mouseOver = document.querySelectorAll('.game-container')
    console.log(mouseOver.children)
    
    mouseOver.forEach(item => item.addEventListener('mouseover', function (e) {
        e.target.style.filter = 'drop-shadow(0 0 .8rem crimson)'
        
        
    }))
    const mouseOut = document.querySelectorAll('.game-container')
    mouseOut.forEach(item => item.addEventListener('mouseout', function (e) {
        e.target.style.filter = 'none'
       
        
    }))
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
    setTimeout(postWishlistGame, 1000)
    setTimeout(mousePointerChange, 1500)
    setTimeout(gameContainerHover, 1500)
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
        if (games.dealRating >= 9.7) {

            gameDeal.push(games)
        }
    })
    return gameDeal
}

//Need to add alert once successful post is made
//Posts game from home page to the wishlist page
function postWishlistGame() {

    const addWishListEvent = document.querySelectorAll('.add-to-wishlist')
    
    addWishListEvent.forEach(item => item.addEventListener('click', e => {
       
      const gameID = (e.target.id)
      e.target.innerText = 'Game Added to Wishlist'
      e.target.style.color = 'crimson'
      e.target.style.backgroundColor = 'black'
        console.log(gameID)
      

        fetch(`https://www.cheapshark.com/api/1.0/games?id=${gameID}`)
            .then(response => response.json())
            .then(response => {
                const gameInfo = response
                

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

//This function deletes games from the wishlist page and json server
function deleteWishlistGame(){
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
    
    
   
    const div = document.createElement('div')
    div.id = 'wishlist-games'
    wishlist().appendChild(div)
    const ul = document.createElement('ul')
    ul.id = 'wishlist-grid'
    div.appendChild(ul)

    const [firstElement, ...restArray] = wishlistData 
    
    console.log(restArray)
    restArray.map(g => {
        let info = g.info
        let allDeals = g.deals[0]
        console.log(allDeals)
        
        //was geting undefined to access nested object - this accesses next leve key from existing object or empty object
        const title = ((info || {}).title)
        const thumb = ((info || {}).thumb)
        const id = g.id
        
        
        const li = document.createElement('li')
        li.className = 'wishlist-container'
        li.innerText = `${title}`
        const img = document.createElement('img')
        img.className = 'wishlistGameImg'
        img.src = thumb
        const btn = document.createElement('button')
        btn.className = 'wishlist-delete-btn'
        btn.innerText = 'Delete'
        btn.id = id
        ul.appendChild(li)
        li.append(img, btn)


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
        li.innerText = `${g.title}`
        const spanSalePrice = document.createElement('span')
        spanSalePrice.innerText = `Sale Price ${g.salePrice}`
        const spanNormalPrice = document.createElement('span')
        spanNormalPrice.innerText = `Normal Price ${g.normalPrice}`
        const img = document.createElement('img')
        img.className = 'homeGameImg'
        img.src = g.thumb
        const addWishlist = document.createElement('button')
        addWishlist.className = 'add-to-wishlist'
        addWishlist.id = g.gameID
        addWishlist.innerText = 'Add to Wishlist'
        ul.appendChild(li)
        li.append(img, spanNormalPrice, spanSalePrice, addWishlist)


    })
}