const { DataTypes } = require("sequelize");
const db = require("../config/dbConnect");


const Product = db.define(
  "product_details",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique:true
    },
    image_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // Add more fields as needed
  },
  { timestamps: true }
);

module.exports = Product;
