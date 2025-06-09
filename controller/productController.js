import { HttpStatus } from "../config/httpStatusCodes.js";
import { productService } from "../services/index.js";
import cloudinary from "../utils/cloudinary.js";
import slugify from 'slugify';
import path from "path";


export const createProduct = async (req, res, next) => {
  const user_id = res.locals.user_id

  try {
    const { name, description, highlights, category_title, videolink, price, active } = req.body;

    if (!name || !description || !category_title) {
      return res.status(HttpStatus.BAD_REQUEST_400).json({ error: 'Please provide all the required information' });
    }

    
    // Validate uploaded files
    if (!req.files || Object.keys(req.files).length === 0) {
      return res
        .status(HttpStatus.BAD_REQUEST_400)
        .json({ error: "Please upload at least one valid image file." });
    }


    // Object to store single photo URLs
    let photo1= null,
      photo2= null,
      photo3= null,
      photo4= null,
      photo5= null;
    
    // Process each uploaded file, upload to Cloudinary, and categorize URLs
    for (const fieldName in req.files) {
      const files = req.files[fieldName];

      if (files.length > 0) {
        try {
          const uploadResult = await cloudinary.uploader.upload(files[0].path);
          const url = uploadResult.secure_url;

          switch (fieldName) {
            case 'photo_1': photo1 = url; break;
            case 'photo_2': photo2 = url; break;
            case 'photo_3': photo3 = url; break;
            case 'photo_4': photo4 = url; break;
            case 'photo_5': photo5 = url; break;

          }

        } catch (uploadError) {
          console.error(`Error uploading ${files[0].originalname}:`, uploadError);
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR_500).json({ error: "Error uploading file(s)" });
        }
      }

    }

    // Generate a unique slug based on product name
     let slug = slugify(name, { lower: true, strict: true });
    
     // Ensure the slug is unique
     let existingSlug = await productService.getProductByIdOrSlug(slug);
     if (existingSlug) {
       slug += `-${Date.now()}`; // Append timestamp if slug exists
     }

       
    const Product = await productService.createProductService({ name, slug, description, highlights, photo_1: photo1, photo_2: photo2, photo_3: photo3, photo_4: photo4, photo_5: photo5, videolink, category_title, price, active, user_id: user_id });
    console.log("Generated Restaurant Slug:", Product.slug);
    res.json({ message: 'Product created successfully', Product });
  } catch (error) {
    console.error('Error creating Product:', error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR_500).json({ error: 'Internal server error' });
  }
};


export const viewAllProducts = async (req, res, next) => {
    // const role_id =  res.locals.role_id

  try {
      
      // Fetch and return all Products
      const Products = await productService.getAllProductsService();
      res.json({ Products });
  } catch (error) {
      console.error('Error viewing Products:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR_500).json({ error: 'Internal server error' });
  }
};


export const viewProduct = async (req, res, next) => {
    // const role_id =  res.locals.role_id

  try {
      const { id } = req.params;

      
   
      // Find Product by id
      const Product = await productService.getProductByIdService(id);
      if (!Product) {
          return res.status(HttpStatus.NOTFOUND_404).json({ error: 'Product not found' });
      }

      res.json({ Product });
  } catch (error) {
      console.error('Error viewing Product:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR_500).json({ error: 'Internal server error' });
  }
};



export const getProductDetails = async (req, res) => {
  try {
    const productParam = req.params.product_id || req.params.product_slug;

    if (!productParam) {
      return res.status(400).json({ error: "Product identifier is required" });
    }

    const product = await productService.getProductByIdOrSlug(productParam);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};





export const viewProductByCategory = async (req, res, next) => {
  // const role_id = res.locals.role_id

  try {
      const { category_title } = req.params;
      
      // Fetch and return all Product for a specific category
      const product = await productService.getAllProductForCategoryService(category_title);
      if (!product || product.length === 0) {
          return res.status(HttpStatus.NOTFOUND_404).json({ error: 'No Productfound for this category' });
      }

      res.json({ product });
  } catch (error) {
      console.error('Error viewing Product for category:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR_500).json({ error: 'Internal server error' });
  }
};



export const updateProduct = async (req, res, next) => {
  const user_id = res.locals.user_id;

  try {
    const { id } = req.params;
    const { name, description, highlights, category_title, price, videolink, active } = req.body;

    
    // Find Product by id
    const Product = await productService.getProductByIdService(id);
    if (!Product) {
      return res.status(HttpStatus.NOTFOUND_404).json({ error: 'Product not found' });
    }

    // Preserve existing fields unless they are being updated
    let photo1 = Product.photo_1,
     photo2 = Product.photo_2,
   photo3 = Product.photo_3,
     photo4 = Product.photo_4,
     photo5 = Product.photo_5;

    // Process uploaded files
    if (req.files) {
      for (const fieldName in req.files) {
        const files = req.files[fieldName];

        if (files.length > 0) {
          try {
            const uploadResult = await cloudinary.uploader.upload(files[0].path);
            const url = uploadResult.secure_url;

            switch (fieldName) {
              case 'photo_1': photo1 = url; break;
              case 'photo_2': photo2 = url; break;
              case 'photo_3': photo3 = url; break;
              case 'photo_4': photo4 = url; break;
              case 'photo_5': photo5 = url; break;
            }
          }
         catch (uploadError) {
            console.error(`Error uploading ${files[0].originalname}:`, uploadError);
            return res
              .status(HttpStatus.INTERNAL_SERVER_ERROR_500)
              .json({ error: 'Error uploading file(s)' });
          }
        }
      }
    }


    // const dataToUpdate = { name, description, photo: newPhotoUrls, videolink, category_title, price, active, user_id: user_id };
    const dataToUpdate = {
      name: name || Product.name, // Use new name if provided, otherwise retain existing
      description: description || Product.description,
      highlights: highlights || Product.highlights,
      // photo: newPhotoUrls.length > 0 ? newPhotoUrls : Product.photo, // Only update photos if new ones are provided
      
      photo_1: photo1,
      photo_2: photo2,
      photo_3: photo3,
      photo_4: photo4,
      photo_5: photo5,

      
      
      videolink: videolink || Product.videolink,
      category_title: category_title || Product.category_title,
      price: price || Product.price,
      active: active !== undefined ? active : Product.active, // Explicit check for undefined for boolean fields
      user_id: user_id, // User ID is always updated
    };

    let response = await productService.updateProductService(id, dataToUpdate);

    // Check response and send appropriate message
    if (response[0] > 0) {
      res.status(HttpStatus.SUCCESS_200).json({ message: 'Product updated successfully' });
    } else {
      res.status(HttpStatus.BAD_REQUEST_400).json({ message: 'Update failed. No changes made.' });
    }
  } catch (error) {
    console.error('Error updating Product:', error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR_500).json({ error: 'Internal server error' });
  }
};

// Helper function to extract the public ID from Cloudinary URL
function getPublicIdFromUrl(url) {
  const regex = /\/v(\d+)\/(.*)\.(jpg|jpeg|png|gif)$/;
  const match = url.match(regex);
  return match ? match[2] : null; // Extracts the public ID
}


export const deleteProduct = async (req, res, next) => {
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
    // return res.status(HttpStatus.FORBIDDEN_403).json({ error: 'You do not have permission to delete Product' });
    // }

      // Find Product by id
      const Product = await productService.getProductByIdService(id);
      if (!Product) {
          return res.status(HttpStatus.NOTFOUND_404).json({ error: 'Product not found' });
      }

      

      // Delete Product
      await productService.deleteProductByIdService(id);

      res.json({ message: 'Product deleted successfully' });
  } catch (error) {
      console.error('Error deleting Product:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR_500).json({ error: 'Internal server error' });
  }
};



export const deleteAllProducts = async (req, res) => {
    const user_id = res.locals.user_id;


  try {
     

    //  // Fetch role details using role_id
    //  const role = await roleService.getRoleByIdService(role_id);

    //  if (!role) {
    //    return res.status(HttpStatus.NOTFOUND_404).json({ error: 'Role not found' });
    //  }
    //  // Check if the role's title is "Admin"
    //  if (role.title !== 'Admin') {
    //  return res.status(HttpStatus.FORBIDDEN_403).json({ error: 'You do not have permission to delete all Products' });
    //  }
      // Find all Products and delete them
      const Products = await productService.getAllProductsService();
      
      for (const Product of Products) {
       
          await productService.deleteProductByIdService(Product.id);
      }

      res.json({ message: 'All Products deleted successfully' });
  } catch (error) {
      console.error('Error deleting all Products:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR_500).json({ error: 'Internal server error' });
  }
};
  
