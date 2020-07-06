const express = require("express");
const router = express.Router();
const orderController = require("./controller");

router.get("/", orderController.getOrders);
router.post("/", orderController.createOrder);

module.exports = router;
