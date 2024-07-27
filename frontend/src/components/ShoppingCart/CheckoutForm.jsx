import { useNavigate } from "react-router-dom";
import { PaymentElement } from "@stripe/react-stripe-js";
import { useState } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { toast } from 'react-toastify';
import Loader from '../../components/Loader/Loader.jsx'
import axios from "axios";

//Context
import { useShoppingCart } from '../../context/ShoppingCartContext';
import { getNewOrderRef, saveFinalCartOnFirebase } from "../../config/firebase";

import './CheckoutForm.css';

export default function CheckoutForm() {
  const navigator = useNavigate();
  const { finalShoppingCartPreferences, resetFinalShoppingCart } = useShoppingCart();
  const stripe = useStripe();
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!stripe || !elements) {
      return;
    }
  
    setIsProcessing(true);
  
    const newOrderRef = getNewOrderRef();
    finalShoppingCartPreferences.id = newOrderRef.id;
  
    try {
      const paymentIntent = await stripe.confirmPayment({
        elements,
        confirmParams: {},
        redirect: 'if_required',
      });
  
      console.log("Confirmed payment");
      finalShoppingCartPreferences.stripe_payment_intent = paymentIntent.paymentIntent;
    } catch (error) {
      let message;
      if (error.type === "card_error" || error.type === "validation_error") {
        message = error.message;
      } else {
        message = "Ha ocurrido un error inesperado. Por favor intentelo en unos minutos.";
      }
  
      toast.error(message, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        theme: 'light',
      });
  
      setIsProcessing(false);
      return;
    }
  
    try {
      await saveFinalCartOnFirebase(finalShoppingCartPreferences, newOrderRef);
      console.log("Saved on firebase");
  
      if (finalShoppingCartPreferences.discount !== null) {
        let discount = finalShoppingCartPreferences.discount;
  
        await axios.post(`${import.meta.env.VITE_API_URL}/discounts/increment-usage-count`, {
          discount: discount,
        });
        console.log("Incremented usage count");
      }
    } catch (error) {
      console.error(error);
      setIsProcessing(false);
      toast.error('No se ha podido guardar el pedido', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        theme: 'light',
      });
      navigator("/");
      resetFinalShoppingCart();
      return;
    }
  
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/send-order-creation-email`, {
        order: finalShoppingCartPreferences,
      });
      console.log("Sent order creation email");
    } catch (error) {
      console.error(error);
      setIsProcessing(false);
      toast.error('No se ha podido enviar el correo de confirmación', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        theme: 'light',
      });
      navigator("/");
      resetFinalShoppingCart();
      return;
    }
  
    console.log("LLega al final de la función");
    setIsProcessing(false);
    toast.success('Pedido creado con éxito!', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      theme: 'light',
    });
    resetFinalShoppingCart();
    navigator("/");
  };
  

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button disabled={isProcessing || !stripe || !elements} className="confirmPaymentButton">
        <span>
          {isProcessing ? "PROCESANDO PAGO... " : `PAGAR ${finalShoppingCartPreferences.finalPrice}€`}
        </span>
        { isProcessing ? <Loader /> : <img src={`${import.meta.env.VITE_ASSETS_URL}/lock.png`} alt="Icono de pago seguro" /> }
      </button>
    </form>
  );
}
