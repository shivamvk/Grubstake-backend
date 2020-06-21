const mongoose = require('mongoose');

exports.connect = () => {
   return mongoose.connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0-prsti.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  );
};
