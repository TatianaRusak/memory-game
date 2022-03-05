const cards = document.querySelectorAll('.memory-card'),
    cardsHidden = document.querySelectorAll('.hidden'),
    steps = document.getElementById('steps'),
    scoreList = document.querySelector('.score-list'),
    btnEasy = document.querySelector('.btn-easy'),
    btnHard = document.querySelector('.btn-hard');

let hasFlippedCard = false,
    lockBoard = false,
    firstCard,
    secondCard,
    countSteps = null,
    arrOfScore = localStorage.getItem('gameScores') || '[]';

window.onload = () => {
    shuffle();

    if (arrOfScore === '[]') {
        scoreList.innerHTML = '';
    } else { 
        showLastScore();
    }
    
};

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flip');
    showCountSteps();

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
    } else {
        secondCard = this;
        lockBoard = true;
        checkForMatch();
    }
}

function checkForMatch() {
    if (firstCard.dataset.framework === secondCard.dataset.framework) {
        disableCards();
    } else {
        unflipCards();
    }
}

// ====================== Конец игры ===========================

function showCongratulation() {
    if (document.querySelectorAll('.win').length === document.querySelectorAll('.visible').length) {
        if (confirm(`You've WON!
        Your score (${countSteps}) has been added to records table.
        Would you like to play once more?`)) {
            setLocalStorage();
            scoreList.innerHTML = '';
            showLastScore();
            unflipAllCardsForNewGame();
            shuffle();
            cards.forEach(card => card.addEventListener('click', flipCard));

        } else {
            setLocalStorage();
            scoreList.innerHTML = '';
            showLastScore();
        }
    }
}

function showCountSteps() {
    countSteps += 1;
    steps.innerHTML = countSteps;
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    setTimeout(() => {
        firstCard.classList.add('win');
        secondCard.classList.add('win');

        showCongratulation();

        resetBoard();
    }, 700);
}

function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');

        resetBoard();
    }, 1500);
}
function unflipAllCardsForNewGame() {
    cards.forEach((card) => {
        card.classList.remove('flip');
        card.classList.remove('win');
    });
    countSteps = 0;
    steps.innerHTML = '';
    resetBoard();
}

function resetBoard() {
    hasFlippedCard = false;
    lockBoard = false;
    firstCard = null;
    secondCard = null;
}

function shuffle() {
    cards.forEach(card => {
        let randomPos = Math.floor(Math.random() * 24);
        card.style.order = randomPos;
    });
}

cards.forEach(card => card.addEventListener('click', flipCard));


// ================ Таблица рекордов - LocalStorage ===================

function setLocalStorage() {
    let temp;
    if (localStorage.getItem('gameScores')) {
        // temp = arrOfScore.split(',');
        temp = JSON.parse(arrOfScore);
    } else { 
        temp = [];
    }
    
    if (temp.length === 10) { 
        temp.shift();
    }

    temp.push(countSteps);
    arrOfScore = JSON.stringify(temp);
    localStorage.setItem('gameScores', arrOfScore);
}

function showLastScore() {
            
    JSON.parse(arrOfScore).forEach((lastScore) => {
        const span = document.createElement('span');
        span.classList.add('score');
        span.innerHTML = lastScore;
        scoreList.prepend(span);
    });
}

// ============== Buttons ================

function makeCardsVisible() { 
    cards.forEach(card => card.classList.add('visible'));
    document.querySelector('.memory-game').classList.add('width-75');
};

function makeCardsInvisible() { 
    cardsHidden.forEach(card => card.classList.remove('visible'));
    document.querySelector('.memory-game').classList.remove('width-75');
};

btnEasy.addEventListener('click', () => {

    makeCardsInvisible();
    unflipAllCardsForNewGame();
    shuffle();
    cards.forEach(card => card.addEventListener('click', flipCard));
})

btnHard.addEventListener('click', () => {

    makeCardsVisible();
    unflipAllCardsForNewGame();
    shuffle();
    cards.forEach(card => card.addEventListener('click', flipCard));
})