import React from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import UserOrderCard from "../components/UserOrderCard";
import OwnerOrderCard from "../components/OwnerOrderCard";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { setMyOrders, updateRealTImeStatus } from "../redux/userSlice";

function MyOrders() {
  const { userData, myOrders, socket } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch= useDispatch();
  console.log("Socket:", socket);
console.log("Socket connected:", socket?.connected);
  useEffect(()=>{
     socket?.on("newOrder",(data)=>{
      console.log("📥 newOrder received:", data);
      if(data.shopOrders.owner._id === userData?.user._id){
        dispatch(setMyOrders([data,...myOrders]))
      }
     })

    socket?.on("update-status",({orderId,shopId, status,userId})=>{
      console.log("📥 update-status received:");
      if(userId===userData?.user?._id){
        dispatch(updateRealTImeStatus({orderId,shopId,status}))
      }
     })
     return()=>{
      socket?.off("newOrder")
      socket?.off("update-status")
     }
    

  },[socket])
 
  return (
    <div className="w-full min-h-screen bg-[#fff9f6] flex justify-center px-4">
      <div className="w-full max-w-[800px] p-4">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/")}
            className="p-2 rounded-full bg-white shadow hover:scale-105 transition"
          >
            <IoIosArrowRoundBack size={32} className="text-[#ff4d2d]" />
          </button>

          <h1 className="text-3xl font-bold text-gray-800">Your Orders</h1>
        </div>

        <div>
          {myOrders?.length === 0 && (
            <p className="text-center text-gray-500">No orders found</p>
          )}

          {myOrders?.map((order, index) =>
            userData?.user.role === "user" ? (
              <UserOrderCard key={order._id || index} data={order} />
            ) : userData?.user.role === "owner" ? (
              <OwnerOrderCard key={order._id || index} data={order} />
            ) : null
          )}
        </div>
      </div>
    </div>
  );
}

export default MyOrders;
