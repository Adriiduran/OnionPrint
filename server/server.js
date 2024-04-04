const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const { resolve } = require("path");
const cors = require('cors');
const env = require("dotenv").config({ path: "./.env" });
const resend = require('resend')
const newResend = new resend.Resend(process.env.RESEND_API_KEY);

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-08-01",
});

app.use(express.static(process.env.STATIC_DIR));
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  const path = resolve(process.env.STATIC_DIR + "/index.html");
  res.sendFile(path);
});

// Sends the publishable stripe key to the frontend
app.get("/config", (req, res) => {
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

// Sends firebase config to the frontend
app.get("/firebase-config", (req, res) => {
  res.send({
    api_key: process.env.FIREBASE_API_KEY,
    auth_domain: process.env.FIREBASE_AUTH_DOMAIN,
    project_id: process.env.FIREBASE_PROJECT_ID,
    storage_bucket: process.env.FIREBASE_STORAGE_BUCKET,
    messaging_sender_id: process.env.FIREBASE_MESSAGING_SENDER_ID,
    app_id: process.env.FIREBASE_APP_ID,
    measurement_id: process.env.FIREBASE_MEASUREMENT_ID
  });
})

// Created payment intent based on final cart preferences
app.post("/create-payment-intent", async (req, res) => {
  const data = req.body

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
        deliveryComments: data.user.deliveryComments
      }
    });

    console.log(paymentIntent)

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
app.post("/send-email", async (req, res) => {
  console.log('Ha entrado para mandar un correo')
  const finalShoppingCartPreferences = req.body

  const { data, error } = await newResend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to: [finalShoppingCartPreferences.user.email],
    subject: 'PEDIDO REALIZADO 😎',
    html: '<strong>It works!</strong>',
  });

  if (error) {
    console.log('Ha ocurrido un error al mandar el correo con error: ' + error)
    return console.error({ error });
  }
  
  console.log('Se ha mandado el correo correctamente')
  console.log(data)
  res.status(200).json({ data });
})

app.listen(5252, () =>
  console.log(`Node server listening at http://localhost:5252`)
);
