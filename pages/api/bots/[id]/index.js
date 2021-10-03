import mongoose from 'mongoose'
import Mongo from '/middleware/mongo'
import { Bot } from '/models/'

const Handle = async (req,res) => {
    const { id } = req.query

    if( id === null || id === undefined || !mongoose.isValidObjectId(id)){
        return res.status(401)
    }

    switch (req.method) {
        case 'GET':
            try {
                const bot = await Bot.findById(id)
                res.status(200).json(bot)
            } catch (error) {
                res.status(500).json(error)
            }
            break
        case 'PUT':
            try {
                const bot = await Bot.findByIdAndUpdate(id, req.body, { new: true })
                res.status(200).json(bot)
            } catch (error) {
                res.status(500).json(error)
            }
            break
        case 'DELETE':
            try {
                await Bot.findByIdAndDelete(id)
                res.status(200)
            } catch (error) {
                res.status(500).json(error)
            }
            break
        default:
            res.status(404)
            break
    }

    res.end()
}

export default Mongo(Handle)