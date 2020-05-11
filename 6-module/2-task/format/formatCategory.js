module.exports = function formatCategory(category) {
  return {
    id: category.id,
    title: category.title,
    subcategories: category.subcategories.map((subcategory) => {
      const {id, title} = subcategory;
      return {
        id,
        title,
      };
    }),
  };
};
