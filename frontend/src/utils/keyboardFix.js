import { useEffect } from 'react';

export function useKeyboardFix() {
  useEffect(() => {
    const inputs = document.querySelectorAll("input, textarea");

    inputs.forEach((input) => {
      input.addEventListener("blur", () => {
        window.scrollTo(0, 0);
      });
    });

    return () => {
      inputs.forEach((input) => {
        input.removeEventListener("blur");
      })
    }
  }, []);
}
