import React, { useState } from "react";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';


import { serverUrl } from "../App";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";


function SignIn() {
  const primaryColor = "#ff4d2d";
  const hoverColor = "#e64323";
  const bgColor = "#fff9f6";
  const borderColor = "#ddd";

  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("user"); // Default role is 'user'
  const navigate= useNavigate();
  const [err,setErr]= useState("");
  const [loading,setLoading]= useState(false);
  const [email,setEmail]= useState("");
  const [password,setPassword]= useState("");
 const dispatch= useDispatch();

  const handleSignIn=async()=>{
    setLoading(true);
    try {
      const result= await axios.post(`${serverUrl}/api/auth/signin`,{
        email,password
      },{withCredentials:true})
      
      dispatch(setUserData(result.data))
      setErr("")
      setLoading(false);

    } catch (error) {
setErr(error?.response?.data?.message)    }
  }


   const handleGoogleAuth=async()=>{
    
    const provider= new GoogleAuthProvider();
    const result= await signInWithPopup(auth,provider);
    
    try {
       const data= await axios.post(`${serverUrl}/api/auth/google-auth`,{
        email: result.user.email,
       }, {withCredentials:true})
       setErr("")
       dispatch(setUserData(data))
       console.log(data)
    } catch (error) {
setErr(error?.response?.data?.message)    }
  }


  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4"
      style={{ backgroundColor: bgColor }}
    >
      <div
        className={`bg-white rounded-xl shadow-lg w-full max-w-md p-8 border-[1px]`}
        style={{
          border: `1px solid ${borderColor}`,
        }}
      >
        <h1
          className={`text-3xl font-bold mb-2`}
          style={{ color: primaryColor }}
        >
          Ziwgato
        </h1>
        <p className="text-gray-600 mb-8">
          SignIn to your account to get started with delicious food deliveries
        </p>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 font-medium mb-1"
          >
            Email
          </label>
          <input
            type="email"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none"
            placeholder="Enter your email"
            style={{ border: `1px solid ${borderColor}`}} required onChange={(e)=>{setEmail(e.target.value)}} value={email}
          />
        </div>

        {/* Mobile */}
        

        {/* Password */}
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-gray-700 font-medium mb-1"
          >
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none"
              placeholder="Enter your Password"
              style={{ border: `1px solid ${borderColor}` }}
              onChange={(e)=>{setPassword(e.target.value)}} required value={password}
            />
            <button
              className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {!showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
            </button>
          </div>
        </div>
        <div className='text-right mb-4 cursor-pointer text-[#ff4d2d] font-medium' onClick={()=>navigate("/forgot-password")}>
          forgot paasword
        </div>

        {/* Role Selector Buttons */}
        
          <button className={`w-full font-semibold py-2 rounded-lg transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer`} onClick={handleSignIn}>
            {loading ? <ClipLoader size={20} /> :"SignIn"}
            </button>
           <button className='w-full mt-4 flex items-center justify-center gap-2 border rounded-lg px-4 py-2 transition cursor-pointer duration-200 border-gray-400 hover:bg-gray-100' onClick={handleGoogleAuth}>
<FcGoogle size={20}/>
<span>Sign in with google</span>
            </button>   
                                    {err && <p className="text-red-500 text-center my-[10px]" >*{err}</p>}

   
            <p className='text-center mt-6 cursor-pointer' onClick={()=>navigate("/signup")}>Create a new account ?<span className='text-[#ff4d2d]'>Sign up</span></p> 
      </div>

    </div>
  );
}

export default SignIn;
