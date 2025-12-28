import React from 'react';
import { motion } from 'framer-motion';
import Container from '../components/shared/layout/Container.jsx';
import Card from '../components/shared/layout/Card.jsx';

const VirtualClasses = () => {
  const containerVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <Container>
      <motion.div
        className="virtual-classes"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        <div className="virtual-classes__header">
          <h1 className="virtual-classes__title">Virtual Classes</h1>
          <p className="virtual-classes__subtitle">
            Join live sessions and access recorded lectures
          </p>
        </div>

        <Card className="virtual-classes__card">
          <Card.Body>
            <div className="virtual-classes__content">
              <h2>Virtual Classes Page</h2>
              <p>This page will display live classes, recorded sessions, and meeting links.</p>
            </div>
          </Card.Body>
        </Card>
      </motion.div>
    </Container>
  );
};

export default VirtualClasses;