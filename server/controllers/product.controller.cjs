const Product = require('../models/product.model.cjs')
const ads = require('../models/advertisement.model.cjs')
const Order = require('../models/order.model.cjs')
const Payment = require('../models/Payment.model.cjs')
const Review = require('../models/review.model.cjs')
const User = require('../models/user.model.cjs')
const Reward = require('../models/reward.model.cjs')
const { uploadFileOnCloudinary } = require('../utils/cloudinary.utils.cjs')

exports.getProduct = async (req, resp) => {
    try {
        const { productId } = req.params
        const result = await Product.findById(productId).populate({
            path: 'reviews',
            populate: {
                path: 'author',
                select: 'name avatar'
            }
        }).exec();
        if (result) {
            return resp.status(201).send({ success: true, data: result });
        }
        else {
            return resp.status(404).send({ success: false })
        }
    }
    catch (err) {
        return resp.status(500).send({ success: false, message: err })
    }
}

exports.getProducts = async (req, resp) => {
    try {
        const { category } = req.params
        const result = await Product.find({ category: category })
        if (result) {
            resp.status(201).send({ success: true, data: result })
        }
        else {
            resp.status(404).send({ success: false, message: "Product not found" })
        }

    } catch (err) {
        resp.status(500).send({ success: false, message: err })
    }
}

exports.getAds = async (req, resp) => {
    try {
        const result = await ads.find()
        if (result) {
            resp.status(201).send({ success: true, data: result })
        }
    }
    catch (err) {
        resp.status(500).send({ success: false, message: err })
    }
}

// exports.getProductCombine = async (req, resp) => {
//     try {
//         const result = await 
//     } catch (err) {
//         resp.status(500).send({ success: false, message: err })
//     }
// }

exports.addReview = async (req, resp) => {
    try {
        const { review, productId } = req.body;
        let files_arr = []
        if (req.files) {
            const uploadPromises = req.files.file.map(item => uploadFileOnCloudinary(item, 'reviewFiles'));
            const uploadResults = await Promise.all(uploadPromises);
            files_arr = uploadResults.map(upload => upload.secure_url);
        }

        const result = await Review.create({ review: review, author: req.user.id, productId: productId, files: files_arr })
        const res = await Product.findByIdAndUpdate(productId, { $push: { reviews: result._id } })
        await User.findByIdAndUpdate(req.user.id, { $push: { reviews: result._id } })
        if (result) {
            return resp.status(201).send({ success: true })
        }

    }
    catch (e) {
        return resp.status(500).send({ success: false, message: e })
    }
}

exports.addLike = async (req, resp) => {
    try {
        const { reviewId } = req.params
        const review = await Review.findById(reviewId)
        if (review) {
            if (review.author != req.user.id) {
                review.likeCount++;
                review.likedUsers.push(req.user.id)
                review.save()
                return resp.status(201).send({ success: true })
            }
        }
    }
    catch (e) {
        return resp.status(500).send({ success: false, message: e });
    }
}

exports.removeLike = async (req, resp) => {
    try {
        const { reviewId } = req.params
        const review = await Review.findById(reviewId)
        if (review.author != req.user.id) {
            review.likeCount--;
            review.likedUsers.pull(req.user.id)
            review.save()
            return resp.status(201).send({ success: true })
        }
    }
    catch (e) {
        return resp.status(500).send({ success: false, message: e });
    }
}

exports.placeOrder = async (req, resp) => {
    try {
        let sum = 0
        const productIds = []
        const promises = req.body.cart.map(async element => {
            const product = await Product.findById(element._id);
            if (!product) {
                throw new Error(`Product with ID ${element._id} not found`);
            }
            return product;
        });

        const products = await Promise.all(promises);

        products.forEach(product => {
            sum += product.price;
            productIds.push(product._id);
        });

        let sum1 = 0;
        req.body.cart.forEach(element => {
            sum1 += element.price;
        });

        if (sum1 !== sum) {
            return resp.status(400).send({ success: false, message: 'Invalid product prices' });
        }

        const { cardCVV, cardMonth, cardName, cardNumber, cardYear } = req.body.inputValue;

        const paymentResult = await Payment.create({ cardHolder: cardName, cardCVV, cardNumber, cardMonth, cardYear });

        if (paymentResult) {
            const orderResult = await Order.create({
                ProductId: productIds,
                PaymentId: paymentResult._id,
                productCount: products.length,
                orderBy: req.user.id,
                TotalPrice: sum,
                orderProcess: [{ date: new Date(), status: 'order placed' }]
            });

            if (orderResult) {
                const arr = ['50% OFF on Clothes', '50% OFF on Electronics', '60% OFF on Womens Clothers']
                const rew = await Reward.create({ title: arr[Math.floor(Math.random() * arr.length)], desc: products[0].title })
                await User.findByIdAndUpdate(req.user.id, { $push: { orders: orderResult._id, rewards: rew._id } });
                return resp.status(201).send({ success: true, message: 'Order placed successfully' });
            } else {
                return resp.status(400).send({ success: false, message: 'Failed to create order' });
            }
        } else {
            return resp.status(400).send({ success: false, message: 'Transaction failed' });
        }

    } catch (e) {
        console.error(e);
        return resp.status(500).send({ success: false, message: e.message });
    }
}

exports.getOrders = async (req, resp) => {
    try {
        const orders = await Order.find({ orderBy: req.user.id }).populate('ProductId').populate('orderBy')
        if (orders) {
            return resp.status(201).send({ success: true, data: orders })
        }
    } catch (e) {
        return resp.status(500).send({ success: false, message: e });
    }
}

exports.cancelOrder = async (req, resp) => {
    try {
        const { orderId } = req.params
        await Order.findByIdAndDelete(orderId)
        await User.findByIdAndUpdate(req.user.id, { $pull: { orders: orderId } })
        return resp.status(201).send({ success: true })
    } catch (e) {
        return resp.status(500).send({ success: false, message: e });
    }
}

exports.getSearch = async (req, resp) => {
    try {
        const { search } = req.params;
        const regex = new RegExp(search, 'i');

        // Find products that match the search parameter in title, description, or category
        const products = await Product.find({
            $or: [
                { title: { $regex: regex } },
                { description: { $regex: regex } },
                { category: { $regex: regex } }
            ]
        });
        return resp.status(201).send({ success: true, data: products })
    } catch (e) {
        return resp.status(500).send({ success: false, message: e });
    }
}

exports.setComplete = async (req, resp) => {
    try {
        const { rewardId } = req.params
        await Reward.findByIdAndUpdate(rewardId, { isComplete: true })
        return resp.status(201).send({ success: true })
    } catch (e) {
        return resp.status(500).send({ success: false, message: e });
    }
}

exports.getRewards = async (req, resp) => {
    try {
        const reward = await User.findById(req.user.id).populate('rewards')
        if (reward) {
            return resp.status(201).send({ success: true, data: reward });
        }

    } catch (e) {
        return resp.status(500).send({ success: false, message: e });
    }
}