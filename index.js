let response = await fetch('https://yuliapakhachuk.github.io/Find-Pair_byClasses/heroes.json');
let heroes = await response.json();


class Game { 

    #userData = {
        userName: "",
        userScore: "",
        userTime: "",
        userLevel: "",
    };
    
    #arrayByLevel;

    #previousSelectedCard;
    #totalScore = 0;

    #sec = 0;
    #min = 0;
    #gameSetTimer;


    #refs = {
        gridContainer: document.querySelector('.grid__container'),
        minutes: document.querySelector("span[data-minutes]"),
        seconds: document.querySelector("span[data-seconds]"),
        rightfield: document.querySelector(".timer__box"),
        gameTimer: document.querySelector('.timer'),
        middleBox: document.querySelector(".middle__box"),
        cardField: document.querySelector("#card__field"),
        startPage: document.querySelector("#start__page"),
        tableScore: document.querySelector("#table__score"),
        menuBtn: document.querySelector(".menu__btn"),
        allResults: document.querySelector('#all__scores'),
    }

    constructor( ) { 
        
        this.#showStartPage()
        this.#refs.menuBtn.addEventListener('click', () => { window.location.reload() })
    }

    #showStartPage = function () { 
        this.#refs.middleBox.innerHTML = "";
        this.#refs.gameTimer.classList.add('is-hidden');
        this.#refs.menuBtn.classList.add('is-hidden');
        
        this.#refs.middleBox.append(this.#refs.startPage.content.cloneNode(true));
        this.#refs.startBtn = document.querySelector("button[data-start]");
        this.#refs.startBtn.addEventListener('click', this.#chooseLevel);
        
        this.#refs.scoreBtn = document.querySelector('button[data-scores]');
        this.#refs.scoreBtn.addEventListener('click', this.#showTableScore.bind(this));
        
        this.#refs.levelList = document.querySelector('.level__list');
        this.#refs.levelList.classList.add('is-hidden');
    }
    

    #chooseLevel = () => { 
        this.#refs.levelList.classList.remove('is-hidden');
        
        this.#refs.beginnerBtn = document.querySelector('button[data-level="beginner"]');
        this.#refs.beginnerBtn.addEventListener('click', () => { 
            this.#userData.userLevel = "beginner";
            this.#showCardField();
        });
        this.#refs.expertBtn = document.querySelector('button[data-level="expert"]');
        this.#refs.expertBtn.addEventListener('click', () => { 
            this.#userData.userLevel = "expert";
            this.#showCardField();
        });
    }
    
    
    #randomiseHeroes = function(heroes) { 
        this.#arrayByLevel = (this.#userData.userLevel === "expert") ? (heroes) : (heroes.filter(item => { return item.number <= 8; }));
    
        for (let i = 0; i < this.#arrayByLevel.length; i++) { 
        let currentHero = this.#arrayByLevel[i];
            let randomIndex = (Math.floor(Math.random() * this.#arrayByLevel.length));
            this.#arrayByLevel[i] = this.#arrayByLevel[randomIndex];
            this.#arrayByLevel[randomIndex] = currentHero;
        }
        return this.#arrayByLevel;
    }


    #createGridItems = function() { 
        const randomHeroesArray = this.#randomiseHeroes(heroes);
        return randomHeroesArray.map((hero, index) =>
            `
                <div class="grid__item" data-id=${index} data-hero=${hero.heroName}">
                    <div class="item__front">
                        <img src="./images/${hero.number}.png" alt="">
                    </div>
                    <div class="item__back"></div>
                </div>
            `
        ).join('');
    }


    #showCardField = function() { 
        this.#refs.middleBox.innerHTML = "";
        this.#refs.gameTimer.classList.remove('is-hidden');
        this.#refs.menuBtn.classList.remove('is-hidden');
    
        this.#refs.middleBox.append(this.#refs.cardField.content.cloneNode(true));
        
        this.#refs.gridContainer = document.querySelector(".grid__container");
        if (this.#userData.userLevel === "beginner") { 
            this.#refs.gridContainer.style.gridTemplateColumns = "1fr 1fr 1fr 1fr";
            this.#refs.gridContainer.style.gridTemplateRows = "1fr 1fr 1fr 1fr";
        }
        this.#refs.gridContainer.innerHTML = this.#createGridItems();
        this.#refs.gridContainer.addEventListener('click', (e) => {
            this.#findsPair(e);
        }, true);
    }


    #showTableScore = function () { 
        this.#refs.middleBox.innerHTML = "";
    
        this.#refs.middleBox.append(this.#refs.tableScore.content.cloneNode(true));
        this.#refs.table = document.querySelector('.table__score--container');
        this.#refs.tableBody = document.querySelector('.table__body');
        this.#refs.tableBody.innerHTML = this.#renderScoreTableHTML();
    
        this.#refs.gameTimer.classList.add('is-hidden');
        this.#refs.menuBtn.classList.remove('is-hidden');
    }
    
    #clearCardsRotated = function(cards) {
        setTimeout(() => { 
            cards.forEach(element => {
                element.classList.remove('rotated');
            });
        }, 1000)
    }
    
    
    #findsPair = function(e) {
        if (!e.target.classList.contains('grid__item')) { return; };
        if (!e.target.classList.contains('rotated')) {
            e.target.classList.add("rotated");
            this.#startTimer();
            if (this.#previousSelectedCard)  {
                if (this.#previousSelectedCard.dataset.hero === e.target.dataset.hero) {
                    this.#totalScore = this.#totalScore + 1;
                } else {
                    this.#clearCardsRotated([
                        this.#previousSelectedCard, e.target
                    ]);
                }
                this.#previousSelectedCard = undefined;
            } else {
                this.#previousSelectedCard = e.target;
            }
    
            if (this.#totalScore === (this.#arrayByLevel.length / 2)) {
                this.#finishedGame();
            }
        }
    }

    
    #startTimer = function() { 
        if (!this.#gameSetTimer) {
            this.#gameSetTimer = setInterval(() => {
                this.#sec = this.#sec + 1;
                if (this.#sec === 60) {
                    this.#sec = 0;
                    this.#min = this.#min + 1;
                    this.#refs.minutes.innerText =  this.#min < 10 ? "0" + this.#min : this.#min;
                }
                this.#refs.seconds.innerText = this.#sec < 10 ? "0" + this.#sec : this.#sec;
            }, 1000);
        };
    }
    
    
    #finishedGame = function() {
        clearInterval(this.#gameSetTimer);
    
        setTimeout(() => {
            this.#userData.userName = prompt("WELL DONE! Your name is...") || `${this.#arrayByLevel[0].heroName}`;
            this.#userData.userScore = (this.#min * 60) + this.#sec;
            this.#userData.userTime = `${this.#min < 10 ? "0" + this.#min : this.#min}:${this.#sec < 10 ? "0" + this.#sec : this.#sec}`
            setTimeout(() => (this.#showTableScore()) , 1000);
            this.#savingScore();
        }, 1000);
    }


    #savingScore = function() {
        const LOCALSTORAGE_KEY = "bestScoresGame";
        const scoreValues = localStorage.getItem("bestScoresGame");
        const bestScores = (JSON.parse(scoreValues) === null ? [] : [...JSON.parse(scoreValues)]);
        
        bestScores.push(this.#userData);
        bestScores.sort((a, b) => a.userScore - b.userScore);
        bestScores.splice(100);
        localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(bestScores));
    }
    

    #renderScoreTableHTML = function() { 
        const bestScores = (JSON.parse(localStorage.getItem("bestScoresGame")) === null ? [] : [...JSON.parse(localStorage.getItem("bestScoresGame"))]);

        return bestScores.slice(0, 100).map(score => {
            return `
                <tr class="table__row">
                    <td class="user__name">${score.userName}</td>
                    <td class="user__score">${score.userTime}</td>
                </tr>
                `
        })
        .join("");
    }
}    

const FindPair = new Game();
