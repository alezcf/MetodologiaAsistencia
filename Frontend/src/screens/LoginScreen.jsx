import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import '../css/LoginScreen.css'; // Asegúrate de que el nombre del archivo sea correcto

const LoginScreen = ({ match }) => {
    const [employee, setEmployee] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoggedOut, setIsLoggedOut] = useState(false); // Nuevo estado para controlar la redirección
    const [redirectToPendingAttendance, setRedirectToPendingAttendance] = useState(false);
    const rut = match.params.rut;

    const getEmployeeByRut = async () => {
        try {
            const res = await axios.get(`http://localhost:3001/trabajador/${rut}`);
            const data = res.data;

            if (data.error) {
                setErrorMessage(data.message);
            } else {
                setEmployee(data);
            }
        } catch (error) {
            console.log(error);
            setErrorMessage('Error al obtener el trabajador');
        }
    };

    const handleViewPendingAttendance = () => {
        setRedirectToPendingAttendance(true);
    };

    const handleRegisterAttendance = () => {
        axios.post('http://localhost:3001/asistencia/create', {
            idUser: rut,
        })
        .then((response) => {
            console.log('Asistencia registrada con éxito:', response.data);

            if (response.status === 201) {
                // Si el estatus es 201, mostramos un mensaje de éxito
                alert('La asistencia fue registrada correctamente');
            } else if (response.status === 304) {
                // Si el estatus es 409, mostramos un mensaje de asistencia ya registrada
                alert('La asistencia ya fue registrada el dia de hoy');
            }
        })
        .catch((error) => {
            // Manejo de errores
            console.error('Error al registrar la asistencia:', error);
            // Mostrar un mensaje de error o realizar otras acciones en caso de error
            alert('Hubo un error al registrar la asistencia. Intente nuevamente más tarde.');
        });
    };

    const handleLogout = () => {
        // Realizar aquí cualquier otra acción de cierre de sesión necesaria
        setIsLoggedOut(true); // Actualizamos el estado para activar la redirección
    };

    useEffect(() => {
        getEmployeeByRut(); // Solo se ejecutará una vez al montar el componente
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Redirigir a la página principal si el usuario ha cerrado sesión
    if (isLoggedOut) {
        return <Redirect to="/" />;
    }

    if (redirectToPendingAttendance) {
        return <Redirect to="/asistencia/readNotAccepted" />;
    }
    

    return (
        <div className="container">
            <div className="inner-container">
                <div className="logout-container">
                    <button className="logout-button" onClick={handleLogout}>
                        Cerrar sesión
                    </button>
                </div>
                <h1>Página de Información del Usuario</h1>
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                {employee && (
                    <div className="user-info">
                        <h2>Información del Usuario</h2>
                        <p><strong>Nombres:</strong> {employee.names}</p>
                        <p><strong>Apellidos:</strong> {employee.lastName} {employee.secondLastName}</p>
                        <p><strong>Cargo:</strong> {employee.jobTitle}</p>
                        <p><strong>Rol:</strong> {employee.position}</p>
                    </div>
                )}
                <div className="button-container">
                    <Link to="/asistencia/read" className="view-attendance-button">
                        Visualizar Asistencia
                    </Link>
                    <button className="register-attendance-button" onClick={handleRegisterAttendance}>
                        Registrar Asistencia
                    </button>
                        {employee && employee.jobTitle === "Jefe de Brigada" && (
                        <button
                            className="view-pending-attendance-button"
                            onClick={handleViewPendingAttendance} // Llamar a la función al hacer clic
                        >
                            Visualizar Asistencias Pendientes
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
    
};

export default LoginScreen;
