type Callback = (...args: any[]) => void;

class Emitter {
  private events: Record<string, Callback[]> = {};

  on(event: string, callback: Callback) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(callback);
  }

  off(event: string, callback: Callback) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter((cb) => cb !== callback);
  }

  emit(event: string, ...args: any[]) {
    console.log("event fired locally", event, args);
    if (!this.events[event]) return;
    this.events[event].forEach((cb) => cb(...args));
  }

  clear() {
    this.events = {};
  }
}

export default new Emitter();
