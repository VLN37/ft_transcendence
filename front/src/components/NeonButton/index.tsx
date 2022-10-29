import React from 'react';
import './style.css';

type NeonButtonProps = {
  children?: React.ReactNode;
  color?: 'blue' | 'yellow' | 'red' | 'green' | 'white';
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  animate?: boolean;
};

function NeonButton({
  children,
  color,
  onClick,
  animate = false,
}: NeonButtonProps) {
  return (
    <button onClick={onClick} className="neon-border neon-text">
      {children}
    </button>
  );
}

export default NeonButton;
