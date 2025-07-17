const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const {
  getMyGroups,
  createGroup,
  updateGroup,
  deleteGroup
} = require('../controllers/groupController');

router.get('/', auth, getMyGroups);
router.post('/', auth, createGroup);
router.put('/:id', auth, updateGroup);
router.delete('/:id', auth, deleteGroup);

module.exports = router;
