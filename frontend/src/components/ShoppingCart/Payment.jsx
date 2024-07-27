import { useEffect, useState } from "react";

import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

//Context
import { useShoppingCart } from '../../context/ShoppingCartContext';

export default function Payment() {
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const { finalShoppingCartPreferences } = useShoppingCart();

  useEffect(() => {
    const fetchStripeConfig = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/stripe-config`);
        const { publishableKey } = response.data;
        setStripePromise(loadStripe(publishableKey));
      } catch (error) {
        console.error('Error fetching Stripe config:', error);
      }
    };

    fetchStripeConfig();
  }, []);

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/create-payment-intent`,
          finalShoppingCartPreferences,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        const { clientSecret } = response.data;
        setClientSecret(clientSecret);
      } catch (error) {
        console.error('Error creating payment intent:', error);
      }
    };

    createPaymentIntent();
  }, [stripePromise]);

  return (
    <>
      {clientSecret && stripePromise && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm />
        </Elements>
      )}
    </>
  );
}
