import wpbot from 'whatsapp-web.js';
import qrcode from "qrcode";
import qrt from 'qrcode-terminal';
import ejs from 'ejs'
import express, { urlencoded } from "express"
import mongoose from "mongoose";
import { getAddress, getLocation } from './ksh.js';
import { stopInfo, stopSearch } from './bot.js';
import { normalizer } from './utils.js'
import { MongoStore } from 'wwebjs-mongo';
const { Client, RemoteAuth } = wpbot
const { toDataURL } = qrcode

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/wp_auth').then(() => {
    const store = new MongoStore({ mongoose })
    const client = new Client({
        puppeteer: {
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        },
        authStrategy: new RemoteAuth({
            store,
            backupSyncIntervalMs: 300000
        })
    });
    const app = express()
    app.use(urlencoded({ extended: false }))
    app.use(express.json())
    app.set("view engine", "ejs")

    client.on('qr', qr => {
        app.get('/scan', (req, res) => {
            toDataURL(qr, (err, src) => {
                if (err) res.send('error')

                res.render("scan", { src })
            })
        })
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

    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => console.log(`Server at ${5000}`));

})


