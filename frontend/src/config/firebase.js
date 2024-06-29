import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig, "frontend");
const storage = getStorage(app);
const firestore = getFirestore(app);

// Función para crear una nueva colección 'orders' en Firestore
const getNewOrderRef = () => {
  const ordersCollection = collection(firestore, "orders");
  const newOrderRef = doc(ordersCollection);

  return newOrderRef;
};

// Función para guardar el objeto en Firestore y subir archivos a Storage
const saveFinalCartOnFirebase = async (
  finalShoppingCartPreferences,
  newOrderRef
) => {
  try {
    const cleanItems = finalShoppingCartPreferences.items.map((item) => {
      // Crear un nuevo objeto con todos los campos excepto 'files'
      const { files, ...cleanedItem } = item;
      return cleanedItem;
    });

    await setDoc(newOrderRef, {
      // ...otros campos del objeto (sin archivos)
      id: newOrderRef.id,
      items: cleanItems,
      user: finalShoppingCartPreferences.user,
      shipping: finalShoppingCartPreferences.shipping,
      billingMethod: finalShoppingCartPreferences.billingMethod,
      itemsPrice: finalShoppingCartPreferences.itemsPrice,
      finalPrice: finalShoppingCartPreferences.finalPrice,
      creation_date: finalShoppingCartPreferences.creation_date,
      state: finalShoppingCartPreferences.state,
      filesInfo: {}, // Inicializar la propiedad filesURL como un objeto vacío
      stripe_payment_intent: finalShoppingCartPreferences.stripe_payment_intent,
    });

    // Subir cada archivo a Firebase Storage con el mismo ID como referencia
    await Promise.all(
      finalShoppingCartPreferences.items.map(async (item, itemIndex) => {
        if (item.files && item.files.length > 0) {
          const filesInfo = {}; // Crear un objeto para almacenar las URLs de los archivos

          await Promise.all(
            item.files.map(async (archivo, archivoIndex) => {
              const storageRef = ref(
                storage,
                `files/${newOrderRef.id}/${itemIndex}_${archivoIndex}`
              );
              await uploadBytes(storageRef, archivo);
              const downloadURL = await getDownloadURL(storageRef);

              const fileName = archivo.name;

              // Agregar la URL del archivo al objeto filesURL
              if (!filesInfo[itemIndex]) {
                filesInfo[itemIndex] = [];
              }
              filesInfo[itemIndex].push({ name: fileName, url: downloadURL });
            })
          );

          // Actualizar el objeto con las URLs de los archivos en Firestore
          const fieldPath = "filesInfo";
          await setDoc(
            newOrderRef,
            { [fieldPath]: filesInfo },
            { merge: true }
          );
        }
      })
    );
  } catch (error) {
    console.error("Error al guardar el objeto en Firebase:", error);
  }
};

export { app, firestore, saveFinalCartOnFirebase, getNewOrderRef };
