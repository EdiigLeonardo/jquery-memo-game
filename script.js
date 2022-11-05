let cardObjects = [
    {
        name: "quora",
        data: "quora",
        src: "assets/socialmedias/quora.svg",
        color: "#B92B27"
    },
    {
        name: "github",
        data: "github",
        src: "assets/socialmedias/quora.svg"
    },
    {
        name: "twitter",
        data: "twitter",
        src: "assets/socialmedias/twitter.svg"
    },
    {
        name: "youtube",
        data: "youtube",
        src: "assets/socialmedias/youtube.svg"
    },
    {
        name: "linkedin",
        data: "linkedin",
        src: "assets/socialmedias/linkedin.svg"
    },
    {
        name: "spotify",
        data: "spotify",
        src: "assets/socialmedias/spotify.svg"
    },
    {
        name: "discord",
        data: "discord",
        src: "assets/socialmedias/discord.svg"
    },
    {
        name: "messenger",
        data: "messenger",
        src: "assets/socialmedias/messenger.svg"
    },
    {
        name: "microsoft-teams",
        data: "microsoft-teams",
        src: "assets/socialmedias/microsoft-teams.svg"
    },
    {
        name: "instagram",
        data: "instagram",
        src: "assets/socialmedias/instagram.svg"
    },
    {
        name: "reddit",
        data: "reddit",
        src: "assets/socialmedias/reddit.svg"
    },
    {
        name: "signal",
        data: "signal",
        src: "assets/socialmedias/signal.svg"
    },
    {
        name: "snapchat",
        data: "snapchat",
        src: "assets/socialmedias/snapchat.svg"
    },
    {
        name: "skype",
        data: "skype",
        src: "assets/brands/skype.svg"
    },
    {
        name: "stack-overflow",
        data: "stack-overflow",
        src: "assets/socialmedias/stack-overflow.svg"
    },
    {
        name: "twitch",
        data: "twitch",
        src: "assets/socialmedias/twitch.svg"
    },
    {
        name: "vimeo",
        data: "vimeo",
        src: "assets/socialmedias/vimeo.svg"
    }
    ]
const backFace = {name: "playstation",
    src:"assets/brands/playstation.svg",
    alt:"imagem de uma playstation"}

let container = $(".memory-game");
let cards = $(".memory-card");
const difficultyButtons_div = $(".popup-container-div");
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let difficultyButtons = $(".popup-container-div>a");
let btn_start = $("#btn-start");
let min = 0;
let second = 0;
let zeroPlaceholder = 0;
let moves = 0;
let winnerPopUp = $(".winner-pop-up")
let winner_return_button = $("#winner_return_button");
let timer = $("#count-up");
let generic_buttons = $(".btn_generic");

$(winnerPopUp).toggle("hidded");
$(container).toggle("hidded");
$(difficultyButtons_div).toggle("hidded");

let FLIP_SOUND = new Audio("./assets/sounds/flip_sound.mp3");
let CHECK_SOUND = new Audio("./assets/sounds/check_sound_.mp3");
let BRUH = new Audio("./assets/sounds/bruh_sound_effect_.mp3");
let MAIN = new Audio("./assets/sounds/main_victory_sound__.mp3");
let CLICK = new Audio("./assets/sounds/click_sound_effect.mp3");

FLIP_SOUND.volume=0.3;
CHECK_SOUND.volume=0.25;
BRUH.volume=0.3;
MAIN.volume=0.1;
CLICK.volume = 0.2;

$(generic_buttons).click(()=>{
    CLICK.play();
})

function start_button_handle(){
    $(btn_start).click(()=>{
        $(difficultyButtons_div).toggle("hidded")
        $(btn_start).toggle("hidded");
    })
    manage_game()
}
start_button_handle()


function manage_game(){
    let btnGenerateDifficulty = 0;
    let input_player = $("#player")
    $(input_player).on("change",function(){
        let inputValue = $(input_player).val()
        if(isAlphaNumeric(inputValue)){
            manage_buttons_difficulty(inputValue)
        }
        else{
            if(inputValue===" "){
                inputValue = "__blank__space__"
            }
            window.alert(`Invalid name ${inputValue}, you must enter an alphanumeric name`)
        }
    })
}

function manage_buttons_difficulty(player_name){

    $(difficultyButtons).each((index, element)=>{

        $(element).click(()=>{
                // btnGenerateDifficulty = (index+1)*2
                btnGenerateDifficulty = (index+3)*2
                generateGrid(btnGenerateDifficulty);
                if(index>=2){
                    $(container).css("grid-template-columns","repeat(5, 1fr)");
                }
                else{
                    $(container).css("grid-template-columns","repeat(4, 1fr)");
                }
                $(difficultyButtons_div).toggle("hidded")
                $(container).toggle("hidded");
                cards = $(".memory-card")
                shuffle(cards, btnGenerateDifficulty)

                //localStorage

                let counter = setInterval(function(){
                    let won = uWon(cards)
                    if(won){
                        clearInterval(counter);
                        displayWinner(won);
                        MAIN.play();
                        history_dict = [{
                            player: player_name,
                            new_date: formatted_date(),
                            game: "memory game",
                            time: $(timer).text(),
                            id: 3
                        }];
                        manage_localStorage(history_dict);
                        return_to_last_page(winner_return_button)
                    }
                    countUp()
                }, 1000);
            }
        )
    })
}


function generateGrid(grid_value){
    for (let i = 1; i <= grid_value; i++){
        $(container).each((index,table)=>{
            const card = $(`
    <div class="memory-card" data-socialmedia="${cardObjects[i].name}">
        <img class="front-face" src="${cardObjects[i].src}" alt="${cardObjects[i].name}"/>
        <img class="back-face" src="${backFace.src}" alt="${backFace.alt}"/>
    </div>
    <div class="memory-card" data-socialmedia=${cardObjects[i].name}>
        <img class="front-face" src=${cardObjects[i].src} alt=${cardObjects[i].name}/>
        <img class="back-face" src=${backFace.src} alt=${backFace.alt}/>
    </div>`)
            $(table).append(card);
            $(card).click(flipCard);
        })
    }
}

function flipCard(element) {
    FLIP_SOUND.play();
    if (lockBoard) return;
    if (element.target.parentNode === $(firstCard)[0]) return;
    $(element.target.parentNode).addClass("flip");
    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = $(element.target.parentNode);
        return;
    }
    secondCard = $(element.target.parentNode);
    checkForMatch();
}

function checkForMatch() {
        if(firstCard.data("socialmedia") === secondCard.data("socialmedia")){
            firstCard.addClass("matched")
            secondCard.addClass("matched")
            CHECK_SOUND.play()
            moves = 0;
            disableCards()
            return true
        }
        else{
            moves += 1;
            if(moves>=4){
                BRUH.play()
            }
            unflipCards()
            // console.log(moves);
            return false
        }
}

function disableCards() {
    firstCard.off('click', flipCard);
    secondCard.off('click', flipCard)
    resetBoard();
}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        FLIP_SOUND.play()
        firstCard.removeClass('flip');
        secondCard.removeClass('flip');
        resetBoard();
    }, 300);
}


function shuffle(element, value) {
    $(element).each((index, card) => {
        let randomPos = Math.floor(Math.random() * value)
        $(card).css("order", randomPos)
    });
};

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function uWon(cards){
    let isMatch = true;
    cards.each((index, card) =>{
        if(!$(card).hasClass("matched")){
            isMatch = false;
        }
    })
    return isMatch
}

function displayWinner(isMatch){
    if(isMatch){
        $(winnerPopUp).toggle("hidded");
        $(container).toggle("hidded");
    }
}

function return_to_last_page(button){
    $(button).click(()=>{
        window.history.back();
/*        location.reload(true);*/
    }
    )
}

function countUp(){
    second++;
    if(second === 60){
        second = 0;
        min = min + 1;
    }
    if(second === 10){
        zeroPlaceholder = '';
    }else
    if(second === 0){
        zeroPlaceholder = 0;
    }
    document.getElementById("count-up").innerText = min.toLocaleString('pt-PT', {minimumIntegerDigits: 2, useGrouping:false})
        + ':' + zeroPlaceholder + second;
}

function formatted_date(){
    let data = new Date(),
        dia  = data.getDate().toString().padStart(2, '0'),
        mes  = (data.getMonth()+1).toString().padStart(2, '0'),
        ano  = data.getFullYear();
    return `${dia}/${mes}/${ano}`
}

function manage_localStorage(history_dict){
    storeJson = JSON.parse(localStorage.getItem("dados_de_jogo"));
    let newStore = storeJson !== null ? [...storeJson] : [];
    newStore.unshift(...history_dict);
    localStorage.setItem("dados_de_jogo", JSON.stringify(newStore));
}

function isAlphaNumeric(str) {
    let code, i, len;
    for (i = 0, len = str.length; i < len; i++) {
        code = str.charCodeAt(i);
        if (!(code > 47 && code < 58) && // numeric (0-9)
            !(code > 64 && code < 91) && // upper alpha (A-Z)
            !(code > 96 && code < 123)) { // lower alpha (a-z)
            return false;
        }
    }
    return true;
};
console.log(isAlphaNumeric(" "))