const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router.post("/createProduct", productController.createProduct);
router.post("/editProduct/:id", productController.editProduct);
router.post("/getAllProducts", productController.getAllProducts);

module.exports = router;
