precision mediump float;

attribute vec2 uv;

uniform sampler2D positions;
uniform vec2 screenSize;

void main() {
  vec2 position = texture2D(positions, uv).xy;

  position.x += 15.0;
  position *= screenSize.x / screenSize.y / screenSize.xy;

  gl_PointSize = 8.0;
  gl_Position = vec4((position) * 25.0, 1.0, 1.0);
}
