import React, { useState, useEffect } from 'react';
import "./Orders.css";
import { toast } from 'react-toastify';
import axios from "axios";
import { assets } from '../../assets/assets';

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);

  // Fetch Orders from API
  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(`${url}/api/order/list`);
      if (response.data.success) {
        setOrders(response.data.data);
        console.log(response.data.data);
      } else {
        toast.error("Error fetching orders");
      }
    } catch (error) {
      toast.error("Server error: Unable to fetch orders");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  // Handle Order Status Change
  const statusHandler = async (event, orderId) => {
    try {
      const newStatus = event.target.value;
      const response = await axios.post(`${url}/api/order/status`, {
        orderId,
        status: newStatus
      });

      if (response.data.success) {
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      toast.error("Error updating order status");
      console.error(error);
    }
  };

  return (
    <div className='order add'>
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.length === 0 ? (
          <p>No orders available.</p>
        ) : (
          orders.map((order, index) => (
            <div key={order._id} className='order-item'>
              <img src={assets.parcel_icon} alt='Parcel Icon' />

              <div>
                <p className='order-item-food'>
                  {order.items.map(item => `${item.name} x${item.quantity}`).join(", ")}
                </p>

                <p className='order-item-name'>
                  {order.address ? `${order.address.firstName} ${order.address.lastName}` : "Address not available"}
                </p>

                <div className="order-item-address">
                  <p>{order.address?.street || "Street not available"}</p>
                  <p>{order.address?.city ? `${order.address.city},` : "City not available"}</p>
                  <p>{order.address?.state ? `${order.address.state},` : "State not available"}</p>
                  <p>{order.address?.country ? `${order.address.country},` : "Country not available"}</p>
                  <p>{order.address?.zipcode || "Zipcode not available"}</p>
                </div>

                <p className='order-item-phone'>{order.address?.phone || "Phone not available"}</p>
              </div>

              <p>Items: {order.items.length}</p>
              <p>${order.amount}</p>

              <select onChange={(event) => statusHandler(event, order._id)} value={order.status}>
                <option value="Food Processing">Food Processing</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;
