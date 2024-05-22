const fs = require('fs');

// Função para remover duplicados com base no campo namePt
function removeDuplicates(data) {
    const seen = new Set();
    return data.filter(item => {
        const isDuplicate = seen.has(item.namePt);
        seen.add(item.namePt);
        return !isDuplicate;
    });
}

// Ler o arquivo alimentos.json
fs.readFile('saneantes.json', 'utf8', (err, jsonString) => {
    if (err) {
        console.log("Erro ao ler o arquivo:", err);
        return;
    }
    try {
        const alimentos = JSON.parse(jsonString);
        
        // Remover duplicados
        const alimentosCorrigidos = removeDuplicates(alimentos);
        
        // Escrever o novo arquivo alimentoCorrigidos.json
        fs.writeFile('saneantesCorrigidos.json', JSON.stringify(alimentosCorrigidos, null, 2), err => {
            if (err) {
                console.log("Erro ao escrever o arquivo:", err);
                return;
            }
            console.log('Arquivo alimentoCorrigidos.json criado com sucesso!');
        });
    } catch (err) {
        console.log('Erro ao analisar o JSON:', err);
    }
});
