import React from "react";
import { FaAndroid, FaApple } from 'react-icons/fa';
import { motion } from "framer-motion";
import './Mainpage_4.css';

const Download = () => {
  return (
    <div className="download-container">
      {/* Left Section */}
      <motion.div
        className="left-section"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}  // Trigger animation when in view
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.5 }}  // Only trigger when 50% of the section is in view
      >
        <h4 className="heading-small">DOWNLOAD OUR APP</h4>
        <h1 className="heading-large">
          Download our application from App Store
        </h1>
        <p className="paragraph-download">
          Experience the future of innovation with RAVON. Empowering businesses worldwide,
          RAVON delivers cutting-edge digital solutions for web, mobile, and connected platforms, 
          helping you achieve more with ease.
        </p>

        {/* Contact Section */}
        <motion.div
          className="button-container"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}  // Trigger animation when in view
          transition={{ delay: 0.4, duration: 0.8 }}
          viewport={{ once: true, amount: 0.5 }}  // Trigger when 50% of buttons are in view
        >
          <motion.button
            className="btn btn-playstore"
            whileHover={{ scale: 1.1, transition: { duration: 0.3 } }}  // Scale effect on hover
          >
            Play Store 
            <FaAndroid className="IconDownload" />
          </motion.button>

          <motion.button
            className="btn btn-ios"
            whileHover={{ scale: 1.1, transition: { duration: 0.3 } }}  // Scale effect on hover
          >
            iOS Store 
            <FaApple className="IconDownload" />
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Right Section */}
      <motion.div
        className="right-section"
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}  // Trigger animation when in view
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.5 }}  // Trigger when 50% of the section is in view
      >
        <motion.div
          className="image-container-download"
          whileHover={{ scale: 1.05 }}  // Image scale effect on hover
          transition={{ duration: 0.3 }}
        >
          <img
            src="/images/Untitled design.jpg"
            alt="App Design 1"
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Download;