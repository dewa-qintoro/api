import express from 'express';
import multer from 'multer';
import multerS3 from 'multer-s3';
import aws from 'aws-sdk';
import dotenv from 'dotenv'
// import config from '../config';

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

awsRoute.post('/', upload.single('image'), (req, res) => {
  res.send(`/${req.file.path}`);
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