import * as React from 'react';
import { Scaled } from '../core';
import styles from './Demo.module.scss';

function Demo(props: any) {
  const fit = 'contain'; // cover | contain
  const overflow = 'hidden'; // = 'hidden';
  return (
    <div>
      <div className={styles.root} style={{ height: 200 }}>
        <Scaled fit={fit} overflow={overflow} align="top,left">
          {({ scale }: any) => (
            <div style={{ width: 500, border: '1px solid red' }}>
              <h1>Dummy</h1>
              <h1>Dummy</h1>
              <h1>{scale}</h1>
            </div>
          )}
        </Scaled>
      </div>
      <div className={styles.root} style={{ height: 200 }}>
        <Scaled fit={fit} overflow={overflow}>
          <div style={{ width: 500, border: '1px solid red' }}>
            <h1>Dummy</h1>
            <h1>Dummy</h1>
            <h1>Dummy</h1>
          </div>
        </Scaled>
      </div>
      <div className={styles.root} style={{ height: 200 }}>
        <Scaled fit={fit} overflow={overflow} align="bottom.right">
          <div style={{ width: 500, border: '1px solid red' }}>
            <h1>Dummy</h1>
            <h1>Dummy</h1>
            <h1>Dummy</h1>
          </div>
        </Scaled>
      </div>
    </div>
  );
}

export default Demo;
