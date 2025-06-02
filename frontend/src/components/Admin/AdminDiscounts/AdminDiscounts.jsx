import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Paper, Table, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, TableBody } from '@mui/material';
import { useAuth } from '../../../auth/AuthContext';
import useMediaQuery from '@mui/material/useMediaQuery';
import AdminDiscountActionDialog from './AdminDiscountActionDialog';
import DiscountDialogType from '../../../utils/enums/DiscountDialogType';
import { formatDate } from '../../../utils/Date';

const columns = [
    { id: 'id', label: 'ID', minWidth: 50 },
    { id: 'name', label: 'Nombre', minWidth: 100 },
    { id: 'discount', label: 'Descuento', minWidth: 50 },
    { id: 'duration', label: 'Tipo de duración', minWidth: 50 },
    { id: 'startDate', label: 'Fecha de incio', minWidth: 250 },
    { id: 'endDate', label: 'Fecha de finalización', minWidth: 250 },
    { id: 'uses', label: 'Usos', minWidth: 50 },
    { id: 'maxUses', label: 'Usos maximos', minWidth: 50 },
    { id: 'active', label: 'Activo', minWidth: 50 },
    { id: 'editAction', label: 'Editar', minWidth: 50 },
    { id: 'deleteAction', label: 'Eliminar', minWidth: 50 }
];

export default function AdminUsers() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [discounts, setDiscounts] = useState([]);
    const [filteredDiscounts, setFilteredDiscounts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useAuth();
    const isMobile = useMediaQuery('(max-width:767px)');

    // DIALOG
    const [isDiscountActionDialogOpen, setIsDiscountActionDialogOpen] = useState(false);
    const [discountDialogType, setDiscountDialogType] = useState(DiscountDialogType.create);
    const [selectedDiscount, setSelectedDiscount] = useState(null);

    const handleOpenDiscountActionDialog = (discount, type) => {
        setSelectedDiscount(discount);
        setDiscountDialogType(type);
        setIsDiscountActionDialogOpen(true);
    }

    const handleCloseDiscountActionDialog = () => {
        setIsDiscountActionDialogOpen(false);
        setSelectedDiscount(null);
    };

    const handleCreateDiscount = async (discount) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/discounts`, {
                userUid: user.uid,
                discount: discount
            });
    
            fetchDiscounts();

            setSelectedDiscount(null);
        } catch (error) {
            console.error("Error al crear el descuento:", error);
        }
    };

    const handleUpdateDiscount = async (discount) => {
        try {
            const response = await axios.put(`${import.meta.env.VITE_API_URL}/discounts`, {
                userUid: user.uid,
                discount: discount
            });

            fetchDiscounts();

            setSelectedDiscount(null);
        } catch (error) {
            console.error(`Error al actualizar el descuento con id: ${discount.id} y error: `, error);
        }
    };

    const handleDeleteDiscount = async (discount) => {
        try {
            const response = await axios.delete(`${import.meta.env.VITE_API_URL}/discounts`, {
                data: {
                    userUid: user.uid,
                    discount: discount
                }
            });
    
            fetchDiscounts();

            setSelectedDiscount(null);
        } catch (error) {
            console.error(`Error al eliminar el descuento con id: ${discount.id} y error: `, error);
        }
    };
    

    const fetchDiscounts = async () => {
        try {
            const discountsData = await axios.get(`${import.meta.env.VITE_API_URL}/discounts`, {
                params: {
                    userUid: user.uid,
                }
            });

            setDiscounts(discountsData.data);
            setSelectedDiscount(discountsData.data[0]);
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
        const filtered = discounts.filter((discount) => {
            return discount.id.toLowerCase().includes(searchTerm) ||
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
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '100px'}}>
                <Button
                    variant="contained"
                    onClick={() => handleOpenDiscountActionDialog(selectedDiscount, DiscountDialogType.create)}
                >
                    Crear Descuento
                </Button>
            </div>
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
                                                {
                                                    if (column.id === 'startDate' || column.id === 'endDate') {
                                                        return (
                                                            <TableCell key={column.id} align="left">
                                                                {formatDate(discount[column.id])}
                                                            </TableCell>
                                                        );
                                                    } else if (column.id === 'active') {
                                                        return (
                                                            <TableCell key={column.id} align="left">
                                                                {discount[column.id] ? 'Si' : 'No'}
                                                            </TableCell>
                                                        )
                                                    } else if (column.id === 'duration') {
                                                        return (
                                                            <TableCell key={column.id} align="left">
                                                                {discount[column.id] === 'one time' ? 'Una vez' : 'Ilimitado'}
                                                            </TableCell>
                                                        )
                                                    } else if (column.id === 'discount') {
                                                        return (
                                                            <TableCell key={column.id} align="left">
                                                                {discount[column.id] + "%"}
                                                            </TableCell>
                                                        )
                                                    } else if (column.id === 'editAction') {
                                                        return (
                                                            <TableCell key={column.id} align="left">
                                                                <img src={`${import.meta.env.VITE_ASSETS_URL}/editIcon.webp`} alt="Edit Button Icon" onClick={() => handleOpenDiscountActionDialog(discount, DiscountDialogType.update)} style={{ cursor: 'pointer', width: '24px', height: '24px' }} />
                                                            </TableCell>
                                                        )
                                                    } else if (column.id === 'deleteAction') {
                                                        return (
                                                            <TableCell key={column.id} align="left">
                                                                <img src={`${import.meta.env.VITE_ASSETS_URL}/trashIcon.webp`} alt="Delete Button Icon" onClick={() => handleOpenDiscountActionDialog(discount, DiscountDialogType.delete)} style={{ cursor: 'pointer', width: '24px', height: '24px' }} />
                                                            </TableCell>
                                                        )
                                                    } else {
                                                        return (
                                                            <TableCell key={column.id} align="left">
                                                                {discount[column.id]}
                                                            </TableCell>
                                                        )
                                                    }
                                                }
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
            <AdminDiscountActionDialog
                type={discountDialogType}
                isOpen={isDiscountActionDialogOpen}
                onClose={handleCloseDiscountActionDialog}
                updateDiscount={handleUpdateDiscount}
                deleteDiscount={handleDeleteDiscount}
                createDiscount={handleCreateDiscount}
                discount={selectedDiscount}
            />
        </>

    );
}