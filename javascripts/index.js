document.addEventListener('DOMContentLoaded', function() {
    loadHome()
})


/** Event Listeners */



/**Node Getters */
let main = () => document.getElementById('main')
let storeDeals = () => document.getElementById('store-deals')


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
    ul.className = '.game-grid'
    main().appendChild(h1)
    main().appendChild(ul)
    
}



function homeLink(){
    const homeLink = document.querySelector('.home-link')
    homeLink.addEventListener('click', loadHome)
    }
    

homeLink()


function loadDealsByStore(){
    divReset()
    let h1 = document.createElement('h1')
    h1.textContent = "Shop By Store"
    h1.className = 'center-align'
    storeDeals().appendChild(h1)
}

function dealsByStoreLink(){
    const dealsByStoreLink = document.querySelector('.deals-by-store')
    dealsByStoreLink.addEventListener('click', loadDealsByStore)
}

dealsByStoreLink()



/**Fetch Functions */

function fetchGames(){
    fetch('https://www.cheapshark.com/api/1.0/deals?onSale')
        .then(res => res.json())
        .then(res => {
           res.map(g => {
            if(g.dealRating >= 9.8) {
                gameOnHome(g)
                // .forEach(game => gameOnHome(game))
            }
           } )
           
        })
    
}
// fetchGames()


/**Fetch manipulation */
 
 
 
 /**Data to DOM Functions */

function gameOnHome(game) {

    const gameCollectionUl = document.querySelector('.game-grid')
    const li = document.createElement('li')
    li.className = 'game-container'
    gameCollectionUl.append(li)

    
    
    


   
    let img = document.createElement('img')
    img.className = 'homeGameImg'
    
    // img.src = game.thumb

    
    // gameList.append(img)
   
  }

// gameOnHome()









