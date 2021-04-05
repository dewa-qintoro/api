import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import { isAuth, isAdmin } from '../utils.js';
import Confirm from '../models/confirmModel.js';
import data from '../data.js';

const confirmRouter = express.Router()

confirmRouter.get('/seed',
  expressAsyncHandler(async (req, res) => {
    //remove previous data
    // await User.remove({})
    const createdConfirm = await Confirm.insertMany(data.confirm)
    res.send({createdConfirm})
  })
)

confirmRouter.post(
  '/',
  expressAsyncHandler(async (req, res) => {
    const confirm = new Confirm({
      name: req.body.name,
      email: req.body.email,
      image: req.body.image,
      orderId: req.body.orderId,
      transfer: req.body.transfer,
      rekening: req.body.rekening,
    });
    const createdConfirm = await confirm.save();
    res.send({
      _id: createdConfirm._id,
      name: createdConfirm.name,
      email: createdConfirm.email,
      image: createdConfirm.image,
      orderId: createdConfirm.orderId,
      transfer: createdConfirm.transfer,
      rekening: createdConfirm.rekening,
    });
  })
);

confirmRouter.get(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    const confirm = await Confirm.findById(req.params.id);
    if (confirm) {
      res.send(confirm);
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);

confirmRouter.get(
  '/',
  expressAsyncHandler(async (req, res) => {
    const confirm = await Confirm.find({});
    res.send(confirm);
  })
);
export default confirmRouter