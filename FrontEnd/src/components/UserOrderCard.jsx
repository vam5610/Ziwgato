import React from "react";

function UserOrderCard({ data }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };


  return (
    <div className="bg-white rounded-lg shadow p-10 m-10 space-y-6">
      
      <div className="flex justify-between border-b pb-4">
        <div>
          <p className="font-semibold text-lg">
            Order #{data._id.slice(-6)}
          </p>
          <p className="text-sm text-gray-500">
            Date: {formatDate(data.createdAt)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">
            {data.paymentMethod.toUpperCase()}
          </p>
          <p className="font-medium text-blue-500">
            {data?.shopOrders?.[0]?.status}
          </p>
        </div>
      </div>

      {data.shopOrders.map((shopOrder, index) => (
        <div
          key={index}
          className="border rounded-lg p-4 bg-[#fffaf7] space-y-3"
        >
          <p className="font-semibold">{shopOrder.shop.name}</p>

          <div className="flex space-x-4 overflow-x-auto pb-2">
            {shopOrder?.shopOrderItem?.map((item, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-40 border rounded-lg p-2 bg-white"
              >
                <img
                  src={item.item.image}
                  alt=""
                  className="w-full h-24 object-cover rounded"
                />
                <p className="text-sm font-semibold mt-1">{item.name}</p>
                <p className="text-xs text-gray-500">
                  Qty: {item.quantity} × ₹{item.price}
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center border-t pt-2">
            <p className="font-semibold">
              Subtotal: ₹{shopOrder.subTotal}
            </p>
            <span className="text-sm font-medium text-blue-600">
              {shopOrder.status}
            </span>
          </div>
        </div>
      ))}
      <div className="flex justify-between items-center border-t pt-4">
        <p className="text-xl font-bold text-gray-800">
          Total Amount: ₹{data.totalAmount}
        </p>

        <button
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          onClick={() => console.log("Track order:", data._id)}
        >
          Track Order
        </button>
      </div>
    </div>
  );
}

export default UserOrderCard;
