import * as THREE from "three";

export default function createLabelTexture(name, flagSrc) {
  // Create canvas
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  // Set canvas dimensions
  canvas.width = 120;
  canvas.height = 32;

  function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
  }

  // Load the flag image
  return new Promise((resolve, reject) => {
    const flagImage = new Image();
    flagImage.onload = () => {
      context.fillStyle = "black";
      roundRect(context, 0, 0, canvas.width, canvas.height, canvas.height / 2);

      const flagWidth = canvas.height;
      roundRect(context, 0, 0, flagWidth, flagWidth, flagWidth / 2);
      context.drawImage(flagImage, 0, 0, flagWidth, flagWidth);

      // Set text styles
      context.fillStyle = "white";
      context.font = "12px Arial";
      context.textAlign = "left";
      context.textBaseline = "middle";

      // Draw the name of the country next to the flag
      context.fillText(name, flagWidth + 5, canvas.height / 2);

      // Use the canvas as the texture
      const texture = new THREE.CanvasTexture(canvas);
      const material = new THREE.SpriteMaterial({ map: texture });

      // Create the sprite
      const sprite = new THREE.Sprite(material);
      sprite.scale.set(3, 0.75, 1);
      resolve(sprite);
    };
    flagImage.onerror = reject;
    flagImage.src = flagSrc;
  });
}
