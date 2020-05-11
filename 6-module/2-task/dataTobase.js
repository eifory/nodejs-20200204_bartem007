const Category = require('./models/Category');
const Product = require('./models/Product');

const cat = Category.create({
  title: 'Category1',
  subcategories: [{
    title: 'Subcategory1',
  }],
});

Product.create({
  title: 'Product1',
  description: 'Description1',
  price: 10,
  category: cat.id,
  subcategory: cat.subcategories[0].id,
  images: ['image1'],
});
