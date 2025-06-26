const express = require('express');
const router = express.Router();
const adminFirebaseApp = require('../services/firebase');

router.get('/users', async (req, res) => {
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
      res.status(500).json({ error: 'Error al obtener la lista de usuarios' });
    }
  } else {
    res.status(500).json({
      error: 'Only admin can access to this endpoint',
    });
  }
});

module.exports = router;
