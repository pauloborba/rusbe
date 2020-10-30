import mongoose from 'mongoose'
import Message from '../../../common/message'
import User from '../../../common/user'

const GroupSchema = new mongoose.Schema({
    id: String,
    name: String,
    messagesID: [String],
    usersID: [String],
    meals_times: []
})

export default mongoose.model('Group', GroupSchema)