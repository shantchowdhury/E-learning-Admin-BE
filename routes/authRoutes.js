const router = require('express')();
const {login, verify, check, logout} = require('../controllers/auth.controller.js');
const authorization = require('../middleware/authorization.js');

router.get('/check', authorization, check);
router.post('/login', login);
router.post('/verify',authorization, verify);
router.get('/logout', logout);

module.exports = router;
