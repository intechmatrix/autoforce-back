import { Product, Category } from "../models/model.js";

export const createProductService = async (body) => {
  return Product.create(body);
};

export const updateProductService = async (id, body) => {
  return Product.update(body, { where: { id: id } });
};

export const getAllProductsService = async () => {
  return Product.findAll({
    order: [["createdAt", "DESC"]],
  });
};

export const getProductByIdService = async (id) => {
  return Product.findOne({
    where: { id: id }
      });
};

export const deleteProductByIdService = async (id) => {
    return Product.destroy({
      where: { id: id }
    });
  };

export const deleteAllProductsService = async () => {
    return Product.destroy({
      where: {},
      truncate: true
    });
  };

export const getProductByCategoryService = async (categoryTitle) => {
    return Product.findAll({
      where: { category_title: categoryTitle },
    });
  };

// service function to get all Product for a specific category
export const getAllProductForCategoryService = async (category_title) => {
  return Product.findAll({
    where: { category_title: category_title },

    
    
    order: [["createdAt", "DESC"]],
  });
};  

export const getProductByIdOrSlug = async (productParam) => {
  if (!productParam) return null;

  const parsedId = Number(productParam);

  // Use ID only if it's a valid numeric ID
  if (!isNaN(parsedId) && productParam == parsedId) {
    return await Product.findOne({ where: { id: parsedId } });
  }

  // Otherwise, assume it's a slug
  return await Product.findOne({ where: { slug: productParam.toString() } });
};


  
