import React from "react";
import { useNavigate } from "react-router-dom";

function UserOrderCard({ data }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border border-yellow-300";
      case "confirmed":
        return "bg-blue-100 text-blue-800 border border-blue-300";
      case "preparing":
        return "bg-purple-100 text-purple-800 border border-purple-300";
      case "ready":
        return "bg-green-100 text-green-800 border border-green-300";
      case "out for delivery":
        return "bg-orange-100 text-orange-800 border border-orange-300";
      case "delivered":
        return "bg-emerald-100 text-emerald-800 border border-emerald-300";
      case "cancelled":
        return "bg-red-100 text-red-800 border border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-300";
    }
  };

  const getPaymentIcon = (method) => {
    switch (method?.toLowerCase()) {
      case "card":
        return "💳";
      case "upi":
        return "📱";
      case "wallet":
        return "👛";
      case "cash":
        return "💵";
      default:
        return "💰";
    }
  };

  const navigate= useNavigate();

  return (
    <div className="mx-6 my-5 group">
      <div className="bg-gradient-to-br from-white via-orange-50 to-red-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-orange-200 overflow-hidden">
        <div className="relative bg-gradient-to-r from-[#ff4d2d] via-orange-500 to-red-500 p-6 text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-8 -mt-8"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-6 -mb-6"></div>
          
          <div className="relative z-10 flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-baseline gap-3 mb-2">
                <h3 className="text-3xl font-bold">#{data._id.slice(-6)}</h3>
                <span className="text-sm opacity-90">Order ID</span>
              </div>
              <p className="text-blue-100 text-sm flex items-center gap-2">
                📅 {formatDate(data.createdAt)}
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center justify-end gap-2 mb-3">
                <span className="text-2xl">{getPaymentIcon(data.paymentMethod)}</span>
                <div>
                  <p className="text-xs opacity-75">Payment</p>
                  <p className="font-semibold text-sm">{data.paymentMethod.toUpperCase()}</p>
                </div>
              </div>
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(data?.shopOrders?.[0]?.status)} bg-white text-[#ff4d2d] border border-orange-300`}>
                {data?.shopOrders?.[0]?.status}
              </div>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-5">
          {data.shopOrders.map((shopOrder, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all duration-300 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 flex justify-between items-center border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#ff4d2d] to-orange-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-lg">🏪</span>
                  </div>
                  <h4 className="font-bold text-gray-800">{shopOrder.shop.name}</h4>
                </div>
                <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${getStatusColor(shopOrder.status)}`}>
                  {shopOrder.status}
                </span>
              </div>
              <div className="px-6 py-4">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-3">Items</p>
                <div className="flex space-x-3 overflow-x-auto pb-3 scrollbar-hide">
                  {shopOrder?.shopOrderItem?.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="flex-shrink-0 w-44 bg-gradient-to-b from-white to-gray-50 rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-orange-400 hover:-translate-y-1"
                    >
                      <div className="relative w-full h-32 overflow-hidden bg-gray-100">
                        <img
                          src={item.item.image}
                          alt={item.name}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                          ×{item.quantity}
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-bold text-gray-800 truncate">{item.name}</p>
                        <div className="flex justify-between items-center mt-2">
                          <p className="text-xs text-gray-600">₹{item.price}/pc</p>
                          <p className="text-sm font-bold text-[#ff4d2d]">₹{item.price * item.quantity}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="px-6 py-3 bg-gradient-to-r from-orange-50 to-red-50 border-t border-gray-200 flex justify-between items-center">
                <p className="text-gray-700 font-semibold">Subtotal</p>
                <p className="text-lg font-bold text-[#ff4d2d]">₹{shopOrder.subTotal}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-gradient-to-r from-gray-50 to-orange-50 px-6 py-5 border-t-2 border-orange-200 flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Total Amount</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-[#ff4d2d] to-orange-600 bg-clip-text text-transparent">
              ₹{data.totalAmount}
            </p>
          </div>

          <button
            onClick={() => console.log("Track order:", data._id)}
            className="px-7 py-3 bg-gradient-to-r from-[#ff4d2d] to-orange-600 text-white font-bold rounded-xl hover:from-orange-600 hover:to-red-600 hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2 group/btn" onClickCapture={()=>navigate(`/track-order/${data._id}`)}
          >
            <span className="group-hover/btn:translate-x-1 transition-transform">📍</span>
            Track Order
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserOrderCard;
