//Dependencies
import { useEffect, useState } from 'react';

//Components
import FileSelector from "../../components/FileSelector/FileSelector";
import FilePreferenceList from "../../components/FilePreferenceList/FilePreferenceList";
import './Home.css';

export default function Home() {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleWindowWidthChange = () => {
            setWindowWidth(window.innerWidth);
        };
        
        window.addEventListener('resize', handleWindowWidthChange);

        return () => {
            window.removeEventListener('resize', handleWindowWidthChange);
        };
    }, []);

    const isMobile = windowWidth < 1024;

    return (
        <>
            {isMobile ? (
                <div className="home">
                    <div className="fileSelectorHome">
                        <FileSelector />
                    </div>
                    <div className="filePreferenceListHome">
                        <FilePreferenceList />
                    </div>
                </div>
            ) : (
                <div className="home">
                    <div className="filePreferenceListHome">
                        <FilePreferenceList />
                    </div>
                    <div className="fileSelectorHome">
                        <FileSelector />
                    </div>
                </div>
            )}
        </>
    )
}