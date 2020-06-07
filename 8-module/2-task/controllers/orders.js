const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

const sendMail = require('../libs/sendMail');

module.exports.checkout = async function checkout(ctx, next) {
  const {product, phone, address} = ctx.request.body;
  try {
    const newOrder = new Order({
      user: ctx.user,
      product,
      phone,
      address,
    });
    await newOrder.save();
    const productInfo = newOrder.populate('product').product;
    const mailOptions = {
      template: 'order-confirmation',
      to: ctx.user.email,
      subject: 'Подтверждение заказа',
      locals: {
        id: newOrder.id,
        product: productInfo,
      },
    }
    await sendMail(mailOptions);
    ctx.body = {order: newOrder.id};
  } catch (err) {
    ctx.throw(err);
  }
}

module.exports.getOrdersList = async function ordersList(ctx, next) {
  orders = await Order.find({user: ctx.user.id}).populate('product');
  return ctx.body = {orders};
};
