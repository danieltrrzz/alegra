require('dotenv').config();
const path = require('path');
const gateway = require('express-gateway');

// Iniciar el gateway
gateway()
  .load(path.join(__dirname, 'config'))
  .run();