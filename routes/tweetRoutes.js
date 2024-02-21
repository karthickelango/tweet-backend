import express from "express"
import { Book } from "../models/tweetSchema.js"
const router = express.Router()
import multer from "multer";


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, './postImages')
    },
    filename: function (req, file, cb) {
        return cb(null, `${Date.now()}_${file.originalname}`)
    }
})
const upload = multer({ storage })

// post
router.post('/', upload.single('file'), async (req, res) => {
    try {
        if (!req.body.userName || !req.body.tweet || !req.body.user_id) {
            return res.status(400).send({ message: 'sent all fields' })
        }
        const newBook = {
            userName: req.body.userName,
            tweet: req.body.tweet,
            user_id: req.body.user_id,
            postImage: req.file.filename
        }
        const book = await Book.create(newBook)
        return res.status(201).send(book)
    } catch (error) {
        console.log(error.message)
        res.status(500).send({ message: error.message })
    }
})

// get post
router.get('/', async (req, res) => {
    try {
        const books = await Book.find({}).sort({ createdAt : -1 })
        return res.status(200).json({
            count: books.length,
            data: books
        })
    }
    catch (error) {
        console.log(error)
    }
})

// get post
router.get('/avatar', async (req, res) => {
    try {
        const books = await Book.aggregate(
            [
                {
                    $lookup: {
                        from: "user-auths",
                        localField: "user_id",
                        foreignField: "_id",
                        as: "user"
                    }
                }
            ]
        )
        return res.status(200).json({
            count: books.length,
            data: books
        })
    }
    catch (error) {
        console.log(error)
    }
})

// get post by id
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const book = await Book.findById(id)
        return res.status(200).json(book)
    }
    catch (error) {
        console.log(error)
    }
})

// update post
router.put('/:id', async (req, res) => {
    try {
        if (!req.body.tweet) {
            return res.status(400).send({ message: 'sent all fields' })
        }
        const { id } = req.params
        const result = await Book.findByIdAndUpdate(id, req.body)
        if (!result) {
            return res.status(404).send({ message: "Not found" })
        }
        return res.status(201).send({ message: "Updated" })
    } catch (error) {
        console.log(error.message)
        res.status(500).send({ message: error.message })
    }
})

// delete post

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const result = await Book.findByIdAndDelete(id)
        if (!result) {
            return res.status(404).send({ message: "Not found" })
        }
        return res.status(201).send({ message: "Deleted" })
    } catch (error) {
        console.log(error.message)
        res.status(500).send({ message: error.message })
    }
})

export default router