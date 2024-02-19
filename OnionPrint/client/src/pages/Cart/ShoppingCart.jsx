import { useState } from 'react';
import './ShoppingCart.css';
import { Link } from 'react-router-dom';

//Context
import { useShoppingCart } from '../../context/ShoppingCartContext';
import { saveFinalCartOnFirebase } from '../../config/firebase';

function ShoppingCart() {
    const { finalShoppingCartPreferences, resetFinalShoppingCart, getTotalPages, removeItemFromFinalShoppingCart, billingMethod, updateBillingMethodFinalShoppingCart } = useShoppingCart();

    const [filesAreVisible, setFilesAreVisible] = useState(false)
    const [loading, setLoading] = useState(false);

    const handleCreateOrder = async () => {
        try {
            setLoading(true);
            await saveFinalCartOnFirebase(finalShoppingCartPreferences);
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

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

    return (
        <div className='shoppingCart'>
            <h2 className='shoppingCartTitle'>Carrito de la compra</h2>

            <div className="stepper-wrapper">
                <div className="stepper-item completed">
                    <div className="step-counter"></div>
                    <div className="step-name">CARRITO</div>
                </div>
                <div className="stepper-item">
                    <div className="step-counter"></div>
                    <div className="step-name">RESUMEN</div>
                </div>
                <div className="stepper-item">
                    <div className="step-counter"></div>
                    <div className="step-name">COMPLETADO</div>
                </div>
            </div>

            <div className='shoppingCartItemList'>
                <div className='shoppingCartItemListTitle'>
                    <div className='shoppingCartItemListTitleFirst'>
                        <img src="/src/assets/tasks.png" alt="Task items" />
                        <h3>Lista de impresión</h3>
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

                                <div className='itemFiles' onClick={() => setFilesAreVisible(!filesAreVisible)}>
                                    <div className='itemFilesTitle'>
                                        <img src="/src/assets/burgerMenu.png" alt="Documentos adjuntos" />
                                        <h3>Documentos adjuntos</h3>
                                    </div>

                                    <div className='itemFilesDetails' style={{ display: filesAreVisible ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', padding: '10px 5px', gap: '5px' }}>
                                        {element.files.map((file, index) => {
                                            return <p key={index}>{index + 1} - {file.name}</p>
                                        })}
                                    </div>
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
                            <p>CONTINUAR COMPRANDO</p>
                        </div>
                    </Link>
                </div>
            </div>

            <div className='shoppingCartShipping'>
                {finalShoppingCartPreferences.items.length != 0 ? (
                    <div className='shoppingCartShippingTitle'>
                        <span>Forma de entrega</span>
                        <div className='shoppingCartShippingDescription'>
                            <span>Selecciona una forma de entrega</span>
                        </div>
                        <div className='shoppingCartShippingMethods'>
                            <div className='shoppingCartShippingMethodsItemActive'>
                                <img src="/src/assets/shippingMethod.png" alt="Imagen de envío a domicilio" />
                                <span>ENVÍO A DOMICILIO</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className='noShoppingCartShipping'>
                        <img src="/src/assets/warningIcon.png" alt="Icono de warning" />
                        <span>No hay impresiones a entregar</span>
                    </div>
                )}
            </div>

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

            {finalShoppingCartPreferences.items.length != 0 ? (
                <div className='shoppingCartBilling'></div>
            ) : null}

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
                    <div className='shoppingCartInfoSubtotalDetails'>
                        <span>Gastos de envío</span>
                        <span>{finalShoppingCartPreferences.shipping ? '4.9€' : 'GRATIS'}</span>
                    </div>
                </div>

                <div className='shoppingCartInfoTotal'>
                    <span>TOTAL</span>
                    <span>{finalShoppingCartPreferences.finalPrice}€</span>
                </div>

                <hr />

                <div className='shoppingCartCreateOrder' style={{ display: finalShoppingCartPreferences.items.length === 0 ? 'none' : 'block' }} onClick={handleCreateOrder}>
                    {loading ? 'Procesando...' : 'REALIZAR PEDIDO'}
                </div>
            </div>
        </div>
    );
}

export default ShoppingCart;