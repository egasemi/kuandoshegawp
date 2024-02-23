const qrcode = require('qrcode-terminal')
const { Client, LocalAuth } = require('whatsapp-web.js')
const { stopInfo, stopSearch } = require('../../../bot')
const { normalizer, send, default_responses, cleanString, isDefaultResponses, errorHandler } = require('../../utils')
const { getAddress, getLocation } = require('../../../ksh')

let clientWSP = null

const initWSP = async () => {
    clientWSP = new Client({
        authStrategy: new LocalAuth({ clientId: "ksh-prod" }),
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
        (await msj.getChat()).sendStateTyping()
        const cleanedString = cleanString(msj.body)
        const idx = isDefaultResponses(msj.body)
        if (!isNaN(parseInt(cleanedString)) && cleanedString.length === 4) {
            try {
                const { text } = await stopInfo(cleanedString)
                send(msj, text, true)
            } catch (error) {
                const { message } = errorHandler(error)
                console.log(message)
                send(msj, message, true)
            }
        } else if (idx !== -1) {
            msj.reply(default_responses[Object.keys(default_responses)[idx]])
        } else if (/^(?!start\b)[\w\s]+$/.test(normalizer(msj.body))) {
            try {
                const esquinas = await getAddress(msj.body);

                var stops = {
                    text: 'Disculpá esa calle no la conozco 🤌'
                };

                if (esquinas.data.features.length !== 0 && esquinas?.data.features[0].geometry !== null) {
                    stops = await stopSearch(esquinas?.data.features[0]);
                }

                send(msj, stops.text, true)
            } catch (error) {
                const { message } = errorHandler(error)
                console.log(message)
                send(msj, message, true)
            }
        } else if (msj.type === 'location') {
            try {
                const { latitude, longitude } = msj.location
                const dir = await getLocation(latitude, longitude)
                const stops = await stopSearch(dir.data)

                send(msj, stops.text, true)
            } catch (error) {
                const { message } = errorHandler(error)
                console.log(message)
                send(msj, message, true)
            }
        } else if (msj.body === '!test') {
            msj.react('✅')
        } else {
            console.log(idx)
            console.log(/^(?!start\b)[\w\s]+$/.test(normalizer(msj.body)))
        }
    })

    await clientWSP.initialize()
}

module.exports = { initWSP }