const router = require("express").Router();

const {
  processPrompt,
} = require("../controllers/AIresponseController");

// POST request to process the initial prompt
router.post("/processPrompt", processPrompt);

module.exports = router;
