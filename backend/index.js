const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
require('dotenv').config({ path: './.env' });

app.use(express.static(process.env.STATIC_DIR));
app.use(bodyParser.json());
app.use(cors());

const stripeRoutes = require('./routes/stripeRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const discountRoutes = require('./routes/discountRoutes');
const emailRoutes = require('./routes/emailRoutes');

app.get('/', (req, res) => {
  const file = path.resolve(process.env.STATIC_DIR + '/index.html');
  res.sendFile(file);
});

app.get('/.well-known/apple-developer-merchantid-domain-association', (req, res) => {
  const filePath = path.join(__dirname, '../frontend/public/.well-known/apple-developer-merchantid-domain-association');
  res.sendFile(filePath);
});

app.use('/api', stripeRoutes);
app.use('/api', userRoutes);
app.use('/api', orderRoutes);
app.use('/api', discountRoutes);
app.use('/api', emailRoutes);

app.listen(3000, () => console.log(`Node server listening at PORT 3000`));
