const express = require('express');
const router = express.Router();

router.get('/*', (req,res) => {
    res.sendFile(global.dirname + '/public/dist')
})

module.exports = router;