import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { applyCouponThunk } from "../../features/cart/couponThunk";
import {
  selectProductsInCart,
  selectTotal,
  increment,
  decrement,
  removeFromCart,
  clearCart,
  setQuantity,
} from "../../features/cart/cartSlice";
import { icons } from "../../constants/icons";
import { setLocation, selectUserId, selectIsLogin } from "../../features/authenticate/authenticate";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { computeTax } from "../../utils/taxMap";
import { QuantityInput } from "../../components";
import { resetCoupon, setDiscountTotal } from "../../features/cart/couponSlice";
import { createOrderAPI } from "../../back-end/APITesting/Order.ts";

interface SlidingCartProps {
  onClose: () => void;
}
export const SlidingCart: React.FC<SlidingCartProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const couponCode = useAppSelector((state) => state.coupon.couponCode);
  const discountTotal = useAppSelector((state) => state.coupon.discountTotal);
  const userId = useAppSelector(selectUserId);
  const isLogin = useAppSelector(selectIsLogin);

  const [inputCouponCode, setInputCouponCode] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const productsInCart = useSelector(selectProductsInCart);
  const total = useSelector(selectTotal);
  const cartItems = Object.values(productsInCart);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const latitude = localStorage.getItem("lat");
  const longitude = localStorage.getItem("lng");
  const location = useAppSelector((state) => state.authenticate.location);

  /**
   * Compute Tax Rate
   */
  useEffect(() => {
    if (!latitude || !longitude) {
      console.error("latitude: ", latitude, "  longtitude: ", longitude);
      return;
    }
    const fetchCity = async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );
        const data = await res.json();
        const city = data.address.city;
        dispatch(setLocation(city));
      } catch (error) {
        console.error("fetch city error: ", error);
      }
    };

    fetchCity();
  }, [dispatch, latitude, longitude]);

  const handleApplyCoupon = async () => {
    if (inputCouponCode.trim() === "") {
      alert("Please enter a valid coupon code");
      return;
    }
    const res = await dispatch(
      applyCouponThunk({ couponCode: inputCouponCode.trim(), total })
    );
    if (applyCouponThunk.fulfilled.match(res)) {
      dispatch(setDiscountTotal(res.payload.discountTotal));
      alert("Coupon applied successfully!");
    } else {
      alert("Failed to apply coupon. Please try again.");
    }
    setInputCouponCode("");
  };

  /**
   * Handle after user applied coupon.
   * if user still add items in the cart, coupon discount should be updated
   */
  useEffect(() => {
    if (discountTotal === 0) return;
    dispatch(applyCouponThunk({ couponCode, total }));
  }, [dispatch, couponCode, total, discountTotal]);

  /**
   * Handle when there is no item in the cart, should clear the coupon discount
   */
  useEffect(() => {
    if (totalItems > 0) return;
    dispatch(resetCoupon());
  }, [dispatch, totalItems]);

  const tax = useMemo(() => computeTax(total, location), [total, location]);
  const subtotal = total.toFixed(2);
  const discount = discountTotal.toFixed(2); // Use the state variable for the discount
  //Tax need change by location
  const estimateTotal = (total + tax - parseFloat(discount)).toFixed(2);

  const handleCheckout = async () => {
    if (!isLogin || !userId) {
      onClose();
      navigate("/login");
      return;
    }
    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }
    setCheckoutLoading(true);
    const items = cartItems.map((item) => ({
      productId: item.id,
      name: item.name,
      quantity: item.quantity,
      unitPrice: item.price,
    }));
    const res = await createOrderAPI({
      userId,
      items,
      totalAmount: parseFloat(estimateTotal),
    });
    setCheckoutLoading(false);
    if (res.success) {
      dispatch(clearCart());
      dispatch(resetCoupon());
      onClose();
      navigate(`/orders/${res.data.id}`);
    } else {
      alert(res.error || "Failed to create order.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-end transition-opacity">
      <div className="bg-white w-full sm:max-w-md md:h-200 lg:h-200 md:max-w-lg lg:max-w-xl h-full flex flex-col">
        {/*Cart Header*/}
        <div className="bg-[#5d30ff] text-white p-4 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h2 className="text-3xl font-bold">Cart</h2>
            <p className="font-semi-bold text-sm mt-2">({totalItems})</p>
          </div>

          <div className="flex items-center space-x-1">
            <button
              className="text-white !bg-transparent hover:underline text-sm"
              onClick={() => {
                dispatch(clearCart());
                dispatch(resetCoupon());
              }}
            >
              Clear Cart
            </button>
            <button
              className="text-white !bg-transparent hover:underline font-bold"
              onClick={onClose}
            >
              <span className="text-4xl">{icons.CLOSE}</span>
            </button>
          </div>
        </div>

        {/*Cart Items*/}
        <div className="flex-1 overflow-y-auto p-4 sm:max-h-none md:max-h-96">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between space-x-4 py-4"
            >
              {/* Image */}
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center text-sm text-gray-500">
                  No image
                </div>
              )}
              {/* Name, quantity, remove */}
              <div className="flex flex-col flex-1 justify-between">
                <p className="text-lg font-semibold">{item.name}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <button
                    onClick={() => dispatch(decrement({ id: item.id }))}
                    className="w-6 h-6 rounded-full !bg-transparent border border-gray-300 flex items-center justify-center hover:bg-gray-100 text-sm font-bold"
                  >
                    -
                  </button>
                  <QuantityInput
                    value={item.quantity}
                    onChange={(newQty) =>
                      dispatch(
                        setQuantity({
                          id: item.id,
                          quantity: newQty,
                        })
                      )
                    }
                    className="w-12 h-8 text-center border border-gray-300 rounded"
                  />
                  <button
                    onClick={() =>
                      dispatch(
                        increment({
                          id: item.id,
                          name: item.name,
                          price: item.price,
                          imageUrl: item.imageUrl,
                        })
                      )
                    }
                    className="w-6 h-6 rounded-full !bg-transparent border border-gray-300 flex items-center justify-center hover:bg-gray-100 text-sm font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
              {/* Price */}
              <div className="flex flex-col items-end space-y-2">
                <p className="text-lg font-semibold text-[#5d30ff]">
                  ${item.price.toFixed(2)}
                </p>
                <button
                  onClick={() => {
                    dispatch(removeFromCart({ id: item.id }));
                  }}
                  className="text-gray-500 underline !bg-transparent hover:text-gray-800 transition-colors text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Discount code */}
        <div className="p-4">
          <h3 className="font-semibold mb-2">Apply Discount Code</h3>
          <div className="flex flex-row items-center justify-between space-x-2">
            <input
              type="text"
              placeholder="Enter discount code"
              className="border border-gray-300 px-3 py-2 rounded flex-1"
              onChange={(e) => setInputCouponCode(e.target.value)}
            />
            <button
              disabled={!inputCouponCode.trim()}
              onClick={() => handleApplyCoupon()}
              className="!items-center !justify-between bg-blue-600 text-white p-2 rounded disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Apply
            </button>
          </div>
        </div>

        {/* Cart Footer/Summary */}
        <div className="p-4 border-t">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>${tax}</span>
            </div>
            <div className="flex justify-between">
              <span>Discount</span>
              <span>{parseInt(discount) === 0 ? `$0` : `-$${discount}`}</span>
            </div>
            <div className="flex justify-between">
              <span>Estimate Total</span>
              <span>${estimateTotal}</span>
            </div>
            <button
              className="bg-blue-600 text-white p-2 rounded mt-2 w-full hover:bg-blue-700 transition-colors font-semibold disabled:opacity-60"
              disabled={checkoutLoading || cartItems.length === 0}
              onClick={handleCheckout}
            >
              {checkoutLoading ? "Creating order…" : "Continue to checkout"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
