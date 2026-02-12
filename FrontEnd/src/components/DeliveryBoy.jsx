import React, { useEffect } from 'react'
import NavBar from './NavBar'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { serverUrl } from '../App'

function DeliveryBoy() {
  const {userData}= useSelector(state=>state.user)
  console.log(userData)

  const getAssignment=async()=>{
    try {
      const result= await axios.get(`${serverUrl}/api/order/get-assignments`,{
        withCredentials:true
      }) 
      console.log(result.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    getAssignment();
  },[userData])
  
  return (
    <div className="w-screen min-h-screen flex flex-col items-center bg-gradient-to-br from-[#fff4ef] via-[#fff9f6] to-[#fff] overflow-y-auto">
      <NavBar />
      <div className='w-full max-w-[800px] flex flex-col gap-5 items-center'>
    <div className='bg-white rounded-2xl shadow-md p-5 flex flex-col justify-start items-center w-[90%] border border-orange-100 text-center gap-2'>
      <h1 className='text-xl font-bold text-[#ff4d2d]'>Welcome, {userData?.user?.fullName}</h1>
      <p className='text-[#ff4d2d]'><span  className='font-semibold'>Latitude :</span> {userData?.user.location.coordinates[1]}, <span  className='font-semibold'>Longitude :</span>{userData?.user.location.coordinates[0]} </p>
        </div>
      </div>
    </div>
  )
}

export default DeliveryBoy