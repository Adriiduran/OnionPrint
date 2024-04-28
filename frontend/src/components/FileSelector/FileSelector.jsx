//Dependencies
import React, { useState, useEffect } from 'react';

//Components
import FileView from '../FileView/FileView';

//Context
import { useShoppingCart } from '../../context/ShoppingCartContext';

//Styles
import './FileSelector.css'

export default function FileSelector() {
    const { shoppingCartPreferences, resetCurrentShoppingCartPages, addCurrentFileToCurrentCart, updateCurrentShoppingCartPages, addCurrentShoppingCartToFinal, finalShoppingCartPreferences } = useShoppingCart();
    const [selectedFiles, setselectedFiles] = useState([]);
    const fileInputRef = React.useRef(null);
    const [isFirstTime, setIsFirstTime] = useState(true)
    const [finishesDescription, setFinishesDescription] = useState("")
    

    useEffect(() => {
        if (shoppingCartPreferences.preference.finishes != undefined) {
            if (shoppingCartPreferences.preference.finishes.title === "ENCUADERNADO") {
                setFinishesDescription("+3.9€")
            } else if (shoppingCartPreferences.preference.finishes.title === "GRAPADO") {
                setFinishesDescription("+0.9€")
            } else if (shoppingCartPreferences.preference.finishes.title === "2 AGUJEROS") {
                setFinishesDescription("+0.9€")
            } else if (shoppingCartPreferences.preference.finishes.title === "4 AGUJEROS") {
                setFinishesDescription("+0.9€")
            } else if (shoppingCartPreferences.preference.finishes.title === "PLASTIFICADO") {
                setFinishesDescription("+1€ por página")
            }
        }
    }, [shoppingCartPreferences.preference.finishes])

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        resetCurrentShoppingCartPages();
        setselectedFiles(files);
        addCurrentFileToCurrentCart(files)
        setIsFirstTime(false)
    };

    const handleDeleteFile = (position, numPages) => {
        const previousFilesLength = selectedFiles.length
        const updatedFiles = selectedFiles.filter((file, index) => index !== position);
        setselectedFiles(updatedFiles);

        if (position + 1 < previousFilesLength) {
            resetCurrentShoppingCartPages();
        } else {
            updateCurrentShoppingCartPages(-numPages)
        }
    };

    const removeFiles = () => {
        setselectedFiles([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        resetCurrentShoppingCartPages();
    };

    const handleAddToCart = () => {
        addCurrentShoppingCartToFinal();
        setselectedFiles([])
        resetCurrentShoppingCartPages();
    }

    return (
        <>
            {isFirstTime ? (
                <div className='frontPageFileSelector'>
                    <img className='imageFileSelector' src={`${import.meta.env.VITE_ASSETS_URL}/selectFileImage.svg`} alt="File Selector Image" style={{ display: selectedFiles.length > 0 ? 'none' : 'block' }} />
                    <h2 className='titleFileSelector' style={{ display: selectedFiles.length > 0 ? 'none' : 'block' }}>Pulsa el botón para subir tus documentos</h2>
                    <span className='buttonFileSelector primaryFileSelector' onClick={() => fileInput.click()}>
                        <img src={`${import.meta.env.VITE_ASSETS_URL}/folderIcon.png`} alt="User Icon Button" />
                        <p>SUBIR DOCUMENTOS</p>
                    </span>
                </div>
            ) : (
                <>
                    <div className='fileSelector'>
                        <div className='fileSelectorHeader'>
                            <div className='firstFileDetailsFileSelector'>
                                <span>
                                    <img src={`${import.meta.env.VITE_ASSETS_URL}/copiesIcon.png`} alt="Copy Number Icon" />
                                    <p>{shoppingCartPreferences.preference.copies}</p>
                                </span>
                                <span>
                                    <img src={`${import.meta.env.VITE_ASSETS_URL}/pagesIcon.png`} alt="Pages Number Icon" />
                                    <p>{shoppingCartPreferences.pages}</p>
                                </span>
                                <span>
                                    <img src={`${import.meta.env.VITE_ASSETS_URL}/fileConfiguration.png`} alt="Price per Copy Icon" />
                                    <p>{shoppingCartPreferences.pricePerCopy}€</p>
                                </span>
                                <div className='fileFinishesFileSelector'>
                                    {shoppingCartPreferences.preference.finishes !== undefined ? (
                                        <>
                                            {shoppingCartPreferences.preference.finishes.title === "SIN ACABADO" ? (
                                                <>
                                                    <p>ACABADOS</p>
                                                    <span>SIN ACABADO</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>{shoppingCartPreferences.preference.finishes.title}</span>
                                                    <p>{finishesDescription}</p>
                                                </>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <p>ACABADOS</p>
                                            <span>SIN ACABADO</span>
                                        </>
                                    )}
                                </div>
                            </div>
                            {(finalShoppingCartPreferences.itemsPrice + shoppingCartPreferences.finalPrice) <= 50 ? (
                                <>
                                    <div className='fileShippingPriceFileSelector'>
                                        <img src={`${import.meta.env.VITE_ASSETS_URL}/warningIcon.png`} alt="Warning Icon" />
                                        <span>Añade solo <span>{(50 - (finalShoppingCartPreferences.itemsPrice + shoppingCartPreferences.finalPrice)).toFixed(2)}€</span> para conseguir tu <span>ENVÍO GRATIS</span></span>
                                    </div>
                                </>
                            ) :
                                <div className='fileShippingPriceFileSelector'>
                                    <img src={`${import.meta.env.VITE_ASSETS_URL}/shippingMethod.png`} alt="Free shipping icon" />
                                    <span>ENVÍO GRATIS</span>
                                </div>
                            }
                            <div className='secondFileDetailsFileSelector'>
                                <div className='buttonFileSelector secondaryFileSelector' onClick={removeFiles}>
                                    <img src={`${import.meta.env.VITE_ASSETS_URL}/trashIcon.png`} alt="Trash Button Icon" />
                                    <p>ELIMINAR DOCUMENTOS</p>
                                </div>
                                <span className='buttonFileSelector primaryFileSelector' onClick={() => fileInput.click()}>
                                    <img src={`${import.meta.env.VITE_ASSETS_URL}/folderIcon.png`} alt="User Icon Button" />
                                    <p>SELECCIONAR DOCUMENTOS</p>
                                </span>
                            </div>
                        </div>
                        <div className='selectedConfigurationFileSelector'>
                            <p>Total de configuración seleccionada</p>
                            <h1>{shoppingCartPreferences.finalPrice} €</h1>
                            <span onClick={handleAddToCart}>AÑADIR AL CARRITO</span>
                        </div>
                    </div>

                    <div className='fileViewFileSelector'>
                        {selectedFiles.map((file, index) => (
                            <FileView key={index} file={file} arrayPosition={index} onDelete={handleDeleteFile} />
                        ))}
                    </div>
                </>
            )}
            <input type="file"
                accept=".pdf, .png, .jpg, .tiff, .docx, .doc, .txt"
                style={{ display: 'none' }}
                onChange={handleFileChange}
                id='fileInput'
                multiple
                ref={fileInputRef}
            />
        </>
    )
}