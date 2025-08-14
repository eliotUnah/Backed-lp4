import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Star } from 'lucide-react';
import '../styles/Testimonials.css';
import useLandingData from '../hooks/useLandigData';

const Testimonials = () => {
  const { data, loading, error } = useLandingData();
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = data?.testimonials?.items || [];

  // Hook SIEMPRE se ejecuta
  useEffect(() => {
    if (testimonials.length > 0) {
      const interval = setInterval(() => {
        setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [testimonials.length]);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!data || !data.testimonials) return null;

  return (
    <section id="testimonios" className="section bg-indigo-50">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title">{data.testimonials.titulo}</h2>
          <p className="section-subtitle">{data.testimonials.subtitulo}</p>
        </motion.div>

        <div className="testimonial-container">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTestimonial}
              className="testimonial-card"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              <div className="testimonial-header">
                <div className="testimonial-avatar">
                  <User className="icon" />
                </div>
                <div>
                  <h4 className="testimonial-name">{testimonials[activeTestimonial].name}</h4>
                  <p className="testimonial-role">{testimonials[activeTestimonial].role}</p>
                </div>
              </div>
              <p className="testimonial-content">
                "{testimonials[activeTestimonial].content}"
              </p>
              <div className="testimonial-footer">
                <div className="rating">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`star ${i < testimonials[activeTestimonial].rating ? 'filled' : ''}`}
                    />
                  ))}
                </div>
                <div className="indicators">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveTestimonial(index)}
                      className={`indicator ${index === activeTestimonial ? 'active' : ''}`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default Testimonials; 