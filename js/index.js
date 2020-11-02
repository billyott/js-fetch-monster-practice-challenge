//********** variables **********

//html elements
const monsterContainerDiv = document.querySelector("#monster-container")
const forwardButton = document.querySelector("#forward")
const backButton = document.querySelector("#back")
const createMonsterDiv = document.querySelector("#create-monster")
const monsterForm = document.createElement("form")
monsterForm.innerHTML = `
    <input id="name" placeholder="name...">
    <input id="age" placeholder="age...">
    <input id="description" placeholder="description...">
    <input type="submit" value="Create">
`
createMonsterDiv.append(monsterForm)

//********** functions **********

//pagination stuff
function setMaxPageNumber(monsters) {
    monsterContainerDiv.dataset.maxPage = Math.ceil(monsters.length/50)
}

function getMaxPageNumber() {
    fetch("http://localhost:3000/monsters")
    .then(response => response.json())
    .then(monsters => setMaxPageNumber(monsters))
}

//rendering
function renderPageMonsters(currentPage) {
    fetch(`http://localhost:3000/monsters/?_limit=50&_page=${currentPage}`)
    .then(response => response.json())
    .then(monsters => monsters.forEach(monster => {
        renderMonster(monster)
    }))
}

function renderMonster(monster) {
    const monsterDiv = document.createElement("div")
    monsterDiv.innerHTML = `
        <h2>${monster.name}</h2>
        <h4>Age: ${monster.age}</h4>
        <p>${monster.description}</p>
    `
    monsterContainerDiv.append(monsterDiv)
}


//event handlers
function handleForwardButton(e) {
    if (parseInt(monsterContainerDiv.dataset.currentPage)+1 <= monsterContainerDiv.dataset.maxPage) {
        monsterContainerDiv.innerHTML = ''
        monsterContainerDiv.dataset.currentPage++
        renderPageMonsters(monsterContainerDiv.dataset.currentPage)
    } else {
        alert("No more monsters, sorry.")
    }
}

function handleBackButton(e) {
    if (monsterContainerDiv.dataset.currentPage === "1") {
        alert("You're on page 1 already...")
    } else {
        monsterContainerDiv.innerHTML = ''
        monsterContainerDiv.dataset.currentPage--
        renderPageMonsters(monsterContainerDiv.dataset.currentPage)
    }
}

function handleCreateMonster(e) {
    e.preventDefault()
    const monsterObj = {
        name: e.target.name.value,
        age: e.target.age.value,
        description: e.target.description.value
    }

    const configObj = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(monsterObj)
    };

    fetch("http://localhost:3000/monsters", configObj)
    .then(response => response.json())
    .then(newMonster => console.log("Success", newMonster))

    e.target.reset()

}

//init
function initialize() {
    monsterContainerDiv.dataset.currentPage = 1
    getMaxPageNumber()
    renderPageMonsters(monsterContainerDiv.dataset.currentPage)
}

//********** event listeners **********
forwardButton.addEventListener('click', handleForwardButton)
backButton.addEventListener('click', handleBackButton)
monsterForm.addEventListener('submit', handleCreateMonster)

//********** init **********
initialize()