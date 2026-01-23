import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";



const mapSlice= createSlice({
  name:"map",
  initialState:{
    location:{
      lat:null,
      lon:null
    },
    address:null 
  },
  reducers:{
    setLocation:(state,action)=>{
      const {lat,lon}= action.payload
      state.location.lat= action.payload.lat
      state.location.lon= action.payload.lon
    },
    setAddress:(state,action)=>{
      state.address=action.payload
    }
  }
})

export const {setLocation,setAddress}= mapSlice.actions;
export default mapSlice.reducer;