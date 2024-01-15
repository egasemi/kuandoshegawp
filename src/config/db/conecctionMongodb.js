const { default: mongoose } = require("mongoose")

const initDB = async () => {
    const uri = process.env.MONGODB_URI
    try {
        await mongoose.connect(`${uri}/whatsapp`)
        console.log('DB connected')
        return mongoose
    } catch (error) {
        const messageError = 'DB conection error'
        console.error(messageError, error)
        throw new Error(messageError)
    }
}

const closeDb = async () => {
    try {
        await mongoose.connection.close()
        console.log('DB disconected')
    } catch (error) {
        const messageError = 'DB close error'
        console.error(messageError, error)
        throw new Error(messageError)
    }
}

module.exports = { initDB, closeDb }