function Iniciar() {

    //Gera vetor com o tamanho do array definido
    const array_aleatorio = geraArrayDesordenado(10000);

    //Faz uma cópia do array original para não alterar o array original por referência
    const numeros  = array_aleatorio.slice();
    const numeros2 = array_aleatorio.slice();
    const numeros3 = array_aleatorio.slice();

    //Ordena o array desordenado e salva tempo gasto para tal
    tempoGasto = bubbleSortOriginal(numeros2);

    //Ordena o array e obtém contagens (a contagem é separada para não afetar o tempo)
    arrayAnalise = bubbleSortContadorTrocas(numeros3);
    qtdTroca = arrayAnalise[0];
    qtdLoop  = arrayAnalise[1];
    qtdAtribuicoesVariaveis = qtdTroca * 3;

    //Seta dados na tela
    document.getElementById("arrayOriginal").innerHTML = JSON.stringify(numeros);
    document.getElementById("tempoGasto").innerHTML = (JSON.stringify(tempoGasto)) + "ms.";
    document.getElementById("arrayOrdenado").innerHTML = JSON.stringify(numeros2);
    document.getElementById("qtdTroca").innerHTML = JSON.stringify(qtdTroca);
    document.getElementById("qtdAtribuicoesVariaveis").innerHTML = JSON.stringify(qtdAtribuicoesVariaveis);
    document.getElementById("qtdLoop").innerHTML = JSON.stringify(qtdLoop);

}

const bubbleSortOriginal = function(array) {
    var timeStart = performance.now();
    let swaps;
    do {
        swaps = false;
        for (let i = 0; i < array.length - 1; i++) {
        if (array[i] > array[i + 1]) {
            let temp = array[i + 1];
            array[i + 1] = array[i];
            array[i] = temp;
            swaps = true;
        }
        }
    } while (swaps);// quando o swaps não for trocado para verdadeiro, não houve necessidade de trocar, portanto está ordenado.

    var timeEnd = performance.now();
    let tempoGasto = timeEnd - timeStart;
    return tempoGasto;
};

const bubbleSortContadorTrocas = function(array) {
    let swaps;
    let qtdTroca = 0;
    let qtdLoop = 0;
    let analise = [0, 0]; // [QtdTrocas, CoparacoesLoop]
    do {
        swaps = false;
        for (let i = 0; i < array.length - 1; i++) {
            qtdLoop++;
        if (array[i] > array[i + 1]) {
            qtdTroca++;
            let temp = array[i + 1];
            array[i + 1] = array[i];
            array[i] = temp;
            swaps = true;
        }
        }
    } while (swaps);// quando o swaps não for trocado para verdadeiro, não houve necessidade de trocar, portanto está ordenado.

    analise[0] = qtdTroca;
    analise[1] = qtdLoop;

    return analise;
};
function geraArrayDesordenado(n){
    array = []
    for(x=0; x< n; x++){
        array.push(x);
    }

    arrayDesordenado = shuffle(array);
    return arrayDesordenado;
}

function shuffle(array) {
    var m = array.length, t, i;
  
    // While there remain elements to shuffle…
    while (m) {
  
      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);
  
      // And swap it with the current element.
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }
  
    return array;
  }

Iniciar();