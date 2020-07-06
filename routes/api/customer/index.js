const express = require("express");
const router = express.Router();
const customerController = require("./controller");

router.get("/", customerController.getCustomers);
router.get("/:customerId", customerController.getCustomerById);
router.post("/", customerController.createCustomer);
router.put("/:customerId", customerController.updateCustomer);
router.delete("/:customerId", customerController.deleteCustomer);

module.exports = router;
