export interface AttrDesc {
  index: number; // attribute location
  size: number; // number of components
  offset: number; // byte offset
}

export class Mesh {
  private vao: WebGLVertexArrayObject;
  private vbo: WebGLBuffer;
  private ebo: WebGLBuffer | null;

  private count: number;
  private indexed: boolean;
  private indexType: number; // gl.UNSIGNED_SHORT / gl.UNSIGNED_INT

  private constructor(args: {
    vao: WebGLVertexArrayObject;
    vbo: WebGLBuffer;
    ebo: WebGLBuffer | null;
    count: number;
    indexed: boolean;
    indexType: number;
  }) {
    this.vao = args.vao;
    this.vbo = args.vbo;
    this.ebo = args.ebo;
    this.count = args.count;
    this.indexed = args.indexed;
    this.indexType = args.indexType;
  }

  static fromVertices(
    gl: WebGL2RenderingContext,
    vertices: Float32Array,
    strideBytes: number,
    layout: AttrDesc[],
  ): Mesh {
    const vao = gl.createVertexArray();
    const vbo = gl.createBuffer();
    if (!vao || !vbo) throw new Error("Failed to create VAO/VBO");

    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    for (const a of layout) {
      gl.enableVertexAttribArray(a.index);
      gl.vertexAttribPointer(
        a.index,
        a.size,
        gl.FLOAT,
        false,
        strideBytes,
        a.offset,
      );
    }

    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    return new Mesh({
      vao,
      vbo,
      ebo: null,
      count: vertices.byteLength / strideBytes,
      indexed: false,
      indexType: 0,
    });
  }

  static fromIndexed(
    gl: WebGL2RenderingContext,
    vertices: Float32Array,
    strideBytes: number,
    layout: AttrDesc[],
    indices: Uint16Array | Uint32Array,
  ): Mesh {
    const vao = gl.createVertexArray();
    const vbo = gl.createBuffer();
    const ebo = gl.createBuffer();
    if (!vao || !vbo || !ebo) throw new Error("Failed to create VAO/VBO/EBO");

    gl.bindVertexArray(vao);

    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    for (const a of layout) {
      gl.enableVertexAttribArray(a.index);
      gl.vertexAttribPointer(
        a.index,
        a.size,
        gl.FLOAT,
        false,
        strideBytes,
        a.offset,
      );
    }

    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    const indexType =
      indices instanceof Uint32Array ? gl.UNSIGNED_INT : gl.UNSIGNED_SHORT;

    return new Mesh({
      vao,
      vbo,
      ebo,
      count: indices.length,
      indexed: true,
      indexType,
    });
  }

  draw(gl: WebGL2RenderingContext) {
    gl.bindVertexArray(this.vao);
    if (this.indexed)
      gl.drawElements(gl.TRIANGLES, this.count, this.indexType, 0);
    else gl.drawArrays(gl.TRIANGLES, 0, this.count);
    gl.bindVertexArray(null);
  }

  dispose(gl: WebGL2RenderingContext) {
    if (this.ebo) gl.deleteBuffer(this.ebo);
    gl.deleteBuffer(this.vbo);
    gl.deleteVertexArray(this.vao);
    this.ebo = null;
  }
}
