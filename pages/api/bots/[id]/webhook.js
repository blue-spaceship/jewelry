import mongoose from 'mongoose'
import Mongo from '/middleware/mongo'
import Handlebars from 'handlebars/dist/cjs/handlebars'

import { Bot, BotHistory } from '/models/'
import Discord, {  MessageEmbed }  from 'discord.js'
import Axios from 'axios'

const Handle = async (req,res) => {
    const { id } = req.query

    if( id === null || id === undefined || !mongoose.isValidObjectId(id)){
        return res.status(401)
    }
    
    const { url, headers, body, query, method } = req

    const bot = await Bot.findById(id)

    if(!bot){
        return res.status(404)
    }

    // const webhookClient = new WebhookClient({ url: bot.botWebhook })

    const embed = new MessageEmbed()
        .setTitle(bot.title)
        .setColor(bot.color)
        .setTimestamp()
        .setThumbnail(body.icon)
        .setImage(body.cover)
        .setURL(body.link || '#')
        .addFields( ...body.fields )
        .setFooter(`Enviado pelo bot ${ bot.name }`);

    const history = {
        bot: id,
        message: { content: JSON.stringify(embed) },
        payload: { 
            method : JSON.stringify(method),
            url : JSON.stringify(url),
            query : JSON.stringify(query),
            headers : JSON.stringify(headers),
            body : JSON.stringify(body)
        }
    }

    const data = await Axios.get(bot.botWebhook).then( result => result.data )
    const hook = new Discord.WebhookClient(data.id, data.token)

    await hook.send(
        Handlebars.compile(bot.template)(body),
        embed
    ).then( result => {
        history.message = { ...history.message, id: result.id, wasSended: true }
    }).catch( error => {
        history.message = { ...history.message, wasSended: false }
    }).finally(async ()=>{
        res.status(200).json( await ( await new BotHistory(history) ).save() )
    })

    res.end()
}

export default Mongo(Handle)