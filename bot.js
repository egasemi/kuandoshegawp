const { normalizer, errorHandler, flagColor, arribosFormat } = require("./src/utils.js");
const { getStop, getStops } = require("./ksh.js");

const stopInfo = async (stop) => {
    try {

        const cuandollega = await getStop(stop);

        const bondis = cuandollega.data;

        if (bondis.length > 0) {
            bondis.sort((a, b) => {
                if (a.arribos[0].arriboEnMinutos > b.arribos[0].arriboEnMinutos) {
                    return 1;
                }
                if (a.arribos[0].arriboEnMinutos < b.arribos[0].arriboEnMinutos) {
                    return -1;
                }

                return 0;
            });

            var text = `Próximos arribos de la parada *#${stop}*\n\n`;

            bondis.forEach((bondi) => {
                text +=
                    `*${bondi.linea.codigoEMR}* ` +
                    `${flagColor(bondi)} : ` +
                    `${arribosFormat(bondi.arribos)}` +
                    `${bondi.arribos[1] ? ', ' + bondi.arribos[1].arriboEnMinutos + ' min' : ''}\n`;
            });
            return { text };
        } else {
            return {
                text: normalizer(`No hay próximos arribos a la parada */${stop}* 😔`),
            };
        }
    } catch (error) {
        errorHandler(error);
        return { text: 'La parada no existe' };
    }
};

const stopSearch = async (address) => {
    try {
        const { geometry, properties } = address;
        const name = normalizer(properties.name);

        const stops = await getStops(geometry);

        let text = `Paradas cercanas a *${name}:*\n\n`;

        stops.data.forEach((stop, idx) => {
            text += `*#${stop.id}* -> ${stop.nombre}\n`
        });

        return { text };
    } catch (error) {
        errorHandler(error);
    }
};

module.exports = { stopInfo, stopSearch }