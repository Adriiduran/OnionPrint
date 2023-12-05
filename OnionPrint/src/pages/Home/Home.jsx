import FileSelector from "../../components/FileSelector/FileSelector";
import './Home.css';
import { useAuth } from '../../auth/AuthContext';

export default function Home() {
    const { user } = useAuth();

    if (user) {
        console.log("El usuario esta logueado ")
        console.log(user)
    } else {
        console.log("El usuario no esta logueado " + user)
    }

    return (
        <div className="home">
            <FileSelector/>
        </div>
    )
}