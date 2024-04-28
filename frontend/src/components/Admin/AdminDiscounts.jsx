import { useState, useEffect } from 'react';
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
import { useAuth } from '../../auth/AuthContext';
import useMediaQuery from '@mui/material/useMediaQuery';

const columns = [
    { id: 'id', label: 'ID', minWidth: 50 },
    { id: 'name', label: 'Nombre', minWidth: 100 },
    { id: 'discount', label: 'Descuento', minWidth: 100 },
    { id: 'duration', label: 'Tipo de duración', minWidth: 100 },
    { id: 'startDate', label: 'Fecha de incio', minWidth: 100 },
    { id: 'endDate', label: 'Fecha de finalización', minWidth: 100 },
    { id: 'uses', label: 'Usos', minWidth: 50 },
    { id: 'maxUses', label: 'Usos maximos', minWidth: 50 },
    { id: 'active', label: 'Activo', minWidth: 50 },
];

export default function AdminUsers() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [discounts, setDiscounts] = useState([]);
    const [filteredDiscounts, setFilteredDiscounts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useAuth();
    const isMobile = useMediaQuery('(max-width:767px)');

    const fetchDiscounts = async () => {
        try {
            const discountsData = await axios.get(`${import.meta.env.VITE_API_URL}/discounts`, {
                params: {
                    userUid: user.uid,
                }
            });
            
            console.log(discountsData.data)
            setDiscounts(discountsData.data);
            setFilteredDiscounts(discountsData.data);
        } catch (error) {
            console.error('Error al obtener los descuentos:', error);
        }
    }

    useEffect(() => {
        if (user) {
            fetchDiscounts();
        }
    }, [user]);

    const handleSearch = (event) => {
        const searchTerm = event.target.value.toLowerCase();
        setSearchTerm(searchTerm);
        const filtered = discounts.filter((discount) =>
            {
                return discount.uid.toLowerCase().includes(searchTerm) ||
                    discount.name.toLowerCase().includes(searchTerm);
            }
        );
        setFilteredDiscounts(filtered);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <>
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
                                        style={{ minWidth: column.minWidth, color: 'white', backgroundColor: '#1e0342' }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredDiscounts
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((discount) => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={discount.id}>
                                            {columns.map((column) => {
                                                return (
                                                    <TableCell key={column.id} align="left">
                                                        {discount[column.id]}
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
                    count={filteredDiscounts.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage={"Filas por página"}
                />
            </Paper>
        </>

    );
}