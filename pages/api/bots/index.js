import Mongo from '/middleware/mongo'
import { Bot } from '/models/'

const Handle = async (req,res) => {
    switch (req.method) {
        case 'GET':
            const bots = await Bot.find()
            res.status(200).json(bots)
            break
        case 'POST':
            try {
                const bot = await ( await new Bot(req.body) ).save()
                res.status(200).json(bot)
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