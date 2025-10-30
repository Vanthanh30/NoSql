import React, { useState } from "react";
import "./Checkout.scss";

export default function Checkout() {
  const [formData, setFormData] = useState({
    fullName: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    note: "",
  });

  const orderItems = [
    {
      id: 1,
      name: "Khóa Học Về Mua Bán Xe Ô Tô Cũ Chuyên Nghiệp",
      quantity: 1,
      price: 450000,
    },
    {
      id: 2,
      name: "Combo 3 Khóa Học Marketing Online",
      quantity: 1,
      price: 650000,
    },
    {
      id: 3,
      name: "Khóa Học Đầu Tư Chứng Khoán Cho Người Mới Bắt Đầu",
      quantity: 1,
      price: 850000,
    },
    {
      id: 4,
      name: "Khóa Học GPT Custom - Viết Kịch Bản Video Quảng Cáo Bằng Ai",
      quantity: 1,
      price: 450000,
    },
  ];

  const DISCOUNT_AMOUNT = 100000;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const total = subtotal - DISCOUNT_AMOUNT;

  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN") + "đ";
  };

  const formatDiscount = (amount) => {
    return "-" + amount.toLocaleString("vi-VN") + "đ";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert(`Đặt hàng thành công! Tổng cộng: ${formatPrice(total)}`);
  };

  return (
    <div className="checkout-page">
      <div className="container">
        <h1 className="page-title">THANH TOÁN</h1>
        <p className="page-subtitle">
          Bạn có mã giảm giá?{" "}
          <a href="#" className="link-coupon">
            Bấm vào đây để nhập mã
          </a>
        </p>

        <form className="checkout-layout" onSubmit={handleSubmit}>
          <div className="billing-section">
            <h2 className="section-title">THÔNG TIN THANH TOÁN</h2>

            <div className="form-group">
              <label className="form-label">
                Họ và Tên <span className="required">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Địa chỉ email <span className="required">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Ghi chú đơn hàng (tùy chọn)</label>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleInputChange}
                className="form-textarea"
                rows="4"
                placeholder="Ghi chú về đơn hàng, ví dụ: các yêu cầu đặc biệt."
              ></textarea>
            </div>
          </div>

          <div className="order-section">
            <div className="order-box">
              <h2 className="section-title">ĐƠN HÀNG CỦA BẠN</h2>

              <div className="order-header">
                <span className="order-header-title">SẢN PHẨM</span>
                <span className="order-header-title text-right">TẠM TÍNH</span>
              </div>

              <div className="order-items">
                {orderItems.map((item) => (
                  <div key={item.id} className="order-item">
                    <div className="item-info">
                      <span className="item-name">{item.name}</span>
                      <span className="item-quantity">× {item.quantity}</span>
                    </div>
                    <div className="item-price">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-summary">
                <div className="summary-row">
                  <span>Tạm tính</span>
                  <span className="summary-value">{formatPrice(subtotal)}</span>
                </div>

                <div className="summary-row discount-row">
                  <span>Giảm giá</span>
                  <span className="summary-value discount-value">
                    {formatDiscount(DISCOUNT_AMOUNT)}
                  </span>
                </div>

                <div className="summary-row summary-total">
                  <span>Tổng cộng</span>
                  <span className="summary-total-value">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              <button type="submit" className="btn-order">
                ĐẶT HÀNG
              </button>

              <p className="order-note">
                Thông tin cá nhân của bạn sẽ được sử dụng để xử lý đơn hàng,
                tăng trải nghiệm sử dụng website, và cho các mục đích cụ thể
                khác đã được mô tả trong <a href="#">chính sách riêng tư</a>.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
