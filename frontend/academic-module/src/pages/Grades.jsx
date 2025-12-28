import React from 'react';
import { motion } from 'framer-motion';
import Container from '../components/shared/layout/Container.jsx';
import Card from '../components/shared/layout/Card.jsx';

const Grades = () => {
  const containerVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <Container>
      <motion.div
        className="grades"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        <div className="grades__header">
          <h1 className="grades__title">Grades</h1>
          <p className="grades__subtitle">
            View your academic performance and GPA trends
          </p>
        </div>

        <Card className="grades__card">
          <Card.Body>
            <div className="grades__content">
              <h2>Grades Page</h2>
              <p>This page will display GPA overview, grade history, and performance charts.</p>
            </div>
          </Card.Body>
        </Card>
      </motion.div>
    </Container>
  );
};

export default Grades;