const express = require('express');
const hazel = require('./api/index.js');

const app = express();
app.use('/', hazel);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Hazel server running on port ${PORT}`);
});