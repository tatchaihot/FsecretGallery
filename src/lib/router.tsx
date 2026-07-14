import React, { useCallback } from 'react';

export function useLocation() {
  return { pathname: window.location.pathname };
}

export function useNavigate() {
  return useCallback((path: string) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }, []);
}

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
}

export function Link({ to, children, onClick, ...props }: LinkProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.history.pushState({}, '', to);
    window.dispatchEvent(new PopStateEvent('popstate'));
    onClick?.(e);
  };
  return (
    <a href={to} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
