import { useEffect, useRef, useState } from "react";
import NavBar from "./NavBar";
import { categories } from "../category";
import CategoryCard from "./CategoryCard";
import { FaCircleChevronLeft, FaCircleChevronRight } from "react-icons/fa6";
import { useSelector } from "react-redux";
import FoodCard from "./FoodCard";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";

const placeholderShops = [
  {
    _id: "demo-shop-1",
    name: "Sunset Bites",
    image:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80",
  },
  {
    _id: "demo-shop-2",
    name: "Stone Oven",
    image:
      "https://images.unsplash.com/photo-1559839734-5ae63f3521b0?auto=format&fit=crop&w=600&q=80",
  },
  {
    _id: "demo-shop-3",
    name: "Citrus Cravings",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80",
  },
];

const placeholderItems = [
  {
    _id: "demo-item-1",
    name: "Crispy Veggie Wrap",
    image:
      "https://images.unsplash.com/photo-1478145046317-39f10e56b5e9?auto=format&fit=crop&w=600&q=80",
    price: 169,
    category: "Snacks",
    foodType: "veg",
    rating: { average: 4.6, count: 192 },
    shop: placeholderShops[0],
  },
  {
    _id: "demo-item-2",
    name: "Herb Roasted Chicken",
    image:
      "https://images.unsplash.com/photo-1604908176970-40cb5eca0cf0?auto=format&fit=crop&w=600&q=80",
    price: 349,
    category: "Main Course",
    foodType: "nonveg",
    rating: { average: 4.2, count: 86 },
    shop: placeholderShops[1],
  },
  {
    _id: "demo-item-3",
    name: "Paneer Tikka Platter",
    image:
      "https://images.unsplash.com/photo-1617191511454-c8f6dbfdb4b4?auto=format&fit=crop&w=600&q=80",
    price: 279,
    category: "North Indian",
    foodType: "veg",
    rating: { average: 4.8, count: 214 },
    shop: placeholderShops[2],
  },
];

function UserDashBoard() {
  /* ---------------- REFS ---------------- */
  const cateScrollRef = useRef(null);
  const shopScrollRef = useRef(null);

  /* ---------------- STATE ---------------- */
  const [showLeftCateButton, setShowLeftCateButton] = useState(false);
  const [showRightCateButton, setShowRightCateButton] = useState(false);
  const [showLeftShopButton, setShowLeftShopButton] = useState(false);
  const [showRightShopButton, setShowRightShopButton] = useState(false);
  const [updatedItemsList, setUpdatedItemsList] = useState(placeholderItems);
  const [selectRating, setSelectRating] = useState({});

  const { currentCity, shopsInMyCity, itemsInMyCity, userData } = useSelector(
    (state) => state.user
  );

  const navigate = useNavigate();

  const shopsToDisplay = shopsInMyCity?.length ? shopsInMyCity : placeholderShops;
  const itemsBase =
    itemsInMyCity?.length && itemsInMyCity?.length > 0
      ? itemsInMyCity
      : placeholderItems;

  useEffect(() => {
    if (itemsInMyCity?.length) {
      setUpdatedItemsList(itemsInMyCity);
    } else {
      setUpdatedItemsList(placeholderItems);
    }
  }, [itemsInMyCity]);

  /* ---------------- ACTION HANDLERS ---------------- */
  const handleRating = async (itemId, rating) => {
    if (!userData) {
      navigate("/signin");
      return;
    }

    try {
      const result = await axios.post(
        `${serverUrl}/api/item/rating`,
        {
          itemId,
          rating,
        },
        {
          withCredentials: true,
        }
      );

      setSelectRating((prev) => ({
        ...prev,
        [itemId]: rating,
      }));

      const updatedRating = result?.data?.rating;
      if (updatedRating) {
        setUpdatedItemsList((prevList) =>
          prevList.map((it) =>
            it._id === itemId ? { ...it, rating: updatedRating } : it
          )
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleByFilter = (category) => {
    const source = itemsBase;
    if (category === "All") {
      setUpdatedItemsList(source);
      return;
    }
    const filteredList = source.filter((item) => item.category === category);
    setUpdatedItemsList(filteredList);
  };

  const handleShopSelect = (shopId) => {
    if (!userData) {
      navigate("/signin");
      return;
    }
    navigate(`/shop/${shopId}`);
  };

  /* ---------------- SCROLL HELPERS ---------------- */
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

      <div className="w-full max-w-7xl bg-white/90 backdrop-blur-lg p-6 rounded-3xl shadow-xl mt-6">
        <h1 className="text-2xl font-bold mb-5 text-gray-800">
          ðŸ‘‹ Hello Inspiration
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
            {categories.map((cate) => (
              <CategoryCard
                key={cate.category}
                name={cate.category}
                image={cate.image}
                onClick={() => handleByFilter(cate.category)}
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

      <div className="w-full max-w-7xl px-6 mt-10">
        <h1 className="text-2xl font-bold mb-5 text-gray-800">
          ðŸ¬ Best Shops in{" "}
          <span className="text-[#ff4d2d]">{currentCity || "your city"}</span>
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
            {shopsToDisplay.map((shop) => (
              <CategoryCard
                key={shop._id}
                name={shop.name}
                image={shop.image}
                onClick={() => handleShopSelect(shop._id)}
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

      <div className="w-full max-w-7xl flex flex-col gap-6 px-6 mt-12 mb-10">
        <h1 className="text-3xl font-extrabold text-gray-800 text-center sm:text-left">
          ðŸ” Suggested Food Items
        </h1>

        <div className="w-full flex flex-wrap gap-8 justify-center sm:justify-start">
          {updatedItemsList?.map((item) => (
            <div
              key={item._id}
              className="transform hover:scale-105 transition duration-300"
            >
              <FoodCard
                data={item}
                onRate={(rating) => handleRating(item._id, rating)}
                selectedRating={selectRating[item._id]}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserDashBoard;
