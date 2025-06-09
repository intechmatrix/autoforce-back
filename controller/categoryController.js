
import { HttpStatus } from "../config/httpStatusCodes.js";
import { categoryService } from "../services/index.js";
import cloudinary from "../utils/cloudinary.js";



export const createCategory = async (req, res, next) => {
  const user_id = res.locals.user_id

  try {
    const { title, description, active } = req.body;

    if (!title) {
      return res.status(HttpStatus.BAD_REQUEST_400).json({ error: 'Please provide all the required information' });
    }

    // // Fetch role details using role_id
    // const role = await roleService.getRoleByIdService(role_id);

    // if (!role) {
    //   return res.status(HttpStatus.NOTFOUND_404).json({ error: 'Role not found' });
    // }
    // // Check if the role's title is "Admin"
    // if (role.title !== 'Admin') {
    // return res.status(HttpStatus.FORBIDDEN_403).json({ error: 'You do not have permission to create about' });
    // }

    // Upload image to Cloudinary
    let featured_image = null;
    try {
        if (req.file && req.file.path) {
            const uploadResult = await cloudinary.uploader.upload(req.file.path);
            featured_image = uploadResult.secure_url;
        }
    } catch (err) {
        console.error('Error uploading picture:', err);
        return res.status(500).json({ error: 'Picture upload failed.' });
    }

    

    const category = await categoryService.createCategoryService({ title, description, featured_image, active, user_id: user_id });
    res.json({ message: 'Category created successfully', category });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR_500).json({ error: 'Internal server error' });
  }
};


export const viewAllCategories = async (req, res, next) => {
    // const role_id =  res.locals.role_id

  try {
      
      // Fetch and return all categories
      const categories = await categoryService.getAllCategoriesService();
      res.json({ categories });
  } catch (error) {
      console.error('Error viewing categories:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR_500).json({ error: 'Internal server error' });
  }
};


export const viewCategory = async (req, res, next) => {
    // const role_id =  res.locals.role_id

  try {
      const { id } = req.params;

      
   
      // Find category by id
      const category = await categoryService.getCategoryByIdService(id);
      if (!category) {
          return res.status(HttpStatus.NOTFOUND_404).json({ error: 'Category not found' });
      }

      res.json({ category });
  } catch (error) {
      console.error('Error viewing category:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR_500).json({ error: 'Internal server error' });
  }
};


export const updateCategory = async (req, res, next) => {
  const user_id = res.locals.user_id;

  try {
    const { id } = req.params;
    const { title, description, active } = req.body;

    // // Fetch role details using role_id
    // const role = await roleService.getRoleByIdService(role_id);

    // if (!role) {
    //   return res.status(HttpStatus.NOTFOUND_404).json({ error: 'Role not found' });
    // }

    // // Check if the role's title is "Admin"
    // if (role.title !== 'Admin') {
    //   return res.status(HttpStatus.FORBIDDEN_403).json({ error: 'You do not have permission to update about' });
    // }

    // Find category by id
    const category = await categoryService.getCategoryByIdService(id);
    if (!category) {
      return res.status(HttpStatus.NOTFOUND_404).json({ error: 'Category not found' });
    }

     // Upload image to Cloudinary if a new image is provided
     let featured_image = category.featured_image; // Retain existing image by default
     try {
       if (req.file && req.file.path) {
         // Delete the old image from Cloudinary if it exists
         if (featured_image) {
           const publicId = featured_image.split('/').pop().split('.')[0];
           await cloudinary.uploader.destroy(publicId);
         }
         // Upload the new image to Cloudinary
         const uploadResult = await cloudinary.uploader.upload(req.file.path);
         featured_image = uploadResult.secure_url;
       }
     } catch (err) {
       console.error('Error uploading image:', err);
       return res.status(HttpStatus.INTERNAL_SERVER_ERROR_500).json({ error: 'Image upload failed.' });
     }

    
    // Prepare data to send for updating
    // const dataToUpdate = { title, description, active, user_id: user_id };
    const dataToUpdate = {
      title: title || category.title,
      description: description || category.description,
      active: active !== undefined ? active : category.active,
      featured_image,
      user_id,
    };


    let response = await categoryService.updateCategoryService(id, dataToUpdate);

    // Check response and send appropriate message
    if (response[0] > 0) {
      res.status(HttpStatus.SUCCESS_200).json({ message: 'Category updated successfully' });
    } else {
      res.status(HttpStatus.BAD_REQUEST_400).json({ message: 'Update failed. No changes made.' });
    }
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR_500).json({ error: 'Internal server error' });
  }
};


export const deleteCategory = async (req, res, next) => {
    const user_id = res.locals.user_id;


  try {
      const { id } = req.params;

    //   // Fetch role details using role_id
    // const role = await roleService.getRoleByIdService(role_id);

    // if (!role) {
    //   return res.status(HttpStatus.NOTFOUND_404).json({ error: 'Role not found' });
    // }
    // // Check if the role's title is "Admin"
    // if (role.title !== 'Admin') {
    // return res.status(HttpStatus.FORBIDDEN_403).json({ error: 'You do not have permission to delete about' });
    // }

      // Find category by id
      const category = await categoryService.getCategoryByIdService(id);
      if (!category) {
          return res.status(HttpStatus.NOTFOUND_404).json({ error: 'Category not found' });
      }

      

      // Delete category
      await categoryService.deleteCategoryByIdService(id);

      res.json({ message: 'Category deleted successfully' });
  } catch (error) {
      console.error('Error deleting category:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR_500).json({ error: 'Internal server error' });
  }
};



export const deleteAllCategories = async (req, res) => {
    const user_id = res.locals.user_id;


  try {
     

    //  // Fetch role details using role_id
    //  const role = await roleService.getRoleByIdService(role_id);

    //  if (!role) {
    //    return res.status(HttpStatus.NOTFOUND_404).json({ error: 'Role not found' });
    //  }
    //  // Check if the role's title is "Admin"
    //  if (role.title !== 'Admin') {
    //  return res.status(HttpStatus.FORBIDDEN_403).json({ error: 'You do not have permission to delete all abouts' });
    //  }
      // Find all categories and delete them
      const categories = await categoryService.getAllCategoriesService();
      
      for (const category of categories) {
       
          await categoryService.deleteCategoryByIdService(category.id);
      }

      res.json({ message: 'All categories deleted successfully' });
  } catch (error) {
      console.error('Error deleting all categories:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR_500).json({ error: 'Internal server error' });
  }
};
  
