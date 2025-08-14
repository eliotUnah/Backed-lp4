import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import '../styles/CTA.css';
import { useNavigate } from 'react-router-dom';
import useLandingData from '../hooks/useLandigData';

const CTA = () => {
  const navigate = useNavigate();
  const { data, loading, error } = useLandingData();

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!data || !data.cta) return null;

  return (
    <section className="section bg-gradient">
      <div className="container">
        <motion.div
          className="cta-content"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="cta-title">{data.cta.titulo}</h2>
          <motion.p
            className="cta-text"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
          >
           {data.cta.subtitulo}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.button
              className="cta-button"
              onClick={() => navigate('/register')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Registrarse gratis <ArrowRight className="icon" />
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA; 