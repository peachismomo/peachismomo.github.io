import type { Binding, Shader } from "../Shaders/Shader";

export class Material {
    private bindings: Binding[] = [];

    constructor(init?: Binding[]) {
        if (init) this.bindings = init;
    }

    set(binding: Binding) {
        const i = this.bindings.findIndex((b) => b.name === binding.name);
        if (i >= 0) this.bindings[i] = binding;
        else this.bindings.push(binding);
    }

    apply(shader: Shader) {
        shader.bind(this.bindings);
    }
}
