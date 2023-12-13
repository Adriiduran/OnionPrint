import FileSelector from "../../components/FileSelector/FileSelector";
import './Home.css';
import { useAuth } from '../../auth/AuthContext';

export default function Home() {
    const { user } = useAuth();

    return (
        <div className="home">
            <FileSelector/>
        </div>
    )
}