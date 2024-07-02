import { Dialog, DialogTitle, List, ListItem, ListItemButton, ListItemText, TextField, FormControl, InputLabel, Select, MenuItem, Box, Typography } from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import PropTypes from 'prop-types';
import DiscountDialogType from '../../../utils/enums/DiscountDialogType';
import { useEffect, useState, useCallback } from "react";
import dayjs from "dayjs";

const AdminDiscountItem = {
  id: "",
  name: "",
  discount: 0,
  duration: 'one time',
  startDate: null,
  endDate: null,
  uses: 0,
  maxUses: 0,
  active: false
};

const DiscountForm = ({ type, discount, handleChange, handleSubmit, buttonText, errors }) => (
  <Box sx={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

    <Typography variant="h6" sx={{ textAlign: 'center' }}>{type === DiscountDialogType.create ? 'CREAR DESCUENTO' : 'ACTUALIZAR DESCUENTO' }</Typography>

    <TextField
      id="discountName"
      label="Nombre"
      value={discount.name}
      onChange={(e) => handleChange("name", e.target.value)}
      fullWidth
      margin="normal"
      error={!!errors.name}
      helperText={errors.name}
    />

    <TextField
      id="discountValue"
      label="Descuento (%)"
      type="number"
      value={discount.discount}
      onChange={(e) => handleChange("discount", e.target.value)}
      fullWidth
      margin="normal"
      error={!!errors.discount}
      helperText={errors.discount}
    />

    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <DateTimePicker
          id="discountStartDate"
          label="Fecha de inicio"
          value={discount.startDate}
          onChange={(value) => handleChange("startDate", value)}
          fullWidth
          margin="normal"
        />
        <DateTimePicker
          id="discountEndDate"
          label="Fecha de fin"
          value={discount.endDate}
          onChange={(value) => handleChange("endDate", value)}
          fullWidth
          margin="normal"
        />
      </div>
    </LocalizationProvider>

    <p>{!!errors.date && <span style={{ fontSize: '12px', margin: '10px 0px' }}>{ errors.date }</span>}</p>

    <TextField
      id="discountMaxUses"
      label="Usos máximos"
      type="number"
      value={discount.maxUses}
      onChange={(e) => handleChange("maxUses", e.target.value)}
      fullWidth
      margin="normal"
      error={!!errors.maxUses}
      helperText={errors.maxUses}
    />

    <FormControl fullWidth margin="normal">
      <InputLabel id="discountActive">Activo</InputLabel>
      <Select
        labelId="discountActive"
        id="discountActiveSelect"
        value={discount.active}
        label="Activo"
        onChange={(e) => handleChange("active", e.target.value === true)}
      >
        <MenuItem value={false}>Inactivo</MenuItem>
        <MenuItem value={true}>Activo</MenuItem>
      </Select>
    </FormControl>

    <List sx={{ paddingTop: 0 }}>
      <ListItem sx={{ gap: '10px' }}>
        <ListItemButton
          onClick={handleSubmit}
          sx={{
            backgroundColor: 'green',
            borderRadius: '10px',
            '&:hover': {
              backgroundColor: 'darkgreen',
            }
          }}
        >
          <ListItemText primary={buttonText} sx={{ textAlign: 'center', color: 'white' }} />
        </ListItemButton>
      </ListItem>
    </List>
  </Box>
);

const renderDeleteDiscount = (onClose, handleDeleteDiscount, discount) => (
  <>
    <DialogTitle>ELIMINAR DESCUENTO {discount.name}</DialogTitle>
    <List sx={{ pt: 0 }}>
      <ListItem sx={{ gap: '10px' }}>
        <ListItemButton
          onClick={onClose}
          sx={{
            backgroundColor: 'blue',
            borderRadius: '10px',
            '&:hover': {
              backgroundColor: 'darkblue',
            }
          }}
        >
          <ListItemText primary="NO" sx={{ textAlign: 'center', color: 'white' }} />
        </ListItemButton>
        <ListItemButton
          onClick={handleDeleteDiscount}
          sx={{
            backgroundColor: 'red',
            borderRadius: '10px',
            '&:hover': {
              backgroundColor: 'darkred',
            }
          }}
        >
          <ListItemText primary="ELIMINAR" sx={{ textAlign: 'center', color: 'white' }} />
        </ListItemButton>
      </ListItem>
    </List>
  </>
);

export default function AdminDiscountActionDialog(props) {
  const { type, isOpen, onClose, updateDiscount, deleteDiscount, createDiscount, discount } = props;
  const [newDiscount, setNewDiscount] = useState(AdminDiscountItem);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if ((type === DiscountDialogType.delete) && discount) {
      setNewDiscount(discount);
    } else if ((type === DiscountDialogType.update) && discount) {
      let newDiscount = { ...discount };

      newDiscount.startDate = dayjs(discount.startDate);
      newDiscount.endDate = dayjs(discount.endDate);

      setNewDiscount(newDiscount);
    } else {
      setNewDiscount(AdminDiscountItem);
    }
  }, [type, discount]);

  const handleChange = useCallback((field, value) => {
    setNewDiscount(prevState => ({
      ...prevState,
      [field]: value
    }));
  }, []);

  const validateFields = useCallback(() => {
    const newErrors = {};

    if (!newDiscount.name) {
      newErrors.name = "Debes introducir un nombre";
    }

    if (newDiscount.discount <= 0) {
      newErrors.discount = "El descuento debe ser mayor que 0";
    } else if (newDiscount.discount > 100) {
      newErrors.discount = "El descuento debe ser menor que 100";
    } else if (newDiscount.discount === 100) {
      newErrors.discount = "El descuento no puede ser 100";
    } else if (!newDiscount.discount) {
      newErrors.discount = "Debes introducir un descuento";
    }

    if (newDiscount.maxUses <= 0) {
      newErrors.maxUses = "Los usos máximos deben ser mayores que 0";
    } else if (!newDiscount.maxUses) {
      newErrors.maxUses = "Debes introducir los usos máximos";
    }

    if (newDiscount.startDate && newDiscount.endDate && newDiscount.startDate > newDiscount.endDate) {
      newErrors.date = "La fecha de inicio no puede ser posterior a la fecha de fin";
    } else if (!newDiscount.startDate || !newDiscount.endDate) {
      newErrors.date = "Debes introducir una fecha de inicio y de fin";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }, [newDiscount]);

  const handleCreateDiscount = useCallback(() => {
    if (validateFields()) {
      createDiscount(newDiscount);
      setNewDiscount(AdminDiscountItem);
      onClose();
    }
  }, [createDiscount, newDiscount, onClose, validateFields]);

  const handleUpdateDiscount = useCallback(() => {
    if (validateFields()) {
      updateDiscount(newDiscount);
      setNewDiscount(AdminDiscountItem);
      onClose();
    }
  }, [updateDiscount, newDiscount, onClose, validateFields]);

  const handleDeleteDiscount = useCallback(() => {
    deleteDiscount(newDiscount);
    setNewDiscount(AdminDiscountItem);
    onClose();
  }, [deleteDiscount, newDiscount, onClose]);

  const renderDialogContentByType = () => {
    switch (type) {
      case DiscountDialogType.create:
        return <DiscountForm type={type} discount={newDiscount} handleChange={handleChange} handleSubmit={handleCreateDiscount} buttonText="CREAR" errors={errors} />;
      case DiscountDialogType.update:
        return <DiscountForm type={type} discount={newDiscount} handleChange={handleChange} handleSubmit={handleUpdateDiscount} buttonText="ACTUALIZAR" errors={errors} />;
      case DiscountDialogType.delete:
        return renderDeleteDiscount(onClose, handleDeleteDiscount, newDiscount);
      default:
        return null;
    }
  };

  return (
    <Dialog onClose={onClose} open={isOpen}>
      {renderDialogContentByType()}
    </Dialog>
  );
}

AdminDiscountActionDialog.propTypes = {
  type: PropTypes.oneOf(Object.values(DiscountDialogType)).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  updateDiscount: PropTypes.func,
  deleteDiscount: PropTypes.func,
  createDiscount: PropTypes.func,
  discount: PropTypes.object
};

DiscountForm.propTypes = {
  type: PropTypes.oneOf(Object.values(DiscountDialogType)).isRequired,
  discount: PropTypes.object,
  handleChange: PropTypes.func,
  handleSubmit: PropTypes.func,
  buttonText: PropTypes.string,
  errors: PropTypes.object
};
