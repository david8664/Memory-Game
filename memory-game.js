const cards = ['bird1.jpg', 'bird2.jpg', 'cat1.jpg', 'cat2.jpg', 'dolphin.jpg', 'dove.jpg', 'elephant1.jpg', 'elephant2.jpg', 'flowers.jpg', 'fox1.jpg', 'fox2.jpg', 'fox3.jpg', 'iceland.jpg', 'kingfisher.jpg', 'lion1.jpg', 'lion2.jpg', 'owl.jpg', 'parrot.jpg', 'sea.jpg', 'tiger.jpg'];
const players = [{}, {}, {}, {}];
let turn = [1,];
let intervalId;



function main() {
    const startBtn = document.getElementById('start-button');
    startBtn.addEventListener('click', () => {
        const setting = playerSetting();
        if (setting) { // take names
            const amount = setting.amountCards;
            turn[1] = setting.playerNames.length;
            setting.playerNames.forEach((name, index) => {
                players[index].nickName = name;
                players[index].score = 0;
            });
            createCardElement(amount);
            startClock();
            playerTurnTemplate();
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
        // end game
        stopClock();
        replay();
    }
    return;
}

const checkForMatch = () => {
    const selectedCards = document.getElementsByClassName('card-selected');
    const [firstCard, secondCard] = [...selectedCards].map(div => div.children[1]);

    if (firstCard.src === secondCard.src) {
        [...selectedCards].forEach(cardDiv => cardDiv.className = 'card-solved');
        players[turn[0] - 1].score++;
        playerTurnTemplate()
    }
    else {
        setTimeout(() => {
            selectedCards[0].querySelector('.show-card').className = 'face-card';
            selectedCards[0].querySelector('.hide-card').className = 'back-card';
            selectedCards[1].querySelector('.show-card').className = 'face-card';
            selectedCards[1].querySelector('.hide-card').className = 'back-card';
            [...selectedCards].forEach(cardDiv => cardDiv.className = 'cards');
            playerTurn();
            playerTurnTemplate()
        }, 2000)
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
    turn[0] = turn[0] < turn[1] ? turn[0] + 1 : 1;
}

function playerTurnTemplate() {
    let container = document.createElement('div');
    container.id = 'turn-player-container';

    players.forEach((player, index, arr) => {
        let row = document.createElement('p');

        if (index + 1 === turn[0]) {
            row.style.backgroundColor = 'gold';
        }

        let text = document.createTextNode(`${player.nickName} : ${player.score}`);

        row.appendChild(text);
        container.appendChild(row);
    });

    container.innerHTML = container.innerHTML.replaceAll('undefined : undefined', "");
    document.body.append(container);
    return;
}

function replay() {
    const button = document.createElement('button');
    button.id = 'popup-button';
    button.textContent = 'Play Again';
    button.onclick = function () {
        container.remove();
        allBody.remove();
        board.innerHTML = `<div id="setting-board">
        <span id="cards-amount-words">Number of card pairs (3-20): </span><input type="text" id="cards-amount">
        <br><br>
        <img id="add-player" src="photos/Add button.jpg" alt="Add" onclick="addPlayer()">
        <div id="players-board">
        <div class="player-template"><label>player's name: </label><input type="text"><br></div>
        </div>
        <div id="error-message"></div>
        <button id="start-button">Start</button>
        </div>`
        turn = [1,];
        main();
    }

    let player = players[0];
    let winner = player.nickName;
    for (let i = 1; i < players.length; i++) {
        if (players[i].score > player.score) {
            player = players[i];
            winner = players[i].nickName;
        }
    }
    let winnerSpan = document.createElement('span');
    winnerSpan.textContent = winner;
    winnerSpan.style.color = 'gold';
    let container = document.createElement('div');
    container.id = 'finish';
    container.innerHTML = `The winner is `;
    container.appendChild(winnerSpan);
    container.innerHTML += `!<br><br>Do you want to play again?<br><br>`;
    container.appendChild(button);
    const allBody = document.createElement('div');
    allBody.appendChild(container);
    allBody.id = 'all-body';
    document.body.appendChild(allBody);
}



main();