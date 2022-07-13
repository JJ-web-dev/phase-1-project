# Phase 1 Project - Game Hunter Website
This is a webiste that locates the best deals on video games from many major online retailers
* The homepage displays games based on a set deal rating score of 9.5 or better
    * The deal rating is derived by ranking the price from numerous online retailers for the specified game
* Game title's can be searched in the search bar and the search query will be returned to the homepage
* Games can be added to a wishlist to track current best deal and compare to the historical low price on the game




### Requirements                                                
* Install json server with the following command in the terminal: npm install -g json-server
* Start json server with the following command in the terminal: json-server --watch db.json
    

### Installation Instructions
* Open index.html in browser


### API Information
* The data used for this project came from the api: https://apidocs.cheapshark.com/
* A purchase link on each section was created to redirect through cheapshark in accordance with use of their api.

### Attribution
* Oliver Steele's nested object acess pattern:
    -Accessing nested object that returns undefined (title) - this pattern should always return the nested object
```
        const title = ((info || {}).title)
```

### Screenshots of Website

* https://github.com/JJ-web-dev/phase-1-project/issues/1#issue-1303791813


### Support
* For support email me at justinmjames@protonmail.com