//Dependencies
import React, { useState, useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import PropTypes from 'prop-types';

//Styles
import './FileView.css'
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

export default function FileView({ file, arrayPosition }) {
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

        console.log(file.type)

        if (isImage(file.name)) {
            displayImage(file);
        } else if (file.type === "application/pdf") {
            displayPDF(file)
        } else {
            console.error('Formato de archivo no compatible.');
        }
    };

    const isImage = (filename) => /\.(jpg|jpeg|png|gif)$/i.test(filename);

    const displayImage = (file) => {
        setFileContent(
            <img src={URL.createObjectURL(file)} className='image' alt='Archivo seleccionado' />
        );
    };

    const displayPDF = (file) => {
        setFileContent(
            <Document className={"pdf"} file={URL.createObjectURL(file)} onLoadSuccess={onDocumentLoadSuccess}>
                <Page height={300} scale={1.1} pageNumber={1} />
            </Document>
        );
    };

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    return (
        <div className="background">
            <div className="fileSelectedView">
                { fileContent }
            </div>
            <div className="fileSelectedDetails">
                <div className="firstDetails">
                    <img src="/src/assets/expandIcon.png" alt="Expand File Selected View" />
                    <p>297 mm x 210 mm</p>
                    <span className="numberOfFile">{arrayPosition}</span>
                </div>

                <hr />

                <p className="nameOfFile">{file.name}</p>

                <div className="secondDetails">
                    <div className="numberOfPages">
                        <p>PÁGINAS</p>
                        <div className="details">
                            <img src="/src/assets/pagesIcon.png" alt="Páginas de fichero" />
                            <p className="pages">{numPages}</p>
                        </div>
                    </div>
                    <div className='separator'></div>
                    <div className="sizeOfFile">
                        <p>TAMAÑO</p>
                        <div className="details">
                            <img src="/src/assets/uploadIcon.png" alt="Tamaño del fichero" />
                            <p className="pages">{file.size} B</p>
                        </div>
                    </div>
                </div>

                <hr />

                <div className="finalDetails">
                    <img src="/src/assets/trashIcon.png" alt="Eliminar fichero" />
                    <p className="price">0,06€</p>
                </div>
            </div>
        </div>
    );
}

FileView.propTypes = {
    file: PropTypes.object.isRequired,
    arrayPosition: PropTypes.number.isRequired
};