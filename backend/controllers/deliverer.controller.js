import Delivery from '../models/delivery.model.js';
import DeliveryRoute from '../models/deliveryRoute.model.js';
import Deliverer from '../models/deliverer.model.js';

// Route Management
export const getDeliveryRoutes = async (req, res) => {
    try {
        const routes = await DeliveryRoute.find({ deliverer: req.user.id })
            .populate('address.customer', 'name address');
        res.json(routes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createDeliveryRoute = async (req, res) => {
    try {
        const { routeName, description, addresses } = req.body;
        const route = new DeliveryRoute({
            deliverer: req.user.id,
            routeName,
            description,
            address: addresses
        });
        await route.save();
        res.status(201).json(route);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateDeliveryRoute = async (req, res) => {
    try {
        const route = await DeliveryRoute.findOneAndUpdate(
            { _id: req.params.routeId, deliverer: req.user.id },
            req.body,
            { new: true }
        );
        if (!route) return res.status(404).json({ message: 'Route not found' });
        res.json(route);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteDeliveryRoute = async (req, res) => {
    try {
        const route = await DeliveryRoute.findOneAndDelete({
            _id: req.params.routeId,
            deliverer: req.user.id
        });
        if (!route) return res.status(404).json({ message: 'Route not found' });
        res.json({ message: 'Route deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delivery Management
export const getDailyDeliveries = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const deliveries = await Delivery.find({
            deliverer: req.user.id,
            deliveryDate: {
                $gte: today,
                $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
            }
        }).populate('subscription', 'customer publication');
        
        res.json(deliveries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const markDeliveryComplete = async (req, res) => {
    try {
        const delivery = await Delivery.findOneAndUpdate(
            { _id: req.params.deliveryId, deliverer: req.user.id },
            { 
                isDelivered: true,
                deliveryStatus: 'delivered'
            },
            { new: true }
        );
        if (!delivery) return res.status(404).json({ message: 'Delivery not found' });
        res.json(delivery);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const markDeliveryFailed = async (req, res) => {
    try {
        const { failureReason } = req.body;
        const delivery = await Delivery.findOneAndUpdate(
            { _id: req.params.deliveryId, deliverer: req.user.id },
            { 
                isDelivered: false,
                deliveryStatus: 'failed',
                failureReason
            },
            { new: true }
        );
        if (!delivery) return res.status(404).json({ message: 'Delivery not found' });
        res.json(delivery);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Statistics and Payments
export const getDelivererStats = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const stats = await Delivery.aggregate([
            { $match: { 
                deliverer: req.user.id,
                deliveryDate: { $gte: today }
            }},
            { $group: {
                _id: '$deliveryStatus',
                count: { $sum: 1 }
            }}
        ]);
        
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getDelivererPayments = async (req, res) => {
    try {
        const deliverer = await Deliverer.findOne({ user: req.user.id });
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1);
        
        const deliveries = await Delivery.find({
            deliverer: req.user.id,
            deliveryStatus: 'delivered',
            deliveryDate: { $gte: startDate }
        }).populate('subscription', 'publication');
        
        const totalDeliveries = deliveries.length;
        const commissionRate = deliverer.commissionRate || 0.025;
        
        res.json({
            totalDeliveries,
            commissionRate,
            period: {
                start: startDate,
                end: new Date()
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

