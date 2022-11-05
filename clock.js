let min = 0;
let second = 0;
let zeroPlaceholder = 0;

setInterval(function(){
    countUp();
}, 1000);

function countUp () {
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