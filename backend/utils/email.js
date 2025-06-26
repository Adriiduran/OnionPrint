const transporter = require('../services/nodemailer');

async function sendEmailWhenOrderStatusChanged(order) {
  if (order.estado === 'recived') {
    return;
  }

  const currentDate = new Date();

  const htmlContent = `
    <!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Actualización de Estado de Pedido</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      padding-bottom: 20px;
    }
    .header img {
      max-width: 150px;
    }
    .content {
      margin-bottom: 20px;
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: #888888;
    }
    .button {
      display: inline-block;
      padding: 10px 20px;
      font-size: 16px;
      color: #ffffff;
      background-color: #007bff;
      text-decoration: none;
      border-radius: 4px;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://www.onionprint.online/assets/logo.svg" alt="Logo de OnionPrint">
    </div>
    <div class="content">
      <h1>¡Tu pedido ha sido actualizado!</h1>
      <p>Hola ${order.usuario.name},</p>
      <p>Queríamos informarte que el estado de tu pedido ha cambiado. Aquí están los detalles:</p>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr>
          <td style="padding: 8px; border: 1px solid #dddddd;">Número de Pedido:</td>
          <td style="padding: 8px; border: 1px solid #dddddd;">${order.id}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #dddddd;">Estado Actual:</td>
          <td style="padding: 8px; border: 1px solid #dddddd;">${localizeOrderStatus(order.estado)}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #dddddd;">Fecha de Actualización:</td>
          <td style="padding: 8px; border: 1px solid #dddddd;">${currentDate.toLocaleString()}</td>
        </tr>
      </table>
      <p>Si tienes alguna pregunta o necesitas más información, no dudes en contactarnos.</p>
    </div>
    <div class="footer">
      <p>Gracias por comprar con nosotros.</p>
      <p>&copy; ${currentDate.getFullYear()} ONIONPRINT. Todos los derechos reservados.</p>
      <p>hola@onionprint.es | 644012942</p>
    </div>
  </div>
</body>
</html>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: order.usuario.email,
    subject: 'ACTUALIZACIÓN DE ESTADO',
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
}

function getEstimatedDeliveryDate(order) {
  if (!order || !order.creation_date) {
    throw new Error('La orden debe incluir una fecha de creación válida.');
  }

  if (order.shipping === 'standard') {
    return `${addDaysToDate(order.creation_date, 2)} - ${addDaysToDate(order.creation_date, 3)}`;
  }

  return `${addDaysToDate(order.creation_date, 1)} - ${addDaysToDate(order.creation_date, 2)}`;
}

function addDaysToDate(dateString, daysToAdd) {
  if (!dateString) {
    throw new Error('El string de la fecha no puede ser nulo o indefinido.');
  }

  const datePart = dateString.split(',')[0];
  const [day, month, year] = datePart.split('/').map(Number);

  if (isNaN(day) || isNaN(month) || isNaN(year)) {
    throw new Error(`Fecha inválida: ${dateString}`);
  }

  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + daysToAdd);

  const newDay = String(date.getDate()).padStart(2, '0');
  const newMonth = String(date.getMonth() + 1).padStart(2, '0');
  const newYear = date.getFullYear();

  return `${newDay}/${newMonth}/${newYear}`;
}

function localizeOrderStatus(status) {
  switch (status) {
    case 'recived':
      return 'Recibido';
    case 'accepted':
      return 'Aceptado';
    case 'delivered':
      return 'Enviado';
    case 'completed':
      return 'Completado';
    default:
      return 'Desconocido';
  }
}

module.exports = {
  sendEmailWhenOrderStatusChanged,
  getEstimatedDeliveryDate,
};
