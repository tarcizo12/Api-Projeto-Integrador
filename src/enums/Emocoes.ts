enum EMOCOES  {
    EMPOLGACAO = "Empolgação",
    EXCITACAO = "Excitação",
    FELICIDADE = "Felicidade",
    TRISTEZA = "Tristeza",
    RAIVA = "Raiva",
    MEDO = "Medo",
    SURPRESA = "Surpresa",
    ENTUSIASMO = "Entusiasmo"
}

const getEmocoesConcatenadasString = (): string =>{
    return Object.values(EMOCOES)
        .map(emocao => emocao) 
        .join(', ');
}

export {EMOCOES , getEmocoesConcatenadasString}