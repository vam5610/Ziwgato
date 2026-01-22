import React, { useState } from "react";
import { FaLeaf, FaDrumstickBite, FaStar } from "react-icons/fa";
import { CiStar } from "react-icons/ci";
import { FaMinus, FaPlus, FaCartPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/userSlice";

function FoodCard({ data }) {
  const [quantity, setQuantity] = useState(0);
  const dispatch= useDispatch();
  const {cartItems}= useSelector(state=>state.user)
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <FaStar key={i} className="text-yellow-400 text-lg" />
        ) : (
          <CiStar key={i} className="text-lg text-gray-400" />
        )
      );
    }
    return stars;
  };

  const handleIncreaseQty = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecreaseQty = () => {
    setQuantity((prev) => Math.max(0, prev - 1));
  };

  return (
    <div className="w-[250px] rounded-2xl border border-[#ff4d2d] bg-white shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
      <div className="relative w-full h-[170px] bg-gray-100">
        <img
          src={data.image}
          alt={data.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3 bg-white rounded-full p-2 shadow">
          {data.foodType === "veg" ? (
            <FaLeaf className="text-green-700" />
          ) : (
            <FaDrumstickBite className="text-red-500" />
          )}
        </div>
      </div>

      <div className="p-4 flex flex-col gap-2 flex-grow">
        <h1 className="font-semibold text-gray-900 text-base truncate">
          {data.name}
        </h1>
        <div className="flex items-center gap-1 mt-1">
          {renderStars(data.rating?.average || 0)}
          <span className="text-xs text-gray-500 ml-1">
            {data.rating?.count || 0} reviews
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between px-4 pb-4">
        <span className="font-bold text-gray-900 text-lg">
          ₹{data.price}
        </span>

        <div className="flex items-center border rounded-full shadow-sm">
  <button
    onClick={handleDecreaseQty}
    disabled={quantity === 0}
    className="px-2 py-1  disabled:opacity-40"
  >
    <FaMinus size={12} />
  </button>

  <span className="px-3 font-medium">{quantity}</span>

  <button
    onClick={handleIncreaseQty}
    className="px-2 py-1  "  
  >
    <FaPlus size={12} />
  </button>

  <div className="relative">
    <button className={`${cartItems.some(i=>i.id== data._id)? "bg-gray-700" : "bg-[#ff4d2d]"} text-white px-3 py-2 rounded-3xl hover:bg-[#e64528] transition `} onClick={()=>dispatch(addToCart({
      id:data._id,
      name: data.name,
      image: data.image,
      price: data.price, 
      shop: data.shop,
      quantity: quantity,
      foodType:data.foodType
    }))} >
      <FaCartPlus />
    </button>
    {quantity > 0 && (
      <span className="absolute -top-2 -right-2 bg-white text-[#ff4d2d] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow">
        {quantity}
      </span>
    )}
  </div>
</div>

      </div>
    </div>
  );
}

export default FoodCard;
