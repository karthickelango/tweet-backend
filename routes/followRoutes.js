import express from "express"
import { Follow } from "../models/followSchema.js"

const router = express.Router()
router.get('/follower', async (req, res) => {
  try {
    const follow = await Follow.find({})
    return res.status(200).json({
      count: follow.length,
      data: follow
    })
  }
  catch (error) {
    console.log(error)
  }
})

router.post('/follow/:followerId/:followeeId', async (req, res) => {
  const { followerId, followeeId } = req.params;
  const existingFollow = await Follow.findOne({ followerId, followeeId });

  if (!existingFollow) {
    const follower = await Follow.create({ followerId, followeeId, followStatus: "yes" })
    res.status(200).json({ follower });
  } else {
    res.status(400).json({ success: false, message: 'Already following.' });
  }
});

export default router