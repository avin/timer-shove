import React from 'react';
import styles from './About.module.scss';
import { Link } from 'react-router-dom';

interface Props {}

const About = ({}: Props): JSX.Element => {
  return (
    <div className={styles.container}>
      <div>about</div>
      <div>
        <Link to={'/'}>Home</Link>
      </div>
    </div>
  );
};

export default About;
