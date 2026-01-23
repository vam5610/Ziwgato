import React from 'react'
import { FaMinus, FaPlus, FaTrash } from 'react-icons/fa6'
import { useDispatch } from 'react-redux'
import { removeCartItem, updateQuantity } from '../redux/userSlice';

function CartItemCard({ data }) {

  const dispatch= useDispatch();
  const handleIncrease=(id,currquantity)=>{
    dispatch(updateQuantity({id,quantity: currquantity+1}))
  }
  
  const handleDecrease=(id,currquantity)=>{
    dispatch(updateQuantity({id,quantity:Math.max(1,currquantity-1)}))
  }
  const handleRemove=(id)=>{
    dispatch(removeCartItem(id));
  }

  return (
    <div className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition">

      <div className="flex items-center gap-5">
        <img
          src={data.image}
          alt=""
          className="w-20 h-20 rounded-xl object-cover"
        />

        <div>
          <h1 className="text-base font-semibold text-gray-800 leading-snug">
            {data.name}
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            ₹{data.price} x {data.quantity} 
          </p>

          <p className="text-lg font-bold text-[#ff4d2d] mt-1">
            ₹{data.price * data.quantity}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 bg-[#fff4f1] px-3 py-2 rounded-full">
        <button className="w-7 h-7 cursor-pointer flex items-center justify-center rounded-full bg-white shadow hover:scale-105 transition" onClick={()=>handleDecrease(data?.id, data?.quantity)}>
          <FaMinus size={11} />
        </button>

        <span className="font-semibold text-gray-700 w-4 text-center">
          {data.quantity}
        </span>

        <button className="w-7 h-7 flex items-center justify-center cursor-pointer rounded-full bg-white shadow hover:scale-105 transition" onClick={()=>handleIncrease(data?.id,data?.quantity)}>
          <FaPlus size={11} />
        </button>
       <button className="w-9 h-9 flex items-center justify-center rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition" onClick={()=>handleRemove(data.id)}>
  <FaTrash size={14} />
</button>

      </div>

    </div>
  )
}

export default CartItemCard
