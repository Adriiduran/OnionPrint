import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useMediaQuery } from '@mui/material';
//Style
import './ShoppingCart.css';
//Context
import { useShoppingCart } from '../../context/ShoppingCartContext';
// Components
import Payment from '../../components/ShoppingCart/Payment.jsx'

function ShoppingCart() {
    const { finalShoppingCartPreferences, getTotalPages, removeItemFromFinalShoppingCart, shippingMethod, updateShippingMethodFinalShoppingCart } = useShoppingCart();
    const [openFileIndex, setOpenFileIndex] = useState(null);
    const isMobile = useMediaQuery('(max-width:830px)');
    const [userConfirmedInfo, setUserConfirmedInfo] = useState(false)
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

    // Función para manejar el clic en un elemento de archivos
    const handleToggleFile = (index) => {
        setOpenFileIndex(openFileIndex === index ? null : index);
    };

    // Renderizado de los nombres de los archivos
    const renderFiles = (files, index) => {
        if (openFileIndex === index) {
            return (
                <div key={index}>
                    {files.map((file, i) => (
                        <p style={{ padding: '5px 20px', fontSize: 'small' }} key={i}>{i + 1} - {file.name}</p>
                    ))}
                </div>
            );
        }
        return null;
    };

    // Función que comprueba si las propiedades de un objetos estan vacios
    const userDataIsFilled = () => {
        const user = finalShoppingCartPreferences.user;

        const propertiesToCheck = Object.keys(user).filter(key => key !== 'deliveryComments');

        return propertiesToCheck.every(key => user[key] !== '') && user.deliveryComments !== undefined;
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
    const handleConfirmUserData = () => {
        if (validateForm()) {
            setUserConfirmedInfo(true)
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

    // UseEffect para rellenar automaticamente los campos del formulario del usuario si ya ha 
    // rellenado los campos anteriormente o si se ha iniciado sesión se rellena su email
    useEffect(() => {
        const user = finalShoppingCartPreferences.user

        setFormData({
            name: user.name ?? '',
            email: user.email ?? '',
            dni: user.dni ?? '',
            phoneNumber: user.phoneNumber ?? '',
            address: user.address ?? '',
            postalCode: user.postalCode ?? '',
            deliveryComments: user.deliveryComments ?? '',
        });

        if (userDataIsFilled()) {
            handleConfirmUserData();
        }
    }, []);

    if (finalShoppingCartPreferences.items.length !== 0) {
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

                        <div className='shoppingCartInfoDisplay'>
                            <div className='shoppingCartInfoDisplayFirst'>
                                <span>Resumen del pedido:</span>
                                <p>{finalShoppingCartPreferences.items.length} artículo/s: {finalShoppingCartPreferences.itemsPrice}€ ({getTotalPages()} páginas totales)</p>
                            </div>
                        </div>

                        <div className='shoppingCartInfoSubtotal'>
                            <div className='shoppingCartInfoSubtotalDetails'>
                                <span>Subtotal:</span>
                                <span>{finalShoppingCartPreferences.itemsPrice}€</span>
                            </div>
                            {finalShoppingCartPreferences.items.length != 0 && (
                                <div className='shoppingCartInfoSubtotalDetails'>
                                    <span>Gastos de envío:</span>
                                    <span style={finalShoppingCartPreferences.itemsPrice > 50 ? { color: 'green' } : {}}>
                                        {finalShoppingCartPreferences.itemsPrice > 50 ? ('GRATIS') : ('3.9€')}
                                    </span>
                                </div>
                            )}
                            {finalShoppingCartPreferences.items.length != 0 && finalShoppingCartPreferences.shipping === shippingMethod.premium && (
                                <div className='shoppingCartInfoSubtotalDetails'>
                                    <span>Gastos pedido Prioritario:</span>
                                    <span>4.9€</span>
                                </div>
                            )}
                        </div>

                        <div className='shoppingCartInfoTotal'>
                            <span>TOTAL:</span>
                            <span>{finalShoppingCartPreferences.finalPrice}€</span>
                        </div>
                    </div>

                    {/* Información del usuario */}
                    <div className='shoppingCartUserInfo'>
                        {finalShoppingCartPreferences.items.length != 0 ? (
                            <>
                                <div className='shoppingCartUserInfoTitle'>
                                    <span>Datos Personales</span>
                                    {userConfirmedInfo && (
                                        <button onClick={() => { setUserConfirmedInfo(false) }}>Editar</button>
                                    )}
                                </div>
                                {userConfirmedInfo ? (
                                    <section>
                                        <p>Nombre: {finalShoppingCartPreferences.user.name}</p>
                                        <p>Email: {finalShoppingCartPreferences.user.email}</p>
                                        <p>DNI: {finalShoppingCartPreferences.user.dni}</p>
                                        <p>Número del teléfono: {finalShoppingCartPreferences.user.phoneNumber}</p>
                                        <p>Dirección de envío: {finalShoppingCartPreferences.user.address}</p>
                                        <p>Código Postal: {finalShoppingCartPreferences.user.postalCode}</p>
                                        <p>Comentarios al repartidor: {finalShoppingCartPreferences.user.deliveryComments}</p>
                                    </section>
                                ) : (
                                    <form className='shoppingCartUserInfoForm'>
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
                                            <input type="number" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder='Número de teléfono*' required />
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
                                        <div className='shoppingCartUserInfoDisplay'>
                                            <p>* Campos obligatorios</p>
                                        </div>
                                    </form>
                                )}
                            </>
                        ) : null}
                    </div>

                    {/* Métodos de envío */}
                    {finalShoppingCartPreferences.items.length != 0 && (
                        <div className='shoppingCartShipping'>
                            <div className='shoppingCartShippingTitle'>
                                <span>Forma de entrega</span>
                                {userConfirmedInfo && (
                                    <button onClick={() => {
                                        setUserConfirmedInfo(false);
                                    }}>Cambiar</button>
                                )}
                            </div>
                            {userConfirmedInfo ? (
                                <>
                                    <p style={{ padding: '30px 20px', textAlign: 'left', fontSize: 'small' }}>{finalShoppingCartPreferences.shipping === 'standard' ? ('ENVÍO ESTANDAR - 2 a 3 días laborables') : ('ENVÍO PRIORITARIO - 1 a 2 días laborables')}</p>
                                </>
                            ) : (
                                <>
                                    <div className='shoppingCartShippingDescription'>
                                        <span>Selecciona una forma de entrega</span>
                                    </div>
                                    <div className='shoppingCartShippingMethods'>
                                        <div className={finalShoppingCartPreferences.shipping === shippingMethod.standard ? 'shoppingCartShippingMethodsItemActive' : 'shoppingCartShippingMethodsItem'} onClick={() => updateShippingMethodFinalShoppingCart(shippingMethod.standard)}>
                                            <img src="/src/assets/shippingMethod.png" alt="Imagen de envío estandar" />
                                            <span>ENVÍO ESTANDAR</span>
                                            <span>2 a 3 días laborables</span>
                                        </div>

                                        <div className={finalShoppingCartPreferences.shipping === shippingMethod.premium ? 'shoppingCartShippingMethodsItemActive' : 'shoppingCartShippingMethodsItem'} onClick={() => updateShippingMethodFinalShoppingCart(shippingMethod.premium)}>
                                            <img src="/src/assets/premiumDelivery.png" alt="Imagen de envío premium" />
                                            <span>ENVÍO PRIORITARIO</span>
                                            <span>1 a 2 días laborables</span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {!userConfirmedInfo && finalShoppingCartPreferences.items.length != 0 && (
                        <div className='confirmUserDataButton' onClick={() => {
                            handleConfirmUserData()
                        }}>
                            <span>CONTINUAR AL MÉTODO DE PAGO</span>
                            <img src="/src/assets/arrowRight.png" alt="Imagen flecha derecha" />
                        </div>
                    )}

                    {userConfirmedInfo && (
                        <Payment />
                    )}
                </div>
            );
        } else {
            return (
                <div className='shoppingCart'>
                    <div className='shoppingCartLeftSide'>
                        {/* Información del usuario */}
                        <div className='shoppingCartUserInfo'>
                            {finalShoppingCartPreferences.items.length != 0 ? (
                                <>
                                    <div className='shoppingCartUserInfoTitle'>
                                        <span>Datos Personales</span>
                                        {userConfirmedInfo && (
                                            <button onClick={() => { setUserConfirmedInfo(false) }}>Editar</button>
                                        )}
                                    </div>
                                    {userConfirmedInfo ? (
                                        <section>
                                            <p>Nombre: {finalShoppingCartPreferences.user.name}</p>
                                            <p>Email: {finalShoppingCartPreferences.user.email}</p>
                                            <p>DNI: {finalShoppingCartPreferences.user.dni}</p>
                                            <p>Número del teléfono: {finalShoppingCartPreferences.user.phoneNumber}</p>
                                            <p>Dirección de envío: {finalShoppingCartPreferences.user.address}</p>
                                            <p>Código Postal: {finalShoppingCartPreferences.user.postalCode}</p>
                                            <p>Comentarios al repartidor: {finalShoppingCartPreferences.user.deliveryComments}</p>
                                        </section>
                                    ) : (
                                        <form className='shoppingCartUserInfoForm'>
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
                                                <input type="number" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder='Número de teléfono*' required />
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
                                            <div className='shoppingCartUserInfoDisplay'>
                                                <p>* Campos obligatorios</p>
                                            </div>
                                        </form>
                                    )}
                                </>
                            ) : null}
                        </div>

                        {/* Métodos de envío */}
                        {finalShoppingCartPreferences.items.length != 0 && (
                            <div className='shoppingCartShipping'>
                                <div className='shoppingCartShippingTitle'>
                                    <span>Forma de entrega</span>
                                    {userConfirmedInfo && (
                                        <button onClick={() => {
                                            setUserConfirmedInfo(false);
                                        }}>Cambiar</button>
                                    )}
                                </div>
                                {userConfirmedInfo ? (
                                    <>
                                        <p style={{ padding: '30px 20px', textAlign: 'left', fontSize: 'small' }}>{finalShoppingCartPreferences.shipping === 'standard' ? ('ENVÍO ESTANDAR - 2 a 3 días laborables') : ('ENVÍO PRIORITARIO - 1 a 2 días laborables')}</p>
                                    </>
                                ) : (
                                    <>
                                        <div className='shoppingCartShippingDescription'>
                                            <span>Selecciona una forma de entrega</span>
                                        </div>
                                        <div className='shoppingCartShippingMethods'>
                                            <div className={finalShoppingCartPreferences.shipping === shippingMethod.standard ? 'shoppingCartShippingMethodsItemActive' : 'shoppingCartShippingMethodsItem'} onClick={() => updateShippingMethodFinalShoppingCart(shippingMethod.standard)}>
                                                <img src="/src/assets/shippingMethod.png" alt="Imagen de envío estandar" />
                                                <span>ENVÍO ESTANDAR</span>
                                                <span>2 a 3 días laborables</span>
                                            </div>

                                            <div className={finalShoppingCartPreferences.shipping === shippingMethod.premium ? 'shoppingCartShippingMethodsItemActive' : 'shoppingCartShippingMethodsItem'} onClick={() => updateShippingMethodFinalShoppingCart(shippingMethod.premium)}>
                                                <img src="/src/assets/premiumDelivery.png" alt="Imagen de envío premium" />
                                                <span>ENVÍO PRIORITARIO</span>
                                                <span>1 día laborable</span>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {!userConfirmedInfo && finalShoppingCartPreferences.items.length != 0 && (
                            <div className='confirmUserDataButton' onClick={() => {
                                handleConfirmUserData()
                            }}>
                                <span>CONTINUAR AL MÉTODO DE PAGO</span>
                                <img src="/src/assets/arrowRight.png" alt="Imagen flecha derecha" />
                            </div>
                        )}

                        {userConfirmedInfo && (
                            <Payment />
                        )}
                    </div>
                    <div className='shoppingCartRightSide'>
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

                            <div className='shoppingCartInfoDisplay'>
                                <div className='shoppingCartInfoDisplayFirst'>
                                    <span>Resumen del pedido:</span>
                                    <p>{finalShoppingCartPreferences.items.length} artículo/s: {finalShoppingCartPreferences.itemsPrice}€ ({getTotalPages()} páginas totales)</p>
                                </div>
                            </div>

                            <div className='shoppingCartInfoSubtotal'>
                                <div className='shoppingCartInfoSubtotalDetails'>
                                    <span>Subtotal:</span>
                                    <span>{finalShoppingCartPreferences.itemsPrice}€</span>
                                </div>
                                {finalShoppingCartPreferences.items.length != 0 && (
                                    <div className='shoppingCartInfoSubtotalDetails'>
                                        <span>Gastos de envío:</span>
                                        <span style={finalShoppingCartPreferences.itemsPrice > 50 ? { color: 'green' } : {}}>
                                            {finalShoppingCartPreferences.itemsPrice > 50 ? ('GRATIS') : ('3.9€')}
                                        </span>
                                    </div>
                                )}
                                {finalShoppingCartPreferences.items.length != 0 && finalShoppingCartPreferences.shipping === shippingMethod.premium && (
                                    <div className='shoppingCartInfoSubtotalDetails'>
                                        <span>Gastos pedido Prioritario:</span>
                                        <span>4.9€</span>
                                    </div>
                                )}
                            </div>

                            <div className='shoppingCartInfoTotal'>
                                <span>TOTAL:</span>
                                <span>{finalShoppingCartPreferences.finalPrice}€</span>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    } else {
        return (
            <div className='noItems'>
                <img className="noItemsImage" src="/src/assets/emptyCartIcon.webp" alt="No items in shopping cart" />
                <div className='noItemsDescription'>
                    <h1>Tu carrito está vacío</h1>
                    <p>Cuando hayas añadido algo al carrito, aparecerá aquí</p>
                    <Link to="/" className='noItemsDescriptionButton'>
                        <span>CONTINUAR IMPRIMIENDO</span>
                        <img src="/src/assets/arrowRight.png" alt="Imagen flecha derecha" />
                    </Link>
                </div>
            </div>
        );
    }
}

export default ShoppingCart;