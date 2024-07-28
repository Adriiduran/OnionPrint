import { useNavigate } from "react-router-dom";
import { PaymentElement } from "@stripe/react-stripe-js";
import { useState } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { toast } from 'react-toastify';
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


  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const newOrderRef = getNewOrderRef();
    finalShoppingCartPreferences.id = newOrderRef.id

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
      },
      redirect: 'if_required',
    });

    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message);
      } else {
        setMessage("Ha ocurrido un error inesperado. Por favor intentelo en unos minutos.");
      }
    } else {
      finalShoppingCartPreferences.stripe_payment_intent = paymentIntent
      try {
        await saveFinalCartOnFirebase(finalShoppingCartPreferences, newOrderRef)

        if (finalShoppingCartPreferences.discount !== null) {
          let discount = finalShoppingCartPreferences.discount

          await axios.post(`${import.meta.env.VITE_API_URL}/discounts/increment-usage-count`, {
            discount: discount
          });
        }

        // TODO: Send email to user

        // await axios.post(`${import.meta.env.VITE_API_URL}/send-order-creation-email`, {finalShoppingCartPreferences})

        resetFinalShoppingCart();

        toast.success('Pedido creado con éxito!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          theme: 'light',
        });

        navigator('/')
      } catch (error) {
        console.log(error)
      }
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button disabled={isProcessing || !stripe || !elements} className="confirmPaymentButton">
        <span>
          {isProcessing ? "PROCESANDO PAGO... " : `PAGAR ${finalShoppingCartPreferences.finalPrice}€`}
        </span>
        <img src={`${import.meta.env.VITE_ASSETS_URL}/lock.png`} alt="Icono de pago seguro" />
      </button>
      {message && <div>{message}</div>}
    </form>
  );
}
