const express = require('express');

const router = express.Router();

const meeting = require('./meeting'); 
const auth = require('../../middelwares/auth');

router.post('/add', auth, meeting.add);
router.get('/', auth, meeting.index);
router.get('/:id', auth, meeting.view);
router.delete('/:id', auth, meeting.deleteData);
router.post('/deleteMany', auth, meeting.deleteMany);


module.exports = router




