import { useEffect, useRef, useState } from 'react'
import NavBar from './NavBar'
import { categories } from '../category'
import CategoryCard from './CategoryCard'
import { FaCircleChevronLeft, FaCircleChevronRight } from "react-icons/fa6";
import { useSelector } from 'react-redux';

function UserDashBoard() {
  const cateScrollRef = useRef(null);

  const [showLeftCateButton, setShowLeftCateButton] = useState(false);
  const [showRightCateButton, setShowRightCateButton] = useState(false);
  const {currentCity}= useSelector((state)=>(state.user))

  const updateButtons = () => {
    const el = cateScrollRef.current;
    if (!el) return;

    setShowLeftCateButton(el.scrollLeft > 0);
    setShowRightCateButton(
      el.scrollLeft + el.clientWidth < el.scrollWidth
    );
  };

  // Attach scroll listener
  useEffect(() => {
    const el = cateScrollRef.current;
    if (!el) return;

    // Initial check
    updateButtons();

    el.addEventListener('scroll', updateButtons);

    return () => {
      el.removeEventListener('scroll', updateButtons);
    };
  }, []);

  // Scroll handler
  const scrollHandler = (direction) => {
    const el = cateScrollRef.current;
    if (!el) return;

    el.scrollBy({
      left: direction === "left" ? -200 : 200,
      behavior: "smooth",
    });

    // Update buttons after scroll animation
    setTimeout(updateButtons, 300);
  };

  return (
    <div className='w-screen min-h-screen flex flex-col gap-5 items-center bg-[#fff9f6] overflow-y-auto'>
      <NavBar />

      <div className='w-full max-w-6xl flex flex-col gap-5 items-start p-5 bg-white shadow-md rounded-2xl mt-4'>
        <h1>Hello inspiration</h1>

        <div className='w-full relative'>
          {showLeftCateButton && (
            <button
              className='absolute left-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10'
              onClick={() => scrollHandler("left")}
            >
              <FaCircleChevronLeft />
            </button>
          )}

          <div
            ref={cateScrollRef}
            className='w-full flex overflow-x-auto gap-4 pb-2 scroll-smooth'
          >
            {categories.map((cate, index) => (
              <CategoryCard data={cate} key={index} />
            ))}
          </div>

          {showRightCateButton && (
            <button
              className='absolute right-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10'
              onClick={() => scrollHandler("right")}
            >
              <FaCircleChevronRight />
            </button>
          )}
        </div>
      </div>
      
      <div className='w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]'>
        <h1>Best Shop in {currentCity} </h1>
      </div>

    </div>
  );
}

export default UserDashBoard;
