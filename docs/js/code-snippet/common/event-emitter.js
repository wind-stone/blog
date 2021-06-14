class eventEmitter {
    constructor() {
        this._events = Object.create(null);
    }

    on(event, fn, context = this, checkDuplicated = true) {
        if (!this._events[event]) {
            this._events[event] = [];
        }
        const events = this._events[event];
        const isDuplicated =
            checkDuplicated &&
            events.some(([evtFn, evtCtx]) => {
                return fn === evtFn && context === evtCtx;
            });
        if (!isDuplicated) {
            events.push([fn, context]);
        }
        return this;
    }

    once(event, fn, context = this) {
        const newFn = () => {
            this.off(event, newFn);
            fn.apply(context, arguments);
        };
        // 挂载原始的 fn，方便通过 $off 删除
        newFn.fn = fn;
        this.on(event, newFn, context, false);
        return this;
    }

    off(event, fn) {
        if (!arguments.length) {
            this._events = Object.create(null);
            return this;
        }
        const events = this._events[event];
        if (!events) {
            return this;
        }
        if (!fn) {
            this._events[event] = null;
            return this;
        }

        let i = events.length;
        while (i--) {
            let event = events[i];
            if (event[0] === fn || event[0].fn === fn) {
                events.splice(i, 1);
            }
        }
        return this;
    }

    emit(event, ...arg) {
        const cbs = this._events[event];
        if (cbs) {
            cbs.forEach(([fn, context], idx) => {
                fn.apply(context, arg);
            });
        }
    }
}
