$(document).ready(function(){
    //Cria objeto para delay:
    const delay = ms => new Promise(res => setTimeout(res, ms));

    function Iniciar() { 

        //Gera vetor com o tamanho do array definido
        let tamanhoArray = $("#tamanhoArray").val();

        if(tamanhoArray == 0 || tamanhoArray == null){
            tamanhoArray = 15;
        }

        const array_aleatorio = geraArrayDesordenado(tamanhoArray);

        //Faz uma cópia do array original para não alterar o array original por referência
        const arrayOriginal  = array_aleatorio.slice();
        const arrayOrdenado = array_aleatorio.slice();
        const arrayOriginalCopia = array_aleatorio.slice();

        //Ordena o array desordenado e salva tempo gasto para tal
        let tempoGasto = bubbleSortOriginal(arrayOrdenado);

        //Ordena o array e obtém contagens (a contagem é separada para não afetar o tempo)
        bubbleSortContadorTrocas(arrayOriginalCopia).then(value => ExibirResuladosAnalise(value));


        //Seta dados na tela
        $("#arrayOriginal").html(blocosHTMLdeArray(arrayOriginal, "azul",-1));
        $("#tempoGasto").html(JSON.stringify(tempoGasto) + "ms.");
        $("#arrayOrdenado").html(blocosHTMLdeArray(arrayOrdenado, "verde", -1));
    
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
    
    const bubbleSortContadorTrocas = async (array) => {
        let swaps;
        let qtdTroca = 0;
        let qtdLoop = 0;
        let analise = [0, 0]; // [QtdTrocas, CoparacoesLoop]
        do {
            swaps = false;
            for (let i = 0; i < array.length - 1; i++) {
                qtdLoop++;
                if (array[i] > array[i + 1]) {
                    await delay(300);
                    ImprimirFrameAnimacao(array, i);
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
        ImprimirArrayCompleto(array);

        return analise;
    };

    function ExibirResuladosAnalise(analise){
        let qtdTroca = analise[0];
        let qtdLoop = analise[1];
        let qtdAtribuicoesVariaveis = qtdTroca * 3;
        $("#qtdTroca").html(JSON.stringify(qtdTroca));
        $("#qtdAtribuicoesVariaveis").html(JSON.stringify(qtdAtribuicoesVariaveis));
        $("#qtdLoop").html(JSON.stringify(qtdLoop));
    }

    function ImprimirFrameAnimacao(array, indice){
        $("#arrayOriginal").html(blocosHTMLdeArray(array,"laranja", indice));
    }
    function ImprimirArrayCompleto(array){
        $("#arrayOriginal").html(blocosHTMLdeArray(array, "verde", -1));
    }
    function blocosHTMLdeArray(arrayNumeros, cor, indiceEmEvidencia){
        let html = '';
        let evidencia = false;
        for(let i = 0; i < arrayNumeros.length; i++){

            // Se valor em evidência < 0, imprimir todos os blocos com a cor selecionada
            if(indiceEmEvidencia >= 0 ){
                evidencia = indiceEmEvidencia === i;
            }

            const alturaBloco = (220/arrayNumeros.length * arrayNumeros[i]) + 22;
            html += '<div class="d-flex align-items-end  text-center bloco-' + (evidencia? 'vermelho' : cor) + '" ' +
                'style="height: '+ alturaBloco +'px;">\n' +// Muda altura de bloco de acordo com o número do array
                '<div class="valor-bloco">'+arrayNumeros[i] + '</div>'+
                '</div>';
        }
        return html;
    }

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
    
    $( "#executar_bubble" ).click(function() {
        let tamanhoArray = $("#tamanhoArray").val()
        if(tamanhoArray > 1 && tamanhoArray < 31){
            $("#tamanhoArrayHide").html(JSON.stringify(tamanhoArray));
            Iniciar();
        }else{
            Iniciar();
            alert("Por favor, insira valores entre 2 e 30");
        }
    });

    Iniciar();
});


