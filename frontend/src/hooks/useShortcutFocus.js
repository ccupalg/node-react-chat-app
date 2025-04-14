import { useEffect } from 'react';

const useShortcutFocus = (_searchContactsRef) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isMac = navigator.platform.toUpperCase().includes('MAC');
      const isShortcutPressed =
        (isMac && e.metaKey && e.key.toLowerCase() === 'k') ||
        (!isMac && e.ctrlKey && e.key.toLowerCase() === 'k');

      if (isShortcutPressed) {
        e.preventDefault();
        _searchContactsRef?.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [_searchContactsRef]);
};

export default useShortcutFocus;
