import axios from 'axios';
import React from 'react';
import { FaPen, FaTrashAlt } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../App';
import { useDispatch } from 'react-redux';
import { setMyShopData } from '../redux/ownerSlice';

function OwnerItemCard({ data }) {
  const navigate= useNavigate();
  const dispatch= useDispatch();
  const handleDelete=async()=>{
    try {
      const result= await axios.get(`${serverUrl}/api/item/delete/${data._id}`,{
        withCredentials:true
      })
      dispatch(setMyShopData(result.data));
    } catch (error) {
      console.log("delete item error",error);
   }
  }
  return (
    <div className='flex bg-white rounded-lg shadow-md overflow-hidden border border-[#ff4d2d] mt-5 w-full max-w-2xl'>
      <div className='w-36 flex-shrink-0 bg-gray-50'>
        <img
          src={data.image}
          alt={data.name || 'item'}
          className='w-full h-full object-cover'
        />
      </div>
      <div className='flex flex-col justify-center  p-3 flex-1'>
        <div >
          <h2 className='text-base font-semibold text-[#ff4d2d]'> {data.name}</h2>
          <p><span className='font-medium text-gray-70'>Category:</span> {data.category}</p>
<p><span className='font-medium text-gray-70'>Food Type:</span> {data.foodType}</p>
        </div>
        <div className="flex items-center justify-between mt-3 w-full">
  {/* Price */}
  <span className="text-[#ff4d2d] font-bold text-lg">
    ₹{data.price}
  </span>

  {/* Actions */}
  <div className="flex items-center gap-2">
    <button className="p-2 rounded-full text-[#ff4d2d] hover:bg-[#ff4d2d]/10 transition">
      <FaPen size={16} onClick={()=>navigate(`/edit-item/${data._id}`)} />
    </button>

    <button className="p-2 rounded-full text-red-500 hover:bg-red-500/10 transition" onClick={handleDelete}>
      <FaTrashAlt size={16} />
    </button>
  </div>
</div>

      </div>
    </div>
  );
}

export default OwnerItemCard;
