import express from "express"
import { User } from "../models/userSchema.js"
import jwt from "jsonwebtoken";
import multer from "multer";

const router = express.Router()
const SECRET_KEY = 'key'
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, './images')
    },
    filename: function (req, file, cb) {
        return cb(null, `${Date.now()}_${file.originalname}`)
    }
})

const upload = multer({ storage })

// get user tweet
router.get('/mytweet', async (req, res) => {
    try {
        const books = await User.aggregate([
            {
                $lookup: {
                    from: "tweets",
                    localField: "_id",
                    foreignField: "user_id",
                    as: "myTweet"
                },
            },
            {
                $lookup: {
                    from: "follows",
                    localField: "_id",
                    foreignField: "followerId",
                    as: "followerList"
                }
            }
        ])
        return res.status(200).json({
            count: books.length,
            data: books
        })
    }
    catch (error) {
        console.log(error)
    }
})

// create user POST method
router.post('/register', async (req, res) => {
    try {
        if (!req.body.email || !req.body.username || !req.body.password) {
            return res.status(400).send({ message: 'sent all fields' })
        }
        const { email, username, password } = req.body
        const newUser = {
            email,
            username,
            password: password,
            avatar: null
        }
        const user = await User.create(newUser)
        return res.status(201).send(user)
    } catch (error) {
        console.log(error.message)
        res.status(500).send({ message: error.message })
    }
})

// get user GET method
router.get('/users', async (req, res) => {
    try {
        const users = await User.aggregate([
            {
                $lookup: {
                    from: "follows",
                    localField: "_id",
                    foreignField: "followerId",
                    as: "followeingList"
                }
            },
            {
                $lookup: {
                    from: "follows",
                    localField: "_id",
                    foreignField: "followeeId",
                    as: "followerList"
                }
            }
        ])
        return res.status(200).json({
            const: users.length,
            auth: users
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: error.message })
    }
})

// get login POST method 
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body
        const user = await User.findOne({ username })
        if (!user) {
            return res.status(401).json({ error: 'Invalid user name' })
        }
        const isPassword = await User.findOne({ password })
        if (!isPassword) {
            return res.status(401).json({ error: 'Invalid user password' })
        }
        const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '20s' })
        return res.status(201).send(token)
    } catch (error) {
        res.status(500).json({ error: 'Error login' })
    }
})

// get user by id
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findById(id)
        return res.status(200).json(user)
    }
    catch (error) {
        console.log(error)
    }
})

// upload user image
router.put('/upload/:id', upload.single('file'), async (req, res) => {
    try {
        const { id } = req.params
        const avatar = await User.findByIdAndUpdate(id, { avatar: req.file.filename })
        return res.status(201).send({ message: "Updated" })
    }
    catch (error) {
        console.log(error)
    } 
})

export default router