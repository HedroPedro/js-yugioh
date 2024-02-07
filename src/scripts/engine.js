const state = {
    score:{
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("Score_points")
    },
    cardsSprites:{
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },
    playerSides:{
        player: "player-cards",
        playerBox: document.getElementById("player-cards"),
        computer: "computer-cards",
        computerBox: document.getElementById("computer-cards"),
    },
    fieldCards:{
        player: document.getElementById("player-field-cards"),
        computer: document.getElementById("computer-field-cards"),
    },
    actions:{
        button: document.getElementById("next-duel")
    }
}

const path = "./src/assets/icons/";

const playerSides = {
    player: "player-cards",
    computer: "computer-cards",
};

const cardData = [
    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: path+"dragon.png",
        WinOf: [1],
        LoseOf: [2]
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        img: path+"magician.png",
        WinOf: [2],
        LoseOf: [0]
    },
    {
        id: 2,
        name: "Exodia",
        type: "Scissor",
        img: path+"exodia.png",
        WinOf: [0],
        LoseOf: [1]
    },
];

async function resetDuel(){
    state.cardsSprites.avatar.src = "";
    state.actions.button.style.display = "none";

    state.fieldCards.player.style.display = none;
    state.fieldCards.computer.style.display = none;

    main();
}

async function getRandomCardId(){
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}

function drawSelectCard(index){
    state.cardsSprites.avatar.src = cardData[index].img;
    state.cardsSprites.name.innerText = cardData[index].name;
    state.cardsSprites.type.innerText = "Attribute: "+cardData[index].type;
}

async function removeAllCardsImages(){
    let card = state.playerSides.computerBox;
    let imgElements = card.querySelectorAll("img");
    imgElements.forEach((img) => {
        img.remove();
    })

    card = state.playerSides.playerBox;
    imgElements = card.querySelectorAll("img");
    imgElements.forEach((img) => {
        img.remove();
    })
}

async function checkDuelResults(playerCardId, computerCardId){
    let duelResults = "Draw";
    let playerCard = cardData[playerCardId];

    if(playerCard.WinOf.includes(computerCardId)){
        duelResults = "win";
        state.score.playerScore++;
    }

    if(playerCard.LoseOf.includes(computerCardId)){
        duelResults = "lose";
        state.score.computerScore++;
    }

    await playAudio(duelResults);
    return duelResults
}

async function updateScore(){
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} 
    | Lose: ${state.score.computerScore}`;

}

async function showHiddenCardFieldsImages(value){
    if(value === true){
        state.fieldCards.player.style.display = "block";
        state.fieldCards.computer.style.display = "block";
        return;
    }

    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";
}

async function drawButton(text){
    state.actions.button.innerText = text;
    state.actions.button.display = "block";
}

async function hiddenCardDetails(){
    state.cardsSprites.avatar.src = "";
    state.cardsSprites.name.innerText = "";
    state.cardsSprites.type.innerText = "";
}

async function drawCardsInfield(cardId, computerCardId){
    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;
}

async function setCardsField(cardId){
    await removeAllCardsImages();

    let computerCardId = await getRandomCardId();

    await showHiddenCardFieldsImages(true);

    await hiddenCardDetails();

    await drawCardsInfield(cardId, computerCardId);

    let duelResults = await checkDuelResults(cardId, computerId);

    await updateScore();
    await drawButton(duelResults);
}

function createCardImage(idCard, fieldSide){
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", `${path}card-back.png`);
    cardImage.setAttribute("data-id", idCard);
    cardImage.classList.add("card");

    if(fieldSide === state.playerSides.player){
        cardImage.addEventListener("click", ()=>{
            setCardsField(cardImage.getAttribute("data-id"));
        });

        cardImage.addEventListener("mouseover", () => {
            drawSelectCard(idCard);
        })
    }
    return cardImage;
}

async function drawCards(cardNumbers, fieldSide){
    for(let i = 0; i < cardNumbers; i++){
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage);
    }
}

async function playAudio(status){
    const audio = new Audio(`./src/assets/audios/${status}.var`);
    try {
        audio.play();   
    } catch (error) {
        
    }
}

function main(){
    state.fieldCards.player.style.display = none;
    state.fieldCards.computer.style.display = none;
    drawCards(5, state.playerSides.player);
    drawCards(5, state.playerSides.computer);

    const bgm = document.getElementById("bgm");
}

main();