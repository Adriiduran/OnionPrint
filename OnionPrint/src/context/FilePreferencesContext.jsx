import { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';

const ColorEnum = {
    blackAndWhite: { title: "BN", description: "BLANCO Y NEGRO" },
    color: { title: "COLOR", description: "COLORES CMYK" }
}

const PaperSizeEnum = {
    A4: { title: "A4", description: "297 X 210 MM" },
    A3: { title: "A3", description: "420 X 297 MM" },
    A5: { title: "A5", description: "210 X 148 MM" },
    A0: { title: "A0", description: "1189 X 841 MM" },
    A2: { title: "A2", description: "594 X 420 MM" },
    A1: { title: "A1", description: "841 X 594 MM" },
}

const PaperThicknessEnum = {
    '80GR': { title: "80GR", description: "PAPEL COPISTERIA" },
    '160GR': { title: "160GR", description: "GRUESO ALTO" },
    '280GR': { title: "280GR", description: "TIPO CARTULINA" },
    '90GR': { title: "90GR", description: "TIPO PLANOS" },
    '200GR': { title: "200GR", description: "FOTOGRÁFICO" },
    '300GR': { title: "300GR", description: "FOTOGRÁFICO" },
}

const PrintTypeEnum = {
    unaCara: { title: 'UNA CARA', description: 'POR UNA CARA DEL PAPEL' },
    dobleCara: { title: 'DOBLE CARA', description: 'POR AMBAS CARAS DEL PAPEL' },
}

const PrintPerFaceEnum = {
    normal: { title: 'NORMAL', description: 'UNA PÁGINA POR CARA' },
    '2Pages': { title: '2 PÁGINAS', description: 'POR CARA IMPRESA' },
    '2Slides': { title: '2 DIAPOSITIVAS', description: 'POR CARA IMPRESA' },
    '4Slides': { title: '4 DIAPOSITIVAS', description: 'POR CARA IMPRESA' },
}

const OrientationEnum = {
    automatic: { title: 'AUTOMÁTICA', description: 'AJUSTE AUTOMÁTICO' },
    vertical: { title: 'VERTICAL', description: 'DE LA HOJA IMPRESA' },
    horizontal: { title: 'HORIZONTAL', description: 'DE LA HOJA IMPRESA' },
}

const TurnPageModeEnum = {
    longSide: { title: 'LADO LARGO', description: 'POR EL LADO LARGO DEL PAPEL' },
    shortSide: { title: 'LADO CORTO', description: 'POR EL LADO CORTO DEL PAPEL' }
}

const FinishesEnum = {
    noFinishes: { title: 'SIN ACABADO', description: 'SOLO IMPRESIÓN' },
    bound: { title: 'ENCUADERNADO', description: 'ENCUADERNAR' },
    stapling: { title: 'GRAPADO', description: 'GRAPADO EN LA ESQUINA' },
    '2Holes': { title: '2 AGUJEROS', description: 'PERFORADO 2 AGUJEROS' },
    '4Holes': { title: '4 AGUJEROS', description: 'PERFORADO 4 AGUJEROS' },
    laminated: { title: 'PLASTIFICADO', description: 'PLASTIFICADO' },
}

const filePreferences = {
    color: ColorEnum,
    paperSize: PaperSizeEnum,
    paperThickness: PaperThicknessEnum,
    printType: PrintTypeEnum,
    printPerFace: PrintPerFaceEnum,
    orientation: OrientationEnum,
    turnPageMode: TurnPageModeEnum,
    finishes: FinishesEnum
}

// Creamos el contexto
const FilePreferencesContext = createContext();

// Creamos un provider que contendrá el estado y las funciones relacionadas
export const FilePreferencesProvider = ({ children }) => {
    const [currentPreferences, setCurrentPreferences] = useState({
        // Define tus preferencias iniciales
        copies: 1,
        color: ColorEnum.blackAndWhite,
        size: PaperSizeEnum.A4,
        thickness: PaperThicknessEnum['80GR'],
        printType: PrintTypeEnum.unaCara,
        printPerFace: PrintPerFaceEnum.normal,
        orientation: OrientationEnum.automatic,
        turnPageMode: TurnPageModeEnum.longSide,
        finishes: FinishesEnum.noFinishes,
        comentary: ""
    });

    // Función para actualizar las preferencias
    const updateCurrentPreferences = (newPreferences) => {
        setCurrentPreferences((prevPreferences) => ({
            ...prevPreferences,
            ...newPreferences,
        }));
    };

    const resetCurrentPreferences = () => {
        setCurrentPreferences({
            copies: 1,
            color: ColorEnum.blackAndWhite,
            size: PaperSizeEnum.A4,
            thickness: PaperThicknessEnum['80GR'],
            printType: PrintTypeEnum.unaCara,
            printPerFace: PrintPerFaceEnum.normal,
            orientation: OrientationEnum.automatic,
            turnPageMode: TurnPageModeEnum.longSide,
            finishes: FinishesEnum.noFinishes,
            comentary: ""
        })
    }

    return (
        <FilePreferencesContext.Provider value={{ currentPreferences, updateCurrentPreferences, filePreferences, resetCurrentPreferences }}>
            {children}
        </FilePreferencesContext.Provider>
    );
};

// Función personalizada para acceder al contexto
export const useFilePreferences = () => {
    return useContext(FilePreferencesContext);
};

FilePreferencesProvider.propTypes = {
    children: PropTypes.node,
};
