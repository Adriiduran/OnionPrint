import { useState } from 'react';
import './ShoppingCart.css';
import { Link } from 'react-router-dom';
import { useMediaQuery } from '@mui/material';

//Context
import { useShoppingCart } from '../../context/ShoppingCartContext';
import { saveFinalCartOnFirebase } from '../../config/firebase';

function ShoppingCart() {
    const { finalShoppingCartPreferences, resetFinalShoppingCart, getTotalPages, removeItemFromFinalShoppingCart, billingMethod, updateBillingMethodFinalShoppingCart, shippingMethod, updateShippingMethodFinalShoppingCart } = useShoppingCart();

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        dni: '',
        phoneNumber: '',
        address: '',
        postalCode: '',
        deliveryComments: ''
    });
    const [errors, setErrors] = useState({
        nameError: '',
        emailError: '',
        dniError: '',
        phoneNumberError: '', 
        addressError: '',
        postalCodeError: ''
    });
    const [openFileIndex, setOpenFileIndex] = useState(null); // Estado para controlar el elemento abierto
    const isMobile = useMediaQuery('(max-width:768px)');

    // Función para manejar el clic en un elemento de archivos
    const handleToggleFile = (index) => {
        setOpenFileIndex(openFileIndex === index ? null : index); // Si es el mismo índice, ciérralo; de lo contrario, ábrelo
    };

    // Renderizado de los nombres de los archivos
    const renderFiles = (files, index) => {
        if (openFileIndex === index) {
            return (
                <div key={index}>
                    {files.map((file, i) => (
                        <p style={{ padding: '5px 20px', fontSize: 'small'}} key={i}>{i + 1} - {file.name}</p>
                    ))}
                </div>
            );
        }
        return null;
    };

    // Funcion que controla el cambio de los elementos del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        finalShoppingCartPreferences.user[name] = value

        // Limpiar el error cuando el usuario comienza a escribir en el campo
        setErrors({
            ...errors,
            [`${name}Error`]: ''
        });
    };

    // Funcion que valida el input introducido en los campos del formulario
    const validateForm = () => {
        let isValid = true;
        const { name, email, dni, address, postalCode, phoneNumber } = formData;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const dniRegex = /^[0-9]{8}[A-Za-z]$/;
        const postalCodeRegex = /^[0-9]{5}$/;
        const phoneRegex = /^[0-9]{9}$/;

        if (name.trim() === '') {
            setErrors(prevErrors => ({ ...prevErrors, nameError: 'Este campo es obligatorio.' }));
            isValid = false;
        }

        if (!emailRegex.test(email)) {
            setErrors(prevErrors => ({ ...prevErrors, emailError: 'Introduce un correo electrónico válido.' }));
            isValid = false;
        }

        if (!dniRegex.test(dni)) {
            setErrors(prevErrors => ({ ...prevErrors, dniError: 'Introduce un DNI válido.' }));
            isValid = false;
        }

        if (address.trim() === '') {
            setErrors(prevErrors => ({ ...prevErrors, addressError: 'Este campo es obligatorio.' }));
            isValid = false;
        }

        if (!postalCodeRegex.test(postalCode)) {
            setErrors(prevErrors => ({ ...prevErrors, postalCodeError: 'Introduce un código postal válido.' }));
            isValid = false;
        }

        if (!phoneRegex.test(phoneNumber)) {
            setErrors(prevErrors => ({ ...prevErrors, phoneNumberError: 'Introduce un número de teléfono válido.' }));
            isValid = false;
        }

        return isValid;
    };

    // Funcion que controla si es necesaria la creación de un nuevo pedido
    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            handleCreateOrder()
        }
    };

    // Funcion que se encarga de crear un nuevo pedido
    const handleCreateOrder = async () => {
        try {
            setLoading(true);
            await saveFinalCartOnFirebase(finalShoppingCartPreferences);
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

    // Funciones que se encargar de pintar las etiquetas abreviadas para la configuración del archivo
    const labelForPrintPerFace = (title) => {
        if (title === 'NORMAL') {
            return '1P'
        } else if (title === '2 PÁGINAS') {
            return '2P'
        } else if (title === '2 DIAPOSITIVAS') {
            return '2D'
        } else {
            return '4D'
        }
    }

    const labelForOrientation = (title) => {
        if (title === 'AUTOMÁTICA') {
            return 'AUTO'
        } else if (title === 'VERTICAL') {
            return 'VER'
        } else {
            return 'HOR'
        }
    }

    const labelForFinishes = (title) => {
        if (title === 'SIN ACABADO') {
            return 'SA'
        } else if (title === 'ENCUADERNADO') {
            return 'EN'
        } else if (title === 'GRAPADO') {
            return 'GR'
        } else if (title === '2 AGUJEROS') {
            return '2A'
        } else if (title === '4 AGUJEROS') {
            return '4A'
        } else {
            return 'PL'
        }
    }

    if (isMobile) {
        return (
            <div className='shoppingCart'>
                {/* Información del pedido */}
                <div className='shoppingCartItemList'>
                    <div className='shoppingCartItemListTitle'>
                        <div className='shoppingCartItemListTitleFirst'>
                            <img src="/src/assets/tasks.png" alt="Task items" />
                            <h3>Información de tu pedido</h3>
                        </div>
                        <span>Listado de configuraciones de impresión para imprimir.</span>
                    </div>
                    <div className='shoppingCartItemListCounter'>
                        <h2>{finalShoppingCartPreferences.items.length} productos de impresión</h2>
                    </div>
                    <div className='shoppingCartItemListDetails' style={{ display: finalShoppingCartPreferences.items.length === 0 ? 'none' : 'flex' }}>
                        {finalShoppingCartPreferences.items.map((element, index) => (
                            <div className="shoppingCartItemListDetailsItem" key={index}>
                                <div className='shoppingCartItemListDetailsItemData'>
                                    <div className='shoppingCartItemListDetailsItemDataFirst'>
                                        <img src="/src/assets/pageSetupIcon.png" alt="Page Setup" />
                                        <p onClick={() => removeItemFromFinalShoppingCart(index)}>×</p>
                                    </div>
                                    <span>Impresión en {element.preference.color.description.toLowerCase()} en folios {element.preference.size.title} de {element.preference.thickness.title} a {element.preference.printType.title.toLowerCase()}</span>
                                    <p>{element.preference.copies} copias x {element.pages} páginas x {element.pricePerCopy} precio por página</p>
    
                                    <div className='tags'>
                                        <span>{element.preference.color.title}</span>
                                        <span>{element.preference.size.title}</span>
                                        <span>{element.preference.thickness.title}</span>
                                        <span>{element.preference.printType.title === 'UNA CARA' ? 'UC' : 'DC'}</span>
                                        <span>{labelForPrintPerFace(element.preference.printPerFace.title)}</span>
                                        <span>{labelForOrientation(element.preference.orientation.title)}</span>
                                        <span>{element.preference.turnPageMode.title === 'LADO LARGO' ? 'LL' : 'LC'}</span>
                                        <span>{labelForFinishes(element.preference.finishes.title)}</span>
                                    </div>
    
                                    <div className='itemFiles' onClick={() => handleToggleFile(index)}>
                                        <div className='itemFilesTitle'>
                                            <img src="/src/assets/chevronDown.png" alt="Documentos adjuntos" />
                                            <h3>Documentos adjuntos</h3>
                                        </div>
    
                                        {renderFiles(element.files, index)}
                                    </div>
    
                                    <div className='itemPrice'>
                                        <span>{element.finalPrice}€</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <hr style={{ display: finalShoppingCartPreferences.items.length === 0 ? 'none' : 'block' }} />
                    <div className='shoppingCartItemListButtons'>
                        <div className='shoppingCartButton' style={{ display: finalShoppingCartPreferences.items.length === 0 ? 'none' : 'flex' }} onClick={resetFinalShoppingCart}>
                            <img src="/src/assets/trashIcon.png" alt="Icono de papelera" />
                            <p>VACIAR CESTA</p>
                        </div>
    
                        <Link to='/'>
                            <div className='shoppingCartButtonActive'>
                                <img src="/src/assets/loginIcon.png" alt="Icono de papelera" />
                                <p>CONTINUAR IMPRIMIENDO</p>
                            </div>
                        </Link>
                    </div>
                </div>
    
                {/* Información del usuario */}
                <div className='shoppingCartUserInfo'>
                    {finalShoppingCartPreferences.items.length != 0 ? (
                        <>
                            <div className='shoppingCartUserInfoTitle'>
                                <span>Datos Personales</span>
                            </div>
                            <form className='shoppingCartUserInfoForm' onSubmit={handleSubmit}>
                                <div>
                                    {errors.nameError && <span>{errors.nameError}</span>}
                                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder='Nombre Completo*' required />
                                </div>
                                <div>
                                    {errors.emailError && <span>{errors.emailError}</span>}
                                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder='Email*' required />
                                </div>
                                <div>
                                    {errors.dniError && <span>{errors.dniError}</span>}
                                    <input type="text" id="dni" name="dni" value={formData.dni} onChange={handleChange} placeholder='DNI*' required />
                                </div>
                                <div>
                                    {errors.phoneNumberError && <span>{errors.phoneNumberError}</span>}
                                    <input type="number" id="phoneNumber" name="phoneNumber" value={formData.phoneNumer} onChange={handleChange} placeholder='Número de teléfono*' required />
                                </div>
                                <div>
                                    {errors.addressError && <span>{errors.addressError}</span>}
                                    <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} placeholder='Dirección (calle, número, piso)*' required />
                                </div>
                                <div>
                                    {errors.postalCodeError && <span>{errors.postalCodeError}</span>}
                                    <input type="number" id="postalCode" name="postalCode" value={formData.postalCode} onChange={handleChange} placeholder='Código Postal*' required />
                                </div>
                                <div>
                                    <input type="text" id="deliveryComments" name="deliveryComments" value={formData.deliveryComments} onChange={handleChange} placeholder='Comentarios al repartidor' />
                                </div>
                            </form>
                        </>
                    ) : null}
                </div>
    
                {/* Métodos de envío */}
                <div className='shoppingCartShipping'>
                    {finalShoppingCartPreferences.items.length != 0 ? (
                        <div className='shoppingCartShippingTitle'>
                            <span>Forma de entrega</span>
                            <div className='shoppingCartShippingDescription'>
                                <span>Selecciona una forma de entrega</span>
                            </div>
                            <div className='shoppingCartShippingMethods'>
                                <div className={finalShoppingCartPreferences.shipping === shippingMethod.standard ? 'shoppingCartShippingMethodsItemActive' : 'shoppingCartShippingMethodsItem'} onClick={() => updateShippingMethodFinalShoppingCart(shippingMethod.standard)}>
                                    <img src="/src/assets/shippingMethod.png" alt="Imagen de envío estandar" />
                                    <span>ENVÍO ESTANDAR</span>
                                </div>
    
                                <div className={finalShoppingCartPreferences.shipping === shippingMethod.premium ? 'shoppingCartShippingMethodsItemActive' : 'shoppingCartShippingMethodsItem'} onClick={() => updateShippingMethodFinalShoppingCart(shippingMethod.premium)}>
                                    <img src="/src/assets/premiumDelivery.png" alt="Imagen de envío premium" />
                                    <span>ENVÍO PREMIUM</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        null
                    )}
                </div>
    
                {/* Métodos de pago */}
                <div className='shoppingCartBilling'>
                    {finalShoppingCartPreferences.items.length != 0 ? (
                        <div className='shoppingCartBillingTitle'>
                            <span>Forma de pago</span>
                            <div className='shoppingCartBillingDescription'>
                                <span>Selecciona una forma de pago</span>
                            </div>
                            <div className='shoppingCartBillingMethods'>
                                <div className={finalShoppingCartPreferences.billingMethod === billingMethod.card ? 'shoppingCartBillingMethodsItemActive' : 'shoppingCartBillingMethodsItem'} onClick={() => updateBillingMethodFinalShoppingCart(billingMethod.card)}>
                                    <img src="/src/assets/billingMethodCard.png" alt="Imagen de pago con tarjeta" />
                                    <span>PAGO CON TARJETA</span>
                                </div>
                                <div className={finalShoppingCartPreferences.billingMethod === billingMethod.paypal ? 'shoppingCartBillingMethodsItemActive' : 'shoppingCartBillingMethodsItem'} onClick={() => updateBillingMethodFinalShoppingCart(billingMethod.paypal)}>
                                    <img src="/src/assets/billingMethodPayPal.png" alt="Imagen de pago con paypal" />
                                    <span>PAGO CON PAYPAL</span>
                                </div>
                                <div className={finalShoppingCartPreferences.billingMethod === billingMethod.wireTransfer ? 'shoppingCartBillingMethodsItemActive' : 'shoppingCartBillingMethodsItem'} onClick={() => updateBillingMethodFinalShoppingCart(billingMethod.wireTransfer)}>
                                    <img src="/src/assets/billingMethodWireTransfer.png" alt="Imagen de pago por transferencia" />
                                    <span>PAGO POR TRANSFERENCIA</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        null
                    )}
                </div>
    
                {/* Resumen del pedido */}
                <div className='shoppingCartSummary'>
                    <div className='shoppingCartInfoTitle'>
                        <span>Resumen del pedido</span>
                    </div>
                    <div className='shoppingCartInfo'>
                        <div className='shoppingCartInfoDisplay'>
                            <div className='shoppingCartInfoDisplayFirst'>
                                <span>Información de la impresión:</span>
                                <p>{finalShoppingCartPreferences.items.length} artículos {finalShoppingCartPreferences.itemsPrice}€ ({getTotalPages()} páginas totales)</p>
                            </div>
                        </div>
    
                        <div className='shoppingCartInfoSubtotal'>
                            <div className='shoppingCartInfoSubtotalDetails'>
                                <span>Subtotal</span>
                                <span>{finalShoppingCartPreferences.itemsPrice}€</span>
                            </div>
                            {finalShoppingCartPreferences.items.length != 0 ? (
                                <div className='shoppingCartInfoSubtotalDetails'>
                                    <span>Gastos de envío {finalShoppingCartPreferences.shipping === shippingMethod.premium && ('(PREMIUM)')}</span>
                                    <span>
                                        {finalShoppingCartPreferences.shipping === shippingMethod.standard && finalShoppingCartPreferences.finalPrice > 50 && ('GRATIS')}
                                        {finalShoppingCartPreferences.shipping === shippingMethod.standard && finalShoppingCartPreferences.finalPrice < 50 && ('4.9€')}
                                        {finalShoppingCartPreferences.shipping === shippingMethod.premium && finalShoppingCartPreferences.finalPrice > 50 && ('2.9€')}
                                        {finalShoppingCartPreferences.shipping === shippingMethod.premium && finalShoppingCartPreferences.finalPrice < 50 && ('6.9€')}
                                    </span>
                                </div>
                            ) : (
                                null
                            )}
                        </div>
    
                        <div className='shoppingCartInfoTotal'>
                            <span>TOTAL</span>
                            <span>{finalShoppingCartPreferences.finalPrice}€</span>
                        </div>
    
                        <div className='shoppingCartCreateOrder' style={{ display: finalShoppingCartPreferences.items.length === 0 ? 'none' : 'block' }} onClick={handleSubmit}>
                            {loading ? 'Procesando...' : 'REALIZAR PEDIDO'}
                        </div>
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div className='shoppingCart'>
                <p>Se esta renderizando la parte que no es movil cuando supera los 1024px de ancho en la pantalla desde la que se visualiza</p>
            </div>
        )
    }
}

export default ShoppingCart;