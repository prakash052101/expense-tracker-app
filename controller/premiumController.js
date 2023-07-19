const path = require('path');
const db = require('../database/db');
const Rozarpay = require('razorpay');
const Order = require('../models/order');
const User = require('../models/user')
const dotenv =require('dotenv').config();
const { generateAccessToken } = require('../utils/token');




const purchasePremium = async(req,res,next)=>{
    try{
        var rzp = new Rozarpay({
            key_id:`${process.env.RAZORPAY_KEY_ID}`,
            key_secret:`${process.env.RAZORPAY_KEY_SECRECT}`
        })
        const amount = 4500;
        const order =await rzp.orders.create({amount,currency:"INR"});

        await req.user.createOrder({orderid:order.id,status:"PENDING"})
        return res.status(201).json({order,key_id:rzp.key_id})

        }
        catch (err){
                throw new Error(err);
        }
    
}
 
const updateOrder = async (req, res, next) => {
  try {
    const order_id = req.body.order_id;
    const payment_id = req.body.payment_id;
    const userId = req.user.id;
    const order = await Order.findOne({ where: { orderid: order_id } });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    await order.update({ paymentid: payment_id, status: 'SUCCESS' });

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.update({ ispremiumuser: true });

    res.status(201).json({ message: 'Transition successful', token: generateAccessToken(userId, true) });
  } catch (err) {
    console.log(err);
  }
};


const updateFailure = async(req,res,next)=>{
    const order_id = req.body.order_id;
    const order =await Order.findOne({where:{orderid:order_id}})
    await order.update({status:"FAILURE"});
}



module.exports={purchasePremium,updateOrder,updateFailure}
    