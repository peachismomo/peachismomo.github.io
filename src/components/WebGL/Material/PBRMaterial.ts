import type { Shader } from "../Shaders/Shader";
import { Texture2D } from "./Texture";

export type AlphaMode = "OPAQUE" | "MASK" | "BLEND";

type PBRFallbacks = {
    white: Texture2D;
    black: Texture2D;
    normal: Texture2D;
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

    /** Keep render-state decisions outside if you can, but leaving it here is fine. */
    private applyBlend(gl: WebGL2RenderingContext) {
        if (this.alphaMode === "BLEND") {
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        } else {
            gl.disable(gl.BLEND);
        }
    }

    bind(gl: WebGL2RenderingContext, shader: Shader) {
        const fb = PBRMaterial.getOrCreateFallbacks(gl);

        const base = (this.baseColorTex ?? fb.white).handle; // WebGLTexture
        const norm = (this.normalTex ?? fb.normal).handle;
        const mr = (this.metallicRoughnessTex ?? fb.white).handle;
        const occ = (this.occlusionTex ?? fb.white).handle;
        const emi = (this.emissiveTex ?? fb.black).handle;

        shader.bind([
            { name: "u_baseColorTex", sampler2D: { tex: base, unit: 0 } },
            { name: "u_normalTex", sampler2D: { tex: norm, unit: 1 } },
            { name: "u_metallicRoughnessTex", sampler2D: { tex: mr, unit: 2 } },
            { name: "u_occlusionTex", sampler2D: { tex: occ, unit: 3 } },
            { name: "u_emissiveTex", sampler2D: { tex: emi, unit: 4 } },

            { name: "u_baseColorFactor", value: new Float32Array(this.baseColorFactor) },
            { name: "u_metallicFactor", value: this.metallicFactor },
            { name: "u_roughnessFactor", value: this.roughnessFactor },
            { name: "u_emissiveFactor", value: new Float32Array(this.emissiveFactor) },

            { name: "u_normalScale", value: this.normalScale },
            { name: "u_occlusionStrength", value: this.occlusionStrength },

            {
                name: "u_alphaMode",
                value: this.alphaMode === "MASK" ? 1 : this.alphaMode === "BLEND" ? 2 : 0,
            },
            { name: "u_alphaCutoff", value: this.alphaCutoff },
        ]);

        this.applyBlend(gl);
    }
}
