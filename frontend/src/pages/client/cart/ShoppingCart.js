import React, { useState } from "react";
import { Trash2, Tag } from "lucide-react";
import "./ShoppingCart.css";
import post1 from "../../../assets/images/post1.png";

export default function ShoppingCart() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Khóa Học Đầu Tư Chứng Khoán Cho Người Mới Bắt Đầu",
      image: post1,
      price: 500000,
      quantity: 1,
    },
    {
      id: 2,
      name: "Khóa Học Về Mua Bán Xe Ô Tô Cũ Chuyên Nghiệp",
      image:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&h=60&fit=crop",
      price: 750000,
      quantity: 1,
    },
    {
      id: 3,
      name: "Combo 3 Khóa Học Marketing Online ",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=100&h=60&fit=crop",
      price: 1200000,
      quantity: 1,
    },
    {
      id: 4,
      name: "Khóa Học GPT Custom - Viết Kịch Bản Video Quảng Cáo Bằng Ai",
      image:
        "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=100&h=60&fit=crop",
      price: 650000,
      quantity: 1,
    },
    {
      id: 5,
      name: "Khóa Học Huấn Luyện & Sử Dụng Chat GPT Cho Người Mới Bắt Đầu",
      image:
        "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=100&h=60&fit=crop",
      price: 850000,
      quantity: 1,
    },
    {
      id: 6,
      name: "Khóa Học Huấn Luyện & Sử Dụng Chat GPT Cho Người Mới Bắt Đầu",
      image:
        "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=100&h=60&fit=crop",
      price: 850000,
      quantity: 1,
    },
    {
      id: 7,
      name: "Khóa Học Huấn Luyện & Sử Dụng Chat GPT Cho Người Mới Bắt Đầu",
      image:
        "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=100&h=60&fit=crop",
      price: 850000,
      quantity: 1,
    },
    {
      id: 8,
      name: "Khóa Học Huấn Luyện & Sử Dụng Chat GPT Cho Người Mới Bắt Đầu",
      image:
        "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=100&h=60&fit=crop",
      price: 850000,
      quantity: 1,
    },
  ]);

  const [discountCode, setDiscountCode] = useState("");
  const taxRate = 0;

  const updateQuantity = (id, change) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const handleQuantityChange = (id, newQuantity) => {
    const qty = parseInt(newQuantity, 10);
    if (isNaN(qty) || qty < 1) {
      if (newQuantity === "") {
        setCartItems((items) =>
          items.map((item) =>
            item.id === id ? { ...item, quantity: "" } : item
          )
        );
      } else {
        setCartItems((items) =>
          items.map((item) =>
            item.id === id ? { ...item, quantity: 1 } : item
          )
        );
      }
      return;
    }

    setCartItems((items) =>
      items.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
    );
  };

  const removeItem = (id) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => {
    const qty = typeof item.quantity === "number" ? item.quantity : 0;
    return sum + item.price * qty;
  }, 0);

  const total = subtotal * (1 + taxRate);

  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN") + "đ";
  };

  return (
    <div className="shopping-cart-page">
      <div className="container">
        <h1 className="page-title">GIỎ HÀNG</h1>

        <div className="cart-layout">
          <div className="products-section">
            <div className="products-table">
              <div className="table-header">
                <div className="col-product">SẢN PHẨM</div>
                <div className="col-price">GIÁ</div>
                <div className="col-quantity">SỐ LƯỢNG</div>
                <div className="col-total">TẠM TÍNH</div>
              </div>

              {cartItems.map((item) => (
                <div key={item.id} className="product-row">
                  <div className="col-product">
                    <button
                      className="btn-remove"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="product-image"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://placehold.co/80x50/cccccc/333333?text=COURSE";
                      }}
                    />
                    <span className="product-name">{item.name}</span>
                  </div>

                  <div className="col-price">{formatPrice(item.price)}</div>

                  <div className="col-quantity">
                    <div className="quantity-control">
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.id, -1)}
                      >
                        −
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(item.id, e.target.value)
                        }
                        onBlur={(e) => {
                          if (
                            e.target.value === "" ||
                            parseInt(e.target.value, 10) < 1
                          ) {
                            handleQuantityChange(item.id, 1);
                          }
                        }}
                        min="1"
                        className="qty-input"
                      />
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="col-total">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <button className="btn-continue">← Tiếp tục xem sản phẩm</button>
          </div>

          <div className="summary-section">
            <div className="summary-box">
              <h2 className="summary-title">TỔNG CỘNG GIỎ HÀNG</h2>

              <div className="summary-row">
                <span>Tạm tính</span>
                <span className="summary-value">{formatPrice(subtotal)}</span>
              </div>

              <div className="summary-row total-row">
                <span>Tổng</span>
                <span className="summary-value final-total">
                  {formatPrice(total)}
                </span>
              </div>

              <button className="btn-checkout">Tiến hành thanh toán</button>

              <div className="discount-section">
                <div className="discount-header-label">
                  <Tag size={20} className="discount-icon" />
                  <span>Nhập mã giảm giá</span>
                </div>

                <div className="discount-input-group">
                  <input
                    type="text"
                    placeholder="Nhập mã giảm giá"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    className="discount-input"
                  />
                  <button className="btn-select-coupon">Chọn mã</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
