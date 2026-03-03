import { icons } from "../constants/icons";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { setCurrentPage } from "../features/products/productSlice";
import { useNavigate, useSearchParams } from "react-router-dom";

const PageSelector = () => {
  // Redux State Management
  const dispatch = useAppDispatch();
  const currentPage = useAppSelector((state) => state.products.currentPage);
  const totalPages = useAppSelector((state) => state.products.totalPages);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // When user click a page, set current page to the new page
  const handlePageChange = (page: number) => {
    // Base case check
    if (page >= 1 && page <= totalPages) {
      // Update URL
      const params = new URLSearchParams(searchParams);
      params.set("page", page.toString());
      navigate(`?${params.toString()}`);
      // Update state
      dispatch(setCurrentPage(page));
      // Update the page
      window.location.reload();
    }
  };

  return (
    <>
      <div className="flex flex-row gap-2 items-center sm:justify-center lg:justify-end">
        <button
          className="!bg-white"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          {icons.LEFT_ARROW}
        </button>

        {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
          let pageNum;
          // When page is less than 5, just show all the pages 1, 2, 3,..., 5
          if (totalPages <= 5) {
            pageNum = i + 1;
          }
          // When current selected page is close to start
          else if (currentPage <= 3) {
            pageNum = i + 1;
          }
          // When current selected page is close to end
          else if (currentPage >= totalPages - 2) {
            pageNum = totalPages - 4 + i;
          }
          // When current selected page is in middle, show: 2,3,[4],5,6
          else {
            pageNum = currentPage - 2 + i;
          }

          return (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              className={`px-4 py-2 border rounded ${
                currentPage === pageNum ? "!text-white" : "!bg-white"
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          className="!bg-white"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          {icons.RIGHT_ARROW}
        </button>
      </div>
    </>
  );
};

export default PageSelector;
