import mongoose from 'mongoose'

const SuggestionSchema = new mongoose.Schema({
    id: String,
    content: String,
    author: String,
    timestamp: Date
})

export default mongoose.model('Suggestion', SuggestionSchema)