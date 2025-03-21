/**
 * @fileoverview Conexión a la base de datos MongoDB
 * @name database.js
 */
module.exports = (() => {
  'use strict';

  const { MONGO_URI: mongoURI } = require('./env');
  const mongoose = require("mongoose");

  const connectDB = async () => {
    try {
      await mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log("✅ Conectado a MongoDB");
    } catch (err) {
      console.error('❌ Error de conexión a MongoDB', err);
    };
  };

  return {
    connectDB
  };
})();