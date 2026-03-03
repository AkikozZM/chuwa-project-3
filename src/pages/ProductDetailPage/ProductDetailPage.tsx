import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, ProductButton, QuantityInput } from "../../components/";
import "./ProductDetailPage.css";
import { findProductAPI } from "../../back-end/APITesting/Product.ts";
import {
  increment,
  decrement,
  setQuantity,
} from "../../features/cart/cartSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  imageUrl?: string;
  upc: string;
}

export const ProductDetailPage: React.FC = () => {
  // Local State
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Redux State
  const dispatch = useAppDispatch();
  const role = useAppSelector((state) => state.authenticate.role);
  const productsInCart = useAppSelector((state) => state.cart.productsInCart);

  useEffect(() => {
    if (!id) return;

    async function loadProduct() {
      setLoading(true);

      // BACKEND (Spring Boot): GET `/api/products/{id}`
      const res = await findProductAPI(id!);

      if (res.success) {
        setProduct(res.data.product as Product);
        setError(null);
      } else {
        console.error(res.error);
        setError("Failed to load product");
      }
      setLoading(false);
    }

    loadProduct();
  }, [id]);

  const handleEditOnClick = () => {
    navigate(`/edit-product?id=${id}`);
  };

  const qty = product ? productsInCart[product._id]?.quantity || 0 : 0;

  if (loading) return <p>Loading product…</p>;
  if (error || !product) return <p>{error ?? "Product not found."}</p>;

  return (
    <div className="product-detail-wapper">
      <h1 className="product-detail-title">Product Detail</h1>
      <Card className="product-detail-card">
        {loading ? (
          <p>Loading product…</p>
        ) : (
          <div className="product-content-container">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="product-detail-image"
            />
            <div className="product-detail-info">
              <p className="product-category">{product.category}</p>
              <h2 className="product-name">{product.name}</h2>
              {product.upc && (
                <p className="product-upc text-sm text-gray-400">UPC: {product.upc}</p>
              )}
              <div className="product-price-status">
                <span className="product-price">${product.price}</span>
                {product.stock <= 0 && (
                  <span className="out-of-stock">Out of Stock</span>
                )}
              </div>
              <p className="product-description">{product.description}</p>
              <div className="flex flex-row gap-5 min-[826px]:w-3/4 mt-6">
                {!productsInCart[product._id] || qty === 0 ? (
                  <ProductButton
                    className="w-1/2"
                    buttonText="Add to Cart"
                    handleClick={() => {
                      dispatch(
                        increment({
                          id: product._id,
                          price: product.price,
                          name: product.name,
                          imageUrl: product.imageUrl,
                        })
                      );
                    }}
                  ></ProductButton>
                ) : (
                  <div className="text-white w-1/2 h-[40px] bg-[#5d30ff] flex items-center justify-center px-2">
                    <ProductButton
                      className="w-1/3 h-full flex items-center justify-center"
                      buttonText="-"
                      handleClick={() => {
                        dispatch(
                          decrement({
                            id: product._id,
                          })
                        );
                      }}
                    ></ProductButton>
                    <QuantityInput
                      value={qty}
                      className="w-1/3 h-full bg-transparent"
                      onChange={(newQty) =>
                        dispatch(
                          setQuantity({ id: product._id, quantity: newQty })
                        )
                      }
                    />
                    {/* <span className="px-4 py-2">{productsInCart[product._id].quantity}</span> */}
                    <ProductButton
                      className="w-1/3 h-full flex items-center justify-center"
                      buttonText="+"
                      handleClick={() => {
                        dispatch(
                          increment({
                            id: product._id,
                            price: product.price,
                            name: product.name,
                            imageUrl: product.imageUrl,
                          })
                        );
                      }}
                    ></ProductButton>
                  </div>
                )}
                {role === "Admin" && (
                  <ProductButton
                    className="w-1/2 !bg-white !border !border-gray-300 !text-gray-600"
                    buttonText="Edit"
                    handleClick={handleEditOnClick}
                  ></ProductButton>
                )}
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
