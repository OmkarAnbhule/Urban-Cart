import React, { useEffect, useRef } from 'react';

const CloudAnimation = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let cw = canvas.width = window.innerWidth;
    let ch = canvas.height = 350;

    // Initial circle positions and speeds
    const circles = Array.from({ length: 20 }, (_, index) => ({
      x: Math.random() * cw,
      y: ch + Math.random() * 200,
      radius: Math.random() * 30 + 40,
      speed: 1 + Math.random() * 2,
      color: `rgba(255, 255, 255, ${Math.random() * 0.8 + 0.2})`,
    }));

    const drawCircle = (circle) => {
      ctx.beginPath();
      ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
      ctx.fillStyle = circle.color;
      ctx.fill();
    };

    const updateCircles = () => {
      ctx.clearRect(0, 0, cw, ch);
      circles.forEach(circle => {
        circle.y -= circle.speed;
        if (circle.y + circle.radius < 0) { // Reset circle position when it goes off-screen
          circle.y = ch + Math.random() * 200;
          circle.x = Math.random() * cw;
        }
        drawCircle(circle);
      });
    };

    const animate = () => {
      updateCircles();
      requestAnimationFrame(animate);
    };

    animate();

    // Resize canvas on window resize
    const resizeCanvas = () => {
      cw = canvas.width = window.innerWidth;
      ch = canvas.height = 350;
    };

    window.addEventListener('resize', resizeCanvas);

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };

  }, []); // Empty dependency array ensures useEffect runs only once

  return <canvas ref={canvasRef} style={{ backgroundColor: '#87CEEB' }} />;
};

export default CloudAnimation;
