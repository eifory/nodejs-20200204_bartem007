const Product = require('../models/Product');
const mongoose = require('mongoose');
const formatProduct = require('../format/formatProduct');

module.exports.productList = async function productList(ctx, next) {
  if (ctx.query.subcategory) {
    const subcategory = ctx.query.subcategory;
    const products = await Product.find({
      subcategory: subcategory,
    });
    ctx.body = {
      products: products.map(formatProduct),
    };
  } else {
      const products = await Product.find({});
      ctx.body = {
        products: products.map(formatProduct),
      };
  }
};

module.exports.productById = async function productById(ctx, next) {
  const productId = ctx.params.id;
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    ctx.throw(400, 'id is not valid');
  }
  const product = await Product.findById(productId);
  if (!product) {
    ctx.throw(404, 'there is no product with this id');
  }
  ctx.body = {
    product: formatProduct(product),
  };
};

