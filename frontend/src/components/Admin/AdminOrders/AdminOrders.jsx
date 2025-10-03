import { useState, useEffect, useCallback } from 'react';
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

const columns = [
    { id: 'id', label: 'ID'},
    { id: 'finalPrice', label: 'Precio final'},
    { id: 'billingMethod', label: 'Método de pago'},
    { id: 'creation_date', label: 'Fecha de creación'},
    { id: 'shipping', label: 'Tipo de envío'},
    { id: 'state', label: 'Estado'},
];

export default function AdminOrders() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useAuth();
    const navigator = useNavigate();
    const isMobile = useMediaQuery('(max-width:767px)');
    const parseCustomDate = (dateString) => {
        if (!dateString) return new Date(0);
        
        const parts = dateString.split(', ');
        if (parts.length !== 2) return new Date(0);
        
        const [datePart, timePart] = parts;
        const [day, month, year] = datePart.split('/');
        const [hours, minutes, seconds] = timePart.split(':');
        
        const isoString = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
        
        return new Date(isoString);
    };

    const fetchUsers = useCallback(async () => {
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
            setFilteredOrders(sortedOrders);
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
        }
    }, [user.uid]);

    useEffect(() => {
        if (user) {
            fetchUsers();
        }
    }, [user, fetchUsers]);

    const handleSearch = (event) => {
        const searchTerm = event.target.value.toLowerCase();
        setSearchTerm(searchTerm);
        const filtered = orders.filter((order) =>
            order.id.toLowerCase().includes(searchTerm) || order.data.state.toLowerCase().includes(searchTerm) || order.data.creation_date.toLowerCase().includes(searchTerm) || order.data.user.name.toLowerCase().includes(searchTerm) || order.data.user.email.toLowerCase().includes(searchTerm) || order.data.user.phoneNumber.toLowerCase().includes(searchTerm)
        );
        
        // Ordenar por fecha de creación (más nuevos primero)
        const sortedFiltered = filtered.sort((a, b) => {
            const dateA = parseCustomDate(a.data.creation_date);
            const dateB = parseCustomDate(b.data.creation_date);
            return dateB - dateA; // Orden descendente (más nuevos primero)
        });
        
        setFilteredOrders(sortedFiltered);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleShowInfo = (order, prop) => {
        if (prop !== 'id') {
            var value = order['data'][prop];

            if (prop === 'finalPrice') {
                value += '€'
            } else if (prop === 'billingMethod') {
                if (value === 'card') {
                    value = 'TARJETA'
                } else {
                    value = value.toUpperCase();
                }
            } else if (prop === 'shipping') {
                value = value === 'standard' ? 'ESTANDAR' : 'PRIORITARIO'
            } else if (prop === 'state') {
                if (value === 'recived') {
                    value = 'RECIBIDO'
                } else if (value === 'accepted') {
                    value = 'ACEPTADO'
                } else if (value === 'delivered') {
                    value = 'ENVIADO'
                } else {
                    value = 'COMPLETADO'
                }
            }

            return value
        }

        return order[prop]
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
                                {columns.map((column) => (
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
                            {filteredOrders
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((order) => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={order.id} onClick={() => {navigator(`/admin/orders/${order.id}`)}} style={{cursor: 'pointer'}}>
                                            {columns.map((column) => {
                                                const value = handleShowInfo(order, column.id);
                                                
                                                return (
                                                    <TableCell key={column.id} align="left">
                                                        {value}
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    );
                                })}
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
}