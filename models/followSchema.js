import mongoose from "mongoose";

const followSchema = mongoose.Schema({
    followerId: { type: mongoose.Schema.ObjectId, required: true },
    followeeId: { type: mongoose.Schema.ObjectId, required: true },
    followStatus: {type: String, required : true}
})

export const Follow = mongoose.model('follow', followSchema)