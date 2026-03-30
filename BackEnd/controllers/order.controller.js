import DeliveryAssignment from "../models/deliveryAssignment.model.js";
import { Order } from "../models/order.model.js";
import Shop from "../models/shop.model.js";
import User from "../models/user.model.js";
import { sendDeliveryOtpMail } from "../utils/mail.js";
import Razorpay from "razorpay";
import dotenv from "dotenv";

dotenv.config();

let instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
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

    if (paymentMethod == "online") {
      const razorOrder = await instance.orders.create({
        amount: Math.round(totalAmount * 100),
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      });

      const newOrder = await Order.create({
        user: req.userId,
        paymentMethod,
        deliveryAddress,
        totalAmount,
        shopOrders,
        razorpayOrderId: razorOrder.id,
        payment: false,
      });
      return res.status(200).json({
        razorOrder,
        orderId: newOrder._id,
      });
    }

    const newOrder = await Order.create({
      user: req.userId,
      paymentMethod,
      deliveryAddress,
      totalAmount,
      shopOrders,
    });
    await newOrder.populate(
      "shopOrders.shopOrderItem.item",
      "name image price",
    );
    await newOrder.populate(
      "shopOrders.shopOrderItem.item",
      "name image price",
    );
    await newOrder.populate("shopOrders.shop", "name");
    // populate owner so we can access owner's socketId saved on User model
    await newOrder.populate("shopOrders.owner", "socketId");
    await newOrder.populate("user", "name email mobile");
    const io = req.app.get("io");

    if (io) {
      newOrder.shopOrders.forEach((shopOrder) => {
        const ownerSocketId = shopOrder?.owner?.socketId;
        console.log("new order", newOrder)
        console.log("📤 Emitting newOrder to owner:", ownerSocketId);
        if (ownerSocketId) {
          io.to(ownerSocketId).emit("newOrder", {
            _id: newOrder._id,
            paymentMethod: newOrder.paymentMethod,
            user: newOrder.user,
            shopOrders: shopOrder,
            createdAt: newOrder.createdAt,
            deliveryAddress: newOrder.deliveryAddress,
            payment: newOrder.payment,
          });
        }
      });
    }

    return res.status(201).json(newOrder);
  } catch (error) {
    return res.status(500).json({ message: `place order error ${error}` });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_payment_id, orderId } = req.body;
    const payment = await instance.payments.fetch(razorpay_payment_id);
    if (!payment || payment.status != "captured") {
      return res.status(400).json({ message: "Payment not caputred" });
    }
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(400).json({ message: "order not found" });
    }
    order.payment = true;
    order.razorpayPaymentId = razorpay_payment_id;
    await order.save();

    await order.populate("shopOrders.shopOrderItem.item", "name image price");
    await order.populate("shopOrders.shop", "name");
    // populate owner so we can access owner's socketId saved on User model
    await order.populate("shopOrders.owner", "socketId");
    await order.populate("user", "name email mobile");
    const io = req.app.get("io");

    if (io) {
      order.shopOrders.forEach((shopOrder) => {
        const ownerSocketId = shopOrder.owner?.socketId;
        if (ownerSocketId) {
          io.to(ownerSocketId).emit("newOrder", {
            _id: order._id,
            paymentMethod: order.paymentMethod,
            user: order.user,
            shopOrders: shopOrder,
            createdAt: order.createdAt,
            deliveryAddress: order.deliveryAddress,
            payment: order.payment,
          });
        }
      });
    }

    return res.status(200).json(order);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `verify payment order error ${error}` });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role == "user") {
      const orders = await Order.find({ user: req.userId })
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
        .populate("shopOrders.shopOrderItem.item", "name image price")
        .populate("shopOrders.assignedDeliveryBoy", "fullName mobile");

      const filteredOrder = orders.map((order) => ({
        _id: order._id,
        paymentMethod: order.paymentMethod,
        user: order.user,
        shopOrders: order.shopOrders.find((o) => o.owner._id == req.userId),
        createdAt: order.createdAt,
        deliveryAddress: order.deliveryAddress,
        payment: order.payment,
      }));
      return res.status(200).json(filteredOrder);
    }
  } catch (error) {
    return res.status(500).json({ message: "My orders error" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, shopId } = req.params;
    const { status } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    const shopOrder = order.shopOrders.find((o) => o.shop == shopId);
    if (!shopOrder) {
      return res.status(400).json({ message: "Shop order not found" });
    }

    shopOrder.status = status;
    let deliveryBoysPayLoad = [];
    if (status == "out of delivery" && !shopOrder.assignment) {
      const { latitude, longitude } = order.deliveryAddress;
      const nearByDeliveryBoys = await User.find({
        role: "deliveryBoy",
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [Number(longitude), Number(latitude)],
            },
            $maxDistance: 5000,
          },
        },
      });
      const nearByIds = nearByDeliveryBoys.map((b) => b._id);
      const busyIds = await DeliveryAssignment.find({
        assignedTO: { $in: nearByIds },
        status: { $nin: ["broadcasted", "completed"] },
      }).distinct("assignedTO");

      const busyIdSet = new Set(busyIds.map((id) => String(id)));
      const availableBoys = nearByDeliveryBoys.filter(
        (b) => !busyIdSet.has(String(b._id)),
      );
      const candidates = availableBoys.map((b) => b._id);
      if (candidates.length == 0) {
        await order.save();
        return res.json({
          message:
            "Order status updated but there is no delivery boys available",
        });
      }

      const deliveryAssignment = await DeliveryAssignment.create({
        order: order._id,
        shop: shopOrder.shop,
        shopOrderId: shopOrder._id,
        broadCastedTo: candidates,
        status: "broadcasted",
      });

      shopOrder.assignedDeliveryBoy = deliveryAssignment.assignedTO;
      shopOrder.assignment = deliveryAssignment._id;
      deliveryBoysPayLoad = availableBoys.map((b) => ({
        id: b._id,
        fullName: b.fullName,
        longitude: b.location.coordinates?.[0],
        latitude: b.location.coordinates?.[1],
        mobile: b.mobile,
      }));

      await deliveryAssignment.populate("order");
      await deliveryAssignment.populate("shop");

      const io = req.app.get("io");
      if (io) {
        availableBoys.forEach((boy) => {
          const boySocketId = boy.socketId;
          console.log("📤 Emitting newAssignment to delivery boy:", boySocketId);
          if (boySocketId) {
            io.to(boySocketId).emit("newAssignment", {
              sentTo: boy._id,
              assignmentId: deliveryAssignment._id,
              orderId: deliveryAssignment.order._id,
              shopName: deliveryAssignment.shop.name,
              deliveryAddress: deliveryAssignment.order.deliveryAddress,
              items:
                deliveryAssignment.order.shopOrders.find((so) => so._id.equals(deliveryAssignment.shopOrderId))
                  .shopOrderItem || [],
              subTotal: deliveryAssignment.order.shopOrders.find((so) =>
                so._id.equals(deliveryAssignment.shopOrderId),
              )?.subTotal
            });
          }
        });
      }
    }
    const updatedShopOrder = order.shopOrders.find((o) => o.shop == shopId);
    if (!updatedShopOrder) {
      return res.status(400).json({ message: "shop order not found" });
    }

    await order.save();
    await order.populate("shopOrders.shop", "name");
    await order.populate(
      "shopOrders.assignedDeliveryBoy",
      "fullName email mobile",
    );
    await order.populate("user", "socketId");
    const io = req.app.get("io");
    if (io) {
      const userSocketId = order.user.socketId;
      console.log("📤 Emitting update-status to user:", userSocketId);
      if (userSocketId) {
        io.to(userSocketId).emit("update-status", {
          orderId: order._id,
          shopId: updatedShopOrder.shop._id,
          status: updatedShopOrder.status,
          userId: order.user._id,
        });
      }
    }

    return res.status(200).json({
      shopOrder: updatedShopOrder,
      assignedDeliveryBoy: updatedShopOrder?.assignedDeliveryBoy,
      availableBoys: deliveryBoysPayLoad,
      assignment:
        updatedShopOrder?.assignment?._id ||
        updatedShopOrder?.assignment ||
        null,
    });
  } catch (error) {
    return res.status(500).json({ message: "update orders status error" });
  }
};

export const getDeliveryBoyAssignment = async (req, res) => {
  try {
    const deliveryBoyId = req.userId;

    const assignment = await DeliveryAssignment.find({
      broadCastedTo: deliveryBoyId,
      status: "broadcasted",
    })
      .populate("order")
      .populate("shop");

    const formatted = assignment.map((a) => ({
      assignmentId: a._id,
      orderId: a.order._id,
      shopName: a.shop.name,
      deliveryAddress: a.order.deliveryAddress,
      items:
        a.order.shopOrders.find((so) => so._id.equals(a.shopOrderId))
          .shopOrderItem || [],
      subTotal: a.order.shopOrders.find((so) => so._id.equals(a.shopOrderId))
        ?.subTotal,
    }));
    return res.status(200).json(formatted);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "get delivery delivery orders  error" });
  }
};

export const acceptOrder = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const assignment = await DeliveryAssignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    if (assignment.status !== "broadcasted") {
      return res
        .status(400)
        .json({ message: "Assignment already accepted by other delivery" });
    }

    const alreadyAssigned = await DeliveryAssignment.findOne({
      assignedTO: req.userId,
      status: { $nin: ["broadcasted", "completed"] },
    });

    if (alreadyAssigned) {
      return res
        .status(400)
        .json({ message: "You have already accepted another order" });
    }
    assignment.assignedTO = req.userId;
    assignment.status = "assigned";
    assignment.acceptedAt = new Date();

    const order = await Order.findById(assignment.order);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const shopOrder = order.shopOrders.id(assignment.shopOrderId);

    shopOrder.assignedDeliveryBoy = req.userId;

    await assignment.save();

    await order.save();
    await order.populate("shopOrders.assignedDeliveryBoy");

    return res.status(200).json({
      message: "Order accepted successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "Accept order error" });
  }
};

export const getCurrentOrder = async (req, res) => {
  try {
    const assignment = await DeliveryAssignment.findOne({
      assignedTO: req.userId,
      status: "assigned",
    })
      .populate("shop", "name") // assignment level shop
      .populate("assignedTO", "fullName email mobile location")

      .populate({
        path: "order",
        populate: [
          { path: "user", select: "fullName email location mobile" },
          {
            path: "shopOrders.shop",
            select: "name",
          },
        ],
      });

    if (!assignment) {
      return res.status(404).json({ message: "No current order found" });
    }
    if (!assignment.order) {
      return res
        .status(404)
        .json({ message: "Order not found for the assignment" });
    }
    const shopOrder = assignment.order.shopOrders.find(
      (so) => String(so._id) === String(assignment.shopOrderId),
    );
    if (!shopOrder) {
      return res
        .status(404)
        .json({ message: "Shop order not found for the assignment" });
    }

    let deliveryBoyLocation = { lat: null, lon: null };
    if (assignment.assignedTO?.location?.coordinates?.length === 2) {
      deliveryBoyLocation.lat = assignment.assignedTO.location.coordinates[1];
      deliveryBoyLocation.lon = assignment.assignedTO.location.coordinates[0];
    }

    let customerLocation = { lat: null, lon: null };
    if (assignment.order.deliveryAddress) {
      customerLocation.lat = assignment.order.deliveryAddress.latitude;
      customerLocation.lon = assignment.order.deliveryAddress.longitude;
    }
    return res.status(200).json({
      _id: assignment.order._id,
      user: assignment.order.user,
      shopOrder,
      deliveryAddress: assignment.order.deliveryAddress,
      deliveryBoyLocation,
      customerLocation,
    });
  } catch (error) {
    return res.status(500).json({ message: "Get current order error" });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId)
      .populate("user")
      .populate({
        path: "shopOrders.shop",
        model: "Shop",
      })
      .populate({
        path: "shopOrders.assignedDeliveryBoy",
        model: "User",
      })
      .populate({
        path: "shopOrders.shopOrderItem.item",
        model: "Item",
      })
      .lean();
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ message: "Get order by id error" });
  }
};

export const sendDeliveryOtp = async (req, res) => {
  try {
    const { orderId, shopOrderId } = req.params;
    const order = await Order.findById(orderId).populate("user");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const shopOrder = order.shopOrders.id(shopOrderId);

    if (!shopOrder) {
      return res.status(404).json({ message: "Shop order not found" });
    }
    if (!order || !shopOrder) {
      return res.status(404).json({ message: "Order or shop order not found" });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    shopOrder.deliveryOtp = otp;
    shopOrder.otpExpires = Date.now() + 5 * 60 * 1000;
    if (!order.user?.email) {
      return res.status(400).json({ message: "User email not found" });
    }
    await order.save();
    await sendDeliveryOtpMail(order.user.email, otp);
    return res
      .status(200)
      .json({ message: `OTP sent Successfully to ${order?.user?.fullName}` });
  } catch (error) {
    console.log("SEND OTP ERROR:", error);
    return res
      .status(500)
      .json({ message: "Error sending for the delivery OTP" });
  }
};

export const verifyDeliveryOtp = async (req, res) => {
  try {
    const { orderId, shopOrderId } = req.params;
    const { otp } = req.body;
    const order = await Order.findById(orderId).populate("user");
    const shopOrder = order.shopOrders.id(shopOrderId);
    if (!order || !shopOrder) {
      return res.status(404).json({ message: "Order or shop order not found" });
    }
    if (
      shopOrder.deliveryOtp !== otp ||
      !shopOrder.otpExpires ||
      shopOrder.otpExpires < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
    console.log("Stored OTP:", shopOrder.deliveryOtp);
    console.log("Entered OTP:", otp);
    shopOrder.status = "delivered";
    shopOrder.deliveredAt = Date.now();
    await order.save();
    await DeliveryAssignment.deleteOne({
      shopOrderId,
      order: order._id,
      assignedTO: shopOrder.assignedDeliveryBoy,
    });

    return res
      .status(200)
      .json({ message: "Order marked as delivered successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error verifying delivery OTP" });
  }
};


export const getTodayDeliveries= async(req,res)=>{
  try {
      const deliveryBoyId= req.userId;
      const startOfDay= new Date();
      startOfDay.setHours(0,0,0,0);
      const orders= await Order.find({
        "shopOrders.assignedDeliveryBoy": deliveryBoyId,
        "shopOrders.status":"delivered",
        "shopOrders.deliveredAt": {$gte: startOfDay}
      }).lean()
      let todayDeliveries= [];
      orders.forEach(order=>{
        order.shopOrders.forEach(shopOrder=>{
          if(shopOrder.assignedDeliveryBoy== deliveryBoyId && shopOrder.status=="delivered"
            && shopOrder.deliveredAt && 
            shopOrder.deliveredAt>=startOfDay
           ){
            todayDeliveries.push(shopOrder)
          }
        })
      })
      let stats={}
      todayDeliveries.forEach(delivery=>{
        const hour = new Date(delivery.deliveredAt).getHours();
        stats[hour]= stats[hour]? stats[hour]+1 : 1
      })
      let formattedStats= Object.keys(stats).map(hour=>({
        hour:parseInt(hour),
        count: stats[hour]
      }))
      formattedStats.sort((a,b)=>a.hour- b.hour)
      return res.status(200).json(formattedStats)
  } catch (error) {
    return res.status(500).json({message:"Get today's deliveries error"})
  }
}
