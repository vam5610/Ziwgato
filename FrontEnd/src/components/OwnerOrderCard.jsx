import axios from "axios";
import React from "react";
import { MdPhone } from "react-icons/md";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { updateOrderStatus } from "../redux/userSlice";
import { useState } from "react";

function OwnerOrderCard({ data }) {
  const dispatch= useDispatch()
  const [availableBoys,setAvailableBoys]= useState([])
  console.log("data",data.shopOrder?.assignedDeliveryBoy)

  const handleUpdateStatus=async(orderId,shopId,status)=>{
    try {
      const result= await axios.post(`${serverUrl}/api/order/update-status/${orderId}/${shopId}`,{status},{withCredentials:true})
      dispatch(updateOrderStatus({orderId,shopId,status}))
      setAvailableBoys(result.data.availableBoys)
      console.log(result.data)
    } catch (error) {
      console.log(error);
    }
    
  }
  return (
    <div className="bg-white rounded-lg shadow p-4 m-6 space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">
          {data.user.fullName}
        </h2>
        <p className="text-sm text-gray-500">{data.user.email}</p>
        <p className="flex items-center gap-2 text-sm text-gray-600 mt-1">
          <MdPhone />
          <span>{data.user.mobile}</span>
        </p>
        {data.paymentMethod == "online" ? (
          <p className="gap-2 text-sm text-gray-600">
            payment: {data.payment ? "true" : "false"}
          </p>
        ) : (
          <p className="gap-2 text-sm text-gray-600">
            Payment Method: {data.paymentMethod}
          </p>
        )}
      </div>
      <div className="flex items-start flex-col gap-2 text-gray-600 text-sm">
        <p>{data?.deliveryAddress?.text}</p>
        <p className="text-xs text-gray-500">
          Lat: {data?.deliveryAddress.latitude} , Lon{" "}
          {data?.deliveryAddress.longitude}
        </p>
      </div>
      <div className="flex space-x-3 overflow-x-auto pb-3 scrollbar-hide">
        {data.shopOrders?.shopOrderItem?.map((item, itemIndex) => (
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
              <p className="text-sm font-bold text-gray-800 truncate">
                {item.name}
              </p>
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-600">₹{item.price}/pc</p>
                <p className="text-sm font-bold text-[#ff4d2d]">
                  ₹{item.price * item.quantity}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className='flex justify-between items-center mt-auto pt-3 border-t border-gray-100'>
<span className='text-sm'>status: <span className='font-semibold capitalize text-[#ff4d2d]'>{data.shopOrders.status}</span>
</span>
<select className='rounded-md border px-3 py-1 text-sm focus:outline-none focus:ring-2 border-[#ff4d2d] text-[#ff4d2d]' onChange={(e)=>handleUpdateStatus(data._id, data.shopOrders.shop._id,e.target.value)}>
  <option value="">Change</option>
  <option value="pending">Pending</option>
<option value="preparing">Preparing</option>
<option value="out of delivery">Out Of Delivery</option>
</select>
</div>
{data.shopOrders.status=="out of delivery" && 
<div className="mt-3 p-2 border rounded-lg   bg-orange-50 text-sm ">
  <p>Available Boys</p>
  {availableBoys.length>0?(
    availableBoys.map((b,index)=>(
      <div key={index} className="text-gray-600">{b.fullName} - {b.mobile}</div>
    ))
  ): data.shopOrder?.assignedDeliveryBoy? <div>{data.shopOrder.assignedDeliveryBoy.fullName}</div> :<div>Waiting for available boys</div>}
  </div>}
<div className='text-right font-bold text-gray-800 text-sm'>
  Total: ₹{data.shopOrders.subTotal}
</div>
    </div>
  );
}

export default OwnerOrderCard;
