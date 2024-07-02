import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../auth/AuthContext";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import PropTypes from 'prop-types';

import ConfirmOrderActionDialog from '../ConfirmOrderActionDialog';

export default function AdminOrderDetail({ setOrderId }) {
    const { orderId } = useParams();
    const [order, setOrder] = useState({});
    const { user } = useAuth();
    const [orderStatus, setOrderStatus] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        if (orderId && user) {
            fetchOrder();
        }
    }, [orderId, user]);

    // Función que llama al servicio para obtener el pedido concreto usando el id de los parametros de la url
    const fetchOrder = async () => {
        try {
            const orderData = await axios.get(`${import.meta.env.VITE_API_URL}/orders/${orderId}`, {
                params: {
                    userUid: user.uid,
                }
            });

            const newOrder = reorderAndRename(orderData.data)
            setOrder(newOrder)
            setOrderStatus(newOrder.estado);
            setOrderId(newOrder.id);

        } catch (error) {
            console.log(error)
        }
    }

    // Función para reordenar y cambiar el nombre de las propiedades del objeto
    const reorderAndRename = (order) => {
        const newOrder = {
            id: order.id,
            estado: order.data.state,
            envio: order.data.shipping,
            'precio sin envío': order.data.itemsPrice,
            'precio final': order.data.finalPrice,
            'descuento aplicado': order.data.discountPrice,
            'descuento': order.data.discount,
            'método de pago': order.data.billingMethod,
            'stripe': order.data.stripe_payment_intent.id,
            'fecha creación': order.data.creation_date,
            'usuario': order.data.user,
            'propiedades': order.data.items,
            'ficheros': order.data.filesInfo
        };

        return newOrder;
    }

    // Función para controlar los valores que se muestran dependiendo de la key
    const handleValueByKey = (key, value) => {
        if (key === 'estado') {
            if (value === 'recived') {
                return 'RECIBIDO'
            } else if (value === 'accepted') {
                return 'ACEPTADO'
            } else if (value === 'delivered') {
                return 'ENVIADO'
            } else {
                return 'COMPLETADO'
            }
        } else if (key === 'envio') {
            if (value === 'standard') {
                return 'ESTANDAR'
            } else {
                return 'PRIORITARIO'
            }
        } else if (key === 'método de pago') {
            return value.toUpperCase();

        } else if (key === 'precio final' || key === 'precio sin envío') {
            return value + '€'
        } else if (key === 'stripe') {
            return <a href={`https://dashboard.stripe.com/test/payments/${value}`} target="_blank" rel="noreferrer">{value}</a>;
        } else {
            return value
        }
    }

    // Función para formatear las claves del usuario
    const handleUserKeys = (key) => {
        if (key === 'address') {
            return 'DIRECCIÓN'
        } else if (key === 'name') {
            return 'NOMBRE'
        } else if (key === 'phoneNumber') {
            return 'TELÉFONO'
        } else if (key === 'postalCode') {
            return 'CÓDIGO POSTAL'
        } else if (key === 'deliveryComments') {
            return 'COMENTARIOS AL REPARTIDOR'
        } else {
            return key.toUpperCase();
        }
    }

    // Función para obtener el total de ficheros
    const getFilesSum = (files) => {
        let totalLength = 0;

        for (const property in files) {
            if (Object.hasOwnProperty.call(files, property)) {
                const fileList = files[property];
                totalLength += fileList.length;
            }
        }

        return totalLength
    }

    // Función para controlar el estado del pedido
    const handleOrderStateChange = (event) => {
        setOrderStatus(event.target.value);
        setIsDialogOpen(true)
    };

    // Función para cerrar el diálogo de confirmación
    const handleCloseDialog = () => {
        setIsDialogOpen(false);
    };
    // Función para aceptar el cambio de estado y actualizar en firebase
    const acceptOrderChange = async () => {
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/orders/${orderId}`, {
                orderStatus: orderStatus,
                userUid: user.uid,
                order: order
            });
            order.estado = orderStatus;
        } catch (error) {
            console.log(error);
        }
    }

    // Función para renderizar la tabla con los detalles del pedido
    const renderOrderDetailsTable = () => {
        return (
            <React.Fragment key={order.id}>
                <TableContainer component={Paper} sx={{ overflow: 'auto', minWidth: '100%', marginTop: '30px' }}>
                    <Table aria-label="order details">
                        <TableBody>
                            {Object.entries(order).map(([key, value]) => {
                                if (key === 'usuario') {
                                    return (
                                        <React.Fragment key={key}>
                                            <TableRow>
                                                <TableCell style={{ color: 'white', backgroundColor: '#1e0342' }} rowSpan={9}>{key.toUpperCase()}</TableCell>
                                            </TableRow>
                                            {Object.entries(value).map(([innerKey, innerValue]) => (
                                                <TableRow key={innerKey}>
                                                    <TableCell style={{ color: 'white', backgroundColor: 'var(--primary)' }}>{handleUserKeys(innerKey)}</TableCell>
                                                    <TableCell colSpan={2}>{innerValue}</TableCell>
                                                </TableRow>
                                            ))}
                                        </React.Fragment>
                                    );
                                } else if (key === 'propiedades') {
                                    return (
                                        <React.Fragment key={key}>
                                            <TableRow>
                                                <TableCell style={{ color: 'white', backgroundColor: '#1e0342' }} rowSpan={(Object.keys(value).length * 11) + 1}>{key.toUpperCase()}</TableCell>
                                            </TableRow>
                                            {value.map((property, index) => (
                                                <React.Fragment key={index}>
                                                    <TableRow>
                                                        <TableCell style={{ color: 'white', backgroundColor: 'var(--primary)' }} rowSpan={11}>PROPIEDAD {index + 1}</TableCell>
                                                    </TableRow>
                                                    {Object.entries(property).map(([innerKey, innerValue]) => {
                                                        if (innerKey === 'preference') {
                                                            return (
                                                                <React.Fragment key={innerKey}>
                                                                    {Object.entries(innerValue).map(([prefKey, prefValue]) => {
                                                                        if (prefKey === 'comentary') {
                                                                            return (
                                                                                <TableRow key={prefKey}>
                                                                                    <TableCell>{'COMENTARIOS'}</TableCell>
                                                                                    <TableCell>{prefValue === '' ? 'SIN COMENTARIOS' : prefValue}</TableCell>
                                                                                </TableRow>);
                                                                        } else if (prefKey === 'copies') {
                                                                            return (
                                                                                <TableRow key={prefKey}>
                                                                                    <TableCell>{'COPIAS'}</TableCell>
                                                                                    <TableCell>{prefValue}</TableCell>
                                                                                </TableRow>);
                                                                        } else {
                                                                            return (
                                                                                <TableRow key={prefKey}>
                                                                                    <TableCell>{prefValue.title}</TableCell>
                                                                                    <TableCell>{prefValue.description}</TableCell>
                                                                                </TableRow>
                                                                            );
                                                                        }
                                                                    })}
                                                                </React.Fragment>
                                                            );
                                                        }
                                                    })}
                                                </React.Fragment>
                                            ))}
                                        </React.Fragment>
                                    );
                                } else if (key === 'ficheros') {
                                    return (
                                        <React.Fragment key={key}>
                                            <TableRow>
                                                <TableCell style={{ color: 'white', backgroundColor: '#1e0342' }} rowSpan={getFilesSum(value) * 11}>{key.toUpperCase()}</TableCell>
                                            </TableRow>
                                            {Object.values(value).map((fileArray, index) => (
                                                <React.Fragment key={index}>
                                                    <TableRow>
                                                        <TableCell style={{ color: 'white', backgroundColor: 'var(--primary)' }} rowSpan={fileArray.length * 2 + 1}>PROPIEDAD {index + 1}</TableCell>
                                                    </TableRow>
                                                    {fileArray.map((file, fileIndex) => (
                                                        <React.Fragment key={fileIndex}>
                                                            <TableRow key={fileIndex}>
                                                                <TableCell>NOMBRE</TableCell>
                                                                <TableCell>{file.name}</TableCell>
                                                            </TableRow>
                                                            <TableRow key={fileIndex + 'url'}>
                                                                <TableCell>URL</TableCell>
                                                                <TableCell><a href={file.url} target="_blank" rel="noreferrer">{file.url}</a></TableCell>
                                                            </TableRow>
                                                        </React.Fragment>
                                                    ))}
                                                </React.Fragment>
                                            ))}
                                        </React.Fragment>
                                    );
                                } else if (key === 'estado') {
                                    return (
                                        <TableRow key={key}>
                                            <TableCell style={{ color: 'white', backgroundColor: '#1e0342' }}>{key.toUpperCase()}</TableCell>
                                            <TableCell colSpan={3}>{
                                                <Box sx={{ minWidth: 120 }}>
                                                    <FormControl fullWidth>
                                                        <InputLabel id="demo-simple-select-label">ESTADO</InputLabel>
                                                        <Select
                                                            labelId="demo-simple-select-label"
                                                            id="demo-simple-select"
                                                            value={orderStatus}
                                                            label="Order Status"
                                                            onChange={handleOrderStateChange}
                                                        >
                                                            <MenuItem value={'recived'}>Recibido</MenuItem>
                                                            <MenuItem value={'accepted'}>Aceptado</MenuItem>
                                                            <MenuItem value={'delivered'}>Enviado</MenuItem>
                                                            <MenuItem value={'completed'}>Completado</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Box>
                                            }</TableCell>
                                        </TableRow>
                                    );
                                }
                                else {
                                    return (
                                        <TableRow key={key}>
                                            <TableCell style={{ color: 'white', backgroundColor: '#1e0342' }}>{key.toUpperCase()}</TableCell>
                                            <TableCell colSpan={3}>{handleValueByKey(key, value)}</TableCell>
                                        </TableRow>
                                    );
                                }
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <ConfirmOrderActionDialog
                    selectedValue={orderStatus}
                    open={isDialogOpen}
                    onClose={handleCloseDialog}
                    setOrderStatus={setOrderStatus}
                    previousOrderStatus={order.estado}
                    acceptOrderChange={acceptOrderChange}
                />
            </React.Fragment>
        );
    };


    return (
        <div>
            {Object.keys(order).length > 0 && renderOrderDetailsTable()}
        </div>
    );
}

AdminOrderDetail.propTypes = {
    setOrderId: PropTypes.func.isRequired
};
