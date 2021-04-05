import mongoose from 'mongoose';

const confirmSchema = new mongoose.Schema(
  {
    name: { type: String, required: false },
    email: { type: String, required: false },
    image: { type: String, required: false },
    orderId: { type: String, required: false },
    transfer: { type: Number, required: false },
    rekening: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);
const Confirm = mongoose.model('Confirm', confirmSchema);
export default Confirm;
