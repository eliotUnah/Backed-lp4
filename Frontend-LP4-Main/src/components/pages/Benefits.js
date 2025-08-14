import { motion } from 'framer-motion';
import { Star, Check, Users } from 'lucide-react';
import '../styles/Benefits.css';
import useLandingData from '../hooks/useLandigData';


const iconMap = {
  Star: Star,
  Check: Check,
  Users: Users
};

const Benefits = () => {
  const { data, loading, error } = useLandingData();

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!data || !data.benefits) return null;

  return (
    <section id="beneficios" className="section bg-gray">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title">{data.benefits.titulo}</h2>
          <p className="section-subtitle">{data.benefits.subtitulo}</p>
        </motion.div>

        <div className="benefits-grid">
          {data.benefits.items.map((benefit, index) => {
            const IconComponent = iconMap[benefit.icon] || Star;
            return (
              <motion.div
                key={benefit.title}
                className="benefit-card-wrapper"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className={`benefit-card ${benefit.color}`}>
                  <div className="benefit-inner">
                    <div className="benefit-icon-container">
                      <IconComponent className="icon" />
                    </div>
                    <h3 className="benefit-title">{benefit.title}</h3>
                    <p className="benefit-description">{benefit.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Benefits; 