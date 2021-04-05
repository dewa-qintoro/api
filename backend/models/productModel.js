import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    weight: { type: Number, required: true },
    numberOfPage: { type: Number, required: false },
    publisher: { type: String, required: false },
    countInStock: { type: Number, required: true },
    isRecomendation: { type: Boolean, default: false, required: true },
    isPacket: { type: Boolean, default: false, required: true },
  },
  {
    timestamps: true,
  }
);
const Product = mongoose.model('Product', productSchema);

export default Product;
