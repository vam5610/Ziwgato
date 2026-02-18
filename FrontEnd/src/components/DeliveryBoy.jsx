import React, { useEffect, useState } from 'react'
import NavBar from './NavBar'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { serverUrl } from '../App'

function DeliveryBoy() {
  const {userData}= useSelector(state=>state.user)
  const [availableAssignments,setAvailableAssignments]= useState([])
  const [loading, setLoading] = useState(false)
  const [accepting, setAccepting] = useState(null)
  const [currentOrder, setCurrentOrder] = useState(null)
  
  const getCurrentOrder= async()=>{
    try {
      const result= await axios.get(`${serverUrl}/api/order/get-current-order`,{
        withCredentials:true 
      })
      console.log("current order", result.data)
      setCurrentOrder(result.data)
    } catch (error) {
      console.log(error)
    }
  }

  const getAssignment=async()=>{
    try {
      setLoading(true)
      const result= await axios.get(`${serverUrl}/api/order/get-assignments`,{
        withCredentials:true
      })
      console.log("get assignamet",result.data)
      setAvailableAssignments(result.data || [])
    } catch (error) {
      console.log('get assignments error', error)
      setAvailableAssignments([])
    } finally{
      setLoading(false)
    }
  }


  const acceptOrder= async(assignmentId)=>{
    try {
      const result= await axios.get(`${serverUrl}/api/order/accept-order/${assignmentId}`,{
        withCredentials:true,
      })
      await getCurrentOrder();
      console.log('accept order result', result.data)
    } catch (error) {
      console.log(error)      
    }
  }

  useEffect(()=>{
    getAssignment();
    getCurrentOrder();
  },[userData])

 

  return (
    <div className="w-screen min-h-screen flex flex-col items-center bg-gradient-to-br from-[#fff4ef] via-[#fff9f6] to-[#fff] overflow-y-auto">
      <NavBar />
      <div className='w-full max-w-[800px] flex flex-col gap-5 items-center'>
    <div className='bg-white rounded-2xl shadow-md p-5 flex flex-col justify-start items-center w-[90%] border border-orange-100 text-center gap-2'>
      <h1 className='text-xl font-bold text-[#ff4d2d]'>Welcome, {userData?.user?.fullName}</h1>
      <p className='text-[#ff4d2d]'><span  className='font-semibold'>Latitude :</span> {userData?.user?.location?.coordinates?.[1]}, <span  className='font-semibold'>Longitude :</span>{userData?.user?.location?.coordinates?.[0]} </p>
        </div>

{!currentOrder &&<div className='bg-white rounded-2xl shadow-md p-5 w-[90%] mb-6 border border-orange-100'>
  <h1 className='text-lg font-bold mb-3 text-[#ff4d2d] '>Today Deliveries</h1>

  

  <div className='space-y-4'>
    {loading ? (
      <p className='text-gray-500 text-sm'>Loading assignments...</p>
    ) : availableAssignments.length>0 ? (
      availableAssignments.map((a,index)=> (
        <div className='border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3' key={a.assignmentId || index}>
          <div className='flex-1'>
            <div className='flex items-center justify-between'>
              <p className='font-semibold text-gray-800'>{a?.shopName}</p>
              <p className='text-sm text-gray-500'>{a.items?.length || 0} items • ₹{a.subTotal || 0}</p>
            </div>
            <p className='text-xs text-gray-400 mt-2'><span className='font-semibold text-gray-600'>Delivery Address: </span> {a?.deliveryAddress?.text}</p>
            {a.items && a.items.length>0 && (
              <div className='flex flex-wrap gap-2 mt-3'>
                {a.items.map((it, i)=> (
                  <span key={i} className='text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded-md'>{it.name || it.item?.name}</span>
                ))}
              </div>
            )}
          </div>
          <div className='flex items-center gap-3'>
            <button
              onClick={()=>acceptOrder(a.assignmentId)}
              disabled={accepting===a.assignmentId}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${accepting===a.assignmentId ? 'bg-gray-300 text-gray-700 cursor-not-allowed' : 'bg-orange-500 text-white hover:bg-orange-600'}`}
            >
             Accept
            </button>
          </div>
        </div>
      ))
    ) : (
      <p className='text-gray-400 text-sm '>No available orders</p>
    )}
  </div>
        </div> }

       {currentOrder && <div className='bg-white rounded-2xl p-5 shadow-md w-[90%] border border-orange-100'>
<h2 className='text-lg font-bold mb-3'>📦Current Order</h2>
<div className='border rounded-lg p-4 mb-3'>
  <p className='font-semibold text-sm'>{currentOrder?.shopOrder.shop.name}</p>
  <p className='text-sm text-gray-500'>{currentOrder.deliveryAddress.text}</p>
 <p className='text-xs text-gray-400'>{currentOrder.shopOrder?.shopOrderItem?.length} items | {currentOrder.shopOrder.subTotal}</p>
</div>
</div>} 
        
      </div>
    </div>
  )
}

export default DeliveryBoy