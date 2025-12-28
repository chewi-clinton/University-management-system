import React from 'react';
import { motion } from 'framer-motion';
import Container from '../components/shared/layout/Container.jsx';
import Card from '../components/shared/layout/Card.jsx';

const Materials = () => {
  const containerVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <Container>
      <motion.div
        className="materials"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        <div className="materials__header">
          <h1 className="materials__title">Study Materials</h1>
          <p className="materials__subtitle">
            Access course materials, assignments, and resources
          </p>
        </div>

        <Card className="materials__card">
          <Card.Body>
            <div className="materials__content">
              <h2>Materials Page</h2>
              <p>This page will display downloadable materials organized by course.</p>
            </div>
          </Card.Body>
        </Card>
      </motion.div>
    </Container>
  );
};

export default Materials;