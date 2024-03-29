$(document).ready(function(){
    //Cria objeto para delay:
    const delay = ms => new Promise(res => setTimeout(res, ms));
    let arrayAleatorio = geraArrayDesordenado(15);
    ImprimirArrayIncompleto(arrayAleatorio);
    let velocidadeAnimacao = 300;
    let isRunning = false;

    $( "#executar_bubble" ).click(function() {
        let tamanhoArray = $("#tamanhoArray").val()
        if(!(tamanhoArray > 1 && tamanhoArray < 76)){
           alert("Por favor, insira valores entre 2 e 75");
        }

        if(isRunning)
            return;

        Iniciar();
    });

    $('#tamanhoArray').on('input', function() {
        arrayAleatorio = geraArrayDesordenado($(this).val());
        ImprimirArrayIncompleto(arrayAleatorio);
    });

    async function Iniciar() {

        isRunning = true;

        //Gera vetor com o tamanho do array definido
        let tamanhoArray = $("#tamanhoArray").val();

        if(tamanhoArray == 0 || tamanhoArray == null){
            tamanhoArray = 15;
        }

        arrayAleatorio = geraArrayDesordenado(tamanhoArray);

        //Faz uma cópia do array original para não alterar o array original por referência
        const arrayOriginal  = arrayAleatorio.slice();//TODO: achar forma adequada de exibr array original
        const arrayOrdenado = arrayAleatorio.slice();
        const arrayOriginalCopia = arrayAleatorio.slice();

        //Ordena o array desordenado e salva tempo gasto para tal
        let tempoGasto = bubbleSortOriginal(arrayOrdenado);

        //Ordena o array e obtém contagens (a contagem é separada para não afetar o tempo)
        await bubbleSortContadorTrocas(arrayOriginalCopia).then(analise => ExibirResuladosAnalise(analise));


        //Seta tempo gasto na tela.
        $("#tempoGasto").html(JSON.stringify(tempoGasto) + "ms.");
        isRunning = false;
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
                await delay(2000 - $('#velocidade-animacao').val());
                ImprimirFrameAnimacao(array, i, i + 1);
                if (array[i] > array[i + 1]) {
                    qtdTroca++;
                    let temp = array[i + 1];
                    array[i + 1] = array[i];
                    array[i] = temp;
                    swaps = true;
                    await delay(2000 - $('#velocidade-animacao').val());
                    ImprimirFrameAnimacaoPosSwap(array, i, i+1);
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

    function ImprimirFrameAnimacaoPosSwap(array, indice, comparacao){
        $("#arrayOriginal").html(blocosHTMLdeArray(array,"amarelo", comparacao, indice));
    }
    function ImprimirFrameAnimacao(array, indice, comparacao){
        $("#arrayOriginal").html(blocosHTMLdeArray(array,"amarelo", indice, comparacao));
    }
    function ImprimirArrayCompleto(array){
        $("#arrayOriginal").html(blocosHTMLdeArray(array, "verde", -1, -1));
    }
    function ImprimirArrayIncompleto(array){
        $("#arrayOriginal").html(blocosHTMLdeArray(array, "azul", -1, -1));
    }
    function blocosHTMLdeArray(arrayNumeros, cor, indiceEmEvidencia, indiceDaComparacao){
        let html = '';
        let evidencia = false;
        let comparacao = false;
        for(let i = 0; i < arrayNumeros.length; i++){

            // Se valor em evidência < 0, imprimir todos os blocos com a cor selecionada
            if(indiceEmEvidencia >= 0 ){
                evidencia = indiceEmEvidencia === i;
            }
            if(indiceDaComparacao >= 0 ){
                comparacao = indiceDaComparacao === i;
            }


            const alturaBloco = (220/arrayNumeros.length * arrayNumeros[i]) + 22;
            html += '<div class="d-flex align-items-end  text-center ' +
                'bloco-' + (evidencia? 'vermelho' : (comparacao ? 'laranja' :cor)) + '" ' +
                'style="height: '+ alturaBloco +'px;">\n' +// Muda altura de bloco de acordo com o número do array
                '<div class="valor-bloco">'+arrayNumeros[i] + '</div>'+
                '</div>';
        }
        return html;
    }

    function geraArrayDesordenado(numeroDeElementos){
        let array = []
        for(let i=0; i< numeroDeElementos; i++){
            array.push(i);
        }
        return misturar(array);
    }
    
    function misturar(array) {
        let elementoNaoAlterado = array.length;
        let elementoAtual;
        let elementoRestante;
    
        // Enquanto ainda há elementos não alterados...
        while (elementoNaoAlterado) {
      
          // Seleciona um elemento restante...
          elementoRestante = Math.floor(Math.random() * elementoNaoAlterado--);
      
          // E altera com o elemento atual.
          elementoAtual = array[elementoNaoAlterado];
          array[elementoNaoAlterado] = array[elementoRestante];
          array[elementoRestante] = elementoAtual;
        }
        return array;
      }
});


