const $ = require("jquery");

// ---------------------------------------------------------------------------------------------------------------------
// JFactoryEvents DOM
// ---------------------------------------------------------------------------------------------------------------------

import {
    describe, it, expect,
    JFactoryEvents,
} from "../scripts/test/test-import.mjs";

describe("JFactoryEvents DOM", function() {
    let jFactoryEvent = new JFactoryEvents();

    it("should subscribe / trigger / unsubscribe DOM events", function() {
        $("body").append(
            '<div id="test-dom" style="position: absolute; top:0">\n' +
            '    <div id="box1" style="width: 10px;height: 10px; background-color: red; position: absolute"></div>\n' +
            '    <div id="box2" style="width: 10px;height: 10px; background-color: blue; position: absolute; ' +
            'left: 10px"></div>\n' +
            "</div>");

        let c = 0;

        jFactoryEvent.on({ events: "click mouseover", target: "#box1, #box2", handler: () => c += 1 });

        $("#box1").click();
        expect(c).equal(1);

        $("#box1").mouseover();
        expect(c).equal(2);

        $("#box2").click();
        expect(c).equal(3);

        $("#box2").mouseover();
        expect(c).equal(4);

        $("#box1, #box2").mouseover();
        expect(c).equal(6);

        jFactoryEvent.triggerSeries({ events: "mouseover", target: "#box1" });
        expect(c).equal(7);
        c = 0;
        jFactoryEvent.off({ target: "#box1, #box2" });
        $("#box1, #box2").mouseover().click();
        expect(c).equal(0);

        $("#test-dom").remove()
    });
});