const Order = require("../../../models/Order");
const { Product } = require("../../../models/Product");
const isInt = require("validator/lib/isInt");
const ObjectId = require("mongoose").Types.ObjectId;

const getOrders = async (req, res) => {
    try {
        const foundOrders = await Order.find();
        const transformedOrders = foundOrders.map((order) => {
            let totalPrice = 0;
            let numberOfProducts = 0;
            order.products.forEach((product, j) => {
                const { id, name, price, imageUrl, thumbnailUrl } = product.transform();
                const quantity = order.quantity[j];
                totalPrice += price * quantity;
                numberOfProducts += quantity;
                return (order.products[j] = { id, name, price, thumbnailUrl, imageUrl, quantity });
            });

            return { ...order.transform(), totalPrice, numberOfProducts };
        });
        for (const order of transformedOrders) {
            delete order.quantity;
        }

        return res.status(200).json(transformedOrders);
    } catch (error) {
        return res.status(500).json(error);
    }
};

const createOrder = async (req, res) => {
    const { products } = req.body;
    const idsOfProducts = [];
    const quantityOfProducts = [];
    const errors = {};
    if (!products) return res.status(400).json({ error: "products is required" });
    products.forEach((product) => {
        if (typeof product.quantity == "undefined") errors.productQuantity = "quantity of product is required";
        if (typeof product.id == "undefined") errors.productId = "id of product is required";
        if (Object.keys(errors).length > 0) return res.status(400).json(errors);
        if (typeof product.quantity != "number" || product.quantity <= 0 || !isInt(product.quantity + "")) {
            return res.status(400).json({ error: "quantity of product is invalid" });
        }
        if (!ObjectId.isValid(product.id)) {
            return res.status(400).json({ error: "productId is invalid" });
        }
        idsOfProducts.push(product.id);
        quantityOfProducts.push(product.quantity);
    });
    try {
        const foundProducts = await Product.find().where("_id").in(idsOfProducts);
        if (products.length != foundProducts.length) return res.status(400).json({ error: "Product not found" });
        const newOrder = new Order({
            products: foundProducts,
            quantity: quantityOfProducts,
            orderTime: Date.now(),
            shippingTime: Date.now(),
        });
        await newOrder.save();
        newOrder.products.forEach((product, i) => (newOrder.products[i] = product.transform()));
        return res.status(201).json(newOrder.transform());
    } catch (error) {
        return res.status(500).json(error);
    }
};

module.exports = { getOrders, createOrder };
