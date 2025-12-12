const Sweet = require('../models/Sweet');
const { Op } = require('sequelize');

exports.createSweet = async (req, res) => {
    try {
        // TODO: Check admin role (middleware should handle this, or check req.user.role here)
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }

        const { name, category, price, quantity } = req.body;
        const sweet = await Sweet.create({ name, category, price, quantity });
        res.status(201).json(sweet);
    } catch (error) {
        res.status(500).json({ message: 'Error creating sweet', error: error.message });
    }
};

exports.getAllSweets = async (req, res) => {
    try {
        const sweets = await Sweet.findAll();
        res.status(200).json(sweets);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching sweets', error: error.message });
    }
};

exports.searchSweets = async (req, res) => {
    try {
        const { q, category, minPrice, maxPrice } = req.query;
        const where = {};

        if (q) {
            where.name = { [Op.like]: `%${q}%` };
        }
        if (category) {
            where.category = category;
        }
        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
            if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
        }

        const sweets = await Sweet.findAll({ where });
        res.status(200).json(sweets);
    } catch (error) {
        res.status(500).json({ message: 'Error searching sweets', error: error.message });
    }
};

exports.updateSweet = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }
        const { id } = req.params;
        const [updated] = await Sweet.update(req.body, { where: { id } });
        if (updated) {
            const updatedSweet = await Sweet.findByPk(id);
            res.status(200).json(updatedSweet);
        } else {
            res.status(404).json({ message: 'Sweet not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating sweet', error: error.message });
    }
};

exports.deleteSweet = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }
        const { id } = req.params;
        const deleted = await Sweet.destroy({ where: { id } });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Sweet not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting sweet', error: error.message });
    }
};

exports.purchaseSweet = async (req, res) => {
    try {
        const { id } = req.params;
        const sweet = await Sweet.findByPk(id);
        if (!sweet) {
            return res.status(404).json({ message: 'Sweet not found' });
        }
        if (sweet.quantity <= 0) {
            return res.status(400).json({ message: 'Out of stock' });
        }
        sweet.quantity -= 1;
        await sweet.save();
        res.status(200).json({ message: 'Purchase successful', sweet });
    } catch (error) {
        res.status(500).json({ message: 'Error purchasing sweet', error: error.message });
    }
};

exports.restockSweet = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }
        const { id } = req.params;
        const { quantity } = req.body; // Add this amount
        if (!quantity || quantity <= 0) {
            return res.status(400).json({ message: 'Invalid quantity' });
        }
        const sweet = await Sweet.findByPk(id);
        if (!sweet) {
            return res.status(404).json({ message: 'Sweet not found' });
        }
        sweet.quantity += quantity;
        await sweet.save();
        res.status(200).json(sweet);
    } catch (error) {
        res.status(500).json({ message: 'Error restocking sweet', error: error.message });
    }
};
