import DeliveryAssignment from "../models/deliveryAssignment.model.js";
import { Order } from "../models/order.model.js";
import Shop from "../models/shop.model.js";
import User from "../models/user.model.js";


export const placeOrder = async (req, res) => {
  try {
    const { cartItems, paymentMethod, deliveryAddress, totalAmount } = req.body;
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }
    if (
      !deliveryAddress?.text ||
      deliveryAddress.latitude === undefined ||
      deliveryAddress.longitude === undefined
    ) {
      return res
        .status(400)
        .json({ message: "Delivery address is incomplete" });
    }

    const groupItemsByShop = {};

    cartItems.forEach((item) => {
      const shopId = item.shop;

      if (!groupItemsByShop[shopId]) {
        groupItemsByShop[shopId] = [];
      }
      groupItemsByShop[shopId].push(item);
    });
    const shopOrders = await Promise.all(
      Object.keys(groupItemsByShop).map(async (shopId) => {
        const shop = await Shop.findById(shopId).populate("owner");
        if (!shop) {
          throw new Error(`Shop with id ${shopId} not found`);
        }
        const items = groupItemsByShop[shopId];
        const subTotal = items.reduce(
          (sum, i) => sum + Number(i.price) * Number(i.quantity),
          0,
        );
        return {
          shop: shop._id,
          owner: shop.owner._id,
          subTotal,
          shopOrderItem: items.map((i) => ({
            item: i.id,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
          })),
        };
      }),
    );

    const newOrder = await Order.create({
      user: req.userId,
      paymentMethod,
      deliveryAddress,
      totalAmount,
      shopOrders,
    });
    await newOrder.populate("shopOrders.shopOrderItem.item","name image price");
    await newOrder.populate("shopOrders.shop", "name")
    return res.status(201).json(newOrder);
  } catch (error) {
    return res.status(500).json({ message: `place order error ${error}` });
  }
};


export const getMyOrders = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role == "user") {
      const orders =await Order.find({ user: req.userId })
        .sort({ createdAt: -1 })
        .populate("shopOrders.shop", "name")
        .populate("shopOrders.owner", "name email mobile")
        .populate("shopOrders.shopOrderItem.item", "name image price");
      return res.status(200).json(orders);
    } else if (user.role == "owner") {
      const orders = await Order.find({ "shopOrders.owner": req.userId })
        .sort({ createdAt: -1 })
        .populate("shopOrders.shop", "name")
        .populate("user")
        .populate("shopOrders.shopOrderItem.item", "name image price");
         
        const filteredOrder = orders.map((order)=>({
          _id: order._id,
          paymentMethod: order.paymentMethod,
          user:order.user,
          shopOrders:order.shopOrders.find(o=>o.owner._id==req.userId),
          createdAt: order.createdAt,
          deliveryAddress: order.deliveryAddress
        }))
      return res.status(200).json(filteredOrder);
    }
  } catch (error) {
    return res.status(500).json({message:"My orders error"});
  }
};


export const updateOrderStatus=async(req,res)=>{
  try {
    const {orderId, shopId}= req.params
    const {status} = req.body 
    const order= await Order.findById(orderId);
    const shopOrder=  order.shopOrders.find(o=>o.shop== shopId)
    if(!shopOrder){
      return res.status(400).json({message: "Shop order not found"})

    }

    shopOrder.status= status 
    let deliveryBoysPayLoad=[]
    if(status=="out of delivery" && !shopOrder.assignment){
      const {latitude, longitude}= order.deliveryAddress
      const nearByDeliveryBoys= await User.find({
        role: "deliveryBoy", 
        location:{
          $near:{
            $geometry:{type:"Point",coordinates:[Number(longitude), Number(latitude)]},
            $maxDistance: 5000
          }
        }
      })
      const nearByIds= nearByDeliveryBoys.map(b=>b._id)
      const busyIds= await DeliveryAssignment.find({
        assignedTO:{$in:nearByIds},
        status:{$nin:["broadcasted","completed"]}
      }).distinct("assignedTo")


      const busyIdSet= new Set(busyIds.map(id=>String(id)))
      const availableBoys= nearByDeliveryBoys.filter(b=>!busyIdSet.has(String(b._id)))
      const candidates= availableBoys.map(b=>b._id)
      if(candidates.length==0){
        await order.save();
        return res.json({
          message:"Order status updated but there is no delivery boys available"
        })
      }

      const deliveryAssignment=await DeliveryAssignment.create({
        order: order._id,
        shop:shopOrder.shop,
        shopOrderId:shopOrder._id,
        broadCastedTo:candidates,
        status: "broadcasted"
      })
      
      shopOrder.assignedDeliveryBoy= deliveryAssignment.assignedTO
      shopOrder.assignment=deliveryAssignment._id
      deliveryBoysPayLoad= availableBoys.map(b=>({
        id:b._id,
        fullName:b.fullName,
        longitude:b.location.coordinates?.[0],
        longitude:b.location.coordinates?.[1],
        mobile: b.mobile
      }))
      

  }
      const updatedShopOrder = order.shopOrders.find(o=>o.shop==shopId)


    await order.save()
    await order.populate("shopOrders.shop", "name" )
    await order.populate("shopOrders.assignedDeliveryBoy", "fullName email mobile")
    
    return res.status(200).json({
      shopOrder:updatedShopOrder,
      assignedDeliveryBoy: updatedShopOrder?.assignedDeliveryBoy,
      availableBoys:deliveryBoysPayLoad,
      assignment:updatedShopOrder?.assignment._id

    })
  } catch (error) {
     return res.status(500).json({message:"update orders status error"});
  }
}



export const getDeliveryBoyAssignment=async(req,res)=>{
  try {
    const deliveryBoyId= req.userId;

    const assignment= await DeliveryAssignment.find({
      broadCastedTo:deliveryBoyId,
      status: "broadcasted"
    })
    .populate("order")
    .populate("shop")

    const formatted= assignment.map(a=>({
      assignmentId: a._id,
      orderId:a.order._id,
      shopName: a.shop.name,
      deliveryAddress: a.order.deliveryAddress,
      items: a.order.shopOrders.find(so=>so._id.equals(a.shopOrderId)).shopOrderItem || [],
      subTotal: a.order.shopOrders.find(so=>so._id.equals(a.shopOrderId))?.subTotal
    }))
    return res.status(200).json(formatted)
  } catch (error) {
     return res.status(500).json({message:"get delivery delivery orders  error"});
  }
}

