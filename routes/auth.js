const express = require("express"),
  router = express.Router(),
  { register, login } = require("../controllers/auth");

router.post("/register", register);
router.post("/login", login);

module.exports = router;
