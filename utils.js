export const flagColor = (bondi) => {
    const flag = bondi.linea.color;
    if (flag === 'black') return '⬛️';
    if (flag === 'red') return '🟥';
    if (flag === 'green') return '🟩';
    return '';
};

export const arribosFormat = (arribos) => {
    if (arribos[0].arriboEnMinutos === 0) {
        return 'llegando';
    } else {
        return `${arribos[0].arriboEnMinutos} min`;
    }
};

export const normalizer = (texto) => {
    return texto
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[().]/g, '\\$&');
};

export const errorHandler = (error) => {
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log('falló acá #1');
        console.log(error.response.data);
        return;
    } else if (error.request) {
        // The request was made but no response was received
        // http.ClientRequest in node.js
        console.log('falló acá #2');
        console.log(error.request);
        return;
    } else {
        // Something happened in setting up the request that triggered an Error
        console.log('falló acá #3');
        console.log('Error', error.message);
    }
};

export const setCBData = (id, stop) => JSON.stringify({ id, stop });

export const checkSameMsj = (new_text, old_text) => {
    return new_text?.replace(/[^\d]/g, '') !== old_text?.replace(/[^\d]/g, '');
};
