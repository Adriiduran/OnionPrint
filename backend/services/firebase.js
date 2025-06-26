const admin = require('firebase-admin');

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
  'admin'
);

module.exports = adminFirebaseApp;
