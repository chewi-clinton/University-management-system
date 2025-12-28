import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';
import Container from '../components/shared/layout/Container.jsx';
import Button from '../components/shared/ui/Button.jsx';

const NotFound = () => {
  const navigate = useNavigate();

  const containerVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: 'spring',
        stiffness: 100,
        damping: 20
      }
    }
  };

  return (
    <Container>
      <motion.div
        className="not-found"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        <div className="not-found__content">
          <div className="not-found__icon">
            <AlertCircle size={64} />
          </div>
          
          <h1 className="not-found__title">404</h1>
          <h2 className="not-found__subtitle">Page Not Found</h2>
          <p className="not-found__description">
            Sorry, the page you're looking for doesn't exist. 
            It might have been moved, deleted, or you entered the wrong URL.
          </p>
          
          <div className="not-found__actions">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/dashboard')}
              leftIcon={<Home size={20} />}
            >
              Go to Dashboard
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
          </div>
        </div>
      </motion.div>
    </Container>
  );
};

export default NotFound;