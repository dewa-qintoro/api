import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import {
  isAdmin,
  isAuth,
} from '../utils.js';
import request from 'request'

const orderRouter = express.Router();

orderRouter.put(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    const orderId = req.params.id;
    const order = await Order.findById(orderId);
    if (order) {
      order.confirmImg = req.body.confirmImg;
      const updatedOrder = await order.save();
      res.send({ message: 'Order Updated', order: updatedOrder });
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);

orderRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find().populate(
      'user',
      'name'
    );
    res.send(orders);
  })
);
orderRouter.get(
  '/mine',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.send(orders);
  })
);

orderRouter.get('/city',
  expressAsyncHandler(async (req, res) => {
    var options = {
      method: 'GET',
      url: 'https://api.rajaongkir.com/starter/city',
      // qs: {id: '12'},
      headers: {key: 'fae48b5d186bfaa993f687ec1ac499b1'}
    };
    
    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      res.send(JSON.parse(body))
    });
  })
)

orderRouter.get('/city/:id',
  expressAsyncHandler(async (req, res) => {
    var options = {
      method: 'GET',
      url: 'https://api.rajaongkir.com/starter/city',
      qs: {province: req.params.id},
      headers: {key: 'fae48b5d186bfaa993f687ec1ac499b1'}
    };
    
    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      res.send(JSON.parse(body))
    });
  })
)

orderRouter.get('/province',
  expressAsyncHandler(async (req, res) => {
    var options = {
      method: 'GET',
      url: 'https://api.rajaongkir.com/starter/province',
      headers: {key: 'fae48b5d186bfaa993f687ec1ac499b1'}
    };
    
    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      res.send(JSON.parse(body))
    });
  })
)

orderRouter.get('/ongkir/:id/:weight',
  expressAsyncHandler(async (req, res) => {
    // console.log('req', req)
    var options = {
      method: 'POST',
      url: 'https://api.rajaongkir.com/starter/cost',
      headers: {key: 'fae48b5d186bfaa993f687ec1ac499b1', 'content-type': 'application/x-www-form-urlencoded'},
      form: {origin: '419', destination: req.params.id, weight: req.params.weight, courier: 'pos'}
      // form: {origin: '419', destination: req.params.id, weight: req.params.weight, courier: ['jne', 'pos']}
    };
    
    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      // console.log(JSON.parse(body))
      res.send(JSON.parse(body))
    });
  })
)

orderRouter.get('/ongkir/:origin/:destination/:weight',
  expressAsyncHandler(async (req, res) => {
    console.log('req', req.params)
    var options = {
      method: 'POST',
      url: 'https://api.rajaongkir.com/starter/cost',
      headers: {key: 'fae48b5d186bfaa993f687ec1ac499b1', 'content-type': 'application/x-www-form-urlencoded'},
      form: {origin: req.params.origin, destination: req.params.destination, weight: req.params.weight, courier: 'jne'}
    };
    
    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      res.send(JSON.parse(body))
    });
  })
)

orderRouter.get('/ongkir/pos/:origin/:destination/:weight',
  expressAsyncHandler(async (req, res) => {
    console.log('req', req.params)
    var options = {
      method: 'POST',
      url: 'https://api.rajaongkir.com/starter/cost',
      headers: {key: 'fae48b5d186bfaa993f687ec1ac499b1', 'content-type': 'application/x-www-form-urlencoded'},
      form: {origin: req.params.origin, destination: req.params.destination, weight: req.params.weight, courier: 'pos'}
    };
    
    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      res.send(JSON.parse(body))
    });
  })
)

orderRouter.get('/ongkir/tiki/:origin/:destination/:weight',
  expressAsyncHandler(async (req, res) => {
    console.log('req', req.params)
    var options = {
      method: 'POST',
      url: 'https://api.rajaongkir.com/starter/cost',
      headers: {key: 'fae48b5d186bfaa993f687ec1ac499b1', 'content-type': 'application/x-www-form-urlencoded'},
      form: {origin: req.params.origin, destination: req.params.destination, weight: req.params.weight, courier: 'tiki'}
    };
    
    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      res.send(JSON.parse(body))
    });
  })
)

orderRouter.get('/ongkir/jne/:origin/:destination/:weight',
  expressAsyncHandler(async (req, res) => {
    console.log('req', req.params)
    var options = {
      method: 'POST',
      url: 'https://api.rajaongkir.com/starter/cost',
      headers: {key: 'fae48b5d186bfaa993f687ec1ac499b1', 'content-type': 'application/x-www-form-urlencoded'},
      form: {origin: req.params.origin, destination: req.params.destination, weight: req.params.weight, courier: 'jne'}
    };
    
    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      res.send(JSON.parse(body))
    });
  })
)

orderRouter.post(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    if (req.body.orderItems.length === 0) {
      res.status(400).send({ message: 'Cart is empty' });
    } else {
      const order = new Order({
        orderItems: req.body.orderItems,
        shippingAddress: req.body.shippingAddress,
        paymentMethod: req.body.paymentMethod,
        itemsPrice: req.body.itemsPrice,
        shippingPrice: req.body.shippingPrice,
        totalPrice: req.body.totalPrice,
        totalWeight: req.body.totalWeight,
        user: req.user._id,
        courier: req.body.courier,
      });
      const createdOrder = await order.save();
      res
        .status(201)
        .send({ message: 'New Order Created', order: createdOrder });
    }
  })
);

orderRouter.get(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      res.send(order);
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);

orderRouter.put(
  '/:id/pay',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'email name'
    );
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };
      const updatedOrder = await order.save();
      res.send({ message: 'Order Paid', order: updatedOrder });
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);

orderRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      const deleteOrder = await order.remove();
      res.send({ message: 'Order Deleted', order: deleteOrder });
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);

orderRouter.put(
  '/:id/deliver',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();

      const updatedOrder = await order.save();
      res.send({ message: 'Order Delivered', order: updatedOrder });
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);

export default orderRouter;
