import mongoose from 'mongoose'
var Schema = mongoose.Schema

var BotSchema = new Schema({
    name: { type: String, trim: true },
    description: { type: String },
    botWebhook: { type: String, trim: true },
    title: { type: String },
    color: { type: String, default: '#0099ff' },
    template: { type: String, default: "Hello {{ name }}!" },
    test: { type: String, default: '{ "name" : "World" }' },
    isActive: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false }
})

var BotHistorySchema = new Schema({
    bot: { type: mongoose.ObjectId, ref: 'Bot', required: true, immutable: true },
    payload: {
        method : { type: String, imutable: true }, 
        url : { type: String, imutable: true }, 
        query : { type: String, imutable: true }, 
        headers : { type: String, imutable: true }, 
        body : { type: String, imutable: true }
    },
    message: { 
        id: { type: String, immutable: true },
        content: { type: String, immutable: true },
        wasSended: { type: Boolean, default: false, immutable: true }
    },
},{
    timestamps: true
})

export const Bot = mongoose.models.Bot || mongoose.model('Bot', BotSchema)
export const BotHistory = mongoose.models.BotHistory || mongoose.model('BotHistory', BotHistorySchema)
