// Styles
import './Landing.css';

// Dependencies
import { Link } from 'react-router-dom';
import { useMediaQuery } from '@mui/material';

export default function Landing() {
    const isDesktop = useMediaQuery('(min-width:1060px)');

    return (
        <main className="landing">
            <section className="landingLogo">
                {!isDesktop && (
                    <div className='landingLogoFirst'>
                        <img src={`${import.meta.env.VITE_ASSETS_URL}/landingWomen.png`} alt="Landing Logo" />
                    </div>
                )}

                <div className='landingLogoSecond'>
                    <div>
                        <h1>La copisteria <span>online</span> directa a tu casa</h1>
                        <p>Imprime <span>sin colas</span> sin perdidas de tiempo <span>y a la puerta de tú casa</span></p>
                    </div>
                    <Link to={'/app'}>
                        <button>
                            <img src={`${import.meta.env.VITE_ASSETS_URL}/landingUploadDocuments.svg`} alt="Imagen para subir documentos" />
                            <p>Sube ahora tus documentos</p>
                        </button>
                    </Link>
                </div>

                {isDesktop && (
                    <div className='landingLogoFirst'>
                        <img src={`${import.meta.env.VITE_ASSETS_URL}/landingWomen.png`} alt="Landing Logo" />
                    </div>
                )}
            </section>

            <section className='landingPaperPlane'>
                <div className='landingPaperPlaneFirst'>
                    <img src={`${import.meta.env.VITE_ASSETS_URL}/landingPaperPlane.svg`} alt="Landing Paper Plane" loading="lazy" />
                </div>

                <div className='landingPaperPlaneSecond'>
                    <div>
                        <h1>Envío <span>gratis</span> si tu pedido alcanza 49€</h1>
                        <span>... y si no, tenemos los mejores precios de envío</span>
                        <p>Imprime online desde cualquier dispositivo, ordenador, tablet o móvil</p>
                    </div>

                    <Link to={'/app'}>
                        <button>
                            <img src={`${import.meta.env.VITE_ASSETS_URL}/landingSmallPaperPlane.svg`} alt="Imagen para subir documentos" loading="lazy" />
                            <p>Empieza a imprimir</p>
                        </button>
                    </Link>
                </div>
            </section>

            <section className='landingBusiness'>
                <div className='landingBusinessGrid'>
                    <div className='landingBusinessGridRow'>
                        <div className='landingBusinessGridRowItem active'>
                            <div>
                                <h3>DTO.</h3>
                                <h4>Hasta 10%</h4>
                            </div>
                            <p>En todos los pedidos y para siempre</p>
                        </div>
                        <div className='landingBusinessGridRowItem'>
                            <div>
                                <h3>Envios</h3>
                                <h4>Gratuitos</h4>
                            </div>
                            <p>Entrega preferente</p>
                        </div>
                    </div>
                    <div className='landingBusinessGridRow'>
                        <div className='landingBusinessGridRowItem active'>
                            <div>
                                <h3>Tus</h3>
                                <h4>Impresiones</h4>
                            </div>
                            <p>Materiales y maquinaria de última generación</p>
                        </div>
                        <div className='landingBusinessGridRowItem'>
                            <div>
                                <h3>Atención</h3>
                                <h4>Personalizada</h4>
                            </div>
                            <p>Servicio de atención directa con nuestro personal</p>
                        </div>
                    </div>
                </div>

                <div className='landingBusinessInfo'>
                    <h1>Descuentos <span>Business</span></h1>
                    <span>¿Academia, Centro educativo o Empresa?</span>
                    <p><span>Si imprimes un gran volumen</span> o tienes una empresa y necesitas imprimir una gran cantidad de documentos o plotear tus planos para mandarlos a la obra <span>de forma recurrente</span>, mandanos un email y disfruta de <span>descuentos y ventajas preferentes</span></p>
                    <div className='landingBusinessInfoForm'>
                        <input type="email" name="email" placeholder='Email' />
                        <button>Lo quiero!</button>
                    </div>
                </div>
            </section>

            <section className='landingBlueprints'>
                {!isDesktop && (
                    <div className='landingBlueprintsFirst'>
                        <img src={`${import.meta.env.VITE_ASSETS_URL}/landingBlueprints.png`} alt="Landing Blueprints" loading="lazy" />
                    </div>
                )}

                <div className='landingBlueprintsSecond'>
                    <div>
                        <h1>Imprime tus <span>planos</span> en b/n o en <p>color.</p></h1>
                        <p>Nuestros plotter de impresión imprimen en alta calidad al <span>mejor precio y sin moverte</span> de tu casa u oficina</p>
                    </div>
                    <Link to={'/app'}>
                        <button>
                            <img src={`${import.meta.env.VITE_ASSETS_URL}/landingSmallPaperPlane.svg`} alt="Imagen para subir documentos" loading="lazy" />
                            <p>Empieza a imprimir</p>
                        </button>
                    </Link>
                </div>

                {isDesktop && (
                    <div className='landingBlueprintsFirst'>
                        <img src={`${import.meta.env.VITE_ASSETS_URL}/landingBlueprints.png`} alt="Landing Blueprints" loading="lazy" />
                    </div>
                )}
            </section>
        </main>
    );
}