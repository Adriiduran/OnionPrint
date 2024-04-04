import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCQJDrir0SeuDUmWskTFjJTvcSbsUyTDow",
  authDomain: "onionprint-49a4e.firebaseapp.com",
  projectId: "onionprint-49a4e",
  storageBucket: "onionprint-49a4e.appspot.com",
  messagingSenderId: "229769973826",
  appId: "1:229769973826:web:230e4eed524ab20a1e9ddb",
  measurementId: "G-98S9YRSQBC",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const firestore = getFirestore(app);

const getNewOrderRef = () => {
  // Crear una nueva colección 'orders' en Firestore
  const ordersCollection = collection(firestore, "orders");

  // Agregar el objeto sin los archivos a Firestore
  const newOrderRef = doc(ordersCollection);

  return newOrderRef
};

// Función para guardar el objeto en Firestore y subir archivos a Storage
const saveFinalCartOnFirebase = async (finalShoppingCartPreferences, newOrderRef) => {
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
      stripe_payment_intent: finalShoppingCartPreferences.stripe_payment_intent
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
                `files/${newOrderRef}/${itemIndex}_${archivoIndex}`
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
