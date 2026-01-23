import React, { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { CiLocationOn } from "react-icons/ci";
import { IoLocationSharp } from "react-icons/io5";
import { IoSearchOutline } from "react-icons/io5";
import { TbCurrentLocation } from "react-icons/tb";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useDispatch } from "react-redux";
import { setAddress, setLocation } from "../redux/mapSlice";
import axios from "axios";

function CheckOut() {
  const { location, address } = useSelector((state) => state.map);
  const navigate = useNavigate();
  const [searchLocation,setSearchLocation]= useState("")
  const dispatch= useDispatch()
  const[addressInput, setAddressInput]= useState("");
  const apikey= import.meta.env.VITE_GEOAPIKEY;

  function  RecenterMap({location}){
    if(location.lat && location.lon){
      const map= useMap()
      map.setView([location.lat,location.lon],16,{animate:true})
    }
    return null
  }
  const onDragEnd=(e)=>{
    console.log(e.target._latlng )
    const{lat,lng}= e.target._latlng
    dispatch(setLocation({lat,lon:lng}))
    getAddressByLatLng(lat,lng)
  }

  const getAddressByLatLng=async(lat,lng)=>{
    try {
      
      const result= await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&format=json&apiKey=${apikey}`)
      dispatch(setAddress(result?.data?.results[0].address_line2))
    } catch (error) {
      console.log(error)
    }
  }

  const currentLocation=()=>{
    navigator.geolocation.getCurrentPosition(async(postion)=>{
      const latitude= postion.coords.latitude;
      const longitude= postion.coords.longitude;
      dispatch(setLocation({lat:latitude,lon:longitude}))
      getAddressByLatLng(latitude,longitude)   
  })}

  const getLatLngByAddress= async()=>{
    try {
      const result= await axios.get(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(addressInput)}&apiKey=${apikey}`)
      const {lat,lon} = result?.data?.features?.[0]?.properties
      dispatch(setLocation({lat,lon}))
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    setAddressInput(address)
  },[address])


  return (
    <div className="min-h-screen bg-[#fff9f6] flex items-center justify-center p-6">
      <div
        className=" absolute top-[20px] left-[20px] z-[10]"
        onClick={() => navigate("/")}
      >
        <IoIosArrowRoundBack size={35} className="text-[#ff4d2d]" />
      </div>
      <div className="w-full max-w-[900px] bg-white rounded-2xl shadow-xl p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Checkout</h1>
        <section>
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2 text-gray-800">
            <IoLocationSharp className="text-[#ff4d2d]" /> Delivery Location
          </h2>
          <div className="flex gap-2 mb-3">
            <input
              type="text" value={addressInput} onChange={(e)=>setAddressInput(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]"
              placeholder="Enter Your Delivery Address.."
            />
            <button className="bg-[#ff4d2d] hover:bg-[#e64526] text-white px-3 py-2 rounded-lg flex items-center justify-center" onClick={getLatLngByAddress} >
              {" "}
              <IoSearchOutline />
            </button>
            <button className="bg-blue-500 cursor-pointer hover:bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center justify-center"
            onClick={currentLocation}>
              <TbCurrentLocation />
            </button>
          </div>
          <div className="rounded-xl border overflow-hidden">
            <div className="h-64 w-full flex items-center justify-center">
              <MapContainer
                className={"w-full h-full"}
                center={[location?.lat, location?.lon]}
                scrollWheelZoom={true}
                zoom={13}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <RecenterMap location={location} />
                <Marker position={[location?.lat,location?.lon]} draggable eventHandlers={{dragend:onDragEnd}}>
                  <Popup>
                    <p>{address}</p> 
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default CheckOut;
