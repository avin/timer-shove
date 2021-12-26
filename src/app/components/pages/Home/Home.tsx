import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.module.scss';

interface Props {}

const Home = ({}: Props): JSX.Element => {
  return <div>
    <div>home</div>
    <div><Link to={"/about"}>About</Link></div>
  </div>;
};

export default Home;
