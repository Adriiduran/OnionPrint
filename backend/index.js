const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const { resolve } = require("path");
const cors = require("cors");
const env = require("dotenv").config({ path: "./.env" });
const nodemailer = require("nodemailer");
const admin = require("firebase-admin");
const { error } = require("console");
const axios = require("axios");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-08-01",
});

const serviceAccount = {
  type: process.env.ADMIN_TYPE,
  project_id: process.env.ADMIN_PROJECT_ID,
  private_key_id: process.env.ADMIN_PRIVATE_KEY_ID,
  private_key: process.env.ADMIN_PRIVATE_KEY,
  client_email: process.env.ADMIN_CLIENT_EMAIL,
  client_id: process.env.ADMIN_CLIENT_ID,
  auth_uri: process.env.ADMIN_AUTH_URI,
  token_uri: process.env.ADMIN_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.ADMIN_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.ADMIN_CLIENT_X509_CERT_URL,
  universe_domain: process.env.ADMIN_UNIVERSE_DOMAIN,
};

const adminFirebaseApp = admin.initializeApp(
  {
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.ADMIN_STORAGE_BUCKET,
  },
  "admin"
);

app.use(express.static(process.env.STATIC_DIR));
app.use(bodyParser.json());
app.use(cors());

// SMTP transporter configuration
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

app.get("/", (req, res) => {
  const path = resolve(process.env.STATIC_DIR + "/index.html");
  res.sendFile(path);
});

// Ruta para servir el documento de verificación de Apple Pay
app.get('/.well-known/apple-developer-merchantid-domain-association', (req, res) => {
  const filePath = path.join(__dirname, '../frontend/public/.well-known/apple-developer-merchantid-domain-association');
  res.sendFile(filePath);
});

// Sends the publishable stripe key to the frontend
app.get("/api/stripe-config", (req, res) => {
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

// Created payment intent based on final cart preferences
app.post("/api/create-payment-intent", async (req, res) => {
  const data = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "eur",
      amount: data.finalPrice * 100,
      automatic_payment_methods: { enabled: true },
      metadata: {
        name: data.user.name,
        email: data.user.email,
        phoneNumber: data.user.phoneNumber,
        dni: data.user.dni,
        address: data.user.address,
        postalCode: data.user.postalCode,
        deliveryComments: data.user.deliveryComments,
      },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (e) {
    return res.status(400).send({
      error: {
        message: e.message,
      },
    });
  }
});

// Sends firebase users list
app.get("/api/users", async (req, res) => {
  const userUid = req.query.userUid;

  if (userUid === process.env.ADMIN_UID) {
    try {
      const userList = await adminFirebaseApp.auth().listUsers();

      const users = userList.users.map((user) => ({
        uid: user.uid,
        email: user.email,
        metadata: user.metadata,
      }));

      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener la lista de usuarios" });
    }
  } else {
    res.status(500).json({
      error: "Only admin can access to this endpoint",
    });
  }
});

// Sends orders list
app.get("/api/orders", async (req, res) => {
  const userUid = req.query.userUid;

  if (userUid === process.env.ADMIN_UID) {
    try {
      const ordersRef = adminFirebaseApp.firestore().collection("orders");

      // Ordena las órdenes por la fecha de creación de forma descendente
      const snapshot = await ordersRef.orderBy("creation_date", "desc").get();

      const orders = [];

      snapshot.forEach((doc) => {
        orders.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      res.json(orders);
    } catch (error) {
      console.error("Error al obtener las órdenes:", error);
      res.status(500).json({ error: "Error al obtener las órdenes" });
    }
  } else {
    res.status(500).json({
      error: "Only admin can access to this endpoint",
    });
  }
});

// Get order by id
app.get("/api/orders/:orderId", async (req, res) => {
  const orderId = req.params.orderId;
  const userUid = req.query.userUid;

  if (userUid === process.env.ADMIN_UID) {
    try {
      // Obtiene la referencia de la colección de órdenes
      const orderRef = adminFirebaseApp
        .firestore()
        .collection("orders")
        .doc(orderId);

      // Obtiene los datos de la orden con el ID proporcionado
      const orderDoc = await orderRef.get();

      // Verifica si la orden existe
      if (!orderDoc.exists) {
        return res.status(404).json({ error: "Orden no encontrada" });
      }

      // Retorna los datos de la orden
      res.json({
        id: orderDoc.id,
        data: orderDoc.data(),
      });
    } catch (error) {
      console.error("Error al obtener la orden:", error);
      res.status(500).json({ error: "Error al obtener la orden" });
    }
  } else {
    res.status(500).json({ error: "Only admin can access to this endpoint" });
  }
});

// Update order status in order by id
app.put("/api/orders/:orderId", async (req, res) => {
  const orderId = req.params.orderId;
  const orderStatus = req.body.orderStatus;
  const userUid = req.body.userUid;
  const order = req.body.order;

  if (userUid === process.env.ADMIN_UID) {
    try {
      console.log(order);

      const orderRef = adminFirebaseApp
        .firestore()
        .collection("orders")
        .doc(orderId);

      await orderRef.update({
        state: orderStatus,
      });

      // Elimina los archivos de imagen asociados al pedido cuando el estado sea 'completed'
      if (orderStatus === "completed") {
        const bucket = adminFirebaseApp
          .storage()
          .bucket("gs://onionprint-49a4e.appspot.com");
        const folderPath = `files/${orderId}`;
        const [files] = await bucket.getFiles({ prefix: folderPath });

        await Promise.all(files.map((file) => file.delete()));

        console.log(
          `Se han eliminado los archivos asociados a la orderId '${orderId}'`
        );
      }

      await sendEmailWhenOrderStatusIsChanged(orderStatus, order);

      res.json({ message: "Estado del pedido actualizado correctamente" });
    } catch (error) {
      console.error("Error al actualizar el estado del pedido:", error);
      res
        .status(500)
        .json({ error: "Error al actualizar el estado del pedido" });
    }
  } else {
    console.log("Only admin can access to this endpoint");
    res.status(500).json({ error: "Only admin can access to this endpoint" });
  }
});

// Get all discounts
app.get("/api/discounts", async (req, res) => {
  const userUid = req.query.userUid;

  if (userUid === process.env.ADMIN_UID) {
    try {
      const discounts = await adminFirebaseApp
        .firestore()
        .collection("discounts")
        .get();

      const discountsArray = discounts.docs.map((doc) => {
        return {
          ...doc.data(),
          id: doc.id,
        };
      });

      res.json(discountsArray);
    } catch (error) {
      console.error("Error al obtener los descuentos:", error);
      res.status(500).json({ error: "Error al obtener los descuentos" });
    }
  } else {
    res.status(403).json({ error: "Only admin can access this endpoint" });
  }
});

// Get discount by id
app.get("/api/discounts/:discountId", async (req, res) => {
  const userUid = req.query.userUid;
  const discountId = req.params.discountId;

  if (userUid === process.env.ADMIN_UID) {
    try {
      const discount = await adminFirebaseApp
        .firestore()
        .collection("discounts")
        .doc(discountId)
        .get();
      res.json(discount.data());
    } catch (error) {
      console.error("Error al obtener el descuento:", error);
      res.status(500).json({ error: "Error al obtener el descuento" });
    }
  } else {
    res.status(500).json({ error: "Only admin can access to this endpoint" });
  }
});

// Create discount
app.post("/api/discounts", async (req, res) => {
  const userUid = req.body.userUid;
  const discount = req.body.discount;

  console.log("UID del usuario:", userUid);
  console.log("Descuento:", discount);

  if (userUid === process.env.ADMIN_UID) {
    try {
      await adminFirebaseApp.firestore().collection("discounts").add(discount);
      res.json({ message: "Descuento creado correctamente" });
    } catch (error) {
      console.error("Error al crear el descuento:", error);
      res.status(500).json({ error: "Error al crear el descuento" });
    }
  } else {
    res.status(403).json({ error: "Only admin can access to this endpoint" });
  }
});

// Update discount
app.put("/api/discounts", async (req, res) => {
  const userUid = req.body.userUid;
  const discount = req.body.discount;

  console.log("ACTUALIZAR DESCUENTO");
  console.log("UID del usuario:", userUid);
  console.log("Descuento:", discount);

  if (userUid === process.env.ADMIN_UID) {
    try {
      await adminFirebaseApp
        .firestore()
        .collection("discounts")
        .doc(discount.id)
        .update(discount);
      res.json({ message: "Descuento actualizado correctamente" });
    } catch (error) {
      console.error("Error al actualizar el descuento:", error);
      res.status(500).json({ error: "Error al actualizar el descuento" });
    }
  } else {
    res.status(500).json({ error: "Only admin can access to this endpoint" });
  }
});

// Delete discount
app.delete("/api/discounts", async (req, res) => {
  const userUid = req.body.userUid;
  const discount = req.body.discount;

  console.log("ELIMINAR DESCUENTO");
  console.log("UID del usuario:", userUid);
  console.log("Descuento:", discount);

  if (userUid === process.env.ADMIN_UID) {
    try {
      await adminFirebaseApp
        .firestore()
        .collection("discounts")
        .doc(discount.id)
        .delete();
      res.json({ message: "Descuento eliminado correctamente" });
    } catch (error) {
      console.error("Error al eliminar el descuento:", error);
      res.status(500).json({ error: "Error al eliminar el descuento" });
    }
  } else {
    res.status(403).json({ error: "Only admin can access to this endpoint" });
  }
});

// Check discount code
app.post("/api/discounts/check", async (req, res) => {
  const { discountName } = req.body;

  console.log("CHECK DISCOUNT CODE");
  console.log("Nombre del descuento:", discountName);

  if (!discountName || typeof discountName !== "string") {
    return res.json({
      success: false,
      error: "Invalid discount name provided",
    });
  }

  try {
    const discountsCollection = adminFirebaseApp
      .firestore()
      .collection("discounts");
    const querySnapshot = await discountsCollection
      .where("name", "==", discountName)
      .get();

    if (querySnapshot.empty) {
      console.error(`No existe un descuento con el nombre: ${discountName}`);
      return res.json({
        success: false,
        error: `No existe un descuento con el nombre: ${discountName}`,
      });
    }

    const discounts = [];
    let validationError = null;

    querySnapshot.forEach((doc) => {
      const discount = doc.data();
      discount.id = doc.id;

      // Comprobación de fecha de validez
      const currentDate = new Date();
      if (discount.startDate && discount.endDate) {
        const startDate = new Date(discount.startDate);
        const endDate = new Date(discount.endDate);
        if (currentDate < startDate || currentDate > endDate) {
          validationError = "El descuento no está vigente";
        }
      }

      // Comprobación del límite de usos
      if (discount.usageCount >= discount.usageLimit) {
        validationError = "El cupón ha alcanzado el límite máximo de usos";
      }

      if (!discount.active) {
        validationError = "El descuento no está activo";
      }

      if (!validationError) {
        discounts.push(discount);
      }
    });

    if (validationError) {
      console.error(validationError);
      return res.json({ success: false, error: validationError });
    }

    console.log("Discounts found:", discounts);
    return res.json({ success: true, discounts: discounts });
  } catch (error) {
    console.error("Error fetching discount:", error);
    return res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

// Incrementar contador de uso del descuento
app.post("/api/discounts/increment-usage-count", async (req, res) => {
  const discount = req.body.discount;

  console.log("INCREMENTAR CONTADOR DE USO DEL DESCUENTO");
  console.log(discount);

  if (!discount.id) {
    return res.status(400).json({ error: "Invalid discount ID provided" });
  }

  try {
    const discountRef = adminFirebaseApp
      .firestore()
      .collection("discounts")
      .doc(discount.id);

    await discountRef.update({ uses: admin.firestore.FieldValue.increment(1) });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error al incrementar el uso del descuento:", error);
    return res
      .status(500)
      .json({ error: "Error al incrementar el uso del descuento" });
  }
});

// MARK: Email
// [Email] Send email when order is created
app.post("/api/send-order-creation-email", (req, res) => {
  const order = req.body.order;
  const currentDate = new Date();

  console.log("SEND ORDER CREATION EMAIL");
  console.log(order);
  console.log(order.user);

  // Contenido HTML para el correo electrónico
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
            <img src="https://www.onionprint.online/assets/logo_negro.svg" alt="OnionPrint Logo">
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
                    ${order.items.map((item, index) => `<tr><td>${index + 1}</td><td>${item.pages}</td><td>${item.pricePerCopy}</td><td>${item.finalPrice}</td></tr>`).join('')}
                </tbody>
            </table>
            <p><strong>Total del Pedido:</strong> ${order.finalPrice}</p>
            
            <h2>Información de Envío</h2>
            <p><strong>Dirección de Envío:</strong> ${order.user.address}, ${order.user.postalCode}, España</p>
            <p><strong>Método de Envío:</strong> ${order.shipping == "standard" ? "Estandar" : "Prioritario"}</p>
            <p><strong>Estimación de Entrega:</strong> ${getEstimatedDeliveryDate(order)}</p>
            
            <h2>Información de Facturación</h2>
            <p><strong>Método de Pago:</strong> ${order.billingMethod == "card" ? "Tarjeta" : order.billingMethod}</p>
            <p><strong>Dirección de Facturación:</strong> ${order.user.address}</p>
            
            <h2>Seguimiento del Pedido</h2>
            <p>Una vez que tu pedido haya sido enviado, te enviaremos un correo electrónico con la información de seguimiento para que puedas rastrear tu paquete en tiempo real.</p>
            
            <p>Si tienes alguna pregunta o necesitas asistencia adicional, no dudes en contactarnos a través de <a href="mailto:[Correo de Atención al Cliente]">[Correo de Atención al Cliente]</a> o llamarnos al [Número de Teléfono].</p>
            
            <p>Gracias por confiar en <strong>OnionPrint</strong>. Esperamos que disfrutes de tus productos.</p>
            
            <p>Saludos cordiales,</p>
            <p>OnionPrint<br>
               [Dirección de la Empresa]<br>
               <a href="mailto:[Correo Electrónico de la Empresa]">[Correo Electrónico de la Empresa]</a><br>
               [Número de Teléfono de la Empresa]<br>
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
    subject: "NUEVO PEDIDO RECIBIDO 🎉",
    html: htmlContent,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error al enviar el correo electrónico:", error);
    } else {
      console.log("Correo electrónico enviado:", info.response);
    }
  });

  transporter.sendMail(mailOptions2, (error, info) => {
    if (error) {
      console.error("Error al enviar el correo electrónico:", error);
    } else {
      console.log("Correo electrónico enviado:", info.response);
    }
  });

  res.status(200);
});

// [Email] Send email when order status is changed
async function sendEmailWhenOrderStatusIsChanged(orderStatus, order) {
  if (orderStatus === "received") {
    return;
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: order.usuario.email,
    subject: "ACTUALIZACIÓN DE ESTADO DE PEDIDO 😎",
    text: "Se ha actualizado el estado del pedido a: " + orderStatus,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error al enviar el correo electrónico:", error);
    } else {
      console.log("Correo electrónico enviado:", info.response);
      res.status(200);
    }
  });
}

// Función para añadir días a una fecha dada en formato "dd/MM/yyyy"
function addDaysToDate(dateString, daysToAdd) {
  // Dividir la fecha
  const [day, month, year] = dateString.split('/').map(Number);

  // Crear un nuevo objeto Date con los componentes extraídos
  const date = new Date(year, month - 1, day);

  // Añadir los días especificados
  date.setDate(date.getDate() + daysToAdd);

  // Formatear la nueva fecha en el formato "dd/MM/yyyy"
  const newDay = String(date.getDate()).padStart(2, '0');
  const newMonth = String(date.getMonth() + 1).padStart(2, '0');
  const newYear = date.getFullYear();

  return `${newDay}/${newMonth}/${newYear}`;
}

function getEstimatedDeliveryDate(order) {
  if (order.shipping === "standard") {
    return `${addDaysToDate(order.creation_date, 2)} - addDaysToDate(order.creation_date, 3)`
  }

  return `${addDaysToDate(order.creation_date, 1)} - addDaysToDate(order.creation_date, 2)`
}

app.listen(3000, () => console.log(`Node server listening at PORT 3000`));
