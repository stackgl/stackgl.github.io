precision mediump float;

attribute vec3 aPosition;
attribute vec3 aCentroid;
attribute vec3 aNormal;
attribute vec3 aEdge;

varying vec4 vNeighbours;
varying vec3 vNormal;
varying vec2 vEdge;

uniform sampler2D tHeightmap;

uniform vec2 uResolution;
uniform mat4 uProjection;
uniform mat4 uModel;
uniform mat4 uView;

const float threshold = 1.0 / 0.01;

void main() {
  vec3 position = aPosition;
  vec2 coord = aCentroid.xz;

  float height = texture2D(tHeightmap, aCentroid.xz).r;
  float nht = texture2D(tHeightmap, coord + uResolution * vec2(+0.0, -1.0)).r;
  float nhb = texture2D(tHeightmap, coord + uResolution * vec2(+0.0, +1.0)).r;
  float nhl = texture2D(tHeightmap, coord + uResolution * vec2(-1.0, +0.0)).r;
  float nhr = texture2D(tHeightmap, coord + uResolution * vec2(+1.0, +0.0)).r;

  position.y = mix(position.y, height, position.y);

  gl_Position = (
      uProjection
    * uView
    * uModel
    * vec4(position, 1.0)
  ) + vec4(0.35, -0.2, 0.0, 0.0);

  vNormal = aNormal;
  vEdge = aEdge.xz;
  vNeighbours = vec4(
      clamp((nht - height) * threshold, -1.0, 1.0)
    , clamp((nhb - height) * threshold, -1.0, 1.0)
    , clamp((nhl - height) * threshold, -1.0, 1.0)
    , clamp((nhr - height) * threshold, -1.0, 1.0)
  );
}
