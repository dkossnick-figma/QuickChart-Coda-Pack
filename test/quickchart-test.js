import {assert} from "chai";
import {describe} from "mocha";
import {executeFormulaFromPackDef} from "@codahq/packs-sdk/dist/development.js";
import {it} from "mocha";
import {pack} from "../quickchart.js";

describe('Chart', () => {
    it('Chart creates a proper URL', async () => {
        const result =
            await executeFormulaFromPackDef(pack, 'Chart', ['line', [0,1,2], "svg", 800, 600, "transparent", "data1", [100,80,95]]);
        assert.equal(result, 'https://quickchart.io/chart?c={\n' +
            '  "type": "line",\n' +
            '  "data": {\n' +
            '    "labels": [\n' +
            '      0,\n' +
            '      1,\n' +
            '      2\n' +
            '    ],\n' +
            '    "datasets": [\n' +
            '      {\n' +
            '        "label": "data1",\n' +
            '        "data": [\n' +
            '          100,\n' +
            '          80,\n' +
            '          95\n' +
            '        ]\n' +
            '      }\n' +
            '    ]\n' +
            '  }\n' +
            '}');
    });
});