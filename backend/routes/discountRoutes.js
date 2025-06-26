const express = require('express');
const router = express.Router();
const adminFirebaseApp = require('../services/firebase');
const admin = require('firebase-admin');

router.get('/discounts', async (req, res) => {
  const userUid = req.query.userUid;

  if (userUid === process.env.ADMIN_UID) {
    try {
      const discounts = await adminFirebaseApp.firestore().collection('discounts').get();

      const discountsArray = discounts.docs.map((doc) => {
        return {
          ...doc.data(),
          id: doc.id,
        };
      });

      res.json(discountsArray);
    } catch (error) {
      console.error('Error al obtener los descuentos:', error);
      res.status(500).json({ error: 'Error al obtener los descuentos' });
    }
  } else {
    res.status(403).json({ error: 'Only admin can access this endpoint' });
  }
});

router.get('/discounts/:discountId', async (req, res) => {
  const userUid = req.query.userUid;
  const discountId = req.params.discountId;

  if (userUid === process.env.ADMIN_UID) {
    try {
      const discount = await adminFirebaseApp
        .firestore()
        .collection('discounts')
        .doc(discountId)
        .get();
      res.json(discount.data());
    } catch (error) {
      console.error('Error al obtener el descuento:', error);
      res.status(500).json({ error: 'Error al obtener el descuento' });
    }
  } else {
    res.status(500).json({ error: 'Only admin can access to this endpoint' });
  }
});

router.post('/discounts', async (req, res) => {
  const userUid = req.body.userUid;
  const discount = req.body.discount;

  if (userUid === process.env.ADMIN_UID) {
    try {
      await adminFirebaseApp.firestore().collection('discounts').add(discount);
      res.json({ message: 'Descuento creado correctamente' });
    } catch (error) {
      console.error('Error al crear el descuento:', error);
      res.status(500).json({ error: 'Error al crear el descuento' });
    }
  } else {
    res.status(403).json({ error: 'Only admin can access to this endpoint' });
  }
});

router.put('/discounts', async (req, res) => {
  const userUid = req.body.userUid;
  const discount = req.body.discount;

  if (userUid === process.env.ADMIN_UID) {
    try {
      await adminFirebaseApp
        .firestore()
        .collection('discounts')
        .doc(discount.id)
        .update(discount);
      res.json({ message: 'Descuento actualizado correctamente' });
    } catch (error) {
      console.error('Error al actualizar el descuento:', error);
      res.status(500).json({ error: 'Error al actualizar el descuento' });
    }
  } else {
    res.status(500).json({ error: 'Only admin can access to this endpoint' });
  }
});

router.delete('/discounts', async (req, res) => {
  const userUid = req.body.userUid;
  const discount = req.body.discount;

  if (userUid === process.env.ADMIN_UID) {
    try {
      await adminFirebaseApp
        .firestore()
        .collection('discounts')
        .doc(discount.id)
        .delete();
      res.json({ message: 'Descuento eliminado correctamente' });
    } catch (error) {
      console.error('Error al eliminar el descuento:', error);
      res.status(500).json({ error: 'Error al eliminar el descuento' });
    }
  } else {
    res.status(403).json({ error: 'Only admin can access to this endpoint' });
  }
});

router.post('/discounts/check', async (req, res) => {
  const { discountName } = req.body;

  if (!discountName || typeof discountName !== 'string') {
    return res.json({
      success: false,
      error: 'Invalid discount name provided',
    });
  }

  try {
    const discountsCollection = adminFirebaseApp.firestore().collection('discounts');
    const querySnapshot = await discountsCollection.where('name', '==', discountName).get();

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

      const currentDate = new Date();
      if (discount.startDate && discount.endDate) {
        const startDate = new Date(discount.startDate);
        const endDate = new Date(discount.endDate);
        if (currentDate < startDate || currentDate > endDate) {
          validationError = 'El descuento no está vigente';
        }
      }

      if (discount.usageCount >= discount.usageLimit) {
        validationError = 'El cupón ha alcanzado el límite máximo de usos';
      }

      if (!discount.active) {
        validationError = 'El descuento no está activo';
      }

      if (!validationError) {
        discounts.push(discount);
      }
    });

    if (validationError) {
      console.error(validationError);
      return res.json({ success: false, error: validationError });
    }

    console.log('Discounts found:', discounts);
    return res.json({ success: true, discounts: discounts });
  } catch (error) {
    console.error('Error fetching discount:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

router.post('/discounts/increment-usage-count', async (req, res) => {
  const discount = req.body.discount;

  if (!discount.id) {
    return res.status(400).json({ error: 'Invalid discount ID provided' });
  }

  try {
    const discountRef = adminFirebaseApp.firestore().collection('discounts').doc(discount.id);
    await discountRef.update({ uses: admin.firestore.FieldValue.increment(1) });
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error al incrementar el uso del descuento:', error);
    return res.status(500).json({ error: 'Error al incrementar el uso del descuento' });
  }
});

module.exports = router;
