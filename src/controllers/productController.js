const {
  createOne,
  getAllData,
  getOneData,
  editData,
} = require("../shared/dbQuery");
const { storeFile } = require("../shared/commonFunctions");
const { Op } = require("sequelize");

const productCollection = require("../models/Product");

module.exports = {
  createProduct: async (req, res) => {
    let imageFile;
    if (req.files) {
      imageFile = req.files.find((file) => file.fieldname === "image");
    }

    let { name, price } = req.body;

    if (!name || !price || !imageFile) {
      res.status(500).send("Missing required fields");
      return;
    }

    price = Number(price);

    // Check if product name is already exists
    const condition = { where: { name } };
    const productPresent = await getOneData(productCollection, condition);

    if (productPresent) {
      res.send("Product name is already taken");
      return;
    }

    const imageStorageMSG = await storeFile(imageFile);

    if (!imageStorageMSG || !imageStorageMSG.response) {
      res.send("Error while storing image");
      return;
    }

    const productDetails = {
      name,
      price,
      image_id: imageStorageMSG.uniqueFilename,
    };
    const createdProduct = await createOne(productCollection, productDetails);

    if (createdProduct) {
      res.send(createdProduct);
    } else {
      res.send("Error while adding product");
    }
  },

  editProduct: async (req, res) => {
    let imageFile;
    if (req.files) {
      imageFile = req.files.find((file) => file.fieldname === "image");
    }

    let { name, price } = req.body;

    let id;
    if (req.params && req.params.id) {
      id = req.params.id;
    }

    if (!id) {
      res.status(500).send("Missing required fields");
      return;
    }

    const condition = {
      where: {
        id,
      },
      returning:true
    };

    const updatedData = {};

    // Check if product name is already exists
    if (name) {
      const condition = {
        where: {
          name,
          id: {
            [Op.not]: id, // Replace with the value you want to exclude
          },
        },
      };

      const productPresent = await getOneData(productCollection, condition);

      if (productPresent) {
        res.send("Product name is already taken");
        return;
      }

      updatedData["name"] = name;
    }

    let imageStorageMSG;
    if (imageFile) {
      imageStorageMSG = await storeFile(imageFile);

      if (!imageStorageMSG || !imageStorageMSG.response) {
        res.send("Error while storing image");
        return;
      }

      updatedData["image_id"] = imageStorageMSG.uniqueFilename;
    }

    if (price) {
      updatedData["price"] = price;
    }

    const updatedProduct = await editData(
      productCollection,
      updatedData,
      condition
    );

    if (updatedProduct) {
      res.send('Product updated successfully');
    }else {
      res.send("Error while updating product");
    }
  },

  getAllProducts: async (req, res) => {
    let { page, limit, sortOrder, sortValue, name, startDate, endDate } = req.body;

    if (!page) {
      page = 1;
    }

    if (!limit) {
      limit = 10;
    }

    if (!sortValue) {
      sortValue = "createdAt";
    }

    if (!sortOrder) {
      sortOrder = "DESC";
    }

    const filter = {};

    if (name) {
      filter["name"] = {
        [Op.like]: `%${name}%`,
      }
    }

    if(startDate && endDate){
      filter["createdAt"] = {
        [Op.between]: [startDate, endDate],
      }
    }

    let paginationSort = {
      page: page,
      limit: limit,
      sortValue: sortValue,
      sortOrder: sortOrder,
    };

    const allUsers = await getAllData(
      productCollection,
      filter,
      paginationSort
    );

    res.send(allUsers);
  },
};
