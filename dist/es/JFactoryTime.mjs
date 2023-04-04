/*!
 * jFactory v1.8.0-alpha 2023-04-04
 * https://github.com/jfactory-es/jfactory
 * (c) 2019-2023 Stephane Plazis
 * License: https://raw.githubusercontent.com/jfactory-es/jfactory/master/LICENSE.txt
 */
// ---------------------------------------------------------------------------------------------------------------------
// JFactoryTime
// ---------------------------------------------------------------------------------------------------------------------
// Status: Beta
// ---------------------------------------------------------------------------------------------------------------------

class JFactoryTime extends Date {
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
            a.push(hours + "h");
        }
        if (minutes) {
            a.push(minutes + "min");
        }
        if (seconds) {
            a.push(seconds + "s");
        }
        a.push(milliseconds + "ms");
        if (a.length === 1) {
            return a[0];
        } else {
            return a.join(",") + " (" + this.valueOf() + ")";
        }
    }
}

class JFactoryTimeTrace extends Date {
    constructor() {
        super();
        this.elapsed = null;
        Object.defineProperties(this, {
            t1: { value: null, writable: true },
            t0: { value: new JFactoryTime() }
        });
    }
    end() {
        this.t1 = new JFactoryTime();
        this.elapsed = new JFactoryTime(this.t1 - this.t0).$toDurationString();
    }
    toString() {
        return this.elapsed
    }
}

export { JFactoryTime, JFactoryTimeTrace };
