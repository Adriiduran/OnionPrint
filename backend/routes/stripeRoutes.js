const express = require('express');
const router = express.Router();
const stripe = require('../services/stripe');

router.get('/stripe-config', (req, res) => {
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

router.post('/create-payment-intent', async (req, res) => {
  const data = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      currency: 'eur',
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

module.exports = router;
