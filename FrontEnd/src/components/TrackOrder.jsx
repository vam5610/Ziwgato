import axios from 'axios';
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { serverUrl } from '../App';

function TrackOrder() {

  const {orderId}= useParams();
  const handleGetOrder= async()=>{
    try {
      const result= await axios.get(`${serverUrl}/api/order/get-order-by-id/${orderId}`,{
        withCredentials:true
      })
      console.log("first", result.data)
    } catch (error) {
      
    }
  }

  useEffect(()=>{
    handleGetOrder();
  },[orderId])
  return (
    <div>
      
    </div>
  )
}

export default TrackOrder