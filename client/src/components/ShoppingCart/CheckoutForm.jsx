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
    console.log(newOrderRef)
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

        axios.post("http://localhost:5252/send-email", {finalShoppingCartPreferences})

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
        console.log('Ha ocurrido un error al guardar o enviar el email de pedido')
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
        <img src="/src/assets/lock.png" alt="Icono de pago seguro" />
      </button>
      {message && <div>{message}</div>}
    </form>
  );
}
