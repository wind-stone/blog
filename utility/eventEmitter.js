class eventEmitter {
  constructor() {
    this._eventsObject = {}
  }

  on(eventName, listener, context = this, checkDupliate = true) {
    if (!this._eventsObject[eventName]) {
      this._eventsObject[eventName] = []
    }
    const events = this._eventsObject[eventName]
    const hasIn = checkDupliate && events.some(([evtFn, evtCtx]) => {
      console.log('checkDupliate')
      return listener === evtFn && context === evtCtx
    })
    if (!hasIn) {
      events.push([listener, context])
    }
  }

  once(eventName, listener, context = this) {
    const newListener = () => {
      this.off(eventName, newListener)
      listener.apply(context, arguments)
    }
    this.on(eventName, newListener, context, false)
  }

  off(eventName, listener) {
    const events = this._eventsObject[eventName]
    if (!events) {
      return
    }
    if (!listener) {
      events.length = 0
      return
    }

    let len = events.length
    while(len--) {
      let event = events[len]
      if (event[0] === listener) {
        events.splice(len, 1)
      }
    }
  }

  emit(eventName, ...arg) {
    const events = this._eventsObject[eventName]
    if (!events) {
      return
    }
    events.forEach(([listener, context], idx) => {
      listener.apply(context, arg)
    })
  }
}
