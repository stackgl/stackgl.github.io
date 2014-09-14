precision mediump float;

uniform vec2 uResolution;
uniform float uTime;

void main() {
  vec2 coord = (gl_FragCoord.xy * uResolution - 0.5) * 2.0;
  float height = 0.0;

  height += sin(uTime * 0.00062 + coord.y * 2.5) * 0.4;
  height += cos(uTime * 0.00048 + coord.x * 1.8) * 0.6;
  height += sin(uTime * 0.0048 + coord.x * 7.9) * 0.2;
  height += cos(uTime * 0.0038 + coord.y * 6.8) * 0.1;
  height += sin(uTime * 0.0028 + coord.y * 2.8 + 0.5) * 0.3;

  // scale up from 0 during the first few moments.
  height -= clamp(1.0 - uTime * 0.0005, 0.0, 1.0) * 2.0;

  // scale by 0.2, prevent going below 0.
  height = max(0.0, height * 0.2);

  // scale to fill a hemisphere(ish): avoid it looking like
  // a clear grid of raised columns.
  height *= max(0.0, 0.85 - max(0.0, coord.x * coord.x + coord.y * coord.y));

  gl_FragColor.r = height;
  gl_FragColor.gba = vec3(1.0);
}
