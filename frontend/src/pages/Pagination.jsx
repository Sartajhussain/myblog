import React from "react";

const Pagination = ({ currentPage, totalPages, setCurrentPage }) => {
  return (
    <div className="flex justify-center mt-10 gap-3">

      <button
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(currentPage - 1)}
        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-sm disabled:opacity-50"
      >
        Prev
      </button>

      <span className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
        Page {currentPage} of {totalPages}
      </span>

      <button
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage(currentPage + 1)}
        className="px-4 py-2 bg-black text-white rounded-lg text-sm disabled:opacity-50"
      >
        Next
      </button>

    </div>
  );
};

export default Pagination;