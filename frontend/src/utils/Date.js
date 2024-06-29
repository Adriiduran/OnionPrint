function formatDate(isoString) {
    // Crear un objeto Date a partir de la cadena ISO
    const date = new Date(isoString);

    // Definir los nombres de los meses en español
    const monthNames = [
        "enero", "febrero", "marzo", "abril", "mayo", "junio", 
        "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
    ];

    // Extraer los componentes de la fecha
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    // Extraer los componentes de la hora
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const seconds = date.getSeconds();

    // Formatear minutos y segundos para que siempre tengan dos dígitos
    minutes = minutes < 10 ? '0' + minutes : minutes;
    const timeString = `${hours}:${minutes}`;

    // Construir la cadena de fecha legible
    const formattedDate = `${day} de ${monthNames[monthIndex]} de ${year}, ${timeString}`;

    return formattedDate;
}

export { formatDate };