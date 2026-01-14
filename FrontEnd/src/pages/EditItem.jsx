import React, { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { FaUtensils } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { setMyShopData } from "../redux/ownerSlice";
import { ClipLoader } from "react-spinners";

function EditItem() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { itemId } = useParams();

  const [item, setItem] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState("");
  const [foodType, setFoodType] = useState("veg");
  const [preview, setPreview] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const categories = [
    "Snacks","Main Course","Desserts","Pizza","Burgers",
    "Sandwiches","South Indian","North Indian","Chinese",
    "Fast Food","Others"
  ];

  useEffect(() => {
    axios.get(`${serverUrl}/api/item/get-by-id/${itemId}`, {
      withCredentials: true,
    }).then(res => {
      setItem(res.data);
      setName(res.data.name);
      setPrice(res.data.price);
      setCategory(res.data.category);
      setFoodType(res.data.foodType);
      setPreview(res.data.image);
    });
  }, [itemId]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const fd = new FormData();
    fd.append("name", name);
    fd.append("price", price);
    fd.append("category", category);
    fd.append("foodType", foodType);
    if (image) fd.append("image", image);

    await axios.post(
      `${serverUrl}/api/item/edit-item/${itemId}`,
      fd,
      { withCredentials: true }
    );

    const shop = await axios.get(
      `${serverUrl}/api/shop/my-shop`,
      { withCredentials: true }
    );
    dispatch(setMyShopData(shop.data));
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center px-4">
      
      <div onClick={() => navigate("/")} className="absolute top-6 left-6 cursor-pointer">
        <IoIosArrowRoundBack size={38} className="text-[#ff4d2d] hover:scale-110 transition" />
      </div>

      <div className="w-full max-w-xl backdrop-blur-xl bg-white/80 border border-orange-100 shadow-2xl rounded-3xl overflow-hidden">
        
        <div className="bg-gradient-to-r from-[#ff4d2d] to-orange-500 p-6 text-white text-center">
          <FaUtensils className="mx-auto mb-2 w-14 h-14" />
          <h1 className="text-2xl font-bold">Edit Food Item</h1>
          <p className="text-sm opacity-90">Make your dish irresistible 🍽️</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Food Name"
            className="input"
          />

          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            placeholder="Price"
            className="input"
          />

          <select value={category} onChange={(e) => setCategory(e.target.value)} className="input">
            <option value="">Select Category</option>
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>

          <select value={foodType} onChange={(e) => setFoodType(e.target.value)} className="input">
            <option value="veg">Veg 🌱</option>
            <option value="non-veg">Non-Veg 🍗</option>
          </select>

          <input type="file" accept="image/*" onChange={handleImage} />

          {preview && (
            <img src={preview} alt="" className="w-full h-44 object-cover rounded-xl shadow-md" />
          )}

          <button
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#ff4d2d] to-orange-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition"
          >
            {loading ? <ClipLoader size={22} color="white" /> : "Save Changes"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default EditItem;
