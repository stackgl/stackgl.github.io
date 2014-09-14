precision mediump float;

attribute vec2 position;
varying vec2 vuv;

void main() {
  vuv = (position + 1.0) * 0.5; 
  gl_Position = vec4(position.xy, 1.0, 1.0);
}
