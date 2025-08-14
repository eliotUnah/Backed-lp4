import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from "../../contexts/AuthContext"; // 👈 Contexto actualizado sin enviar token



import {
  Box, Button, TextField, Typography, InputAdornment, IconButton, Link,
  Paper, Container, useTheme, alpha
} from '@mui/material';
import { Email, Lock, Visibility, VisibilityOff, PersonAdd } from '@mui/icons-material';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();

  const { signup } = useAuth(); // 👈 Solo crea el usuario en Firebase

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async ({ email, password, confirmPassword }) => {
    if (password !== confirmPassword) {
      setErrorMsg("Las contraseñas no coinciden");
      return;
    }

    try {
      setErrorMsg("");
      setIsLoading(true);

      // ✅ Crear usuario en Firebase, no se envía al backend
      await signup(email, password);

      console.log("✅ Cuenta registrada exitosamente");

      // Redirigir o mostrar mensaje
      window.location.href = "/login"; // o cambiar a dashboard si prefieres

    } catch (err) {
      console.error("❌ Error al registrarse:", err.message);
      setErrorMsg("Error al registrarse. Intenta con otro correo.");
    } finally {
      setIsLoading(false);
    }
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
        // Partículas flotantes - posición diferente para variedad
        '&::after': {
          content: '""',
          position: 'absolute',
          top: '20%',
          right: '15%',
          width: '80px',
          height: '80px',
          background: alpha('#ffffff', 0.1),
          borderRadius: '50%',
          animation: 'floatReverse 8s ease-in-out infinite',
          '@keyframes floatReverse': {
            '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
            '50%': { transform: 'translateY(-30px) rotate(-180deg)' }
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
            maxWidth: 420,
            mx: 'auto',
            background: alpha('#ffffff', 0.95),
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            border: `1px solid ${alpha('#ffffff', 0.2)}`,
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
            position: 'relative'
          }}
        >
          <Box textAlign="center" mb={4}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                mb: 2,
                boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
              }}
            >
              <PersonAdd sx={{ color: 'white', fontSize: 30 }} />
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
              Crear nueva cuenta
            </Typography>
            <Typography 
              variant="body2" 
              sx={{
                color: '#666',
                fontSize: '14px'
              }}
            >
              ¡Únete a Habituate hoy! Es rápido y fácil.
            </Typography>
          </Box>

          {errorMsg && (
            <Box
              sx={{
                mb: 2,
                p: 2,
                backgroundColor: alpha('#f44336', 0.1),
                borderRadius: 2,
                border: `1px solid ${alpha('#f44336', 0.2)}`
              }}
            >
              <Typography 
                color="error" 
                textAlign="center"
                sx={{ fontSize: '14px' }}
              >
                {errorMsg}
              </Typography>
            </Box>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
              label="Correo electrónico"
              variant="outlined"
              fullWidth
              margin="normal"
              placeholder="nombre@ejemplo.com"
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
                mb: 2,
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

            <TextField
              label="Contraseña"
              variant="outlined"
              fullWidth
              type={showPassword ? 'text' : 'password'}
              margin="normal"
              {...register("password", { 
                required: "Contraseña requerida",
                minLength: {
                  value: 6,
                  message: "La contraseña debe tener al menos 6 caracteres"
                }
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
              sx={{
                mb: 2,
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
                    <Lock sx={{ color: '#667eea' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton 
                      onClick={() => setShowPassword((prev) => !prev)} 
                      edge="end"
                      sx={{ color: '#667eea' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Confirmar contraseña"
              variant="outlined"
              fullWidth
              type={showConfirm ? 'text' : 'password'}
              margin="normal"
              {...register("confirmPassword", { 
                required: "Confirma tu contraseña",
                validate: (value) => {
                  if (value !== watch('password')) {
                    return 'Las contraseñas no coinciden';
                  }
                }
              })}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
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
                    <Lock sx={{ color: '#667eea' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton 
                      onClick={() => setShowConfirm((prev) => !prev)} 
                      edge="end"
                      sx={{ color: '#667eea' }}
                    >
                      {showConfirm ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
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
              {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
            </Button>
          </form>

          <Box textAlign="center" mt={3}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#666',
                fontSize: '14px'
              }}
            >
              ¿Ya tienes una cuenta?{' '}
              <Link 
                href="http://localhost:3000/login" 
                underline="hover"
                sx={{
                  color: '#667eea',
                  fontWeight: 500,
                  '&:hover': {
                    color: '#764ba2'
                  }
                }}
              >
                Inicia sesión aquí
              </Link>
            </Typography>
          </Box>

          <Box textAlign="center" mt={2}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#888',
                fontSize: '12px'
              }}
            >
              Al crear una cuenta, aceptas nuestros{' '}
              <Link 
                href="#" 
                underline="hover"
                sx={{
                  color: '#667eea',
                  fontSize: '12px',
                  '&:hover': {
                    color: '#764ba2'
                  }
                }}
              >
                términos y condiciones
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
