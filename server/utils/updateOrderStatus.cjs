const cron = require('node-cron');
const Order = require('../models/order.model.cjs'); // Adjust the path to your Order model

exports.uploadOrderStatus = () => {
    cron.schedule('0 0 * * *', async () => {
        try {
            const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);

            await Order.updateMany(
                { createdAt: { $lte: twoDaysAgo }, status: 'order placed' },
                {
                    $set: { status: 'order shipped' },
                    $push: { orderProcess: { date: Date.now(), status: 'order shipped' } }
                }
            );

            await Order.updateMany(
                { createdAt: { $lte: twoDaysAgo }, status: 'order shipped' },
                {
                    $set: { status: 'order picked' },
                    $push: { orderProcess: { date: Date.now(), status: 'order picked' } }
                }
            );

            await Order.updateMany(
                { createdAt: { $lte: twoDaysAgo }, status: 'order picked' },
                {
                    $set: { status: 'order delivered' },
                    $push: { orderProcess: { date: Date.now(), status: 'order delivered' } }
                }
            );

            console.log('Order statuses updated successfully');
        } catch (error) {
            console.error('Error updating order statuses:', error);
        }
    });
};
