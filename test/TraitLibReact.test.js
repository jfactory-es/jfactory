const { wait, expect } = require("../scripts/dev/test-utils");
const $ = require("jquery");
const React = require('react');
const Component = React.Component;
const ReactDOM = require("react-dom");

// ---------------------------------------------------------------------------------------------------------------------
// TraitDOM Test
// ---------------------------------------------------------------------------------------------------------------------

const { jFactory } = require("../dist");
jFactory.ReactDOM = ReactDOM;

describe("Trait React", function() {

    it("should register and remove react", async function() {

        let component = jFactory("component", {
            onInstall() {
                class MyReactComponent extends React.Component {
                    constructor(props) {
                        super(props);
                        this.state = { txt: 0 };
                    }
                    render() {
                        return this.state.txt
                    }
                }
                let myReactElement = React.createElement(MyReactComponent);
                let myReactContainer = $('<div id="dom1">').appendTo("body");
                this.view = this.$react("#dom1", myReactContainer, myReactElement);
            },
            onEnable() {
                this.view.setState({txt: 1});
            }
        });

        await component.$install();
        expect($("#dom1").text()).equal("0");
        await component.$enable();
        expect($("#dom1").text()).equal("1");
        await component.$uninstall();
        expect($("#dom1").length).equal(0);

        await component.$install();
        expect($("#dom1").text()).equal("0");
        await component.$enable();
        expect($("#dom1").text()).equal("1");
        await component.$uninstall();
        expect($("#dom1").length).equal(0);
    });
});

