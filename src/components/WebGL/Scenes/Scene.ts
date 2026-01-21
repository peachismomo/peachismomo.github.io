export interface FrameInfo {
  timeMs: number;
  width: number;
  height: number;
  dpr?: number;
}

export abstract class SceneBase {
  protected gl!: WebGL2RenderingContext;

  private initialized = false;
  private initPromise: Promise<void> | null = null;

  private gen = 0;

  protected abstract onInit(): void | Promise<void>;
  protected abstract onRender(frame: FrameInfo): void;
  protected abstract onUpdate(deltaTime: number): void;
  protected abstract onDispose(): void;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected onResize(_width: number, _height: number): void {
    /* empty */
  }

  public init(gl: WebGL2RenderingContext): () => void {
    void this.ensureInit(gl);

    // GLCanvas can call this on unmount
    return () => this.dispose(gl);
  }

  public update(deltaTime: number): void {
    this.onUpdate(deltaTime);
  }

  private ensureInit(gl: WebGL2RenderingContext): Promise<void> {
    if (this.initialized) return Promise.resolve();

    if (!this.initPromise) {
      this.gl = gl;
      const myGen = this.gen;

      this.initPromise = Promise.resolve()
        .then(() => this.onInit())
        .then(() => {
          // If we were disposed while init was in-flight, ignore completion
          if (this.gen !== myGen) return;
          this.initialized = true;
        })
        .catch((err) => {
          // If init fails, allow retry on next frame
          if (this.gen === myGen) {
            this.initPromise = null;
            this.initialized = false;
          }
          // Surface the error (optional)

          console.error("Scene init failed:", err);
        });
    }

    return this.initPromise;
  }

  public render(gl: WebGL2RenderingContext, frame: FrameInfo): void {
    void this.ensureInit(gl);

    if (!this.initialized) {
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      return;
    }

    this.onRender(frame);
  }

  public resize(
    gl: WebGL2RenderingContext,
    width: number,
    height: number,
  ): void {
    void this.ensureInit(gl);
    if (!this.initialized) return;
    this.onResize(width, height);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public dispose(_gl: WebGL2RenderingContext): void {
    // bump generation to invalidate any in-flight init completion
    this.gen++;

    // If init was running, we still want to clear state.
    // If init later finishes, it will see gen mismatch and won't set initialized=true.
    this.initPromise = null;

    if (!this.initialized) return;

    this.onDispose();
    this.initialized = false;
  }
}
