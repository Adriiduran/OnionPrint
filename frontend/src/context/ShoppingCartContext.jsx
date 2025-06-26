import { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { useFilePreferences } from "./FilePreferencesContext";
import { useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';

// Creamos el contexto
const ShoppingCartContext = createContext();

//Billing Methods
const billingMethod = {
    card: "card",
    googlePay: "google pay",
    applePay: 'apple pay',
    paypal: "paypal"
}

// Shipping Methods
const shippingMethod = {
    standard: "standard",
    premium: "premium"
}

// Order States
const stateEnum = {
    recived: "recived",
    accepted: "accepted",
    delivered: "delivered",
    completed: "completed"
}

// Creamos un provider que contendrá el estado y las funciones relacionadas
export const ShoppingCartProvider = ({ children }) => {
    const { currentPreferences, filePreferences, resetCurrentPreferences } = useFilePreferences();
    const { user } = useAuth();

    const getInitialShoppingCartPreferences = (user) => ({
        id: '',
        items: [],
        user: {
            uid: user ? user.uid : '',
            name: '',
            email: '',
            phoneNumber: '',
            dni: '',
            address: '',
            postalCode: '',
            deliveryComments: '',
        },
        shipping: shippingMethod.standard,
        billingMethod: billingMethod.card,
        itemsPrice: 0,
        finalPrice: 0,
        discount: null,
        discountPrice: 0,
        creation_date: '',
        state: stateEnum.recived,
        stripe_payment_intent: {},
    });

    const [finalShoppingCartPreferences, setFinalShoppingCartPreferences] = useState({
        id: '',
        items: [],
        user: {
            uid: user != undefined ? user.uid : '',
            name: '',
            email: '',
            phoneNumber: '',
            dni: '',
            address: '',
            postalCode: '',
            deliveryComments: '',
        },
        shipping: shippingMethod.standard,
        billingMethod: billingMethod.card,
        itemsPrice: 0,
        finalPrice: 0,
        discount: null,
        discountPrice: 0,
        creation_date: '',
        state: stateEnum.recived,
        stripe_payment_intent: {},
    })

    const [shoppingCartPreferences, setShoppingCartPreferences] = useState({
        preference: {},
        pages: 0,
        files: [],
        pricePerCopy: 0,
        finalPrice: 0
    });

    useEffect(() => {
        setShoppingCartPreferences((prevPreferences) => {
            const updatedPreferences = { ...prevPreferences, preference: currentPreferences };
            return updatedPreferences;
        });
    }, [currentPreferences]);

    useEffect(() => {
        calculateCurrentPreferencePrice();
    }, [shoppingCartPreferences.preference, shoppingCartPreferences.pages]);

    useEffect(() => {
        if (finalShoppingCartPreferences.items.length > 0) {
            calculateFinalShoppingCartPrice();
        }
    }, [finalShoppingCartPreferences.items, finalShoppingCartPreferences.shipping, finalShoppingCartPreferences.discount]);

    useEffect(() => {
        if (user != undefined) {
            setFinalShoppingCartPreferences((prevPreferences) => ({
                ...prevPreferences,
                user: {
                    uid: user != undefined ? user.uid : null,
                    email: user != undefined ? user.email : null
                }
            }));
        }
    }, [user])

    // Función para actualizar las paginas actuales
    const updateCurrentShoppingCartPages = (newPages) => {
        setShoppingCartPreferences((prevPreferences) => {
            const updatedPages = prevPreferences.pages + newPages;
            return {
                ...prevPreferences,
                pages: updatedPages,
            };
        });
    };

    // Función para resetear las paginas actuales
    const resetCurrentShoppingCartPages = () => {
        setShoppingCartPreferences((prevPreferences) => {
            return {
                ...prevPreferences,
                pages: 0,
            };
        });
    }

    //Funcion para calcular el precio final de las preferencias actuales
    const calculateCurrentPreferencePrice = () => {
        let finalPrice = 0
        let pricePerCopy = 0
        let totalPages = 0

        if (shoppingCartPreferences.preference.size === filePreferences.paperSize.A4 ||
            shoppingCartPreferences.preference.size === filePreferences.paperSize.A3 ||
            shoppingCartPreferences.preference.size === filePreferences.paperSize.A5) {
            if (shoppingCartPreferences.preference.color === filePreferences.color.blackAndWhite) {
                pricePerCopy += 0.03;
            } else {
                pricePerCopy += 0.09;
            }

            if (shoppingCartPreferences.preference.size === filePreferences.paperSize.A5) {
                pricePerCopy = pricePerCopy / (1.5)
            } else if (shoppingCartPreferences.preference.size === filePreferences.paperSize.A3) {
                pricePerCopy = pricePerCopy * (2.7)
            }

            if (shoppingCartPreferences.preference.thickness === filePreferences.paperThickness['160GR']) {
                pricePerCopy = pricePerCopy * 5
            } else if (shoppingCartPreferences.preference.thickness === filePreferences.paperThickness['280GR']) {
                pricePerCopy = pricePerCopy * 6
            }

            if (shoppingCartPreferences.preference.printPerFace === filePreferences.printPerFace['2Pages'] ||
                shoppingCartPreferences.preference.printPerFace === filePreferences.printPerFace['2Slides']) {
                totalPages = shoppingCartPreferences.pages / 2
            } else if (shoppingCartPreferences.preference.printPerFace === filePreferences.printPerFace['4Slides']) {
                totalPages = shoppingCartPreferences.pages / 4
            } else {
                totalPages = shoppingCartPreferences.pages
            }
        } else {
            if (shoppingCartPreferences.preference.color === filePreferences.color.color) {
                pricePerCopy += 2;
            }

            if (shoppingCartPreferences.preference.size === filePreferences.paperSize.A2) {
                pricePerCopy += 2.90
            } else if (shoppingCartPreferences.preference.size === filePreferences.paperSize.A1) {
                pricePerCopy += 5.90
            } else {
                pricePerCopy += 8.90
            }

            if (shoppingCartPreferences.preference.thickness === filePreferences.paperThickness['200GR']) {
                pricePerCopy = pricePerCopy * 1.5
            } else if (shoppingCartPreferences.preference.thickness === filePreferences.paperThickness['300GR']) {
                pricePerCopy = pricePerCopy * 2
            }

            totalPages = shoppingCartPreferences.pages
        }

        finalPrice = Number(pricePerCopy.toFixed(2)) * shoppingCartPreferences.preference.copies * totalPages

        let finishesPrice = 0

        if (shoppingCartPreferences.preference.finishes === filePreferences.finishes.bound) {
            finishesPrice = 3.9
        } else if (shoppingCartPreferences.preference.finishes === filePreferences.finishes.stapling) {
            finishesPrice = 0.9
        } else if (shoppingCartPreferences.preference.finishes === filePreferences.finishes['2Holes']) {
            finishesPrice = 0.9
        } else if (shoppingCartPreferences.preference.finishes === filePreferences.finishes['4Holes']) {
            finishesPrice = 0.9
        } else if (shoppingCartPreferences.preference.finishes === filePreferences.finishes.laminated) {
            finishesPrice = totalPages
        }

        finalPrice += finishesPrice * shoppingCartPreferences.files.length

        setShoppingCartPreferences((prevPreferences) => {
            const updatedPreferences = { ...prevPreferences, pricePerCopy: Number(pricePerCopy.toFixed(2)), finalPrice: Number(finalPrice.toFixed(2)) };
            return updatedPreferences;
        });
    }

    //Añadir fichero a la lista de ficheros actuales
    const addCurrentFileToCurrentCart = (files) => {
        setShoppingCartPreferences((prevPreferences) => ({
            ...prevPreferences,
            files: files,
        }));
    }

    // Función para calcular la diferencia de descuento
    const calculateDiscountDifference = () => {
        const { itemsPrice, discount } = finalShoppingCartPreferences;
        const discountRate = discount.discount / 100;
        return Number((itemsPrice * discountRate).toFixed(2));
    };

    // Función para establecer el descuento final en el carrito de compras
    const setFinalShoppingCartDiscount = (discount) => {
        if (discount === null) {
            setFinalShoppingCartPreferences(prevPreferences => ({
                ...prevPreferences,
                discount: null,
                discountPrice: 0
            }));
            return;
        }

        setFinalShoppingCartPreferences(prevPreferences => ({
            ...prevPreferences,
            discount: discount
        }));
    };

    // Función para calcular el precio final de todos los items en el carrito
    const calculateFinalShoppingCartPrice = () => {
        let calculatedItemsPrice = 0;

        finalShoppingCartPreferences.items.forEach(item => {
            calculatedItemsPrice += item.finalPrice;
        });

        let calculatedFinalPrice = calculatedItemsPrice;
        let discountDifference = 0;

        // Verificar si existe un descuento y aplicarlo
        if (finalShoppingCartPreferences.discount !== null) {
            discountDifference = calculateDiscountDifference();
            calculatedFinalPrice = Number((calculatedItemsPrice - discountDifference).toFixed(2));
        }

        // Calcular costos de envío
        const { shipping } = finalShoppingCartPreferences;

        if (shipping === shippingMethod.standard) {
            if (calculatedItemsPrice < 39) {
                calculatedFinalPrice += 3.9;
            }
        } else {
            if (calculatedItemsPrice < 39) {
                calculatedFinalPrice += 8.8;
            } else {
                calculatedFinalPrice += 4.9;
            }
        }

        // Formatear la fecha y hora actual
        const fechaHoraActual = new Date();
        const opcionesFormato = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZone: 'Europe/Madrid'
        };
        const formatoEspaña = new Intl.DateTimeFormat('es-ES', opcionesFormato);
        const fechaHoraFormateada = formatoEspaña.format(fechaHoraActual);

        // Actualizar todas las propiedades necesarias en una sola llamada
        setFinalShoppingCartPreferences(prevPreferences => ({
            ...prevPreferences,
            itemsPrice: Number(calculatedItemsPrice.toFixed(2)),
            discountPrice: Number(discountDifference.toFixed(2)),
            creation_date: fechaHoraFormateada,
            finalPrice: Number(calculatedFinalPrice.toFixed(2))
        }));
    };

    //Añadir item actual al carrito final
    const addCurrentShoppingCartToFinal = () => {
        if (shoppingCartPreferences.files.length != 0) {
            setFinalShoppingCartPreferences((prevPreferences) => {
                const updatedItems = [...prevPreferences.items, shoppingCartPreferences];
                return {
                    ...prevPreferences,
                    items: updatedItems,
                };
            });

            resetCurrentShoppingCart();
            resetCurrentPreferences();
        }
    }

    //Eliminar fichero por posición de la lista de ficheros actuales
    const removeFileFromPositionInCurrentCart = (position) => {
        setShoppingCartPreferences((prevPreferences) => ({
            ...prevPreferences,
            files: prevPreferences.files.filter((_, index) => index !== position),
        }));
    }

    //Resetear carrito actual
    const resetCurrentShoppingCart = () => {
        setShoppingCartPreferences({ preference: {}, pages: 0, files: [], pricePerCopy: 0, finalPrice: 0 })
    }

    //Resetear carrito final
    const resetFinalShoppingCart = () => {
        setFinalShoppingCartPreferences(getInitialShoppingCartPreferences(user));
    };

    //Obtener las páginas totales
    const getTotalPages = () => {
        let totalPages = 0

        finalShoppingCartPreferences.items.forEach(element => {
            totalPages += element.pages
        });

        return totalPages
    }

    //Eliminar item del objeto final
    const removeItemFromFinalShoppingCart = (position) => {
        if ((position + 1) === finalShoppingCartPreferences.items.length) {
            resetFinalShoppingCart()
        } else {
            setFinalShoppingCartPreferences((prevPreferences) => ({
                ...prevPreferences,
                items: prevPreferences.items.filter((_, index) => index !== position),
            }));
        }
    }

    //Actualizar metodo de pago
    const updateBillingMethodFinalShoppingCart = (billing) => {
        setFinalShoppingCartPreferences((prevPreferences) => ({
            ...prevPreferences,
            billingMethod: billing,
        }));
    }

    //Actualizar metodo de envío
    const updateShippingMethodFinalShoppingCart = (shipping) => {
        setFinalShoppingCartPreferences((prevPreferences) => ({
            ...prevPreferences,
            shipping: shipping,
        }));
    }

    // Función para asignar el ID del pedido al objeto finalShoppingCartProperties
    const assignOrderIdToFinalCart = (orderId) => {
        setFinalShoppingCartPreferences((prevPreferences) => ({
            ...prevPreferences,
            id: orderId
        }));
    };

    return (
        <ShoppingCartContext.Provider value={{ finalShoppingCartPreferences, shoppingCartPreferences, updateCurrentShoppingCartPages, resetCurrentShoppingCart, resetFinalShoppingCart, addCurrentFileToCurrentCart, resetCurrentShoppingCartPages, removeFileFromPositionInCurrentCart, addCurrentShoppingCartToFinal, getTotalPages, removeItemFromFinalShoppingCart, updateBillingMethodFinalShoppingCart, billingMethod, stateEnum, shippingMethod, updateShippingMethodFinalShoppingCart, assignOrderIdToFinalCart, setFinalShoppingCartDiscount }}>
            {children}
        </ShoppingCartContext.Provider>
    );
};

// Función personalizada para acceder al contexto
export const useShoppingCart = () => {
    return useContext(ShoppingCartContext);
};

ShoppingCartProvider.propTypes = {
    children: PropTypes.node,
};