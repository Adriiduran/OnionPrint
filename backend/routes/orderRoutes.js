const express = require('express');
const router = express.Router();
const adminFirebaseApp = require('../services/firebase');
const { sendEmailWhenOrderStatusChanged } = require('../utils/email');

router.get('/orders', async (req, res) => {
  const userUid = req.query.userUid;

  if (userUid === process.env.ADMIN_UID) {
    try {
      const ordersRef = adminFirebaseApp.firestore().collection('orders');
      const snapshot = await ordersRef.orderBy('creation_date', 'desc').get();
      const orders = [];

      snapshot.forEach((doc) => {
        orders.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      res.json(orders);
    } catch (error) {
      console.error('Error al obtener las órdenes:', error);
      res.status(500).json({ error: 'Error al obtener las órdenes' });
    }
  } else {
    res.status(500).json({
      error: 'Only admin can access to this endpoint',
    });
  }
});

router.get('/orders/:orderId', async (req, res) => {
  const orderId = req.params.orderId;
  const userUid = req.query.userUid;

  if (userUid === process.env.ADMIN_UID) {
    try {
      const orderRef = adminFirebaseApp.firestore().collection('orders').doc(orderId);
      const orderDoc = await orderRef.get();

      if (!orderDoc.exists) {
        return res.status(404).json({ error: 'Orden no encontrada' });
      }

      res.json({
        id: orderDoc.id,
        data: orderDoc.data(),
      });
    } catch (error) {
      console.error('Error al obtener la orden:', error);
      res.status(500).json({ error: 'Error al obtener la orden' });
    }
  } else {
    res.status(500).json({ error: 'Only admin can access to this endpoint' });
  }
});

router.put('/orders/:orderId', async (req, res) => {
  const orderId = req.params.orderId;
  const orderStatus = req.body.orderStatus;
  const userUid = req.body.userUid;
  const order = req.body.order;

  if (userUid === process.env.ADMIN_UID) {
    try {
      const orderRef = adminFirebaseApp.firestore().collection('orders').doc(orderId);

      await orderRef.update({
        state: orderStatus,
      });

      if (orderStatus === 'completed') {
        const bucket = adminFirebaseApp.storage().bucket('gs://onionprint-49a4e.appspot.com');
        const folderPath = `files/${orderId}`;
        const [files] = await bucket.getFiles({ prefix: folderPath });

        await Promise.all(files.map((file) => file.delete()));

        console.log(`Se han eliminado los archivos asociados a la orderId '${orderId}'`);
      }

      await sendEmailWhenOrderStatusChanged(order);

      res.status(200).end();
    } catch (error) {
      console.error('Error al actualizar el estado del pedido:', error);
      res.status(500).end();
    }
  } else {
    console.log('Only admin can access to this endpoint');
    res.status(500).json({ error: 'Only admin can access to this endpoint' });
  }
});

module.exports = router;
