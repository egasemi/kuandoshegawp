const axios = require('axios');
const { errorHandler } = require("./src/utils.js");

const API_URL = 'https://ws.rosario.gob.ar/ubicaciones/public/';

axios.defaults.baseURL = API_URL

const getLocation = async (latitud, longitud) => {
    try {
        return axios({
            url: 'geojson/direccion/punto',
            params: {
                latitud,
                longitud,
            },
        });
    } catch (error) {
        errorHandler(error);
    }
};

const getAddress = async (term) => {
    try {
        return axios({
            url: 'geojson/ubicaciones',
            params: {
                term,
                extendido: true,
                otrasLocalidades: false,
            },
        });
    } catch (error) {
        errorHandler(error);
    }
};

const getStops = async (geometry) => {
    try {
        return axios({
            url: 'paradas',
            params: {
                xOrigen: geometry.coordinates[0],
                yOrigen: geometry.coordinates[1],
                radio: 300,
            },
        });
    } catch (error) {
        errorHandler(error);
    }
};

const getStop = async (stop) => {
    try {
        return axios({
            url: 'cuandollega',
            params: {
                parada: stop,
            },
        });
    } catch (error) {
        errorHandler(error);
    }
};

module.exports = { getLocation, getAddress, getStops, getStop };
