import mongoose from 'mongoose'

const GroupSchema = new mongoose.Schema({
    id: String,
    name: String,
    messagesID: [String],
    usersId: [String],
    meals_times: [{userId:String, meal: String, fromTime: Date, toTime:Date}]
})

export default mongoose.model('Group', GroupSchema)