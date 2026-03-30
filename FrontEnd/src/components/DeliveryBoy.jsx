import React, { useEffect, useState } from "react";
import NavBar from "./NavBar";
import { useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import DeliveryBoyTracking from "./DeliveryBoyTracking";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ClipLoader } from "react-spinners";

function DeliveryBoy() {
  const { userData, socket } = useSelector((state) => state.user);
  const [availableAssignments, setAvailableAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [accepting, setAccepting] = useState(null);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [otp, setOtp] = useState("");
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState(null);
  const [todayDeliveries, setTodayDeliveries] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!socket || userData?.user?.role !== "deliveryBoy") return;
    let watchId;
    if (navigator.geolocation) {
      ((watchId = navigator.geolocation.watchPosition((postion) => {
        const latitude = postion.coords.latitude;
        const longitude = postion.coords.longitude;
        setDeliveryBoyLocation({ lat: latitude, lon: longitude });
        socket?.emit("updateLocation", {
          latitude,
          longitude,
          userId: userData.user._id,
        });
      })),
        (error) => {
          console.log("Error getting location", error);
        },
        {
          enableHighAccuracy: true,
        });
    }
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [socket, userData]);

  const getCurrentOrder = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/order/get-current-order`,
        {
          withCredentials: true,
        },
      );
      console.log("current order", result.data);
      setCurrentOrder(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getAssignment = async () => {
    try {
      setLoading(true);
      const result = await axios.get(`${serverUrl}/api/order/get-assignments`, {
        withCredentials: true,
      });
      console.log("get assignamet", result.data);
      setAvailableAssignments(result.data || []);
    } catch (error) {
      console.log("get assignments error", error);
      setAvailableAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  const acceptOrder = async (assignmentId) => {
    try {
      setAccepting(assignmentId);
      const result = await axios.get(
        `${serverUrl}/api/order/accept-order/${assignmentId}`,
        { withCredentials: true },
      );
      await getCurrentOrder();
      console.log("accept order result", result.data);
    } catch (error) {
      console.log(error);
    } finally {
      setAccepting(null);
    }
  };

  const sendOtp = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/order/send-delivery-otp/${currentOrder._id}/${currentOrder.shopOrder._id}`,
        {},
        { withCredentials: true },
      );
      setLoading(false);
      setShowOtpBox(true);
      console.log("res", result.data);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  console.log("current order", currentOrder);

  const verifyOtp = async () => {
    setMessage("");
    try {
      const result = await axios.post(
        `${serverUrl}/api/order/verify-delivery-otp/${currentOrder._id}/${currentOrder.shopOrder._id}`,
        { otp },
        { withCredentials: true },
      );
      setMessage(result.data.message);
      location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const handleTodayDeliveries = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/order/get-today-deliveries`,
        { withCredentials: true },
      );
      console.log("today delivery data", result.data);
      setTodayDeliveries(result.data || []);
    } catch (error) {
      console.log("Todat deliveryerror", error);
    }
  };
  const ratePerDelivery = 50;
  const totalEarings = todayDeliveries.reduce(
    (sum, d) => sum + d.count * ratePerDelivery,
    0,
  );

  useEffect(() => {
    socket?.on("newAssignment", (data) => {
      console.log("📥 newAssignment received:", data);
      if (data.sentTo === userData?.user?._id) {
        setAvailableAssignments((prev) => [...prev, data]);
      }
    });
    return () => {
      socket?.off("newAssignment");
    };
  }, [socket, userData, availableAssignments]);

  useEffect(() => {
    if (!userData?.user?._id) {
      console.log("no user data");
      return;
    }
    getAssignment();
    getCurrentOrder();
    handleTodayDeliveries();
  }, [userData]);

  return (
    <div className="w-screen min-h-screen flex flex-col items-center bg-gradient-to-br from-[#fff4ef] via-[#fff9f6] to-[#fff] overflow-y-auto">
      <NavBar />
      <div className="w-full max-w-[800px] flex flex-col gap-5 items-center">
        <div className="bg-white rounded-2xl shadow-md p-5 flex flex-col justify-start items-center w-[90%] border border-orange-100 text-center gap-2">
          <h1 className="text-xl font-bold text-[#ff4d2d]">
            Welcome, {userData?.user?.fullName}
          </h1>
          <p className="text-[#ff4d2d]">
            <span className="font-semibold">Latitude :</span>{" "}
            {deliveryBoyLocation?.lat ||
              userData?.user?.location?.coordinates?.[1]}
            , <span className="font-semibold">Longitude :</span>
            {deliveryBoyLocation?.lon ||
              userData?.user?.location?.coordinates?.[0]}{" "}
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-5 w-[90%] mb-6 border border-orange-100">
          <h1 className="text-lg font-bold mb-3 text-[#ff4d2d] ">
            Today Deliveries
          </h1>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={todayDeliveries}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" tickFormatter={(h) => `${h}:00`} />
              <YAxis allowDecimals={false} />
              <Tooltip
                formatter={(value) => [value, "orders"]}
                labelFormatter={(label) => `${label}:00`}
              />
              <Bar dataKey="count" fill="#ff4d2d" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 p-4 border rounded-xl bg-gray-50 text-center">
            <h1 className="text-xl font-semibold text-gray-800 mb-2">
              Today's Earnings
            </h1>
            <span className="text-3xl font-bold text-green-600">
              ₹{totalEarings}
            </span>
          </div>
        </div>

        {!currentOrder && (
          <div className="bg-white rounded-2xl shadow-md p-5 w-[90%] mb-6 border border-orange-100">
            <h1 className="text-lg font-bold mb-3 text-[#ff4d2d] ">
              Available Assignments
            </h1>

            <div className="space-y-4">
              {loading ? (
                <p className="text-gray-500 text-sm">Loading assignments...</p>
              ) : availableAssignments.length > 0 ? (
                availableAssignments.map((a, index) => (
                  <div
                    className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                    key={a.assignmentId || index}
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-gray-800">
                          {a?.shopName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {a.items?.length || 0} items • ₹{a.subTotal || 0}
                        </p>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        <span className="font-semibold text-gray-600">
                          Delivery Address:{" "}
                        </span>{" "}
                        {a?.deliveryAddress?.text}
                      </p>
                      {a.items && a.items.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {a.items.map((it, i) => (
                            <span
                              key={i}
                              className="text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded-md"
                            >
                              {it.name || it.item?.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => acceptOrder(a.assignmentId)}
                        disabled={accepting === a.assignmentId}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${accepting === a.assignmentId ? "bg-gray-300 text-gray-700 cursor-not-allowed" : "bg-orange-500 text-white hover:bg-orange-600"}`}
                      >
                        Accept
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm ">No available orders</p>
              )}
            </div>
          </div>
        )}

        {currentOrder && (
          <div className="bg-white rounded-2xl p-5 shadow-md w-[90%] border border-orange-100">
            <h2 className="text-lg font-bold mb-3">📦Current Order</h2>
            <div className="border rounded-lg p-4 mb-3">
              <p className="font-semibold text-sm">
                {currentOrder?.shopOrder.shop.name}
              </p>
              <p className="text-sm text-gray-500">
                {currentOrder.deliveryAddress.text}
              </p>
              <p className="text-xs text-gray-400">
                {currentOrder.shopOrder?.shopOrderItem?.length} items |{" "}
                {currentOrder.shopOrder.subTotal}
              </p>
            </div>
          </div>
        )}

        {currentOrder && (
          <>
            <DeliveryBoyTracking
              data={{
                deliveryBoyLocation: deliveryBoyLocation || {
                  lat: userData?.user?.location.coordinates[1],
                  lon: userData?.user?.location.coordinates[0],
                },
                customerLocation: {
                  lat: currentOrder.deliveryAddress.latitude,
                  lon: currentOrder.deliveryAddress.longitude,
                },
              }}
            />
            {!showOtpBox ? (
              <button
                className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                onClick={sendOtp} disabled={loading}
              >
                {loading? <ClipLoader size={20} color="white"/> :"Mark as Delivered"}
              </button>
            ) : (
              <div className="mt-4 p-4 border rounded-xl bg-gray-50">
                <p className="text-sm font-semibold mb-2">
                  Enter Otp send to{" "}
                  <span className="text-orange-500">
                    {currentOrder.user.fullName}
                  </span>
                </p>
                <input
                  type="text"
                  className="w-full border px-3 py-2 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="Enter OTP"
                  onChange={(e) => setOtp(e.target.value)}
                />
                {message && <p className="text-center text-green-400 text-2xl mb-4">{message}</p>}
                <button
                  className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition-all"
                  onClick={verifyOtp}
                >
                  Submit OTP
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default DeliveryBoy;
