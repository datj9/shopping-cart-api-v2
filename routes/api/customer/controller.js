const Customer = require("../../../models/Customer");
const isEmail = require("validator/lib/isEmail");
const ObjectId = require("mongoose").Types.ObjectId;

const getCustomers = async (req, res) => {
    try {
        const foundCustomers = await Customer.find();
        const customers = await foundCustomers.map((c) => c.transform());
        return res.status(200).json(customers);
    } catch (error) {
        return res.status(500).json(error);
    }
};

const getCustomerById = async (req, res) => {
    const { customerId } = req.params;
    if (!ObjectId.isValid(customerId)) return res.status(400).json({ error: "customerId is invalid" });
    try {
        const customer = await Customer.findById(customerId);
        if (!customer) return res.status(404).json({ error: "Customer not found" });
        return res.status(200).json(customer);
    } catch (error) {
        return res.status(500).json(error);
    }
};

const createCustomer = async (req, res) => {
    const { name, gender, email, phoneNumber } = req.body;
    const errors = {};

    if (!name) errors.name = "Name is required";
    if (!gender == undefined) errors.gender = "Gender is required";
    if (Object.keys(errors).length > 0) return res.status(400).json(errors);

    if (typeof gender != "number" || (gender != 1 && gender != 0)) {
        errors.gender = "gender is invalid";
    }
    if ((typeof email != "undefined" || email != "") && (typeof email != "string" || !isEmail(email))) {
        errors.email = "email is invalid";
    }
    if ((typeof phoneNumber != "undefined" || phoneNumber != "") && (typeof phoneNumber != "string" || phoneNumber.length != 10)) {
        errors.phoneNumber = "phoneNumber is invalid";
    }
    if (Object.keys(errors).length > 0) return res.status(400).json(errors);

    const newCustomer = new Customer({
        name,
        gender: gender == 0 ? "Nam" : "Nữ",
        email: email ? email : undefined,
        phoneNumber: phoneNumber ? phoneNumber : undefined,
    });

    try {
        await newCustomer.save();
        return res.status(201).json(newCustomer.transform());
    } catch (error) {
        return res.status(500).json(errors);
    }
};

const updateCustomer = async (req, res) => {
    const { customerId } = req.params;
    const { name, gender, email, phoneNumber } = req.body;
    const errors = {};

    if (!name) errors.name = "Name is required";
    if (!gender == undefined) errors.gender = "Gender is required";
    if (Object.keys(errors).length > 0) return res.status(400).json(errors);

    if (typeof gender != "number" || (gender != 1 && gender != 0)) {
        errors.gender = "gender is invalid";
    }
    if (typeof email != "undefined" && (typeof email != "string" || !isEmail(email))) {
        errors.email = "email is invalid";
    }
    if (typeof phoneNumber != "undefined" && (typeof phoneNumber != "string" || phoneNumber.length != 10)) {
        errors.phoneNumber = "phoneNumber is invalid";
    }
    if (Object.keys(errors).length > 0) return res.status(400).json(errors);

    try {
        await Customer.updateOne(
            { _id: customerId },
            {
                name,
                gender: gender == 0 ? "Nam" : "Nữ",
                email,
                phoneNumber,
            }
        );
        return res.status(200).json({ message: "Updated successfully" });
    } catch (error) {
        return res.status(500).json(error);
    }
};

const deleteCustomer = async (req, res) => {
    const { customerId } = req.params;

    if (!ObjectId.isValid(customerId)) return res.status(400).json({ customerId: "CustomerId is invalid" });

    try {
        const customer = await Customer.findById(customerId);
        if (!customer) return res.status(404).json({ error: "Customer not found" });
        await Customer.deleteOne({ _id: customerId });
        return res.status(200).json({ message: "Deleted successfully" });
    } catch (error) {
        return res.status(500).json(error);
    }
};

module.exports = { getCustomers, getCustomerById, createCustomer, updateCustomer, deleteCustomer };
