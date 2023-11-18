const router = require('express').Router();
const {
    fetchFAQ,
    createFAQ,
    updateFAQ,
    deleteFAQ
} = require("../controllers/faq.controller.js");

router.get('/', fetchFAQ);
router.post('/createFAQ', createFAQ);
router.put('/updateFAQ/:faqId', updateFAQ);
router.delete('/deleteFAQ/:faqId', deleteFAQ);

module.exports = router;