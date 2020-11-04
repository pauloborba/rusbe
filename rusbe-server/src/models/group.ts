import mongoose from 'mongoose'

const GroupSchema = new mongoose.Schema({
    id: String,
    name: String,
    messagesID: [String],
    usersID: [String],
    meals_times: [{userID:String, meal: String, fromTime: Date, toTime:Date}]
})

export default mongoose.model('Group', GroupSchema)