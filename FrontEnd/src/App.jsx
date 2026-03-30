import React, { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import ForgotPassword from './pages/ForgotPassword'
import userGetCurr from './hooks/userGetCurr'
import { useDispatch, useSelector } from 'react-redux'
import Home from './pages/Home'
import useGetCity from './hooks/useGetCity'
import useGetMyShop from './hooks/useGetMyShop'
import CreateEditShop from './pages/CreateEditShop'
import AddItem from './pages/AddItem'
import EditItem from './pages/EditItem'
import useGetShopByCity from './hooks/useGetShopByCity'
import useGetItemsByCity from './hooks/useGetItemsByCity'
import CartPage from './pages/CartPage'
import CheckOut from './pages/CheckOut'
import OrderPlaced from './pages/OrderPlaced'
import MyOrder from './pages/MyOrders'
import MyOrders from './pages/MyOrders'
import useGetMyOrders from './hooks/useGetMyOrders'
import useUpdateLocation from './hooks/useUpdateLocation'
import TrackOrder from './components/TrackOrder'
import Shop from './pages/Shop'
import { setSocket } from './redux/userSlice'
import { io } from 'socket.io-client'

export const serverUrl="https://ziwgato-backend-myvr.onrender.com"  
function App() {
  userGetCurr();
  useUpdateLocation()
  useGetCity();
  useGetMyShop();
  useGetShopByCity();
  useGetItemsByCity();
  useGetMyOrders();

  const {userData}= useSelector(state=>state.user);
  console.log("user data", userData)
  const dispatch= useDispatch();

  useEffect(()=>{
    const socketInstance= io(serverUrl,{withCredentials:true}) 
    dispatch(setSocket(socketInstance))
    socketInstance.on('connect',()=>{
      if(userData){
        socketInstance.emit("identity",{userId:userData?.user._id})
      }
    })
    return ()=>{
      socketInstance.disconnect();
    }
  },[userData?.user?._id])

   
  return (
    <Routes>
      <Route path='/signup' element={!userData?<SignUp/>: <Navigate to={"/"} /> } />
      <Route path='/signin' element={!userData?<SignIn/>: <Navigate to={"/"} />} />
      <Route path='/forgot-password' element={!userData? <ForgotPassword/>: <Navigate to ={"/"}/>} />
      <Route path='/' element={userData?<Home /> :<Navigate to= {"/signin"}/> } />
      <Route path='/create-edit-shop' element={userData?<CreateEditShop /> :<Navigate to= {"/signin"}/> } />
      <Route path='/add-item' element={userData?<AddItem /> :<Navigate to= {"/signin"}/> } />
      <Route path='/edit-item/:itemId' element={userData?<EditItem /> :<Navigate to= {"/signin"}/> } />
      <Route path='/cart' element={userData?<CartPage /> :<Navigate to= {"/signin"}/> } />
      <Route path='/checkout' element={userData?<CheckOut /> :<Navigate to= {"/signin"}/> } />
      <Route path='/order-placed' element={userData?<OrderPlaced /> :<Navigate to= {"/order-placed"}/> } />
      <Route path='/my-orders' element={userData?<MyOrders /> :<Navigate to= {"/my-orders"}/> } />
      <Route path='/track-order/:orderId' element={userData?<TrackOrder /> :<Navigate to= {"/signin"}/> } />
      <Route path='/shop/:shopId' element={userData?<Shop /> :<Navigate to= {"/signin"}/> } />
      
    </Routes>
  )
}

export default App
