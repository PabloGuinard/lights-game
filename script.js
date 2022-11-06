let box = document.getElementsByTagName('section')
box = box[0]
const caseArray = document.getElementsByClassName('case')
const playsCount = document.getElementById('playsCount')
const button = document.getElementById('button')
const winPopup = document.getElementById('win_popup')
const gear = document.getElementById('gear')
const popup = document.getElementById('popup')
const buttonCancel = document.getElementById('cancel_settings')
const formSettings = document.getElementById('form_settings')
const inputSettingsArray = document.getElementsByClassName('input_settings')
const checkboxKeyboard = document.getElementById('keyboard')
const score = document.getElementById('score')
const popupsContainer = document.getElementById('popup_container')
let root = document.querySelector(':root')

let gridSize = 4
let caseGrid
let nbPlays
let isWon = false
let areCasesActives = true
let isGearActive = true
let shufflesAmount = 5
let hasFocus = [0, 0]
let controls = ['z', 'q', 's', 'd']

inputSettingsArray[0].value = gridSize
inputSettingsArray[1].value = shufflesAmount
updateCounter(0)
setAllCases()
shuffle()

function setAllCases(){
    let k = 0
    caseGrid = Array.from(Array(gridSize), () => new Array(gridSize))
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            caseGrid[i][j] = caseArray[k]
            k++
            caseGrid[i][j].addEventListener('click', function(){
                onCaseClick(i, j)
            })
        }
    }
    caseArray[0].classList.add('focus')
    hasFocus = [0, 0]
}

function onCaseClick(i, j){
    if(areCasesActives){
        addAnimation(caseGrid[i][j], 'rotate')
        toggleLightCross(i, j)
        switchFocus(i, j)
        updateCounter(nbPlays + 1)
        if(isGameWon())
            endOfGame()
    }
}

function addAnimation(element, animationName){
    element.classList.add(animationName)
    setTimeout(removeAnimation, 500, element, animationName)
}

function removeAnimation(element, animationName){
    element.classList.remove(animationName)
}

function switchFocus(i, j, isHidden){
    caseGrid[hasFocus[0]][hasFocus[1]].classList.remove('focus')
    if(isHidden)
        return
    if(i < 0)
        i = gridSize - 1
    if(j < 0)
        j = gridSize - 1
    caseGrid[i][j].classList.add('focus')
    hasFocus = [i, j]
}

function toggleLightCross(i, j){
    caseGrid[i][j].classList.toggle('lighted')
    if(i < gridSize - 1)
        caseGrid[i + 1][j].classList.toggle('lighted')
    if(i > 0)
        caseGrid[i - 1][j].classList.toggle('lighted')
    if(j < gridSize - 1)
        caseGrid[i][j + 1].classList.toggle('lighted')
    if(j > 0)
        caseGrid[i][j - 1].classList.toggle('lighted')
}

function updateCounter(value){
    nbPlays = value
    playsCount.innerHTML = nbPlays
    console.log(playsCount);
    console.log(nbPlays);
}

function shuffle(){
    for (let cpt = 0; cpt < shufflesAmount; cpt++) {
        toggleLightCross(Math.floor(Math.random() * gridSize), Math.floor(Math.random() * gridSize))  
    }
}

function isGameWon(){
    for (let index = 0; index < caseArray.length; index++) {
        if(caseArray[index].classList.contains('lighted'))
            return false
    }
    return true
}

function endOfGame(){
    switchFocus(0, 0, true)
    isWon = true
    areCasesActives = false
    score.innerHTML = "Score : " + nbPlays
    winPopup.classList.remove('not_displayed')
    popupsContainer.style.zIndex = 2
}

function updateCasesAmount(amount){
    while(caseArray.length > 0)
        caseArray[0].remove()
    for (let cpt = 0; cpt < Math.pow(amount, 2); cpt++) {
        popupsContainer.insertAdjacentHTML("beforebegin", '<div class="case"></div>')
    }
}

button.addEventListener('click', function(){
    onRestartClick();
})

function onRestartClick(){
    for (let index = 0; index < caseArray.length; index++) {
        caseArray[index].classList.remove('lighted')
    }
    updateCounter(0)
    winPopup.classList.add('not_displayed')
    shuffle()
    isWon = false
    areCasesActives = true
    switchFocus(0, 0)
    popupsContainer.style.zIndex = -1
}

gear.addEventListener('click', function(){
    onGearClick()
})

function onGearClick(){
    if(isGearActive){
        popupsContainer.style.zIndex = 2
        switchFocus(1, 1, true)
        document.getElementById('grid_size').focus()
        areCasesActives = false
        isGearActive = false
        addAnimation(gear, 'rotateGear')
        gear.classList.add('grey')
        popup.classList.remove('not_displayed')
    }
}

function closeSettings(){
    areCasesActives = true
    popupsContainer.style.zIndex = -1
    isGearActive = true
    addAnimation(gear, 'rotateGear')
    gear.classList.remove('grey')
    popup.classList.add('not_displayed')
    switchFocus(hasFocus[0], hasFocus[1])
}

document.getElementById('azerty').addEventListener('click', function(){
    checkboxKeyboard.checked = true
})

document.getElementById('qwerty').addEventListener('click', function(){
    checkboxKeyboard.checked = false
})

buttonCancel.addEventListener('click', function(event){
    event.preventDefault()
    cancelSettings()
})

function cancelSettings(){
    inputSettingsArray[0].value = gridSize
    inputSettingsArray[1].value = shufflesAmount
    closeSettings()
}

formSettings.onsubmit = function(event){
    event.preventDefault()
    submitSettings()
}

function submitSettings(){
    shufflesAmount = inputSettingsArray[1].value
    switch (checkboxKeyboard) {
        case true:
            controls = ['z', 'q', 's', 'd']
            break;
        default:
            controls = ['w', 'a', 's', 'd']
    }
    if(gridSize != inputSettingsArray[0].value){
        gridSize = Number(inputSettingsArray[0].value)
        root.style.setProperty('--gridSize', gridSize)
        updateCasesAmount(gridSize)
        setAllCases()
    }
    if(!isWon){
        shuffle()
        updateCounter(0)
        switchFocus(0, 0)
    }
    closeSettings()
}

document.onkeydown = function(e){
    switch (e.key) {
        case 'Tab':
            if(isGearActive){
                event.preventDefault()
                onGearClick()
            }
            break
        case controls[0]:
        case 'ArrowUp':
            if(areCasesActives)
                switchFocus((hasFocus[0] - 1) % gridSize, hasFocus[1])
            break
        case controls[2]:
        case 'ArrowDown':
            if(areCasesActives)
                switchFocus((hasFocus[0] + 1) % gridSize, hasFocus[1])
            break
        case controls[1]:
        case 'ArrowLeft':
            if(areCasesActives)
                switchFocus(hasFocus[0], (hasFocus[1] - 1) % gridSize)
            break
        case controls[3]:
        case 'ArrowRight':
            if(areCasesActives)
                switchFocus(hasFocus[0], (hasFocus[1] + 1) % gridSize)
            break
        case 'Enter':
            if(areCasesActives)
                onCaseClick(hasFocus[0], hasFocus[1])
            else if(isWon)
                onRestartClick()
            break
        case 'Escape':
            if(!isGearActive)
                cancelSettings()
            break
        
    }
}