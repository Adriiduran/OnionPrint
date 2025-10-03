export const parseCustomDate = (dateString) => {
    if (!dateString) return new Date(0);
    
    const parts = dateString.split(', ');
    if (parts.length !== 2) return new Date(0);
    
    const [datePart, timePart] = parts;
    const [day, month, year] = datePart.split('/');
    const [hours, minutes, seconds] = timePart.split(':');
    
    const isoString = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
    
    return new Date(isoString);
};

export const formatOrderValue = (order, prop) => {
    if (prop !== 'id') {
        let value = order['data'][prop];

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
};
