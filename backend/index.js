const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const { resolve } = require("path");
const cors = require("cors");
const env = require("dotenv").config({ path: "./.env" });
const nodemailer = require("nodemailer");
const admin = require("firebase-admin");
const { error } = require("console");

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
  res.json({ message: "Esto funciona ma nigga" })
});

// Sends the publishable stripe key to the frontend
app.get("/api/stripe-config", (req, res) => {
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

app.get("/.well-known/apple-developer-merchantid-domain-association", (req, res) => {
  res.status(200).sendFile(resolve(process.env.STATIC_DIR + "/apple-developer-merchantid-domain-association"));
})

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
  const order = req.body.order

  if (userUid === process.env.ADMIN_UID) {
    try {
      console.log(order)

      const orderRef = adminFirebaseApp
        .firestore()
        .collection("orders")
        .doc(orderId);

      await orderRef.update({
        state: orderStatus,
      });

      // Elimina los archivos de imagen asociados al pedido cuando el estado sea 'completed'
      if (orderStatus === "completed") {
        const bucket = adminFirebaseApp.storage().bucket("gs://onionprint-49a4e.appspot.com");
        const folderPath = `files/${orderId}`;
        const [files] = await bucket.getFiles({ prefix: folderPath });

        await Promise.all(files.map(file => file.delete()));

        console.log(`Se han eliminado los archivos asociados a la orderId '${orderId}'`);
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
    console.log('Only admin can access to this endpoint')
    res.status(500).json({ error: "Only admin can access to this endpoint" });
  }
});

// Created payment intent based on final cart preferences
app.post("/api/create-payment-intent", async (req, res) => {
  const data = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "EUR",
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

// Send new email with user data
app.post("/api/send-order-creation-email", (req, res) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: req.body.user.email,
    subject: "PEDIDO REALIZADO 😎",
    text:
      "Se ha realizado un pedido con un precio final de: " +
      req.body.finalPrice,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error al enviar el correo electrónico:", error);
    } else {
      console.log("Correo electrónico enviado:", info.response);
      res.status(200);
    }
  });
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
      const discountsArray = discounts.docs.map((doc) => doc.data());
      res.json(discountsArray);
    } catch (error) {
      console.error("Error al obtener los descuentos:", error);
      res.status(500).json({ error: "Error al obtener los descuentos" });
    }
  } else {
    res.status(500).json({ error: "Only admin can access to this endpoint" });
  }
})

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
})

// Create discount
app.post("/api/discounts", async (req, res) => {
  const userUid = req.body.userUid;
  const discount = req.body.discount;

  if (userUid === process.env.ADMIN_UID) {
    try {
      await adminFirebaseApp
        .firestore()
        .collection("discounts")
        .add(discount);
      res.json({ message: "Descuento creado correctamente" });
    } catch (error) {
      console.error("Error al crear el descuento:", error);
      res
        .status(500)
        .json({ error: "Error al crear el descuento" });
    }
  } else {
    res.status(500).json({ error: "Only admin can access to this endpoint" });
  }
})

// Update discount
app.put("/api/discounts/:discountId", async (req, res) => {
  const userUid = req.body.userUid;
  const discountId = req.params.discountId;
  const discount = req.body.discount;

  if (userUid === process.env.ADMIN_UID) {
    try {
      await adminFirebaseApp
        .firestore()
        .collection("discounts")
        .doc(discountId)
        .update(discount);
      res.json({ message: "Descuento actualizado correctamente" });
    } catch (error) {
      console.error("Error al actualizar el descuento:", error);
      res
        .status(500)
        .json({ error: "Error al actualizar el descuento" });
    }
  } else {
    res.status(500).json({ error: "Only admin can access to this endpoint" });
  }
})

// Delete discount
app.delete("/api/discounts/:discountId", async (req, res) => {
  const userUid = req.body.userUid;
  const discountId = req.params.discountId;

  if (userUid === process.env.ADMIN_UID) {
    try {
      await adminFirebaseApp
        .firestore()
        .collection("discounts")
        .doc(discountId)
        .delete();
      res.json({ message: "Descuento eliminado correctamente" });
    } catch (error) {
      console.error("Error al eliminar el descuento:", error);
      res
        .status(500)
        .json({ error: "Error al eliminar el descuento" });
    }
  } else {
    res.status(500).json({ error: "Only admin can access to this endpoint" });
  }
})

// Send email when order status is changed
async function sendEmailWhenOrderStatusIsChanged(orderStatus, order) {
  if (orderStatus === "received") {
    return
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: order.usuario.email,
    subject: "ACTUALIZACIÓN DE ESTADO DE PEDIDO 😎",
    text:
      "Se ha actualizado el estado del pedido a: " +
      orderStatus,
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

app.listen(3000, () =>
  console.log(`Node server listening at PORT 3000`)
);
