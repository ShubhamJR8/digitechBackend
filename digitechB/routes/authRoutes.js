const express = require('express');
const { createUser, loginUserCtrl, getAllUsers, getaUser, deleteaUser, updateaUser, blockUser, unblockUser, handleRefreshToken, logout, updateaUserPassword } = require('../controllers/user.controller');
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware")
const router = express.Router();

router.post('/register', createUser);
router.post('/login', loginUserCtrl);
router.get('/all-users', getAllUsers)
router.get('/refresh',handleRefreshToken);
router.get('/logout',logout);
router.get('/:id',authMiddleware, isAdmin, getaUser)
router.delete('/:id', deleteaUser)
router.put('/edit-user',authMiddleware, updateaUser);
router.put('/edit-user-password',authMiddleware, updateaUserPassword);
router.put('/block-user/:id',authMiddleware, isAdmin, blockUser);
router.put('/unblock-user/:id',authMiddleware, isAdmin, unblockUser);

module.exports = router;