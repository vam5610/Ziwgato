import React from "react";
import NavBar from "./NavBar";
import { useSelector } from "react-redux";
import { FaUtensils, FaPen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import OwnerItemCard from "./OwnerItemCard";

function OwnerDashBoard() {
  const { myShopData } = useSelector((state) => state.owner);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fff9f6] to-orange-50">
      <NavBar />

      {!myShopData && (
        <div className="flex justify-center mt-24">
          <button
            className="bg-[#ff4d2d] text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:scale-105 transition"
            onClick={() => navigate("/create-edit-shop")}
          >
            Add Your Restaurant
          </button>
        </div>
      )}

      {myShopData?.shop && (
        <div className="max-w-5xl mx-auto px-4 mt-10 space-y-8">

          {/* SHOP CARD */}
          <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden">
            <img
              src={myShopData.shop.image}
              alt=""
              className="h-72 w-full object-cover"
            />
            <div
              onClick={() => navigate("/create-edit-shop")}
              className="absolute top-5 right-5 bg-[#ff4d2d] p-3 rounded-full cursor-pointer shadow-lg hover:scale-110 transition"
            >
              <FaPen className="text-white" />
            </div>
            <div className="p-6">
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <FaUtensils className="text-[#ff4d2d]" />
                {myShopData.shop.name}
              </h1>
              <p className="text-gray-500 mt-1">
                {myShopData.shop.city}, {myShopData.shop.state}
              </p>
            </div>
          </div>

          {/* ITEMS */}
          <div className="grid sm:grid-cols-2 gap-6">
            {myShopData.shop.items?.map(item => (
              <OwnerItemCard key={item._id} data={item} />
            ))}
          </div>

          {myShopData.shop.items?.length === 0 && (
            <div className="text-center">
              <button
                onClick={() => navigate("/add-item")}
                className="bg-[#ff4d2d] text-white px-8 py-3 rounded-full font-semibold shadow-md hover:scale-105 transition"
              >
                Add Your First Item 🍕
              </button>
            </div>
          )}

        </div>
      )}
    </div>
  );
}

export default OwnerDashBoard;
