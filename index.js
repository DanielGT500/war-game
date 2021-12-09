let deckId
const cardsContainer = document.getElementById("cards")
const newDeckBtn = document.getElementById("new-deck")
const drawCardBtn = document.getElementById("draw-cards")
const header = document.getElementById("header")
const remainingText = document.getElementById("remaining")
const computerScore = document.getElementById("comp-score")
const yourScore = document.getElementById("your-score")
let yourPoints = 0
let computerPoints = 0

function handleClick() {
    yourPoints = 0
    computerPoints = 0
    drawCardBtn.disabled = false
    computerScore.textContent = "0"
    yourScore.textContent = "0"
    fetch("https://apis.scrimba.com/deckofcards/api/deck/new/shuffle/")
        .then(res => res.json())
        .then(data => {
            remainingText.textContent = data.remaining
            deckId = data.deck_id
            console.log(deckId)
        })
}

newDeckBtn.addEventListener("click", handleClick)

drawCardBtn.addEventListener("click", () => {
    fetch(`https://apis.scrimba.com/deckofcards/api/deck/${deckId}/draw/?count=2`)
        .then(res => res.json())
        .then(data => {
            remainingText.textContent = data.remaining
            cardsContainer.children[0].innerHTML = `
                <img src=${data.cards[0].image} class="card" />
            `
            cardsContainer.children[1].innerHTML = `
                <img src=${data.cards[1].image} class="card" />
            `
            const winnerText = determineCardWinner(data.cards[0], data.cards[1])
            header.textContent = winnerText
            
            if (data.remaining === 0) {
                drawCardBtn.disabled = true
                if (computerPoints > yourPoints) {
                    header.textContent = "Computer won the game!"
                } else if (computerPoints === yourPoints) {
                    header.textContent = "It's a draw!"
                } else {
                    header.textContent = "You won the game!"
                }
            }
        })
})

function determineCardWinner(card1, card2) {
    const valueOptions = ["2", "3", "4", "5", "6", "7", "8", "9", 
    "10", "JACK", "QUEEN", "KING", "ACE"]
    const card1ValueIndex = valueOptions.indexOf(card1.value)
    const card2ValueIndex = valueOptions.indexOf(card2.value)
    if (card1ValueIndex > card2ValueIndex) {
        computerPoints += 1
        computerScore.textContent = computerPoints
        return "Computer wins the round!"
    } else if (card1ValueIndex < card2ValueIndex) {
        yourPoints += 1
        yourScore.textContent = yourPoints
        return "You win the round!"
    } else {
        return "War!"
    }
}