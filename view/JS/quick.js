$(document).ready(function(){
    //Cria objeto para delay:
    const delay = ms => new Promise(res => setTimeout(res, ms));
    let array_aleatorio = geraArrayDesordenado(15);
    ImprimirArrayIncompleto(array_aleatorio);
    let velocidadeAnimacao = 300;

    $( "#executar_bubble" ).click(function() {
        let tamanhoArray = $("#tamanhoArray").val()
        if(!(tamanhoArray > 1 && tamanhoArray < 76)){
           alert("Por favor, insira valores entre 2 e 75");
        }
         Iniciar();
    });

    $('#tamanhoArray').on('input', function() {
        array_aleatorio = geraArrayDesordenado($(this).val());
        ImprimirArrayIncompleto(array_aleatorio);
    });

    function Iniciar() {

        //Gera vetor com o tamanho do array definido
        let tamanhoArray = $("#tamanhoArray").val();

        if(tamanhoArray == 0 || tamanhoArray == null){
            tamanhoArray = 15;
        }

        array_aleatorio = geraArrayDesordenado(tamanhoArray);

        //Faz uma cópia do array original para não alterar o array original por referência
        const arrayOriginal  = array_aleatorio.slice();//TODO: achar forma adequada de exibr array original
        const arrayOrdenado = array_aleatorio.slice();
        const arrayOriginalCopia = array_aleatorio.slice();

        //Ordena o array desordenado e salva tempo gasto para tal
        const timeStart = performance.now();
        let tempoGasto = timeStart;
        quickSortOriginal(arrayOrdenado, 0, arrayOrdenado.length - 1);
        const timeEnd = performance.now();
        tempoGasto = timeEnd - timeStart;

        //Ordena o array e obtém contagens (a contagem é separada para não afetar o tempo)
        quickSortAnalitico(arrayOriginalCopia, 0, arrayOriginalCopia.length - 1, 0, 0).then(value => ExibirResuladosAnalise(value,arrayOriginalCopia));
        //ImprimirArrayCompleto(arrayOriginalCopia);


        //Seta tempo gasto na tela.
        $("#tempoGasto").html(JSON.stringify(tempoGasto) + "ms.");

    }

    /*const bubbleSortOriginal = function(array) {
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
                    await delay(2000 - $('#velocidade-animacao').val());
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
    };*/

    function swap(items, leftIndex, rightIndex){
        var temp = items[leftIndex];
        items[leftIndex] = items[rightIndex];
        items[rightIndex] = temp;
    }

    function partition(items, left, right) {
        var pivot   = items[Math.floor((right + left) / 2)], //middle element
            i       = left, //left pointer
            j       = right; //right pointer
        while (i <= j) {
            while (items[i] < pivot) {
                i++;
            }
            while (items[j] > pivot) {
                j--;
            }
            if (i <= j) {
                swap(items, i, j); //swap two elements
                i++;
                j--;
            }
        }
        return i;
    }

    const partitionAnalitico = async (items, left, right, qtdTroca, qtdLoop) => {
        var pivot   = items[Math.floor((right + left) / 2)], //middle element
            i       = left, //left pointer
            j       = right; //right pointer
        while (i <= j) {
            while (items[i] < pivot) {
                i++;
            }
            while (items[j] > pivot) {
                j--;
            }
            if (i <= j) {
                swap(items, i, j); //swap two elements
                await delay(2000 - $('#velocidade-animacao').val());
                ImprimirFrameAnimacao(items, i);
                qtdTroca = qtdTroca + 1;
                qtdLoop = qtdLoop + 1;
                i++;
                j--;
            }
        }
        return i;
    }

    function quickSortOriginal(items, left, right) {
        var index;
        if (items.length > 1) {
            index = partition(items, left, right); //index returned from partition
            if (left < index - 1) { //more elements on the left side of the pivot
                quickSortOriginal(items, left, index - 1);
            }
            if (index < right) { //more elements on the right side of the pivot
                quickSortOriginal(items, index, right);
            }
        }
        return items;
    }

    async function quickSortAnalitico (items, left, right, qtdTroca, qtdLoop) {
        var index;
        let analise = [0, 0]; // [QtdTrocas, CoparacoesLoop]
        if (items.length > 1) {
            index = await partitionAnalitico(items, left, right,qtdTroca, qtdLoop); //index returned from partition
            if (left < index - 1) { //more elements on the left side of the pivot
                quickSortAnalitico(items, left, index - 1);
            }
            if (index < right) { //more elements on the right side of the pivot
                quickSortAnalitico(items, index, right);
            }
        }
        analise[0] = qtdTroca;
        analise[1] = qtdLoop;
        return analise;
    }

    function ExibirResuladosAnalise(analise,arrayOriginalCopia){
        let qtdTroca = analise[0];
        let qtdLoop = analise[1];
        let qtdAtribuicoesVariaveis = qtdTroca * 3;
        $("#qtdTroca").html(JSON.stringify(qtdTroca));
        $("#qtdAtribuicoesVariaveis").html(JSON.stringify(qtdAtribuicoesVariaveis));
        $("#qtdLoop").html(JSON.stringify(qtdLoop));
        //ImprimirArrayCompleto(arrayOriginalCopia);
    }

    function ImprimirFrameAnimacao(array, indice){
        $("#arrayOriginal").html(blocosHTMLdeArray(array,"laranja", indice));
    }
    function ImprimirArrayCompleto(array){
        $("#arrayOriginal").html(blocosHTMLdeArray(array, "verde", -1));
    }
    function ImprimirArrayIncompleto(array){
        $("#arrayOriginal").html(blocosHTMLdeArray(array, "azul", -1));
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


