export class State {
  private static _instance: State;
  private state: Map<string, any>;
  private listeners: Map<string, Set<(value: any, prevValue: any) => void>>;

  private constructor() {
    console.log('Initializing State');
    this.state = new Map();
    this.listeners = new Map();
    this.loadStateFromLocalStorage();
  }

  public static getInstance(): State {
    if (!State._instance) {
      State._instance = new State();
    }
    return State._instance;
  }

  public set(key: string, value: any): void {
    const prevValue = this.state.get(key);
    this.state.set(key, value);
    this.saveStateToLocalStorage();

    const listeners = this.listeners.get(key);

    if (listeners) {
      listeners.forEach(cb => cb(value, prevValue));
    }
  }

  public get(key: string): any {
    return this.state.get(key);
  }

  public has(key: string): boolean {
    return this.state.has(key);
  }

  public delete(key: string): boolean {
    const result = this.state.delete(key);
    this.saveStateToLocalStorage();
    this.listeners.delete(key);
    return result;
  }

  public clear(): void {
    this.state.clear();
    this.listeners.clear();
    localStorage.removeItem('appState');
  }

  public subscribe<T = any>(
    key: string,
    callback: (value: T) => void
  ): () => void {
    // if (!this.state.has(key)) {
    //   throw new Error(`Cannot subscribe to unknown key "${key}".`);
    // }

    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }

    const listeners = this.listeners.get(key)!;
    listeners.add(callback);

    return () => listeners.delete(callback);
  }

  private saveStateToLocalStorage(): void {
    localStorage.setItem('appState', JSON.stringify(Array.from(this.state.entries())));
  }

  private loadStateFromLocalStorage(): void {
    const savedState = localStorage.getItem('appState');
    if (savedState) {
      this.state = new Map(JSON.parse(savedState));
    }
  }
}
