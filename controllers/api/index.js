const router = require('express').Router();
const userRoutes = require('./users');
const chatRoutes = require('./chats');

router.use('/users', userRoutes);
router.use('/chats', chatRoutes)

module.exports = router;
