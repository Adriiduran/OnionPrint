import './FilePreferenceList.css';
import FilePreference from "../FilePreference/FilePreference";

export default function FilePreferenceList() {
    return (
        <div className="backgroundPreferenceList">
            <div className="filePreferenceItem">
                <div className="filePreferenceItemTitle">
                    <span>COPIAS</span>
                </div>
                <div className="filePreferenceListCounter">
                    <FilePreference preferenceType="copies"></FilePreference>
                </div>
            </div>
            <hr />
            <div className="filePreferenceItem">
                <div className="filePreferenceItemTitle">
                    <span>COLOR</span>
                </div>
                <div className="filePreferenceListCounter">
                    <FilePreference preferenceType="color"></FilePreference>
                </div>
            </div>
            <hr />
            <div className="filePreferenceItem">
                <div className="filePreferenceItemTitle">
                    <span>TAMAÑO DEL PAPEL</span>
                </div>
                <div className="filePreferenceListCounter">
                    <FilePreference preferenceType="size1"></FilePreference>
                </div>
                <div className="filePreferenceItemTitle">
                    <span>PLANOS / POSTERS</span>
                </div>
                <div className="filePreferenceListCounter">
                    <FilePreference preferenceType="size2"></FilePreference>
                </div>
            </div>
            <hr />
            <div className="filePreferenceItem">
                <div className="filePreferenceItemTitle">
                    <span>GROSOR DEL PAPEL</span>
                </div>
                <div className="filePreferenceListCounter">
                    <FilePreference preferenceType="thickness1"></FilePreference>
                </div>
                <div className="filePreferenceItemTitle">
                    <span>PLANOS / POSTERS</span>
                </div>
                <div className="filePreferenceListCounter">
                    <FilePreference preferenceType="thickness2"></FilePreference>
                </div>
            </div>
            <hr />
            <div className="filePreferenceItem">
                <div className="filePreferenceItemTitle">
                    <span>FORMA DE IMPRESIÓN</span>
                </div>
                <div className="filePreferenceListCounter">
                    <FilePreference preferenceType="printType"></FilePreference>
                </div>
            </div>
            <hr />
            <div className="filePreferenceItem">
                <div className="filePreferenceItemTitle">
                    <span>IMPRESIONES POR CARA</span>
                </div>
                <div className="filePreferenceListCounter">
                    <FilePreference preferenceType="printPerFace"></FilePreference>
                </div>
            </div>
            <hr />
            <div className="filePreferenceItem">
                <div className="filePreferenceItemTitle">
                    <span>ORIENTACIÓN</span>
                </div>
                <div className="filePreferenceListCounter">
                    <FilePreference preferenceType="orientation"></FilePreference>
                </div>
            </div>
            <hr />
            <div className="filePreferenceItem">
                <div className="filePreferenceItemTitle">
                    <span>PASAR PÁGINA</span>
                </div>
                <div className="filePreferenceListCounter">
                    <FilePreference preferenceType="turnPageMode"></FilePreference>
                </div>
            </div>
            <hr />
            <div className="filePreferenceItem">
                <div className="filePreferenceItemTitle">
                    <span>ACABADOS</span>
                </div>
                <div className="filePreferenceListCounter">
                    <FilePreference preferenceType="finishes"></FilePreference>
                </div>
            </div>
            <hr />
            <div className="filePreferenceItem">
                <div className="filePreferenceItemTitle">
                    <span>COMENTARIOS</span>
                </div>
                <div className="filePreferenceListCounter">
                    <FilePreference preferenceType="comentary"></FilePreference>
                </div>
            </div>
        </div>
    )
}