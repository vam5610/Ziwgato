import axios from "axios";
import React, { useEffect, useState } from "react";
import { serverUrl } from "../App";
import { useParams, useNavigate } from "react-router-dom";
import { FaStore, FaLocationDot, FaArrowLeft } from "react-icons/fa6";
import { FaUtensils } from "react-icons/fa";
import FoodCard from "../components/FoodCard";

function Shop() {

  const { shopId } = useParams();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [shop, setShop] = useState({});

  const handleShop = async () => {
    try {

      const result = await axios.get(
        `${serverUrl}/api/item/get-by-shop/${shopId}`,
        { withCredentials: true }
      );

      setShop(result.data.shop);
      setItems(result.data.shop.items || []);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleShop();
  }, [shopId]);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* BACK BUTTON */}
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-white shadow-md rounded-lg hover:bg-gray-100 transition"
        >
          <FaArrowLeft />
          Back
        </button>
      </div>

      {/* SHOP HERO SECTION */}
      {shop && (
        <div className="relative mt-4">

          <img
            src={shop.image}
            alt=""
            className="w-full h-[320px] object-cover"
          />

          {/* overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

          {/* shop info card */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl">

            <div className="bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-xl">

              <div className="flex items-center gap-3 text-2xl font-bold">
                <FaStore className="text-orange-500" />
                {shop.name}
              </div>

              <div className="flex items-center gap-2 text-gray-600 mt-2">
                <FaLocationDot />
                <p>{shop.address}</p>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* MENU SECTION */}
      <div className="max-w-7xl mx-auto px-6 py-12">

        <h2 className="flex items-center gap-3 text-3xl font-bold mb-8">
          <FaUtensils className="text-orange-500" />
          Our Menu
        </h2>

        {/* MENU GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

          {items.length > 0 ? (
            items.map((item) => (
              <FoodCard key={item._id} data={item} />
            ))
          ) : (
            <p className="text-gray-500">No Items Available</p>
          )}

        </div>

      </div>

    </div>
  );
}

export default Shop;