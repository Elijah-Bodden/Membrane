import { floatColor } from "sigma/utils";
import { NodeDisplayData } from "sigma/types";
import { AbstractNodeProgram } from "sigma/rendering/webgl/programs/common/node";
import { RenderParams } from "sigma/rendering/webgl/programs/common/program";

import * as vertexShaderSourceGetter from "!raw-loader!./shaders/node.vert.glsl";
import * as fragmentShaderSourceGetter from "!raw-loader!./shaders/unrelated.frag.glsl";
var vertexShaderSource = vertexShaderSourceGetter["default"];
var fragmentShaderSource = fragmentShaderSourceGetter["default"];
const POINTS = 1,
  ATTRIBUTES = 4;

export default class NodeProgramBorder extends AbstractNodeProgram {
  constructor(gl: WebGLRenderingContext) {
    super(gl, vertexShaderSource, fragmentShaderSource, POINTS, ATTRIBUTES);
    this.bind();
  }

  process(data: NodeDisplayData, hidden: boolean, offset: number): void {
    const array = this.array;
    let i = offset * POINTS * ATTRIBUTES;

    if (hidden) {
      array[i++] = 0;
      array[i++] = 0;
      array[i++] = 0;
      array[i++] = 0;
      return;
    }

    const color = floatColor(data.color);

    array[i++] = data.x;
    array[i++] = data.y;
    array[i++] = data.size;
    array[i] = color;
  }

  render(params: RenderParams): void {
    const gl = this.gl;
    const program = this.program;
    gl.useProgram(program);

    gl.uniform1f(this.ratioLocation, 1 / Math.sqrt(params.ratio));
    gl.uniform1f(this.scaleLocation, params.scalingRatio);
    gl.uniformMatrix3fv(this.matrixLocation, false, params.matrix);

    gl.drawArrays(gl.POINTS, 0, this.array.length / ATTRIBUTES);
  }
}
