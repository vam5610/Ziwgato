import React from 'react'
import { useSelector } from 'react-redux'
import UserDashBoard from '../components/UserDashBoard'
import OwnerDashBoard from '../components/OwnerDashBoard'
import DeliveryBoy from '../components/DeliveryBoy'

function Home() {
  const {userData}= useSelector(state=>state.user)

  return (
    <div className='w-[100vw] min-h-[100vh] pt-[100px] flex flex-col items-center bg-[#fff9f6]'>
      {userData?.user.role=="user" && <UserDashBoard />}
      {userData?.user.role=="owner" && <OwnerDashBoard />}
      {userData?.user.role=="deliveryBoy"  && <DeliveryBoy />}
    </div>
  )
}

export default Home