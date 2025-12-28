import React from 'react';
import { motion } from 'framer-motion';
import Container from '../components/shared/layout/Container.jsx';
import Card from '../components/shared/layout/Card.jsx';

const Notices = () => {
  const containerVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <Container>
      <motion.div
        className="notices"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        <div className="notices__header">
          <h1 className="notices__title">Notices</h1>
          <p className="notices__subtitle">
            Stay updated with important announcements and notifications
          </p>
        </div>

        <Card className="notices__card">
          <Card.Body>
            <div className="notices__content">
              <h2>Notices Page</h2>
              <p>This page will display university notices, announcements, and important updates.</p>
            </div>
          </Card.Body>
        </Card>
      </motion.div>
    </Container>
  );
};

export default Notices;