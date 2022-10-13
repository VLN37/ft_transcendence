import './style.css';

interface LoadingCircleProps {
  size?: number;
}

export default (props: LoadingCircleProps) => {
  const size = props.size ?? 180;

  return (
    <div
      className="dual-ring"
      style={{
        width: size,
        height: size,
      }}
    ></div>
  );
};
