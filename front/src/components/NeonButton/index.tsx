import React from 'react';
import './style.css';

type NeonButtonProps = {
  children?: React.ReactNode;
};

function NeonButton({ children }: NeonButtonProps) {
  return <button className="neon-border neon-text">{children}</button>;
}

export default NeonButton;
