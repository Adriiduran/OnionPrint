import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import useMediaQuery from '@mui/material/useMediaQuery';
import Chip from '@mui/material/Chip';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext.jsx';
import { parseCustomDate, formatOrderValue } from '../../utils/orderUtils.js';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PendingIcon from '@mui/icons-material/Pending';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ReceiptIcon from '@mui/icons-material/Receipt';

export default function AdminHome() {
	const { user } = useAuth();
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const isMobile = useMediaQuery('(max-width:767px)');
	const navigate = useNavigate();

	useEffect(() => {
		const fetchOrders = async () => {
			if (!user || !user.uid) {
				setLoading(false);
				return;
			}
			setLoading(true);
			setError(null);
			try {
				const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/orders`, {
					params: { userUid: user.uid }
				});
				setOrders(data || []);
			} catch (e) {
				console.error('Error al obtener órdenes:', e);
				setError('No se pudo cargar el resumen.');
			} finally {
				setLoading(false);
			}
		};
		fetchOrders();
	}, [user]);

		const metrics = useMemo(() => {
		if (!orders || orders.length === 0) {
			return {
				total: 0,
				nuevosHoy: 0,
				pendientes: 0,
				enviados: 0,
				ingresos7d: 0,
				recentOrders: []
			};
		}

		const now = new Date();
		const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
		const last7Days = [...Array(7)].map((_, i) => {
			const d = new Date();
			d.setDate(d.getDate() - (6 - i));
			return new Date(d.getFullYear(), d.getMonth(), d.getDate());
		});

		let nuevosHoy = 0;
		let pendientes = 0;
		let enviados = 0;
		let ingresos7d = 0;
		const dailyTotals = last7Days.map(() => 0);

		const sortedOrders = [...orders].sort((a, b) => {
			const dateA = parseCustomDate(a?.data?.creation_date);
			const dateB = parseCustomDate(b?.data?.creation_date);
			return dateB - dateA;
		});

		orders.forEach((order) => {
			const created = parseCustomDate(order?.data?.creation_date);
			const state = order?.data?.state;
			const finalPrice = Number(order?.data?.finalPrice || 0);

			if (created >= startOfToday) {
				nuevosHoy += 1;
			}
			if (state === 'recived' || state === 'accepted') {
				pendientes += 1;
			}
			if (state === 'delivered') {
				enviados += 1;
			}

			last7Days.forEach((dayStart, idx) => {
				const dayEnd = new Date(dayStart);
				dayEnd.setDate(dayEnd.getDate() + 1);
				if (created >= dayStart && created < dayEnd) {
					if (state === 'accepted' || state === 'delivered' || state === 'completed') {
						dailyTotals[idx] += finalPrice;
					}
				}
			});
		});

		ingresos7d = dailyTotals.reduce((a, b) => a + b, 0);

		return {
			total: orders.length,
			nuevosHoy,
			pendientes,
			enviados,
			ingresos7d,
			recentOrders: sortedOrders.slice(0, 5)
		};
	}, [orders]);


	if (loading) {
		return (
			<Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
				<CircularProgress />
			</Box>
		);
	}

	if (error) {
		return (
			<Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
				<Typography color="error">{error}</Typography>
			</Box>
		);
	}

	return (
		<Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
			<Grid container spacing={2}>
				<Grid item xs={12} sm={6} md={3}>
					<Paper sx={{ p: 2, textAlign: 'center' }}>
						<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
							<ShoppingCartIcon sx={{ fontSize: 20, color: '#1976d2' }} />
							<Typography variant="overline" color="text.secondary">Pedidos hoy</Typography>
						</Box>
						<Typography variant={isMobile ? 'h5' : 'h4'}>{metrics.nuevosHoy}</Typography>
					</Paper>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<Paper sx={{ p: 2, textAlign: 'center' }}>
						<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
							<PendingIcon sx={{ fontSize: 20, color: '#f57c00' }} />
							<Typography variant="overline" color="text.secondary">Pendientes</Typography>
						</Box>
						<Typography variant={isMobile ? 'h5' : 'h4'}>{metrics.pendientes}</Typography>
					</Paper>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<Paper sx={{ p: 2, textAlign: 'center' }}>
						<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
							<LocalShippingIcon sx={{ fontSize: 20, color: '#388e3c' }} />
							<Typography variant="overline" color="text.secondary">Enviados</Typography>
						</Box>
						<Typography variant={isMobile ? 'h5' : 'h4'}>{metrics.enviados}</Typography>
					</Paper>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<Paper sx={{ p: 2, textAlign: 'center' }}>
						<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
							<AttachMoneyIcon sx={{ fontSize: 20, color: '#7b1fa2' }} />
							<Typography variant="overline" color="text.secondary">Ingresos 7 días</Typography>
						</Box>
						<Typography variant={isMobile ? 'h5' : 'h4'}>{metrics.ingresos7d.toFixed(2)}€</Typography>
					</Paper>
				</Grid>
			</Grid>

			<Grid container spacing={2}>
				<Grid item xs={12} md={6}>
					<Paper sx={{ p: 2 }}>
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
							<ReceiptIcon sx={{ color: '#1e0342' }} />
							<Typography variant="h6">Últimos pedidos</Typography>
						</Box>
						<List dense>
							{metrics.recentOrders.map((order, index) => (
								<div key={order.id}>
									<ListItem 
										sx={{ 
											px: 0, 
											cursor: 'pointer',
											'&:hover': {
												backgroundColor: 'rgba(0, 0, 0, 0.04)'
											}
										}}
										onClick={() => navigate(`/admin/orders/${order.id}`)}
									>
										<ListItemText
											primary={`${order.id}`}
											secondary={`${formatOrderValue(order, 'state')} - ${formatOrderValue(order, 'finalPrice')}`}
										/>
										<Chip 
											label={formatOrderValue(order, 'state')} 
											size="small"
											color={order.data.state === 'recived' ? 'warning' : 
												order.data.state === 'accepted' ? 'info' : 
												order.data.state === 'delivered' ? 'success' : 'default'}
										/>
									</ListItem>
									{index < metrics.recentOrders.length - 1 && <Divider />}
								</div>
							))}
						</List>
					</Paper>
				</Grid>
			</Grid>
		</Box>
	);
}