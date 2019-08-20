import * as React from 'react';
import Demo from '../Demo';
import styles from './App.module.scss';

function App(props: any) {
  return (
    <div className={styles.root}>
      <h1>React-Scaled-Content</h1>
      <Demo />
    </div>
  );
}

export default App;
