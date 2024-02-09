import mongoose from 'mongoose'

const tweetSchema = mongoose.Schema(
    {
    userName: {
        type: String,
        required: true,
    },
    tweet: {
        type: String,
        required: true,
    },
    user_id: {
        type: mongoose.Schema.ObjectId,
        required: true
    },
},
{
    timestamps: true,
}
)
 
export const Book = mongoose.model('Tweet', tweetSchema)