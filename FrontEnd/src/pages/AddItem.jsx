import React, { useState, useRef } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { FaUtensils } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { serverUrl } from "../App";
import { setMyShopData } from "../redux/ownerSlice";

function AddItem() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { myShopData } = useSelector((state) => state.owner);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [category, setCategory] = useState("");
  const [foodType, setFoodType] = useState("veg");
  const [loading, setLoading] = useState(false);

  const imageRef = useRef();

  const categories = [
    "Snacks",
    "Main Course",
    "Desserts",
    "Pizza",
    "Burgers",
    "Sandwiches",
    "South Indian",
    "North Indian",
    "Chinese",
    "Fast Food",
    "Others",
  ];

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("foodType", foodType);
      if (backendImage) formData.append("image", backendImage);

      const result = await axios.post(
        `${serverUrl}/api/item/add-item`,
        formData,
        { withCredentials: true }
      );

      dispatch(setMyShopData(result.data));
      navigate("/");
    } catch (error) {
      console.log("Add item error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 px-4">
      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 p-2 rounded-full bg-white shadow hover:bg-orange-50 transition"
      >
        <IoIosArrowRoundBack size={30} className="text-[#ff4d2d]" />
      </button>

      {/* Card */}
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl p-8">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-orange-100 p-4 rounded-full mb-3">
            <FaUtensils className="text-[#ff4d2d] w-12 h-12" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Add Food Item</h1>
          <p className="text-sm text-gray-500 mt-1">
            Fill the details to add a new item
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Food Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Eg: Paneer Butter Masala"
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Food Image
            </label>
            <div
              onClick={() => imageRef.current.click()}
              className="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer hover:border-orange-400 transition"
            >
              <input
                type="file"
                accept="image/*"
                ref={imageRef}
                onChange={handleImage}
                hidden
              />
              <p className="text-sm text-gray-500">
                Click to upload or drag & drop
              </p>
            </div>

            {frontendImage && (
              <img
                src={frontendImage}
                alt="Preview"
                className="mt-4 w-full h-48 object-cover rounded-xl border"
              />
            )}
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                ₹
              </span>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0"
                className="w-full pl-8 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                required
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cate, i) => (
                <option key={i} value={cate}>
                  {cate}
                </option>
              ))}
            </select>
          </div>

          {/* Food Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Food Type
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="veg"
                  checked={foodType === "veg"}
                  onChange={(e) => setFoodType(e.target.value)}
                />
                Veg
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="non-veg"
                  checked={foodType === "non-veg"}
                  onChange={(e) => setFoodType(e.target.value)}
                />
                Non-Veg
              </label>
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#ff4d2d] text-white py-3 rounded-xl font-semibold shadow-md hover:bg-orange-600 transition flex justify-center"
          >
            {loading ? <ClipLoader size={22} color="white" /> : "Save Item"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddItem;
