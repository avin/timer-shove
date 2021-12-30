import React, { useCallback, useEffect, useMemo, useState } from 'react';
// import {ipcRenderer} from 'electron';
import styles from './MainPage.module.scss';
import { Button, InputGroup, Intent } from '@blueprintjs/core';
import { secondsToString, stringToSeconds } from 'timer-string';
import { playSound } from '../../../utils/sound';
import cn from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import { timerSetupStringSelector } from '../../../store/selectors';
import { setTimerSetupString as setTimerSetupStringInStore } from '../../../store/reducers/uiSettings';
import { AppThunkDispatch } from '../../../store/configureStore';

let timerId: ReturnType<typeof setTimeout>;
let updateWindowStateTimerId: ReturnType<typeof setTimeout>;
let soundTimerId: ReturnType<typeof setTimeout>;

const MainPage = (): JSX.Element => {
  const [isActiveTimer, setIsActiveTimer] = useState(false);
  const [isChilling, setIsChilling] = useState(false);
  const [isWrongTimerSetupString, setIsWrongTimerSetupString] = useState(false);
  const [timerString, setTimerString] = useState('');
  const [timerValue, setTimerValue] = useState(0);
  const [initialTimerValue, setInitialTimerValue] = useState(0);

  const dispatch: AppThunkDispatch = useDispatch();
  const timerSetupString = useSelector(timerSetupStringSelector);

  const isTimeOver = timerValue === 0;

  const setTimerSetupString = useCallback(
    (val) => {
      dispatch(setTimerSetupStringInStore(val));
    },
    [dispatch],
  );

  useEffect(() => {
    const handleBlur = () => {
      if ((isActiveTimer && isTimeOver) || isChilling) {
        return false;
      }
      window.ipcRenderer.send('hideWindow');
    };

    window.ipcRenderer.on('blur', handleBlur);

    return () => {
      window.ipcRenderer.off('blur', handleBlur);
    };
  }, [isActiveTimer, isTimeOver, isChilling]);

  useEffect(() => {
    let volume = -0.5;
    const repeatPlaySound = () => {
      volume = volume + 0.0125;
      playSound(349.2 + Math.min(1000 * volume, 1600), 'sine', 0.2, Math.min(Math.max(volume, 0), 0.5));
      soundTimerId = setTimeout(repeatPlaySound, 240);
    };

    clearTimeout(soundTimerId);

    if (isTimeOver && isActiveTimer) {
      repeatPlaySound();
    } else {
      clearTimeout();
    }
  }, [isTimeOver, isActiveTimer]);

  useEffect(() => {
    setTimerString(secondsToString(timerValue));
    if (timerValue > 0 && isActiveTimer) {
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        setTimerValue(timerValue - 1);
      }, 1000);
    } else {
      window.ipcRenderer.send('showWindow');
    }
  }, [timerValue, isActiveTimer]);

  useEffect(() => {
    const updateWindowState = () => {
      window.ipcRenderer.send('showWindow');
      updateWindowStateTimerId = setTimeout(updateWindowState, 250);
    };

    if ((isActiveTimer && isTimeOver) || isChilling) {
      updateWindowState();
    }

    return () => {
      clearTimeout(updateWindowStateTimerId);
    };
  }, [isActiveTimer, isTimeOver, isChilling]);

  const handleClickStart = useCallback(() => {
    const seconds = Math.max(stringToSeconds(timerSetupString), 1);
    if (seconds === null) {
      setIsWrongTimerSetupString(true);
    } else {
      setIsWrongTimerSetupString(false);
      setInitialTimerValue(seconds);
      setTimerValue(seconds);
      setIsActiveTimer(true);

      window.ipcRenderer.send('hideWindow');
      window.ipcRenderer.send('startTimer');
    }
  }, [timerSetupString]);

  const handleClickStop = useCallback(() => {
    clearTimeout(timerId);
    setIsChilling(false);
    setIsActiveTimer(false);

    window.ipcRenderer.send('stopTimer');
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleClickStartChill = useCallback(() => {
    setIsChilling(true);
    setIsActiveTimer(false);

    window.ipcRenderer.send('startChill');
  }, []);

  const handleClickResume = useCallback(() => {
    handleClickStart();
    setIsChilling(false);
  }, [handleClickStart]);

  const handleClickAddTime = useCallback(() => {
    setInitialTimerValue(5 * 60);
    setTimerValue(5 * 60);
    setIsActiveTimer(true);

    window.ipcRenderer.send('hideWindow');
  }, []);

  const handleChangeTimerSetupString = useCallback(
    (e) => {
      setTimerSetupString(e.target.value);
    },
    [setTimerSetupString],
  );

  const fillerWidth = useMemo(() => {
    if (!isActiveTimer) {
      return '0';
    }
    return `${100 - Number(((timerValue / initialTimerValue) * 100).toFixed(0))}%`;
  }, [timerValue, isActiveTimer, initialTimerValue]);

  const handleFocusInput = useCallback((e) => {
    e.currentTarget.select();
  }, []);

  if (isChilling) {
    return (
      <div className={styles.container}>
        <div className={cn(styles.filler, styles.isChilling)} />
        <div className={styles.inner}>
          <div className={styles.form}>
            <div className={styles.timeString}>Chill out time</div>
            <div className={styles.buttons}>
              <Button onClick={handleClickResume} intent={Intent.SUCCESS} className={styles.resumeButton}>
                Resume
              </Button>
              <Button onClick={handleClickStop} intent={Intent.DANGER} className={styles.stopOnChillButton}>
                Stop
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={cn(styles.filler, { [styles.isTimeOver]: isTimeOver })} style={{ width: fillerWidth }} />

      <div>
        {isActiveTimer ? (
          <>
            {isTimeOver ? (
              <div className={styles.inner}>
                <div className={styles.form}>
                  <div className={styles.timeString}>Time over!</div>

                  <div className={styles.buttons}>
                    <Button onClick={handleClickStartChill} intent={Intent.PRIMARY} className={styles.chillButton}>
                      Chill out
                    </Button>
                    <Button onClick={handleClickAddTime} intent={Intent.WARNING} className={styles.addTimeButton}>
                      +5 min
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className={styles.inner}>
                <div className={styles.form}>
                  <div className={styles.timeString}>{timerString}</div>

                  <div className={styles.buttons}>
                    <Button onClick={handleClickStop} intent={Intent.DANGER} className={styles.startButton}>
                      Stop
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className={styles.inner}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <InputGroup
                intent={isWrongTimerSetupString ? Intent.DANGER : Intent.PRIMARY}
                className={styles.timeInput}
                onChange={handleChangeTimerSetupString}
                value={timerSetupString}
                onFocus={handleFocusInput}
              />

              <div className={styles.buttons}>
                <Button type="submit" onClick={handleClickStart} intent={Intent.PRIMARY} className={styles.startButton}>
                  Start
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainPage;
