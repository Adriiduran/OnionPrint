import { useState } from "react";
import PropTypes from "prop-types";
import { useFilePreferences } from "../../context/FilePreferencesContext";
import { useEffect } from "react";

// Styles
import "./FilePreference.css";

export const PreferenceTypeEnum = {
    COPIES: "copies",
    COLOR: "color",
    SIZE1: "size1",
    SIZE2: "size2",
    THICKNESS1: "thickness1",
    THICKNESS2: "thickness2",
    PRINT_TYPE: "printType",
    PRINT_PER_FACE: "printPerFace",
    ORIENTATION: "orientation",
    TURN_PAGE_MODE: "turnPageMode",
    FINISHES: "finishes",
    COMENTARY: "comentary"
};

const FilePreference = ({ preferenceType }) => {
    const { currentPreferences, updateCurrentPreferences, filePreferences } = useFilePreferences();

    const [copiesValue, setCopiesValue] = useState(1);

    const handleReduceCopies = () => {
        const updatedCounter = Math.max(1, copiesValue - 1);
        setCopiesValue(updatedCounter);
        updateCurrentPreferences({ copies: updatedCounter })
    };

    const handleIncreaseCopies = () => {
        const updatedCounter = copiesValue + 1;
        setCopiesValue(updatedCounter);
        updateCurrentPreferences({ copies: updatedCounter })
    };

    const handleCopiesInputChange = (event) => {
        if (event.target.value === null || event.target.value === 0) {
            updateCurrentPreferences({ copies: 1 })
        } else {
            console.log(event.target.value)
            updateCurrentPreferences({ copies: event.target.value })
            setCopiesValue(event.target.value)
        }
    };

    const checkCopiesInput = () => {
        const updatedCounter = Math.max(1, copiesValue || 1);
        setCopiesValue(updatedCounter);
        updateCurrentPreferences({ copies: updatedCounter })

        console.log(currentPreferences.copies)
    };

    const handleKeyDown = (event) => {
        if (event.key === "Backspace" && (copiesValue >= 1 && copiesValue <= 9)) {
            setCopiesValue("");
            updateCurrentPreferences({ copies: 1 })
        } else {
            handleCopiesInputChange(event)
        }
    };

    const handleBlackAndWhiteClick = () => {
        updateCurrentPreferences({ color: filePreferences.color.blackAndWhite })
    }

    const handleColorClick = () => {
        updateCurrentPreferences({ color: filePreferences.color.color })
    }

    const handleA4Click = () => {
        updateCurrentPreferences({ size: filePreferences.paperSize.A4 })

        if (currentPreferences.size === filePreferences.paperSize.A0 ||
            currentPreferences.size === filePreferences.paperSize.A1 ||
            currentPreferences.size === filePreferences.paperSize.A2) {
            updateCurrentPreferences({ thickness: filePreferences.paperThickness['80GR'] })
        }
    }

    const handleA3Click = () => {
        updateCurrentPreferences({ size: filePreferences.paperSize.A3 })

        if (currentPreferences.size === filePreferences.paperSize.A0 ||
            currentPreferences.size === filePreferences.paperSize.A1 ||
            currentPreferences.size === filePreferences.paperSize.A2) {
            updateCurrentPreferences({ thickness: filePreferences.paperThickness['80GR'] })
        }

        if (currentPreferences.finishes !== filePreferences.finishes.noFinishes) {
            updateCurrentPreferences({ finishes: filePreferences.finishes.noFinishes })
        }

        if (currentPreferences.printPerFace !== filePreferences.printPerFace.normal) {
            updateCurrentPreferences({ printPerFace: filePreferences.printPerFace.normal })
        }
    }

    const handleA5Click = () => {
        updateCurrentPreferences({ size: filePreferences.paperSize.A5 })

        if (currentPreferences.size === filePreferences.paperSize.A0 ||
            currentPreferences.size === filePreferences.paperSize.A1 ||
            currentPreferences.size === filePreferences.paperSize.A2) {
            updateCurrentPreferences({ thickness: filePreferences.paperThickness['80GR'] })
        }

        if (currentPreferences.thickness === filePreferences.paperThickness['280GR']) {
            updateCurrentPreferences({ thickness: filePreferences.paperThickness['80GR'] })
        }

        if (currentPreferences.turnPageMode === filePreferences.turnPageMode.shortSide) {
            updateCurrentPreferences({ turnPageMode: filePreferences.turnPageMode.longSide })
        }

        if (currentPreferences.finishes !== filePreferences.finishes.noFinishes) {
            updateCurrentPreferences({ finishes: filePreferences.finishes.noFinishes })
        }

        if (currentPreferences.printPerFace !== filePreferences.printPerFace.normal) {
            updateCurrentPreferences({ printPerFace: filePreferences.printPerFace.normal })
        }
    }

    const handleA2Click = () => {
        updateCurrentPreferences({ size: filePreferences.paperSize.A2 })

        if (currentPreferences.size === filePreferences.paperSize.A3 ||
            currentPreferences.size === filePreferences.paperSize.A4 ||
            currentPreferences.size === filePreferences.paperSize.A5) {
            updateCurrentPreferences({ thickness: filePreferences.paperThickness['90GR'], finishes: filePreferences.finishes.noFinishes, turnPageMode: null })
        }

        if ((currentPreferences.size === filePreferences.paperSize.A3 ||
            currentPreferences.size === filePreferences.paperSize.A4 ||
            currentPreferences.size === filePreferences.paperSize.A5) &&
            currentPreferences.printPerFace !== filePreferences.printPerFace.normal) {
            updateCurrentPreferences({ printPerFace: filePreferences.printPerFace.normal })
        }
    }

    const handleA1Click = () => {
        updateCurrentPreferences({ size: filePreferences.paperSize.A1 })

        if (currentPreferences.size === filePreferences.paperSize.A3 ||
            currentPreferences.size === filePreferences.paperSize.A4 ||
            currentPreferences.size === filePreferences.paperSize.A5) {
            updateCurrentPreferences({ thickness: filePreferences.paperThickness['90GR'], finishes: filePreferences.finishes.noFinishes, turnPageMode: null })
        }

        if ((currentPreferences.size === filePreferences.paperSize.A3 ||
            currentPreferences.size === filePreferences.paperSize.A4 ||
            currentPreferences.size === filePreferences.paperSize.A5) &&
            currentPreferences.printPerFace !== filePreferences.printPerFace.normal) {
            updateCurrentPreferences({ printPerFace: filePreferences.printPerFace.normal })
        }
    }

    const handleA0Click = () => {
        updateCurrentPreferences({ size: filePreferences.paperSize.A0 })

        if (currentPreferences.size === filePreferences.paperSize.A3 ||
            currentPreferences.size === filePreferences.paperSize.A4 ||
            currentPreferences.size === filePreferences.paperSize.A5) {
            updateCurrentPreferences({ thickness: filePreferences.paperThickness['90GR'], finishes: filePreferences.finishes.noFinishes, turnPageMode: null })
        }

        if ((currentPreferences.size === filePreferences.paperSize.A3 ||
            currentPreferences.size === filePreferences.paperSize.A4 ||
            currentPreferences.size === filePreferences.paperSize.A5) &&
            currentPreferences.printPerFace !== filePreferences.printPerFace.normal) {
            updateCurrentPreferences({ printPerFace: filePreferences.printPerFace.normal })
        }
    }

    const handle80GRClick = () => {
        updateCurrentPreferences({ thickness: filePreferences.paperThickness['80GR'] })
    }

    const handle160GRClick = () => {
        updateCurrentPreferences({ thickness: filePreferences.paperThickness['160GR'] })
    }

    const handle280GRClick = () => {
        updateCurrentPreferences({ thickness: filePreferences.paperThickness['280GR'] })
    }

    const handle90GRClick = () => {
        updateCurrentPreferences({ thickness: filePreferences.paperThickness['90GR'] })
    }

    const handle200GRClick = () => {
        updateCurrentPreferences({ thickness: filePreferences.paperThickness['200GR'] })
    }

    const handle300GRClick = () => {
        updateCurrentPreferences({ thickness: filePreferences.paperThickness['300GR'] })
    }

    const handleUnaCaraClick = () => {
        updateCurrentPreferences({ printType: filePreferences.printType.unaCara })
    }

    const handleDobleCaraClick = () => {
        updateCurrentPreferences({ printType: filePreferences.printType.dobleCara })
    }

    const handleAutomaticClick = () => {
        updateCurrentPreferences({ orientation: filePreferences.orientation.automatic })

        if (currentPreferences.size === filePreferences.paperSize.A5) {
            updateCurrentPreferences({ orientation: filePreferences.orientation.automatic, turnPageMode: filePreferences.turnPageMode.longSide })
        }
    }

    const handleVerticalClick = () => {
        updateCurrentPreferences({ orientation: filePreferences.orientation.vertical })

        if (currentPreferences.size === filePreferences.paperSize.A5) {
            updateCurrentPreferences({ orientation: filePreferences.orientation.vertical, turnPageMode: filePreferences.turnPageMode.longSide })
        }
    }

    const handleHorizontalClick = () => {
        updateCurrentPreferences({ orientation: filePreferences.orientation.horizontal })
    }

    const handleLongSideClick = () => {
        updateCurrentPreferences({ turnPageMode: filePreferences.turnPageMode.longSide })
    }

    const handleShortSideClick = () => {
        updateCurrentPreferences({ turnPageMode: filePreferences.turnPageMode.shortSide })
    }

    const handleNormalClick = () => {
        updateCurrentPreferences({ printPerFace: filePreferences.printPerFace.normal })
    }

    const handle2PagesClick = () => {
        updateCurrentPreferences({ printPerFace: filePreferences.printPerFace['2Pages'], orientation: filePreferences.orientation.horizontal })
    }

    const handle2SlidesClick = () => {
        updateCurrentPreferences({ printPerFace: filePreferences.printPerFace['2Slides'], orientation: filePreferences.orientation.vertical })
    }

    const handle4SlidesClick = () => {
        updateCurrentPreferences({ printPerFace: filePreferences.printPerFace['4Slides'], orientation: filePreferences.orientation.horizontal })
    }

    const handleNoFinishesClick = () => {
        updateCurrentPreferences({ finishes: filePreferences.finishes.noFinishes })
    }

    const handleBoundClick = () => {
        updateCurrentPreferences({ finishes: filePreferences.finishes.bound })
    }

    const handleStaplingClick = () => {
        updateCurrentPreferences({ finishes: filePreferences.finishes.stapling })
    }

    const handle2HolesClick = () => {
        updateCurrentPreferences({ finishes: filePreferences.finishes['2Holes'] })
    }

    const handle4HolesClick = () => {
        updateCurrentPreferences({ finishes: filePreferences.finishes['4Holes'] })
    }

    const handleLaminatedClick = () => {
        updateCurrentPreferences({ finishes: filePreferences.finishes.laminated })
    }

    const checkIfPreferenceIsACurrentPreference = (preference) => {
        return Object.values(currentPreferences).includes(preference);
    }

    const handleStylesByCurrentPreferences = (preference) => {
        let style = "";

        //A4 && 80GR
        if (
            filePreferences.paperSize.A4 === currentPreferences.size &&
            (filePreferences.paperThickness['80GR'] === currentPreferences.thickness)
        ) {
            if (
                preference === filePreferences.paperThickness['90GR'] ||
                preference === filePreferences.paperThickness['200GR'] ||
                preference === filePreferences.paperThickness['300GR'] ||
                (filePreferences.printPerFace['2Slides'] === currentPreferences.printPerFace && (preference === filePreferences.orientation.automatic || preference === filePreferences.orientation.horizontal)) ||
                ((filePreferences.printPerFace['2Pages'] === currentPreferences.printPerFace ||
                    filePreferences.printPerFace['4Slides'] === currentPreferences.printPerFace) &&
                    (preference === filePreferences.orientation.automatic || preference === filePreferences.orientation.vertical)) ||
                (filePreferences.printPerFace['2Slides'] === currentPreferences.printPerFace && preference === filePreferences.turnPageMode.shortSide)
            ) {
                style = 'disabled';
            } else if (checkIfPreferenceIsACurrentPreference(preference)) {
                style = 'primaryFilePreference';
            } else {
                style = 'secondaryFilePreference';
            }
        }

        //A4 && 160GR || 280GR
        if (
            filePreferences.paperSize.A4 === currentPreferences.size &&
            (filePreferences.paperThickness['280GR'] === currentPreferences.thickness ||
                filePreferences.paperThickness['160GR'] === currentPreferences.thickness)
        ) {
            if (
                preference === filePreferences.paperThickness['90GR'] ||
                preference === filePreferences.paperThickness['200GR'] ||
                preference === filePreferences.paperThickness['300GR'] ||
                (filePreferences.printPerFace['2Slides'] === currentPreferences.printPerFace && (preference === filePreferences.orientation.automatic || preference === filePreferences.orientation.horizontal)) ||
                ((filePreferences.printPerFace['2Pages'] === currentPreferences.printPerFace ||
                    filePreferences.printPerFace['4Slides'] === currentPreferences.printPerFace) &&
                    (preference === filePreferences.orientation.automatic || preference === filePreferences.orientation.vertical)) ||
                (filePreferences.printPerFace['2Slides'] === currentPreferences.printPerFace && preference === filePreferences.turnPageMode.shortSide) ||
                preference === filePreferences.finishes.bound ||
                preference === filePreferences.finishes.stapling ||
                preference === filePreferences.finishes['2Holes'] ||
                preference === filePreferences.finishes['4Holes'] ||
                preference === filePreferences.finishes.laminated
            ) {
                style = 'disabled';
            } else if (checkIfPreferenceIsACurrentPreference(preference)) {
                style = 'primaryFilePreference';
            } else {
                style = 'secondaryFilePreference';
            }
        }

        //A5 && 80GR || 160GR.
        if (
            filePreferences.paperSize.A5 === currentPreferences.size &&
            (filePreferences.paperThickness['80GR'] === currentPreferences.thickness ||
                filePreferences.paperThickness['160GR'] === currentPreferences.thickness)
        ) {
            if (
                preference === filePreferences.paperThickness['90GR'] ||
                preference === filePreferences.paperThickness['200GR'] ||
                preference === filePreferences.paperThickness['300GR'] ||
                preference === filePreferences.paperThickness['280GR'] ||
                preference === filePreferences.printPerFace['2Pages'] ||
                preference === filePreferences.printPerFace['2Slides'] ||
                preference === filePreferences.printPerFace['4Slides'] ||
                ((currentPreferences.orientation === filePreferences.orientation.automatic ||
                    currentPreferences.orientation === filePreferences.orientation.vertical) && preference === filePreferences.turnPageMode.shortSide) ||
                preference === filePreferences.finishes.bound ||
                preference === filePreferences.finishes.stapling ||
                preference === filePreferences.finishes['2Holes'] ||
                preference === filePreferences.finishes['4Holes'] ||
                preference === filePreferences.finishes.laminated
            ) {
                style = 'disabled';
            } else if (checkIfPreferenceIsACurrentPreference(preference)) {
                style = 'primaryFilePreference';
            } else {
                style = 'secondaryFilePreference';
            }
        }

        //A3 && 80GR || 160GR || 280GR
        if (
            filePreferences.paperSize.A3 === currentPreferences.size &&
            (filePreferences.paperThickness['80GR'] === currentPreferences.thickness ||
                filePreferences.paperThickness['160GR'] === currentPreferences.thickness ||
                filePreferences.paperThickness['280GR'] === currentPreferences.thickness)
        ) {
            if (
                preference === filePreferences.paperThickness['90GR'] ||
                preference === filePreferences.paperThickness['200GR'] ||
                preference === filePreferences.paperThickness['300GR'] ||
                preference === filePreferences.printPerFace['2Pages'] ||
                preference === filePreferences.printPerFace['2Slides'] ||
                preference === filePreferences.printPerFace['4Slides'] ||
                preference === filePreferences.turnPageMode.shortSide ||
                preference === filePreferences.finishes.bound ||
                preference === filePreferences.finishes.stapling ||
                preference === filePreferences.finishes['2Holes'] ||
                preference === filePreferences.finishes['4Holes'] ||
                preference === filePreferences.finishes.laminated
            ) {
                style = 'disabled';
            } else if (checkIfPreferenceIsACurrentPreference(preference)) {
                style = 'primaryFilePreference';
            } else {
                style = 'secondaryFilePreference';
            }
        }


        //A0 || A1 || A2 && 90GR || 200GR || 300GR (siempre una cara, impresiones por cara solo normal, orientacion siempre automatica, pasar pagina no se enciende ninguno y ningun acabado)
        if (
            (filePreferences.paperSize.A0 === currentPreferences.size ||
                filePreferences.paperSize.A1 === currentPreferences.size ||
                filePreferences.paperSize.A2 === currentPreferences.size) &&
            (filePreferences.paperThickness['90GR'] === currentPreferences.thickness ||
                filePreferences.paperThickness['200GR'] === currentPreferences.thickness ||
                filePreferences.paperThickness['300GR'] === currentPreferences.thickness)
        ) {
            if (
                preference === filePreferences.paperThickness['80GR'] ||
                preference === filePreferences.paperThickness['160GR'] ||
                preference === filePreferences.paperThickness['280GR'] ||
                preference === filePreferences.turnPageMode.shortSide ||
                preference === filePreferences.printType['dobleCara'] ||
                preference === filePreferences.printPerFace['2Pages'] ||
                preference === filePreferences.printPerFace['2Slides'] ||
                preference === filePreferences.printPerFace['4Slides'] ||
                preference === filePreferences.turnPageMode.shortSide ||
                preference === filePreferences.turnPageMode.longSide ||
                preference === filePreferences.finishes.bound ||
                preference === filePreferences.finishes.stapling ||
                preference === filePreferences.finishes['2Holes'] ||
                preference === filePreferences.finishes['4Holes'] ||
                preference === filePreferences.finishes.laminated
            ) {
                style = 'disabled';
            } else if (checkIfPreferenceIsACurrentPreference(preference)) {
                style = 'primaryFilePreference';
            } else {
                style = 'secondaryFilePreference';
            }
        }

        return style + " ";
    }

    const renderPreferenceContent = () => {
        switch (preferenceType) {
            case PreferenceTypeEnum.COPIES:
                return (
                    <div className="preferenceItemDetailsRow primaryFilePreferenceFileControls">
                        <span className="inputControlsFilePreference" onClick={handleReduceCopies}>-</span>
                        <input
                            type="number"
                            name="copies"
                            id="copies"
                            className="copiesInputFilePreference"
                            value={copiesValue}
                            onChange={handleCopiesInputChange}
                            onBlur={checkCopiesInput}
                            onKeyDown={handleKeyDown}
                        />
                        <span className="inputControlsFilePreference" onClick={handleIncreaseCopies}>+</span>
                    </div>
                );
            case PreferenceTypeEnum.COLOR:
                return (
                    <>
                        <div className="preferenceItemList">
                            <div className={handleStylesByCurrentPreferences(filePreferences.color.blackAndWhite) + 'preferenceItemDetailsColumn'} onClick={handleBlackAndWhiteClick}>
                                <h3>{filePreferences.color.blackAndWhite.title}</h3>
                                <span>{filePreferences.color.blackAndWhite.description}</span>
                            </div>

                            <div className={handleStylesByCurrentPreferences(filePreferences.color.color) + 'preferenceItemDetailsColumn'} onClick={handleColorClick}>
                                <h3>{filePreferences.color.color.title}</h3>
                                <span>{filePreferences.color.color.description}</span>
                            </div>
                        </div>
                    </>
                );
            case PreferenceTypeEnum.SIZE1:
                return (
                    <div className="preferenceItemDetailsColumn">
                        <div className="preferenceItemList">
                            <div className={handleStylesByCurrentPreferences(filePreferences.paperSize.A5) + 'preferenceItemDetailsColumn'} onClick={handleA5Click}>
                                <h3>{filePreferences.paperSize.A5.title}</h3>
                                <span>{filePreferences.paperSize.A5.description}</span>
                            </div>

                            <div className={handleStylesByCurrentPreferences(filePreferences.paperSize.A4) + 'preferenceItemDetailsColumn'} onClick={handleA4Click}>
                                <h3>{filePreferences.paperSize.A4.title}</h3>
                                <span>{filePreferences.paperSize.A4.description}</span>
                            </div>

                            <div className={handleStylesByCurrentPreferences(filePreferences.paperSize.A3) + 'preferenceItemDetailsColumn'} onClick={handleA3Click}>
                                <h3>{filePreferences.paperSize.A3.title}</h3>
                                <span>{filePreferences.paperSize.A3.description}</span>
                            </div>
                        </div>
                    </div>
                );

            case PreferenceTypeEnum.SIZE2:
                return (
                    <>
                        <div className="preferenceItemList">
                            <div className={handleStylesByCurrentPreferences(filePreferences.paperSize.A2) + 'preferenceItemDetailsColumn'} onClick={handleA2Click}>
                                <h3>{filePreferences.paperSize.A2.title}</h3>
                                <span>{filePreferences.paperSize.A2.description}</span>
                            </div>

                            <div className={handleStylesByCurrentPreferences(filePreferences.paperSize.A1) + 'preferenceItemDetailsColumn'} onClick={handleA1Click}>
                                <h3>{filePreferences.paperSize.A1.title}</h3>
                                <span>{filePreferences.paperSize.A1.description}</span>
                            </div>

                            <div className={handleStylesByCurrentPreferences(filePreferences.paperSize.A0) + 'preferenceItemDetailsColumn'} onClick={handleA0Click}>
                                <h3>{filePreferences.paperSize.A0.title}</h3>
                                <span>{filePreferences.paperSize.A0.description}</span>
                            </div>
                        </div>
                    </>
                );
            case PreferenceTypeEnum.THICKNESS1:
                return (
                    <>
                        <div className="preferenceItemList">
                            <div className={handleStylesByCurrentPreferences(filePreferences.paperThickness['80GR']) + 'preferenceItemDetailsColumn'} onClick={handleStylesByCurrentPreferences(filePreferences.paperThickness['80GR']) === 'disabled ' ? null : handle80GRClick}>
                                <h3>{filePreferences.paperThickness['80GR'].title}</h3>
                                <span>{filePreferences.paperThickness['80GR'].description}</span>
                            </div>

                            <div className={handleStylesByCurrentPreferences(filePreferences.paperThickness['160GR']) + 'preferenceItemDetailsColumn'} onClick={handleStylesByCurrentPreferences(filePreferences.paperThickness['160GR']) === 'disabled ' ? null : handle160GRClick}>
                                <h3>{filePreferences.paperThickness['160GR'].title}</h3>
                                <span>{filePreferences.paperThickness['160GR'].description}</span>
                            </div>

                            <div className={handleStylesByCurrentPreferences(filePreferences.paperThickness['280GR']) + 'preferenceItemDetailsColumn'} onClick={handleStylesByCurrentPreferences(filePreferences.paperThickness['280GR']) === 'disabled ' ? null : handle280GRClick}>
                                <h3>{filePreferences.paperThickness['280GR'].title}</h3>
                                <span>{filePreferences.paperThickness['280GR'].description}</span>
                            </div>
                        </div>
                    </>
                );
            case PreferenceTypeEnum.THICKNESS2:
                return (
                    <>
                        <div className="preferenceItemList">
                            <div className={handleStylesByCurrentPreferences(filePreferences.paperThickness['90GR']) + 'preferenceItemDetailsColumn'} onClick={handleStylesByCurrentPreferences(filePreferences.paperThickness['90GR']) === 'disabled ' ? null : handle90GRClick}>
                                <h3>{filePreferences.paperThickness['90GR'].title}</h3>
                                <span>{filePreferences.paperThickness['90GR'].description}</span>
                            </div>

                            <div className={handleStylesByCurrentPreferences(filePreferences.paperThickness['200GR']) + 'preferenceItemDetailsColumn'} onClick={handleStylesByCurrentPreferences(filePreferences.paperThickness['200GR']) === 'disabled ' ? null : handle200GRClick}>
                                <h3>{filePreferences.paperThickness['200GR'].title}</h3>
                                <span>{filePreferences.paperThickness['200GR'].description}</span>
                            </div>

                            <div className={handleStylesByCurrentPreferences(filePreferences.paperThickness['300GR']) + 'preferenceItemDetailsColumn'} onClick={handleStylesByCurrentPreferences(filePreferences.paperThickness['300GR']) === 'disabled ' ? null : handle300GRClick}>
                                <h3>{filePreferences.paperThickness['300GR'].title}</h3>
                                <span>{filePreferences.paperThickness['300GR'].description}</span>
                            </div>
                        </div>
                    </>
                );
            case PreferenceTypeEnum.PRINT_TYPE:
                return (
                    <>
                        <div className="preferenceItemList">
                            <div className={handleStylesByCurrentPreferences(filePreferences.printType.unaCara) + 'preferenceItemDetailsColumn'} onClick={handleStylesByCurrentPreferences(filePreferences.printType.unaCara) === 'disabled ' ? null : handleUnaCaraClick}>
                                <h3>{filePreferences.printType.unaCara.title}</h3>
                                <span>{filePreferences.printType.unaCara.description}</span>
                            </div>

                            <div className={handleStylesByCurrentPreferences(filePreferences.printType.dobleCara) + 'preferenceItemDetailsColumn'} onClick={handleStylesByCurrentPreferences(filePreferences.printType.dobleCara) === 'disabled ' ? null : handleDobleCaraClick}>
                                <h3>{filePreferences.printType.dobleCara.title}</h3>
                                <span>{filePreferences.printType.dobleCara.description}</span>
                            </div>
                        </div>
                    </>
                );
            case PreferenceTypeEnum.PRINT_PER_FACE:
                return (
                    <div className="preferenceItemDetailsColumn">
                        <div className="preferenceItemList">
                            <div className={handleStylesByCurrentPreferences(filePreferences.printPerFace.normal) + 'preferenceItemDetailsRow'} onClick={handleStylesByCurrentPreferences(filePreferences.printPerFace.normal) === 'disabled ' ? null : handleNormalClick}>
                                <img src="/src/assets/normal.svg" alt="impresion normal" />
                                <div className='preferenceItemDetailsColumn' >
                                    <h3>{filePreferences.printPerFace.normal.title}</h3>
                                    <span>{filePreferences.printPerFace.normal.description}</span>
                                </div>
                            </div>

                            <div className={handleStylesByCurrentPreferences(filePreferences.printPerFace['2Pages']) + 'preferenceItemDetailsRow'} onClick={handleStylesByCurrentPreferences(filePreferences.printPerFace['2Pages']) === 'disabled ' ? null : handle2PagesClick}>
                                <img src="/src/assets/2paginas.svg" alt="impresion normal" />
                                <div className='preferenceItemDetailsColumn' >
                                    <h3>{filePreferences.printPerFace['2Pages'].title}</h3>
                                    <span>{filePreferences.printPerFace['2Pages'].description}</span>
                                </div>
                            </div>
                        </div>
                        <div className="preferenceItemList">
                            <div className={handleStylesByCurrentPreferences(filePreferences.printPerFace['2Slides']) + 'preferenceItemDetailsRow'} onClick={handleStylesByCurrentPreferences(filePreferences.printPerFace['2Slides']) === 'disabled ' ? null : handle2SlidesClick}>
                                <img src="/src/assets/2diapositivas.svg" alt="impresion normal" />
                                <div className='preferenceItemDetailsColumn' >
                                    <h3>{filePreferences.printPerFace['2Slides'].title}</h3>
                                    <span>{filePreferences.printPerFace['2Slides'].description}</span>
                                </div>
                            </div>

                            <div className={handleStylesByCurrentPreferences(filePreferences.printPerFace['4Slides']) + 'preferenceItemDetailsRow'} onClick={handleStylesByCurrentPreferences(filePreferences.printPerFace['4Slides']) === 'disabled ' ? null : handle4SlidesClick}>
                                <img src="/src/assets/4diapositivas.svg" alt="impresion normal" />
                                <div className='preferenceItemDetailsColumn' >
                                    <h3>{filePreferences.printPerFace['4Slides'].title}</h3>
                                    <span>{filePreferences.printPerFace['4Slides'].description}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case PreferenceTypeEnum.ORIENTATION:
                return (
                    <>
                        <div className="preferenceItemList">
                            <div className={handleStylesByCurrentPreferences(filePreferences.orientation.automatic) + 'preferenceItemDetailsColumn'} onClick={handleStylesByCurrentPreferences(filePreferences.orientation.automatic) === 'disabled ' ? null : handleAutomaticClick}>
                                <h3>{filePreferences.orientation.automatic.title}</h3>
                                <span>{filePreferences.orientation.automatic.description}</span>
                            </div>

                            <div className={handleStylesByCurrentPreferences(filePreferences.orientation.vertical) + 'preferenceItemDetailsColumn'} onClick={handleStylesByCurrentPreferences(filePreferences.orientation.vertical) === 'disabled ' ? null : handleVerticalClick}>
                                <h3>{filePreferences.orientation.vertical.title}</h3>
                                <span>{filePreferences.orientation.vertical.description}</span>
                            </div>

                            <div className={handleStylesByCurrentPreferences(filePreferences.orientation.horizontal) + 'preferenceItemDetailsColumn'} onClick={handleStylesByCurrentPreferences(filePreferences.orientation.horizontal) === 'disabled ' ? null : handleHorizontalClick}>
                                <h3>{filePreferences.orientation.horizontal.title}</h3>
                                <span>{filePreferences.orientation.horizontal.description}</span>
                            </div>
                        </div>
                    </>
                );
            case PreferenceTypeEnum.TURN_PAGE_MODE:
                return (
                    <>
                        <div className="preferenceItemList">
                            <div className={handleStylesByCurrentPreferences(filePreferences.turnPageMode.longSide) + 'preferenceItemDetailsColumn'} onClick={handleStylesByCurrentPreferences(filePreferences.turnPageMode.longSide) === 'disabled ' ? null : handleLongSideClick}>
                                <h3>{filePreferences.turnPageMode.longSide.title}</h3>
                                <span>{filePreferences.turnPageMode.longSide.description}</span>
                            </div>

                            <div className={handleStylesByCurrentPreferences(filePreferences.turnPageMode.shortSide) + 'preferenceItemDetailsColumn'} onClick={handleStylesByCurrentPreferences(filePreferences.turnPageMode.shortSide) === 'disabled ' ? null : handleShortSideClick}>
                                <h3>{filePreferences.turnPageMode.shortSide.title}</h3>
                                <span>{filePreferences.turnPageMode.shortSide.description}</span>
                            </div>
                        </div>
                    </>
                );
            case PreferenceTypeEnum.FINISHES:
                return (
                    <div className="preferenceItemDetailsColumn">
                        <div className="preferenceItemList">
                            <div className={handleStylesByCurrentPreferences(filePreferences.finishes.noFinishes) + 'preferenceItemDetailsRow'} onClick={handleNoFinishesClick}>
                                <img src="/src/assets/sinAcabado.svg" alt="impresion normal" />
                                <div className='preferenceItemDetailsColumn' >
                                    <h3>{filePreferences.finishes.noFinishes.title}</h3>
                                    <span>{filePreferences.finishes.noFinishes.description}</span>
                                </div>
                            </div>

                            <div className={handleStylesByCurrentPreferences(filePreferences.finishes.bound) + 'preferenceItemDetailsRow'} onClick={handleBoundClick}>
                                <img src="/src/assets/grapado.svg" alt="encuadernado" />
                                <div className='preferenceItemDetailsColumn' >
                                    <h3>{filePreferences.finishes.bound.title}</h3>
                                    <span>{filePreferences.finishes.bound.description}</span>
                                </div>
                            </div>
                        </div>
                        <div className="preferenceItemList">
                            <div className={handleStylesByCurrentPreferences(filePreferences.finishes.stapling) + 'preferenceItemDetailsRow'} onClick={handleStaplingClick}>
                                <img src="/src/assets/grapado.svg" alt="impresion normal" />
                                <div className='preferenceItemDetailsColumn' >
                                    <h3>{filePreferences.finishes.stapling.title}</h3>
                                    <span>{filePreferences.finishes.stapling.description}</span>
                                </div>
                            </div>

                            <div className={handleStylesByCurrentPreferences(filePreferences.finishes['2Holes']) + 'preferenceItemDetailsRow'} onClick={handle2HolesClick}>
                                <img src="/src/assets/2Agujeros.svg" alt="impresion normal" />
                                <div className='preferenceItemDetailsColumn' >
                                    <h3>{filePreferences.finishes['2Holes'].title}</h3>
                                    <span>{filePreferences.finishes['2Holes'].description}</span>
                                </div>
                            </div>
                        </div>

                        <div className="preferenceItemList">
                            <div className={handleStylesByCurrentPreferences(filePreferences.finishes['4Holes']) + 'preferenceItemDetailsRow'} onClick={handle4HolesClick}>
                                <img src="/src/assets/4Agujeros.svg" alt="impresion normal" />
                                <div className='preferenceItemDetailsColumn' >
                                    <h3>{filePreferences.finishes['4Holes'].title}</h3>
                                    <span>{filePreferences.finishes['4Holes'].description}</span>
                                </div>
                            </div>

                            <div className={handleStylesByCurrentPreferences(filePreferences.finishes.laminated) + 'preferenceItemDetailsRow'} onClick={handleLaminatedClick}>
                                <img src="/src/assets/sinAcabado.svg" alt="impresion normal" />
                                <div className='preferenceItemDetailsColumn' >
                                    <h3>{filePreferences.finishes.laminated.title}</h3>
                                    <span>{filePreferences.finishes.laminated.description}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case PreferenceTypeEnum.COMENTARY:
                return (
                    <div className="preferenceItemList">
                        <textarea className="textareaFilePreference" placeholder="Se imprimirá según la configuración que has indicado ¡Importante! Previsualizar el pedido." rows={3}>
                        </textarea>
                    </div>
                );
            default:
                return <div>Default content for unknown preference type</div>;
        }
    };

    return <>{renderPreferenceContent()}</>;
};

FilePreference.propTypes = {
    preferenceType: PropTypes.oneOf(Object.values(PreferenceTypeEnum)).isRequired,
};

export default FilePreference;
