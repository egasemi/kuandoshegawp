import wpbot from 'whatsapp-web.js';
import qrt from 'qrcode-terminal';
import mongoose from "mongoose";
import { getAddress, getLocation } from './ksh.js';
import { stopInfo, stopSearch } from './bot.js';
import { normalizer } from './utils.js'
import { MongoStore } from 'wwebjs-mongo';
const { Client, LocalAuth, RemoteAuth } = wpbot

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017').then(() => {
    const store = new MongoStore({ mongoose })
    const client = new Client({
        puppeteer: {
            args: ['--no-sandbox']
        },
        authStrategy: new RemoteAuth({
            store,
            backupSyncIntervalMs: 300000
        })
    });

    client.on('qr', qr => {
        qrt.generate(qr, { small: true });
    });

    client.on('authenticated', () => {
        console.log('Auth OK')
    })

    client.on('ready', () => {
        console.log('Client is ready!');
    });

    const send = async (req, res, reply) => {
        if (reply) {
            req.reply(res)
        } else {
            const chat = await req.getChat()
            chat.sendMessage(res)
        }
    }

    client.on("message", async (msj) => {
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

    client.initialize();

})


