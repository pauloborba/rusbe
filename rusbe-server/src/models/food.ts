import mongoose from 'mongoose'

const FoodSchema = new mongoose.Schema({
    name: String,
    likes: Number,
    dislikes: Number
})

export default mongoose.model('Food',FoodSchema)