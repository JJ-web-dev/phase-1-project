document.addEventListener('DOMContentLoaded', function () {
    fetchGames()
   

    loadHome()
    homeLink()
    dealsByStoreLink()

})

/** Global Variables */
let uniqueOnSaleGames = []



/** Event Listeners */



/**Node Getters */
let main = () => document.getElementById('main')
let storeDeals = () => document.getElementById('store-deals')
let gameGrid = () => document.getElementById('game-grid')


/**Navbar Functions */

// Resets all divs on navigation
const divReset = () => {
    main().innerHTML = ''
    storeDeals().innerHTML = ''
}


// Home screen load 
function loadHome() {
    divReset()
    let h1 = document.createElement('h1')
    h1.textContent = "Deals of the Day!"
    h1.className = 'center-align'
    const ul = document.createElement('ul')
    ul.id = 'game-grid'
    main().appendChild(h1)
    main().appendChild(ul)

    uniqueOnSaleGames.map(g => {
        if (g.dealRating >= 9.8) {
            const li = document.createElement('li')
            li.className = 'game-container'
            li.innerText = g.dealRating
            let img = document.createElement('img')
            img.className = 'homeGameImg'
            img.src = g.thumb
            ul.appendChild(li)
            li.appendChild(img)

        }




    })
}







function homeLink() {
    const homeLink = document.querySelector('.home-link')
    homeLink.addEventListener('click', loadHome)
}





function loadDealsByStore() {
    divReset()
    let h1 = document.createElement('h1')
    h1.textContent = "Shop By Store"
    h1.className = 'center-align'
    storeDeals().appendChild(h1)
}

function dealsByStoreLink() {
    const dealsByStoreLink = document.querySelector('.deals-by-store')
    dealsByStoreLink.addEventListener('click', loadDealsByStore)
}




/**Fetch Functions */

function fetchGames() {
    fetch('https://www.cheapshark.com/api/1.0/deals?onSale')
        .then(res => res.json())
        .then(res => {
           
           filterUniqueGames(res)
        })

}




/**Fetch manipulation */
function filterUniqueGames(res){
    
    const uniqueId = new Set() 
    const unique = res.filter(game => {
     const isDuplicate = uniqueId.has(game.gameID)
     uniqueId.add(game.gameID)

     if(!isDuplicate){
         return true
     }
     return false
    })
 uniqueOnSaleGames = unique
}



/**Data to DOM Functions */