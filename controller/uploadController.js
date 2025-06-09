// controller/uploadController.js
import { HttpStatus } from "../config/httpStatusCodes.js";
import { ImageCollection } from "../models/model.js";
import cloudinary from "../utils/cloudinary.js";

export const uploadImages = async (req, res, next) => {
  try {
    const { title } = req.body;

    const fileDataPromises = req.files.map(async (file, index) => {
      const uploadImage = await cloudinary.uploader.upload(file.path);
      return {
        title: title ? `${title}-${index}` : file.originalname,
        localurl: file.path,
        imageurl: uploadImage.secure_url,
      };
    });

    const fileData = await Promise.all(fileDataPromises);

    if (fileData) {
      const imageFiles = await ImageCollection.bulkCreate(fileData);
      res.status(HttpStatus.SUCCESS_200).json({ success: true, data: imageFiles });
    } else {
      res.status(HttpStatus.BAD_REQUEST_400).json({ success: false, data: "Some error occurred." });
    }
  } catch (err) {
    console.log("err:", err);
    res.status(HttpStatus.BAD_REQUEST_400).json({ message: "File upload failed", err });
  }
};

export const getAllImages = async (req, res, next) => {
  try {
    const imageFiles = await ImageCollection.findAll({});
    res.status(HttpStatus.SUCCESS_200).json({ success: true, data: imageFiles });
  } catch (err) {
    console.log("err:", err);
    res.status(HttpStatus.BAD_REQUEST_400).json({ message: "Fetching images failed", err });
  }
};

export const getImageById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const imageFile = await ImageCollection.findOne({ where: { id } });

    if (!imageFile) {
      return res.status(HttpStatus.NOTFOUND_404).json({ success: false, message: "Image not found" });
    }

    res.status(HttpStatus.SUCCESS_200).json({ success: true, data: imageFile });
  } catch (err) {
    console.log("err:", err);
    res.status(HttpStatus.BAD_REQUEST_400).json({ message: "Fetching image failed", err });
  }
};


