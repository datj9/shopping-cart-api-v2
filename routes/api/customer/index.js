const express = require("express");
const router = express.Router();
const customerController = require("./controller");
const { authenticate, authorize } = require("../../../middlewares/auth");

router.get("/", authenticate, authorize(["admin"]), customerController.getCustomers);
router.get("/:customerId", authenticate, authorize(["admin"]), customerController.getCustomerById);
router.post("/", authenticate, authorize(["admin"]), customerController.createCustomer);
router.put("/:customerId", authenticate, authorize(["admin"]), customerController.updateCustomer);
router.delete("/:customerId", authenticate, authorize(["admin"]), customerController.deleteCustomer);

module.exports = router;
