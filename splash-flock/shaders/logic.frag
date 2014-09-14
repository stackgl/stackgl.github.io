precision mediump float;

varying vec2 vuv;
uniform sampler2D positions;

#pragma glslify: noise = require(glsl-curl-noise)

#define CENTER_ATTRACTION 0.0045
#define SPEED_LIMIT 0.065
#define SEPARATION 0.0035
#define ALIGNMENT 0.00125
#define COHESION 0.0007
#define WANDER 0.00035
#define SIZE 32.0

vec2 alignment(vec2 speed) {
  vec2 influence = vec2(0.0);

  for (float x = 0.0; x < 1.0; x += 1.0 / SIZE)
  for (float y = 0.0; y < 1.0; y += 1.0 / SIZE) {
    vec2 uv = vec2(x, y);
    vec2 speed = texture2D(positions, uv).zw;

    influence += speed;
  }

  return influence;
}
vec2 cohesion(vec2 position) {
  vec2 influence = vec2(0.0);

  for (float x = 0.0; x < 1.0; x += 1.0 / SIZE)
  for (float y = 0.0; y < 1.0; y += 1.0 / SIZE) {
    vec2 uv = vec2(x, y);
    vec2 pos = texture2D(positions, uv).xy;

    influence += pos / SIZE / SIZE;
  }

  return influence - position;
}
vec2 separation(vec2 position, vec2 maxDistance, vec2 index) {
  vec2 influence = vec2(0.0);
  for (float x = 0.0; x < 1.0; x += 1.0 / SIZE)
  for (float y = 0.0; y < 1.0; y += 1.0 / SIZE) {
    vec2 uv = vec2(x, y);
    vec2 pos = texture2D(positions, uv).xy;
    float self  = (
      x == index.x &&
      y == index.y
    ) ? 0.0 : 1.0;

    float close = all(
      greaterThanEqual(abs(position - pos), maxDistance)
    ) ? 1.0 : 0.0;

    influence -= self * close * (position - pos);
  }
  return position - influence;
}

void main() {
  vec2 uv = gl_FragCoord.xy / vec2(SIZE);
  vec2 position = texture2D(positions, uv).xy;
  vec2 speed = texture2D(positions, uv).zw;

  speed += normalize(alignment(speed)) * ALIGNMENT;
  speed += normalize(cohesion(position)) * COHESION;
  speed += normalize(separation(position, vec2(0.5), uv)) * SEPARATION;
  speed += normalize(vec2(0.5) - position) * CENTER_ATTRACTION;
  speed += noise(vec3(uv * 10.2920, 1.290393)).xy * WANDER;
  speed = clamp(speed, -SPEED_LIMIT, +SPEED_LIMIT);

  position += speed;

  gl_FragColor.xy = position;
  gl_FragColor.zw = speed;
}
