import { useEffect, useState, useRef } from 'react';

function useDelayedSave(observables: Array<string|number|boolean>, save: () => void, delay: number){
  const [ savePending, setSavePending ] = useState(false);
  const [ lastChange, setLastChange ] = useState(0);
  const [ timeSinceLastChange, setTimeSince ] = useState(0);
  const savedObservables = useRef(observables);

  useEffect(() => {
    // changes have occurred, reset timer
    if (observables.some((e, i) => e !== savedObservables.current[i])) {
      savedObservables.current = observables;
      setSavePending(true);
      setLastChange(Date.now());
      setTimeSince(0);
      return;
    }

    // no running timer
    if (!lastChange) return;

    // running timer expired
    if (timeSinceLastChange > delay) {
      setSavePending(false);
      setLastChange(0);
      setTimeSince(0);
      save();
      return;
    }

    // start timer
    const timeSinceInterval = setInterval(() => {
      setTimeSince(Date.now() - lastChange);
    }, 1000);

    return () => clearInterval(timeSinceInterval);

  }, [...observables, lastChange, timeSinceLastChange]);

  return savePending;
}

export default useDelayedSave;