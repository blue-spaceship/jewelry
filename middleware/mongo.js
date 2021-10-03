import mongoose from 'mongoose'

const connectDB = handler => async (req, res) => {
    if(mongoose.connections[0].readyState){
        return handler(req, res)
    }

    const options = {
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
        useNewUrlParser: true
    }

    try {
        mongoose.connect( getMongoURI() , {} , error => {
            if(error) throw error
            console.error(`Connected on ${process.env.NODE_ENV}!`)
        })
    } catch (error) {
        console.error(error)
		res.status(500).end()
    }

    return handler(req, res)
}

function getMongoURI(){
    let MONGO_URI = `${process.env.MONGODB_URI}`
    if(process.env.NODE_ENV !== 'production'){ MONGO_URI += `-${process.env.NODE_ENV}` }
    return MONGO_URI
}

export default connectDB