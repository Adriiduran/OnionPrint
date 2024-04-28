import "./PageNotFound.css"
import { useNavigate } from 'react-router-dom';

export default function PageNotFound() {
  const navigator = useNavigate();
  

  return (
    <section className="PageNotFoundhome">
      <div className="PageNotFoundimage">
        <img src={`${import.meta.env.VITE_ASSETS_URL}/Scarecrow.png`} alt="Scarecrow" width="100px" />
      </div>

      <div className="PageNotFoundcontent">
        <h1>Tenemos malas noticias para tí</h1>
        <p>La página que estás buscando puede que se haya eliminado o sea inaccesible temporalmente</p>

        <a className="PageNotFoundbtn" onClick={() => {navigator("/")}}>Volver al Incio</a>
      </div>
    </section>
  );
}