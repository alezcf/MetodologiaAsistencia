const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.render('users', { users });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al obtener los usuarios');
    }
};

exports.logIn = async (req, res) => {
    try {
        console.log(req.body);
        const { rut, dv, password } = req.body;
        const rutDV = rut + dv
        // Validar el formato del rut utilizando expresiones regulares
        const rutRegex = /^[0-9]{7,8}$/; // Expresión regular para validar un rut en formato "12345678"
            if (!rutRegex.test(rut)) {
                return res.render('login', { mensajeError: 'Formato de rut inválido. Por favor, ingresa un rut válido.' });
            }

        // Validar el formato del dígito verificador utilizando expresiones regulares
        const dvRegex = /^[0-9kK]$/; // Expresión regular para validar digito verificador 0-9 o kK
            if (!dvRegex.test(dv)) {
                return res.render('login', { mensajeError: 'Formato de dígito verificador inválido. Por favor, ingresa un dígito verificador válido.' });
            }

        
        /*
        // Expresión regular para validar la contraseña
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/; //contraseña de 8 caracteres, al menos una mayúscula, una minúscula y un número

        // Validar la contraseña utilizando la expresión regular
        if (!passwordRegex.test(contrasena)) {
            return res.render('login', { mensajeError: 'La contraseña no cumple con los requisitos mínimos.' });
        }
        */

        
        // Realizar la lógica de comprobación de los datos del usuario en la base de datos
        const UserFound = await User.findOne({ rut: rutDV });

        if (!UserFound || UserFound.password !== password) {
            return res.render('login', { mensajeError: 'Credenciales inválidas. Por favor, intenta nuevamente.' });
        }
    
        // Si los datos son válidos, puedes redirigir o enviar una respuesta de éxito
        req.session.user = UserFound;
        res.redirect(`/trabajador/${rutDV}`); // Reemplaza '/ruta-de-destino' con la ruta real de destino

    } catch (error) {
        console.log(error);
        res.status(500).send('Error al iniciar sesión');
    }
};


