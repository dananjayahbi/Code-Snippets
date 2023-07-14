const router = require("express").Router();

const {
    processPrompt,
} = require("../controllers/AIresponseController");

// GET AI RESPONSE
router.post("/processPrompt", processPrompt);

module.exports = router;
