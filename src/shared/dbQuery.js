const { getDb } = require("../config/dbConnect");

module.exports = {
  createOne: async (collection, data) => {
    try {
      const response = await collection.create(data);
      return response.toJSON();
    } catch (error) {
      console.log("createOne db error: ", error);
      return false;
    }
  },

  getOneData: async (collection, condition) => {
    try {
      const response = await collection.findOne(condition);
      return response ? response.toJSON() : response;
    } catch (error) {
      console.log("getOneData db error: ", error);
      return false;
    }
  },

  editData: async (collection, updatedData, condition) => {
    try {
      const result = await collection.update(updatedData, condition);

      if (result && result.length && result[1] == 1) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("editData error:", error);
      return false;
    }
  },

  getAllData: async (collection, filter, paginationSort) => {
    const { page, limit, sortValue, sortOrder } = paginationSort;


    try {
      let query = {
        where: filter,
      };

      if (sortValue && sortOrder) {
        query["order"] = [[sortValue, sortOrder]];
      }

      if (page && limit) {
        query["offset"] = (page - 1) * limit;
        query["limit"] = limit;
      }

      const result = await collection.findAndCountAll(query);

      return result;
    } catch (error) {
      console.log("getAllData db error: ", error);
      return {};
    }
  },
};
