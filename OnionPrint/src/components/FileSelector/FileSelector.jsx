//Dependencies
import React, { useState } from 'react';

//Components
import FileView from '../FileView/FileView';

//Styles
import './FileSelector.css'

export default function FileSelector() {
    const [selectedFiles, setselectedFiles] = useState([]);
    const [numberOfPages, setNumberOfPages] = useState(0);
    const fileInputRef = React.useRef(null);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setselectedFiles(files);
    };

    const handleDeleteFile = (position) => {
        const updatedFiles = [...selectedFiles];
        updatedFiles.splice(position, 1);
        setselectedFiles(updatedFiles);
    };

    const removeFiles = () => {
        setselectedFiles([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className='fileSelector' style={{ display: selectedFiles.length > 0 ? 'grid' : 'flex', gridTemplateColumns: selectedFiles > 0 ? '2fr 1fr' : '1fr' }}>
            <div className='fileSelectorHeader'>
                <img className='image' src="src/assets/selectFileImage.svg" alt="File Selector Image" style={{ display: selectedFiles.length > 0 ? 'none' : 'block' }} />
                <h2 className='title' style={{ display: selectedFiles.length > 0 ? 'none' : 'block' }}>Selecciona los documentos que quieres imprimir</h2>
                <div className='fileDetails' style={{ display: selectedFiles.length > 0 ? 'flex' : 'none' }}>
                    <span>
                        <img src="src/assets/copiesIcon.png" alt="Copy Number Icon" />
                        <p>0</p>
                    </span>
                    <span>
                        <img src="src/assets/pagesIcon.png" alt="Pages Number Icon" />
                        <p>{numberOfPages}</p>
                    </span>
                    <span>
                        <img src="src/assets/fileConfiguration.png" alt="Price per Copy Icon" />
                        <p>0</p>
                    </span>
                    <div className='fileFinishes'>
                        <p>ACABADOS</p>
                        <span>SIN ACABADO</span>
                    </div>
                    <div className='fileShippingPrice'>
                        <img src="src/assets/warningIcon.png" alt="Warning Icon" />
                        <span>Añade solo <strong>PRICE</strong> para conseguir tu <strong>ENVÍO GRATIS</strong></span>
                    </div>
                    <div className='removeFiles' onClick={removeFiles}>
                        <img src="src/assets/trashIcon.png" alt="Trash Button Icon" />
                        <p>ELIMINAR DOCUMENTOS</p>
                    </div>
                </div>
                <span className='buttonFileSelector primary' onClick={() => fileInput.click()}>
                    <img src="/src/assets/folderIcon.png" alt="User Icon Button" />
                    <p>SELECCIONAR DOCUMENTOS</p>
                </span>
                <input type="file"
                    accept=".txt, .csv, .tsv, .md, .doc, .docx, .rtf, .odt, .key, .eps, .pdf, .png"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                    id='fileInput'
                    multiple
                    ref={fileInputRef}
                />
            </div>
            <div className='selectedConfiguration' style={{ display: selectedFiles.length > 0 ? 'flex' : 'none' }}>
                <p>Total de configuración seleccionada</p>
                <h1>0 €</h1>
                <span>AÑADIR AL CARRITO</span>
            </div>

            <div className='fileView'>
                {selectedFiles.map((file, index) => (
                    <FileView key={index} file={file} arrayPosition={index + 1} />
                ))}
            </div>
        </div>
    )
}