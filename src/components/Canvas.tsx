import { useEffect, useRef } from 'react';
import styles from '@styles/Canvas.module.css';

/**
 * It renders a canvas element and passes the canvas and context to the parent component
 * @param  - CanvasProps
 * @returns A React component that renders a canvas element.
 */
function Canvas({ setCanvas, setContext, show }: vnc.CanvasProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    setCanvas(canvas);
    setContext(context);
  }, [setCanvas, setContext]);

  return (
    <div
      className="absolute w-full h-full overflow-hidden"
      style={{ display: show ? 'block' : 'none' }}
    >
      <canvas className={styles.canvas} ref={canvasRef} />
    </div>
  );
}

export default Canvas;
