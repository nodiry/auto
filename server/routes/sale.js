const express = require('express');
const router = express.Router();

router.get('/', (req,res)=>{
    res.send('hi from sales page');
});

module.exports = router;