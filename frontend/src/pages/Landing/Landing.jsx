// Styles
import './Landing.css';

// Dependencies
import { Link, useLocation } from 'react-router-dom';
import { useMediaQuery } from '@mui/material';
import { Helmet } from 'react-helmet-async';

export default function Landing() {
    const isDesktop = useMediaQuery('(min-width:1060px)');
    const location = useLocation();
    const pathname = location.pathname;

    const metaByRoute = {
        '/': {
            metaTitle: 'OnionPrint - Copistería Online Rápida, Económica y de Alta Calidad',
            metaDescription: 'Imprime online con OnionPrint. Servicio rápido, económico y de alta calidad para tus documentos, trabajos universitarios, encuadernaciones y más. ¡Haz tu pedido y recíbelo en casa!',
            titleParts: {
                before: 'La copistería ',
                highlight: 'online',
                after: ' directa a tu casa'
            },
            descriptionParagraphs: [
                { before: 'Imprime ', highlight: 'sin colas', after: ' sin pérdidas de tiempo' },
                { before: '', highlight: 'y a la puerta de tu casa', after: '' }
            ]
        },
        '/copisteria-online': {
            metaTitle: 'OnionPrint - Copistería Online 24H barata y de calidad',
            metaDescription: 'Descubre la mejor copistería online con envío 24h. Imprime documentos, apuntes y más desde casa con la calidad de OnionPrint.',
            titleParts: {
                before: 'Tu ',
                highlight: 'copistería',
                after: ' 24H en casa con un solo clic'
            },
            descriptionParagraphs: [
                { before: 'Solicita tus documentos ', highlight: 'de forma rápida', after: ' y sencilla desde cualquier lugar' },
                { before: 'Envíos en 24h ', highlight: 'sin moverte de casa', after: '' }
            ]
        },
        '/imprimir-apuntes-online': {
            metaTitle: 'OnionPrint - Imprime tus Apuntes Online de forma rápida y sencilla',
            metaDescription: 'Sube tus apuntes en PDF y recíbelos impresos donde quieras. Ideal para estudiantes que buscan una solución cómoda y económica.',
            titleParts: {
                before: 'Imprime tus ',
                highlight: 'apuntes',
                after: ' sin moverte de casa'
            },
            descriptionParagraphs: [
                { before: 'Sube tus archivos ', highlight: 'PDF o Word', after: ' y recibe tu impresión lista' },
                { before: 'Ideal para estudiantes que buscan ', highlight: 'comodidad y ahorro', after: '' }
            ]
        },
        '/fotocopias-online': {
            metaTitle: 'OnionPrint - Fotocopias Online económicas y a domicilio',
            metaDescription: 'Solicita tus fotocopias online sin colas. Servicio rápido, cómodo y con envío a domicilio desde solo 39€. Calidad profesional garantizada.',
            titleParts: {
                before: 'Haz tus ',
                highlight: 'fotocopias',
                after: ' online en segundos'
            },
            descriptionParagraphs: [
                { before: 'Solicita copias de tus documentos ', highlight: 'sin colas', after: ' ni esperas innecesarias' },
                { before: 'Recíbelas en casa con ', highlight: 'máxima calidad', after: ' y al mejor precio' }
            ]
        },
        '/universitarios': {
            metaTitle: 'OnionPrint - Impresión Online para Universitarios',
            metaDescription: 'Servicio de impresión pensado para estudiantes universitarios. Sube tus apuntes, trabajos o prácticas y recíbelos en casa sin complicaciones.',
            titleParts: {
                before: 'Pensado para ',
                highlight: 'universitarios',
                after: ' como tú'
            },
            descriptionParagraphs: [
                { before: 'Imprime tus apuntes, prácticas o trabajos ', highlight: 'sin complicaciones', after: '' },
                { before: 'El servicio más cómodo para estudiantes ', highlight: 'desde su facultad o residencia', after: '' }
            ]
        }
    };

    const { metaTitle, metaDescription, titleParts, descriptionParagraphs } = metaByRoute[pathname] || metaByRoute['/'];

    return (
        <>
            <Helmet>
                <title>{metaTitle}</title>
                <meta name="description" content={metaDescription} />
            </Helmet>

            <main className="landing">
                <section className="landingLogo">
                    {!isDesktop && (
                        <div className='landingLogoFirst'>
                            <img src={`${import.meta.env.VITE_ASSETS_URL}/landingWomen.webp`} alt="Landing Logo" />
                        </div>
                    )}

                    <div className='landingLogoSecond'>
                        <div>
                            <h1>
                                {titleParts.before}
                                <span>{titleParts.highlight}</span>
                                {titleParts.after}
                            </h1>
                            <div>
                                {descriptionParagraphs.map((line, index) => (
                                    <p key={index}>
                                        {line.before}<span>{line.highlight}</span>{line.after}
                                    </p>
                                ))}
                            </div>
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
                            <img src={`${import.meta.env.VITE_ASSETS_URL}/landingWomen.webp`} alt="Landing Logo" />
                        </div>
                    )}
                </section>

                <section className='landingPaperPlane'>
                    <div className='landingPaperPlaneFirst'>
                        <img src={`${import.meta.env.VITE_ASSETS_URL}/landingPaperPlane.svg`} alt="Landing Paper Plane" loading="lazy" />
                    </div>

                    <div className='landingPaperPlaneSecond'>
                        <div>
                            <h2>Envío <span>gratis</span> si tu pedido alcanza 39€</h2>
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
                        <h2>Descuentos <span>Business</span></h2>
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
                            <img src={`${import.meta.env.VITE_ASSETS_URL}/landingBlueprints.webp`} alt="Landing Blueprints" loading="lazy" />
                        </div>
                    )}

                    <div className='landingBlueprintsSecond'>
                        <div>
                            <h2>Imprime tus <span>planos</span> en b/n o en <p>color.</p></h2>
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
                            <img src={`${import.meta.env.VITE_ASSETS_URL}/landingBlueprints.webp`} alt="Landing Blueprints" loading="lazy" />
                        </div>
                    )}
                </section>
            </main>
        </>
    );
}
