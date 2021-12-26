import React, { useCallback, useState } from 'react';
// import {ipcRenderer} from 'electron';
import styles from './MainPage.module.scss';

let timerId: ReturnType<typeof setTimeout>;

const MainPage = (): JSX.Element => {
  const [isActiveTimer, setIsActiveTimer] = useState(false);

  const handleClickStart = useCallback(() => {
    setIsActiveTimer(true);
    clearTimeout(timerId);

    timerId = setTimeout(() => {
      setIsActiveTimer(false);

      window.ipcRenderer.send('timeOver', '11');
    }, 3000);
  }, []);

  return (
    <div>
      <div>
        <div>Active: {isActiveTimer ? 'Yes' : 'No'}</div>

        <div>
          <button type="button" onClick={handleClickStart}>
            Start
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
