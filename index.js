const api = require('./src/config/api')
const { initWSP } = require('./src/config/wsp/initWSP.js')

    ; (async () => {
        try {
            await initWSP()
            api.listen(3000, () => {
                console.log(`server listen in port ${3000}`)
            })
        } catch (error) {
            console.error(error)
            process.exit(1)
        }
    })()