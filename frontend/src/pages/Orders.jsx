import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI } from '../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getOrders();
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'assigned':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📦</div>
          <p className="text-xl text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold">📦 My Orders</h1>
            <button
              onClick={() => navigate('/')}
              className="bg-white text-orange-500 px-6 py-2 rounded-full font-semibold hover:bg-orange-100 transition"
            >
              ← Back to Shop
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              No orders yet
            </h2>
            <button
              onClick={() => navigate('/')}
              className="bg-orange-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-orange-600 transition"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">
                      Order #{order.id}
                    </h3>
                    <p className="text-gray-600">
                      {new Date(order.created_at).toLocaleDateString('en-KE', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <span
                    className={`px-4 py-2 rounded-full font-semibold ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-gray-600">
                      <strong>Delivery Location:</strong>
                    </p>
                    <p className="text-gray-800">{order.delivery_location}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">
                      <strong>Payment Method:</strong>
                    </p>
                    <p className="text-gray-800">{order.payment_method}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">
                      <strong>Transaction ID:</strong>
                    </p>
                    <p className="text-gray-800">{order.transaction_id}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">
                      <strong>Payment Status:</strong>
                    </p>
                    <p className="text-green-600 font-semibold">
                      {order.payment_status}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg mb-2">
                    <span className="text-gray-600">Products Total:</span>
                    <span className="font-bold">
                      KES {order.total_products_price}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg mb-2">
                    <span className="text-gray-600">Delivery Fee:</span>
                    <span className="font-bold">KES {order.delivery_fee}</span>
                  </div>
                  <div className="flex justify-between text-xl border-t pt-2">
                    <span className="font-bold">Total:</span>
                    <span className="font-bold text-orange-500">
                      KES {order.total_price}
                    </span>
                  </div>
                </div>

                {order.delivered_at && (
                  <div className="mt-4 bg-green-50 p-4 rounded-lg">
                    <p className="text-green-800 font-semibold">
                      ✅ Delivered on{' '}
                      {new Date(order.delivered_at).toLocaleDateString('en-KE', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;