import React from 'react';
import { motion } from 'framer-motion';
import Container from '../components/shared/layout/Container.jsx';
import Card from '../components/shared/layout/Card.jsx';

const Exams = () => {
  const containerVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <Container>
      <motion.div
        className="exams"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        <div className="exams__header">
          <h1 className="exams__title">Exams</h1>
          <p className="exams__subtitle">
            View exam schedules, download admit cards, and check results
          </p>
        </div>

        <Card className="exams__card">
          <Card.Body>
            <div className="exams__content">
              <h2>Exams Page</h2>
              <p>This page will display exam timetable, seat numbers, and results.</p>
            </div>
          </Card.Body>
        </Card>
      </motion.div>
    </Container>
  );
};

export default Exams;