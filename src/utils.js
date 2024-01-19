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
    const { request, response } = error;
    if (response) {
        const { message } = response.data;
        const status = response.status;
        console.log(message)
        return {
            message: "Algo salió mal",
            status,
        };
    } else if (request) {
        //request sent but no response received
        return {
            message: "Está caído cuando llega 🙄",
            status: 503,
        };
    } else {
        // Something happened in setting up the request that triggered an Error
        return { message: "Algo salió mal" };
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
    "gracias": "De nada 😊",
    "hola": "Holi! Mandame una esquina, una dirección, una ubicación o un número de parada para saber cuándo llega 😉"
}

const cleanString = (texto) => {
    return texto.replace(/[^A-Za-z0-9]/g, '');
};

const isDefaultResponses = (texto) => {
    return Object.keys(default_responses).findIndex(clave => new RegExp(clave, 'i').test(cleanString(texto)));
}


module.exports = {
    flagColor,
    arribosFormat,
    normalizer,
    errorHandler,
    setCBData,
    checkSameMsj,
    send,
    cleanString,
    isDefaultResponses,
    default_responses
};
