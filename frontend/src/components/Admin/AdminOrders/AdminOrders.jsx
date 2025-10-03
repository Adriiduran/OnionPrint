import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { useAuth } from '../../../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import useMediaQuery from '@mui/material/useMediaQuery';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { parseCustomDate, formatOrderValue } from '../../../utils/orderUtils';
import { useDebounce } from '../../../hooks/useDebounce';
import { orderColumns } from '../../../constants/tableColumns';


const AdminOrders = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();
    const navigator = useNavigate();
    const isMobile = useMediaQuery('(max-width:767px)');
    
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    const fetchUsers = useCallback(async () => {
        if (!user || !user.uid) {
            setLoading(false);
            return;
        }
        
        setLoading(true);
        setError(null);
        try {
            const ordersData = await axios.get(`${import.meta.env.VITE_API_URL}/orders`, {
                params: {
                    userUid: user.uid,
                }
            });

            const sortedOrders = ordersData.data.sort((a, b) => {
                const dateA = parseCustomDate(a.data.creation_date);
                const dateB = parseCustomDate(b.data.creation_date);
                return dateB - dateA;
            });

            setOrders(sortedOrders);
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            setError('Error al cargar las órdenes. Por favor, inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const filteredOrders = useMemo(() => {
        if (!debouncedSearchTerm.trim()) {
            return orders;
        }

        const searchLower = debouncedSearchTerm.toLowerCase();
        const filtered = orders.filter((order) =>
            order.id.toLowerCase().includes(searchLower) ||
            order.data.state.toLowerCase().includes(searchLower) ||
            order.data.creation_date.toLowerCase().includes(searchLower) ||
            order.data.user.name.toLowerCase().includes(searchLower) ||
            order.data.user.email.toLowerCase().includes(searchLower) ||
            order.data.user.phoneNumber.toLowerCase().includes(searchLower)
        );
        
        return filtered.sort((a, b) => {
            const dateA = parseCustomDate(a.data.creation_date);
            const dateB = parseCustomDate(b.data.creation_date);
            return dateB - dateA;
        });
    }, [orders, debouncedSearchTerm]);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleChangePage = useCallback((event, newPage) => {
        setPage(newPage);
    }, []);

    const handleChangeRowsPerPage = useCallback((event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    }, []);

    const handleRowClick = useCallback((orderId) => {
        navigator(`/admin/orders/${orderId}`);
    }, [navigator]);


    const paginatedOrders = useMemo(() => {
        return filteredOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    }, [filteredOrders, page, rowsPerPage]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <div style={{ textAlign: 'center' }}>
                    <p style={{ color: 'red', marginBottom: '16px' }}>{error}</p>
                    <button 
                        onClick={fetchUsers}
                        style={{ 
                            padding: '8px 16px', 
                            backgroundColor: '#1e0342', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Reintentar
                    </button>
                </div>
            </Box>
        );
    }

    return (
        <div style={{width: '100%'}}>
            <div style={{ display: 'flex', justifyContent: 'start', width: '100%' }}>
                <TextField
                    label="Buscar"
                    value={searchTerm}
                    onChange={handleSearch}
                    sx={{ width: isMobile ? '100%' : '20%', margin: '50px 0px 20px 0px' }}
                />
            </div>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {orderColumns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align="left"
                                        style={{ color: 'white', backgroundColor: '#1e0342' }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedOrders.map((order) => (
                                <TableRow 
                                    hover 
                                    role="checkbox" 
                                    tabIndex={-1} 
                                    key={order.id} 
                                    onClick={() => handleRowClick(order.id)} 
                                    style={{cursor: 'pointer'}}
                                >
                                    {orderColumns.map((column) => {
                                        const value = formatOrderValue(order, column.id);
                                        
                                        return (
                                            <TableCell key={column.id} align="left">
                                                {value}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={filteredOrders.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage={"Filas por página"}
                />
            </Paper>
        </div>

    );
};

const MemoizedAdminOrders = memo(AdminOrders);
MemoizedAdminOrders.displayName = 'AdminOrders';

export default MemoizedAdminOrders;