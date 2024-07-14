import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-white shadow-md p-4 text-center text-gray-600">
            © {new Date().getFullYear()}  Fiesta Inn Hoteles. Todos los derechos reservados.
        </footer>
    );
};

export default Footer;
