/* jFactory, Copyright (c) 2019, Stéphane Plazis, https://github.com/jfactory-es/jfactory/blob/master/LICENSE.txt */

// ---------------------------------------------------------------------------------------------------------------------
// JFactoryTime
// ---------------------------------------------------------------------------------------------------------------------
// Status: Beta
// ---------------------------------------------------------------------------------------------------------------------

export class JFactoryTime extends Date {
    toString() {
        return this.toLocaleTimeString() + ", " + this.getUTCMilliseconds() + "ms (" + this.valueOf() + ")"
    }
    $toDurationString() {
        let hours = this.getUTCHours();
        let minutes = this.getUTCMinutes();
        let seconds = this.getUTCSeconds();
        let milliseconds = this.getUTCMilliseconds();

        let a = [];
        if (hours) {
            a.push(hours + "h")
        }
        if (minutes) {
            a.push(minutes + "min")
        }
        if (seconds) {
            a.push(seconds + "s")
        }
        a.push(milliseconds + "ms");
        if (a.length === 1) {
            return a[0];
        } else {
            return a.join(",") + " (" + this.valueOf() + ")";
        }
    }
}

export class JFactoryTimeTrace extends Date {
    constructor() {
        super();
        this.elapsed = null;
        Object.defineProperties(this, {
            t1: { value: null, writable: true },
            t0: { value: new JFactoryTime() }
        })
    }
    end() {
        this.t1 = new JFactoryTime();
        this.elapsed = new JFactoryTime(this.t1 - this.t0).$toDurationString()
    }
    toString() {
        return this.elapsed
    }
}