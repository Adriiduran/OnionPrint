import { useEffect, useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import Loader from '../../components/Loader/Loader.jsx'
import axios from "axios";

// Context
import { useShoppingCart } from '../../context/ShoppingCartContext';
import { getNewOrderRef, saveFinalCartOnFirebase } from "../../config/firebase";

import './CheckoutForm.css';

export default function CheckoutForm() {
  const navigate = useNavigate();
  const { finalShoppingCartPreferences, resetFinalShoppingCart } = useShoppingCart();
  const stripe = useStripe();
  const elements = useElements();
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
      const { error: paymentError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: "https://onionprint.online/app",
        },
        redirect: 'if_required',
      });

      if (paymentError) {
        handlePaymentError(paymentError);
        setIsProcessing(false);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        await handleSuccessfulPayment(paymentIntent, newOrderRef);
      } else {
        throw new Error('El pago no se ha completado correctamente');
      }
    } catch (error) {
      handlePaymentError(error);
      setIsProcessing(false);
    }
  };

  const handleSuccessfulPayment = async (paymentIntent, newOrderRef) => {
    finalShoppingCartPreferences.stripe_payment_intent = paymentIntent;

    try {
      await saveFinalCartOnFirebase(finalShoppingCartPreferences, newOrderRef);
      if (finalShoppingCartPreferences.discount) {
        await incrementDiscountUsage(finalShoppingCartPreferences.discount);
      }
      await sendOrderCreationEmail(finalShoppingCartPreferences);
      toast.success('Pedido creado con éxito!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        theme: 'light',
      });
      resetFinalShoppingCart();
      navigate("/order-confirmation");
    } catch (error) {
      console.error('Error en el manejo del pago:', error);
      handlePaymentError(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentError = (error) => {
    let message;
    if (error.type === "card_error" || error.type === "validation_error") {
      message = error.message;
    } else {
      message = "Ha ocurrido un error inesperado. Por favor, inténtelo en unos minutos.";
    }

    toast.error(message, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      theme: 'light',
    });

    setIsProcessing(false);
  };

  const sendOrderCreationEmail = async (order) => {
    return await axios.post(`${import.meta.env.VITE_API_URL}/send-order-creation-email`, { order });
  };

  const incrementDiscountUsage = async (discount) => {
    return await axios.post(`${import.meta.env.VITE_API_URL}/discounts/increment-usage-count`, { discount });
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
