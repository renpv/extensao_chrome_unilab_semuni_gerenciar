window.onload = function(){
    const elStatus = document.getElementById('conf_avaliacao');
    importaFormAgradecimentos()
    importaFormDesconformidades()
    importaSaidaUsuario()
    importaMsgExtra()
    projetosDocente() //insere a tabela de projeto do docente, vazia
    buscarProjetos() //Inicia o preenchimento da tabela
    
    
    elStatus.addEventListener('change', (evt) =>{
        document.getElementById('form-desconformidades').classList.add('d-none')
        document.getElementById('form-agradecimentos').classList.add('d-none')
        montarMensagemFeedback()
    })    
}


function retornaMensagemCorpo(desconformidade=true){
    const opcao = document.getElementById('conf_avaliacao').value;
    if(opcao==1){//validado
        return '<h2>O status do seu trabalho foi alterado para <b> <b>VALIDADO PELO ORIENTADOR</b></h2>'
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
        return '<h2>O status do seu trabalho foi alterado para <b>CONFORMIDADE</b></h2>'
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
 * TABELA DE PROJETOS 
 */

function projetosDocente(){
    const elReferencia = document.querySelector('div.detalhes-evento')

    fetch(chrome.runtime.getURL("src/projetos-docente.html"))
        .then(response => response.text())
        .then(arquivoImportado => {
            elReferencia.insertAdjacentHTML('beforeend', arquivoImportado);
        })
        .catch(error => {
            console.error("Erro ao tentar importar o arquivo da extensão:", error)
        })
}

const buscarBolsistas = async(idProjeto) => {
    var requestOptions = {
    method: 'GET',
    redirect: 'follow'
    };

    let bolsistas = await fetch(`https://proppg.unilab.edu.br/forms/webservices/bolsistas.php?idProjeto=${idProjeto}`, requestOptions)
    .then(response => response.json())
    .then(result => {
        var listagem = ``
            listagem += `<table class="table table-sm table-hover" style="max-width: 100%;">` 
            listagem += `<thead>` 
            listagem += ` <tr>` 
            listagem += `  <th>Bolsista</th>`
            listagem += `  <th>Condição</th>` 
            listagem += `  <th>Fomento</th>` 
            listagem += `  <th>Vigência</th>` 
            listagem += ` </tr>` 
            listagem += `</thead>` 
            listagem += `<tbody>` 
            result.forEach(bolsista => {
                listagem += `<tr>` 
                listagem += `  <td>${bolsista.bolsista}</td>` 
                listagem += `  <td>${bolsista.condicao}</td>` 
                listagem += `  <td>${bolsista.fomento}</td>` 
                listagem += `  <td>${bolsista.dataInicioCota} a ${bolsista.dataFinalCota}</td>` 
                listagem += `</tr>` 
            })
            listagem += `</tbody>` 
            listagem += `</table>`
            document.querySelector(`#projeto_${idProjeto}`).insertAdjacentHTML('afterbegin',listagem)
        })
        .catch(error => console.log('error', error))
}

async function buscarProjetos(){
    const elDetalhesEvento = document.querySelector('div.detalhes-evento')
    const orientador = elDetalhesEvento.querySelector('b:nth-child(7)')
    var requestOptions = {
    method: 'GET',
    redirect: 'follow'
    };

    let listagem = await fetch(`https://proppg.unilab.edu.br/forms/webservices/projetos.php?orientador=${orientador.textContent}`, requestOptions)
    .then(response => response.json())
    .then(result => {
        var listagem = ``
        let projetos = result.filter(el => el.codEdital.search('202') != -1)
        if(projetos.length > 0){
            projetos.forEach(projeto => {
                let anoFinal = projeto.dataFinal.substr(projeto.dataFinal.length-4,4)
                listagem = ``
                listagem += `<div class="card mt-3 border-primary ">`
                listagem += `<div class="card-header text-white font-weight-bolder bg-primary p-2">${projeto.codEdital} `
                listagem += `<span class="badge badge-dark">${anoFinal > 2023 ? 'Simples' : 'Expandido'}</span></div>`
                listagem += `<div class="card-body p-2">`
                listagem += `    <h2 class="card-text my-2">${projeto.titulo} (${projeto.dataInicio} a ${projeto.dataFinal})</h2>`
                listagem += `<div id="projeto_${projeto.idProjeto}"></div>`
                listagem += `</div>`
                listagem += `</div>`
                document.querySelector('#projetos-docente').insertAdjacentHTML('afterbegin', `${listagem}`)
                buscarBolsistas(projeto.idProjeto)
            })
        }else{
            listagem += `<p>Nenhum bolsista encontrado em editais a partir de 2020</p>`
        }
        orientador.insertAdjacentHTML('afterend', `<span class="badge badge-pill badge-danger ml-2 px-2">${projetos.length} projetos</span>`)
    })
    .catch(error => console.log('error', error))
}

/**
 * 
 * MONTAGEM DE MENSAGENS PARA CADA SITUAÇÃO
 */

function montarMensagemAprovado(){
    let body = ``
    body += `<h2>Parabéns! Seu trabalho foi aprovado para apresentação no <b>Encontro de Iniciação Científica</b>.</h2>`
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
    body += `<p>Prezado(a) autor(a), conforme divulgado no site da `
    body += `<a href="https://semanauniversitaria.unilab.edu.br/encontros/#Encontro_de_IC" target="_blank">Semana Universitária</a> `
    body += `o Encontro de Iniciação Científica recebe resumo simples ou expandido de aluno bolsista e/ou voluntário cadastrados <b>em projetos de pesquisas institucionalizados</b> no âmbito do PIBIC/PIBITI/Unilab ou em Fluxo Contínuo.</p>`
    body += `<p>Não conseguimos, portanto, relacionar o trabalho enviado a qualquer projeto cadastrado junto a PROPPG.</p>`
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
    msg += `<div style="text-align: center; display: block;"><img width="500" src="https://proppg.unilab.edu.br/forms/logo/topo-encontro-de-ic.png" alt="Encontro de Iniciação Científica" ></div>`
    msg += retornaMensagemCorpo(desconformidade)
    document.getElementById('msm_avaliacao').innerText = msg
    document.querySelector('#MsgOutput p.saidaUsuario').innerHTML = msg
}

function montarRodapeDuvidaPibic(){
    let idTrabalho = document.querySelector('#conteudo h3 > span > b:nth-child(1)')
    msg = `<p>Para dúvidas e/ou esclarecimentos, você pode nos contactar através do e-mail `
    msg += `<a href="mailto:pibic@unilab.edu.br?subject=Dúvida sobre a submissão do trabalho ${idTrabalho.innerText}&body=Prezados(s), estou com uma dúvida sobre a submissão ao Encontro de Iniciação Científica.">pibic@unilab.edu.br</a></p>`
    msg += `<div style="text-align: center; display: block;"><img width="400" src="https://proppg.unilab.edu.br/forms/logo/rodape-encontro-de-ic.png" alt="Unilab / Proppg / CPq" ></div>`

    return msg
}

function montarRodapeDuvidaCpq(){
    let idTrabalho = document.querySelector('#conteudo h3 > span > b:nth-child(1)')
    msg = `<p>No caso de dúvidas, entrar em contato conosco através do e-mail `
    msg += `<a href="mailto:cpq@unilab.edu.br?subject=Dúvida sobre a submissão do trabalho ${idTrabalho.innerText}&body=Prezados(s), gostaria de obter mais informações sobre a REPROVAÇÃO do meu trabalho submetido ao Encontro de Iniciação Científica.">cpq@unilab.edu.br</a></p>`
    msg += `<div style="text-align: center; display: block;"><img width="400" src="https://proppg.unilab.edu.br/forms/logo/rodape-encontro-de-ic.png" alt="Unilab / Proppg / CPq" ></div>`

    return msg
}

function saidaExtra(){
    return `<p>${document.querySelector('#saidaExtra').value}</p>`
}
