function inserirBotoesExcluirColuna(){
    const elThead = document.querySelectorAll('#trabalhos > thead > tr > th')
    elThead.forEach((el, key) => {
        el.insertAdjacentHTML('beforeend', `<span class="remove" data-coluna="${key+1}"> [X]</span>`)
    })

    document.querySelectorAll('#trabalhos > thead .remove')
        .forEach(el => el.addEventListener('click', remove))
}

function removeBotoes(){
    document.querySelectorAll('#trabalhos > thead > tr > th > span.remove').forEach(e => e.remove())
    inserirBotoesExcluirColuna()
}

function remove(el){
    el.stopPropagation()
    document.querySelector(`#trabalhos > thead > tr > th:nth-child(${el.target.dataset.coluna})`).remove()
    document.querySelectorAll(`.tabela tbody tr td:nth-child(${el.target.dataset.coluna})`).forEach(e => e.remove())
    removeBotoes()
}

function inserirBotaoBaixarPlanilha(){

    const elFilter = document.querySelector('#trabalhos_filter')
    const elButton = document.createElement("button");
    elButton.textContent = 'Relatório em CSV';
    elButton.classList.add('dois')
    elButton.classList.add('botao')
    elButton.classList.add('b-sucesso')
    elButton.classList.add('medio')
    elButton.classList.add('a-direita')
    elButton.addEventListener('click', (evt)=>{
        
        const elConteudo = document.querySelector("#conteudo").value;

        const parser = new DOMParser();
        
        var htmlDocument = parser.parseFromString(elConteudo, "text/html");
        
        const trabalhos = htmlDocument.querySelectorAll("tbody tr");
        
        var trabalhosArray = [];
        trabalhos.forEach(function (currentValue, currentIndex, listObj) {
          let trabalho = {
            id: parseInt(currentValue.cells[0].innerText),
            origem: currentValue.cells[1].innerText,
            estado: currentValue.cells[2].innerText,
            instituto: currentValue.cells[3].innerText,
            grande_area: currentValue.cells[4].innerText,
            area: currentValue.cells[5].innerText,
            palavras_chave: currentValue.cells[6].innerText,
            autor: currentValue.cells[7].innerText,
            orientador: currentValue.cells[8].innerText,
            co_autores: currentValue.cells[9].innerText,
            titulo: currentValue.cells[10].innerText,
            encontro: currentValue.cells[11].innerText,
            tipo: currentValue.cells[12].innerText,
            status: currentValue.cells[13].innerText,
            desc_status: currentValue.cells[14].innerText
          };
          trabalhosArray.push(trabalho);
        });
        const cabecalho = Object.keys(trabalhosArray[0])
        
        const refinedData = []
        refinedData.push(cabecalho)
        
        trabalhosArray.forEach(item => {
          refinedData.push(Object.values(item))  
        })
        
        let csvContent = ''
        
        refinedData.forEach(row => {
          csvContent += '"' + row.join('","') + '"\n'
        })
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8,' })
        const objUrl = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.setAttribute('href', objUrl)
        link.setAttribute('download', 'trabalhos-semuni.csv')
        link.click()
    })
    elFilter.insertAdjacentElement('beforebegin', elButton);
}

inserirBotaoBaixarPlanilha()
inserirBotoesExcluirColuna()
