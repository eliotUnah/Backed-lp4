import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from 'react-router-dom';



import {
  Box, Button, TextField, Typography, InputAdornment, IconButton,
  Link, Paper, Container, useTheme, alpha
} from '@mui/material';
import { Email, Lock, Visibility, VisibilityOff } from '@mui/icons-material';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async ({ email, password }) => {
    try {
      setErrorMsg("");
      setIsLoading(true);
      await login(email, password); // ✅ usamos el contexto
      console.log("✅ Login exitoso");
       navigate("/dasboard");
    } catch (err) {
      console.error("❌ Error en login:", err.response?.data || err.message);
      setErrorMsg("Correo o contraseña incorrectos");
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
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: `
            radial-gradient(circle at 20% 20%, ${alpha('#ffffff', 0.1)} 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, ${alpha('#ffffff', 0.08)} 0%, transparent 50%),
            radial-gradient(circle at 40% 60%, ${alpha('#ffffff', 0.05)} 0%, transparent 50%)
          `,
          pointerEvents: 'none',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: '10%', left: '20%',
          width: '60px', height: '60px',
          background: alpha('#ffffff', 0.1),
          borderRadius: '50%',
          animation: 'float 6s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
            '50%': { transform: 'translateY(-20px) rotate(180deg)' }
          }
        }
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={0} sx={{
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
        }}>
          <Box textAlign="center" mb={4}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 600, color: '#333', mb: 1 }}>
              ¡Bienvenido de vuelta!
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', fontSize: '14px' }}>
              Inicia sesión en Habituate para continuar
            </Typography>
          </Box>

          {errorMsg && (
            <Box sx={{
              mb: 2,
              p: 2,
              backgroundColor: alpha('#f44336', 0.1),
              borderRadius: 2,
              border: `1px solid ${alpha('#f44336', 0.2)}`
            }}>
              <Typography color="error" textAlign="center" sx={{ fontSize: '14px' }}>
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
              placeholder="tuemail@ejemplo.com"
              {...register("email", { required: true })}
              error={!!errors.email}
              helperText={errors.email && "Email requerido"}
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
              {...register("password", { required: true })}
              error={!!errors.password}
              helperText={errors.password && "Contraseña requerida"}
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
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>

          <Box textAlign="center" mt={3}>
            <Typography variant="body2" sx={{ color: '#666', fontSize: '14px' }}>
              ¿No tienes una cuenta?{' '}
              <Link href="/register" underline="hover" sx={{
                color: '#667eea',
                fontWeight: 500,
                '&:hover': { color: '#764ba2' }
              }}>
                Regístrate aquí
              </Link>
            </Typography>
          </Box>

          <Box textAlign="center" mt={2}>
            <Link href="http://localhost:3000/updateContra" underline="hover" sx={{
              color: '#667eea',
              fontSize: '14px',
              fontWeight: 500,
              '&:hover': { color: '#764ba2' }
            }}>
              ¿Olvidaste tu contraseña?
            </Link>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

