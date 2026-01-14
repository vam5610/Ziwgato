import React, { useRef, useState } from 'react'
import NavBar from './NavBar'
import { categories } from '../category'
import CategoryCard from './CategoryCard'
import { FaCircleChevronLeft } from "react-icons/fa6";
import { FaCircleChevronRight } from "react-icons/fa6";
import React, { useState } from 'react';

function UserDashBoard() {
  const cateScrollRef= useRef();
  const [showCateButton,setShowCateButton]=useState(false);
    const [showLeftCateButton,setShowLeftCateButton]=useState(false)
  const [showRightCateButton,setShowRightCateButton]=useState(false)
   const [showLeftShopButton,setShowLeftShopButton]=useState(false)
  const [showRightShopButton,setShowRightShopButton]=useState(false)
  const [updatedItemsList,setUpdatedItemsList]=useState([]) 

  const updateButton=(ref,setLeftButton,setRightButton)=>{
    const element=ref.current
    if(element){
      console.log(element)
    }
  }
  
  const scrollHandler =(ref,directions)=>{
    if(ref.current){
      ref.current.scrollBy({
        left: directions=="left"?-200:200,
        behavior:"smooth"
      })
    }
  }



  return (
    <div className='w-screen min-h-screen flex flex-col gap-5 items-center bg-[#fff9f6] overflow-y-auto'>
      <NavBar />
      <div className='w-full max-w-6xl flex flex-col gap-5 items-start p-5 bg-white shadow-md rounded-2xl mt-4'>
        <h1>Hello insipration </h1>
        <div className='w-full'>
          <button className='absolute left-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10' onClick={()=>scrollHandler(cateScrollRef,"left")}>
            <FaCircleChevronLeft />
          </button>
          <div className='w-full flex overflow-x-auto gap-4 pb-2 ' ref={cateScrollRef}>
          {categories.map((cate,index)=>(
            <CategoryCard data={cate} key= {index} />
          ))}
          </div>
          <button className='absolute right-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10' onClick={()=>scrollHandler(cateScrollRef,"right")}>
            <FaCircleChevronRight />
          </button>
        </div>
      </div>
      </div>
  )
}

export default UserDashBoard