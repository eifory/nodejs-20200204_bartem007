module.exports = function formatProduct(product) {
  const {title, description, images, price, category, subcategory, _id: id} = product;
  return {id, title, description, images, price, category, subcategory};
};
