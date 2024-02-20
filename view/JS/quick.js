$(document).ready(function(){
    //Cria objeto para delay:
    const delay = ms => new Promise(res => setTimeout(res, ms));
    let array_aleatorio = geraArrayDesordenado(15);
    ImprimirArrayIncompleto(array_aleatorio);
    let qtdTroca = 0;
    let qtdLoop = 0;
    let isRunning = false;
    

    $( "#executar_quick" ).click(function() {
        let tamanhoArray = $("#tamanhoArray").val()
        if(!(tamanhoArray > 1 && tamanhoArray < 76)){
           alert("Por favor, insira valores entre 2 e 75");
        }

        if(isRunning)
            return;

        Iniciar();
    });

    $('#tamanhoArray').on('input', function() {
        array_aleatorio = geraArrayDesordenado($(this).val());
        ImprimirArrayIncompleto(array_aleatorio);
    });

    async function Iniciar() {

        isRunning = true;

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
        await  quickSortOriginal(arrayOrdenado, 0, arrayOrdenado.length - 1);
        const timeEnd = performance.now();
        tempoGasto = timeEnd - timeStart;

        //Ordena o array e obtém contagens (a contagem é separada para não afetar o tempo)
        await iniciaQuickAnalitico(arrayOriginalCopia)
        ImprimirArrayCompleto(arrayOriginalCopia);


        //Seta tempo gasto na tela.
        $("#tempoGasto").html(JSON.stringify(tempoGasto) + "ms.");
        isRunning = false;
    }

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

    const partitionAnalitico = async (items, left, right) => {
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
            await delay(2000 - $('#velocidade-animacao').val());
            ImprimirFrameAnimacao(items, pivot,i,j);
            if (i <= j) {
                swap(items, i, j); //swap two elements
                qtdTroca++;
                qtdLoop++;
                i++;
                j--;
            }
        }
        return i;
    }

    async function quickSortOriginal(items, left, right) {
        var index;
        if (items.length > 1) {
            index = partition(items, left, right); //index returned from partition
            if (left < index - 1) { //more elements on the left side of the pivot
                await quickSortOriginal(items, left, index - 1);
            }
            if (index < right) { //more elements on the right side of the pivot
                await quickSortOriginal(items, index, right);
            }
        }
        return items;
    }

    async function quickSortAnalitico (items, left, right) {
        var index;
        if (items.length > 1) {
            index = await partitionAnalitico(items, left, right); //index returned from partition
            if (left < index - 1) { //more elements on the left side of the pivot
                await quickSortAnalitico(items, left, index - 1);
            }
            if (index < right) { //more elements on the right side of the pivot
                await quickSortAnalitico(items, index, right);
            }
        }
    }

    async function iniciaQuickAnalitico(arrayOriginalCopia){
        await quickSortAnalitico(arrayOriginalCopia, 0, arrayOriginalCopia.length - 1)
            .then(value => ExibirResuladosAnalise(value,arrayOriginalCopia));
        return 0;
    }

    function ExibirResuladosAnalise(analise,arrayOriginalCopia){
        let qtdAtribuicoesVariaveis = qtdTroca * 3;
        $("#qtdTroca").html(JSON.stringify(qtdTroca));
        $("#qtdAtribuicoesVariaveis").html(JSON.stringify(qtdAtribuicoesVariaveis));
        $("#qtdLoop").html(JSON.stringify(qtdLoop));
        qtdLoop = 0;
        qtdTroca = 0;
    }

    function ImprimirFrameAnimacao(array, pivot, indiceEsquerda, indiceDireita){
        $("#arrayOriginal").html(blocosHTMLdeArray( array,"amarelo", pivot, indiceEsquerda, indiceDireita));
    }
    function ImprimirArrayCompleto(array){
        $("#arrayOriginal").html(blocosHTMLdeArray(array, "verde", -1, -1, -1));
    }
    function ImprimirArrayIncompleto(array){
        $("#arrayOriginal").html(blocosHTMLdeArray(array, "azul", -1, -1, -1));
    }
    function blocosHTMLdeArray(arrayNumeros, cor, pivot, indiceEsquerda, indiceDireita){
        let html = '';
        let ePivot = false;
        let eIEsquerda = false;
        let eIDireita = false;
        for(let i = 0; i < arrayNumeros.length; i++){

            // Se valor em evidência < 0, imprimir todos os blocos com a cor selecionada
            if(pivot >= 0 ){
                ePivot = pivot === i;
            }
            if(indiceEsquerda >= 0 ){
                eIEsquerda = indiceEsquerda === i;
            }
            if(indiceDireita >= 0 ){
                eIDireita = indiceDireita === i;
            }

            const alturaBloco = (220/arrayNumeros.length * arrayNumeros[i]) + 22;
            html += '<div class="d-flex align-items-end  text-center ' + 
                'bloco-' + (ePivot? 'vermelho-classico' : (eIEsquerda? 'azul-escuro' : (eIDireita? 'azul' : cor))) + '" ' +
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


