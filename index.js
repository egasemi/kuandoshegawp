const api = require('./src/config/api')
const { initDB } = require('./src/config/db/conecctionMongodb.js')
const { initWSP } = require('./src/config/wsp/initWSP.js')

    ; (async () => {
        try {
            const db = await initDB()
            await initWSP(db)
            api.listen(3000, () => {
                console.log(`server listen in port ${3000}`)
            })
        } catch (error) {
            console.error(error)
            process.exit(1)
        }
    })()