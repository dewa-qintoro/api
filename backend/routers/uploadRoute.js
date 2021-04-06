import express from 'express';
import multer from 'multer';
import multerS3 from 'multer-s3';
import aws from 'aws-sdk';
import dotenv from 'dotenv'
// import config from '../config';
// var cloudinary = require('cloudinary').v2;
import cloudinary from 'cloudinary'
const app = express()

var uploads = {};

dotenv.config()
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}.jpg`);
  },
});

const upload = multer({ storage });

const awsRoute = express.Router();

cloudinary.config({
  cloud_name:'dewaqintoro',
  api_key:'442818793864368',
  api_secret:'MV75UbGl6gnlLkEyGqbgEpBEuVk'
});

awsRoute.post('/cloudinary', async (req, res) => {
  try {
      const fileStr = req.body.data;
      const uploadResponse = await cloudinary.uploader.upload(fileStr, {
          upload_preset: 'travada',
      });
      // console.log(uploadResponse);
      res.json({ data : uploadResponse.url });
  } catch (err) {
      console.error(err);
      res.status(500).json({ err: 'Something went wrong' });
  }
});

aws.config.update({
  accessKeyId: process.env.ACCESS_KEY || '',
  secretAccessKey: process.env.SECRET_ACCESS || '',
});
const s3 = new aws.S3();
const storageS3 = multerS3({
  s3,
  bucket: 'aruspinggir-bucket',
  acl: 'public-read',
  contentType: multerS3.AUTO_CONTENT_TYPE,
  key(req, file, cb) {
    cb(null, file.originalname);
  },
});
const uploadS3 = multer({ storage: storageS3 });
awsRoute.post('/s3', uploadS3.single('image'), (req, res) => {
  res.send(req.file.location);
});

export default awsRoute;