import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';

type StateType<S> = S | (() => S);

export function useSafaState<S>(
  initialState: StateType<S>,
): [S, Dispatch<SetStateAction<S>>] {
  const [state, setState] = useState(initialState);
  const isUpdataFlag = useRef<boolean>(true);

  useEffect(() => {
    isUpdataFlag.current = true;
    return () => {
      isUpdataFlag.current = false;
    };
  }, [initialState]);

  const safeSetState = (value: SetStateAction<S>) => {
    if (isUpdataFlag.current) setState(value);
  };

  return [state, safeSetState];
}
