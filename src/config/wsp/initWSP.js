const qrcode = require('qrcode-terminal')
const { Client, RemoteAuth } = require('whatsapp-web.js')
const { MongoStore } = require('wwebjs-mongo')
const { stopInfo, stopSearch } = require('../../../bot')
const { normalizer, send } = require('../../utils')
const { getAddress, getLocation } = require('../../../ksh')

let clientWSP = null

const initWSP = async (db) => {
    const store = new MongoStore({ mongoose: db })
    clientWSP = new Client({
        authStrategy: new RemoteAuth({
            clientId: 'emi',
            store: store,
            backupSyncIntervalMs: 60000
        }),
        puppeteer: {
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        }
    })

    clientWSP.on('qr', qr => {
        qrcode.generate(qr, { small: true })
    })

    clientWSP.on('authenticated', () => {
        console.log('auth ok')
    })

    clientWSP.on('remote_session_saved', () => {
        console.log('remote sesion saved')
    })

    clientWSP.on('message', async (msj) => {
        if (!isNaN(parseInt(msj.body)) && msj.body.length === 4) {
            const { text } = await stopInfo(msj.body)
            send(msj, text, true)
        } else if (/^(?!start\b)[\w\s]+$/.test(normalizer(msj.body))) {
            const esquinas = await getAddress(msj.body);

            var stops = {
                text: 'La dirección o esquina no existe ¬¬'
            };

            if (esquinas.data.features.length !== 0 && esquinas?.data.features[0].geometry !== null) {
                stops = await stopSearch(esquinas?.data.features[0]);
            }

            send(msj, stops.text, true)
        } else if (msj.type === 'location') {

            const { latitude, longitude } = msj.location
            const dir = await getLocation(latitude, longitude)
            const stops = await stopSearch(dir.data)

            send(msj, stops.text, true)
        }
    })

    await clientWSP.initialize()
}

module.exports = { initWSP }