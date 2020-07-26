const express = require("express");
const router = express.Router();

router.use("/categories", require("./category"));
router.use("/products", require("./product"));
router.use("/customers", require("./customer"));
router.use("/orders", require("./order"));
router.use("/users", require("./user"));

module.exports = router;
