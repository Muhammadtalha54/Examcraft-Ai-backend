const express = require('express');
const { signup, login, verifyEmail, verifyEmailFromLink, forgotPassword, showResetPasswordForm, resetPassword } = require('../controllers/auth.controller');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/verify-email', verifyEmail);
router.get('/verify-email', verifyEmailFromLink); // For email link clicks

router.post('/forgot-password', forgotPassword); // Request password reset
router.get('/reset-password', showResetPasswordForm); // Show reset form
router.post('/reset-password', resetPassword); // Submit new password

module.exports = router;
