varying vec2 vUv;
uniform float uColorMix;

void main(){
  vec3 colorA = vec3(0.2, 0.4, 1.0);
  vec3 colorB = vec3(1.0, 0.2, 0.8);
  vec3 colorC = vec3(1.0);

  vec3 mixed = mix(colorA, colorB, vUv.y);
  mixed = mix(mixed, colorC, uColorMix);
  
  gl_FragColor = vec4(mixed, 1.0);
}