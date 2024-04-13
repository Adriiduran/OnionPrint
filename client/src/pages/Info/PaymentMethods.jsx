import './Info.css'

export default function PaymentMethods() {
    return (
        <div className='info'>
            <div className='info-header'>
                <h1>FORMAS DE PAGO</h1>
                <h3>PONEMOS A TU DISPOSICIÓN NUMEROSAS FORMAS DE PAGO. ESCOGE LA QUE MEJOR SE ADAPTE A TI.</h3>
                <p>En OnionPrint disponemos de cuatro formas de pago distintas para que puedas escoger la que más te convenga. Nuestra web tiene un cifrado de 256 bits, garantizando así la seguridad durante cualquiera de los procesos de pago. Para OnionPrint la seguridad de tus datos es muy importante por ello utilizamos una pasarela de pagos para mayor seguridad de nuestros clientes. </p>
            </div>

            <div className='info-block'>
                <h2>TARJETA DE CRÉDITO Y DÉBITO</h2>
                <p>Permitimos todas las tarjetas de crédito o débito Visa, Mastercard y American Express. Se utiliza para ello una pasarela de pago bancaria totalmente segura. <strong>Los datos de tu tarjeta no los facilitas nunca a OnionPrint, por lo que no somos los responsables de su almacenamiento.</strong></p>
                <p>Además de ser fácil y rápido, elegir pagar con tarjeta hace que tú compra se tramite de forma inmediata.</p>
            </div>

            <div className='info-block'>
                <h2>PAYPAL</h2>
                <p>En OnionPrint se puede pagar con PayPal sin ningún tipo de comisión extra. Así, al confirmar tu compra, tendrás que introducir el correo electrónico vinculado a tu cuenta de PayPal. Los datos financieros y personales son encriptados automáticamente durante el envío de cualquier información sensible hacia los servidores de PayPal.</p>
                <p>Podrás fracciones el coste de tu compra con el sistema de aplazamiento de PayPal, pero gestionándolo directamente desde su plataforma. Es decir, no es algo que dependa de nuestra web, sino que PayPal será quien realiza el pago y luego te lo irá cobrando a ti.</p>
            </div>

            <div className='info-block'>
                <h2>GOOGLE PAY</h2>
                <p>Podrás realizar el pago mediante tu móvil, smartwatch o cualquier otro dispositivo Android con NFC, a través de tu cuenta de Google. Se transferirá el dinero de forma instantánea a nuestra cuenta bancaria. Tanto el uso del servicio como el límite del importe de pago está determinado por tu entidad bancaria.</p>
            </div>

            <div className='info-block'>
                <h2>APPLE PAY</h2>
                <p>Este método de pago sólo está disponible para dispositivos Apple. Debes haber registrado previamente tu tarjeta bancaria en Apple Pay. Se transferirá el dinero de forma instantánea a nuestra cuenta bancaria. Tanto el uso del servicio como el límite del importe de pago está determinado por tu entidad bancaria.</p>
            </div>
        </div>
    );
}