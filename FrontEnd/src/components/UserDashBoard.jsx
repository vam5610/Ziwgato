import { useEffect, useRef, useState } from "react";
import NavBar from "./NavBar";
import { categories } from "../category";
import CategoryCard from "./CategoryCard";
import { FaCircleChevronLeft, FaCircleChevronRight } from "react-icons/fa6";
import { useSelector } from "react-redux";
import FoodCard from "./FoodCard";

function UserDashBoard() {
  /* ---------------- REFS ---------------- */
  const cateScrollRef = useRef(null);
  const shopScrollRef = useRef(null);

  /* ---------------- STATE ---------------- */
  const [showLeftCateButton, setShowLeftCateButton] = useState(false);
  const [showRightCateButton, setShowRightCateButton] = useState(false);

  const [showLeftShopButton, setShowLeftShopButton] = useState(false);
  const [showRightShopButton, setShowRightShopButton] = useState(false);

  const { currentCity, shopsInMyCity,itemsInMyCity } = useSelector((state) => state.user);


  

  /* ---------------- CATEGORY LOGIC ---------------- */
  const updateCategoryButtons = () => {
    const el = cateScrollRef.current;
    if (!el) return;

    setShowLeftCateButton(el.scrollLeft > 0);
    setShowRightCateButton(el.scrollLeft + el.clientWidth < el.scrollWidth);
  };

  const scrollCategory = (direction) => {
    const el = cateScrollRef.current;
    if (!el) return;

    el.scrollBy({
      left: direction === "left" ? -250 : 250,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const el = cateScrollRef.current;
    if (!el) return;

    updateCategoryButtons();
    el.addEventListener("scroll", updateCategoryButtons);

    return () => {
      el.removeEventListener("scroll", updateCategoryButtons);
    };
  }, []);

  /* ---------------- SHOP LOGIC ---------------- */
  const updateShopButtons = () => {
    const el = shopScrollRef.current;
    if (!el) return;

    setShowLeftShopButton(el.scrollLeft > 0);
    setShowRightShopButton(el.scrollLeft + el.clientWidth < el.scrollWidth);
  };

  const scrollShop = (direction) => {
    const el = shopScrollRef.current;
    if (!el) return;

    el.scrollBy({
      left: direction === "left" ? -250 : 250,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const el = shopScrollRef.current;
    if (!el) return;

    updateShopButtons();
    el.addEventListener("scroll", updateShopButtons);

    return () => {
      el.removeEventListener("scroll", updateShopButtons);
    };
  }, []);

  /* ---------------- UI ---------------- */
 return (
  <div className="w-screen min-h-screen flex flex-col items-center bg-gradient-to-br from-[#fff4ef] via-[#fff9f6] to-[#fff] overflow-y-auto">
    <NavBar />

    {/* ----------- CATEGORY SECTION ----------- */}
    <div className="w-full max-w-7xl bg-white/90 backdrop-blur-lg p-6 rounded-3xl shadow-xl mt-6">
      <h1 className="text-2xl font-bold mb-5 text-gray-800">
        👋 Hello Inspiration
      </h1>

      <div className="relative">
        {showLeftCateButton && (
          <button
            onClick={() => scrollCategory("left")}
            className="absolute left-[-18px] top-1/2 -translate-y-1/2 bg-gradient-to-r from-[#ff4d2d] to-[#ff7a5c] text-white p-3 rounded-full shadow-lg hover:scale-110 transition z-10"
          >
            <FaCircleChevronLeft />
          </button>
        )}

        <div
          ref={cateScrollRef}
          className="flex gap-5 overflow-x-auto scroll-smooth pb-3 scrollbar-hide"
        >
          {categories.map((cate, index) => (
            <CategoryCard
              key={index}
              name={cate.category}
              image={cate.image}
            />
          ))}
        </div>

        {showRightCateButton && (
          <button
            onClick={() => scrollCategory("right")}
            className="absolute right-[-18px] top-1/2 -translate-y-1/2 bg-gradient-to-r from-[#ff4d2d] to-[#ff7a5c] text-white p-3 rounded-full shadow-lg hover:scale-110 transition z-10"
          >
            <FaCircleChevronRight />
          </button>
        )}
      </div>
    </div>

    {/* ----------- SHOP SECTION ----------- */}
    <div className="w-full max-w-7xl px-6 mt-10">
      <h1 className="text-2xl font-bold mb-5 text-gray-800">
        🏬 Best Shops in <span className="text-[#ff4d2d]">{currentCity}</span>
      </h1>

      <div className="relative">
        {showLeftShopButton && (
          <button
            onClick={() => scrollShop("left")}
            className="absolute left-[-18px] top-1/2 -translate-y-1/2 bg-gradient-to-r from-[#ff4d2d] to-[#ff7a5c] text-white p-3 rounded-full shadow-lg hover:scale-110 transition z-10"
          >
            <FaCircleChevronLeft />
          </button>
        )}

        <div
          ref={shopScrollRef}
          className="flex gap-5 overflow-x-auto scroll-smooth pb-3 scrollbar-hide"
        >
          {shopsInMyCity?.map((shop, index) => (
            <CategoryCard
              key={index}
              name={shop.name}
              image={shop.image}
            />
          ))}
        </div>

        {showRightShopButton && (
          <button
            onClick={() => scrollShop("right")}
            className="absolute right-[-18px] top-1/2 -translate-y-1/2 bg-gradient-to-r from-[#ff4d2d] to-[#ff7a5c] text-white p-3 rounded-full shadow-lg hover:scale-110 transition z-10"
          >
            <FaCircleChevronRight />
          </button>
        )}
      </div>
    </div>

    {/* ----------- FOOD SECTION ----------- */}
    <div className="w-full max-w-7xl flex flex-col gap-6 px-6 mt-12 mb-10">
      <h1 className="text-3xl font-extrabold text-gray-800 text-center sm:text-left">
        🍔 Suggested Food Items
      </h1>

      <div className="w-full flex flex-wrap gap-8 justify-center sm:justify-start">
        {itemsInMyCity?.map((item, index) => (
          <div
            key={index}
            className="transform hover:scale-105 transition duration-300"
          >
            <FoodCard data={item} />
          </div>
        ))}
      </div>
    </div>
  </div>
);

}

export default UserDashBoard;
