


/** Event Listeners */
let clickEvent = () => document.addEventListener('click', e => {
    e.target
})



/**Node Getters */
let main = () => document.getElementById('main')
let storeDeals = () => document.getElementById('store-deals')


/**Navbar Functions */

function loadHome() {
    // main().innerHTML = ''
    let h1 = document.createElement('h1')
    h1.textContent = "Deals of the Day!"
    h1.className = 'center-align'
    main().append(h1)
}



function homeLink(){
    const homeLink = document.querySelector('.homeLink')
    homeLink.addEventListener('click', loadHome())
    }
    


homeLink()

function loadStoreDeals(){

}

/**Fetch Functions */

function fetchGames(){
    fetch('https://www.cheapshark.com/api/1.0/deals?onSale')
        .then(res => res.json())
        .then(res => {
           
            res.forEach(game => {
                gameOnDom(game)
            })
        })
    
}
fetchGames()


/**Fetch data to DOM Functoins */

function gameOnDom(game) {
    const gameCollectionDiv = document.getElementById('game-list')
    let div = document.createElement('div')
    div.className = 'games'
    let gameCollection = gameCollectionDiv.append(div)
    let table = document.createElement('table')
    let tableRow = document.createElement('tableRow')
    let gameTable = gameCollection.append(table)
    
    


    // let h3 = document.createElement('h3')
    // h3.textContent = toy.name
    let img = document.createElement('img')
    
    img.src = game.thumb

    // img.className = 'toy-avatar'
    // let p = document.createElement('p')
    // p.textContent = `${toy.likes} likes`
    // p.id = toy.id
    // let btn = document.createElement('button')
    // btn.classList.add('like-btn')
    // btn.textContent = 'like'
    // btn.id = toy.id
    table.append(img)
   
  }










