import { useEffect, useRef, useState } from "react";
import NavBar from "./NavBar";
import { categories } from "../category";
import CategoryCard from "./CategoryCard";
import { FaCircleChevronLeft, FaCircleChevronRight } from "react-icons/fa6";
import { useSelector } from "react-redux";

function UserDashBoard() {
  /* ---------------- REFS ---------------- */
  const cateScrollRef = useRef(null);
  const shopScrollRef = useRef(null);

  /* ---------------- STATE ---------------- */
  const [showLeftCateButton, setShowLeftCateButton] = useState(false);
  const [showRightCateButton, setShowRightCateButton] = useState(false);

  const [showLeftShopButton, setShowLeftShopButton] = useState(false);
  const [showRightShopButton, setShowRightShopButton] = useState(false);

  const { currentCity, shopsInMyCity } = useSelector((state) => state.user);
console.log("Current City:", currentCity);
console.log("Shop In My City:", shopsInMyCity);

  

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
    <div className="w-screen min-h-screen flex flex-col gap-6 items-center bg-[#fff9f6] overflow-y-auto">
      <NavBar />

      {/* ----------- CATEGORY SECTION ----------- */}
      <div className="w-full max-w-6xl bg-white p-5 rounded-2xl shadow-md mt-4">
        <h1 className="text-xl font-semibold mb-4">Hello Inspiration</h1>

        <div className="relative">
          {showLeftCateButton && (
            <button
              onClick={() => scrollCategory("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full z-10"
            >
              <FaCircleChevronLeft />
            </button>
          )}

          <div
            ref={cateScrollRef}
            className="flex gap-4 overflow-x-auto scroll-smooth pb-2"
          >
            {categories.map((cate, index) => (
              <CategoryCard key={index} name={cate.category} image={cate.image} />
            ))}
          </div>

          {showRightCateButton && (
            <button
              onClick={() => scrollCategory("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full z-10"
            >
              <FaCircleChevronRight />
            </button>
          )}
        </div>
      </div>

      {/* ----------- SHOP SECTION ----------- */}
      <div className="w-full max-w-6xl p-5">
        <h1 className="text-xl font-semibold mb-4">
          Best Shops in {currentCity}
        </h1>

        <div className="relative">
          {showLeftShopButton && (
            <button
              onClick={() => scrollShop("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full z-10"
            >
              <FaCircleChevronLeft />
            </button>
          )}

          <div
            ref={shopScrollRef}
            className="flex gap-4 overflow-x-auto scroll-smooth pb-2"
          >
            {shopsInMyCity?.map((shop, index) => (
              <CategoryCard name={shop.name} image={shop.image} key={index} />
            ))}
          </div>

          {showRightShopButton && (
            <button
              onClick={() => scrollShop("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full z-10"
            >
              <FaCircleChevronRight />
            </button>
          )}
        </div>
      </div>

      <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]">
        <h1 className="text-gray-800 text-2xl sm:text-3xl">
          Suggested Food Items 
        </h1>

      </div>
    </div>
  );
}

export default UserDashBoard;
