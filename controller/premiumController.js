const Rozarpay = require('razorpay');
const Order = require('../models/order.model');
const User = require('../models/user.model');
const { generateAccessToken } = require('../utils/token');

const purchasePremium = async (req, res, next) => {
  try {
    var rzp = new Rozarpay({
      key_id: `${process.env.RAZORPAY_KEY_ID}`,
      key_secret: `${process.env.RAZORPAY_KEY_SECRECT}`
    });
    const amount = 4500;
    const order = await rzp.orders.create({ amount, currency: "INR" });

    const newOrder = new Order({ 
      orderid: order.id, 
      status: "PENDING", 
      userId: req.user._id 
    });
    await newOrder.save();
    
    return res.status(201).json({ order, key_id: rzp.key_id });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to create premium order' });
  }
}

const updateOrder = async (req, res, next) => {
  try {
    const order_id = req.body.order_id;
    const payment_id = req.body.payment_id;
    const userId = req.user._id;
    const order = await Order.findOne({ orderid: order_id });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.paymentid = payment_id;
    order.status = 'SUCCESS';
    await order.save();

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.ispremiumuser = true;
    await user.save();

    res.status(201).json({ 
      message: 'Transition successful', 
      token: generateAccessToken(userId, true) 
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to update order' });
  }
};

const updateFailure = async (req, res, next) => {
  try {
    const order_id = req.body.order_id;
    const order = await Order.findOne({ orderid: order_id });
    if (order) {
      order.status = "FAILURE";
      await order.save();
      res.status(200).json({ message: 'Order marked as failed' });
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to update order failure' });
  }
}



module.exports={purchasePremium,updateOrder,updateFailure}
    