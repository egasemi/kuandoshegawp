const flagColor = (bondi) => {
    const flag = bondi.linea.color;
    if (flag === 'black') return '⬛️';
    if (flag === 'red') return '🟥';
    if (flag === 'green') return '🟩';
    return '';
};

const arribosFormat = (arribos) => {
    if (arribos[0].arriboEnMinutos === 0) {
        return 'llegando';
    } else {
        return `${arribos[0].arriboEnMinutos} min`;
    }
};

const normalizer = (texto) => {
    return texto
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[().]/g, '\\$&');
};

const errorHandler = (error) => {
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
        //console.log(error.request);
        return;
    } else {
        // Something happened in setting up the request that triggered an Error
        console.log('falló acá #3');
        console.log('Error', error.message);
    }
};

const setCBData = (id, stop) => JSON.stringify({ id, stop });

const checkSameMsj = (new_text, old_text) => {
    return new_text?.replace(/[^\d]/g, '') !== old_text?.replace(/[^\d]/g, '');
};

const send = async (req, res, reply) => {
    if (reply) {
        req.reply(res)
    } else {
        const chat = await req.getChat()
        chat.sendMessage(res)
    }
}

const default_responses = {
    "gracias": "De nada :)"
}

module.exports = {
    flagColor,
    arribosFormat,
    normalizer,
    errorHandler,
    setCBData,
    checkSameMsj,
    send,
    default_responses
};
