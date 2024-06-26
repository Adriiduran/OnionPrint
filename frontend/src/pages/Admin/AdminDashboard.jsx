// Dependencies
import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext.jsx';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { useNavigate } from 'react-router-dom';

// Style
import './AdminDashboard.css';

// Components
import AdminNavbar from '../../components/Admin/AdminNavbar/AdminNavbar.jsx';
import AdminHome from '../../components/Admin/AdminHome.jsx';
import AdminUsers from '../../components/Admin/AdminUsers.jsx';
import AdminOrders from '../../components/Admin/AdminOrders/AdminOrders.jsx';
import AdminDiscounts from '../../components/Admin/AdminDiscounts/AdminDiscounts.jsx';
import AdminOrderDetail from '../../components/Admin/AdminOrders/AdminOrderDetail.jsx';

export const PageEnum = {
  HOME: {
    name: 'Inicio',
    url: '/admin/home'
  },
  USERS: {
    name: 'Usuarios',
    url: '/admin/users'
  },
  ORDERS: {
    name: 'Pedidos',
    url: '/admin/orders'
  },
  DISCOUNTS: {
    name: 'Descuentos',
    url: '/admin/discounts'
  }
}

export const AdminDashboard = () => {
  const { isAdmin } = useAuth();
  const [activePage, setActivePage] = useState(PageEnum.HOME.name);
  const [orderId, setOrderId] = useState(null);
  const navigator = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAdmin !== undefined && isAdmin !== null && !isAdmin) {
      navigator('/admin')
    }
  }, [isAdmin, navigator]);

  useEffect(() => {
    if (location.pathname === PageEnum.HOME.url) {
      setActivePage(PageEnum.HOME.name)
      setOrderId(null)
    } else if (location.pathname === PageEnum.USERS.url) {
      setActivePage(PageEnum.USERS.name)
      setOrderId(null)
    } else if (location.pathname === PageEnum.DISCOUNTS.url) {
      setActivePage(PageEnum.DISCOUNTS.name)
      setOrderId(null)
    } else {
      setActivePage(PageEnum.ORDERS.name)
    }
  }, [location]);

  return (
    <div className='admin-dashboard'>
      <AdminNavbar />
      <main className='main'>
        <h1>{activePage}</h1>
        {activePage !== PageEnum.HOME.name && (
          <Breadcrumbs aria-label="breadcrumb">
            <Link to={PageEnum.HOME.url}>{PageEnum.HOME.name}</Link>
            {orderId ? <Link to={PageEnum.ORDERS.url}>{PageEnum.ORDERS.name}</Link> : <Typography color="text.primary">{activePage}</Typography>}
            {orderId && <Typography color="text.primary">{orderId}</Typography>}
          </Breadcrumbs>
        )}
        <Routes>
          <Route path="/home" element={<AdminHome />} />
          <Route path="/users" element={<AdminUsers />} />
          <Route path="/orders" element={<AdminOrders />} />
          <Route path="/orders/:orderId" element={<AdminOrderDetail setOrderId={setOrderId} />} />
          <Route path="/discounts" element={<AdminDiscounts />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminDashboard;
