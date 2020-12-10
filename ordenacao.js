function Iniciar() {

    //Gera vetor com o tamanho do array definido
    const array_aleatorio = geraArrayDesordenado(50);

    //Faz uma cópia do array original para não alterar o array original por referência
    const arrayOriginal  = array_aleatorio.slice();
    const arrayOrdenado = array_aleatorio.slice();
    const arrayOriginalCopia = array_aleatorio.slice();

    //Ordena o array desordenado e salva tempo gasto para tal
    let tempoGasto = bubbleSortOriginal(arrayOrdenado);

    //Ordena o array e obtém contagens (a contagem é separada para não afetar o tempo)
    let arrayAnalise = bubbleSortContadorTrocas(arrayOriginalCopia);
    let qtdTroca = arrayAnalise[0];
    let qtdLoop = arrayAnalise[1];
    let qtdAtribuicoesVariaveis = qtdTroca * 3;

    //Seta dados na tela
    $("#arrayOriginal").html(blocosHTMLdeArray_Azul(arrayOriginal));
    $("#tempoGasto").html(JSON.stringify(tempoGasto) + "ms.");
    $("#arrayOrdenado").html(blocosHTMLdeArray_Verde(arrayOrdenado));
    $("#qtdTroca").html(JSON.stringify(qtdTroca));
    $("#qtdAtribuicoesVariaveis").html(JSON.stringify(qtdAtribuicoesVariaveis));
    $("#qtdLoop").html(JSON.stringify(qtdLoop));

}

function blocosHTMLdeArray_Azul(arrayNumeros){
    let html = '';
    for(let i = 0; i < arrayNumeros.length; i++){
        const alturaBloco = arrayNumeros[i] * 5 + 20;
        html += '<div class="d-flex align-items-end bloco-azul" ' +
            'style="height: '+ alturaBloco +'px;">\n' +// Muda altura de bloco de acordo com o número do array
            '<div class="valor-bloco">'+arrayNumeros[i] + '</div>'+
            '</div>';
    }
    return html;
}

function blocosHTMLdeArray_Verde(arrayNumeros){
    let html = '';
    for(let i = 0; i < arrayNumeros.length; i++){
        const alturaBloco = arrayNumeros[i] * 5 + 20;
        html += '<div class="d-flex align-items-end bloco-verde" ' +
            'style="height: '+ alturaBloco +'px;">\n' +// Muda altura de bloco de acordo com o número do array
            '<div class="valor-bloco">'+arrayNumeros[i] + '</div>'+
            '</div>';
    }
    return html;
}

const bubbleSortOriginal = function(array) {
    const timeStart = performance.now();
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

    const timeEnd = performance.now();
    return timeEnd - timeStart;
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
    let array = []
    for(let x=0; x< n; x++){
        array.push(x);
    }

    return shuffle(array);
}

function shuffle(array) {
    let m = array.length, t, i;

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