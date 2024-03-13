import * as THREE from "three";

export default function createLabelTexture(name, flagImageSrc) {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const width = 256;
    const height = 64;
    canvas.width = width;
    canvas.height = height;

    const flagImage = new Image();
    flagImage.src = flagImageSrc;
    flagImage.onload = () => {
      ctx.drawImage(flagImage, 0, 0, height, height);
      ctx.fillStyle = "white";
      ctx.font = "Bold 20px Arial";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(name, height + 10, height / 2);

      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      resolve(texture);
    };
  });
}
