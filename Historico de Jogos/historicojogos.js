storeJson = JSON.parse(localStorage.getItem("dados_de_jogo"));
let newStore = storeJson !== null ? [...storeJson] : [];
console.log(newStore)


function generateHistoryLineFour() {
    if (newStore.length !==0){
        let historicos_quatro_Linha = newStore.filter((historico)=>{
            return historico.id === 2;
        })

        $("#historicoNome").text(historicos_quatro_Linha[0].vencedor.slice(0,-8));

        $("#historicoTempo").text(historicos_quatro_Linha[0].tempo);

        $("#historicoData").text(historicos_quatro_Linha[0].data);

        console.log(historicos_quatro_Linha)
}}

function generateHistoryMemory(){

    if (newStore.length !==0){
        let history_for_memory_game = newStore.filter((element) =>{
            return element.id === 3;
        })

        $(".name-state").text(history_for_memory_game[0].player);
        console.log(history_for_memory_game[0].player)
        $(".time-state").text(history_for_memory_game[0].time);
        console.log(history_for_memory_game[0].time)
        $(".data-state").text(history_for_memory_game[0].new_date);
        console.log(history_for_memory_game[0].new_date)
    }
}

// generateHistoryLineFour()
generateHistoryMemory();
