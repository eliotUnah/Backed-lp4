import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase/firebaseConfig';

import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
  Link,
  Paper,
  Container,
  Alert,
  alpha
} from '@mui/material';
import {
  Email,
  LockReset,
  ArrowBack,
  CheckCircle
} from '@mui/icons-material';

export default function ResetPassword() {
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm();

  const emailValue = watch("email");

  const onSubmit = async ({ email }) => {
    try {
      setErrorMsg("");
      setSuccessMsg("");
      setIsLoading(true);

      // Enviar email de reset de contraseña
      await sendPasswordResetEmail(auth, email, {
        // Configuración opcional para personalizar el email
        url: 'http://localhost:3000/login', // URL de redirección después del reset
        handleCodeInApp: false // El usuario completará el reset en la página de Firebase
      });

      setEmailSent(true);
      setSuccessMsg(`Se ha enviado un email de recuperación a ${email}`);
      console.log("✅ Email de reset enviado exitosamente");

    } catch (err) {
      console.error("❌ Error enviando email de reset:", err.message);
      
      // Manejar diferentes tipos de errores
      switch (err.code) {
        case 'auth/user-not-found':
          setErrorMsg("No existe una cuenta con este correo electrónico");
          break;
        case 'auth/invalid-email':
          setErrorMsg("El correo electrónico no es válido");
          break;
        case 'auth/too-many-requests':
          setErrorMsg("Demasiados intentos. Intenta nuevamente más tarde");
          break;
        default:
          setErrorMsg("Error al enviar el email. Intenta nuevamente");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = () => {
    setEmailSent(false);
    setSuccessMsg("");
    setErrorMsg("");
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // Efectos de luz de fondo
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 20%, ${alpha('#ffffff', 0.1)} 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, ${alpha('#ffffff', 0.08)} 0%, transparent 50%),
            radial-gradient(circle at 40% 60%, ${alpha('#ffffff', 0.05)} 0%, transparent 50%)
          `,
          pointerEvents: 'none',
        },
        // Partícula flotante
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '20%',
          left: '10%',
          width: '100px',
          height: '100px',
          background: alpha('#ffffff', 0.08),
          borderRadius: '50%',
          animation: 'floatSlow 10s ease-in-out infinite',
          '@keyframes floatSlow': {
            '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
            '50%': { transform: 'translateY(-40px) rotate(90deg)' }
          }
        }
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: 4,
            width: '100%',
            maxWidth: 400,
            mx: 'auto',
            background: alpha('#ffffff', 0.95),
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            border: `1px solid ${alpha('#ffffff', 0.2)}`,
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
            position: 'relative'
          }}
        >
          {/* Header */}
          <Box textAlign="center" mb={4}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: emailSent 
                  ? 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)'
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                mb: 2,
                boxShadow: emailSent 
                  ? '0 8px 25px rgba(76, 175, 80, 0.3)'
                  : '0 8px 25px rgba(102, 126, 234, 0.3)',
                transition: 'all 0.5s ease'
              }}
            >
              {emailSent ? (
                <CheckCircle sx={{ color: 'white', fontSize: 30 }} />
              ) : (
                <LockReset sx={{ color: 'white', fontSize: 30 }} />
              )}
            </Box>
            
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{
                fontWeight: 600,
                color: '#333',
                mb: 1
              }}
            >
              {emailSent ? '¡Email enviado!' : 'Recuperar contraseña'}
            </Typography>
            
            <Typography 
              variant="body2" 
              sx={{
                color: '#666',
                fontSize: '14px',
                maxWidth: '300px',
                mx: 'auto'
              }}
            >
              {emailSent 
                ? `Revisa tu correo ${emailValue} y sigue las instrucciones para restablecer tu contraseña.`
                : 'Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.'
              }
            </Typography>
          </Box>

          {/* Mensajes de estado */}
          {successMsg && (
            <Alert 
              severity="success" 
              sx={{ 
                mb: 2,
                borderRadius: '12px',
                '& .MuiAlert-icon': {
                  color: '#4caf50'
                }
              }}
            >
              {successMsg}
            </Alert>
          )}

          {errorMsg && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 2,
                borderRadius: '12px'
              }}
            >
              {errorMsg}
            </Alert>
          )}

          {!emailSent ? (
            // Formulario para ingresar email
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <TextField
                label="Correo electrónico"
                variant="outlined"
                fullWidth
                margin="normal"
                placeholder="tuemail@ejemplo.com"
                {...register("email", { 
                  required: "Email requerido",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Email inválido"
                  }
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: '#fff',
                    '& fieldset': {
                      borderColor: alpha('#000', 0.15),
                      borderWidth: '2px'
                    },
                    '&:hover fieldset': {
                      borderColor: '#667eea'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#667eea',
                      boxShadow: `0 0 0 3px ${alpha('#667eea', 0.1)}`
                    }
                  },
                  '& .MuiInputLabel-root': {
                    color: '#555',
                    fontWeight: 500
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: '#667eea' }} />
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                variant="contained"
                fullWidth
                type="submit"
                disabled={isLoading}
                sx={{
                  py: 2,
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  fontSize: '16px',
                  fontWeight: 600,
                  textTransform: 'none',
                  boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 30px rgba(102, 126, 234, 0.4)',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  },
                  '&:active': {
                    transform: 'translateY(0)'
                  },
                  '&:disabled': {
                    background: alpha('#667eea', 0.5),
                    transform: 'none'
                  }
                }}
              >
                {isLoading ? 'Enviando...' : 'Enviar email de recuperación'}
              </Button>
            </form>
          ) : (
            // Acciones después de enviar el email
            <Box>
              <Button
                variant="outlined"
                fullWidth
                onClick={handleResendEmail}
                sx={{
                  py: 2,
                  borderRadius: '12px',
                  borderColor: '#667eea',
                  color: '#667eea',
                  fontSize: '16px',
                  fontWeight: 600,
                  textTransform: 'none',
                  mb: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: '#764ba2',
                    color: '#764ba2',
                    backgroundColor: alpha('#667eea', 0.05)
                  }
                }}
              >
                Enviar otro email
              </Button>

              <Typography variant="body2" textAlign="center" sx={{ color: '#666', fontSize: '12px' }}>
                Si no recibes el email en unos minutos, revisa tu carpeta de spam
              </Typography>
            </Box>
          )}

          {/* Footer */}
          <Box textAlign="center" mt={4}>
            <Link 
              href="http://localhost:3000/login" 
              underline="none"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                color: '#667eea',
                fontSize: '14px',
                fontWeight: 500,
                transition: 'all 0.3s ease',
                '&:hover': {
                  color: '#764ba2'
                }
              }}
            >
              <ArrowBack sx={{ mr: 1, fontSize: 18 }} />
              Volver al login
            </Link>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

