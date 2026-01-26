import mongoose from "mongoose";


const shopItemsSchema = new mongoose.Schema({
  item:{
    type:mongoose.Schema.Types.ObjectId,
    ref: "Item",
    required:true
  },
  name:String,
  price: Number,
  quantity:Number
}, {timestamps: true});


const shopOrderSchema= new mongoose.Schema({
  shop:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop"
  },
  owner: {
    type:mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  subTotal:Number,
  status:{
    type:String,
    enum: ["pending","preparing","pending","delivered"],
    default:"pending"
  },
  shopOrderItem:[shopItemsSchema]
})

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    paymentMethod: { type: String, enum: ["cod", "online"], required: true },
    deliveryAddress: {
      text: String,
      latitude: Number,
      longitude: Number,
    },
    totalAmount: { type: Number, required: true },
    shopOrders: [shopOrderSchema]
  },
  { timestamps: true },
);

export const Order= mongoose.model("Order", orderSchema);
