const express = require('express');

const router = express.Router();

const { Chat } = require('../../models');

router.post('/', (req, res) => {
    const newChat = new Chat(req.body);

    newChat.save((err, savedChat) => {
      if (err) return res.json(err);

      res.json(savedChat);
    })
});


router.get('/all', async (req, res) => {
  try {
    const chatData = await Chat.find({
      "users.userId": req.user._id
    })

    res.json(chatData);

  } catch (err) {
    console.log(err);
    res.json(err);
  }
});


module.exports = router;
