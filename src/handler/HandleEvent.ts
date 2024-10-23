// https://stackoverflow.com/questions/12881212/does-typescript-support-events-on-classes/14657922#14657922

interface ILiteEvent<T> {
    on(eventName: string, handler: (data?: T) => void): void;
    off(eventName: string, handler: (data?: T) => void): void;
}

export class LiteEvent<T> implements ILiteEvent<T> {
    private handlers: { [key: string]: ((data?: T) => void)[] } = {};

    public on(eventName: string, handler: (data?: T) => void): void {
        if (!this.handlers[eventName]) {
            this.handlers[eventName] = [];
        }
        this.handlers[eventName].push(handler);
    }

    public off(eventName: string, handler: (data?: T) => void): void {
        if (!this.handlers[eventName]) return;
        this.handlers[eventName] = this.handlers[eventName].filter(h => h !== handler);
    }

    public trigger(eventName: string, data?: T): void {
        if (!this.handlers[eventName]) return;
        this.handlers[eventName].slice(0).forEach(h => h(data));
    }

    public expose(): ILiteEvent<T> {
        return this;
    }
}
