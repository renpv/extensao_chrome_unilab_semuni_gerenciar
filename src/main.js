window.onload = function(){
    const elStatus = document.getElementById('conf_avaliacao');
    importaFormAgradecimentos()
    importaFormDesconformidades()
    importaSaidaUsuario()
    importaMsgExtra()
    
    
    elStatus.addEventListener('change', (evt) =>{
        document.getElementById('form-desconformidades').classList.add('d-none')
        document.getElementById('form-agradecimentos').classList.add('d-none')
        montarMensagemFeedback()
    })    
}


function retornaMensagemCorpo(desconformidade=true){
    const opcao = document.getElementById('conf_avaliacao').value;
    if(opcao==1){//validado
        return '<p>Mudamos o status do seu trabalho para <b>VALIDADO PELO ORIENTADOR</b></p>'
    } else if(opcao == 2){//Aguardando validação
        return '<p>Mudamos o status do seu trabalho para <b>Aguardando Validação</b></p>'
    }else if (opcao == 3){//Aprovado
        return montarMensagemAprovado()
    }else if (opcao == 4){ //Reprovado
        return montarMensagemReprovado()
    }else if (opcao == 5){ //Desconformidade
        document.getElementById('form-desconformidades').classList.remove('d-none')
        return definirMensagemDesconformidade(desconformidade)
    }else if (opcao == 6){ //Apresentado
        return montarMensagemApresentado()
    }else if (opcao == 7){ //Conformidade
        return '<p>O status do seu trabalho foi alterado para CONFORMIDADE</p>'
    }else if (opcao == 8){ // Nao Apresentado
        return montarMensagemNaoApresentado()
    }else if (opcao == 99){ //Rascunho
        return montarMensagemRascunho()
    }
}

/**
 * IMPORTAR DESCONFORMIDADES
 */


function importaFormDesconformidades(){
    const elReferencia = document.querySelector('#formAvaliar > div:first-child');

    fetch(chrome.runtime.getURL("src/form-desconformidades.html"))
        .then(response => response.text())
        .then(arquivoImportado => {
            elReferencia.insertAdjacentHTML('afterend', arquivoImportado);
            listenerDesconformidades()
        })
        .catch(error => {
            console.error("Erro ao tentar importar o arquivo da extensão:", error)
        })
}

function listenerDesconformidades(){
    const elDesconformidades = document.querySelector('#form-desconformidades')
    elDesconformidades.querySelectorAll('input').forEach(el => {
        el.addEventListener('change', ()=>definirMensagemDesconformidade())
    })
}

function definirMensagemDesconformidade(desconformidade=true){
    let body = ``
    let desconformidades = Array.from(document.querySelectorAll('#form-desconformidades input'))
        .filter(el => el.checked)
    
    if(desconformidades.length > 0){
        body += `<br>Prezado(a) autor(a), identificamos a necessidade de revisão em <b>${desconformidades.length} ${desconformidades.length == 1 ? 'situação' : 'situações'} </b>do presente trabalho. Listamos a seguir: `
        body += `<ol class="mb-1">`
        desconformidades.forEach(el => {
            body += `<li>${el.nextElementSibling.innerHTML}`; 
            if(el.id == "agradecimento_ag_fomento"){
                document.getElementById('form-agradecimentos').classList.remove('d-none')
                body += definirMensagemAgradecimento()
            }
        })
        body += `</ol>`
        body += `Lembramos que <u>O sistema deve permitir ajustes entre os dias 31/10 e 07/11</u>, conforme cronograma da Semuni, disponível em: <a href="https://semanauniversitaria.unilab.edu.br/normas-de-submissao-de-trabalhos/" target="_blank">https://semanauniversitaria.unilab.edu.br/normas-de-submissao-de-trabalhos/</a> `

    }else{
        body += '<p>Motivo da desconformidade:</p>'
    }
    body += saidaExtra()
    body += montarRodapeDuvidaPibic()
    if(desconformidade){
        montarMensagemFeedback(false)
    }
    return body
}

/**
 * IMPORTAR AGRADECIMENTOS A AGENCIAS DE FOMENTO
 */

function importaFormAgradecimentos(){
    const elReferencia = document.querySelector('#formAvaliar > div:first-child');

    fetch(chrome.runtime.getURL("src/form-agradecimentos.html"))
        .then(response => response.text())
        .then(arquivoImportado => {
            elReferencia.insertAdjacentHTML('afterend', arquivoImportado);
            listenerAgradecimentos()
        })
        .catch(error => {
            console.error("Erro ao tentar importar o arquivo da extensão:", error)
        })
}

function listenerAgradecimentos(){
    const elDesconformidades = document.querySelector('#form-agradecimentos')
    elDesconformidades.querySelectorAll('input').forEach(el => {
        el.addEventListener('change', ()=>definirMensagemDesconformidade())
    })
}

function definirMensagemAgradecimento(){
    let agradecimentos = Array.from(document.querySelectorAll('input[name="ag_fomento"]'))
        .filter(el => el.checked)
    let body = `<p>Segue abaixo o modelo sugerido para compor os agradecimentos em seu resumo:<p>`
    body += `<p>${agradecimentos[0].nextElementSibling.innerHTML}</p>`
    return body
}

/**
 * SAIDA USUARIO
 */

function importaSaidaUsuario(){
    const elReferencia = document.querySelector('#formAvaliar > div:nth-child(2)')

    fetch(chrome.runtime.getURL("src/saida-usuario.html"))
        .then(response => response.text())
        .then(arquivoImportado => {
            elReferencia.insertAdjacentHTML('beforebegin', arquivoImportado);
        })
        .catch(error => {
            console.error("Erro ao tentar importar o arquivo da extensão:", error)
        })
}

/**
 * MENSAGEM EXTRA
 */

function importaMsgExtra(){
    const elReferencia = document.querySelector('#formAvaliar > div:nth-child(2)')

    fetch(chrome.runtime.getURL("src/msg-extra.html"))
        .then(response => response.text())
        .then(arquivoImportado => {
            elReferencia.insertAdjacentHTML('afterend', arquivoImportado);
            document.querySelector('#saidaExtra').addEventListener('keyup', ()=>montarMensagemFeedback())
            elReferencia.classList.add('d-none')
        })
        .catch(error => {
            console.error("Erro ao tentar importar o arquivo da extensão:", error)
        })
}

/**
 * 
 * MONTAGEM DE MENSAGENS PARA CADA SITUAÇÃO
 */

function montarMensagemAprovado(){
    let body = ``
    body += `<h2>Parabéns! Seu trabalho foi aprovado para apresentação no XI Encontro de Iniciação Científica.</h2>`
    body += `<p>Para elaborar a sua apresentação, recomendamos que utilize o modelo padrão de slide/banner da Semuni, disponível no link: `
    body += `<a href="https://semanauniversitaria.unilab.edu.br/normas-de-submissao-de-trabalhos/" target="_blank">https://semanauniversitaria.unilab.edu.br/normas-de-submissao-de-trabalhos/</a>.</p>`
    body += `<p>Pedimos que fique atento ao mapa de apresentação dos trabalhos que será divulgado, em data oportuna, na página:`
    body += `<a href="https://semanauniversitaria.unilab.edu.br/mapa-de-apresentacoes-dos-encontros/" target="_blank">https://semanauniversitaria.unilab.edu.br/mapa-de-apresentacoes-dos-encontros/</a>.</p>`
    body += saidaExtra()
    body += montarRodapeDuvidaPibic()

    return body
}

function montarMensagemReprovado(){
    let body = ``
    body += `<p>Prezado(a) autor(a), conforme divulgado no site da SEMUNI, o Encontro de Iniciação Científica recebe resumo simples ou expandido de aluno bolsista e/ou voluntário cadastrados <b>em projetos de pesquisas institucionalizados</b> no âmbito do PIBIC/PIBITI/Unilab ou em Fluxo Contínuo.</p>`
    body += `<p>Não conseguimos, portanto, relacionar o trabalho enviado a qualquer projeto cadastrado junto a PROPPG. Os interessados podem fazer as adequações necessárias no período de ajustes dos trabalhos, entre 31/10 a 07/11.</p>`
    body += saidaExtra()
    body += montarRodapeDuvidaCpq()

    return body
}

function montarMensagemApresentado(){
    let body = ``
    body += `<h2>Parabéns! Seu trabalho foi APRESENTADO no XI Encontro de Iniciação Científica.</h2>`
    body += `<p>Agora você já pode baixar seu certificado no sistema da Semana Universitária, através do link `
    body += `<a href="http://semuni.unilab.edu.br//inscricao/login_certificados.php" target="_blank">http://semuni.unilab.edu.br//inscricao/login_certificados.php</a></p>`
    body += saidaExtra()
    body += montarRodapeDuvidaPibic()

    return body
}

function montarMensagemNaoApresentado(){
    let body = ``
    body += `<h2>Que pena. O seu trabalho não foi apresentado no XI Encontro de Iniciação Científica.</h2>`
    body += `<p>Apesar disso, seu resumo será publicado nos Anais da IX Semana Universitária Unilab. `
    body += `Contudo, infelizmente, você não poderá receber o certificado de apresentação.`
    body += saidaExtra()
    body += montarRodapeDuvidaPibic()

    return body
}

function montarMensagemRascunho(){
    let body = ``
    body += `<h2>O status do seu trabalho foi alterado para RASCUNHO</h2>`
    body += `<p>Essa medida permite que você possa fazer ajustes e reenviá-lo. Sempre observando o cronograma do evento.</p>`
    body += saidaExtra()
    body += montarRodapeDuvidaPibic()

    return body
}

function montarMensagemFeedback(desconformidade=true){
    let msg = `<br>`
    let idTrabalho = document.querySelector('#conteudo h3 > span > b:nth-child(1)')
    msg += `<img src="https://semanauniversitaria.unilab.edu.br/wp-content/uploads/2023/09/BotaoSubmissao_Pagina-16.png" alt="Sistema de submissão de trabalhos na Semana universitária" ><br>`
    msg += retornaMensagemCorpo(desconformidade)
    document.getElementById('msm_avaliacao').innerText = msg
    document.querySelector('#MsgOutput p.saidaUsuario').innerHTML = msg
}

function montarRodapeDuvidaPibic(){
    let idTrabalho = document.querySelector('#conteudo h3 > span > b:nth-child(1)')
    msg = `<p>Para dúvidas e/ou esclarecimentos, você pode nos contactar através do e-mail `
    msg += `<a href="mailto:pibic@unilab.edu.br?subject=Dúvida sobre a submissão do trabalho ${idTrabalho.innerText}&body=Prezados(s), estou com uma dúvida sobre a submissão ao Encontro de Iniciação Científica.">pibic@unilab.edu.br</a></p>`

    return msg
}

function montarRodapeDuvidaCpq(){
    let idTrabalho = document.querySelector('#conteudo h3 > span > b:nth-child(1)')
    msg = `<p>No caso de dúvidas, entrar em contato conosco através do e-mail `
    msg += `<a href="mailto:cpq@unilab.edu.br?subject=Dúvida sobre a submissão do trabalho ${idTrabalho.innerText}&body=Prezados(s), gostaria de obter mais informações sobre a REPROVAÇÃO do meu trabalho submetido ao Encontro de Iniciação Científica.">cpq@unilab.edu.br</a></p>`

    return msg
}

function saidaExtra(){
    return `<p>${document.querySelector('#saidaExtra').value}</p>`
}
