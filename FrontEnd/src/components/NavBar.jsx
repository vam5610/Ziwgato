import React, { useEffect, useState } from "react";
import { FaLocationDot, FaCartShopping } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { ImCross } from "react-icons/im";
import { FaPlus } from "react-icons/fa";
import { IoReceiptSharp } from "react-icons/io5";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { setSearchItems, setUserData } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

function NavBar() {

  const { userData, currentCity, cartItems } = useSelector((state) => state.user);
  const { myShopData } = useSelector((state) => state.owner);

  const [showInfo, setShowInfo] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* ---------------- LOGOUT ---------------- */

  const handleLogOut = async () => {
    try {

      await axios.get(`${serverUrl}/api/auth/signout`, {
        withCredentials: true,
      });

      dispatch(setUserData(null));

    } catch (error) {
      console.log(error);
    }
  };

  /* ---------------- SEARCH FUNCTION ---------------- */

  const handleSearchItems = async () => {

    try {

      if (!query.trim()) {
        setSearchResults([]);
        return;
      } 

      const result = await axios.get(
        `${serverUrl}/api/item/search-items?query=${query}&city=${currentCity}`,
        { withCredentials: true }
      );
      dispatch(setSearchItems(result.data));
      setSearchResults(result.data);

    } catch (error) {
      console.log(error);
    }

  };

  /* ---------------- LIVE SEARCH ---------------- */

  useEffect(() => {

    const delay = setTimeout(() => {
      handleSearchItems();
    }, 400);

    return () => clearTimeout(delay);

  }, [query]);

  return (

    <div className="w-full h-[70px] flex items-center justify-between px-4 md:px-10 fixed top-0 z-[9999] bg-[#fff9f6] shadow-sm">

      {/* LOGO */}
      <h1
        className="text-2xl md:text-3xl font-bold text-[#ff4d2d] cursor-pointer"
        onClick={() => navigate("/")}
      >
        Ziwagto
      </h1>

      {/* DESKTOP SEARCH */}
      {userData?.user?.role === "user" && (

        <div className="hidden md:flex relative w-[50%] lg:w-[40%] h-[50px] bg-white shadow-md rounded-lg items-center">

          {/* CITY */}
          <div className="flex items-center w-[35%] px-3 border-r border-gray-300 gap-2">
            <FaLocationDot className="text-[#ff4d2d]" />
            <span className="truncate text-gray-600 text-sm">
              {currentCity}
            </span>
          </div>

          {/* SEARCH */}
          <div className="flex items-center w-[65%] px-2 gap-2">

            <IoIosSearch className="text-[#ff4d2d]" size={20} />

            <input
              type="text"
              placeholder="Search food..."
              className="w-full outline-none text-gray-700 text-sm"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

          </div>

          {/* SEARCH RESULTS */}
          {searchResults.length > 0 && (

            <div className="absolute top-[55px] left-0 w-full bg-white shadow-xl rounded-lg max-h-[300px] overflow-y-auto">

              {searchResults.map((item) => (

                <div
                  key={item._id}
                  className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    navigate(`/shop/${item.shop._id}`);
                    setSearchResults([]);
                    setQuery("");
                  }}
                >

                  <img
                    src={item.image}
                    className="w-[40px] h-[40px] rounded-md object-cover"
                  />

                  <div>
                    <p className="font-semibold text-sm">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.shop.name}</p>
                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      )}

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-4">

        {/* MOBILE SEARCH ICON */}
        {userData?.user?.role === "user" && (

          showSearch ?

            <ImCross
              size={20}
              className="text-[#ff4d2d] md:hidden cursor-pointer"
              onClick={() => setShowSearch(false)}
            />

            :

            <IoIosSearch
              size={22}
              className="text-[#ff4d2d] md:hidden cursor-pointer"
              onClick={() => setShowSearch(true)}
            />

        )}

        {/* CART */}
        {userData?.user?.role === "user" && (

          <div
            className="relative cursor-pointer"
            onClick={() => navigate("/cart")}
          >

            <FaCartShopping size={20} className="text-[#ff4d2d]" />

            <span className="absolute -top-2 -right-2 text-xs text-[#ff4d2d]">
              {cartItems.length}
            </span>

          </div>

        )}

        {/* OWNER PANEL */}
        {userData?.user?.role === "owner" && myShopData && (

          <button
            onClick={() => navigate("/add-item")}
            className="hidden md:flex items-center gap-2 px-3 py-1 bg-[#ff4d2d]/10 text-[#ff4d2d] rounded-lg"
          >
            <FaPlus />
            Add Food
          </button>

        )}

        {/* ORDERS */}
        <div
          className="hidden md:flex items-center gap-1 px-3 py-1 bg-[#ff4d2d]/10 text-[#ff4d2d] rounded-lg cursor-pointer"
          onClick={() => navigate("/my-orders")}
        >
          <IoReceiptSharp />
          Orders
        </div>

        {/* PROFILE */}
        <div
          className="w-[35px] h-[35px] flex items-center justify-center bg-[#ff4d2d] text-white rounded-full cursor-pointer"
          onClick={() => setShowInfo(!showInfo)}
        >
          {userData?.user?.fullName?.slice(0, 1)}
        </div>

        {/* PROFILE DROPDOWN */}
        {showInfo && (

          <div className="absolute top-[70px] right-[10px] w-[170px] bg-white shadow-xl rounded-lg p-4 flex flex-col gap-2">

            <p className="font-semibold text-gray-700">
              {userData?.user?.fullName}
            </p>

            {userData?.user?.role === "user" && (

              <button
                className="text-[#ff4d2d] text-sm text-left"
                onClick={() => navigate("/my-orders")}
              >
                My Orders
              </button>

            )}

            <button
              onClick={handleLogOut}
              className="text-[#ff4d2d] text-sm text-left"
            >
              Logout
            </button>

          </div>

        )}

      </div>

      {/* MOBILE SEARCH BAR */}

      {showSearch && (

        <div className="absolute top-[70px] left-0 w-full bg-white shadow-md p-3 md:hidden">

          <div className="flex items-center gap-2 border rounded-lg px-3 py-2">

            <IoIosSearch className="text-[#ff4d2d]" />

            <input
              type="text"
              placeholder="Search food..."
              className="w-full outline-none"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

          </div>

          {searchResults.length > 0 && (

            <div className="mt-2 max-h-[250px] overflow-y-auto">

              {searchResults.map((item) => (

                <div
                  key={item._id}
                  className="flex items-center gap-3 p-2 border-b cursor-pointer"
                  onClick={() => {
                    navigate(`/shop/${item.shop._id}`);
                    setShowSearch(false);
                    setQuery("");
                  }}
                >

                  <img
                    src={item.image}
                    className="w-[35px] h-[35px] rounded object-cover"
                  />

                  <div>
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.shop.name}</p>
                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      )}

    </div>

  );

}

export default NavBar; 