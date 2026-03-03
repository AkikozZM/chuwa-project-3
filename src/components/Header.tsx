import { Link } from "react-router-dom";
import "./Layout.css";
import { icons } from "../constants/icons";
import AuthButton from "./AuthButton";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { setSearch } from "../features/products/productSlice";
import { openCart, closeCart } from "../features/cart/cartSlice";
import { selectIsLogin, selectRole } from "../features/authenticate/authenticate";
import { SlidingCart } from "../pages/SlidingCart";
import { useCallback } from "react";

/**
 * TODO:
 * 1. link auth with the header -useicons/signin->log out
 * 2. link with redux reducer
 */
const Header = () => {
  const isCartOpen = useAppSelector((state) => state.cart.isOpen);
  const isLogin = useAppSelector(selectIsLogin);
  const role = useAppSelector(selectRole);
  const ordersLabel = role === "Admin" ? "All Orders" : "My Orders";
  const dispatch = useAppDispatch();
  const total = useAppSelector((state) => state.cart.total);
  const search = useAppSelector((state) => state.products.search);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setSearch(e.target.value));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [search]
  );

  return (
    <>
      <header className="header">
        <div className="header-content">
          {/* mobile version */}
          <div className="header-mobile">
            <div className="header-top-mobile">
              <div className="header-content-logo">
                <Link to="/">
                  {/*Desktop*/}
                  <div className="logo-desktop">
                    <h1 className="management-title">Management</h1>
                    <h5 className="chuwa-subtitle">Chuwa</h5>
                  </div>
                  {/*Mobile*/}
                  <div className="logo-mobile">
                    <h1 className="management-title">M</h1>
                    <h5 className="chuwa-subtitle">Chuwa</h5>
                  </div>
                </Link>
              </div>
              <div className="header-actions">
                {isLogin && (
                  <Link
                    to="/orders"
                    className="flex items-center text-white font-medium hover:text-purple-300 transition mr-2"
                  >
                    {ordersLabel}
                  </Link>
                )}
                <AuthButton />
                <button
                  className="cart-button"
                  onClick={() => dispatch(openCart())}
                >
                  {icons.CART}
                  <span className="cart-amount">${(Math.abs(total)).toFixed(2)}</span>
                </button>
              </div>
            </div>
            <div className="header-search">
              <input
                value={search}
                onChange={handleSearchChange}
                type="text"
                placeholder="Search"
                className="search-input"
              />
              <button className="search-button" type="button">
                {icons.SEARCH}
              </button>
            </div>
          </div>

          {/* desktop version */}
          <div className="header-desktop">
            <div className="header-content-logo">
              <Link to="/">
                {/*Desktop*/}
                <div className="logo-desktop">
                  <h1 className="management-title">Management</h1>
                  <h5 className="chuwa-subtitle">Chuwa</h5>
                </div>
                {/*Mobile*/}
                <div className="logo-mobile">
                  <h1 className="management-title">M</h1>
                  <h5 className="chuwa-subtitle">Chuwa</h5>
                </div>
              </Link>
            </div>
            <div className="header-search">
              <input
                value={search}
                onChange={handleSearchChange}
                placeholder="Search"
                className="search-input"
              />
              <button className="search-button" type="button">
                {icons.SEARCH}
              </button>
            </div>
            <div className="header-actions">
              {isLogin && (
                <Link
                  to="/orders"
                  className="flex items-center text-white font-medium hover:text-purple-300 transition mr-2"
                >
                  {ordersLabel}
                </Link>
              )}
              <AuthButton />
              <button
                className="cart-button"
                onClick={() => dispatch(openCart())}
              >
                {icons.CART}
                <span className="cart-amount">
                  ${(Math.abs(total)).toFixed(2)}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>
      {isCartOpen && (
        <SlidingCart
          onClose={() => {
            dispatch(closeCart());
          }}
        />
      )}
    </>
  );
};

export default Header;
