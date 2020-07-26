const express = require("express");
const router = express.Router();
const productController = require("./controller");
const { authenticate, authorize } = require("../../../middlewares/auth");

router.get("/", productController.getProducts);
router.get("/:productId", productController.getProductById);
router.post("/", authenticate, authorize(["admin"]), productController.createProduct);
router.put("/:productId", authenticate, authorize(["admin"]), productController.updateProduct);
router.delete("/:productId", authenticate, authorize(["admin"]), productController.deleteProduct);

module.exports = router;
