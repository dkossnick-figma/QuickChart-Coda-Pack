import * as coda from "@codahq/packs-sdk";

export const pack = coda.newPack();
//pack.formulaNamespace = "QuickChart";

const textParam = coda.makeParameter({type: coda.ParameterType.String, name:"text", description:"The text to turn into a word cloud."});
const formatParam = coda.makeParameter({type: coda.ParameterType.String, name: "format", description: "Image output format - svg or png", optional: true, defaultValue: "png"});
const widthParam = coda.makeParameter({ type: coda.ParameterType.Number, name: "width", description: "Image width", optional: true, defaultValue: 600});
const heightParam = coda.makeParameter({type: coda.ParameterType.Number, name: "height", description: "Image height", optional: true, defaultValue: 600});
const backgroundColorParam = coda.makeParameter({type: coda.ParameterType.String, name: "backgroundColor", description: "Background color of image (rgb, hsl, hex, or name value)",
  optional: true, defaultValue: "transparent"});
const fontFamilyParam = coda.makeParameter({type: coda.ParameterType.String, name: "fontFamily", description: "Font family to use",
  optional: true, defaultValue: "serif"});
const fontScaleParam = coda.makeParameter({type: coda.ParameterType.Number, name: "fontScale", description: "Size of the largest font (roughly)",
  optional: true, defaultValue: 25});
const scaleParam = coda.makeParameter({type: coda.ParameterType.String, name: "scale", description: "Frequency scaling method - linear, sqrt, or log",
  optional: true, defaultValue: "linear"});
const paddingParam = coda.makeParameter({type: coda.ParameterType.Number, name: "padding", description: "Padding between words, in pixels",
  optional: true, defaultValue: 1});
const rotationParam = coda.makeParameter({type: coda.ParameterType.Number,name: "rotation", description: "Maximum angle of rotation for words",
  optional: true, defaultValue: 0});
const maxNumWordsParam = coda.makeParameter({type: coda.ParameterType.Number, name: "maxNumWords", description: "Maximum number of words to show. Note that fewer may be shown depending on size.",
  optional: true, defaultValue: 200});
const minNumWorsdParam = coda.makeParameter({type: coda.ParameterType.Number, name: "minNumWords", description: "Minimum character length of each word to include",
  optional: true, defaultValue: 1});
const caseParam = coda.makeParameter({type: coda.ParameterType.String, name: "case", description: "Force words to this case - upper, lower, or none",
  optional: true, defaultValue: "lower"});
const colorsParam = coda.makeParameter({type: coda.ParameterType.String, name: "colors", description: "List of colors for words in JSON format, assigned randomly. e.g. [“red”, “#00ff00”, “rgba(0, 0, 255, 1.0)”]",
  optional: true, defaultValue: "random"});
const removeStopwordsParam = coda.makeParameter({type: coda.ParameterType.Boolean, name: "removeStopwords", description: "If true, remove common words from the cloud",
  optional: true, defaultValue: false});
const languageParam = coda.makeParameter({type: coda.ParameterType.String, name: "language", description: "Two-letter language code of stopwords to remove",
  optional: true, defaultValue: "en"});
const useWordListParam = coda.makeParameter({type: coda.ParameterType.Boolean, name: "useWordList", description: "If true, treat text as a comma-separated list of words or phrases instead of trying to split the text on our side",
  optional: true, defaultValue: false});

function getUrl(url) {
  // return encodeURI(url);
  return url.replace("[\"\s]", "%22");
}

pack.addFormula({
  name: "WordCloud",
  description: "Generate a QuickChart Word Cloud image. More documentation: https://quickchart.io/documentation/word-cloud-api/",
  parameters: [
    textParam, formatParam, widthParam, heightParam, backgroundColorParam, fontFamilyParam, fontScaleParam, scaleParam, paddingParam,
    rotationParam, maxNumWordsParam, minNumWorsdParam, caseParam, colorsParam, removeStopwordsParam, languageParam, useWordListParam
  ],
  execute: async function (inputs, helper) {
    var base_url = "https://quickchart.io/wordcloud?";
    var params = [];
    for (var i=0; i < inputs.length; i++) {
      var input = inputs[i];
      // TODO: default values not being used when param is null
      if (input != null) {
        params.push(this.parameters[i].name + "=" + input);
      }
    }
    return encodeURI(base_url + params.join('&'));
  },
  resultType: coda.ValueType.String,
  codaType: coda.ValueHintType.ImageAttachment
});

const qrCodeTextParam = coda.makeParameter({type: coda.ParameterType.String, name:"text", description:"The text to turn into a QR code link."});
const marginParam = coda.makeParameter({ type: coda.ParameterType.Number, name: "margin", description: "Specify the whitespace around the QR image", optional: true, defaultValue: 4});
const ecLevelParam = coda.makeParameter({type: coda.ParameterType.String, name:"ecLevel", description:"Error correction level (Low, Medium, Quartile, High - default is Medium)", optional: true, defaultValue: "Medium"});
const foregroundColorParam = coda.makeParameter({type: coda.ParameterType.String, name:"foregroundColor", description:"Change the color of the dark foreground (default black). Specify using hex code (eg: 000000).", optional: true, defaultValue: "000000"});
const qrBackgroundColorParam = coda.makeParameter({type: coda.ParameterType.String, name:"backgroundColor", description:"Change the color of the light background (default white). Specify using hex code (eg: ffffff).", optional: true, defaultValue: "ffffff"});
const qrSizeParam = coda.makeParameter({ type: coda.ParameterType.Number, name: "size", description: "Height and width in pixels", optional: true});


pack.addFormula({
  name: "QRCode",
  description: "Generate a QR Code image. More documentation: https://quickchart.io/documentation/#qr",
  parameters: [
    qrCodeTextParam, formatParam, marginParam, widthParam, heightParam, ecLevelParam, foregroundColorParam, qrBackgroundColorParam, qrSizeParam
  ],
  execute: async function (inputs, helper) {
    var base_url = "https://quickchart.io/qr?";
    var params = [];
    for (var i=0; i < inputs.length; i++) {
      var input = inputs[i];
      var name = this.parameters[i].name;
      // TODO: default values not being used when param is null
      if (input != null) {
        // Rewrite user friendly input to character version.
        if (name == "ecLevel") {
            input = input[0];
        }
        if (name == "foregroundColor") {
          name = "dark";
          // TODO: could also accept non-hex values and rewrite.
        }
        if (name == "backgroundColor") {
          name = "light";
          // TODO: could also accept non-hex values and rewrite.
        }
        params.push(name + "=" + input);
      }
    }
    return getUrl(base_url + params.join('&'));
  },
  resultType: coda.ValueType.String,
  codaType: coda.ValueHintType.ImageAttachment
});

const nodesParam = coda.makeParameter({type: coda.ParameterType.StringArray, name:"nodes", description:"Node labels."});
const graphTypeParam = coda.makeParameter({ type: coda.ParameterType.String, name: "graphType", description: "'directed' or 'undirected'", optional: true, defaultValue: "undirected"});
const edgesParam = coda.makeParameter({type: coda.ParameterType.StringArray, name:"edges", description:"Edges per node", optional: true});
const colorNodesParam = coda.makeParameter({type: coda.ParameterType.StringArray, name:"colorNodes", description:"Color nodes based on unique labels in this array. Random colors assigned, unique per label.", optional: true});
const layoutParam = coda.makeParameter({type: coda.ParameterType.String, name:"layout", description:"'dot', 'fdp', 'neato', 'circo', 'twopi', 'osage', 'patchwork'", optional: true, defaultValue: "dot"});
const allowOverlapParam = coda.makeParameter({type: coda.ParameterType.Boolean, name:"allowOverlap", description:"By default the layout engine will try not to have overlap. But you can further force no overlap", optional: true, defaultValue: true});

pack.addFormula({
  // This is the name that will be called in the formula builder. Remember, your formula name cannot have spaces in it.
  name: "GraphNodes",
  description: "Generate a node graph image. More documentation: https://quickchart.io/documentation/graphviz-api/",
  parameters: [
    nodesParam, graphTypeParam, edgesParam, colorNodesParam, layoutParam, allowOverlapParam,
    formatParam, heightParam, widthParam
  ],
  execute: async function ([nodes, graphType, edges, colorNodes, layout, allowOverlap, format, height, width], helper) {
    var edge = "--";
    if (graphType == 'directed') {
      edge = "->";
      graphType = "digraph";
    }
    else {
      graphType = "graph";
    }
    var url = "https://quickchart.io/graphviz?";
    if (layout != null && layout.length > 0) {
      url += "layout=" + layout + "&";
    }
    url += "graph=" + graphType + "{";
    var rows = ""
    var colorList = colors.map((x) => x);
    var colorMap = {};
    for (var i=0; i < nodes.length; i++) {
      var rowLabel = nodes[i];
      // Slice creates a copy: https://reactgo.com/javascript-string-copy/
      var rowID = rowLabel.slice().replace(" ", "");
      var rowEdges = edges[i];
      var edgeList = rowEdges.replace(" ", "").split(',');
      for (var edgeId = 0; edgeId < edgeList.length; edgeId++) {
        if (edgeList[edgeId].length > 0) {
          rows += rowID + edge + edgeList[edgeId] + ";";
        }
      }
      rows +=  rowID + " [label=\"" + rowLabel + "\"";
      if (colorNodes != null && colorNodes.length > 0 && colorNodes[i] != null && colorNodes[i].length > 0 && colorNodes[i].trim().length > 0) {
        var colorID = colorNodes[i].slice().replace(" ", "");
        var color;
        if (colorID in colorMap) {
          color = colorMap[colorID];
        }
        else {
          color = colorList.pop();
          colorMap[colorID] = color;
          if (colorList.length == 0) {
            // re-upp the color list if empty.
            colorList = colors.map((x) => x);
          }
        }
        rows += ' style=filled,color=\"' + color + '\"';
      }          
      rows += "];";
    }
    var overlap = "";
    if (!allowOverlap) {
      overlap = "overlap=false;"
    }
    url = url + rows + overlap + "}&";
    if (format != null && format.length > 0) {
      url += "format=" + format + "&";
    }
    if (height != null) {
      url += "height=" + height + "&";
    }
    if (width != null) {
      url += "width=" + width + "&";
    }
    // Trim last '&'
    url = url.substr(0, url.length-1);
    return url;
  },
  resultType: coda.ValueType.String,
  codaType: coda.ValueHintType.ImageAttachment
});


const genericChartTypeParam = coda.makeParameter({type: coda.ParameterType.String, name:"chartType", description:"Chart type (line, bar, radar, doughnut, pie, bubble, scatter, violin, horizontalViolin, sparkline, progressBar, radialGauge)"});
const xAxis = coda.makeParameter({ type: coda.ParameterType.StringArray, name: "xaxis", description: "X-axis labels labels", optional: true});
const genericChartBackgroundColorParam = coda.makeParameter({type: coda.ParameterType.String, name:"backgroundColor", description:"Background of the chart canvas. Accepts rgb (rgb(255,255,120)), colors (red), and url-encoded hex values (%23ff00ff)",
  optional: true, defaultValue: "transparent"});
const datasetNameParam = coda.makeParameter({type: coda.ParameterType.String, name: "datasetName", description: "Name for this column", optional: true});
const datasetDataParam = coda.makeParameter({type: coda.ParameterType.NumberArray, name:"data", description:"Array of data", optional: true});

pack.addFormula({
  name: "Chart",
  description: "Generate a generic Chart image. More documentation: https://quickchart.io/documentation/#parameters",
  parameters: [
    genericChartTypeParam, xAxis, formatParam, widthParam, heightParam, genericChartBackgroundColorParam
  ],
  varargParameters: [
    datasetNameParam,
    datasetDataParam
  ],
  execute: async function (inputs, helper) {
    var base_url = "https://quickchart.io/chart?c=";
    var datasets = [];
    for (var datasetIndex=this.parameters.length; datasetIndex < inputs.length; datasetIndex+=this.varargParameters.length) {
      datasets.push({"label": inputs[datasetIndex], "data": inputs[datasetIndex+1]});
    }
    var data = {"labels": inputs[1], "datasets": datasets};

    var params = {"type": inputs[0], "data": data};
    return base_url + JSON.stringify(params, null, 2);
  },
  resultType: coda.ValueType.String,
  codaType: coda.ValueHintType.ImageAttachment,
  cacheTtlSecs: 0,
});
// var colors = {
//     aqua: "#00ffff",
//     azure: "#f0ffff",
//     beige: "#f5f5dc",
//     black: "#000000",
//     blue: "#0000ff",
//     brown: "#a52a2a",
//     cyan: "#00ffff",
//     darkblue: "#00008b",
//     darkcyan: "#008b8b",
//     darkgrey: "#a9a9a9",
//     darkgreen: "#006400",
//     darkkhaki: "#bdb76b",
//     darkmagenta: "#8b008b",
//     darkolivegreen: "#556b2f",
//     darkorange: "#ff8c00",
//     darkorchid: "#9932cc",
//     darkred: "#8b0000",
//     darksalmon: "#e9967a",
//     darkviolet: "#9400d3",
//     fuchsia: "#ff00ff",
//     gold: "#ffd700",
//     green: "#008000",
//     indigo: "#4b0082",
//     khaki: "#f0e68c",
//     lightblue: "#add8e6",
//     lightcyan: "#e0ffff",
//     lightgreen: "#90ee90",
//     lightgrey: "#d3d3d3",
//     lightpink: "#ffb6c1",
//     lightyellow: "#ffffe0",
//     lime: "#00ff00",
//     magenta: "#ff00ff",
//     maroon: "#800000",
//     navy: "#000080",
//     olive: "#808000",
//     orange: "#ffa500",
//     pink: "#ffc0cb",
//     purple: "#800080",
//     violet: "#800080",
//     red: "#ff0000",
//     silver: "#c0c0c0",
//     white: "#ffffff",
//     yellow: "#ffff00"
// };
// https://graphviz.org/doc/info/colors.html
var colors = [
  "aqua",
  "azure",
  "beige",
  // "black",
  "blue",
  "brown",
  "cyan",
  "darkblue",
  "darkcyan",
  "darkgrey",
  "darkgreen",
  "darkkhak",
  "darkmagenta",
  "darkolivegreenf",
  "darkorang",
  "darkorchid",
  "darkred",
  "darksalmon",
  "darkviolet",
  "fuchsia",
  "gold",
  "green",
  "indigo",
  "khaki",
  "lightblue",
  "lightcyan",
  "lightgreen",
  "lightgrey",
  "lightpink",
  "lightyellow",
  "lime",
  "magenta",
  "maroon",
  "navy",
  "olive",
  "orange",
  "pink",
  "purple",
  "violet",
  "red",
  "silver",
  // "white",
  "yellow",
  "palegoldenrod",
  "palegreen",
  "paleturquoise",
  "palevoiletred1",
  "skyblue1",
  "slategray1",
  "seashell1",
  "lightslateblue",
  "darkseagreen",
  "peachpuff",
  "plum1",
  "plum3",
  "khaki1",
];

// https://blog.trannhat.xyz/generate-a-hash-from-string-in-javascript/
function hashCode(s) {
  return Math.abs(s.split('').reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0));
};

// Returns in 0-1 range compoment.
function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)/255.0 }
function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)/255.0 }
function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)/255.0 }
function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}
