import mongoose from 'mongoose'
import Mongo from '/middleware/mongo'
import Handlebars from 'handlebars/dist/cjs/handlebars'
import Auth from '/middleware/auth'

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

    const embed = new MessageEmbed().setTitle( bot.title ).setTimestamp().setFooter(`Enviado pelo bot ${ bot.name }`).setColor( bot.color || '')
    
    if(body.embed){
        if(body.embed.icon){ embed.setThumbnail( body.embed.icon ) }
        if(body.embed.fields){ embed.addFields( ...body.embed.fields ) }
        if(body.embed.link){ embed.setURL(body.embed.link) }
        if(body.embed.cover){ embed.setImage(body.embed.cover) }
        if(body.embed.title){ embed.setTitle(body.embed.title) }
        if(body.embed.description){ embed.setDescription(body.embed.description) }
    }

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

    async function saveHistory(){
        const record = await new BotHistory(history)
    }

    await hook.send(
        Handlebars.compile(bot.template)(body),
        embed
    ).then( result => {
        history.message = { ...history.message, id: result.id, wasSended: true }
        saveHistory()
        res.status(200)
    }).catch( error => {
        history.message = { ...history.message, wasSended: false }
        saveHistory()
        res.status(500).json(error)
    })

    res.end()
}

export default Auth(Mongo(Handle))