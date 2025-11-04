import "./dashboard.scss"
import { FaArrowRight } from "react-icons/fa";
function Dashboard() {
    const data = [
        { title: 'Khóa học', quantity: 22, className: 'orange' },
        { title: 'Học viên', quantity: 22, className: 'blue' },
        { title: 'Doanh thu', quantity: '$5000', className: 'yellow' },
        { title: 'Khóa học hoàn thành', quantity: 22, className: 'green' },
    ]
    return (
        <div className="container">
            <div className="row"></div>
            <div className="col-md-12">
                <div className="dashboard">
                    {data.map((item, index) => (
                        <div className={`dashboard-item ${item.className}`} key={index}>
                            <h2>{item.title}</h2>
                            <span className="quantity">{item.quantity}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="col-md-12">
                <div className="dashboard-list">
                    <h2>Các khóa học</h2>
                    <table className="table-course">
                        <thead>
                            <tr>
                                <th>Tên khóa học</th>
                                <th>Giảng viên</th>
                                <th>Thời gian</th>
                                <th>Trạng thái</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Khóa học 1</td>
                                <td>Giảng viên 1</td>
                                <td>10 giờ</td>
                                <td>Đang diễn ra</td>
                                <td>
                                    <button className="btn-edit">Sửa</button>
                                    <button className="btn-delete">Xóa</button>
                                </td>
                            </tr>
                            <tr>
                                <td>Khóa học 2</td>
                                <td>Giảng viên 2</td>
                                <td>8 giờ</td>
                                <td>Hoàn thành</td>
                                <td>
                                    <button className="btn-edit">Sửa</button>
                                    <button className="btn-delete">Xóa</button>
                                </td>
                            </tr>
                            <tr>
                                <td>Khóa học 2</td>
                                <td>Giảng viên 2</td>
                                <td>8 giờ</td>
                                <td>Hoàn thành</td>
                                <td>
                                    <button className="btn-edit">Sửa</button>
                                    <button className="btn-delete">Xóa</button>
                                </td>
                            </tr>
                        </tbody>
                        <span className='view-more'> <a href="/admin">xem thêm <FaArrowRight /></a></span>
                    </table>
                </div>

            </div>
        </div>
    );
}
export default Dashboard;