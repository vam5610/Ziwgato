import React, { useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { CiSearch } from "react-icons/ci";
import { IoIosSearch } from "react-icons/io";
import { FaCartShopping } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { ImCross } from "react-icons/im";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { FaPlus } from "react-icons/fa";
import { IoReceiptSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

function NavBar() {
  const { userData, currentCity,cartItems} = useSelector((state) => state.user);
  const {myShopData}= useSelector((state)=>state.owner);
  const [showInfo, setShowInfo] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const dispath = useDispatch();
  const navigate= useNavigate();

  const handleLogOut = () => {
    try {
      const result = axios.get(`${serverUrl}/api/auth/signout`, {
        withCredentials: true,
      });
      dispath(setUserData(null));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full h-[80px] flex items-center justify-between md:justify-center gap-[30px] px-[20px] fixed top-0 z-[9999] bg-[#fff9f6] overflow-visible">
      <h1 className="text-3xl font-bold mb-2 text-[#ff4d2d]">Ziwagto</h1>
      {showSearch && userData.user.role == "user" && (
        <div className="md:w-[60%] lg:w-[40%] h-[70px]  bg-white shadow-xl rounded-lg items-center gap-[20px] hidden md:flex">
          <div className="flex items-center w-[30%] overflow-hidden gap-[10px] px-[10px] border-r-[2px] border-gray-400">
            <FaLocationDot className=" text-[#ff4d2d]" size={25} />
            <div className="w-[80%] truncate text-gray-600">{currentCity}</div>
          </div>
          <div className="w-[80%] flex items-center gap-[10px]">
            {userData.user.role == "user" && (
              <IoIosSearch size={25} className="text-[#ff4d2d]" />
            )}
            <input
              type="text"
              placeholder="search delicious food..."
              className="px-[10px] text-gray-700 outline-0 w-full"
            />
          </div>
        </div>
      )}
      <div className="flex items-center gap-4">
        {userData.user.role === "user" &&
          (showSearch ? (
            <ImCross
              size={25}
              className="text-[#ff4d2d] md:hidden"
              onClick={() => setShowSearch(false)}
            />
          ) : (
            <IoIosSearch
              size={25}
              className="text-[#ff4d2d]"
              onClick={() => setShowSearch(true)}
            />
          ))}

        {userData.user.role === "owner" ?
          <> {myShopData && <>
          <button className='hidden md:flex items-center gap-1 p-2 cursor-pointer rounded-full bg-[#ff4d2d]/10 text-[#ff4d2d]' onClick={()=>navigate("/add-item")}>
              <FaPlus size={20} />
              <span>Add Food items</span>
            </button>
            <button className=' md:hidden items-center gap-1 p-2 cursor-pointer rounded-full bg-[#ff4d2d]/10 text-[#ff4d2d]'>
              <FaPlus size={20} />
            </button>
          </>} 
            <div className='hidden md:flex items-center gap-2 cursor-pointer relative px-3 py-1 rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] font-medium'>
              <IoReceiptSharp size={20} />
              <span>My Orders</span>
              <span className="absolute right-[-9px] top-[-12px] text-[#ff4d2d]">
              0
            </span>
            
            </div>
            <div className='md:hidden flex items-center gap-2 cursor-pointer relative px-3 py-1 rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] font-medium'>
              <IoReceiptSharp size={20} />
              
              <span className="absolute right-[-9px] top-[-12px] text-[#ff4d2d]">
              0
            </span>
            
            </div>
          </>
        : (
          <><div className="relative cursor-pointer" onClick={()=>navigate("/cart")}>
            <FaCartShopping size={25} className="text-[#ff4d2d]" />
            <span className="absolute right-[-9px] top-[-12px] text-[#ff4d2d]">
              {cartItems.length}
            </span>
          </div>
      
        <button className="hidden md:block px-3 py-1 rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] text-sm font-medium">
          My orders
        </button>
        
          </>
        )}
          
        <div
          className="w-[40px] h-[40px] rounded-full flex items-center justify-center bg-[#ff4d2d] text-white text-[18px] shadow-xl font-semibold cursor-pointer"
          onClick={() => setShowInfo((prev) => !prev)}
        >
          {userData?.user.fullName.slice(0, 1)}
        </div>
        {showInfo && (
          <div className="fixed top-[80px] right-[10px]  md:right-[10%] lg:right-[20%] w-[180px] bg-white shadow-2xl rounded-xl p-[20px] flex flex-col gap-[10px] z-[9999]">
            <div className="text-[17px] font-semibold">
              {userData.user.fullName}
            </div>
            {userData?.role=="user" && <div className="md:hidden text-[#ff4d2d] font-semibold cursor-pointer">
              My Orders
            </div>}
            <div
              className="text-[#ff4d2d] font-semibold cursor-pointer"
              onClick={handleLogOut}
            >
              Log Out
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default NavBar;
