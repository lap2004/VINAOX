import React, { ReactNode } from 'react';

export interface CardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverEffect = true,
  style,
  onClick,
}) => {
  return (
    <div
      className={`card ${hoverEffect ? '' : 'no-hover'} ${className}`}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
