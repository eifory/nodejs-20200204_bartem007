const Category = require('../models/Category');
const formatCategory = require('../format/formatCategory');

module.exports.categoryList = async function categoryList(ctx, next) {
  const categories = await Category.find({});
  ctx.body = {
    categories: categories.map(formatCategory),
  };
};

