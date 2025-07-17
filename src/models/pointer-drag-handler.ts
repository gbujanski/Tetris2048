import { State } from '../state';

export class PointerDragHandler {
  private state = State.getInstance();
  private dragEl: HTMLElement;
  private ghostEl: HTMLElement | null = null;

  constructor() {
    this.dragEl = document.getElementById('next-tile') as HTMLElement;

    this.dragEl.style.touchAction = 'none';
    this.dragEl.addEventListener('pointerdown', this.onPointerDown);
  }

  private onPointerDown = (e: PointerEvent) => {
    e.preventDefault();
    if (e.button !== 0) return;

    this.state.set('dragging', true);
    this.createGhostElement(e.clientX, e.clientY);

    document.addEventListener('pointermove', this.onPointerMove);
    document.addEventListener('pointerup', this.onPointerUp);
  };

  private onPointerMove = (e: PointerEvent) => {
    if (!this.state.get('dragging') || !this.ghostEl) return;

    this.setGhostElementPosition(e.clientX, e.clientY);
  };

  private onPointerUp = (e: PointerEvent) => {
    if (!this.state.get('dragging')) return;

    this.state.set('dragging', false);

    const elBelow = document.elementFromPoint(e.clientX, e.clientY);
    const dropTarget = elBelow?.closest('.tile') as HTMLElement;

    if (dropTarget) this.state.set('dropTarget', dropTarget);

    this.ghostEl!.remove();
    this.ghostEl = null;

    document.removeEventListener('pointermove', this.onPointerMove);
    document.removeEventListener('pointerup', this.onPointerUp);
  };

  private createGhostElement(x: number, y: number): void {
    if (this.ghostEl) return;

    this.ghostEl = this.dragEl.cloneNode(true) as HTMLElement;
    this.ghostEl.classList.add('dragging');
    this.setGhostElementPosition(x, y);
    document.body.appendChild(this.ghostEl);
  }

  private setGhostElementPosition(x: number, y: number): void {
    if (!this.ghostEl) return;
    this.ghostEl.style.left = `${x - 50}px`;
    this.ghostEl.style.top = `${y - 50}px`;
  }
}
