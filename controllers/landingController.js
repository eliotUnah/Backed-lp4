// Datos en memoria
let landingData = {
  titulo: "Transforma tus hábitos, transforma tu vida",
  subtitulo: "La aplicación definitiva para construir hábitos positivos que perduren.",
  slogan: "Pequeños cambios, grandes resultados.",
  botonTexto: "Comenzar ahora",
  habitos: ["Ejercicio matutino", "Meditación 10 min", "Leer 20 páginas", "Beber agua"],
  racha: 7,
  navbar: {
    logo: "Habituate",
    navItems: ["beneficios", "testimonios", "ayuda", "contacto"],
    botonTexto: "Login"
  },
   benefits: {
    titulo: "Por qué elegir Habituate",
    subtitulo: "Nuestro enfoque científico te ayuda a construir hábitos que realmente perduran.",
    items: [
      {
        title: "Seguimiento inteligente",
        description: "Registra tus progresos automáticamente y recibe insights personalizados",
        icon: "Star",
        color: "from-indigo-100 to-indigo-50"
      },
      {
        title: "Recordatorios adaptativos",
        description: "El sistema aprende tus patrones y te sugiere los mejores momentos",
        icon: "Check",
        color: "from-purple-100 to-purple-50"
      },
      {
        title: "Comunidad motivadora",
        description: "Conéctate con otros usuarios y comparte tus logros",
        icon: "Users",
        color: "from-blue-100 to-blue-50"
      }
    ]
  },
  testimonials: {
    titulo: "Historias de transformación",
    subtitulo: "Lo que dicen nuestros usuarios sobre su experiencia con HábitoPro",
    items: [
      {
        name: "María González",
        role: "Emprendedora",
        content: "Transformé mi productividad en solo 21 días con estos hábitos. ¡Increíble!",
        rating: 5
      },
      {
        name: "Carlos Ruiz",
        role: "Estudiante",
        content: "La constancia es clave y esta app me ayudó a mantenerla. 100% recomendado.",
        rating: 4
      },
      {
        name: "Ana López",
        role: "Diseñadora",
        content: "De procrastinadora crónica a persona organizada. ¡Gracias por cambiar mi vida!",
        rating: 5
      }
    ]
  },
  cta: {
    titulo: "¿Listo para transformar tus hábitos?",
    subtitulo: "Empieza tu viaje de 21 días hoy mismo y descubre el poder de los pequeños cambios consistentes."
  }
};

// GET - Obtener textos de landing
const getLanding = (req, res) => {
  res.json(landingData);
};

// PUT - Actualizar textos en memoria
const updateLanding = (req, res) => {
  landingData = { ...landingData, ...req.body };
  res.json({ message: 'Landing actualizada correctamente', data: landingData });
};

module.exports = { getLanding, updateLanding };
