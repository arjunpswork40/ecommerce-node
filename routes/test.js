const express = require("express");
const router = express.Router();
const {
    insertDummyUser
} = require('../app/controllers/testController')

/* GET users listing. */

router.get("/", insertDummyUser);


module.exports = router;