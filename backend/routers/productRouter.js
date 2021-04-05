import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';
import { isAdmin, isAuth } from '../utils.js';

const productRouter = express.Router();

productRouter.get(
  '/recomendation',
  expressAsyncHandler(async (req, res) => {
    const recomendation = await Product.find({ isRecomendation: true })
      .limit(3);
    res.send(recomendation);
  })
);

productRouter.get(
  '/packet',
  expressAsyncHandler(async (req, res) => {
    const packet = await Product.find({ isPacket: true })
      .limit(3);
    res.send(packet);
  })
);

productRouter.get(
  '/',
  expressAsyncHandler(async (req, res) => {
    const pageSize = 6;
    const page = Number(req.query.pageNumber) || 1;
    const name = req.query.name || '';
    const category = req.query.category || '';
    const order = req.query.order || '';
    const min =
      req.query.min && Number(req.query.min) !== 0 ? Number(req.query.min) : 0;
    const max =
      req.query.max && Number(req.query.max) !== 0 ? Number(req.query.max) : 0;

    const nameFilter = name ? { name: { $regex: name, $options: 'i' } } : {};
    const categoryFilter = category ? { category } : {};
    const priceFilter = min && max ? { price: { $gte: min, $lte: max } } : {};
    const sortOrder =
      order === 'lowest'
        ? { price: 1 }
        : order === 'highest'
        ? { price: -1 }
        : order === 'toprated';
    const count = await Product.count({
      ...nameFilter,
      ...categoryFilter,
      ...priceFilter,
    });
    const products = await Product.find({
      ...nameFilter,
      ...categoryFilter,
      ...priceFilter,
    })
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    res.send({ products, page, pages: Math.ceil(count / pageSize) });
  })
);

productRouter.get(
  '/categories',
  expressAsyncHandler(async (req, res) => {
    const categories = await Product.find().distinct('category');
    res.send(categories);
  })
);

productRouter.get(
  '/all',
  expressAsyncHandler(async (req, res) => {
    const allProduct = await Product.find();
    res.send(allProduct);
  })
);

productRouter.get(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);

productRouter.post(
  '/create-product',
  expressAsyncHandler(async (req, res) => {
    const product = new Product({
      name: req.body.newData.name,
      image: req.body.newData.image,
      price: req.body.newData.price,
      category: req.body.newData.category,
      author: req.body.newData.author,
      countInStock: req.body.newData.countInStock,
      weight: req.body.newData.weight,
      numberOfPage: req.body.newData.numberOfPage,
      publisher: req.body.newData.publisher,
      numReviews: 0,
      description: req.body.newData.description,
      isRecomendation: req.body.newData.isRecomendation,
      isPacket: req.body.newData.isPacket,
    });
    const createdProduct = await product.save();
    res.send({ message: 'Product Created', product: createdProduct });
  })
);

productRouter.post(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const product = new Product({
      name: 'sample name ' + Date.now(),
      image: '/images/p1.jpg',
      price: 0,
      category: 'sample category',
      author: 'sample author',
      countInStock: 0,
      weight: 0,
      numberOfPage: 0,
      publisher: '',
      numReviews: 0,
      description: 'sample description',
    });
    const createdProduct = await product.save();
    res.send({ message: 'Product Created', product: createdProduct });
  })
);
productRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
      product.name = req.body.name;
      product.price = req.body.price;
      product.image = req.body.image;
      product.category = req.body.category;
      product.author = req.body.author;
      product.countInStock = req.body.countInStock;
      product.weight = req.body.weight;
      product.numberOfPage = req.body.numberOfPage;
      product.publisher = req.body.publisher;
      product.description = req.body.description;
      product.isRecomendation = req.body.isRecomendation;
      product.isPacket = req.body.isPacket;
      const updatedProduct = await product.save();
      res.send({ message: 'Product Updated', product: updatedProduct });
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);

productRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      const deleteProduct = await product.remove();
      res.send({ message: 'Product Deleted', product: deleteProduct });
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);

export default productRouter;
