//Dependencies
import { useState, useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import PropTypes from 'prop-types';

//Context
import { useShoppingCart } from '../../context/ShoppingCartContext';

//Styles
import './FileView.css'
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

export default function FileView({ file, arrayPosition, onDelete }) {
    const { shoppingCartPreferences, updateCurrentShoppingCartPages, removeFileFromPositionInCurrentCart } = useShoppingCart();
    const [fileContent, setFileContent] = useState(null)
    const [numPages, setNumPages] = useState(null);
    

    useEffect(() => {
        if (file) {
            mostrarArchivo(file);
        }
    }, [file]);

    const mostrarArchivo = (file) => {
        if (!file) {
            console.error('Archivo no proporcionado.');
            return;
        }

        if (isImage(file.name)) {
            displayImage(file);
        } else if (file.type === "application/pdf") {
            displayPDF(file)
        } else {
            console.error('Formato de archivo no compatible.');
        }
    };

    const isImage = (filename) => /\.(jpg|jpeg|png)$/i.test(filename);

    const displayImage = (file) => {
        setFileContent(
            <img src={URL.createObjectURL(file)} className='image' alt='Archivo seleccionado' />
        );
        updateCurrentShoppingCartPages(1)
    };

    const displayPDF = (file) => {
        setFileContent(
            <Document file={URL.createObjectURL(file)} onLoadSuccess={onDocumentLoadSuccess}>
                <Page width={230} pageNumber={1} className={'pdfFileView'} />
            </Document>
        );
    };

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
        updateCurrentShoppingCartPages(numPages)
    }

    const handleDeleteFile = () => {
        onDelete(arrayPosition, numPages);
        removeFileFromPositionInCurrentCart(arrayPosition)
    };

    const formatFileSize = (size) => {
        const kb = 1024;
        const mb = kb * 1024;
        const gb = mb * 1024;

        if (size < kb) {
            return `${size.toFixed(2)} B`;
        } else if (size < mb) {
            return `${(size / kb).toFixed(2)} KB`;
        } else if (size < gb) {
            return `${(size / mb).toFixed(2)} MB`;
        } else {
            return `${(size / gb).toFixed(2)} GB`;
        }
    };

    return (
        <div className="backgroundFileView">
            {fileContent}
            <div className="fileSelectedDetailsFileView">
                <div className="firstDetailsFileView">
                    <img src={`${import.meta.env.VITE_ASSETS_URL}/expandIcon.webp`} alt="Expand File Selected View" />
                    <p>{shoppingCartPreferences.preference.size.description}</p>
                    <span className="numberOfFileFileView">{arrayPosition + 1}</span>
                </div>

                <hr />

                <p className="nameOfFileFileView">{file.name}</p>

                <div className="secondDetailsFileView">
                    <div className="numberOfPagesFileView">
                        <p>PÁGINAS</p>
                        <div className="detailsFileView">
                            <img src={`${import.meta.env.VITE_ASSETS_URL}/pagesIcon.webp`} alt="Páginas de fichero" />
                            <p className="pagesFileView">{numPages}</p>
                        </div>
                    </div>
                    <div className='separatorFileView'></div>
                    <div className="sizeOfFileFileView">
                        <p>TAMAÑO</p>
                        <div className="detailsFileView">
                            <img src={`${import.meta.env.VITE_ASSETS_URL}/uploadIcon.webp`} alt="Tamaño del fichero" />
                            <p className="pagesFileView">{formatFileSize(file.size)}</p>
                        </div>
                    </div>
                </div>

                <hr />

                <div className="finalDetailsFileView">
                    <img src={`${import.meta.env.VITE_ASSETS_URL}/trashIcon.webp`} alt="Eliminar fichero" onClick={handleDeleteFile} />
                    <p className="priceFileView">{shoppingCartPreferences.pricePerCopy}€</p>
                </div>
            </div>
        </div>
    );
}

FileView.propTypes = {
    file: PropTypes.object.isRequired,
    arrayPosition: PropTypes.number.isRequired,
    onDelete: PropTypes.func.isRequired
};