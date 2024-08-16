import { useState, useEffect } from 'react';

const useMyHook = () => {
  const [value, setValue] = useState<string>('');

  useEffect(() => {
    // Logic for the hook
    setValue('');
  }, []);

  return {
    value
  };
};

export default useMyHook;
