const express = require('express')
const controller = require('./db/controllers')
require('dotenv').config();

const app = express();
app.use(express.static('public'));
app.use(express.json());
app.get('/', (req, res) => {
  console.log('hello world')
  res.send('Hello World')
})

app.get('/products', controller.getProducts)
app.get('/products/:product_id', controller.getOneProduct)
app.get('/products/:product_id/styles', controller.getProductStyle)
app.get('/products/:product_id/related', controller.getRelated)


// reviews/meta?product_id=${productId}`;


const PORT = process.env.PORT || 3000
console.log(PORT)

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`)
})