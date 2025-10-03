const express = require('express');
const router = express.Router();
const transporter = require('../services/nodemailer');
const { getEstimatedDeliveryDate } = require('../utils/email');

router.post('/send-order-creation-email', async (req, res) => {
  const order = req.body.order;
  const currentDate = new Date();

  const htmlContent = `
    <!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmación de Pedido</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
        }
        .header img {
            max-width: 150px;
        }
        .content {
            margin-top: 20px;
        }
        .content table {
            width: 100%;
            border-collapse: collapse;
        }
        .content table, .content th, .content td {
            border: 1px solid #dddddd;
            padding: 8px;
        }
        .content th {
            background-color: #f2f2f2;
        }
        .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 12px;
            color: #777777;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://www.onionprint.online/assets/logo.svg" alt="OnionPrint Logo">
        </div>
        <div class="content">
            <p>Hola ${order.user.name},</p>
            <p>Gracias por tu compra en <strong>OnionPrint</strong>. Estamos encantados de informarte que hemos recibido tu pedido y estamos trabajando en prepararlo para su envío.</p>

            <h2>Detalles del Pedido</h2>
            <p><strong>Número de Pedido:</strong> #${order.id}</p>
            <p><strong>Fecha del Pedido:</strong> ${order.creation_date}</p>

            <h2>Artículo(s) Pedido(s):</h2>
            <table>
                <thead>
                    <tr>
                        <th>Grupo</th>
                        <th>Páginas totales</th>
                        <th>Precio por página</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${order.items
                      .map(
                        (item, index) =>
                          `<tr><td>${index + 1}</td><td>${item.pages}</td><td>${
                            item.pricePerCopy
                          }</td><td>${item.finalPrice}</td></tr>`
                      )
                      .join('')}
                </tbody>
            </table>
            <p><strong>Total del Pedido:</strong> ${order.finalPrice}</p>

            <h2>Información de Envío</h2>
            <p><strong>Dirección de Envío:</strong> ${order.user.address}, ${order.user.postalCode}, España</p>
            <p><strong>Método de Envío:</strong> ${
              order.shipping == 'standard' ? 'Estandar' : 'Prioritario'
            }</p>
            <p><strong>Estimación de Entrega:</strong> ${getEstimatedDeliveryDate(
              order
            )}</p>

            <h2>Información de Facturación</h2>
            <p><strong>Método de Pago:</strong> ${
              order.billingMethod == 'card' ? 'Tarjeta' : order.billingMethod
            }</p>
            <p><strong>Dirección de Facturación:</strong> ${order.user.address}</p>

            <h2>Seguimiento del Pedido</h2>
            <p>Una vez que tu pedido haya sido enviado, te enviaremos un correo electrónico con la información de seguimiento para que puedas rastrear tu paquete en tiempo real.</p>

            <p>Si tienes alguna pregunta o necesitas asistencia adicional, no dudes en contactarnos a través de <a href="mailto:hola@onionprint.es">hola@onionprint.es</a> o llamarnos al 955832649.</p>

            <p>Gracias por confiar en <strong>OnionPrint</strong>. Esperamos que disfrutes de tus productos.</p>

            <p>Saludos cordiales,</p>
            <p>OnionPrint<br>
               <a href="mailto:hola@onionprint.es">hola@onionprint.es</a><br>
               955832649<br>
               <a href="https://www.onionprint.online">www.onionprint.online</a></p>
        </div>
        <div class="footer">
            <p>&copy; ${currentDate.getFullYear()} OnionPrint. Todos los derechos reservados.</p>
        </div>
    </div>
</body>
</html>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: order.user.email,
    subject: `Confirmación de tu pedido en OnionPrint`,
    html: htmlContent,
  };

  const mailOptions2 = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: 'NUEVO PEDIDO RECIBIDO 🎉',
    html: htmlContent,
  };

  try {
    await Promise.all([
      transporter.sendMail(mailOptions),
      transporter.sendMail(mailOptions2),
    ]);

    res.status(200).send({ message: 'Correos enviados exitosamente' });
  } catch (error) {
    console.error('Error al enviar el correo electrónico:', error);
    res.status(500).send({ message: 'Error al enviar los correos electrónicos' });
  }
});

module.exports = router;
