import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    email: { type: String, required: true },
    username: { type: String, required: true, unique: true},
    password: {type: String, required: true},
    avatar: {type: String}
})

export const User = mongoose.model('User-auth', userSchema)