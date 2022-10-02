import React from 'react';
import './style.css';

type NeonButtonProps = {
  children?: React.ReactNode;
  color?: 'blue' | 'yellow' | 'red' | 'green' | 'white';
};

function NeonButton({ children, color }: NeonButtonProps) {
  return <button className="neon-border neon-text">{children}</button>;
}

export default NeonButton;
