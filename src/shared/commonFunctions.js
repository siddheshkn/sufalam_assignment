const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

module.exports = {
  storeFile: async (imageFile) => {
    try {
      const originalName = imageFile.originalname;
      const fileExtension = originalName.split(".").pop(); // Get the file extension

      // Generate a unique identifier using UUID
      const uniqueId = uuidv4();

      // Create a unique filename with the original extension
      const uniqueFilename = `${uniqueId}.${fileExtension}`;

      // Specify the path where the file will be saved (in this case, in the 'storage' folder)
      const filePath = `src/storage/${uniqueFilename}`;

      // Use the fs module to write the file to the specified path
      const response = await new Promise((resolve, reject) => {
        fs.writeFile(filePath, imageFile.buffer, (err) => {
          if (err) {
            console.error("Error saving file:", err);
            resolve(false);
            return;
          }

          console.log("File saved successfully:", uniqueFilename);
          resolve(true);
        });
      });

      return {response,uniqueFilename };
    } catch (err) {
      console.log("Error while storing image", err);
      return false;
    }
  },
};
