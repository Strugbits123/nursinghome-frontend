// types/locomotive-scroll.d.ts
declare module 'locomotive-scroll' {
  interface LocomotiveScrollOptions {
    el: HTMLElement;
    smooth?: boolean;
    multiplier?: number;
    lerp?: number;
    [key: string]: any;
  }

  export default class LocomotiveScroll {
    on(arg0: string, update: () => void) {
      throw new Error('Method not implemented.');
    }
    scrollTo(value: any, arg1: number, arg2: number): number | void {
      throw new Error('Method not implemented.');
    }
    scroll: any;
    constructor(options: LocomotiveScrollOptions);
    update(): void;
    destroy(): void;
  }
}
