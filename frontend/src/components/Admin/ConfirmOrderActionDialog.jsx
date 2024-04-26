import { Dialog, DialogTitle, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import PropTypes from 'prop-types';

export default function ConfirmOrderActionDialog(props) {
  const { onClose, selectedValue, open, setOrderStatus, previousOrderStatus, acceptOrderChange } = props;

  const handleDennyOrderChange = () => {
    setOrderStatus(previousOrderStatus)
    onClose();
  };

  const handleAcceptOrderChange = () => {
    setOrderStatus(selectedValue)
    acceptOrderChange()
    onClose();
  };

  const renameSelectedValue = () => {
    if (selectedValue === 'recived') {
      return 'recibido'
    } else if (selectedValue === 'accepted') {
      return 'aceptado'
    } else if (selectedValue === 'delivered') {
      return 'enviado'
    } else {
      return 'completado'
    }
  }

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>¿Quieres modificar el estado del pedido a {renameSelectedValue()}?</DialogTitle>
      <List sx={{ pt: 0 }}>
        <ListItem sx={{ gap: '10px'}}>
          <ListItemButton
            autoFocus
            onClick={handleDennyOrderChange}
            sx={{
              backgroundColor: 'red',
              borderRadius: '10px',
              '&:hover': {
                backgroundColor: 'darkred',
              }
            }}
          >
            <ListItemText primary="NO" sx={{ textAlign: 'center', color: 'white' }}/>
          </ListItemButton>
          <ListItemButton
            autoFocus
            onClick={handleAcceptOrderChange}
            sx={{
              backgroundColor: 'green',
              borderRadius: '10px',
              '&:hover': {
                backgroundColor: 'darkgreen',
              }
            }}
          >
            <ListItemText primary="SI" sx={{ textAlign: 'center', color: 'white'}} />
          </ListItemButton>
        </ListItem>
      </List>
    </Dialog>
  );
}

ConfirmOrderActionDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
  setOrderStatus: PropTypes.func.isRequired,
  previousOrderStatus: PropTypes.string.isRequired,
  acceptOrderChange: PropTypes.func.isRequired
};