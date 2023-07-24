export class Timer {
    static cooldown(value: number, delta: number) {
        return value -= delta * 0.001;
    }
}