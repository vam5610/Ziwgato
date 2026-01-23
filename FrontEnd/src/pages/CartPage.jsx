import React from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CartItemCard from "../components/CartItemCard";

function CartPage() {
  const navigate = useNavigate();
  const { cartItems, totalAmount } = useSelector((state) => state.user);
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff5f0] to-[#ffeae4] flex justify-center px-4 py-8">
      <div className="w-full max-w-[900px]">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/")}
            className="p-2 rounded-full bg-white shadow hover:scale-105 transition"
          >
            <IoIosArrowRoundBack size={32} className="text-[#ff4d2d]" />
          </button>

          <h1 className="text-3xl font-bold text-gray-800">Your Cart</h1>
        </div>

        {/* Cart Container */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {cartItems?.length == 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <p className="text-2xl font-semibold text-gray-400 mb-2">
                Your cart is empty 🛒
              </p>
              <p className="text-gray-500">
                Looks like you haven’t added anything yet
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {cartItems?.map((item, index) => (
                  <CartItemCard data={item} key={index} />
                ))}
              </div>
              <div className="mt-6 bg-white p-4 rounded-xl shadow flex justify-between items-center border">
                <h1 className="text-lg font-semibold">Total Amount</h1>
                <span className="text-xl font-bold text-[#ff4d2d]">
                  ₹{totalAmount}
                </span>
              </div>
              <div className="mt-4 flex justify-end">
                <button className='bg-[#ff4d2d] text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-[#e64526] transition cursor-pointer' onClick={()=>navigate("/checkout")}> Proceed to checkout</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CartPage;
