import { Texture2D } from "./Texture";

export type AlphaMode = "OPAQUE" | "MASK" | "BLEND";

export type PBRBindings = {
    uBaseColorTex: WebGLUniformLocation;
    uNormalTex: WebGLUniformLocation;
    uMetalRoughTex: WebGLUniformLocation;
    uOcclusionTex: WebGLUniformLocation;
    uEmissiveTex: WebGLUniformLocation;

    uBaseColorFactor: WebGLUniformLocation;
    uMetallicFactor: WebGLUniformLocation;
    uRoughnessFactor: WebGLUniformLocation;
    uEmissiveFactor: WebGLUniformLocation;
    uNormalScale: WebGLUniformLocation;
    uOcclusionStrength: WebGLUniformLocation;

    uAlphaMode: WebGLUniformLocation;
    uAlphaCutoff: WebGLUniformLocation;
};

type PBRFallbacks = {
    white: Texture2D;
    black: Texture2D;
    normal: Texture2D; // neutral normal (0.5,0.5,1)
};

export class PBRMaterial {
    baseColorTex?: Texture2D;
    normalTex?: Texture2D;
    metallicRoughnessTex?: Texture2D;
    occlusionTex?: Texture2D;
    emissiveTex?: Texture2D;

    baseColorFactor: [number, number, number, number] = [1, 1, 1, 1];
    metallicFactor = 1.0;
    roughnessFactor = 1.0;
    emissiveFactor: [number, number, number] = [0, 0, 0];

    normalScale = 1.0;
    occlusionStrength = 1.0;

    alphaMode: AlphaMode = "OPAQUE";
    alphaCutoff = 0.5;

    constructor(init?: Partial<PBRMaterial>) {
        Object.assign(this, init);
    }

    private static _fallbacks = new WeakMap<WebGL2RenderingContext, PBRFallbacks>();

    static getOrCreateFallbacks(gl: WebGL2RenderingContext): PBRFallbacks {
        const cached = this._fallbacks.get(gl);
        if (cached) return cached;

        const white = Texture2D.solid(gl, [255, 255, 255, 255]);
        const black = Texture2D.solid(gl, [0, 0, 0, 255]);
        const normal = Texture2D.solid(gl, [128, 128, 255, 255]);

        const fb = { white, black, normal };
        this._fallbacks.set(gl, fb);
        return fb;
    }

    // optional: if you ever tear down a GL context and want to free them
    static disposeFallbacks(gl: WebGL2RenderingContext) {
        const fb = this._fallbacks.get(gl);
        if (!fb) return;
        fb.white.destroy();
        fb.black.destroy();
        fb.normal.destroy();
        this._fallbacks.delete(gl);
    }

    bind(gl: WebGL2RenderingContext, u: PBRBindings) {
        const fb = PBRMaterial.getOrCreateFallbacks(gl);

        (this.baseColorTex ?? fb.white).bind(0);
        (this.normalTex ?? fb.normal).bind(1);
        (this.metallicRoughnessTex ?? fb.white).bind(2);
        (this.occlusionTex ?? fb.white).bind(3);
        (this.emissiveTex ?? fb.black).bind(4);

        gl.uniform1i(u.uBaseColorTex, 0);
        gl.uniform1i(u.uNormalTex, 1);
        gl.uniform1i(u.uMetalRoughTex, 2);
        gl.uniform1i(u.uOcclusionTex, 3);
        gl.uniform1i(u.uEmissiveTex, 4);

        gl.uniform4fv(u.uBaseColorFactor, this.baseColorFactor);
        gl.uniform1f(u.uMetallicFactor, this.metallicFactor);
        gl.uniform1f(u.uRoughnessFactor, this.roughnessFactor);
        gl.uniform3fv(u.uEmissiveFactor, this.emissiveFactor);
        gl.uniform1f(u.uNormalScale, this.normalScale);
        gl.uniform1f(u.uOcclusionStrength, this.occlusionStrength);

        if (this.alphaMode === "BLEND") {
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        } else {
            gl.disable(gl.BLEND);
        }

        gl.uniform1i(
            u.uAlphaMode,
            this.alphaMode === "MASK" ? 1 : this.alphaMode === "BLEND" ? 2 : 0,
        );
        gl.uniform1f(u.uAlphaCutoff, this.alphaCutoff);
    }
}
