import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, collection } from "firebase/firestore";
import axios from "axios";

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: "",
};

let app, storage, firestore = null;

try {
  axios.get("http://localhost:5252/firebase-config")
    .then(response => {
      firebaseConfig.apiKey = response.data.api_key;
      firebaseConfig.authDomain = response.data.auth_domain;
      firebaseConfig.projectId = response.data.project_id;
      firebaseConfig.storageBucket = response.data.storage_bucket;
      firebaseConfig.messagingSenderId = response.data.messaging_sender_id;
      firebaseConfig.appId = response.data.app_id;
      firebaseConfig.measurementId = response.data.measurement_id;

      // Initialize Firebase
      app = initializeApp(firebaseConfig);
      storage = getStorage(app);
      firestore = getFirestore(app);
    })
    .catch(error => {
      console.log("Ha ocurrido un error al intentar cargar firebase con error: " + error);
    });
} catch (error) {
  console.log("Ha ocurrido un error al intentar cargar firebase con error: " + error);
}

const getNewOrderRef = () => {
  // Crear una nueva colección 'orders' en Firestore
  const ordersCollection = collection(firestore, "orders");

  // Agregar el objeto sin los archivos a Firestore
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

    console.log("Pedido añadido a Firestore con archivos relacionados");
  } catch (error) {
    console.error("Error al guardar el objeto en Firebase:", error);
  }
};

export { app, firestore, saveFinalCartOnFirebase, getNewOrderRef };
