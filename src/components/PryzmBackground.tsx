import { useEffect, useRef } from 'react';

const vertexShader = String.raw`#version 300 es
in vec2 aPosition;
in float aRow;
uniform float uTime;
uniform vec2 uPointer;
uniform float uPointerActive;
uniform vec3 uRipples[4];
out float vRow;
out float vEnergy;
void main() {
  vec2 p = aPosition;
  float phase = aRow * 8.0;
  float swell = sin(p.x * 1.05 + uTime * 0.58 + phase) * 0.11
              + cos(p.x * 0.42 - uTime * 0.34 + phase * 0.4) * 0.075
              + sin(p.x * 0.22 + uTime * 0.22 - phase) * 0.05;
  p.y += swell;
  vec2 delta = aPosition - uPointer;
  float d = length(delta);
  float influence = (1.0 - smoothstep(0.0, 0.78, d)) * uPointerActive;
  p += normalize(delta + vec2(0.0001)) * influence * 0.14;
  float energy = 0.0;
  for (int i = 0; i < 4; i++) {
    float age = uTime - uRipples[i].z;
    if (age >= 0.0 && age < 3.8) {
      vec2 rd = aPosition - uRipples[i].xy;
      float dist = length(rd);
      float ring = exp(-pow((dist - age * 1.7) * 3.1, 2.0)) * (1.0 - age / 3.8);
      p += normalize(rd + vec2(0.0001)) * ring * 0.09;
      energy += ring;
    }
  }
  gl_Position = vec4(p.x, p.y, 0.0, 1.0);
  vRow = aRow;
  vEnergy = min(1.0, abs(swell) * 2.2 + influence * 0.8 + energy);
}`;

const fragmentShader = String.raw`#version 300 es
precision highp float;
in float vRow;
in float vEnergy;
out vec4 outColor;
void main() {
  vec3 deep = vec3(0.025, 0.075, 0.145);
  vec3 blue = vec3(0.16, 0.39, 0.66);
  vec3 ice = vec3(0.48, 0.72, 0.94);
  vec3 c = mix(blue, ice, smoothstep(0.15, 0.95, vEnergy));
  c = mix(deep, c, 0.42 + vRow * 0.46);
  outColor = vec4(c, 0.24 + vRow * 0.34 + vEnergy * 0.2);
}`;

function compile(gl: WebGL2RenderingContext, type: number, source: string) {
  const s = gl.createShader(type);
  if (!s) throw new Error('Shader allocation failed');
  gl.shaderSource(s, source);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(s) || 'Shader compilation failed';
    gl.deleteShader(s);
    throw new Error(message);
  }
  return s;
}

export default function PryzmBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const gl = canvas.getContext('webgl2', { alpha: true, antialias: false, depth: false, powerPreference: 'low-power' });
    if (!gl) { canvas.classList.add('shader-unavailable'); return; }

    let program: WebGLProgram | null = null;
    let vao: WebGLVertexArrayObject | null = null;
    let vertexBuffer: WebGLBuffer | null = null;
    let indexBuffer: WebGLBuffer | null = null;
    let frame = 0;
    let start = 0;
    let pointerActive = 0;
    let pointerX = 99;
    let pointerY = 99;
    let rippleCursor = 0;
    const ripples = new Float32Array(12);
    for (let i = 0; i < 4; i++) ripples[i * 3 + 2] = -100;

    try {
      const vs = compile(gl, gl.VERTEX_SHADER, vertexShader);
      const fs = compile(gl, gl.FRAGMENT_SHADER, fragmentShader);
      program = gl.createProgram();
      if (!program) throw new Error('Program allocation failed');
      gl.attachShader(program, vs); gl.attachShader(program, fs); gl.linkProgram(program);
      gl.deleteShader(vs); gl.deleteShader(fs);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) || 'Program link failed');

      const rows = 74, columns = 176;
      const vertices = new Float32Array(rows * columns * 3);
      const indices = new Uint16Array(rows * (columns - 1) * 2);
      let v = 0, ix = 0;
      for (let r = 0; r < rows; r++) for (let c = 0; c < columns; c++) {
        vertices[v++] = (c / (columns - 1) * 2 - 1) * 1.08;
        vertices[v++] = (1 - r / (rows - 1) * 2) * 1.08;
        vertices[v++] = r / (rows - 1);
        const n = r * columns + c;
        if (c < columns - 1) { indices[ix++] = n; indices[ix++] = n + 1; }
      }
      vao = gl.createVertexArray(); vertexBuffer = gl.createBuffer(); indexBuffer = gl.createBuffer();
      if (!vao || !vertexBuffer || !indexBuffer) throw new Error('Buffer allocation failed');
      gl.bindVertexArray(vao);
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer); gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
      const pos = gl.getAttribLocation(program, 'aPosition');
      const row = gl.getAttribLocation(program, 'aRow');
      gl.enableVertexAttribArray(pos); gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 12, 0);
      gl.enableVertexAttribArray(row); gl.vertexAttribPointer(row, 1, gl.FLOAT, false, 12, 8);

      const timeLoc = gl.getUniformLocation(program, 'uTime');
      const pointerLoc = gl.getUniformLocation(program, 'uPointer');
      const activeLoc = gl.getUniformLocation(program, 'uPointerActive');
      const rippleLoc = gl.getUniformLocation(program, 'uRipples[0]');
      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        canvas.width = Math.max(1, Math.floor(innerWidth * dpr));
        canvas.height = Math.max(1, Math.floor(innerHeight * dpr));
        gl.viewport(0, 0, canvas.width, canvas.height);
      };
      const move = (e: PointerEvent) => {
        pointerX = (e.clientX / innerWidth * 2 - 1) * (innerWidth / innerHeight);
        pointerY = 1 - e.clientY / innerHeight * 2;
        pointerActive = 1;
      };
      const leave = () => { pointerActive = 0; };
      const down = (e: PointerEvent) => {
        move(e);
        const slot = rippleCursor++ % 4;
        ripples[slot * 3] = pointerX; ripples[slot * 3 + 1] = pointerY;
        ripples[slot * 3 + 2] = (performance.now() - start) / 1000;
      };
      window.addEventListener('resize', resize);
      window.addEventListener('pointermove', move, { passive: true });
      window.addEventListener('pointerleave', leave);
      window.addEventListener('pointerdown', down, { passive: true });
      resize();

      const draw = (now: number) => {
        if (!start) start = now;
        gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(program);
        gl.uniform1f(timeLoc, (now - start) / 1000);
        gl.uniform2f(pointerLoc, pointerX, pointerY);
        gl.uniform1f(activeLoc, pointerActive);
        gl.uniform3fv(rippleLoc, ripples);
        gl.bindVertexArray(vao);
        gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.drawElements(gl.LINES, indices.length, gl.UNSIGNED_SHORT, 0);
        frame = requestAnimationFrame(draw);
      };
      frame = requestAnimationFrame(draw);
      return () => {
        cancelAnimationFrame(frame);
        window.removeEventListener('resize', resize);
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerleave', leave);
        window.removeEventListener('pointerdown', down);
        if (vertexBuffer) gl.deleteBuffer(vertexBuffer);
        if (indexBuffer) gl.deleteBuffer(indexBuffer);
        if (vao) gl.deleteVertexArray(vao);
        if (program) gl.deleteProgram(program);
      };
    } catch {
      canvas.classList.add('shader-unavailable');
      if (program) gl.deleteProgram(program);
    }
  }, []);

  return <div className="pryzm-background site-background shader-background" aria-hidden="true">
    <canvas ref={canvasRef} className="wave-field-canvas" />
    <div className="shader-background-overlay" />
  </div>;
}
