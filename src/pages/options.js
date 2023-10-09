document.addEventListener('DOMContentLoaded', function () {
    var parametroInput = document.getElementById('parametro');
    var salvarButton = document.getElementById('salvar');

    salvarButton.addEventListener('click', function () {
        var parametroValor = parametroInput.value;

        // Salve o valor usando chrome.storage ou outro método de armazenamento de sua escolha.
        chrome.storage.sync.set({ parametro: parametroValor }, function () {
            console.log('Valor salvo: ' + parametroValor);
        });
    });
});