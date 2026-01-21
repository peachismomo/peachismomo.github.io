export class Texture2D {
    public readonly gl: WebGL2RenderingContext;
    public readonly handle: WebGLTexture;
    public readonly width: number;
    public readonly height: number;

    private constructor(gl: WebGL2RenderingContext, handle: WebGLTexture, w: number, h: number) {
        this.gl = gl;
        this.handle = handle;
        this.width = w;
        this.height = h;
    }

    bind(unit = 0) {
        const gl = this.gl;
        gl.activeTexture(gl.TEXTURE0 + unit);
        gl.bindTexture(gl.TEXTURE_2D, this.handle);
    }

    destroy() {
        this.gl.deleteTexture(this.handle);
    }

    static fromImage(
        gl: WebGL2RenderingContext,
        img: TexImageSource,
        opts?: {
            srgb?: boolean;         // if you handle sRGB yourself in shader, keep false
            flipY?: boolean;        // glTF expects flipY = false typically
            genMips?: boolean;
        },
    ): Texture2D {
        const tex = gl.createTexture();
        if (!tex) throw new Error("Failed to create texture");

        gl.bindTexture(gl.TEXTURE_2D, tex);

        const flipY = opts?.flipY ?? false;
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, flipY ? 1 : 0);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

        const genMips = opts?.genMips ?? true;

        const w = (img as any).width ?? 0;
        const h = (img as any).height ?? 0;

        const isPOT = (n: number) => (n & (n - 1)) === 0 && n !== 0;
        const pot = isPOT(w) && isPOT(h);

        if (genMips && pot) {
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        } else {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        }

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        gl.bindTexture(gl.TEXTURE_2D, null);

        return new Texture2D(gl, tex, w, h);
    }

    static solid(gl: WebGL2RenderingContext, rgba: [number, number, number, number]) {
        const data = new Uint8Array(rgba);
        const tex = gl.createTexture();
        if (!tex) throw new Error("Failed to create texture");

        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.bindTexture(gl.TEXTURE_2D, null);

        return new Texture2D(gl, tex, 1, 1);
    }
}
