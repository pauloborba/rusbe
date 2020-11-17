import mongoose from 'mongoose'

const MsgSchema = new mongoose.Schema({
    id: String,
    content: String,
    author: String,
    timestamp: String,
    type: String
})

export default mongoose.model('Message', MsgSchema)