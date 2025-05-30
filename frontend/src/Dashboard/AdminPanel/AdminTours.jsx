import React, { useState, useEffect } from "react";
import useFetch from "../../hooks/useFetch";
import BASE_URL from "../../utils/config";
import AdminToursCards from "../../shared/AdminToursCards";

const AdminTours = () => {
  // const {apiData: tours} = useFetch(`${BASE_URL}/tour`); // Original commented out
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(0);
  // Corrected URL to fetch all tours for admin
  const {
    apiData: tours,
    error,
    loading,
  } = useFetch(`${BASE_URL}/tours?page=${page}`);

  useEffect(() => {
    // Assuming the backend sends totalPages or similar to help set pageCount
    // For now, this is a placeholder. You might need to adjust based on API response.
    if (tours && tours.totalPages) {
      // Or however your API returns total pages/count
      setPageCount(tours.totalPages);
    }
  }, [tours]);

  return (
    <div className="py-8 px-2 md:px-5 lg:px-8 w-full">
      <div className="flex flex-col gap-5 overflow-x-scroll">
        <table className="table-auto gap-4 border-collapse border w-[120%] md:w-full">
          <thead className="w-full py-2">
            <tr>
              <th></th>
              <th className="tableData text-start">Title</th>
              <th className="tableData">City</th>
              <th className="tableData">Featured</th>
              <th className="tableData">maxPeople</th>
              <th className="tableData">Reviews</th>
            </tr>
          </thead>
          {tours?.map(tour => (
            <AdminToursCards tour={tour} key={tour._id} />
          ))}
        </table>
      </div>
      <div className="flex pagination items-center justify-center mt-8 gap-3">
        {pageCount &&
          [...Array(pageCount).keys()].map(number => (
            <span
              key={number}
              onClick={() => setPage(number)}
              className={page === number ? 'active_page' : 'spn'}
            >
              {number + 1}
            </span>
          ))}
      </div>
    </div>
  );
};

export default AdminTours;
