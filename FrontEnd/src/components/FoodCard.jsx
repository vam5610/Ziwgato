import React from 'react'

function FoodCard({data}) {
  return (
    <div className='w-[250px] rounded-2xl border-2 border-[#ff4d2d] bg-white shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col'>
        <div className='relative w-full h-[170px] flex justify-center items-center bg-white'>
      <div className='absolute top-3 right-3 bg-white rounded-full p-1 shadow'>
        <img src={data.image} className='w-full h-full object-cover transition-transform duration-300 hover:scale-105' />

      </div>
      </div>

    </div>
  )
}

export default FoodCard 