precision mediump float;

uniform sampler2D tex;

void main() {
  vec4 color = vec4(0.0);

  color += texture2D(tex, gl_PointCoord.xy);
  color *= vec4(1.2, 1.15, 1.21, 1.0);
  color += vec4(0.3, 0.3, 0.3, 0.0);
  color.a = 1.0;

  gl_FragColor = color;
}
