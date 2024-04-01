const { register, login } = require("../../controllers/auth/user");

const router = require("express").Router();

router.post("/register", register);
router.post("/login", login);



module.exports = router;