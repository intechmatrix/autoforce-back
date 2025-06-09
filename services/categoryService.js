import { Category } from "../models/model.js";

export const createCategoryService = async (body) => {
  return Category.create(body);
};

export const updateCategoryService = async (id, body) => {
  return Category.update(body, { where: { id: id } });
};

export const getAllCategoriesService = async () => {
  return Category.findAll({
    order: [['title', 'ASC']]
  });
};

export const getCategoryByIdService = async (id) => {
  return Category.findOne({
    where: { id: id }
      });
};

export const deleteCategoryByIdService = async (id) => {
    return Category.destroy({
      where: { id: id }
    });
  };

export const deleteAllCategoriesService = async () => {
    return Category.destroy({
      where: {},
      truncate: true
    });
  };


  
