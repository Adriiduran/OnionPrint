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
    { id: 'uid', label: 'UID', minWidth: 50 },
    { id: 'email', label: 'Correo electrónico', minWidth: 100 },
    { id: 'creationTime', label: 'Fecha de creación', minWidth: 100 },
    { id: 'lastSignInTime', label: 'Fecha de acceso', minWidth: 100 },
];

export default function AdminUsers() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useAuth();
    const isMobile = useMediaQuery('(max-width:767px)');

    const fetchUsers = async () => {
        try {
            const usersData = await axios.get(`${import.meta.env.VITE_API_URL}/users`, {
                params: {
                    userUid: user.uid,
                }
            });

            setUsers(usersData.data);
            setFilteredUsers(usersData.data);
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
        }
    }

    useEffect(() => {
        if (user) {
            fetchUsers();
        }
    }, [user]);

    const handleSearch = (event) => {
        const searchTerm = event.target.value.toLowerCase();
        setSearchTerm(searchTerm);
        const filtered = users.filter((user) =>
            user.uid.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm)
        );
        setFilteredUsers(filtered);
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
                            {filteredUsers
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((user) => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={user.uid}>
                                            {columns.map((column) => {
                                                var value;
                                                if (column.id === 'lastSignInTime' || column.id === 'creationTime') {
                                                    value = user['metadata'][column.id]
                                                } else {
                                                    value = user[column.id];
                                                }
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
                    count={filteredUsers.length}
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