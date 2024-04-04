import { useNavigate } from "react-router-dom";
import { PaymentElement } from "@stripe/react-stripe-js";
import { useState } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";

//Context
import { useShoppingCart } from '../../context/ShoppingCartContext';
import { getNewOrderRef, saveFinalCartOnFirebase } from "../../config/firebase";

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
      await saveFinalCartOnFirebase(finalShoppingCartPreferences, newOrderRef)

      await fetch("http://localhost:5252/send-email", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(finalShoppingCartPreferences),
      });

      resetFinalShoppingCart();
    
      navigator('/completion')
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button disabled={isProcessing || !stripe || !elements}>
        <span>
          {isProcessing ? "Procesando... " : `Pagar ${finalShoppingCartPreferences.finalPrice}€`}
        </span>
      </button>
      {message && <div>{message}</div>}
    </form>
  );
}
