import { useNavigate } from "react-router-dom";
import type { IProduct } from "../back-end/models/Product.ts";
import { increment, decrement, setQuantity } from "../features/cart/cartSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { ProductButton, QuantityInput } from "../components";
import React from "react";

interface Props {
  product: IProduct;
}

const ItemCard = ({ product }: Props) => {
  const navigate = useNavigate();
  const handleItemOnClick = () => {
    navigate(`/product/${product._id}`);
  };
  const handleEditOnClick = () => {
    navigate(`/edit-product?id=${product._id}`);
  };
  const id = product._id.toString();
  const dispatch = useAppDispatch();
  const role = useAppSelector((state) => state.authenticate.role);
  const productsInCart = useAppSelector((state) => state.cart.productsInCart);

  return (
    <div className="border border-gray-300 rounded-lg py-6 px-4 flex flex-col justify-between">
      <div className="w-full h-48 bg-gray-100 rounded-t-lg mb-4 overflow-hidden cursor-pointer">
        <img
          onClick={handleItemOnClick}
          src={
            product.imageUrl === "/"
              ? "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone11-select-2019-family?wid=882&hei=1058&fmt=jpeg&qlt=90&.v=1567022175704"
              : product.imageUrl
          }
          alt={product.name}
          className="w-full h-full object-contain"
        />
      </div>
      <div className="flex flex-col">
        <div className="text-gray-600">{product.name}</div>
        <div className="text-lg font-bold py-1">${product.price}</div>
        <div className="flex flex-col min-[1771px]:flex-row justify-between gap-1 w-full">
          {!productsInCart[id] || productsInCart[id].quantity === 0 ? (
            <ProductButton
              buttonText="Add"
              className="!flex-1 text-white !h-auto"
              handleClick={() =>
                dispatch(
                  increment({
                    id: id,
                    name: product.name,
                    price: product.price,
                    imageUrl: product.imageUrl,
                  })
                )
              }
            ></ProductButton>
          ) : (
            <div className="flex flex-row  flex-wrap justify-between items-center flex-1 border rounded border-gray-300 bg-[#5d30ff] text-white px-4">
              <ProductButton
                buttonText="-"
                className="!flex-1 min-w-0 bg-[#5d30ff]"
                handleClick={() => dispatch(decrement({ id: id }))}
              />
              <QuantityInput
                value={productsInCart[id].quantity}
                onChange={(newQty) => {
                  if (newQty >= 0) {
                    dispatch(setQuantity({ id: id, quantity: newQty }));
                  }
                }}
                className="!flex-1 min-w-0 bg-[#5d30ff] text-white text-center"
              />
              <ProductButton
                buttonText="+"
                className="!flex-1 min-w-0 bg-[#5d30ff]"
                handleClick={() =>
                  dispatch(
                    increment({
                      id: id,
                      name: product.name,
                      price: product.price,
                      imageUrl: product.imageUrl,
                    })
                  )
                }
              />
            </div>
          )}
          {role === "Admin" && (
            <button
              onClick={handleEditOnClick}
              className="!bg-white !border !border-gray-300 !flex-1"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(ItemCard);
