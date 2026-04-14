import React from 'react'
import { useSelector } from 'react-redux'
import UserDashBoard from '../components/UserDashBoard'
import OwnerDashBoard from '../components/OwnerDashBoard'
import DeliveryBoy from '../components/DeliveryBoy'

function Home() {
  const { userData } = useSelector((state) => state.user)
  const role = userData?.user?.role
  const showUserDash = !role || role === "user"

  return (
    <div className='w-[100vw] min-h-[100vh] pt-[100px] flex flex-col items-center bg-[#fff9f6]'>
      {showUserDash && <UserDashBoard />}
      {role === "owner" && <OwnerDashBoard />}
      {role === "deliveryBoy" && <DeliveryBoy />}
    </div>
  )
}

export default Home
