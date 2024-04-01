const registration = require("../../controllers/auth/user");

const router = require("express").Router();

router.post("/registration", registration);


module.exports = router;