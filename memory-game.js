const cards = ['bird1.jpg', 'bird2.jpg', 'cat1.jpg', 'cat2.jpg', 'dolphin.jpg', 'dove.jpg', 'elephant1.jpg', 'elephant2.jpg', 'flowers.jpg', 'fox1.jpg', 'fox2.jpg', 'fox3.jpg', 'iceland.jpg', 'kingfisher.jpg', 'lion1.jpg', 'lion2.jpg', 'owl.jpg', 'parrot.jpg', 'sea.jpg', 'tiger.jpg'];
const players = [{}, {}, {}, {}];
let turn = 1;
let intervalId;

function main() {
    const startBtn = document.getElementById('start-button');
    startBtn.addEventListener('click', () => {
        const setting = playerSetting();
        if (setting) { // take names
            const amount = setting.amountCards;
            setting.playerNames.forEach((name, index) => {
                players[index][index + 1] = name;
                players[index].score = 0;
            });
            document.getElementById('setting-board').remove();
            createCardElement(amount);
            startClock();
        }
    });
}

const addPlayer = () => {
    if (document.getElementById('players-board').childElementCount < 4) {
        const newPlayer = document.createElement('div');
        newPlayer.className = 'player-template';
        newPlayer.innerHTML = `<label>player's name: </label><input type="text"><br>`;
        newPlayer.addEventListener('dblclick', removePlayer);
        document.getElementById('players-board').appendChild(newPlayer);
    }
};

const removePlayer = (event) => {
    const playerToRemove = event.currentTarget;
    playerToRemove.remove();
};

const playerSetting = () => {
    const amountCards = document.getElementById('cards-amount').value;
    const playerInputs = document.querySelectorAll('#players-board input[type=text]');
    let playerNames = [];
    let errorMsg = '';

    // Validate amount of cards
    if (isNaN(amountCards) || amountCards < 3 || amountCards > 20) {
        errorMsg = 'Please enter a valid number of card pairs (3-20)';
    }

    // Validate player names
    playerInputs.forEach((input) => {
        const playerName = input.value.trim();
        if (playerName === '' || !/^[a-zA-Z]+$/.test(playerName)) {
            errorMsg = 'Please enter a valid player name';
        }
        playerNames.push(playerName);
    });

    // Display error message or return data
    const div = document.getElementById('error-message');
    if (errorMsg !== '') {
        div.innerText = errorMsg;
        return null;
    } else {
        div.remove();
        return { amountCards, playerNames };
    }
}

const shuffle = (cardsList) => {
    let shuffleCards = [];
    for (let card of cardsList) {
        const cardIndex = Math.floor(Math.random() * (cardsList.length + 1));
        shuffleCards.splice(cardIndex, 0, card);
    }
    return shuffleCards;
}

const createCardElement = (cardAmount) => {
    const shuffledCards = shuffle([...cards].slice(0, cardAmount).concat([...cards].slice(0, cardAmount)));
    const board = document.getElementById('board');
    board.innerHTML = shuffledCards.map(card => `\
    <div class="cards">\
    <img class="back-card" src="photos/question-mark.jpg" alt="back card">\
    <img class="face-card" src="photos/${card}" alt="face-card">\
    </div>`).join('');
    board.querySelectorAll('.cards').forEach(card => card.addEventListener('click', onClickCard));
    document.getElementById('board').style.marginTop = "5%";
}

function onClickCard(event) {
    const card = event.currentTarget; // takes the selected card
    if (card.className === 'card-solved') { return; }
    if (document.getElementsByClassName('card-selected').length < 2) {
        card.querySelector('.back-card').className = 'hide-card';   // show card
        card.querySelector('.face-card').className = 'show-card';
        card.className = 'card-selected';
        if (document.getElementsByClassName('card-selected').length === 2) { checkForMatch(); }
    }
    if (document.getElementsByClassName('cards').length === 0) {
        stopClock(); // end game
    }
    return;
}

const checkForMatch = () => {
    const selectedCards = document.getElementsByClassName('card-selected');
    const [firstCard, secondCard] = [...selectedCards].map(div => div.children[1]);
    debugger
    if (firstCard.src === secondCard.src) {
        [...selectedCards].forEach(cardDiv => cardDiv.className = 'card-solved');
    }
    else {
        setTimeout(() => {
            selectedCards[0].querySelector('.show-card').className = 'face-card';
            selectedCards[0].querySelector('.hide-card').className = 'back-card';
            selectedCards[1].querySelector('.show-card').className = 'face-card';
            selectedCards[1].querySelector('.hide-card').className = 'back-card';
            [...selectedCards].forEach(cardDiv => cardDiv.className = 'cards');
            playerTurn();
        }, 1000)
    }
    return;
}

const startClock = () => {
    let seconds = 0;
    let minutes = 0;
    let hours = 0;
    intervalId = setInterval(function () {
        seconds++;
        if (seconds >= 60) {
            seconds = 0;
            minutes++;
            if (minutes >= 60) {
                minutes = 0;
                hours++;
            }
        }
        let time = (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" +
            (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" +
            (seconds > 9 ? seconds : "0" + seconds);
        document.getElementById("clock").innerText = time;
    }, 1000);
}

const stopClock = () => {
    clearInterval(intervalId);
}

const showOverlay = () => {
    document.getElementById('overlay').style.display = 'block';
}

const hideOverlay = () => {
    document.getElementById('overlay').style.display = 'none';
}


const playerTurn = () => {
    turn = turn > 4 ? 1 : turn++;
}

function playerTurnTemplate() {
    let text = document.createElement('p');
    players.forEach((player, index, arr) => text += `${player[index + 1]} : ${player.score}${arr.length === index + 1 ? "" : "\n"}`)
    return text.replaceAll("undefined : undefined", "");
}

main();