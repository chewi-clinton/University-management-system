import React from 'react';
import { motion } from 'framer-motion';
import Container from '../components/shared/layout/Container.jsx';
import Card from '../components/shared/layout/Card.jsx';

const Attendance = () => {
  const containerVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <Container>
      <motion.div
        className="attendance"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        <div className="attendance__header">
          <h1 className="attendance__title">Attendance</h1>
          <p className="attendance__subtitle">
            Track your attendance record and view detailed statistics
          </p>
        </div>

        <Card className="attendance__card">
          <Card.Body>
            <div className="attendance__content">
              <h2>Attendance Page</h2>
              <p>This page will display attendance statistics, calendar view, and detailed attendance records.</p>
            </div>
          </Card.Body>
        </Card>
      </motion.div>
    </Container>
  );
};

export default Attendance;