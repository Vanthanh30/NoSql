import React from "react";
import "./OrderConfirmation.scss";
import { useNavigate } from "react-router-dom";

export default function OrderConfirmation() {
  const navigate = useNavigate();

  const orderDetails = {
    orderId: "2023097",
    date: "17/10/2025",
    email: "phucthienhsh@gmail.com",

    subtotal: 1750000,
    discount: 250000,

    items: [
      {
        name: "Khóa Học Huấn Luyện & Sử Dụng ChatGPT Cho Người Mới Bắt Đầu",
        quantity: 1,
        price: 1000000,
      },
      {
        name: "Share Miễn Phí Bộ Khóa Học Ielts Online Kiếm Luyện",
        quantity: 1,
        price: 750000,
      },
    ],
  };

  orderDetails.total = orderDetails.subtotal - orderDetails.discount;
  if (orderDetails.total < 0) orderDetails.total = 0;

  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN") + "đ";
  };

  const handleGoToCourses = () => {
    navigate("/my-courses");
  };

  return (
    <div className="confirmation-page">
      <div className="container">
        <div className="confirmation-header">
          <h1 className="page-title">THANH TOÁN</h1>
          <p className="thank-you-message">
            Cảm ơn bạn. Đơn hàng của bạn đã được nhận.
          </p>
        </div>

        <div className="confirmation-content-wrapper">
          <div className="order-info-section">
            <ul>
              <li>Mã đơn hàng: {orderDetails.orderId}</li>
              <li>Ngày: {orderDetails.date}</li>
              <li>Email: {orderDetails.email}</li>
              <li>Tổng cộng: {formatPrice(orderDetails.total)}</li>
            </ul>
          </div>

          <div className="order-details-section">
            <h2 className="section-title">CHI TIẾT ĐƠN HÀNG</h2>

            <div className="order-table">
              <div className="table-header">
                <span className="product-col">SẢN PHẨM</span>
                <span className="total-col text-right">TỔNG</span>
              </div>

              <div className="order-items">
                {orderDetails.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <div className="item-name">
                      {item.name} × {item.quantity}
                    </div>
                    <div className="item-total text-right">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-summary">
              <div className="summary-row">
                <span className="summary-label">Tổng</span>
                <span className="summary-value text-right">
                  {formatPrice(orderDetails.subtotal)}
                </span>
              </div>

              <div className="summary-row discount-row">
                <span className="summary-label">Giảm giá</span>
                <span className="summary-value discount-value text-right">
                  - {formatPrice(orderDetails.discount)}
                </span>
              </div>

              <div className="summary-row summary-total-row">
                <span className="summary-label">Tổng cộng</span>
                <span className="summary-total-value text-right">
                  {formatPrice(orderDetails.total)}
                </span>
              </div>
            </div>

            <div className="order-actions">
              <button className="btn-action" onClick={handleGoToCourses}>
                VÀO KHÓA HỌC CỦA TÔI
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
