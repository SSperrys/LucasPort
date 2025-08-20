import { useEffect, useState } from 'react';

interface Triangle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  animationDelay: number;
}

const triangleColors = [
  'triangle-yellow',
  'triangle-blue', 
  'triangle-red',
  'triangle-green',
  'triangle-purple'
];

export const FloatingTriangles = () => {
  const [triangles, setTriangles] = useState<Triangle[]>([]);

  useEffect(() => {
    const generateTriangles = () => {
      const newTriangles: Triangle[] = [];
      
      for (let i = 0; i < 15; i++) {
        newTriangles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 30 + 20,
          color: triangleColors[Math.floor(Math.random() * triangleColors.length)],
          rotation: Math.random() * 360,
          animationDelay: Math.random() * 6
        });
      }
      
      setTriangles(newTriangles);
    };

    generateTriangles();
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {triangles.map((triangle) => (
        <div
          key={triangle.id}
          className={`absolute triangle-float opacity-60`}
          style={{
            left: `${triangle.x}%`,
            top: `${triangle.y}%`,
            animationDelay: `${triangle.animationDelay}s`,
            transform: `rotate(${triangle.rotation}deg)`
          }}
        >
          <svg
            width={triangle.size}
            height={triangle.size}
            viewBox="0 0 24 24"
            className={`fill-current text-${triangle.color}`}
          >
            <path d="M12 2 L22 20 L2 20 Z" />
          </svg>
        </div>
      ))}
    </div>
  );
};