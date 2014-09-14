precision mediump float;

uniform sampler2D tGradient;
uniform mat4 uViewRotation;

varying vec4 vNeighbours;
varying vec3 vNormal;
varying vec2 vEdge;

#define EDGE_SHARPNESS 1.8
#define EDGE_SHADOW 0.2
#define BLOCK_COLOR 1.1


void main() {
  vec4 lightDirection = vec4(normalize(vec3(-0.2, 1.2, 0.8)), 1.0);

  lightDirection = uViewRotation * lightDirection;

  float nhr = max(0.0, vNeighbours.x);
  float nhl = max(0.0, vNeighbours.y);
  float nhb = max(0.0, vNeighbours.z);
  float nht = max(0.0, vNeighbours.w);
  float top = abs(vNormal.y);

  vec2 de = vec2(
      max(0.0, nht * vEdge.x) - min(0.0, nhb * vEdge.x)
    , max(0.0, nhl * vEdge.y) - min(0.0, nhr * vEdge.y)
  );

  float d1 = smoothstep(0.0, 1.0, abs(de.x));
  float d2 = smoothstep(0.0, 1.0, abs(de.y));
  float d = (pow(d1, EDGE_SHARPNESS) + pow(d2, EDGE_SHARPNESS));

  vec3 diffuse = vec3(1.0 - min(d, 1.0) * top * EDGE_SHADOW) * BLOCK_COLOR;
  vec3 ambient = vec3(0.1);
  float lambert = max(0.0, dot(vNormal, normalize(lightDirection.xyz)));

  vec3 color = diffuse * lambert + ambient;

  gl_FragColor.rgb = texture2D(tGradient, vec2(0.0, color.r)).rgb;
  gl_FragColor.a = 1.0;
}
