import ItemCard from "../../components/ItemCard";
import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  setCurrentPage,
  setSortOption,
} from "../../features/products/productSlice";
import PageSelector from "../../components/PageSelector";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchProductsThunk } from "../../features/products/productThunk";

export const HomePage = () => {
  // Redux State Management
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.products.products);
  const currentPage = useAppSelector((state) => state.products.currentPage);
  const sortOption = useAppSelector((state) => state.products.sortOption);
  const search = useAppSelector((state) => state.products.search);
  const loading = useAppSelector((state) => state.products.loading);
  const error = useAppSelector((state) => state.products.error);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleAddProduct = () => {
    navigate("/create-product");
  };

  // When user input on search bar
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      (product.description &&
        product.description.toLowerCase().includes(search.toLowerCase()))
  );

  // Handle sort change
  const handleSortChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const option = e.target.value;
      const page = 1;

      const params = new URLSearchParams(searchParams);
      params.set("sort", option);
      params.set("page", page.toString());
      navigate(`?${params.toString()}`);
      dispatch(setSortOption(option));
      dispatch(setCurrentPage(page));
      dispatch(fetchProductsThunk({ page, sort: option }));
      // Update the page
      window.location.reload();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchParams, navigate, dispatch, currentPage]
  );

  // Fetch product again when user click diffent pages
  useEffect(() => {
    const page = parseInt(searchParams.get("page") || "1");
    const sort = searchParams.get("sort") || "lastAdded";
    dispatch(fetchProductsThunk({ page, sort }));
    dispatch(setCurrentPage(page));
    dispatch(setSortOption(sort));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchParams, sortOption]);

  if (loading) {
    return <div>Loading...</div>;
  }
  // Handle Error at front-end page
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col gap-20 p-6 w-full h-full ">
      <div className="flex flex-col justify-between items-center w-full h-full md:flex-row lg:flex-row">
        {/* Put on left */}
        <div className="text-3xl font-bold py-4 md:py-0 lg:py-0">Products</div>

        {/* Put on right */}
        <div className=" flex flex-row gap-5">
          <div className="flex items-center gap-2">
            <select
              value={sortOption}
              onChange={handleSortChange}
              className="border rounded-md px-3 py-2.5 text-gray-700 font-semibold"
            >
              <option value="lastAdded">Last added</option>
              <option value="priceUp">Price: low to high</option>
              <option value="priceDown">Price: high to low</option>
            </select>
          </div>
          <div>
            <button onClick={handleAddProduct} className="text-white">
              Add Product
            </button>
          </div>
        </div>
      </div>
      {/* Show message if no products match search */}
      {filteredProducts.length === 0 && search && (
        <div className="text-center text-lg">
          No products found matching "{search}"
        </div>
      )}

      {/* Item Card */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        {filteredProducts.map((item) => (
          <ItemCard key={item._id.toString()} product={item} />
        ))}
      </div>

      {/* Page Selector */}
      <PageSelector />
    </div>
  );
};
