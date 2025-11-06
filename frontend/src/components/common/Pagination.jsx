import React from "react";

function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;

    return (
        <div className="pagination-wrapper">
            <button
                className="pagination-btn"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                Trước
            </button>

            {[...Array(totalPages)].map((_, i) => (
                <button
                    key={i + 1}
                    className={`pagination-btn ${currentPage === i + 1 ? "active" : ""}`}
                    onClick={() => onPageChange(i + 1)}
                >
                    {i + 1}
                </button>
            ))}

            <button
                className="pagination-btn"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                Sau
            </button>
        </div>
    );
}

export default Pagination;