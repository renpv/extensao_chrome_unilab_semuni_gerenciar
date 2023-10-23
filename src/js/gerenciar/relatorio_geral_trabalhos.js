function inserirBotoes(){
    const elThead = document.querySelectorAll('#trabalhos > thead > tr > th')
    elThead.forEach((el, key) => {
        el.insertAdjacentHTML('beforeend', `<span class="remove" data-coluna="${key+1}"> [X]</span>`)
    })

    document.querySelectorAll('#trabalhos > thead .remove')
        .forEach(el => el.addEventListener('click', remove))
}

function removeBotoes(){
    document.querySelectorAll('#trabalhos > thead > tr > th > span.remove').forEach(e => e.remove())
    inserirBotoes()
}

function remove(el){
    el.stopPropagation()
    document.querySelector(`#trabalhos > thead > tr > th:nth-child(${el.target.dataset.coluna})`).remove()
    document.querySelectorAll(`.tabela tbody tr td:nth-child(${el.target.dataset.coluna})`).forEach(e => e.remove())
    removeBotoes()
}

inserirBotoes()