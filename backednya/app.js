"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/media-typer/index.js
var require_media_typer = __commonJS({
  "node_modules/media-typer/index.js"(exports2) {
    var paramRegExp = /; *([!#$%&'\*\+\-\.0-9A-Z\^_`a-z\|~]+) *= *("(?:[ !\u0023-\u005b\u005d-\u007e\u0080-\u00ff]|\\[\u0020-\u007e])*"|[!#$%&'\*\+\-\.0-9A-Z\^_`a-z\|~]+) */g;
    var textRegExp = /^[\u0020-\u007e\u0080-\u00ff]+$/;
    var tokenRegExp = /^[!#$%&'\*\+\-\.0-9A-Z\^_`a-z\|~]+$/;
    var qescRegExp = /\\([\u0000-\u007f])/g;
    var quoteRegExp = /([\\"])/g;
    var subtypeNameRegExp = /^[A-Za-z0-9][A-Za-z0-9!#$&^_.-]{0,126}$/;
    var typeNameRegExp = /^[A-Za-z0-9][A-Za-z0-9!#$&^_-]{0,126}$/;
    var typeRegExp = /^ *([A-Za-z0-9][A-Za-z0-9!#$&^_-]{0,126})\/([A-Za-z0-9][A-Za-z0-9!#$&^_.+-]{0,126}) *$/;
    exports2.format = format;
    exports2.parse = parse;
    function format(obj) {
      if (!obj || typeof obj !== "object") {
        throw new TypeError("argument obj is required");
      }
      var parameters = obj.parameters;
      var subtype = obj.subtype;
      var suffix = obj.suffix;
      var type = obj.type;
      if (!type || !typeNameRegExp.test(type)) {
        throw new TypeError("invalid type");
      }
      if (!subtype || !subtypeNameRegExp.test(subtype)) {
        throw new TypeError("invalid subtype");
      }
      var string = type + "/" + subtype;
      if (suffix) {
        if (!typeNameRegExp.test(suffix)) {
          throw new TypeError("invalid suffix");
        }
        string += "+" + suffix;
      }
      if (parameters && typeof parameters === "object") {
        var param;
        var params = Object.keys(parameters).sort();
        for (var i = 0; i < params.length; i++) {
          param = params[i];
          if (!tokenRegExp.test(param)) {
            throw new TypeError("invalid parameter name");
          }
          string += "; " + param + "=" + qstring(parameters[param]);
        }
      }
      return string;
    }
    function parse(string) {
      if (!string) {
        throw new TypeError("argument string is required");
      }
      if (typeof string === "object") {
        string = getcontenttype(string);
      }
      if (typeof string !== "string") {
        throw new TypeError("argument string is required to be a string");
      }
      var index = string.indexOf(";");
      var type = index !== -1 ? string.substr(0, index) : string;
      var key;
      var match;
      var obj = splitType(type);
      var params = {};
      var value;
      paramRegExp.lastIndex = index;
      while (match = paramRegExp.exec(string)) {
        if (match.index !== index) {
          throw new TypeError("invalid parameter format");
        }
        index += match[0].length;
        key = match[1].toLowerCase();
        value = match[2];
        if (value[0] === '"') {
          value = value.substr(1, value.length - 2).replace(qescRegExp, "$1");
        }
        params[key] = value;
      }
      if (index !== -1 && index !== string.length) {
        throw new TypeError("invalid parameter format");
      }
      obj.parameters = params;
      return obj;
    }
    function getcontenttype(obj) {
      if (typeof obj.getHeader === "function") {
        return obj.getHeader("content-type");
      }
      if (typeof obj.headers === "object") {
        return obj.headers && obj.headers["content-type"];
      }
    }
    function qstring(val) {
      var str = String(val);
      if (tokenRegExp.test(str)) {
        return str;
      }
      if (str.length > 0 && !textRegExp.test(str)) {
        throw new TypeError("invalid parameter value");
      }
      return '"' + str.replace(quoteRegExp, "\\$1") + '"';
    }
    function splitType(string) {
      var match = typeRegExp.exec(string.toLowerCase());
      if (!match) {
        throw new TypeError("invalid media type");
      }
      var type = match[1];
      var subtype = match[2];
      var suffix;
      var index = subtype.lastIndexOf("+");
      if (index !== -1) {
        suffix = subtype.substr(index + 1);
        subtype = subtype.substr(0, index);
      }
      var obj = {
        type,
        subtype,
        suffix
      };
      return obj;
    }
  }
});

// node_modules/mime-db/db.json
var require_db = __commonJS({
  "node_modules/mime-db/db.json"(exports2, module2) {
    module2.exports = {
      "application/1d-interleaved-parityfec": {
        source: "iana"
      },
      "application/3gpdash-qoe-report+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/3gpp-ims+xml": {
        source: "iana",
        compressible: true
      },
      "application/3gpphal+json": {
        source: "iana",
        compressible: true
      },
      "application/3gpphalforms+json": {
        source: "iana",
        compressible: true
      },
      "application/a2l": {
        source: "iana"
      },
      "application/ace+cbor": {
        source: "iana"
      },
      "application/activemessage": {
        source: "iana"
      },
      "application/activity+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-costmap+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-costmapfilter+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-directory+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-endpointcost+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-endpointcostparams+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-endpointprop+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-endpointpropparams+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-error+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-networkmap+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-networkmapfilter+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-updatestreamcontrol+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-updatestreamparams+json": {
        source: "iana",
        compressible: true
      },
      "application/aml": {
        source: "iana"
      },
      "application/andrew-inset": {
        source: "iana",
        extensions: ["ez"]
      },
      "application/applefile": {
        source: "iana"
      },
      "application/applixware": {
        source: "apache",
        extensions: ["aw"]
      },
      "application/at+jwt": {
        source: "iana"
      },
      "application/atf": {
        source: "iana"
      },
      "application/atfx": {
        source: "iana"
      },
      "application/atom+xml": {
        source: "iana",
        compressible: true,
        extensions: ["atom"]
      },
      "application/atomcat+xml": {
        source: "iana",
        compressible: true,
        extensions: ["atomcat"]
      },
      "application/atomdeleted+xml": {
        source: "iana",
        compressible: true,
        extensions: ["atomdeleted"]
      },
      "application/atomicmail": {
        source: "iana"
      },
      "application/atomsvc+xml": {
        source: "iana",
        compressible: true,
        extensions: ["atomsvc"]
      },
      "application/atsc-dwd+xml": {
        source: "iana",
        compressible: true,
        extensions: ["dwd"]
      },
      "application/atsc-dynamic-event-message": {
        source: "iana"
      },
      "application/atsc-held+xml": {
        source: "iana",
        compressible: true,
        extensions: ["held"]
      },
      "application/atsc-rdt+json": {
        source: "iana",
        compressible: true
      },
      "application/atsc-rsat+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rsat"]
      },
      "application/atxml": {
        source: "iana"
      },
      "application/auth-policy+xml": {
        source: "iana",
        compressible: true
      },
      "application/bacnet-xdd+zip": {
        source: "iana",
        compressible: false
      },
      "application/batch-smtp": {
        source: "iana"
      },
      "application/bdoc": {
        compressible: false,
        extensions: ["bdoc"]
      },
      "application/beep+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/calendar+json": {
        source: "iana",
        compressible: true
      },
      "application/calendar+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xcs"]
      },
      "application/call-completion": {
        source: "iana"
      },
      "application/cals-1840": {
        source: "iana"
      },
      "application/captive+json": {
        source: "iana",
        compressible: true
      },
      "application/cbor": {
        source: "iana"
      },
      "application/cbor-seq": {
        source: "iana"
      },
      "application/cccex": {
        source: "iana"
      },
      "application/ccmp+xml": {
        source: "iana",
        compressible: true
      },
      "application/ccxml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["ccxml"]
      },
      "application/cdfx+xml": {
        source: "iana",
        compressible: true,
        extensions: ["cdfx"]
      },
      "application/cdmi-capability": {
        source: "iana",
        extensions: ["cdmia"]
      },
      "application/cdmi-container": {
        source: "iana",
        extensions: ["cdmic"]
      },
      "application/cdmi-domain": {
        source: "iana",
        extensions: ["cdmid"]
      },
      "application/cdmi-object": {
        source: "iana",
        extensions: ["cdmio"]
      },
      "application/cdmi-queue": {
        source: "iana",
        extensions: ["cdmiq"]
      },
      "application/cdni": {
        source: "iana"
      },
      "application/cea": {
        source: "iana"
      },
      "application/cea-2018+xml": {
        source: "iana",
        compressible: true
      },
      "application/cellml+xml": {
        source: "iana",
        compressible: true
      },
      "application/cfw": {
        source: "iana"
      },
      "application/city+json": {
        source: "iana",
        compressible: true
      },
      "application/clr": {
        source: "iana"
      },
      "application/clue+xml": {
        source: "iana",
        compressible: true
      },
      "application/clue_info+xml": {
        source: "iana",
        compressible: true
      },
      "application/cms": {
        source: "iana"
      },
      "application/cnrp+xml": {
        source: "iana",
        compressible: true
      },
      "application/coap-group+json": {
        source: "iana",
        compressible: true
      },
      "application/coap-payload": {
        source: "iana"
      },
      "application/commonground": {
        source: "iana"
      },
      "application/conference-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/cose": {
        source: "iana"
      },
      "application/cose-key": {
        source: "iana"
      },
      "application/cose-key-set": {
        source: "iana"
      },
      "application/cpl+xml": {
        source: "iana",
        compressible: true,
        extensions: ["cpl"]
      },
      "application/csrattrs": {
        source: "iana"
      },
      "application/csta+xml": {
        source: "iana",
        compressible: true
      },
      "application/cstadata+xml": {
        source: "iana",
        compressible: true
      },
      "application/csvm+json": {
        source: "iana",
        compressible: true
      },
      "application/cu-seeme": {
        source: "apache",
        extensions: ["cu"]
      },
      "application/cwt": {
        source: "iana"
      },
      "application/cybercash": {
        source: "iana"
      },
      "application/dart": {
        compressible: true
      },
      "application/dash+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mpd"]
      },
      "application/dash-patch+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mpp"]
      },
      "application/dashdelta": {
        source: "iana"
      },
      "application/davmount+xml": {
        source: "iana",
        compressible: true,
        extensions: ["davmount"]
      },
      "application/dca-rft": {
        source: "iana"
      },
      "application/dcd": {
        source: "iana"
      },
      "application/dec-dx": {
        source: "iana"
      },
      "application/dialog-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/dicom": {
        source: "iana"
      },
      "application/dicom+json": {
        source: "iana",
        compressible: true
      },
      "application/dicom+xml": {
        source: "iana",
        compressible: true
      },
      "application/dii": {
        source: "iana"
      },
      "application/dit": {
        source: "iana"
      },
      "application/dns": {
        source: "iana"
      },
      "application/dns+json": {
        source: "iana",
        compressible: true
      },
      "application/dns-message": {
        source: "iana"
      },
      "application/docbook+xml": {
        source: "apache",
        compressible: true,
        extensions: ["dbk"]
      },
      "application/dots+cbor": {
        source: "iana"
      },
      "application/dskpp+xml": {
        source: "iana",
        compressible: true
      },
      "application/dssc+der": {
        source: "iana",
        extensions: ["dssc"]
      },
      "application/dssc+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xdssc"]
      },
      "application/dvcs": {
        source: "iana"
      },
      "application/ecmascript": {
        source: "iana",
        compressible: true,
        extensions: ["es", "ecma"]
      },
      "application/edi-consent": {
        source: "iana"
      },
      "application/edi-x12": {
        source: "iana",
        compressible: false
      },
      "application/edifact": {
        source: "iana",
        compressible: false
      },
      "application/efi": {
        source: "iana"
      },
      "application/elm+json": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/elm+xml": {
        source: "iana",
        compressible: true
      },
      "application/emergencycalldata.cap+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/emergencycalldata.comment+xml": {
        source: "iana",
        compressible: true
      },
      "application/emergencycalldata.control+xml": {
        source: "iana",
        compressible: true
      },
      "application/emergencycalldata.deviceinfo+xml": {
        source: "iana",
        compressible: true
      },
      "application/emergencycalldata.ecall.msd": {
        source: "iana"
      },
      "application/emergencycalldata.providerinfo+xml": {
        source: "iana",
        compressible: true
      },
      "application/emergencycalldata.serviceinfo+xml": {
        source: "iana",
        compressible: true
      },
      "application/emergencycalldata.subscriberinfo+xml": {
        source: "iana",
        compressible: true
      },
      "application/emergencycalldata.veds+xml": {
        source: "iana",
        compressible: true
      },
      "application/emma+xml": {
        source: "iana",
        compressible: true,
        extensions: ["emma"]
      },
      "application/emotionml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["emotionml"]
      },
      "application/encaprtp": {
        source: "iana"
      },
      "application/epp+xml": {
        source: "iana",
        compressible: true
      },
      "application/epub+zip": {
        source: "iana",
        compressible: false,
        extensions: ["epub"]
      },
      "application/eshop": {
        source: "iana"
      },
      "application/exi": {
        source: "iana",
        extensions: ["exi"]
      },
      "application/expect-ct-report+json": {
        source: "iana",
        compressible: true
      },
      "application/express": {
        source: "iana",
        extensions: ["exp"]
      },
      "application/fastinfoset": {
        source: "iana"
      },
      "application/fastsoap": {
        source: "iana"
      },
      "application/fdt+xml": {
        source: "iana",
        compressible: true,
        extensions: ["fdt"]
      },
      "application/fhir+json": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/fhir+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/fido.trusted-apps+json": {
        compressible: true
      },
      "application/fits": {
        source: "iana"
      },
      "application/flexfec": {
        source: "iana"
      },
      "application/font-sfnt": {
        source: "iana"
      },
      "application/font-tdpfr": {
        source: "iana",
        extensions: ["pfr"]
      },
      "application/font-woff": {
        source: "iana",
        compressible: false
      },
      "application/framework-attributes+xml": {
        source: "iana",
        compressible: true
      },
      "application/geo+json": {
        source: "iana",
        compressible: true,
        extensions: ["geojson"]
      },
      "application/geo+json-seq": {
        source: "iana"
      },
      "application/geopackage+sqlite3": {
        source: "iana"
      },
      "application/geoxacml+xml": {
        source: "iana",
        compressible: true
      },
      "application/gltf-buffer": {
        source: "iana"
      },
      "application/gml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["gml"]
      },
      "application/gpx+xml": {
        source: "apache",
        compressible: true,
        extensions: ["gpx"]
      },
      "application/gxf": {
        source: "apache",
        extensions: ["gxf"]
      },
      "application/gzip": {
        source: "iana",
        compressible: false,
        extensions: ["gz"]
      },
      "application/h224": {
        source: "iana"
      },
      "application/held+xml": {
        source: "iana",
        compressible: true
      },
      "application/hjson": {
        extensions: ["hjson"]
      },
      "application/http": {
        source: "iana"
      },
      "application/hyperstudio": {
        source: "iana",
        extensions: ["stk"]
      },
      "application/ibe-key-request+xml": {
        source: "iana",
        compressible: true
      },
      "application/ibe-pkg-reply+xml": {
        source: "iana",
        compressible: true
      },
      "application/ibe-pp-data": {
        source: "iana"
      },
      "application/iges": {
        source: "iana"
      },
      "application/im-iscomposing+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/index": {
        source: "iana"
      },
      "application/index.cmd": {
        source: "iana"
      },
      "application/index.obj": {
        source: "iana"
      },
      "application/index.response": {
        source: "iana"
      },
      "application/index.vnd": {
        source: "iana"
      },
      "application/inkml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["ink", "inkml"]
      },
      "application/iotp": {
        source: "iana"
      },
      "application/ipfix": {
        source: "iana",
        extensions: ["ipfix"]
      },
      "application/ipp": {
        source: "iana"
      },
      "application/isup": {
        source: "iana"
      },
      "application/its+xml": {
        source: "iana",
        compressible: true,
        extensions: ["its"]
      },
      "application/java-archive": {
        source: "apache",
        compressible: false,
        extensions: ["jar", "war", "ear"]
      },
      "application/java-serialized-object": {
        source: "apache",
        compressible: false,
        extensions: ["ser"]
      },
      "application/java-vm": {
        source: "apache",
        compressible: false,
        extensions: ["class"]
      },
      "application/javascript": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["js", "mjs"]
      },
      "application/jf2feed+json": {
        source: "iana",
        compressible: true
      },
      "application/jose": {
        source: "iana"
      },
      "application/jose+json": {
        source: "iana",
        compressible: true
      },
      "application/jrd+json": {
        source: "iana",
        compressible: true
      },
      "application/jscalendar+json": {
        source: "iana",
        compressible: true
      },
      "application/json": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["json", "map"]
      },
      "application/json-patch+json": {
        source: "iana",
        compressible: true
      },
      "application/json-seq": {
        source: "iana"
      },
      "application/json5": {
        extensions: ["json5"]
      },
      "application/jsonml+json": {
        source: "apache",
        compressible: true,
        extensions: ["jsonml"]
      },
      "application/jwk+json": {
        source: "iana",
        compressible: true
      },
      "application/jwk-set+json": {
        source: "iana",
        compressible: true
      },
      "application/jwt": {
        source: "iana"
      },
      "application/kpml-request+xml": {
        source: "iana",
        compressible: true
      },
      "application/kpml-response+xml": {
        source: "iana",
        compressible: true
      },
      "application/ld+json": {
        source: "iana",
        compressible: true,
        extensions: ["jsonld"]
      },
      "application/lgr+xml": {
        source: "iana",
        compressible: true,
        extensions: ["lgr"]
      },
      "application/link-format": {
        source: "iana"
      },
      "application/load-control+xml": {
        source: "iana",
        compressible: true
      },
      "application/lost+xml": {
        source: "iana",
        compressible: true,
        extensions: ["lostxml"]
      },
      "application/lostsync+xml": {
        source: "iana",
        compressible: true
      },
      "application/lpf+zip": {
        source: "iana",
        compressible: false
      },
      "application/lxf": {
        source: "iana"
      },
      "application/mac-binhex40": {
        source: "iana",
        extensions: ["hqx"]
      },
      "application/mac-compactpro": {
        source: "apache",
        extensions: ["cpt"]
      },
      "application/macwriteii": {
        source: "iana"
      },
      "application/mads+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mads"]
      },
      "application/manifest+json": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["webmanifest"]
      },
      "application/marc": {
        source: "iana",
        extensions: ["mrc"]
      },
      "application/marcxml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mrcx"]
      },
      "application/mathematica": {
        source: "iana",
        extensions: ["ma", "nb", "mb"]
      },
      "application/mathml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mathml"]
      },
      "application/mathml-content+xml": {
        source: "iana",
        compressible: true
      },
      "application/mathml-presentation+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-associated-procedure-description+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-deregister+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-envelope+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-msk+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-msk-response+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-protection-description+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-reception-report+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-register+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-register-response+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-schedule+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-user-service-description+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbox": {
        source: "iana",
        extensions: ["mbox"]
      },
      "application/media-policy-dataset+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mpf"]
      },
      "application/media_control+xml": {
        source: "iana",
        compressible: true
      },
      "application/mediaservercontrol+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mscml"]
      },
      "application/merge-patch+json": {
        source: "iana",
        compressible: true
      },
      "application/metalink+xml": {
        source: "apache",
        compressible: true,
        extensions: ["metalink"]
      },
      "application/metalink4+xml": {
        source: "iana",
        compressible: true,
        extensions: ["meta4"]
      },
      "application/mets+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mets"]
      },
      "application/mf4": {
        source: "iana"
      },
      "application/mikey": {
        source: "iana"
      },
      "application/mipc": {
        source: "iana"
      },
      "application/missing-blocks+cbor-seq": {
        source: "iana"
      },
      "application/mmt-aei+xml": {
        source: "iana",
        compressible: true,
        extensions: ["maei"]
      },
      "application/mmt-usd+xml": {
        source: "iana",
        compressible: true,
        extensions: ["musd"]
      },
      "application/mods+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mods"]
      },
      "application/moss-keys": {
        source: "iana"
      },
      "application/moss-signature": {
        source: "iana"
      },
      "application/mosskey-data": {
        source: "iana"
      },
      "application/mosskey-request": {
        source: "iana"
      },
      "application/mp21": {
        source: "iana",
        extensions: ["m21", "mp21"]
      },
      "application/mp4": {
        source: "iana",
        extensions: ["mp4s", "m4p"]
      },
      "application/mpeg4-generic": {
        source: "iana"
      },
      "application/mpeg4-iod": {
        source: "iana"
      },
      "application/mpeg4-iod-xmt": {
        source: "iana"
      },
      "application/mrb-consumer+xml": {
        source: "iana",
        compressible: true
      },
      "application/mrb-publish+xml": {
        source: "iana",
        compressible: true
      },
      "application/msc-ivr+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/msc-mixer+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/msword": {
        source: "iana",
        compressible: false,
        extensions: ["doc", "dot"]
      },
      "application/mud+json": {
        source: "iana",
        compressible: true
      },
      "application/multipart-core": {
        source: "iana"
      },
      "application/mxf": {
        source: "iana",
        extensions: ["mxf"]
      },
      "application/n-quads": {
        source: "iana",
        extensions: ["nq"]
      },
      "application/n-triples": {
        source: "iana",
        extensions: ["nt"]
      },
      "application/nasdata": {
        source: "iana"
      },
      "application/news-checkgroups": {
        source: "iana",
        charset: "US-ASCII"
      },
      "application/news-groupinfo": {
        source: "iana",
        charset: "US-ASCII"
      },
      "application/news-transmission": {
        source: "iana"
      },
      "application/nlsml+xml": {
        source: "iana",
        compressible: true
      },
      "application/node": {
        source: "iana",
        extensions: ["cjs"]
      },
      "application/nss": {
        source: "iana"
      },
      "application/oauth-authz-req+jwt": {
        source: "iana"
      },
      "application/oblivious-dns-message": {
        source: "iana"
      },
      "application/ocsp-request": {
        source: "iana"
      },
      "application/ocsp-response": {
        source: "iana"
      },
      "application/octet-stream": {
        source: "iana",
        compressible: false,
        extensions: ["bin", "dms", "lrf", "mar", "so", "dist", "distz", "pkg", "bpk", "dump", "elc", "deploy", "exe", "dll", "deb", "dmg", "iso", "img", "msi", "msp", "msm", "buffer"]
      },
      "application/oda": {
        source: "iana",
        extensions: ["oda"]
      },
      "application/odm+xml": {
        source: "iana",
        compressible: true
      },
      "application/odx": {
        source: "iana"
      },
      "application/oebps-package+xml": {
        source: "iana",
        compressible: true,
        extensions: ["opf"]
      },
      "application/ogg": {
        source: "iana",
        compressible: false,
        extensions: ["ogx"]
      },
      "application/omdoc+xml": {
        source: "apache",
        compressible: true,
        extensions: ["omdoc"]
      },
      "application/onenote": {
        source: "apache",
        extensions: ["onetoc", "onetoc2", "onetmp", "onepkg"]
      },
      "application/opc-nodeset+xml": {
        source: "iana",
        compressible: true
      },
      "application/oscore": {
        source: "iana"
      },
      "application/oxps": {
        source: "iana",
        extensions: ["oxps"]
      },
      "application/p21": {
        source: "iana"
      },
      "application/p21+zip": {
        source: "iana",
        compressible: false
      },
      "application/p2p-overlay+xml": {
        source: "iana",
        compressible: true,
        extensions: ["relo"]
      },
      "application/parityfec": {
        source: "iana"
      },
      "application/passport": {
        source: "iana"
      },
      "application/patch-ops-error+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xer"]
      },
      "application/pdf": {
        source: "iana",
        compressible: false,
        extensions: ["pdf"]
      },
      "application/pdx": {
        source: "iana"
      },
      "application/pem-certificate-chain": {
        source: "iana"
      },
      "application/pgp-encrypted": {
        source: "iana",
        compressible: false,
        extensions: ["pgp"]
      },
      "application/pgp-keys": {
        source: "iana",
        extensions: ["asc"]
      },
      "application/pgp-signature": {
        source: "iana",
        extensions: ["asc", "sig"]
      },
      "application/pics-rules": {
        source: "apache",
        extensions: ["prf"]
      },
      "application/pidf+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/pidf-diff+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/pkcs10": {
        source: "iana",
        extensions: ["p10"]
      },
      "application/pkcs12": {
        source: "iana"
      },
      "application/pkcs7-mime": {
        source: "iana",
        extensions: ["p7m", "p7c"]
      },
      "application/pkcs7-signature": {
        source: "iana",
        extensions: ["p7s"]
      },
      "application/pkcs8": {
        source: "iana",
        extensions: ["p8"]
      },
      "application/pkcs8-encrypted": {
        source: "iana"
      },
      "application/pkix-attr-cert": {
        source: "iana",
        extensions: ["ac"]
      },
      "application/pkix-cert": {
        source: "iana",
        extensions: ["cer"]
      },
      "application/pkix-crl": {
        source: "iana",
        extensions: ["crl"]
      },
      "application/pkix-pkipath": {
        source: "iana",
        extensions: ["pkipath"]
      },
      "application/pkixcmp": {
        source: "iana",
        extensions: ["pki"]
      },
      "application/pls+xml": {
        source: "iana",
        compressible: true,
        extensions: ["pls"]
      },
      "application/poc-settings+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/postscript": {
        source: "iana",
        compressible: true,
        extensions: ["ai", "eps", "ps"]
      },
      "application/ppsp-tracker+json": {
        source: "iana",
        compressible: true
      },
      "application/problem+json": {
        source: "iana",
        compressible: true
      },
      "application/problem+xml": {
        source: "iana",
        compressible: true
      },
      "application/provenance+xml": {
        source: "iana",
        compressible: true,
        extensions: ["provx"]
      },
      "application/prs.alvestrand.titrax-sheet": {
        source: "iana"
      },
      "application/prs.cww": {
        source: "iana",
        extensions: ["cww"]
      },
      "application/prs.cyn": {
        source: "iana",
        charset: "7-BIT"
      },
      "application/prs.hpub+zip": {
        source: "iana",
        compressible: false
      },
      "application/prs.nprend": {
        source: "iana"
      },
      "application/prs.plucker": {
        source: "iana"
      },
      "application/prs.rdf-xml-crypt": {
        source: "iana"
      },
      "application/prs.xsf+xml": {
        source: "iana",
        compressible: true
      },
      "application/pskc+xml": {
        source: "iana",
        compressible: true,
        extensions: ["pskcxml"]
      },
      "application/pvd+json": {
        source: "iana",
        compressible: true
      },
      "application/qsig": {
        source: "iana"
      },
      "application/raml+yaml": {
        compressible: true,
        extensions: ["raml"]
      },
      "application/raptorfec": {
        source: "iana"
      },
      "application/rdap+json": {
        source: "iana",
        compressible: true
      },
      "application/rdf+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rdf", "owl"]
      },
      "application/reginfo+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rif"]
      },
      "application/relax-ng-compact-syntax": {
        source: "iana",
        extensions: ["rnc"]
      },
      "application/remote-printing": {
        source: "iana"
      },
      "application/reputon+json": {
        source: "iana",
        compressible: true
      },
      "application/resource-lists+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rl"]
      },
      "application/resource-lists-diff+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rld"]
      },
      "application/rfc+xml": {
        source: "iana",
        compressible: true
      },
      "application/riscos": {
        source: "iana"
      },
      "application/rlmi+xml": {
        source: "iana",
        compressible: true
      },
      "application/rls-services+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rs"]
      },
      "application/route-apd+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rapd"]
      },
      "application/route-s-tsid+xml": {
        source: "iana",
        compressible: true,
        extensions: ["sls"]
      },
      "application/route-usd+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rusd"]
      },
      "application/rpki-ghostbusters": {
        source: "iana",
        extensions: ["gbr"]
      },
      "application/rpki-manifest": {
        source: "iana",
        extensions: ["mft"]
      },
      "application/rpki-publication": {
        source: "iana"
      },
      "application/rpki-roa": {
        source: "iana",
        extensions: ["roa"]
      },
      "application/rpki-updown": {
        source: "iana"
      },
      "application/rsd+xml": {
        source: "apache",
        compressible: true,
        extensions: ["rsd"]
      },
      "application/rss+xml": {
        source: "apache",
        compressible: true,
        extensions: ["rss"]
      },
      "application/rtf": {
        source: "iana",
        compressible: true,
        extensions: ["rtf"]
      },
      "application/rtploopback": {
        source: "iana"
      },
      "application/rtx": {
        source: "iana"
      },
      "application/samlassertion+xml": {
        source: "iana",
        compressible: true
      },
      "application/samlmetadata+xml": {
        source: "iana",
        compressible: true
      },
      "application/sarif+json": {
        source: "iana",
        compressible: true
      },
      "application/sarif-external-properties+json": {
        source: "iana",
        compressible: true
      },
      "application/sbe": {
        source: "iana"
      },
      "application/sbml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["sbml"]
      },
      "application/scaip+xml": {
        source: "iana",
        compressible: true
      },
      "application/scim+json": {
        source: "iana",
        compressible: true
      },
      "application/scvp-cv-request": {
        source: "iana",
        extensions: ["scq"]
      },
      "application/scvp-cv-response": {
        source: "iana",
        extensions: ["scs"]
      },
      "application/scvp-vp-request": {
        source: "iana",
        extensions: ["spq"]
      },
      "application/scvp-vp-response": {
        source: "iana",
        extensions: ["spp"]
      },
      "application/sdp": {
        source: "iana",
        extensions: ["sdp"]
      },
      "application/secevent+jwt": {
        source: "iana"
      },
      "application/senml+cbor": {
        source: "iana"
      },
      "application/senml+json": {
        source: "iana",
        compressible: true
      },
      "application/senml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["senmlx"]
      },
      "application/senml-etch+cbor": {
        source: "iana"
      },
      "application/senml-etch+json": {
        source: "iana",
        compressible: true
      },
      "application/senml-exi": {
        source: "iana"
      },
      "application/sensml+cbor": {
        source: "iana"
      },
      "application/sensml+json": {
        source: "iana",
        compressible: true
      },
      "application/sensml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["sensmlx"]
      },
      "application/sensml-exi": {
        source: "iana"
      },
      "application/sep+xml": {
        source: "iana",
        compressible: true
      },
      "application/sep-exi": {
        source: "iana"
      },
      "application/session-info": {
        source: "iana"
      },
      "application/set-payment": {
        source: "iana"
      },
      "application/set-payment-initiation": {
        source: "iana",
        extensions: ["setpay"]
      },
      "application/set-registration": {
        source: "iana"
      },
      "application/set-registration-initiation": {
        source: "iana",
        extensions: ["setreg"]
      },
      "application/sgml": {
        source: "iana"
      },
      "application/sgml-open-catalog": {
        source: "iana"
      },
      "application/shf+xml": {
        source: "iana",
        compressible: true,
        extensions: ["shf"]
      },
      "application/sieve": {
        source: "iana",
        extensions: ["siv", "sieve"]
      },
      "application/simple-filter+xml": {
        source: "iana",
        compressible: true
      },
      "application/simple-message-summary": {
        source: "iana"
      },
      "application/simplesymbolcontainer": {
        source: "iana"
      },
      "application/sipc": {
        source: "iana"
      },
      "application/slate": {
        source: "iana"
      },
      "application/smil": {
        source: "iana"
      },
      "application/smil+xml": {
        source: "iana",
        compressible: true,
        extensions: ["smi", "smil"]
      },
      "application/smpte336m": {
        source: "iana"
      },
      "application/soap+fastinfoset": {
        source: "iana"
      },
      "application/soap+xml": {
        source: "iana",
        compressible: true
      },
      "application/sparql-query": {
        source: "iana",
        extensions: ["rq"]
      },
      "application/sparql-results+xml": {
        source: "iana",
        compressible: true,
        extensions: ["srx"]
      },
      "application/spdx+json": {
        source: "iana",
        compressible: true
      },
      "application/spirits-event+xml": {
        source: "iana",
        compressible: true
      },
      "application/sql": {
        source: "iana"
      },
      "application/srgs": {
        source: "iana",
        extensions: ["gram"]
      },
      "application/srgs+xml": {
        source: "iana",
        compressible: true,
        extensions: ["grxml"]
      },
      "application/sru+xml": {
        source: "iana",
        compressible: true,
        extensions: ["sru"]
      },
      "application/ssdl+xml": {
        source: "apache",
        compressible: true,
        extensions: ["ssdl"]
      },
      "application/ssml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["ssml"]
      },
      "application/stix+json": {
        source: "iana",
        compressible: true
      },
      "application/swid+xml": {
        source: "iana",
        compressible: true,
        extensions: ["swidtag"]
      },
      "application/tamp-apex-update": {
        source: "iana"
      },
      "application/tamp-apex-update-confirm": {
        source: "iana"
      },
      "application/tamp-community-update": {
        source: "iana"
      },
      "application/tamp-community-update-confirm": {
        source: "iana"
      },
      "application/tamp-error": {
        source: "iana"
      },
      "application/tamp-sequence-adjust": {
        source: "iana"
      },
      "application/tamp-sequence-adjust-confirm": {
        source: "iana"
      },
      "application/tamp-status-query": {
        source: "iana"
      },
      "application/tamp-status-response": {
        source: "iana"
      },
      "application/tamp-update": {
        source: "iana"
      },
      "application/tamp-update-confirm": {
        source: "iana"
      },
      "application/tar": {
        compressible: true
      },
      "application/taxii+json": {
        source: "iana",
        compressible: true
      },
      "application/td+json": {
        source: "iana",
        compressible: true
      },
      "application/tei+xml": {
        source: "iana",
        compressible: true,
        extensions: ["tei", "teicorpus"]
      },
      "application/tetra_isi": {
        source: "iana"
      },
      "application/thraud+xml": {
        source: "iana",
        compressible: true,
        extensions: ["tfi"]
      },
      "application/timestamp-query": {
        source: "iana"
      },
      "application/timestamp-reply": {
        source: "iana"
      },
      "application/timestamped-data": {
        source: "iana",
        extensions: ["tsd"]
      },
      "application/tlsrpt+gzip": {
        source: "iana"
      },
      "application/tlsrpt+json": {
        source: "iana",
        compressible: true
      },
      "application/tnauthlist": {
        source: "iana"
      },
      "application/token-introspection+jwt": {
        source: "iana"
      },
      "application/toml": {
        compressible: true,
        extensions: ["toml"]
      },
      "application/trickle-ice-sdpfrag": {
        source: "iana"
      },
      "application/trig": {
        source: "iana",
        extensions: ["trig"]
      },
      "application/ttml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["ttml"]
      },
      "application/tve-trigger": {
        source: "iana"
      },
      "application/tzif": {
        source: "iana"
      },
      "application/tzif-leap": {
        source: "iana"
      },
      "application/ubjson": {
        compressible: false,
        extensions: ["ubj"]
      },
      "application/ulpfec": {
        source: "iana"
      },
      "application/urc-grpsheet+xml": {
        source: "iana",
        compressible: true
      },
      "application/urc-ressheet+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rsheet"]
      },
      "application/urc-targetdesc+xml": {
        source: "iana",
        compressible: true,
        extensions: ["td"]
      },
      "application/urc-uisocketdesc+xml": {
        source: "iana",
        compressible: true
      },
      "application/vcard+json": {
        source: "iana",
        compressible: true
      },
      "application/vcard+xml": {
        source: "iana",
        compressible: true
      },
      "application/vemmi": {
        source: "iana"
      },
      "application/vividence.scriptfile": {
        source: "apache"
      },
      "application/vnd.1000minds.decision-model+xml": {
        source: "iana",
        compressible: true,
        extensions: ["1km"]
      },
      "application/vnd.3gpp-prose+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp-prose-pc3ch+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp-v2x-local-service-information": {
        source: "iana"
      },
      "application/vnd.3gpp.5gnas": {
        source: "iana"
      },
      "application/vnd.3gpp.access-transfer-events+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.bsf+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.gmop+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.gtpc": {
        source: "iana"
      },
      "application/vnd.3gpp.interworking-data": {
        source: "iana"
      },
      "application/vnd.3gpp.lpp": {
        source: "iana"
      },
      "application/vnd.3gpp.mc-signalling-ear": {
        source: "iana"
      },
      "application/vnd.3gpp.mcdata-affiliation-command+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcdata-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcdata-payload": {
        source: "iana"
      },
      "application/vnd.3gpp.mcdata-service-config+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcdata-signalling": {
        source: "iana"
      },
      "application/vnd.3gpp.mcdata-ue-config+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcdata-user-profile+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-affiliation-command+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-floor-request+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-location-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-mbms-usage-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-service-config+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-signed+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-ue-config+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-ue-init-config+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-user-profile+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-affiliation-command+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-affiliation-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-location-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-mbms-usage-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-service-config+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-transmission-request+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-ue-config+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-user-profile+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mid-call+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.ngap": {
        source: "iana"
      },
      "application/vnd.3gpp.pfcp": {
        source: "iana"
      },
      "application/vnd.3gpp.pic-bw-large": {
        source: "iana",
        extensions: ["plb"]
      },
      "application/vnd.3gpp.pic-bw-small": {
        source: "iana",
        extensions: ["psb"]
      },
      "application/vnd.3gpp.pic-bw-var": {
        source: "iana",
        extensions: ["pvb"]
      },
      "application/vnd.3gpp.s1ap": {
        source: "iana"
      },
      "application/vnd.3gpp.sms": {
        source: "iana"
      },
      "application/vnd.3gpp.sms+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.srvcc-ext+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.srvcc-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.state-and-event-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.ussd+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp2.bcmcsinfo+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp2.sms": {
        source: "iana"
      },
      "application/vnd.3gpp2.tcap": {
        source: "iana",
        extensions: ["tcap"]
      },
      "application/vnd.3lightssoftware.imagescal": {
        source: "iana"
      },
      "application/vnd.3m.post-it-notes": {
        source: "iana",
        extensions: ["pwn"]
      },
      "application/vnd.accpac.simply.aso": {
        source: "iana",
        extensions: ["aso"]
      },
      "application/vnd.accpac.simply.imp": {
        source: "iana",
        extensions: ["imp"]
      },
      "application/vnd.acucobol": {
        source: "iana",
        extensions: ["acu"]
      },
      "application/vnd.acucorp": {
        source: "iana",
        extensions: ["atc", "acutc"]
      },
      "application/vnd.adobe.air-application-installer-package+zip": {
        source: "apache",
        compressible: false,
        extensions: ["air"]
      },
      "application/vnd.adobe.flash.movie": {
        source: "iana"
      },
      "application/vnd.adobe.formscentral.fcdt": {
        source: "iana",
        extensions: ["fcdt"]
      },
      "application/vnd.adobe.fxp": {
        source: "iana",
        extensions: ["fxp", "fxpl"]
      },
      "application/vnd.adobe.partial-upload": {
        source: "iana"
      },
      "application/vnd.adobe.xdp+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xdp"]
      },
      "application/vnd.adobe.xfdf": {
        source: "iana",
        extensions: ["xfdf"]
      },
      "application/vnd.aether.imp": {
        source: "iana"
      },
      "application/vnd.afpc.afplinedata": {
        source: "iana"
      },
      "application/vnd.afpc.afplinedata-pagedef": {
        source: "iana"
      },
      "application/vnd.afpc.cmoca-cmresource": {
        source: "iana"
      },
      "application/vnd.afpc.foca-charset": {
        source: "iana"
      },
      "application/vnd.afpc.foca-codedfont": {
        source: "iana"
      },
      "application/vnd.afpc.foca-codepage": {
        source: "iana"
      },
      "application/vnd.afpc.modca": {
        source: "iana"
      },
      "application/vnd.afpc.modca-cmtable": {
        source: "iana"
      },
      "application/vnd.afpc.modca-formdef": {
        source: "iana"
      },
      "application/vnd.afpc.modca-mediummap": {
        source: "iana"
      },
      "application/vnd.afpc.modca-objectcontainer": {
        source: "iana"
      },
      "application/vnd.afpc.modca-overlay": {
        source: "iana"
      },
      "application/vnd.afpc.modca-pagesegment": {
        source: "iana"
      },
      "application/vnd.age": {
        source: "iana",
        extensions: ["age"]
      },
      "application/vnd.ah-barcode": {
        source: "iana"
      },
      "application/vnd.ahead.space": {
        source: "iana",
        extensions: ["ahead"]
      },
      "application/vnd.airzip.filesecure.azf": {
        source: "iana",
        extensions: ["azf"]
      },
      "application/vnd.airzip.filesecure.azs": {
        source: "iana",
        extensions: ["azs"]
      },
      "application/vnd.amadeus+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.amazon.ebook": {
        source: "apache",
        extensions: ["azw"]
      },
      "application/vnd.amazon.mobi8-ebook": {
        source: "iana"
      },
      "application/vnd.americandynamics.acc": {
        source: "iana",
        extensions: ["acc"]
      },
      "application/vnd.amiga.ami": {
        source: "iana",
        extensions: ["ami"]
      },
      "application/vnd.amundsen.maze+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.android.ota": {
        source: "iana"
      },
      "application/vnd.android.package-archive": {
        source: "apache",
        compressible: false,
        extensions: ["apk"]
      },
      "application/vnd.anki": {
        source: "iana"
      },
      "application/vnd.anser-web-certificate-issue-initiation": {
        source: "iana",
        extensions: ["cii"]
      },
      "application/vnd.anser-web-funds-transfer-initiation": {
        source: "apache",
        extensions: ["fti"]
      },
      "application/vnd.antix.game-component": {
        source: "iana",
        extensions: ["atx"]
      },
      "application/vnd.apache.arrow.file": {
        source: "iana"
      },
      "application/vnd.apache.arrow.stream": {
        source: "iana"
      },
      "application/vnd.apache.thrift.binary": {
        source: "iana"
      },
      "application/vnd.apache.thrift.compact": {
        source: "iana"
      },
      "application/vnd.apache.thrift.json": {
        source: "iana"
      },
      "application/vnd.api+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.aplextor.warrp+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.apothekende.reservation+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.apple.installer+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mpkg"]
      },
      "application/vnd.apple.keynote": {
        source: "iana",
        extensions: ["key"]
      },
      "application/vnd.apple.mpegurl": {
        source: "iana",
        extensions: ["m3u8"]
      },
      "application/vnd.apple.numbers": {
        source: "iana",
        extensions: ["numbers"]
      },
      "application/vnd.apple.pages": {
        source: "iana",
        extensions: ["pages"]
      },
      "application/vnd.apple.pkpass": {
        compressible: false,
        extensions: ["pkpass"]
      },
      "application/vnd.arastra.swi": {
        source: "iana"
      },
      "application/vnd.aristanetworks.swi": {
        source: "iana",
        extensions: ["swi"]
      },
      "application/vnd.artisan+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.artsquare": {
        source: "iana"
      },
      "application/vnd.astraea-software.iota": {
        source: "iana",
        extensions: ["iota"]
      },
      "application/vnd.audiograph": {
        source: "iana",
        extensions: ["aep"]
      },
      "application/vnd.autopackage": {
        source: "iana"
      },
      "application/vnd.avalon+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.avistar+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.balsamiq.bmml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["bmml"]
      },
      "application/vnd.balsamiq.bmpr": {
        source: "iana"
      },
      "application/vnd.banana-accounting": {
        source: "iana"
      },
      "application/vnd.bbf.usp.error": {
        source: "iana"
      },
      "application/vnd.bbf.usp.msg": {
        source: "iana"
      },
      "application/vnd.bbf.usp.msg+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.bekitzur-stech+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.bint.med-content": {
        source: "iana"
      },
      "application/vnd.biopax.rdf+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.blink-idb-value-wrapper": {
        source: "iana"
      },
      "application/vnd.blueice.multipass": {
        source: "iana",
        extensions: ["mpm"]
      },
      "application/vnd.bluetooth.ep.oob": {
        source: "iana"
      },
      "application/vnd.bluetooth.le.oob": {
        source: "iana"
      },
      "application/vnd.bmi": {
        source: "iana",
        extensions: ["bmi"]
      },
      "application/vnd.bpf": {
        source: "iana"
      },
      "application/vnd.bpf3": {
        source: "iana"
      },
      "application/vnd.businessobjects": {
        source: "iana",
        extensions: ["rep"]
      },
      "application/vnd.byu.uapi+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.cab-jscript": {
        source: "iana"
      },
      "application/vnd.canon-cpdl": {
        source: "iana"
      },
      "application/vnd.canon-lips": {
        source: "iana"
      },
      "application/vnd.capasystems-pg+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.cendio.thinlinc.clientconf": {
        source: "iana"
      },
      "application/vnd.century-systems.tcp_stream": {
        source: "iana"
      },
      "application/vnd.chemdraw+xml": {
        source: "iana",
        compressible: true,
        extensions: ["cdxml"]
      },
      "application/vnd.chess-pgn": {
        source: "iana"
      },
      "application/vnd.chipnuts.karaoke-mmd": {
        source: "iana",
        extensions: ["mmd"]
      },
      "application/vnd.ciedi": {
        source: "iana"
      },
      "application/vnd.cinderella": {
        source: "iana",
        extensions: ["cdy"]
      },
      "application/vnd.cirpack.isdn-ext": {
        source: "iana"
      },
      "application/vnd.citationstyles.style+xml": {
        source: "iana",
        compressible: true,
        extensions: ["csl"]
      },
      "application/vnd.claymore": {
        source: "iana",
        extensions: ["cla"]
      },
      "application/vnd.cloanto.rp9": {
        source: "iana",
        extensions: ["rp9"]
      },
      "application/vnd.clonk.c4group": {
        source: "iana",
        extensions: ["c4g", "c4d", "c4f", "c4p", "c4u"]
      },
      "application/vnd.cluetrust.cartomobile-config": {
        source: "iana",
        extensions: ["c11amc"]
      },
      "application/vnd.cluetrust.cartomobile-config-pkg": {
        source: "iana",
        extensions: ["c11amz"]
      },
      "application/vnd.coffeescript": {
        source: "iana"
      },
      "application/vnd.collabio.xodocuments.document": {
        source: "iana"
      },
      "application/vnd.collabio.xodocuments.document-template": {
        source: "iana"
      },
      "application/vnd.collabio.xodocuments.presentation": {
        source: "iana"
      },
      "application/vnd.collabio.xodocuments.presentation-template": {
        source: "iana"
      },
      "application/vnd.collabio.xodocuments.spreadsheet": {
        source: "iana"
      },
      "application/vnd.collabio.xodocuments.spreadsheet-template": {
        source: "iana"
      },
      "application/vnd.collection+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.collection.doc+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.collection.next+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.comicbook+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.comicbook-rar": {
        source: "iana"
      },
      "application/vnd.commerce-battelle": {
        source: "iana"
      },
      "application/vnd.commonspace": {
        source: "iana",
        extensions: ["csp"]
      },
      "application/vnd.contact.cmsg": {
        source: "iana",
        extensions: ["cdbcmsg"]
      },
      "application/vnd.coreos.ignition+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.cosmocaller": {
        source: "iana",
        extensions: ["cmc"]
      },
      "application/vnd.crick.clicker": {
        source: "iana",
        extensions: ["clkx"]
      },
      "application/vnd.crick.clicker.keyboard": {
        source: "iana",
        extensions: ["clkk"]
      },
      "application/vnd.crick.clicker.palette": {
        source: "iana",
        extensions: ["clkp"]
      },
      "application/vnd.crick.clicker.template": {
        source: "iana",
        extensions: ["clkt"]
      },
      "application/vnd.crick.clicker.wordbank": {
        source: "iana",
        extensions: ["clkw"]
      },
      "application/vnd.criticaltools.wbs+xml": {
        source: "iana",
        compressible: true,
        extensions: ["wbs"]
      },
      "application/vnd.cryptii.pipe+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.crypto-shade-file": {
        source: "iana"
      },
      "application/vnd.cryptomator.encrypted": {
        source: "iana"
      },
      "application/vnd.cryptomator.vault": {
        source: "iana"
      },
      "application/vnd.ctc-posml": {
        source: "iana",
        extensions: ["pml"]
      },
      "application/vnd.ctct.ws+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.cups-pdf": {
        source: "iana"
      },
      "application/vnd.cups-postscript": {
        source: "iana"
      },
      "application/vnd.cups-ppd": {
        source: "iana",
        extensions: ["ppd"]
      },
      "application/vnd.cups-raster": {
        source: "iana"
      },
      "application/vnd.cups-raw": {
        source: "iana"
      },
      "application/vnd.curl": {
        source: "iana"
      },
      "application/vnd.curl.car": {
        source: "apache",
        extensions: ["car"]
      },
      "application/vnd.curl.pcurl": {
        source: "apache",
        extensions: ["pcurl"]
      },
      "application/vnd.cyan.dean.root+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.cybank": {
        source: "iana"
      },
      "application/vnd.cyclonedx+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.cyclonedx+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.d2l.coursepackage1p0+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.d3m-dataset": {
        source: "iana"
      },
      "application/vnd.d3m-problem": {
        source: "iana"
      },
      "application/vnd.dart": {
        source: "iana",
        compressible: true,
        extensions: ["dart"]
      },
      "application/vnd.data-vision.rdz": {
        source: "iana",
        extensions: ["rdz"]
      },
      "application/vnd.datapackage+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dataresource+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dbf": {
        source: "iana",
        extensions: ["dbf"]
      },
      "application/vnd.debian.binary-package": {
        source: "iana"
      },
      "application/vnd.dece.data": {
        source: "iana",
        extensions: ["uvf", "uvvf", "uvd", "uvvd"]
      },
      "application/vnd.dece.ttml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["uvt", "uvvt"]
      },
      "application/vnd.dece.unspecified": {
        source: "iana",
        extensions: ["uvx", "uvvx"]
      },
      "application/vnd.dece.zip": {
        source: "iana",
        extensions: ["uvz", "uvvz"]
      },
      "application/vnd.denovo.fcselayout-link": {
        source: "iana",
        extensions: ["fe_launch"]
      },
      "application/vnd.desmume.movie": {
        source: "iana"
      },
      "application/vnd.dir-bi.plate-dl-nosuffix": {
        source: "iana"
      },
      "application/vnd.dm.delegation+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dna": {
        source: "iana",
        extensions: ["dna"]
      },
      "application/vnd.document+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dolby.mlp": {
        source: "apache",
        extensions: ["mlp"]
      },
      "application/vnd.dolby.mobile.1": {
        source: "iana"
      },
      "application/vnd.dolby.mobile.2": {
        source: "iana"
      },
      "application/vnd.doremir.scorecloud-binary-document": {
        source: "iana"
      },
      "application/vnd.dpgraph": {
        source: "iana",
        extensions: ["dpg"]
      },
      "application/vnd.dreamfactory": {
        source: "iana",
        extensions: ["dfac"]
      },
      "application/vnd.drive+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ds-keypoint": {
        source: "apache",
        extensions: ["kpxx"]
      },
      "application/vnd.dtg.local": {
        source: "iana"
      },
      "application/vnd.dtg.local.flash": {
        source: "iana"
      },
      "application/vnd.dtg.local.html": {
        source: "iana"
      },
      "application/vnd.dvb.ait": {
        source: "iana",
        extensions: ["ait"]
      },
      "application/vnd.dvb.dvbisl+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dvb.dvbj": {
        source: "iana"
      },
      "application/vnd.dvb.esgcontainer": {
        source: "iana"
      },
      "application/vnd.dvb.ipdcdftnotifaccess": {
        source: "iana"
      },
      "application/vnd.dvb.ipdcesgaccess": {
        source: "iana"
      },
      "application/vnd.dvb.ipdcesgaccess2": {
        source: "iana"
      },
      "application/vnd.dvb.ipdcesgpdd": {
        source: "iana"
      },
      "application/vnd.dvb.ipdcroaming": {
        source: "iana"
      },
      "application/vnd.dvb.iptv.alfec-base": {
        source: "iana"
      },
      "application/vnd.dvb.iptv.alfec-enhancement": {
        source: "iana"
      },
      "application/vnd.dvb.notif-aggregate-root+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dvb.notif-container+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dvb.notif-generic+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dvb.notif-ia-msglist+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dvb.notif-ia-registration-request+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dvb.notif-ia-registration-response+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dvb.notif-init+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dvb.pfr": {
        source: "iana"
      },
      "application/vnd.dvb.service": {
        source: "iana",
        extensions: ["svc"]
      },
      "application/vnd.dxr": {
        source: "iana"
      },
      "application/vnd.dynageo": {
        source: "iana",
        extensions: ["geo"]
      },
      "application/vnd.dzr": {
        source: "iana"
      },
      "application/vnd.easykaraoke.cdgdownload": {
        source: "iana"
      },
      "application/vnd.ecdis-update": {
        source: "iana"
      },
      "application/vnd.ecip.rlp": {
        source: "iana"
      },
      "application/vnd.eclipse.ditto+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ecowin.chart": {
        source: "iana",
        extensions: ["mag"]
      },
      "application/vnd.ecowin.filerequest": {
        source: "iana"
      },
      "application/vnd.ecowin.fileupdate": {
        source: "iana"
      },
      "application/vnd.ecowin.series": {
        source: "iana"
      },
      "application/vnd.ecowin.seriesrequest": {
        source: "iana"
      },
      "application/vnd.ecowin.seriesupdate": {
        source: "iana"
      },
      "application/vnd.efi.img": {
        source: "iana"
      },
      "application/vnd.efi.iso": {
        source: "iana"
      },
      "application/vnd.emclient.accessrequest+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.enliven": {
        source: "iana",
        extensions: ["nml"]
      },
      "application/vnd.enphase.envoy": {
        source: "iana"
      },
      "application/vnd.eprints.data+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.epson.esf": {
        source: "iana",
        extensions: ["esf"]
      },
      "application/vnd.epson.msf": {
        source: "iana",
        extensions: ["msf"]
      },
      "application/vnd.epson.quickanime": {
        source: "iana",
        extensions: ["qam"]
      },
      "application/vnd.epson.salt": {
        source: "iana",
        extensions: ["slt"]
      },
      "application/vnd.epson.ssf": {
        source: "iana",
        extensions: ["ssf"]
      },
      "application/vnd.ericsson.quickcall": {
        source: "iana"
      },
      "application/vnd.espass-espass+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.eszigno3+xml": {
        source: "iana",
        compressible: true,
        extensions: ["es3", "et3"]
      },
      "application/vnd.etsi.aoc+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.asic-e+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.etsi.asic-s+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.etsi.cug+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvcommand+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvdiscovery+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvprofile+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvsad-bc+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvsad-cod+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvsad-npvr+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvservice+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvsync+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvueprofile+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.mcid+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.mheg5": {
        source: "iana"
      },
      "application/vnd.etsi.overload-control-policy-dataset+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.pstn+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.sci+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.simservs+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.timestamp-token": {
        source: "iana"
      },
      "application/vnd.etsi.tsl+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.tsl.der": {
        source: "iana"
      },
      "application/vnd.eu.kasparian.car+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.eudora.data": {
        source: "iana"
      },
      "application/vnd.evolv.ecig.profile": {
        source: "iana"
      },
      "application/vnd.evolv.ecig.settings": {
        source: "iana"
      },
      "application/vnd.evolv.ecig.theme": {
        source: "iana"
      },
      "application/vnd.exstream-empower+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.exstream-package": {
        source: "iana"
      },
      "application/vnd.ezpix-album": {
        source: "iana",
        extensions: ["ez2"]
      },
      "application/vnd.ezpix-package": {
        source: "iana",
        extensions: ["ez3"]
      },
      "application/vnd.f-secure.mobile": {
        source: "iana"
      },
      "application/vnd.familysearch.gedcom+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.fastcopy-disk-image": {
        source: "iana"
      },
      "application/vnd.fdf": {
        source: "iana",
        extensions: ["fdf"]
      },
      "application/vnd.fdsn.mseed": {
        source: "iana",
        extensions: ["mseed"]
      },
      "application/vnd.fdsn.seed": {
        source: "iana",
        extensions: ["seed", "dataless"]
      },
      "application/vnd.ffsns": {
        source: "iana"
      },
      "application/vnd.ficlab.flb+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.filmit.zfc": {
        source: "iana"
      },
      "application/vnd.fints": {
        source: "iana"
      },
      "application/vnd.firemonkeys.cloudcell": {
        source: "iana"
      },
      "application/vnd.flographit": {
        source: "iana",
        extensions: ["gph"]
      },
      "application/vnd.fluxtime.clip": {
        source: "iana",
        extensions: ["ftc"]
      },
      "application/vnd.font-fontforge-sfd": {
        source: "iana"
      },
      "application/vnd.framemaker": {
        source: "iana",
        extensions: ["fm", "frame", "maker", "book"]
      },
      "application/vnd.frogans.fnc": {
        source: "iana",
        extensions: ["fnc"]
      },
      "application/vnd.frogans.ltf": {
        source: "iana",
        extensions: ["ltf"]
      },
      "application/vnd.fsc.weblaunch": {
        source: "iana",
        extensions: ["fsc"]
      },
      "application/vnd.fujifilm.fb.docuworks": {
        source: "iana"
      },
      "application/vnd.fujifilm.fb.docuworks.binder": {
        source: "iana"
      },
      "application/vnd.fujifilm.fb.docuworks.container": {
        source: "iana"
      },
      "application/vnd.fujifilm.fb.jfi+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.fujitsu.oasys": {
        source: "iana",
        extensions: ["oas"]
      },
      "application/vnd.fujitsu.oasys2": {
        source: "iana",
        extensions: ["oa2"]
      },
      "application/vnd.fujitsu.oasys3": {
        source: "iana",
        extensions: ["oa3"]
      },
      "application/vnd.fujitsu.oasysgp": {
        source: "iana",
        extensions: ["fg5"]
      },
      "application/vnd.fujitsu.oasysprs": {
        source: "iana",
        extensions: ["bh2"]
      },
      "application/vnd.fujixerox.art-ex": {
        source: "iana"
      },
      "application/vnd.fujixerox.art4": {
        source: "iana"
      },
      "application/vnd.fujixerox.ddd": {
        source: "iana",
        extensions: ["ddd"]
      },
      "application/vnd.fujixerox.docuworks": {
        source: "iana",
        extensions: ["xdw"]
      },
      "application/vnd.fujixerox.docuworks.binder": {
        source: "iana",
        extensions: ["xbd"]
      },
      "application/vnd.fujixerox.docuworks.container": {
        source: "iana"
      },
      "application/vnd.fujixerox.hbpl": {
        source: "iana"
      },
      "application/vnd.fut-misnet": {
        source: "iana"
      },
      "application/vnd.futoin+cbor": {
        source: "iana"
      },
      "application/vnd.futoin+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.fuzzysheet": {
        source: "iana",
        extensions: ["fzs"]
      },
      "application/vnd.genomatix.tuxedo": {
        source: "iana",
        extensions: ["txd"]
      },
      "application/vnd.gentics.grd+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.geo+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.geocube+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.geogebra.file": {
        source: "iana",
        extensions: ["ggb"]
      },
      "application/vnd.geogebra.slides": {
        source: "iana"
      },
      "application/vnd.geogebra.tool": {
        source: "iana",
        extensions: ["ggt"]
      },
      "application/vnd.geometry-explorer": {
        source: "iana",
        extensions: ["gex", "gre"]
      },
      "application/vnd.geonext": {
        source: "iana",
        extensions: ["gxt"]
      },
      "application/vnd.geoplan": {
        source: "iana",
        extensions: ["g2w"]
      },
      "application/vnd.geospace": {
        source: "iana",
        extensions: ["g3w"]
      },
      "application/vnd.gerber": {
        source: "iana"
      },
      "application/vnd.globalplatform.card-content-mgt": {
        source: "iana"
      },
      "application/vnd.globalplatform.card-content-mgt-response": {
        source: "iana"
      },
      "application/vnd.gmx": {
        source: "iana",
        extensions: ["gmx"]
      },
      "application/vnd.google-apps.document": {
        compressible: false,
        extensions: ["gdoc"]
      },
      "application/vnd.google-apps.presentation": {
        compressible: false,
        extensions: ["gslides"]
      },
      "application/vnd.google-apps.spreadsheet": {
        compressible: false,
        extensions: ["gsheet"]
      },
      "application/vnd.google-earth.kml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["kml"]
      },
      "application/vnd.google-earth.kmz": {
        source: "iana",
        compressible: false,
        extensions: ["kmz"]
      },
      "application/vnd.gov.sk.e-form+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.gov.sk.e-form+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.gov.sk.xmldatacontainer+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.grafeq": {
        source: "iana",
        extensions: ["gqf", "gqs"]
      },
      "application/vnd.gridmp": {
        source: "iana"
      },
      "application/vnd.groove-account": {
        source: "iana",
        extensions: ["gac"]
      },
      "application/vnd.groove-help": {
        source: "iana",
        extensions: ["ghf"]
      },
      "application/vnd.groove-identity-message": {
        source: "iana",
        extensions: ["gim"]
      },
      "application/vnd.groove-injector": {
        source: "iana",
        extensions: ["grv"]
      },
      "application/vnd.groove-tool-message": {
        source: "iana",
        extensions: ["gtm"]
      },
      "application/vnd.groove-tool-template": {
        source: "iana",
        extensions: ["tpl"]
      },
      "application/vnd.groove-vcard": {
        source: "iana",
        extensions: ["vcg"]
      },
      "application/vnd.hal+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.hal+xml": {
        source: "iana",
        compressible: true,
        extensions: ["hal"]
      },
      "application/vnd.handheld-entertainment+xml": {
        source: "iana",
        compressible: true,
        extensions: ["zmm"]
      },
      "application/vnd.hbci": {
        source: "iana",
        extensions: ["hbci"]
      },
      "application/vnd.hc+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.hcl-bireports": {
        source: "iana"
      },
      "application/vnd.hdt": {
        source: "iana"
      },
      "application/vnd.heroku+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.hhe.lesson-player": {
        source: "iana",
        extensions: ["les"]
      },
      "application/vnd.hl7cda+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/vnd.hl7v2+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/vnd.hp-hpgl": {
        source: "iana",
        extensions: ["hpgl"]
      },
      "application/vnd.hp-hpid": {
        source: "iana",
        extensions: ["hpid"]
      },
      "application/vnd.hp-hps": {
        source: "iana",
        extensions: ["hps"]
      },
      "application/vnd.hp-jlyt": {
        source: "iana",
        extensions: ["jlt"]
      },
      "application/vnd.hp-pcl": {
        source: "iana",
        extensions: ["pcl"]
      },
      "application/vnd.hp-pclxl": {
        source: "iana",
        extensions: ["pclxl"]
      },
      "application/vnd.httphone": {
        source: "iana"
      },
      "application/vnd.hydrostatix.sof-data": {
        source: "iana",
        extensions: ["sfd-hdstx"]
      },
      "application/vnd.hyper+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.hyper-item+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.hyperdrive+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.hzn-3d-crossword": {
        source: "iana"
      },
      "application/vnd.ibm.afplinedata": {
        source: "iana"
      },
      "application/vnd.ibm.electronic-media": {
        source: "iana"
      },
      "application/vnd.ibm.minipay": {
        source: "iana",
        extensions: ["mpy"]
      },
      "application/vnd.ibm.modcap": {
        source: "iana",
        extensions: ["afp", "listafp", "list3820"]
      },
      "application/vnd.ibm.rights-management": {
        source: "iana",
        extensions: ["irm"]
      },
      "application/vnd.ibm.secure-container": {
        source: "iana",
        extensions: ["sc"]
      },
      "application/vnd.iccprofile": {
        source: "iana",
        extensions: ["icc", "icm"]
      },
      "application/vnd.ieee.1905": {
        source: "iana"
      },
      "application/vnd.igloader": {
        source: "iana",
        extensions: ["igl"]
      },
      "application/vnd.imagemeter.folder+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.imagemeter.image+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.immervision-ivp": {
        source: "iana",
        extensions: ["ivp"]
      },
      "application/vnd.immervision-ivu": {
        source: "iana",
        extensions: ["ivu"]
      },
      "application/vnd.ims.imsccv1p1": {
        source: "iana"
      },
      "application/vnd.ims.imsccv1p2": {
        source: "iana"
      },
      "application/vnd.ims.imsccv1p3": {
        source: "iana"
      },
      "application/vnd.ims.lis.v2.result+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ims.lti.v2.toolconsumerprofile+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ims.lti.v2.toolproxy+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ims.lti.v2.toolproxy.id+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ims.lti.v2.toolsettings+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ims.lti.v2.toolsettings.simple+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.informedcontrol.rms+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.informix-visionary": {
        source: "iana"
      },
      "application/vnd.infotech.project": {
        source: "iana"
      },
      "application/vnd.infotech.project+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.innopath.wamp.notification": {
        source: "iana"
      },
      "application/vnd.insors.igm": {
        source: "iana",
        extensions: ["igm"]
      },
      "application/vnd.intercon.formnet": {
        source: "iana",
        extensions: ["xpw", "xpx"]
      },
      "application/vnd.intergeo": {
        source: "iana",
        extensions: ["i2g"]
      },
      "application/vnd.intertrust.digibox": {
        source: "iana"
      },
      "application/vnd.intertrust.nncp": {
        source: "iana"
      },
      "application/vnd.intu.qbo": {
        source: "iana",
        extensions: ["qbo"]
      },
      "application/vnd.intu.qfx": {
        source: "iana",
        extensions: ["qfx"]
      },
      "application/vnd.iptc.g2.catalogitem+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.iptc.g2.conceptitem+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.iptc.g2.knowledgeitem+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.iptc.g2.newsitem+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.iptc.g2.newsmessage+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.iptc.g2.packageitem+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.iptc.g2.planningitem+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ipunplugged.rcprofile": {
        source: "iana",
        extensions: ["rcprofile"]
      },
      "application/vnd.irepository.package+xml": {
        source: "iana",
        compressible: true,
        extensions: ["irp"]
      },
      "application/vnd.is-xpr": {
        source: "iana",
        extensions: ["xpr"]
      },
      "application/vnd.isac.fcs": {
        source: "iana",
        extensions: ["fcs"]
      },
      "application/vnd.iso11783-10+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.jam": {
        source: "iana",
        extensions: ["jam"]
      },
      "application/vnd.japannet-directory-service": {
        source: "iana"
      },
      "application/vnd.japannet-jpnstore-wakeup": {
        source: "iana"
      },
      "application/vnd.japannet-payment-wakeup": {
        source: "iana"
      },
      "application/vnd.japannet-registration": {
        source: "iana"
      },
      "application/vnd.japannet-registration-wakeup": {
        source: "iana"
      },
      "application/vnd.japannet-setstore-wakeup": {
        source: "iana"
      },
      "application/vnd.japannet-verification": {
        source: "iana"
      },
      "application/vnd.japannet-verification-wakeup": {
        source: "iana"
      },
      "application/vnd.jcp.javame.midlet-rms": {
        source: "iana",
        extensions: ["rms"]
      },
      "application/vnd.jisp": {
        source: "iana",
        extensions: ["jisp"]
      },
      "application/vnd.joost.joda-archive": {
        source: "iana",
        extensions: ["joda"]
      },
      "application/vnd.jsk.isdn-ngn": {
        source: "iana"
      },
      "application/vnd.kahootz": {
        source: "iana",
        extensions: ["ktz", "ktr"]
      },
      "application/vnd.kde.karbon": {
        source: "iana",
        extensions: ["karbon"]
      },
      "application/vnd.kde.kchart": {
        source: "iana",
        extensions: ["chrt"]
      },
      "application/vnd.kde.kformula": {
        source: "iana",
        extensions: ["kfo"]
      },
      "application/vnd.kde.kivio": {
        source: "iana",
        extensions: ["flw"]
      },
      "application/vnd.kde.kontour": {
        source: "iana",
        extensions: ["kon"]
      },
      "application/vnd.kde.kpresenter": {
        source: "iana",
        extensions: ["kpr", "kpt"]
      },
      "application/vnd.kde.kspread": {
        source: "iana",
        extensions: ["ksp"]
      },
      "application/vnd.kde.kword": {
        source: "iana",
        extensions: ["kwd", "kwt"]
      },
      "application/vnd.kenameaapp": {
        source: "iana",
        extensions: ["htke"]
      },
      "application/vnd.kidspiration": {
        source: "iana",
        extensions: ["kia"]
      },
      "application/vnd.kinar": {
        source: "iana",
        extensions: ["kne", "knp"]
      },
      "application/vnd.koan": {
        source: "iana",
        extensions: ["skp", "skd", "skt", "skm"]
      },
      "application/vnd.kodak-descriptor": {
        source: "iana",
        extensions: ["sse"]
      },
      "application/vnd.las": {
        source: "iana"
      },
      "application/vnd.las.las+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.las.las+xml": {
        source: "iana",
        compressible: true,
        extensions: ["lasxml"]
      },
      "application/vnd.laszip": {
        source: "iana"
      },
      "application/vnd.leap+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.liberty-request+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.llamagraphics.life-balance.desktop": {
        source: "iana",
        extensions: ["lbd"]
      },
      "application/vnd.llamagraphics.life-balance.exchange+xml": {
        source: "iana",
        compressible: true,
        extensions: ["lbe"]
      },
      "application/vnd.logipipe.circuit+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.loom": {
        source: "iana"
      },
      "application/vnd.lotus-1-2-3": {
        source: "iana",
        extensions: ["123"]
      },
      "application/vnd.lotus-approach": {
        source: "iana",
        extensions: ["apr"]
      },
      "application/vnd.lotus-freelance": {
        source: "iana",
        extensions: ["pre"]
      },
      "application/vnd.lotus-notes": {
        source: "iana",
        extensions: ["nsf"]
      },
      "application/vnd.lotus-organizer": {
        source: "iana",
        extensions: ["org"]
      },
      "application/vnd.lotus-screencam": {
        source: "iana",
        extensions: ["scm"]
      },
      "application/vnd.lotus-wordpro": {
        source: "iana",
        extensions: ["lwp"]
      },
      "application/vnd.macports.portpkg": {
        source: "iana",
        extensions: ["portpkg"]
      },
      "application/vnd.mapbox-vector-tile": {
        source: "iana",
        extensions: ["mvt"]
      },
      "application/vnd.marlin.drm.actiontoken+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.marlin.drm.conftoken+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.marlin.drm.license+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.marlin.drm.mdcf": {
        source: "iana"
      },
      "application/vnd.mason+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.maxar.archive.3tz+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.maxmind.maxmind-db": {
        source: "iana"
      },
      "application/vnd.mcd": {
        source: "iana",
        extensions: ["mcd"]
      },
      "application/vnd.medcalcdata": {
        source: "iana",
        extensions: ["mc1"]
      },
      "application/vnd.mediastation.cdkey": {
        source: "iana",
        extensions: ["cdkey"]
      },
      "application/vnd.meridian-slingshot": {
        source: "iana"
      },
      "application/vnd.mfer": {
        source: "iana",
        extensions: ["mwf"]
      },
      "application/vnd.mfmp": {
        source: "iana",
        extensions: ["mfm"]
      },
      "application/vnd.micro+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.micrografx.flo": {
        source: "iana",
        extensions: ["flo"]
      },
      "application/vnd.micrografx.igx": {
        source: "iana",
        extensions: ["igx"]
      },
      "application/vnd.microsoft.portable-executable": {
        source: "iana"
      },
      "application/vnd.microsoft.windows.thumbnail-cache": {
        source: "iana"
      },
      "application/vnd.miele+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.mif": {
        source: "iana",
        extensions: ["mif"]
      },
      "application/vnd.minisoft-hp3000-save": {
        source: "iana"
      },
      "application/vnd.mitsubishi.misty-guard.trustweb": {
        source: "iana"
      },
      "application/vnd.mobius.daf": {
        source: "iana",
        extensions: ["daf"]
      },
      "application/vnd.mobius.dis": {
        source: "iana",
        extensions: ["dis"]
      },
      "application/vnd.mobius.mbk": {
        source: "iana",
        extensions: ["mbk"]
      },
      "application/vnd.mobius.mqy": {
        source: "iana",
        extensions: ["mqy"]
      },
      "application/vnd.mobius.msl": {
        source: "iana",
        extensions: ["msl"]
      },
      "application/vnd.mobius.plc": {
        source: "iana",
        extensions: ["plc"]
      },
      "application/vnd.mobius.txf": {
        source: "iana",
        extensions: ["txf"]
      },
      "application/vnd.mophun.application": {
        source: "iana",
        extensions: ["mpn"]
      },
      "application/vnd.mophun.certificate": {
        source: "iana",
        extensions: ["mpc"]
      },
      "application/vnd.motorola.flexsuite": {
        source: "iana"
      },
      "application/vnd.motorola.flexsuite.adsi": {
        source: "iana"
      },
      "application/vnd.motorola.flexsuite.fis": {
        source: "iana"
      },
      "application/vnd.motorola.flexsuite.gotap": {
        source: "iana"
      },
      "application/vnd.motorola.flexsuite.kmr": {
        source: "iana"
      },
      "application/vnd.motorola.flexsuite.ttc": {
        source: "iana"
      },
      "application/vnd.motorola.flexsuite.wem": {
        source: "iana"
      },
      "application/vnd.motorola.iprm": {
        source: "iana"
      },
      "application/vnd.mozilla.xul+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xul"]
      },
      "application/vnd.ms-3mfdocument": {
        source: "iana"
      },
      "application/vnd.ms-artgalry": {
        source: "iana",
        extensions: ["cil"]
      },
      "application/vnd.ms-asf": {
        source: "iana"
      },
      "application/vnd.ms-cab-compressed": {
        source: "iana",
        extensions: ["cab"]
      },
      "application/vnd.ms-color.iccprofile": {
        source: "apache"
      },
      "application/vnd.ms-excel": {
        source: "iana",
        compressible: false,
        extensions: ["xls", "xlm", "xla", "xlc", "xlt", "xlw"]
      },
      "application/vnd.ms-excel.addin.macroenabled.12": {
        source: "iana",
        extensions: ["xlam"]
      },
      "application/vnd.ms-excel.sheet.binary.macroenabled.12": {
        source: "iana",
        extensions: ["xlsb"]
      },
      "application/vnd.ms-excel.sheet.macroenabled.12": {
        source: "iana",
        extensions: ["xlsm"]
      },
      "application/vnd.ms-excel.template.macroenabled.12": {
        source: "iana",
        extensions: ["xltm"]
      },
      "application/vnd.ms-fontobject": {
        source: "iana",
        compressible: true,
        extensions: ["eot"]
      },
      "application/vnd.ms-htmlhelp": {
        source: "iana",
        extensions: ["chm"]
      },
      "application/vnd.ms-ims": {
        source: "iana",
        extensions: ["ims"]
      },
      "application/vnd.ms-lrm": {
        source: "iana",
        extensions: ["lrm"]
      },
      "application/vnd.ms-office.activex+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ms-officetheme": {
        source: "iana",
        extensions: ["thmx"]
      },
      "application/vnd.ms-opentype": {
        source: "apache",
        compressible: true
      },
      "application/vnd.ms-outlook": {
        compressible: false,
        extensions: ["msg"]
      },
      "application/vnd.ms-package.obfuscated-opentype": {
        source: "apache"
      },
      "application/vnd.ms-pki.seccat": {
        source: "apache",
        extensions: ["cat"]
      },
      "application/vnd.ms-pki.stl": {
        source: "apache",
        extensions: ["stl"]
      },
      "application/vnd.ms-playready.initiator+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ms-powerpoint": {
        source: "iana",
        compressible: false,
        extensions: ["ppt", "pps", "pot"]
      },
      "application/vnd.ms-powerpoint.addin.macroenabled.12": {
        source: "iana",
        extensions: ["ppam"]
      },
      "application/vnd.ms-powerpoint.presentation.macroenabled.12": {
        source: "iana",
        extensions: ["pptm"]
      },
      "application/vnd.ms-powerpoint.slide.macroenabled.12": {
        source: "iana",
        extensions: ["sldm"]
      },
      "application/vnd.ms-powerpoint.slideshow.macroenabled.12": {
        source: "iana",
        extensions: ["ppsm"]
      },
      "application/vnd.ms-powerpoint.template.macroenabled.12": {
        source: "iana",
        extensions: ["potm"]
      },
      "application/vnd.ms-printdevicecapabilities+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ms-printing.printticket+xml": {
        source: "apache",
        compressible: true
      },
      "application/vnd.ms-printschematicket+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ms-project": {
        source: "iana",
        extensions: ["mpp", "mpt"]
      },
      "application/vnd.ms-tnef": {
        source: "iana"
      },
      "application/vnd.ms-windows.devicepairing": {
        source: "iana"
      },
      "application/vnd.ms-windows.nwprinting.oob": {
        source: "iana"
      },
      "application/vnd.ms-windows.printerpairing": {
        source: "iana"
      },
      "application/vnd.ms-windows.wsd.oob": {
        source: "iana"
      },
      "application/vnd.ms-wmdrm.lic-chlg-req": {
        source: "iana"
      },
      "application/vnd.ms-wmdrm.lic-resp": {
        source: "iana"
      },
      "application/vnd.ms-wmdrm.meter-chlg-req": {
        source: "iana"
      },
      "application/vnd.ms-wmdrm.meter-resp": {
        source: "iana"
      },
      "application/vnd.ms-word.document.macroenabled.12": {
        source: "iana",
        extensions: ["docm"]
      },
      "application/vnd.ms-word.template.macroenabled.12": {
        source: "iana",
        extensions: ["dotm"]
      },
      "application/vnd.ms-works": {
        source: "iana",
        extensions: ["wps", "wks", "wcm", "wdb"]
      },
      "application/vnd.ms-wpl": {
        source: "iana",
        extensions: ["wpl"]
      },
      "application/vnd.ms-xpsdocument": {
        source: "iana",
        compressible: false,
        extensions: ["xps"]
      },
      "application/vnd.msa-disk-image": {
        source: "iana"
      },
      "application/vnd.mseq": {
        source: "iana",
        extensions: ["mseq"]
      },
      "application/vnd.msign": {
        source: "iana"
      },
      "application/vnd.multiad.creator": {
        source: "iana"
      },
      "application/vnd.multiad.creator.cif": {
        source: "iana"
      },
      "application/vnd.music-niff": {
        source: "iana"
      },
      "application/vnd.musician": {
        source: "iana",
        extensions: ["mus"]
      },
      "application/vnd.muvee.style": {
        source: "iana",
        extensions: ["msty"]
      },
      "application/vnd.mynfc": {
        source: "iana",
        extensions: ["taglet"]
      },
      "application/vnd.nacamar.ybrid+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ncd.control": {
        source: "iana"
      },
      "application/vnd.ncd.reference": {
        source: "iana"
      },
      "application/vnd.nearst.inv+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.nebumind.line": {
        source: "iana"
      },
      "application/vnd.nervana": {
        source: "iana"
      },
      "application/vnd.netfpx": {
        source: "iana"
      },
      "application/vnd.neurolanguage.nlu": {
        source: "iana",
        extensions: ["nlu"]
      },
      "application/vnd.nimn": {
        source: "iana"
      },
      "application/vnd.nintendo.nitro.rom": {
        source: "iana"
      },
      "application/vnd.nintendo.snes.rom": {
        source: "iana"
      },
      "application/vnd.nitf": {
        source: "iana",
        extensions: ["ntf", "nitf"]
      },
      "application/vnd.noblenet-directory": {
        source: "iana",
        extensions: ["nnd"]
      },
      "application/vnd.noblenet-sealer": {
        source: "iana",
        extensions: ["nns"]
      },
      "application/vnd.noblenet-web": {
        source: "iana",
        extensions: ["nnw"]
      },
      "application/vnd.nokia.catalogs": {
        source: "iana"
      },
      "application/vnd.nokia.conml+wbxml": {
        source: "iana"
      },
      "application/vnd.nokia.conml+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.nokia.iptv.config+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.nokia.isds-radio-presets": {
        source: "iana"
      },
      "application/vnd.nokia.landmark+wbxml": {
        source: "iana"
      },
      "application/vnd.nokia.landmark+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.nokia.landmarkcollection+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.nokia.n-gage.ac+xml": {
        source: "iana",
        compressible: true,
        extensions: ["ac"]
      },
      "application/vnd.nokia.n-gage.data": {
        source: "iana",
        extensions: ["ngdat"]
      },
      "application/vnd.nokia.n-gage.symbian.install": {
        source: "iana",
        extensions: ["n-gage"]
      },
      "application/vnd.nokia.ncd": {
        source: "iana"
      },
      "application/vnd.nokia.pcd+wbxml": {
        source: "iana"
      },
      "application/vnd.nokia.pcd+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.nokia.radio-preset": {
        source: "iana",
        extensions: ["rpst"]
      },
      "application/vnd.nokia.radio-presets": {
        source: "iana",
        extensions: ["rpss"]
      },
      "application/vnd.novadigm.edm": {
        source: "iana",
        extensions: ["edm"]
      },
      "application/vnd.novadigm.edx": {
        source: "iana",
        extensions: ["edx"]
      },
      "application/vnd.novadigm.ext": {
        source: "iana",
        extensions: ["ext"]
      },
      "application/vnd.ntt-local.content-share": {
        source: "iana"
      },
      "application/vnd.ntt-local.file-transfer": {
        source: "iana"
      },
      "application/vnd.ntt-local.ogw_remote-access": {
        source: "iana"
      },
      "application/vnd.ntt-local.sip-ta_remote": {
        source: "iana"
      },
      "application/vnd.ntt-local.sip-ta_tcp_stream": {
        source: "iana"
      },
      "application/vnd.oasis.opendocument.chart": {
        source: "iana",
        extensions: ["odc"]
      },
      "application/vnd.oasis.opendocument.chart-template": {
        source: "iana",
        extensions: ["otc"]
      },
      "application/vnd.oasis.opendocument.database": {
        source: "iana",
        extensions: ["odb"]
      },
      "application/vnd.oasis.opendocument.formula": {
        source: "iana",
        extensions: ["odf"]
      },
      "application/vnd.oasis.opendocument.formula-template": {
        source: "iana",
        extensions: ["odft"]
      },
      "application/vnd.oasis.opendocument.graphics": {
        source: "iana",
        compressible: false,
        extensions: ["odg"]
      },
      "application/vnd.oasis.opendocument.graphics-template": {
        source: "iana",
        extensions: ["otg"]
      },
      "application/vnd.oasis.opendocument.image": {
        source: "iana",
        extensions: ["odi"]
      },
      "application/vnd.oasis.opendocument.image-template": {
        source: "iana",
        extensions: ["oti"]
      },
      "application/vnd.oasis.opendocument.presentation": {
        source: "iana",
        compressible: false,
        extensions: ["odp"]
      },
      "application/vnd.oasis.opendocument.presentation-template": {
        source: "iana",
        extensions: ["otp"]
      },
      "application/vnd.oasis.opendocument.spreadsheet": {
        source: "iana",
        compressible: false,
        extensions: ["ods"]
      },
      "application/vnd.oasis.opendocument.spreadsheet-template": {
        source: "iana",
        extensions: ["ots"]
      },
      "application/vnd.oasis.opendocument.text": {
        source: "iana",
        compressible: false,
        extensions: ["odt"]
      },
      "application/vnd.oasis.opendocument.text-master": {
        source: "iana",
        extensions: ["odm"]
      },
      "application/vnd.oasis.opendocument.text-template": {
        source: "iana",
        extensions: ["ott"]
      },
      "application/vnd.oasis.opendocument.text-web": {
        source: "iana",
        extensions: ["oth"]
      },
      "application/vnd.obn": {
        source: "iana"
      },
      "application/vnd.ocf+cbor": {
        source: "iana"
      },
      "application/vnd.oci.image.manifest.v1+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oftn.l10n+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.contentaccessdownload+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.contentaccessstreaming+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.cspg-hexbinary": {
        source: "iana"
      },
      "application/vnd.oipf.dae.svg+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.dae.xhtml+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.mippvcontrolmessage+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.pae.gem": {
        source: "iana"
      },
      "application/vnd.oipf.spdiscovery+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.spdlist+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.ueprofile+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.userprofile+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.olpc-sugar": {
        source: "iana",
        extensions: ["xo"]
      },
      "application/vnd.oma-scws-config": {
        source: "iana"
      },
      "application/vnd.oma-scws-http-request": {
        source: "iana"
      },
      "application/vnd.oma-scws-http-response": {
        source: "iana"
      },
      "application/vnd.oma.bcast.associated-procedure-parameter+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.bcast.drm-trigger+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.bcast.imd+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.bcast.ltkm": {
        source: "iana"
      },
      "application/vnd.oma.bcast.notification+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.bcast.provisioningtrigger": {
        source: "iana"
      },
      "application/vnd.oma.bcast.sgboot": {
        source: "iana"
      },
      "application/vnd.oma.bcast.sgdd+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.bcast.sgdu": {
        source: "iana"
      },
      "application/vnd.oma.bcast.simple-symbol-container": {
        source: "iana"
      },
      "application/vnd.oma.bcast.smartcard-trigger+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.bcast.sprov+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.bcast.stkm": {
        source: "iana"
      },
      "application/vnd.oma.cab-address-book+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.cab-feature-handler+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.cab-pcc+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.cab-subs-invite+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.cab-user-prefs+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.dcd": {
        source: "iana"
      },
      "application/vnd.oma.dcdc": {
        source: "iana"
      },
      "application/vnd.oma.dd2+xml": {
        source: "iana",
        compressible: true,
        extensions: ["dd2"]
      },
      "application/vnd.oma.drm.risd+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.group-usage-list+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.lwm2m+cbor": {
        source: "iana"
      },
      "application/vnd.oma.lwm2m+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.lwm2m+tlv": {
        source: "iana"
      },
      "application/vnd.oma.pal+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.poc.detailed-progress-report+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.poc.final-report+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.poc.groups+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.poc.invocation-descriptor+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.poc.optimized-progress-report+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.push": {
        source: "iana"
      },
      "application/vnd.oma.scidm.messages+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.xcap-directory+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.omads-email+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/vnd.omads-file+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/vnd.omads-folder+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/vnd.omaloc-supl-init": {
        source: "iana"
      },
      "application/vnd.onepager": {
        source: "iana"
      },
      "application/vnd.onepagertamp": {
        source: "iana"
      },
      "application/vnd.onepagertamx": {
        source: "iana"
      },
      "application/vnd.onepagertat": {
        source: "iana"
      },
      "application/vnd.onepagertatp": {
        source: "iana"
      },
      "application/vnd.onepagertatx": {
        source: "iana"
      },
      "application/vnd.openblox.game+xml": {
        source: "iana",
        compressible: true,
        extensions: ["obgx"]
      },
      "application/vnd.openblox.game-binary": {
        source: "iana"
      },
      "application/vnd.openeye.oeb": {
        source: "iana"
      },
      "application/vnd.openofficeorg.extension": {
        source: "apache",
        extensions: ["oxt"]
      },
      "application/vnd.openstreetmap.data+xml": {
        source: "iana",
        compressible: true,
        extensions: ["osm"]
      },
      "application/vnd.opentimestamps.ots": {
        source: "iana"
      },
      "application/vnd.openxmlformats-officedocument.custom-properties+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.customxmlproperties+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.drawing+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.drawingml.chart+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.drawingml.chartshapes+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.drawingml.diagramcolors+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.drawingml.diagramdata+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.drawingml.diagramlayout+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.drawingml.diagramstyle+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.extended-properties+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.commentauthors+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.comments+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.handoutmaster+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.notesmaster+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.notesslide+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.presentation": {
        source: "iana",
        compressible: false,
        extensions: ["pptx"]
      },
      "application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.presprops+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.slide": {
        source: "iana",
        extensions: ["sldx"]
      },
      "application/vnd.openxmlformats-officedocument.presentationml.slide+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.slidelayout+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.slidemaster+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.slideshow": {
        source: "iana",
        extensions: ["ppsx"]
      },
      "application/vnd.openxmlformats-officedocument.presentationml.slideshow.main+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.slideupdateinfo+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.tablestyles+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.tags+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.template": {
        source: "iana",
        extensions: ["potx"]
      },
      "application/vnd.openxmlformats-officedocument.presentationml.template.main+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.viewprops+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.calcchain+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.chartsheet+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.connections+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.dialogsheet+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.externallink+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcachedefinition+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcacherecords+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.pivottable+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.querytable+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.revisionheaders+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.revisionlog+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sharedstrings+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
        source: "iana",
        compressible: false,
        extensions: ["xlsx"]
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheetmetadata+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.tablesinglecells+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.template": {
        source: "iana",
        extensions: ["xltx"]
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.template.main+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.usernames+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.volatiledependencies+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.theme+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.themeoverride+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.vmldrawing": {
        source: "iana"
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.comments+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
        source: "iana",
        compressible: false,
        extensions: ["docx"]
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document.glossary+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.endnotes+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.fonttable+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.footnotes+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.template": {
        source: "iana",
        extensions: ["dotx"]
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.template.main+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.websettings+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-package.core-properties+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-package.digital-signature-xmlsignature+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-package.relationships+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oracle.resource+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.orange.indata": {
        source: "iana"
      },
      "application/vnd.osa.netdeploy": {
        source: "iana"
      },
      "application/vnd.osgeo.mapguide.package": {
        source: "iana",
        extensions: ["mgp"]
      },
      "application/vnd.osgi.bundle": {
        source: "iana"
      },
      "application/vnd.osgi.dp": {
        source: "iana",
        extensions: ["dp"]
      },
      "application/vnd.osgi.subsystem": {
        source: "iana",
        extensions: ["esa"]
      },
      "application/vnd.otps.ct-kip+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oxli.countgraph": {
        source: "iana"
      },
      "application/vnd.pagerduty+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.palm": {
        source: "iana",
        extensions: ["pdb", "pqa", "oprc"]
      },
      "application/vnd.panoply": {
        source: "iana"
      },
      "application/vnd.paos.xml": {
        source: "iana"
      },
      "application/vnd.patentdive": {
        source: "iana"
      },
      "application/vnd.patientecommsdoc": {
        source: "iana"
      },
      "application/vnd.pawaafile": {
        source: "iana",
        extensions: ["paw"]
      },
      "application/vnd.pcos": {
        source: "iana"
      },
      "application/vnd.pg.format": {
        source: "iana",
        extensions: ["str"]
      },
      "application/vnd.pg.osasli": {
        source: "iana",
        extensions: ["ei6"]
      },
      "application/vnd.piaccess.application-licence": {
        source: "iana"
      },
      "application/vnd.picsel": {
        source: "iana",
        extensions: ["efif"]
      },
      "application/vnd.pmi.widget": {
        source: "iana",
        extensions: ["wg"]
      },
      "application/vnd.poc.group-advertisement+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.pocketlearn": {
        source: "iana",
        extensions: ["plf"]
      },
      "application/vnd.powerbuilder6": {
        source: "iana",
        extensions: ["pbd"]
      },
      "application/vnd.powerbuilder6-s": {
        source: "iana"
      },
      "application/vnd.powerbuilder7": {
        source: "iana"
      },
      "application/vnd.powerbuilder7-s": {
        source: "iana"
      },
      "application/vnd.powerbuilder75": {
        source: "iana"
      },
      "application/vnd.powerbuilder75-s": {
        source: "iana"
      },
      "application/vnd.preminet": {
        source: "iana"
      },
      "application/vnd.previewsystems.box": {
        source: "iana",
        extensions: ["box"]
      },
      "application/vnd.proteus.magazine": {
        source: "iana",
        extensions: ["mgz"]
      },
      "application/vnd.psfs": {
        source: "iana"
      },
      "application/vnd.publishare-delta-tree": {
        source: "iana",
        extensions: ["qps"]
      },
      "application/vnd.pvi.ptid1": {
        source: "iana",
        extensions: ["ptid"]
      },
      "application/vnd.pwg-multiplexed": {
        source: "iana"
      },
      "application/vnd.pwg-xhtml-print+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.qualcomm.brew-app-res": {
        source: "iana"
      },
      "application/vnd.quarantainenet": {
        source: "iana"
      },
      "application/vnd.quark.quarkxpress": {
        source: "iana",
        extensions: ["qxd", "qxt", "qwd", "qwt", "qxl", "qxb"]
      },
      "application/vnd.quobject-quoxdocument": {
        source: "iana"
      },
      "application/vnd.radisys.moml+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-audit+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-audit-conf+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-audit-conn+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-audit-dialog+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-audit-stream+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-conf+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-dialog+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-dialog-base+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-dialog-fax-detect+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-dialog-fax-sendrecv+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-dialog-group+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-dialog-speech+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-dialog-transform+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.rainstor.data": {
        source: "iana"
      },
      "application/vnd.rapid": {
        source: "iana"
      },
      "application/vnd.rar": {
        source: "iana",
        extensions: ["rar"]
      },
      "application/vnd.realvnc.bed": {
        source: "iana",
        extensions: ["bed"]
      },
      "application/vnd.recordare.musicxml": {
        source: "iana",
        extensions: ["mxl"]
      },
      "application/vnd.recordare.musicxml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["musicxml"]
      },
      "application/vnd.renlearn.rlprint": {
        source: "iana"
      },
      "application/vnd.resilient.logic": {
        source: "iana"
      },
      "application/vnd.restful+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.rig.cryptonote": {
        source: "iana",
        extensions: ["cryptonote"]
      },
      "application/vnd.rim.cod": {
        source: "apache",
        extensions: ["cod"]
      },
      "application/vnd.rn-realmedia": {
        source: "apache",
        extensions: ["rm"]
      },
      "application/vnd.rn-realmedia-vbr": {
        source: "apache",
        extensions: ["rmvb"]
      },
      "application/vnd.route66.link66+xml": {
        source: "iana",
        compressible: true,
        extensions: ["link66"]
      },
      "application/vnd.rs-274x": {
        source: "iana"
      },
      "application/vnd.ruckus.download": {
        source: "iana"
      },
      "application/vnd.s3sms": {
        source: "iana"
      },
      "application/vnd.sailingtracker.track": {
        source: "iana",
        extensions: ["st"]
      },
      "application/vnd.sar": {
        source: "iana"
      },
      "application/vnd.sbm.cid": {
        source: "iana"
      },
      "application/vnd.sbm.mid2": {
        source: "iana"
      },
      "application/vnd.scribus": {
        source: "iana"
      },
      "application/vnd.sealed.3df": {
        source: "iana"
      },
      "application/vnd.sealed.csf": {
        source: "iana"
      },
      "application/vnd.sealed.doc": {
        source: "iana"
      },
      "application/vnd.sealed.eml": {
        source: "iana"
      },
      "application/vnd.sealed.mht": {
        source: "iana"
      },
      "application/vnd.sealed.net": {
        source: "iana"
      },
      "application/vnd.sealed.ppt": {
        source: "iana"
      },
      "application/vnd.sealed.tiff": {
        source: "iana"
      },
      "application/vnd.sealed.xls": {
        source: "iana"
      },
      "application/vnd.sealedmedia.softseal.html": {
        source: "iana"
      },
      "application/vnd.sealedmedia.softseal.pdf": {
        source: "iana"
      },
      "application/vnd.seemail": {
        source: "iana",
        extensions: ["see"]
      },
      "application/vnd.seis+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.sema": {
        source: "iana",
        extensions: ["sema"]
      },
      "application/vnd.semd": {
        source: "iana",
        extensions: ["semd"]
      },
      "application/vnd.semf": {
        source: "iana",
        extensions: ["semf"]
      },
      "application/vnd.shade-save-file": {
        source: "iana"
      },
      "application/vnd.shana.informed.formdata": {
        source: "iana",
        extensions: ["ifm"]
      },
      "application/vnd.shana.informed.formtemplate": {
        source: "iana",
        extensions: ["itp"]
      },
      "application/vnd.shana.informed.interchange": {
        source: "iana",
        extensions: ["iif"]
      },
      "application/vnd.shana.informed.package": {
        source: "iana",
        extensions: ["ipk"]
      },
      "application/vnd.shootproof+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.shopkick+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.shp": {
        source: "iana"
      },
      "application/vnd.shx": {
        source: "iana"
      },
      "application/vnd.sigrok.session": {
        source: "iana"
      },
      "application/vnd.simtech-mindmapper": {
        source: "iana",
        extensions: ["twd", "twds"]
      },
      "application/vnd.siren+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.smaf": {
        source: "iana",
        extensions: ["mmf"]
      },
      "application/vnd.smart.notebook": {
        source: "iana"
      },
      "application/vnd.smart.teacher": {
        source: "iana",
        extensions: ["teacher"]
      },
      "application/vnd.snesdev-page-table": {
        source: "iana"
      },
      "application/vnd.software602.filler.form+xml": {
        source: "iana",
        compressible: true,
        extensions: ["fo"]
      },
      "application/vnd.software602.filler.form-xml-zip": {
        source: "iana"
      },
      "application/vnd.solent.sdkm+xml": {
        source: "iana",
        compressible: true,
        extensions: ["sdkm", "sdkd"]
      },
      "application/vnd.spotfire.dxp": {
        source: "iana",
        extensions: ["dxp"]
      },
      "application/vnd.spotfire.sfs": {
        source: "iana",
        extensions: ["sfs"]
      },
      "application/vnd.sqlite3": {
        source: "iana"
      },
      "application/vnd.sss-cod": {
        source: "iana"
      },
      "application/vnd.sss-dtf": {
        source: "iana"
      },
      "application/vnd.sss-ntf": {
        source: "iana"
      },
      "application/vnd.stardivision.calc": {
        source: "apache",
        extensions: ["sdc"]
      },
      "application/vnd.stardivision.draw": {
        source: "apache",
        extensions: ["sda"]
      },
      "application/vnd.stardivision.impress": {
        source: "apache",
        extensions: ["sdd"]
      },
      "application/vnd.stardivision.math": {
        source: "apache",
        extensions: ["smf"]
      },
      "application/vnd.stardivision.writer": {
        source: "apache",
        extensions: ["sdw", "vor"]
      },
      "application/vnd.stardivision.writer-global": {
        source: "apache",
        extensions: ["sgl"]
      },
      "application/vnd.stepmania.package": {
        source: "iana",
        extensions: ["smzip"]
      },
      "application/vnd.stepmania.stepchart": {
        source: "iana",
        extensions: ["sm"]
      },
      "application/vnd.street-stream": {
        source: "iana"
      },
      "application/vnd.sun.wadl+xml": {
        source: "iana",
        compressible: true,
        extensions: ["wadl"]
      },
      "application/vnd.sun.xml.calc": {
        source: "apache",
        extensions: ["sxc"]
      },
      "application/vnd.sun.xml.calc.template": {
        source: "apache",
        extensions: ["stc"]
      },
      "application/vnd.sun.xml.draw": {
        source: "apache",
        extensions: ["sxd"]
      },
      "application/vnd.sun.xml.draw.template": {
        source: "apache",
        extensions: ["std"]
      },
      "application/vnd.sun.xml.impress": {
        source: "apache",
        extensions: ["sxi"]
      },
      "application/vnd.sun.xml.impress.template": {
        source: "apache",
        extensions: ["sti"]
      },
      "application/vnd.sun.xml.math": {
        source: "apache",
        extensions: ["sxm"]
      },
      "application/vnd.sun.xml.writer": {
        source: "apache",
        extensions: ["sxw"]
      },
      "application/vnd.sun.xml.writer.global": {
        source: "apache",
        extensions: ["sxg"]
      },
      "application/vnd.sun.xml.writer.template": {
        source: "apache",
        extensions: ["stw"]
      },
      "application/vnd.sus-calendar": {
        source: "iana",
        extensions: ["sus", "susp"]
      },
      "application/vnd.svd": {
        source: "iana",
        extensions: ["svd"]
      },
      "application/vnd.swiftview-ics": {
        source: "iana"
      },
      "application/vnd.sycle+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.syft+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.symbian.install": {
        source: "apache",
        extensions: ["sis", "sisx"]
      },
      "application/vnd.syncml+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["xsm"]
      },
      "application/vnd.syncml.dm+wbxml": {
        source: "iana",
        charset: "UTF-8",
        extensions: ["bdm"]
      },
      "application/vnd.syncml.dm+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["xdm"]
      },
      "application/vnd.syncml.dm.notification": {
        source: "iana"
      },
      "application/vnd.syncml.dmddf+wbxml": {
        source: "iana"
      },
      "application/vnd.syncml.dmddf+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["ddf"]
      },
      "application/vnd.syncml.dmtnds+wbxml": {
        source: "iana"
      },
      "application/vnd.syncml.dmtnds+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/vnd.syncml.ds.notification": {
        source: "iana"
      },
      "application/vnd.tableschema+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.tao.intent-module-archive": {
        source: "iana",
        extensions: ["tao"]
      },
      "application/vnd.tcpdump.pcap": {
        source: "iana",
        extensions: ["pcap", "cap", "dmp"]
      },
      "application/vnd.think-cell.ppttc+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.tmd.mediaflex.api+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.tml": {
        source: "iana"
      },
      "application/vnd.tmobile-livetv": {
        source: "iana",
        extensions: ["tmo"]
      },
      "application/vnd.tri.onesource": {
        source: "iana"
      },
      "application/vnd.trid.tpt": {
        source: "iana",
        extensions: ["tpt"]
      },
      "application/vnd.triscape.mxs": {
        source: "iana",
        extensions: ["mxs"]
      },
      "application/vnd.trueapp": {
        source: "iana",
        extensions: ["tra"]
      },
      "application/vnd.truedoc": {
        source: "iana"
      },
      "application/vnd.ubisoft.webplayer": {
        source: "iana"
      },
      "application/vnd.ufdl": {
        source: "iana",
        extensions: ["ufd", "ufdl"]
      },
      "application/vnd.uiq.theme": {
        source: "iana",
        extensions: ["utz"]
      },
      "application/vnd.umajin": {
        source: "iana",
        extensions: ["umj"]
      },
      "application/vnd.unity": {
        source: "iana",
        extensions: ["unityweb"]
      },
      "application/vnd.uoml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["uoml"]
      },
      "application/vnd.uplanet.alert": {
        source: "iana"
      },
      "application/vnd.uplanet.alert-wbxml": {
        source: "iana"
      },
      "application/vnd.uplanet.bearer-choice": {
        source: "iana"
      },
      "application/vnd.uplanet.bearer-choice-wbxml": {
        source: "iana"
      },
      "application/vnd.uplanet.cacheop": {
        source: "iana"
      },
      "application/vnd.uplanet.cacheop-wbxml": {
        source: "iana"
      },
      "application/vnd.uplanet.channel": {
        source: "iana"
      },
      "application/vnd.uplanet.channel-wbxml": {
        source: "iana"
      },
      "application/vnd.uplanet.list": {
        source: "iana"
      },
      "application/vnd.uplanet.list-wbxml": {
        source: "iana"
      },
      "application/vnd.uplanet.listcmd": {
        source: "iana"
      },
      "application/vnd.uplanet.listcmd-wbxml": {
        source: "iana"
      },
      "application/vnd.uplanet.signal": {
        source: "iana"
      },
      "application/vnd.uri-map": {
        source: "iana"
      },
      "application/vnd.valve.source.material": {
        source: "iana"
      },
      "application/vnd.vcx": {
        source: "iana",
        extensions: ["vcx"]
      },
      "application/vnd.vd-study": {
        source: "iana"
      },
      "application/vnd.vectorworks": {
        source: "iana"
      },
      "application/vnd.vel+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.verimatrix.vcas": {
        source: "iana"
      },
      "application/vnd.veritone.aion+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.veryant.thin": {
        source: "iana"
      },
      "application/vnd.ves.encrypted": {
        source: "iana"
      },
      "application/vnd.vidsoft.vidconference": {
        source: "iana"
      },
      "application/vnd.visio": {
        source: "iana",
        extensions: ["vsd", "vst", "vss", "vsw"]
      },
      "application/vnd.visionary": {
        source: "iana",
        extensions: ["vis"]
      },
      "application/vnd.vividence.scriptfile": {
        source: "iana"
      },
      "application/vnd.vsf": {
        source: "iana",
        extensions: ["vsf"]
      },
      "application/vnd.wap.sic": {
        source: "iana"
      },
      "application/vnd.wap.slc": {
        source: "iana"
      },
      "application/vnd.wap.wbxml": {
        source: "iana",
        charset: "UTF-8",
        extensions: ["wbxml"]
      },
      "application/vnd.wap.wmlc": {
        source: "iana",
        extensions: ["wmlc"]
      },
      "application/vnd.wap.wmlscriptc": {
        source: "iana",
        extensions: ["wmlsc"]
      },
      "application/vnd.webturbo": {
        source: "iana",
        extensions: ["wtb"]
      },
      "application/vnd.wfa.dpp": {
        source: "iana"
      },
      "application/vnd.wfa.p2p": {
        source: "iana"
      },
      "application/vnd.wfa.wsc": {
        source: "iana"
      },
      "application/vnd.windows.devicepairing": {
        source: "iana"
      },
      "application/vnd.wmc": {
        source: "iana"
      },
      "application/vnd.wmf.bootstrap": {
        source: "iana"
      },
      "application/vnd.wolfram.mathematica": {
        source: "iana"
      },
      "application/vnd.wolfram.mathematica.package": {
        source: "iana"
      },
      "application/vnd.wolfram.player": {
        source: "iana",
        extensions: ["nbp"]
      },
      "application/vnd.wordperfect": {
        source: "iana",
        extensions: ["wpd"]
      },
      "application/vnd.wqd": {
        source: "iana",
        extensions: ["wqd"]
      },
      "application/vnd.wrq-hp3000-labelled": {
        source: "iana"
      },
      "application/vnd.wt.stf": {
        source: "iana",
        extensions: ["stf"]
      },
      "application/vnd.wv.csp+wbxml": {
        source: "iana"
      },
      "application/vnd.wv.csp+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.wv.ssp+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.xacml+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.xara": {
        source: "iana",
        extensions: ["xar"]
      },
      "application/vnd.xfdl": {
        source: "iana",
        extensions: ["xfdl"]
      },
      "application/vnd.xfdl.webform": {
        source: "iana"
      },
      "application/vnd.xmi+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.xmpie.cpkg": {
        source: "iana"
      },
      "application/vnd.xmpie.dpkg": {
        source: "iana"
      },
      "application/vnd.xmpie.plan": {
        source: "iana"
      },
      "application/vnd.xmpie.ppkg": {
        source: "iana"
      },
      "application/vnd.xmpie.xlim": {
        source: "iana"
      },
      "application/vnd.yamaha.hv-dic": {
        source: "iana",
        extensions: ["hvd"]
      },
      "application/vnd.yamaha.hv-script": {
        source: "iana",
        extensions: ["hvs"]
      },
      "application/vnd.yamaha.hv-voice": {
        source: "iana",
        extensions: ["hvp"]
      },
      "application/vnd.yamaha.openscoreformat": {
        source: "iana",
        extensions: ["osf"]
      },
      "application/vnd.yamaha.openscoreformat.osfpvg+xml": {
        source: "iana",
        compressible: true,
        extensions: ["osfpvg"]
      },
      "application/vnd.yamaha.remote-setup": {
        source: "iana"
      },
      "application/vnd.yamaha.smaf-audio": {
        source: "iana",
        extensions: ["saf"]
      },
      "application/vnd.yamaha.smaf-phrase": {
        source: "iana",
        extensions: ["spf"]
      },
      "application/vnd.yamaha.through-ngn": {
        source: "iana"
      },
      "application/vnd.yamaha.tunnel-udpencap": {
        source: "iana"
      },
      "application/vnd.yaoweme": {
        source: "iana"
      },
      "application/vnd.yellowriver-custom-menu": {
        source: "iana",
        extensions: ["cmp"]
      },
      "application/vnd.youtube.yt": {
        source: "iana"
      },
      "application/vnd.zul": {
        source: "iana",
        extensions: ["zir", "zirz"]
      },
      "application/vnd.zzazz.deck+xml": {
        source: "iana",
        compressible: true,
        extensions: ["zaz"]
      },
      "application/voicexml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["vxml"]
      },
      "application/voucher-cms+json": {
        source: "iana",
        compressible: true
      },
      "application/vq-rtcpxr": {
        source: "iana"
      },
      "application/wasm": {
        source: "iana",
        compressible: true,
        extensions: ["wasm"]
      },
      "application/watcherinfo+xml": {
        source: "iana",
        compressible: true,
        extensions: ["wif"]
      },
      "application/webpush-options+json": {
        source: "iana",
        compressible: true
      },
      "application/whoispp-query": {
        source: "iana"
      },
      "application/whoispp-response": {
        source: "iana"
      },
      "application/widget": {
        source: "iana",
        extensions: ["wgt"]
      },
      "application/winhlp": {
        source: "apache",
        extensions: ["hlp"]
      },
      "application/wita": {
        source: "iana"
      },
      "application/wordperfect5.1": {
        source: "iana"
      },
      "application/wsdl+xml": {
        source: "iana",
        compressible: true,
        extensions: ["wsdl"]
      },
      "application/wspolicy+xml": {
        source: "iana",
        compressible: true,
        extensions: ["wspolicy"]
      },
      "application/x-7z-compressed": {
        source: "apache",
        compressible: false,
        extensions: ["7z"]
      },
      "application/x-abiword": {
        source: "apache",
        extensions: ["abw"]
      },
      "application/x-ace-compressed": {
        source: "apache",
        extensions: ["ace"]
      },
      "application/x-amf": {
        source: "apache"
      },
      "application/x-apple-diskimage": {
        source: "apache",
        extensions: ["dmg"]
      },
      "application/x-arj": {
        compressible: false,
        extensions: ["arj"]
      },
      "application/x-authorware-bin": {
        source: "apache",
        extensions: ["aab", "x32", "u32", "vox"]
      },
      "application/x-authorware-map": {
        source: "apache",
        extensions: ["aam"]
      },
      "application/x-authorware-seg": {
        source: "apache",
        extensions: ["aas"]
      },
      "application/x-bcpio": {
        source: "apache",
        extensions: ["bcpio"]
      },
      "application/x-bdoc": {
        compressible: false,
        extensions: ["bdoc"]
      },
      "application/x-bittorrent": {
        source: "apache",
        extensions: ["torrent"]
      },
      "application/x-blorb": {
        source: "apache",
        extensions: ["blb", "blorb"]
      },
      "application/x-bzip": {
        source: "apache",
        compressible: false,
        extensions: ["bz"]
      },
      "application/x-bzip2": {
        source: "apache",
        compressible: false,
        extensions: ["bz2", "boz"]
      },
      "application/x-cbr": {
        source: "apache",
        extensions: ["cbr", "cba", "cbt", "cbz", "cb7"]
      },
      "application/x-cdlink": {
        source: "apache",
        extensions: ["vcd"]
      },
      "application/x-cfs-compressed": {
        source: "apache",
        extensions: ["cfs"]
      },
      "application/x-chat": {
        source: "apache",
        extensions: ["chat"]
      },
      "application/x-chess-pgn": {
        source: "apache",
        extensions: ["pgn"]
      },
      "application/x-chrome-extension": {
        extensions: ["crx"]
      },
      "application/x-cocoa": {
        source: "nginx",
        extensions: ["cco"]
      },
      "application/x-compress": {
        source: "apache"
      },
      "application/x-conference": {
        source: "apache",
        extensions: ["nsc"]
      },
      "application/x-cpio": {
        source: "apache",
        extensions: ["cpio"]
      },
      "application/x-csh": {
        source: "apache",
        extensions: ["csh"]
      },
      "application/x-deb": {
        compressible: false
      },
      "application/x-debian-package": {
        source: "apache",
        extensions: ["deb", "udeb"]
      },
      "application/x-dgc-compressed": {
        source: "apache",
        extensions: ["dgc"]
      },
      "application/x-director": {
        source: "apache",
        extensions: ["dir", "dcr", "dxr", "cst", "cct", "cxt", "w3d", "fgd", "swa"]
      },
      "application/x-doom": {
        source: "apache",
        extensions: ["wad"]
      },
      "application/x-dtbncx+xml": {
        source: "apache",
        compressible: true,
        extensions: ["ncx"]
      },
      "application/x-dtbook+xml": {
        source: "apache",
        compressible: true,
        extensions: ["dtb"]
      },
      "application/x-dtbresource+xml": {
        source: "apache",
        compressible: true,
        extensions: ["res"]
      },
      "application/x-dvi": {
        source: "apache",
        compressible: false,
        extensions: ["dvi"]
      },
      "application/x-envoy": {
        source: "apache",
        extensions: ["evy"]
      },
      "application/x-eva": {
        source: "apache",
        extensions: ["eva"]
      },
      "application/x-font-bdf": {
        source: "apache",
        extensions: ["bdf"]
      },
      "application/x-font-dos": {
        source: "apache"
      },
      "application/x-font-framemaker": {
        source: "apache"
      },
      "application/x-font-ghostscript": {
        source: "apache",
        extensions: ["gsf"]
      },
      "application/x-font-libgrx": {
        source: "apache"
      },
      "application/x-font-linux-psf": {
        source: "apache",
        extensions: ["psf"]
      },
      "application/x-font-pcf": {
        source: "apache",
        extensions: ["pcf"]
      },
      "application/x-font-snf": {
        source: "apache",
        extensions: ["snf"]
      },
      "application/x-font-speedo": {
        source: "apache"
      },
      "application/x-font-sunos-news": {
        source: "apache"
      },
      "application/x-font-type1": {
        source: "apache",
        extensions: ["pfa", "pfb", "pfm", "afm"]
      },
      "application/x-font-vfont": {
        source: "apache"
      },
      "application/x-freearc": {
        source: "apache",
        extensions: ["arc"]
      },
      "application/x-futuresplash": {
        source: "apache",
        extensions: ["spl"]
      },
      "application/x-gca-compressed": {
        source: "apache",
        extensions: ["gca"]
      },
      "application/x-glulx": {
        source: "apache",
        extensions: ["ulx"]
      },
      "application/x-gnumeric": {
        source: "apache",
        extensions: ["gnumeric"]
      },
      "application/x-gramps-xml": {
        source: "apache",
        extensions: ["gramps"]
      },
      "application/x-gtar": {
        source: "apache",
        extensions: ["gtar"]
      },
      "application/x-gzip": {
        source: "apache"
      },
      "application/x-hdf": {
        source: "apache",
        extensions: ["hdf"]
      },
      "application/x-httpd-php": {
        compressible: true,
        extensions: ["php"]
      },
      "application/x-install-instructions": {
        source: "apache",
        extensions: ["install"]
      },
      "application/x-iso9660-image": {
        source: "apache",
        extensions: ["iso"]
      },
      "application/x-iwork-keynote-sffkey": {
        extensions: ["key"]
      },
      "application/x-iwork-numbers-sffnumbers": {
        extensions: ["numbers"]
      },
      "application/x-iwork-pages-sffpages": {
        extensions: ["pages"]
      },
      "application/x-java-archive-diff": {
        source: "nginx",
        extensions: ["jardiff"]
      },
      "application/x-java-jnlp-file": {
        source: "apache",
        compressible: false,
        extensions: ["jnlp"]
      },
      "application/x-javascript": {
        compressible: true
      },
      "application/x-keepass2": {
        extensions: ["kdbx"]
      },
      "application/x-latex": {
        source: "apache",
        compressible: false,
        extensions: ["latex"]
      },
      "application/x-lua-bytecode": {
        extensions: ["luac"]
      },
      "application/x-lzh-compressed": {
        source: "apache",
        extensions: ["lzh", "lha"]
      },
      "application/x-makeself": {
        source: "nginx",
        extensions: ["run"]
      },
      "application/x-mie": {
        source: "apache",
        extensions: ["mie"]
      },
      "application/x-mobipocket-ebook": {
        source: "apache",
        extensions: ["prc", "mobi"]
      },
      "application/x-mpegurl": {
        compressible: false
      },
      "application/x-ms-application": {
        source: "apache",
        extensions: ["application"]
      },
      "application/x-ms-shortcut": {
        source: "apache",
        extensions: ["lnk"]
      },
      "application/x-ms-wmd": {
        source: "apache",
        extensions: ["wmd"]
      },
      "application/x-ms-wmz": {
        source: "apache",
        extensions: ["wmz"]
      },
      "application/x-ms-xbap": {
        source: "apache",
        extensions: ["xbap"]
      },
      "application/x-msaccess": {
        source: "apache",
        extensions: ["mdb"]
      },
      "application/x-msbinder": {
        source: "apache",
        extensions: ["obd"]
      },
      "application/x-mscardfile": {
        source: "apache",
        extensions: ["crd"]
      },
      "application/x-msclip": {
        source: "apache",
        extensions: ["clp"]
      },
      "application/x-msdos-program": {
        extensions: ["exe"]
      },
      "application/x-msdownload": {
        source: "apache",
        extensions: ["exe", "dll", "com", "bat", "msi"]
      },
      "application/x-msmediaview": {
        source: "apache",
        extensions: ["mvb", "m13", "m14"]
      },
      "application/x-msmetafile": {
        source: "apache",
        extensions: ["wmf", "wmz", "emf", "emz"]
      },
      "application/x-msmoney": {
        source: "apache",
        extensions: ["mny"]
      },
      "application/x-mspublisher": {
        source: "apache",
        extensions: ["pub"]
      },
      "application/x-msschedule": {
        source: "apache",
        extensions: ["scd"]
      },
      "application/x-msterminal": {
        source: "apache",
        extensions: ["trm"]
      },
      "application/x-mswrite": {
        source: "apache",
        extensions: ["wri"]
      },
      "application/x-netcdf": {
        source: "apache",
        extensions: ["nc", "cdf"]
      },
      "application/x-ns-proxy-autoconfig": {
        compressible: true,
        extensions: ["pac"]
      },
      "application/x-nzb": {
        source: "apache",
        extensions: ["nzb"]
      },
      "application/x-perl": {
        source: "nginx",
        extensions: ["pl", "pm"]
      },
      "application/x-pilot": {
        source: "nginx",
        extensions: ["prc", "pdb"]
      },
      "application/x-pkcs12": {
        source: "apache",
        compressible: false,
        extensions: ["p12", "pfx"]
      },
      "application/x-pkcs7-certificates": {
        source: "apache",
        extensions: ["p7b", "spc"]
      },
      "application/x-pkcs7-certreqresp": {
        source: "apache",
        extensions: ["p7r"]
      },
      "application/x-pki-message": {
        source: "iana"
      },
      "application/x-rar-compressed": {
        source: "apache",
        compressible: false,
        extensions: ["rar"]
      },
      "application/x-redhat-package-manager": {
        source: "nginx",
        extensions: ["rpm"]
      },
      "application/x-research-info-systems": {
        source: "apache",
        extensions: ["ris"]
      },
      "application/x-sea": {
        source: "nginx",
        extensions: ["sea"]
      },
      "application/x-sh": {
        source: "apache",
        compressible: true,
        extensions: ["sh"]
      },
      "application/x-shar": {
        source: "apache",
        extensions: ["shar"]
      },
      "application/x-shockwave-flash": {
        source: "apache",
        compressible: false,
        extensions: ["swf"]
      },
      "application/x-silverlight-app": {
        source: "apache",
        extensions: ["xap"]
      },
      "application/x-sql": {
        source: "apache",
        extensions: ["sql"]
      },
      "application/x-stuffit": {
        source: "apache",
        compressible: false,
        extensions: ["sit"]
      },
      "application/x-stuffitx": {
        source: "apache",
        extensions: ["sitx"]
      },
      "application/x-subrip": {
        source: "apache",
        extensions: ["srt"]
      },
      "application/x-sv4cpio": {
        source: "apache",
        extensions: ["sv4cpio"]
      },
      "application/x-sv4crc": {
        source: "apache",
        extensions: ["sv4crc"]
      },
      "application/x-t3vm-image": {
        source: "apache",
        extensions: ["t3"]
      },
      "application/x-tads": {
        source: "apache",
        extensions: ["gam"]
      },
      "application/x-tar": {
        source: "apache",
        compressible: true,
        extensions: ["tar"]
      },
      "application/x-tcl": {
        source: "apache",
        extensions: ["tcl", "tk"]
      },
      "application/x-tex": {
        source: "apache",
        extensions: ["tex"]
      },
      "application/x-tex-tfm": {
        source: "apache",
        extensions: ["tfm"]
      },
      "application/x-texinfo": {
        source: "apache",
        extensions: ["texinfo", "texi"]
      },
      "application/x-tgif": {
        source: "apache",
        extensions: ["obj"]
      },
      "application/x-ustar": {
        source: "apache",
        extensions: ["ustar"]
      },
      "application/x-virtualbox-hdd": {
        compressible: true,
        extensions: ["hdd"]
      },
      "application/x-virtualbox-ova": {
        compressible: true,
        extensions: ["ova"]
      },
      "application/x-virtualbox-ovf": {
        compressible: true,
        extensions: ["ovf"]
      },
      "application/x-virtualbox-vbox": {
        compressible: true,
        extensions: ["vbox"]
      },
      "application/x-virtualbox-vbox-extpack": {
        compressible: false,
        extensions: ["vbox-extpack"]
      },
      "application/x-virtualbox-vdi": {
        compressible: true,
        extensions: ["vdi"]
      },
      "application/x-virtualbox-vhd": {
        compressible: true,
        extensions: ["vhd"]
      },
      "application/x-virtualbox-vmdk": {
        compressible: true,
        extensions: ["vmdk"]
      },
      "application/x-wais-source": {
        source: "apache",
        extensions: ["src"]
      },
      "application/x-web-app-manifest+json": {
        compressible: true,
        extensions: ["webapp"]
      },
      "application/x-www-form-urlencoded": {
        source: "iana",
        compressible: true
      },
      "application/x-x509-ca-cert": {
        source: "iana",
        extensions: ["der", "crt", "pem"]
      },
      "application/x-x509-ca-ra-cert": {
        source: "iana"
      },
      "application/x-x509-next-ca-cert": {
        source: "iana"
      },
      "application/x-xfig": {
        source: "apache",
        extensions: ["fig"]
      },
      "application/x-xliff+xml": {
        source: "apache",
        compressible: true,
        extensions: ["xlf"]
      },
      "application/x-xpinstall": {
        source: "apache",
        compressible: false,
        extensions: ["xpi"]
      },
      "application/x-xz": {
        source: "apache",
        extensions: ["xz"]
      },
      "application/x-zmachine": {
        source: "apache",
        extensions: ["z1", "z2", "z3", "z4", "z5", "z6", "z7", "z8"]
      },
      "application/x400-bp": {
        source: "iana"
      },
      "application/xacml+xml": {
        source: "iana",
        compressible: true
      },
      "application/xaml+xml": {
        source: "apache",
        compressible: true,
        extensions: ["xaml"]
      },
      "application/xcap-att+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xav"]
      },
      "application/xcap-caps+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xca"]
      },
      "application/xcap-diff+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xdf"]
      },
      "application/xcap-el+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xel"]
      },
      "application/xcap-error+xml": {
        source: "iana",
        compressible: true
      },
      "application/xcap-ns+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xns"]
      },
      "application/xcon-conference-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/xcon-conference-info-diff+xml": {
        source: "iana",
        compressible: true
      },
      "application/xenc+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xenc"]
      },
      "application/xhtml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xhtml", "xht"]
      },
      "application/xhtml-voice+xml": {
        source: "apache",
        compressible: true
      },
      "application/xliff+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xlf"]
      },
      "application/xml": {
        source: "iana",
        compressible: true,
        extensions: ["xml", "xsl", "xsd", "rng"]
      },
      "application/xml-dtd": {
        source: "iana",
        compressible: true,
        extensions: ["dtd"]
      },
      "application/xml-external-parsed-entity": {
        source: "iana"
      },
      "application/xml-patch+xml": {
        source: "iana",
        compressible: true
      },
      "application/xmpp+xml": {
        source: "iana",
        compressible: true
      },
      "application/xop+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xop"]
      },
      "application/xproc+xml": {
        source: "apache",
        compressible: true,
        extensions: ["xpl"]
      },
      "application/xslt+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xsl", "xslt"]
      },
      "application/xspf+xml": {
        source: "apache",
        compressible: true,
        extensions: ["xspf"]
      },
      "application/xv+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mxml", "xhvml", "xvml", "xvm"]
      },
      "application/yang": {
        source: "iana",
        extensions: ["yang"]
      },
      "application/yang-data+json": {
        source: "iana",
        compressible: true
      },
      "application/yang-data+xml": {
        source: "iana",
        compressible: true
      },
      "application/yang-patch+json": {
        source: "iana",
        compressible: true
      },
      "application/yang-patch+xml": {
        source: "iana",
        compressible: true
      },
      "application/yin+xml": {
        source: "iana",
        compressible: true,
        extensions: ["yin"]
      },
      "application/zip": {
        source: "iana",
        compressible: false,
        extensions: ["zip"]
      },
      "application/zlib": {
        source: "iana"
      },
      "application/zstd": {
        source: "iana"
      },
      "audio/1d-interleaved-parityfec": {
        source: "iana"
      },
      "audio/32kadpcm": {
        source: "iana"
      },
      "audio/3gpp": {
        source: "iana",
        compressible: false,
        extensions: ["3gpp"]
      },
      "audio/3gpp2": {
        source: "iana"
      },
      "audio/aac": {
        source: "iana"
      },
      "audio/ac3": {
        source: "iana"
      },
      "audio/adpcm": {
        source: "apache",
        extensions: ["adp"]
      },
      "audio/amr": {
        source: "iana",
        extensions: ["amr"]
      },
      "audio/amr-wb": {
        source: "iana"
      },
      "audio/amr-wb+": {
        source: "iana"
      },
      "audio/aptx": {
        source: "iana"
      },
      "audio/asc": {
        source: "iana"
      },
      "audio/atrac-advanced-lossless": {
        source: "iana"
      },
      "audio/atrac-x": {
        source: "iana"
      },
      "audio/atrac3": {
        source: "iana"
      },
      "audio/basic": {
        source: "iana",
        compressible: false,
        extensions: ["au", "snd"]
      },
      "audio/bv16": {
        source: "iana"
      },
      "audio/bv32": {
        source: "iana"
      },
      "audio/clearmode": {
        source: "iana"
      },
      "audio/cn": {
        source: "iana"
      },
      "audio/dat12": {
        source: "iana"
      },
      "audio/dls": {
        source: "iana"
      },
      "audio/dsr-es201108": {
        source: "iana"
      },
      "audio/dsr-es202050": {
        source: "iana"
      },
      "audio/dsr-es202211": {
        source: "iana"
      },
      "audio/dsr-es202212": {
        source: "iana"
      },
      "audio/dv": {
        source: "iana"
      },
      "audio/dvi4": {
        source: "iana"
      },
      "audio/eac3": {
        source: "iana"
      },
      "audio/encaprtp": {
        source: "iana"
      },
      "audio/evrc": {
        source: "iana"
      },
      "audio/evrc-qcp": {
        source: "iana"
      },
      "audio/evrc0": {
        source: "iana"
      },
      "audio/evrc1": {
        source: "iana"
      },
      "audio/evrcb": {
        source: "iana"
      },
      "audio/evrcb0": {
        source: "iana"
      },
      "audio/evrcb1": {
        source: "iana"
      },
      "audio/evrcnw": {
        source: "iana"
      },
      "audio/evrcnw0": {
        source: "iana"
      },
      "audio/evrcnw1": {
        source: "iana"
      },
      "audio/evrcwb": {
        source: "iana"
      },
      "audio/evrcwb0": {
        source: "iana"
      },
      "audio/evrcwb1": {
        source: "iana"
      },
      "audio/evs": {
        source: "iana"
      },
      "audio/flexfec": {
        source: "iana"
      },
      "audio/fwdred": {
        source: "iana"
      },
      "audio/g711-0": {
        source: "iana"
      },
      "audio/g719": {
        source: "iana"
      },
      "audio/g722": {
        source: "iana"
      },
      "audio/g7221": {
        source: "iana"
      },
      "audio/g723": {
        source: "iana"
      },
      "audio/g726-16": {
        source: "iana"
      },
      "audio/g726-24": {
        source: "iana"
      },
      "audio/g726-32": {
        source: "iana"
      },
      "audio/g726-40": {
        source: "iana"
      },
      "audio/g728": {
        source: "iana"
      },
      "audio/g729": {
        source: "iana"
      },
      "audio/g7291": {
        source: "iana"
      },
      "audio/g729d": {
        source: "iana"
      },
      "audio/g729e": {
        source: "iana"
      },
      "audio/gsm": {
        source: "iana"
      },
      "audio/gsm-efr": {
        source: "iana"
      },
      "audio/gsm-hr-08": {
        source: "iana"
      },
      "audio/ilbc": {
        source: "iana"
      },
      "audio/ip-mr_v2.5": {
        source: "iana"
      },
      "audio/isac": {
        source: "apache"
      },
      "audio/l16": {
        source: "iana"
      },
      "audio/l20": {
        source: "iana"
      },
      "audio/l24": {
        source: "iana",
        compressible: false
      },
      "audio/l8": {
        source: "iana"
      },
      "audio/lpc": {
        source: "iana"
      },
      "audio/melp": {
        source: "iana"
      },
      "audio/melp1200": {
        source: "iana"
      },
      "audio/melp2400": {
        source: "iana"
      },
      "audio/melp600": {
        source: "iana"
      },
      "audio/mhas": {
        source: "iana"
      },
      "audio/midi": {
        source: "apache",
        extensions: ["mid", "midi", "kar", "rmi"]
      },
      "audio/mobile-xmf": {
        source: "iana",
        extensions: ["mxmf"]
      },
      "audio/mp3": {
        compressible: false,
        extensions: ["mp3"]
      },
      "audio/mp4": {
        source: "iana",
        compressible: false,
        extensions: ["m4a", "mp4a"]
      },
      "audio/mp4a-latm": {
        source: "iana"
      },
      "audio/mpa": {
        source: "iana"
      },
      "audio/mpa-robust": {
        source: "iana"
      },
      "audio/mpeg": {
        source: "iana",
        compressible: false,
        extensions: ["mpga", "mp2", "mp2a", "mp3", "m2a", "m3a"]
      },
      "audio/mpeg4-generic": {
        source: "iana"
      },
      "audio/musepack": {
        source: "apache"
      },
      "audio/ogg": {
        source: "iana",
        compressible: false,
        extensions: ["oga", "ogg", "spx", "opus"]
      },
      "audio/opus": {
        source: "iana"
      },
      "audio/parityfec": {
        source: "iana"
      },
      "audio/pcma": {
        source: "iana"
      },
      "audio/pcma-wb": {
        source: "iana"
      },
      "audio/pcmu": {
        source: "iana"
      },
      "audio/pcmu-wb": {
        source: "iana"
      },
      "audio/prs.sid": {
        source: "iana"
      },
      "audio/qcelp": {
        source: "iana"
      },
      "audio/raptorfec": {
        source: "iana"
      },
      "audio/red": {
        source: "iana"
      },
      "audio/rtp-enc-aescm128": {
        source: "iana"
      },
      "audio/rtp-midi": {
        source: "iana"
      },
      "audio/rtploopback": {
        source: "iana"
      },
      "audio/rtx": {
        source: "iana"
      },
      "audio/s3m": {
        source: "apache",
        extensions: ["s3m"]
      },
      "audio/scip": {
        source: "iana"
      },
      "audio/silk": {
        source: "apache",
        extensions: ["sil"]
      },
      "audio/smv": {
        source: "iana"
      },
      "audio/smv-qcp": {
        source: "iana"
      },
      "audio/smv0": {
        source: "iana"
      },
      "audio/sofa": {
        source: "iana"
      },
      "audio/sp-midi": {
        source: "iana"
      },
      "audio/speex": {
        source: "iana"
      },
      "audio/t140c": {
        source: "iana"
      },
      "audio/t38": {
        source: "iana"
      },
      "audio/telephone-event": {
        source: "iana"
      },
      "audio/tetra_acelp": {
        source: "iana"
      },
      "audio/tetra_acelp_bb": {
        source: "iana"
      },
      "audio/tone": {
        source: "iana"
      },
      "audio/tsvcis": {
        source: "iana"
      },
      "audio/uemclip": {
        source: "iana"
      },
      "audio/ulpfec": {
        source: "iana"
      },
      "audio/usac": {
        source: "iana"
      },
      "audio/vdvi": {
        source: "iana"
      },
      "audio/vmr-wb": {
        source: "iana"
      },
      "audio/vnd.3gpp.iufp": {
        source: "iana"
      },
      "audio/vnd.4sb": {
        source: "iana"
      },
      "audio/vnd.audiokoz": {
        source: "iana"
      },
      "audio/vnd.celp": {
        source: "iana"
      },
      "audio/vnd.cisco.nse": {
        source: "iana"
      },
      "audio/vnd.cmles.radio-events": {
        source: "iana"
      },
      "audio/vnd.cns.anp1": {
        source: "iana"
      },
      "audio/vnd.cns.inf1": {
        source: "iana"
      },
      "audio/vnd.dece.audio": {
        source: "iana",
        extensions: ["uva", "uvva"]
      },
      "audio/vnd.digital-winds": {
        source: "iana",
        extensions: ["eol"]
      },
      "audio/vnd.dlna.adts": {
        source: "iana"
      },
      "audio/vnd.dolby.heaac.1": {
        source: "iana"
      },
      "audio/vnd.dolby.heaac.2": {
        source: "iana"
      },
      "audio/vnd.dolby.mlp": {
        source: "iana"
      },
      "audio/vnd.dolby.mps": {
        source: "iana"
      },
      "audio/vnd.dolby.pl2": {
        source: "iana"
      },
      "audio/vnd.dolby.pl2x": {
        source: "iana"
      },
      "audio/vnd.dolby.pl2z": {
        source: "iana"
      },
      "audio/vnd.dolby.pulse.1": {
        source: "iana"
      },
      "audio/vnd.dra": {
        source: "iana",
        extensions: ["dra"]
      },
      "audio/vnd.dts": {
        source: "iana",
        extensions: ["dts"]
      },
      "audio/vnd.dts.hd": {
        source: "iana",
        extensions: ["dtshd"]
      },
      "audio/vnd.dts.uhd": {
        source: "iana"
      },
      "audio/vnd.dvb.file": {
        source: "iana"
      },
      "audio/vnd.everad.plj": {
        source: "iana"
      },
      "audio/vnd.hns.audio": {
        source: "iana"
      },
      "audio/vnd.lucent.voice": {
        source: "iana",
        extensions: ["lvp"]
      },
      "audio/vnd.ms-playready.media.pya": {
        source: "iana",
        extensions: ["pya"]
      },
      "audio/vnd.nokia.mobile-xmf": {
        source: "iana"
      },
      "audio/vnd.nortel.vbk": {
        source: "iana"
      },
      "audio/vnd.nuera.ecelp4800": {
        source: "iana",
        extensions: ["ecelp4800"]
      },
      "audio/vnd.nuera.ecelp7470": {
        source: "iana",
        extensions: ["ecelp7470"]
      },
      "audio/vnd.nuera.ecelp9600": {
        source: "iana",
        extensions: ["ecelp9600"]
      },
      "audio/vnd.octel.sbc": {
        source: "iana"
      },
      "audio/vnd.presonus.multitrack": {
        source: "iana"
      },
      "audio/vnd.qcelp": {
        source: "iana"
      },
      "audio/vnd.rhetorex.32kadpcm": {
        source: "iana"
      },
      "audio/vnd.rip": {
        source: "iana",
        extensions: ["rip"]
      },
      "audio/vnd.rn-realaudio": {
        compressible: false
      },
      "audio/vnd.sealedmedia.softseal.mpeg": {
        source: "iana"
      },
      "audio/vnd.vmx.cvsd": {
        source: "iana"
      },
      "audio/vnd.wave": {
        compressible: false
      },
      "audio/vorbis": {
        source: "iana",
        compressible: false
      },
      "audio/vorbis-config": {
        source: "iana"
      },
      "audio/wav": {
        compressible: false,
        extensions: ["wav"]
      },
      "audio/wave": {
        compressible: false,
        extensions: ["wav"]
      },
      "audio/webm": {
        source: "apache",
        compressible: false,
        extensions: ["weba"]
      },
      "audio/x-aac": {
        source: "apache",
        compressible: false,
        extensions: ["aac"]
      },
      "audio/x-aiff": {
        source: "apache",
        extensions: ["aif", "aiff", "aifc"]
      },
      "audio/x-caf": {
        source: "apache",
        compressible: false,
        extensions: ["caf"]
      },
      "audio/x-flac": {
        source: "apache",
        extensions: ["flac"]
      },
      "audio/x-m4a": {
        source: "nginx",
        extensions: ["m4a"]
      },
      "audio/x-matroska": {
        source: "apache",
        extensions: ["mka"]
      },
      "audio/x-mpegurl": {
        source: "apache",
        extensions: ["m3u"]
      },
      "audio/x-ms-wax": {
        source: "apache",
        extensions: ["wax"]
      },
      "audio/x-ms-wma": {
        source: "apache",
        extensions: ["wma"]
      },
      "audio/x-pn-realaudio": {
        source: "apache",
        extensions: ["ram", "ra"]
      },
      "audio/x-pn-realaudio-plugin": {
        source: "apache",
        extensions: ["rmp"]
      },
      "audio/x-realaudio": {
        source: "nginx",
        extensions: ["ra"]
      },
      "audio/x-tta": {
        source: "apache"
      },
      "audio/x-wav": {
        source: "apache",
        extensions: ["wav"]
      },
      "audio/xm": {
        source: "apache",
        extensions: ["xm"]
      },
      "chemical/x-cdx": {
        source: "apache",
        extensions: ["cdx"]
      },
      "chemical/x-cif": {
        source: "apache",
        extensions: ["cif"]
      },
      "chemical/x-cmdf": {
        source: "apache",
        extensions: ["cmdf"]
      },
      "chemical/x-cml": {
        source: "apache",
        extensions: ["cml"]
      },
      "chemical/x-csml": {
        source: "apache",
        extensions: ["csml"]
      },
      "chemical/x-pdb": {
        source: "apache"
      },
      "chemical/x-xyz": {
        source: "apache",
        extensions: ["xyz"]
      },
      "font/collection": {
        source: "iana",
        extensions: ["ttc"]
      },
      "font/otf": {
        source: "iana",
        compressible: true,
        extensions: ["otf"]
      },
      "font/sfnt": {
        source: "iana"
      },
      "font/ttf": {
        source: "iana",
        compressible: true,
        extensions: ["ttf"]
      },
      "font/woff": {
        source: "iana",
        extensions: ["woff"]
      },
      "font/woff2": {
        source: "iana",
        extensions: ["woff2"]
      },
      "image/aces": {
        source: "iana",
        extensions: ["exr"]
      },
      "image/apng": {
        compressible: false,
        extensions: ["apng"]
      },
      "image/avci": {
        source: "iana",
        extensions: ["avci"]
      },
      "image/avcs": {
        source: "iana",
        extensions: ["avcs"]
      },
      "image/avif": {
        source: "iana",
        compressible: false,
        extensions: ["avif"]
      },
      "image/bmp": {
        source: "iana",
        compressible: true,
        extensions: ["bmp"]
      },
      "image/cgm": {
        source: "iana",
        extensions: ["cgm"]
      },
      "image/dicom-rle": {
        source: "iana",
        extensions: ["drle"]
      },
      "image/emf": {
        source: "iana",
        extensions: ["emf"]
      },
      "image/fits": {
        source: "iana",
        extensions: ["fits"]
      },
      "image/g3fax": {
        source: "iana",
        extensions: ["g3"]
      },
      "image/gif": {
        source: "iana",
        compressible: false,
        extensions: ["gif"]
      },
      "image/heic": {
        source: "iana",
        extensions: ["heic"]
      },
      "image/heic-sequence": {
        source: "iana",
        extensions: ["heics"]
      },
      "image/heif": {
        source: "iana",
        extensions: ["heif"]
      },
      "image/heif-sequence": {
        source: "iana",
        extensions: ["heifs"]
      },
      "image/hej2k": {
        source: "iana",
        extensions: ["hej2"]
      },
      "image/hsj2": {
        source: "iana",
        extensions: ["hsj2"]
      },
      "image/ief": {
        source: "iana",
        extensions: ["ief"]
      },
      "image/jls": {
        source: "iana",
        extensions: ["jls"]
      },
      "image/jp2": {
        source: "iana",
        compressible: false,
        extensions: ["jp2", "jpg2"]
      },
      "image/jpeg": {
        source: "iana",
        compressible: false,
        extensions: ["jpeg", "jpg", "jpe"]
      },
      "image/jph": {
        source: "iana",
        extensions: ["jph"]
      },
      "image/jphc": {
        source: "iana",
        extensions: ["jhc"]
      },
      "image/jpm": {
        source: "iana",
        compressible: false,
        extensions: ["jpm"]
      },
      "image/jpx": {
        source: "iana",
        compressible: false,
        extensions: ["jpx", "jpf"]
      },
      "image/jxr": {
        source: "iana",
        extensions: ["jxr"]
      },
      "image/jxra": {
        source: "iana",
        extensions: ["jxra"]
      },
      "image/jxrs": {
        source: "iana",
        extensions: ["jxrs"]
      },
      "image/jxs": {
        source: "iana",
        extensions: ["jxs"]
      },
      "image/jxsc": {
        source: "iana",
        extensions: ["jxsc"]
      },
      "image/jxsi": {
        source: "iana",
        extensions: ["jxsi"]
      },
      "image/jxss": {
        source: "iana",
        extensions: ["jxss"]
      },
      "image/ktx": {
        source: "iana",
        extensions: ["ktx"]
      },
      "image/ktx2": {
        source: "iana",
        extensions: ["ktx2"]
      },
      "image/naplps": {
        source: "iana"
      },
      "image/pjpeg": {
        compressible: false
      },
      "image/png": {
        source: "iana",
        compressible: false,
        extensions: ["png"]
      },
      "image/prs.btif": {
        source: "iana",
        extensions: ["btif"]
      },
      "image/prs.pti": {
        source: "iana",
        extensions: ["pti"]
      },
      "image/pwg-raster": {
        source: "iana"
      },
      "image/sgi": {
        source: "apache",
        extensions: ["sgi"]
      },
      "image/svg+xml": {
        source: "iana",
        compressible: true,
        extensions: ["svg", "svgz"]
      },
      "image/t38": {
        source: "iana",
        extensions: ["t38"]
      },
      "image/tiff": {
        source: "iana",
        compressible: false,
        extensions: ["tif", "tiff"]
      },
      "image/tiff-fx": {
        source: "iana",
        extensions: ["tfx"]
      },
      "image/vnd.adobe.photoshop": {
        source: "iana",
        compressible: true,
        extensions: ["psd"]
      },
      "image/vnd.airzip.accelerator.azv": {
        source: "iana",
        extensions: ["azv"]
      },
      "image/vnd.cns.inf2": {
        source: "iana"
      },
      "image/vnd.dece.graphic": {
        source: "iana",
        extensions: ["uvi", "uvvi", "uvg", "uvvg"]
      },
      "image/vnd.djvu": {
        source: "iana",
        extensions: ["djvu", "djv"]
      },
      "image/vnd.dvb.subtitle": {
        source: "iana",
        extensions: ["sub"]
      },
      "image/vnd.dwg": {
        source: "iana",
        extensions: ["dwg"]
      },
      "image/vnd.dxf": {
        source: "iana",
        extensions: ["dxf"]
      },
      "image/vnd.fastbidsheet": {
        source: "iana",
        extensions: ["fbs"]
      },
      "image/vnd.fpx": {
        source: "iana",
        extensions: ["fpx"]
      },
      "image/vnd.fst": {
        source: "iana",
        extensions: ["fst"]
      },
      "image/vnd.fujixerox.edmics-mmr": {
        source: "iana",
        extensions: ["mmr"]
      },
      "image/vnd.fujixerox.edmics-rlc": {
        source: "iana",
        extensions: ["rlc"]
      },
      "image/vnd.globalgraphics.pgb": {
        source: "iana"
      },
      "image/vnd.microsoft.icon": {
        source: "iana",
        compressible: true,
        extensions: ["ico"]
      },
      "image/vnd.mix": {
        source: "iana"
      },
      "image/vnd.mozilla.apng": {
        source: "iana"
      },
      "image/vnd.ms-dds": {
        compressible: true,
        extensions: ["dds"]
      },
      "image/vnd.ms-modi": {
        source: "iana",
        extensions: ["mdi"]
      },
      "image/vnd.ms-photo": {
        source: "apache",
        extensions: ["wdp"]
      },
      "image/vnd.net-fpx": {
        source: "iana",
        extensions: ["npx"]
      },
      "image/vnd.pco.b16": {
        source: "iana",
        extensions: ["b16"]
      },
      "image/vnd.radiance": {
        source: "iana"
      },
      "image/vnd.sealed.png": {
        source: "iana"
      },
      "image/vnd.sealedmedia.softseal.gif": {
        source: "iana"
      },
      "image/vnd.sealedmedia.softseal.jpg": {
        source: "iana"
      },
      "image/vnd.svf": {
        source: "iana"
      },
      "image/vnd.tencent.tap": {
        source: "iana",
        extensions: ["tap"]
      },
      "image/vnd.valve.source.texture": {
        source: "iana",
        extensions: ["vtf"]
      },
      "image/vnd.wap.wbmp": {
        source: "iana",
        extensions: ["wbmp"]
      },
      "image/vnd.xiff": {
        source: "iana",
        extensions: ["xif"]
      },
      "image/vnd.zbrush.pcx": {
        source: "iana",
        extensions: ["pcx"]
      },
      "image/webp": {
        source: "apache",
        extensions: ["webp"]
      },
      "image/wmf": {
        source: "iana",
        extensions: ["wmf"]
      },
      "image/x-3ds": {
        source: "apache",
        extensions: ["3ds"]
      },
      "image/x-cmu-raster": {
        source: "apache",
        extensions: ["ras"]
      },
      "image/x-cmx": {
        source: "apache",
        extensions: ["cmx"]
      },
      "image/x-freehand": {
        source: "apache",
        extensions: ["fh", "fhc", "fh4", "fh5", "fh7"]
      },
      "image/x-icon": {
        source: "apache",
        compressible: true,
        extensions: ["ico"]
      },
      "image/x-jng": {
        source: "nginx",
        extensions: ["jng"]
      },
      "image/x-mrsid-image": {
        source: "apache",
        extensions: ["sid"]
      },
      "image/x-ms-bmp": {
        source: "nginx",
        compressible: true,
        extensions: ["bmp"]
      },
      "image/x-pcx": {
        source: "apache",
        extensions: ["pcx"]
      },
      "image/x-pict": {
        source: "apache",
        extensions: ["pic", "pct"]
      },
      "image/x-portable-anymap": {
        source: "apache",
        extensions: ["pnm"]
      },
      "image/x-portable-bitmap": {
        source: "apache",
        extensions: ["pbm"]
      },
      "image/x-portable-graymap": {
        source: "apache",
        extensions: ["pgm"]
      },
      "image/x-portable-pixmap": {
        source: "apache",
        extensions: ["ppm"]
      },
      "image/x-rgb": {
        source: "apache",
        extensions: ["rgb"]
      },
      "image/x-tga": {
        source: "apache",
        extensions: ["tga"]
      },
      "image/x-xbitmap": {
        source: "apache",
        extensions: ["xbm"]
      },
      "image/x-xcf": {
        compressible: false
      },
      "image/x-xpixmap": {
        source: "apache",
        extensions: ["xpm"]
      },
      "image/x-xwindowdump": {
        source: "apache",
        extensions: ["xwd"]
      },
      "message/cpim": {
        source: "iana"
      },
      "message/delivery-status": {
        source: "iana"
      },
      "message/disposition-notification": {
        source: "iana",
        extensions: [
          "disposition-notification"
        ]
      },
      "message/external-body": {
        source: "iana"
      },
      "message/feedback-report": {
        source: "iana"
      },
      "message/global": {
        source: "iana",
        extensions: ["u8msg"]
      },
      "message/global-delivery-status": {
        source: "iana",
        extensions: ["u8dsn"]
      },
      "message/global-disposition-notification": {
        source: "iana",
        extensions: ["u8mdn"]
      },
      "message/global-headers": {
        source: "iana",
        extensions: ["u8hdr"]
      },
      "message/http": {
        source: "iana",
        compressible: false
      },
      "message/imdn+xml": {
        source: "iana",
        compressible: true
      },
      "message/news": {
        source: "iana"
      },
      "message/partial": {
        source: "iana",
        compressible: false
      },
      "message/rfc822": {
        source: "iana",
        compressible: true,
        extensions: ["eml", "mime"]
      },
      "message/s-http": {
        source: "iana"
      },
      "message/sip": {
        source: "iana"
      },
      "message/sipfrag": {
        source: "iana"
      },
      "message/tracking-status": {
        source: "iana"
      },
      "message/vnd.si.simp": {
        source: "iana"
      },
      "message/vnd.wfa.wsc": {
        source: "iana",
        extensions: ["wsc"]
      },
      "model/3mf": {
        source: "iana",
        extensions: ["3mf"]
      },
      "model/e57": {
        source: "iana"
      },
      "model/gltf+json": {
        source: "iana",
        compressible: true,
        extensions: ["gltf"]
      },
      "model/gltf-binary": {
        source: "iana",
        compressible: true,
        extensions: ["glb"]
      },
      "model/iges": {
        source: "iana",
        compressible: false,
        extensions: ["igs", "iges"]
      },
      "model/mesh": {
        source: "iana",
        compressible: false,
        extensions: ["msh", "mesh", "silo"]
      },
      "model/mtl": {
        source: "iana",
        extensions: ["mtl"]
      },
      "model/obj": {
        source: "iana",
        extensions: ["obj"]
      },
      "model/step": {
        source: "iana"
      },
      "model/step+xml": {
        source: "iana",
        compressible: true,
        extensions: ["stpx"]
      },
      "model/step+zip": {
        source: "iana",
        compressible: false,
        extensions: ["stpz"]
      },
      "model/step-xml+zip": {
        source: "iana",
        compressible: false,
        extensions: ["stpxz"]
      },
      "model/stl": {
        source: "iana",
        extensions: ["stl"]
      },
      "model/vnd.collada+xml": {
        source: "iana",
        compressible: true,
        extensions: ["dae"]
      },
      "model/vnd.dwf": {
        source: "iana",
        extensions: ["dwf"]
      },
      "model/vnd.flatland.3dml": {
        source: "iana"
      },
      "model/vnd.gdl": {
        source: "iana",
        extensions: ["gdl"]
      },
      "model/vnd.gs-gdl": {
        source: "apache"
      },
      "model/vnd.gs.gdl": {
        source: "iana"
      },
      "model/vnd.gtw": {
        source: "iana",
        extensions: ["gtw"]
      },
      "model/vnd.moml+xml": {
        source: "iana",
        compressible: true
      },
      "model/vnd.mts": {
        source: "iana",
        extensions: ["mts"]
      },
      "model/vnd.opengex": {
        source: "iana",
        extensions: ["ogex"]
      },
      "model/vnd.parasolid.transmit.binary": {
        source: "iana",
        extensions: ["x_b"]
      },
      "model/vnd.parasolid.transmit.text": {
        source: "iana",
        extensions: ["x_t"]
      },
      "model/vnd.pytha.pyox": {
        source: "iana"
      },
      "model/vnd.rosette.annotated-data-model": {
        source: "iana"
      },
      "model/vnd.sap.vds": {
        source: "iana",
        extensions: ["vds"]
      },
      "model/vnd.usdz+zip": {
        source: "iana",
        compressible: false,
        extensions: ["usdz"]
      },
      "model/vnd.valve.source.compiled-map": {
        source: "iana",
        extensions: ["bsp"]
      },
      "model/vnd.vtu": {
        source: "iana",
        extensions: ["vtu"]
      },
      "model/vrml": {
        source: "iana",
        compressible: false,
        extensions: ["wrl", "vrml"]
      },
      "model/x3d+binary": {
        source: "apache",
        compressible: false,
        extensions: ["x3db", "x3dbz"]
      },
      "model/x3d+fastinfoset": {
        source: "iana",
        extensions: ["x3db"]
      },
      "model/x3d+vrml": {
        source: "apache",
        compressible: false,
        extensions: ["x3dv", "x3dvz"]
      },
      "model/x3d+xml": {
        source: "iana",
        compressible: true,
        extensions: ["x3d", "x3dz"]
      },
      "model/x3d-vrml": {
        source: "iana",
        extensions: ["x3dv"]
      },
      "multipart/alternative": {
        source: "iana",
        compressible: false
      },
      "multipart/appledouble": {
        source: "iana"
      },
      "multipart/byteranges": {
        source: "iana"
      },
      "multipart/digest": {
        source: "iana"
      },
      "multipart/encrypted": {
        source: "iana",
        compressible: false
      },
      "multipart/form-data": {
        source: "iana",
        compressible: false
      },
      "multipart/header-set": {
        source: "iana"
      },
      "multipart/mixed": {
        source: "iana"
      },
      "multipart/multilingual": {
        source: "iana"
      },
      "multipart/parallel": {
        source: "iana"
      },
      "multipart/related": {
        source: "iana",
        compressible: false
      },
      "multipart/report": {
        source: "iana"
      },
      "multipart/signed": {
        source: "iana",
        compressible: false
      },
      "multipart/vnd.bint.med-plus": {
        source: "iana"
      },
      "multipart/voice-message": {
        source: "iana"
      },
      "multipart/x-mixed-replace": {
        source: "iana"
      },
      "text/1d-interleaved-parityfec": {
        source: "iana"
      },
      "text/cache-manifest": {
        source: "iana",
        compressible: true,
        extensions: ["appcache", "manifest"]
      },
      "text/calendar": {
        source: "iana",
        extensions: ["ics", "ifb"]
      },
      "text/calender": {
        compressible: true
      },
      "text/cmd": {
        compressible: true
      },
      "text/coffeescript": {
        extensions: ["coffee", "litcoffee"]
      },
      "text/cql": {
        source: "iana"
      },
      "text/cql-expression": {
        source: "iana"
      },
      "text/cql-identifier": {
        source: "iana"
      },
      "text/css": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["css"]
      },
      "text/csv": {
        source: "iana",
        compressible: true,
        extensions: ["csv"]
      },
      "text/csv-schema": {
        source: "iana"
      },
      "text/directory": {
        source: "iana"
      },
      "text/dns": {
        source: "iana"
      },
      "text/ecmascript": {
        source: "iana"
      },
      "text/encaprtp": {
        source: "iana"
      },
      "text/enriched": {
        source: "iana"
      },
      "text/fhirpath": {
        source: "iana"
      },
      "text/flexfec": {
        source: "iana"
      },
      "text/fwdred": {
        source: "iana"
      },
      "text/gff3": {
        source: "iana"
      },
      "text/grammar-ref-list": {
        source: "iana"
      },
      "text/html": {
        source: "iana",
        compressible: true,
        extensions: ["html", "htm", "shtml"]
      },
      "text/jade": {
        extensions: ["jade"]
      },
      "text/javascript": {
        source: "iana",
        compressible: true
      },
      "text/jcr-cnd": {
        source: "iana"
      },
      "text/jsx": {
        compressible: true,
        extensions: ["jsx"]
      },
      "text/less": {
        compressible: true,
        extensions: ["less"]
      },
      "text/markdown": {
        source: "iana",
        compressible: true,
        extensions: ["markdown", "md"]
      },
      "text/mathml": {
        source: "nginx",
        extensions: ["mml"]
      },
      "text/mdx": {
        compressible: true,
        extensions: ["mdx"]
      },
      "text/mizar": {
        source: "iana"
      },
      "text/n3": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["n3"]
      },
      "text/parameters": {
        source: "iana",
        charset: "UTF-8"
      },
      "text/parityfec": {
        source: "iana"
      },
      "text/plain": {
        source: "iana",
        compressible: true,
        extensions: ["txt", "text", "conf", "def", "list", "log", "in", "ini"]
      },
      "text/provenance-notation": {
        source: "iana",
        charset: "UTF-8"
      },
      "text/prs.fallenstein.rst": {
        source: "iana"
      },
      "text/prs.lines.tag": {
        source: "iana",
        extensions: ["dsc"]
      },
      "text/prs.prop.logic": {
        source: "iana"
      },
      "text/raptorfec": {
        source: "iana"
      },
      "text/red": {
        source: "iana"
      },
      "text/rfc822-headers": {
        source: "iana"
      },
      "text/richtext": {
        source: "iana",
        compressible: true,
        extensions: ["rtx"]
      },
      "text/rtf": {
        source: "iana",
        compressible: true,
        extensions: ["rtf"]
      },
      "text/rtp-enc-aescm128": {
        source: "iana"
      },
      "text/rtploopback": {
        source: "iana"
      },
      "text/rtx": {
        source: "iana"
      },
      "text/sgml": {
        source: "iana",
        extensions: ["sgml", "sgm"]
      },
      "text/shaclc": {
        source: "iana"
      },
      "text/shex": {
        source: "iana",
        extensions: ["shex"]
      },
      "text/slim": {
        extensions: ["slim", "slm"]
      },
      "text/spdx": {
        source: "iana",
        extensions: ["spdx"]
      },
      "text/strings": {
        source: "iana"
      },
      "text/stylus": {
        extensions: ["stylus", "styl"]
      },
      "text/t140": {
        source: "iana"
      },
      "text/tab-separated-values": {
        source: "iana",
        compressible: true,
        extensions: ["tsv"]
      },
      "text/troff": {
        source: "iana",
        extensions: ["t", "tr", "roff", "man", "me", "ms"]
      },
      "text/turtle": {
        source: "iana",
        charset: "UTF-8",
        extensions: ["ttl"]
      },
      "text/ulpfec": {
        source: "iana"
      },
      "text/uri-list": {
        source: "iana",
        compressible: true,
        extensions: ["uri", "uris", "urls"]
      },
      "text/vcard": {
        source: "iana",
        compressible: true,
        extensions: ["vcard"]
      },
      "text/vnd.a": {
        source: "iana"
      },
      "text/vnd.abc": {
        source: "iana"
      },
      "text/vnd.ascii-art": {
        source: "iana"
      },
      "text/vnd.curl": {
        source: "iana",
        extensions: ["curl"]
      },
      "text/vnd.curl.dcurl": {
        source: "apache",
        extensions: ["dcurl"]
      },
      "text/vnd.curl.mcurl": {
        source: "apache",
        extensions: ["mcurl"]
      },
      "text/vnd.curl.scurl": {
        source: "apache",
        extensions: ["scurl"]
      },
      "text/vnd.debian.copyright": {
        source: "iana",
        charset: "UTF-8"
      },
      "text/vnd.dmclientscript": {
        source: "iana"
      },
      "text/vnd.dvb.subtitle": {
        source: "iana",
        extensions: ["sub"]
      },
      "text/vnd.esmertec.theme-descriptor": {
        source: "iana",
        charset: "UTF-8"
      },
      "text/vnd.familysearch.gedcom": {
        source: "iana",
        extensions: ["ged"]
      },
      "text/vnd.ficlab.flt": {
        source: "iana"
      },
      "text/vnd.fly": {
        source: "iana",
        extensions: ["fly"]
      },
      "text/vnd.fmi.flexstor": {
        source: "iana",
        extensions: ["flx"]
      },
      "text/vnd.gml": {
        source: "iana"
      },
      "text/vnd.graphviz": {
        source: "iana",
        extensions: ["gv"]
      },
      "text/vnd.hans": {
        source: "iana"
      },
      "text/vnd.hgl": {
        source: "iana"
      },
      "text/vnd.in3d.3dml": {
        source: "iana",
        extensions: ["3dml"]
      },
      "text/vnd.in3d.spot": {
        source: "iana",
        extensions: ["spot"]
      },
      "text/vnd.iptc.newsml": {
        source: "iana"
      },
      "text/vnd.iptc.nitf": {
        source: "iana"
      },
      "text/vnd.latex-z": {
        source: "iana"
      },
      "text/vnd.motorola.reflex": {
        source: "iana"
      },
      "text/vnd.ms-mediapackage": {
        source: "iana"
      },
      "text/vnd.net2phone.commcenter.command": {
        source: "iana"
      },
      "text/vnd.radisys.msml-basic-layout": {
        source: "iana"
      },
      "text/vnd.senx.warpscript": {
        source: "iana"
      },
      "text/vnd.si.uricatalogue": {
        source: "iana"
      },
      "text/vnd.sosi": {
        source: "iana"
      },
      "text/vnd.sun.j2me.app-descriptor": {
        source: "iana",
        charset: "UTF-8",
        extensions: ["jad"]
      },
      "text/vnd.trolltech.linguist": {
        source: "iana",
        charset: "UTF-8"
      },
      "text/vnd.wap.si": {
        source: "iana"
      },
      "text/vnd.wap.sl": {
        source: "iana"
      },
      "text/vnd.wap.wml": {
        source: "iana",
        extensions: ["wml"]
      },
      "text/vnd.wap.wmlscript": {
        source: "iana",
        extensions: ["wmls"]
      },
      "text/vtt": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["vtt"]
      },
      "text/x-asm": {
        source: "apache",
        extensions: ["s", "asm"]
      },
      "text/x-c": {
        source: "apache",
        extensions: ["c", "cc", "cxx", "cpp", "h", "hh", "dic"]
      },
      "text/x-component": {
        source: "nginx",
        extensions: ["htc"]
      },
      "text/x-fortran": {
        source: "apache",
        extensions: ["f", "for", "f77", "f90"]
      },
      "text/x-gwt-rpc": {
        compressible: true
      },
      "text/x-handlebars-template": {
        extensions: ["hbs"]
      },
      "text/x-java-source": {
        source: "apache",
        extensions: ["java"]
      },
      "text/x-jquery-tmpl": {
        compressible: true
      },
      "text/x-lua": {
        extensions: ["lua"]
      },
      "text/x-markdown": {
        compressible: true,
        extensions: ["mkd"]
      },
      "text/x-nfo": {
        source: "apache",
        extensions: ["nfo"]
      },
      "text/x-opml": {
        source: "apache",
        extensions: ["opml"]
      },
      "text/x-org": {
        compressible: true,
        extensions: ["org"]
      },
      "text/x-pascal": {
        source: "apache",
        extensions: ["p", "pas"]
      },
      "text/x-processing": {
        compressible: true,
        extensions: ["pde"]
      },
      "text/x-sass": {
        extensions: ["sass"]
      },
      "text/x-scss": {
        extensions: ["scss"]
      },
      "text/x-setext": {
        source: "apache",
        extensions: ["etx"]
      },
      "text/x-sfv": {
        source: "apache",
        extensions: ["sfv"]
      },
      "text/x-suse-ymp": {
        compressible: true,
        extensions: ["ymp"]
      },
      "text/x-uuencode": {
        source: "apache",
        extensions: ["uu"]
      },
      "text/x-vcalendar": {
        source: "apache",
        extensions: ["vcs"]
      },
      "text/x-vcard": {
        source: "apache",
        extensions: ["vcf"]
      },
      "text/xml": {
        source: "iana",
        compressible: true,
        extensions: ["xml"]
      },
      "text/xml-external-parsed-entity": {
        source: "iana"
      },
      "text/yaml": {
        compressible: true,
        extensions: ["yaml", "yml"]
      },
      "video/1d-interleaved-parityfec": {
        source: "iana"
      },
      "video/3gpp": {
        source: "iana",
        extensions: ["3gp", "3gpp"]
      },
      "video/3gpp-tt": {
        source: "iana"
      },
      "video/3gpp2": {
        source: "iana",
        extensions: ["3g2"]
      },
      "video/av1": {
        source: "iana"
      },
      "video/bmpeg": {
        source: "iana"
      },
      "video/bt656": {
        source: "iana"
      },
      "video/celb": {
        source: "iana"
      },
      "video/dv": {
        source: "iana"
      },
      "video/encaprtp": {
        source: "iana"
      },
      "video/ffv1": {
        source: "iana"
      },
      "video/flexfec": {
        source: "iana"
      },
      "video/h261": {
        source: "iana",
        extensions: ["h261"]
      },
      "video/h263": {
        source: "iana",
        extensions: ["h263"]
      },
      "video/h263-1998": {
        source: "iana"
      },
      "video/h263-2000": {
        source: "iana"
      },
      "video/h264": {
        source: "iana",
        extensions: ["h264"]
      },
      "video/h264-rcdo": {
        source: "iana"
      },
      "video/h264-svc": {
        source: "iana"
      },
      "video/h265": {
        source: "iana"
      },
      "video/iso.segment": {
        source: "iana",
        extensions: ["m4s"]
      },
      "video/jpeg": {
        source: "iana",
        extensions: ["jpgv"]
      },
      "video/jpeg2000": {
        source: "iana"
      },
      "video/jpm": {
        source: "apache",
        extensions: ["jpm", "jpgm"]
      },
      "video/jxsv": {
        source: "iana"
      },
      "video/mj2": {
        source: "iana",
        extensions: ["mj2", "mjp2"]
      },
      "video/mp1s": {
        source: "iana"
      },
      "video/mp2p": {
        source: "iana"
      },
      "video/mp2t": {
        source: "iana",
        extensions: ["ts"]
      },
      "video/mp4": {
        source: "iana",
        compressible: false,
        extensions: ["mp4", "mp4v", "mpg4"]
      },
      "video/mp4v-es": {
        source: "iana"
      },
      "video/mpeg": {
        source: "iana",
        compressible: false,
        extensions: ["mpeg", "mpg", "mpe", "m1v", "m2v"]
      },
      "video/mpeg4-generic": {
        source: "iana"
      },
      "video/mpv": {
        source: "iana"
      },
      "video/nv": {
        source: "iana"
      },
      "video/ogg": {
        source: "iana",
        compressible: false,
        extensions: ["ogv"]
      },
      "video/parityfec": {
        source: "iana"
      },
      "video/pointer": {
        source: "iana"
      },
      "video/quicktime": {
        source: "iana",
        compressible: false,
        extensions: ["qt", "mov"]
      },
      "video/raptorfec": {
        source: "iana"
      },
      "video/raw": {
        source: "iana"
      },
      "video/rtp-enc-aescm128": {
        source: "iana"
      },
      "video/rtploopback": {
        source: "iana"
      },
      "video/rtx": {
        source: "iana"
      },
      "video/scip": {
        source: "iana"
      },
      "video/smpte291": {
        source: "iana"
      },
      "video/smpte292m": {
        source: "iana"
      },
      "video/ulpfec": {
        source: "iana"
      },
      "video/vc1": {
        source: "iana"
      },
      "video/vc2": {
        source: "iana"
      },
      "video/vnd.cctv": {
        source: "iana"
      },
      "video/vnd.dece.hd": {
        source: "iana",
        extensions: ["uvh", "uvvh"]
      },
      "video/vnd.dece.mobile": {
        source: "iana",
        extensions: ["uvm", "uvvm"]
      },
      "video/vnd.dece.mp4": {
        source: "iana"
      },
      "video/vnd.dece.pd": {
        source: "iana",
        extensions: ["uvp", "uvvp"]
      },
      "video/vnd.dece.sd": {
        source: "iana",
        extensions: ["uvs", "uvvs"]
      },
      "video/vnd.dece.video": {
        source: "iana",
        extensions: ["uvv", "uvvv"]
      },
      "video/vnd.directv.mpeg": {
        source: "iana"
      },
      "video/vnd.directv.mpeg-tts": {
        source: "iana"
      },
      "video/vnd.dlna.mpeg-tts": {
        source: "iana"
      },
      "video/vnd.dvb.file": {
        source: "iana",
        extensions: ["dvb"]
      },
      "video/vnd.fvt": {
        source: "iana",
        extensions: ["fvt"]
      },
      "video/vnd.hns.video": {
        source: "iana"
      },
      "video/vnd.iptvforum.1dparityfec-1010": {
        source: "iana"
      },
      "video/vnd.iptvforum.1dparityfec-2005": {
        source: "iana"
      },
      "video/vnd.iptvforum.2dparityfec-1010": {
        source: "iana"
      },
      "video/vnd.iptvforum.2dparityfec-2005": {
        source: "iana"
      },
      "video/vnd.iptvforum.ttsavc": {
        source: "iana"
      },
      "video/vnd.iptvforum.ttsmpeg2": {
        source: "iana"
      },
      "video/vnd.motorola.video": {
        source: "iana"
      },
      "video/vnd.motorola.videop": {
        source: "iana"
      },
      "video/vnd.mpegurl": {
        source: "iana",
        extensions: ["mxu", "m4u"]
      },
      "video/vnd.ms-playready.media.pyv": {
        source: "iana",
        extensions: ["pyv"]
      },
      "video/vnd.nokia.interleaved-multimedia": {
        source: "iana"
      },
      "video/vnd.nokia.mp4vr": {
        source: "iana"
      },
      "video/vnd.nokia.videovoip": {
        source: "iana"
      },
      "video/vnd.objectvideo": {
        source: "iana"
      },
      "video/vnd.radgamettools.bink": {
        source: "iana"
      },
      "video/vnd.radgamettools.smacker": {
        source: "iana"
      },
      "video/vnd.sealed.mpeg1": {
        source: "iana"
      },
      "video/vnd.sealed.mpeg4": {
        source: "iana"
      },
      "video/vnd.sealed.swf": {
        source: "iana"
      },
      "video/vnd.sealedmedia.softseal.mov": {
        source: "iana"
      },
      "video/vnd.uvvu.mp4": {
        source: "iana",
        extensions: ["uvu", "uvvu"]
      },
      "video/vnd.vivo": {
        source: "iana",
        extensions: ["viv"]
      },
      "video/vnd.youtube.yt": {
        source: "iana"
      },
      "video/vp8": {
        source: "iana"
      },
      "video/vp9": {
        source: "iana"
      },
      "video/webm": {
        source: "apache",
        compressible: false,
        extensions: ["webm"]
      },
      "video/x-f4v": {
        source: "apache",
        extensions: ["f4v"]
      },
      "video/x-fli": {
        source: "apache",
        extensions: ["fli"]
      },
      "video/x-flv": {
        source: "apache",
        compressible: false,
        extensions: ["flv"]
      },
      "video/x-m4v": {
        source: "apache",
        extensions: ["m4v"]
      },
      "video/x-matroska": {
        source: "apache",
        compressible: false,
        extensions: ["mkv", "mk3d", "mks"]
      },
      "video/x-mng": {
        source: "apache",
        extensions: ["mng"]
      },
      "video/x-ms-asf": {
        source: "apache",
        extensions: ["asf", "asx"]
      },
      "video/x-ms-vob": {
        source: "apache",
        extensions: ["vob"]
      },
      "video/x-ms-wm": {
        source: "apache",
        extensions: ["wm"]
      },
      "video/x-ms-wmv": {
        source: "apache",
        compressible: false,
        extensions: ["wmv"]
      },
      "video/x-ms-wmx": {
        source: "apache",
        extensions: ["wmx"]
      },
      "video/x-ms-wvx": {
        source: "apache",
        extensions: ["wvx"]
      },
      "video/x-msvideo": {
        source: "apache",
        extensions: ["avi"]
      },
      "video/x-sgi-movie": {
        source: "apache",
        extensions: ["movie"]
      },
      "video/x-smv": {
        source: "apache",
        extensions: ["smv"]
      },
      "x-conference/x-cooltalk": {
        source: "apache",
        extensions: ["ice"]
      },
      "x-shader/x-fragment": {
        compressible: true
      },
      "x-shader/x-vertex": {
        compressible: true
      }
    };
  }
});

// node_modules/mime-db/index.js
var require_mime_db = __commonJS({
  "node_modules/mime-db/index.js"(exports2, module2) {
    module2.exports = require_db();
  }
});

// node_modules/mime-types/index.js
var require_mime_types = __commonJS({
  "node_modules/mime-types/index.js"(exports2) {
    "use strict";
    var db = require_mime_db();
    var extname = require("path").extname;
    var EXTRACT_TYPE_REGEXP = /^\s*([^;\s]*)(?:;|\s|$)/;
    var TEXT_TYPE_REGEXP = /^text\//i;
    exports2.charset = charset;
    exports2.charsets = { lookup: charset };
    exports2.contentType = contentType;
    exports2.extension = extension;
    exports2.extensions = /* @__PURE__ */ Object.create(null);
    exports2.lookup = lookup;
    exports2.types = /* @__PURE__ */ Object.create(null);
    populateMaps(exports2.extensions, exports2.types);
    function charset(type) {
      if (!type || typeof type !== "string") {
        return false;
      }
      var match = EXTRACT_TYPE_REGEXP.exec(type);
      var mime = match && db[match[1].toLowerCase()];
      if (mime && mime.charset) {
        return mime.charset;
      }
      if (match && TEXT_TYPE_REGEXP.test(match[1])) {
        return "UTF-8";
      }
      return false;
    }
    function contentType(str) {
      if (!str || typeof str !== "string") {
        return false;
      }
      var mime = str.indexOf("/") === -1 ? exports2.lookup(str) : str;
      if (!mime) {
        return false;
      }
      if (mime.indexOf("charset") === -1) {
        var charset2 = exports2.charset(mime);
        if (charset2) mime += "; charset=" + charset2.toLowerCase();
      }
      return mime;
    }
    function extension(type) {
      if (!type || typeof type !== "string") {
        return false;
      }
      var match = EXTRACT_TYPE_REGEXP.exec(type);
      var exts = match && exports2.extensions[match[1].toLowerCase()];
      if (!exts || !exts.length) {
        return false;
      }
      return exts[0];
    }
    function lookup(path7) {
      if (!path7 || typeof path7 !== "string") {
        return false;
      }
      var extension2 = extname("x." + path7).toLowerCase().substr(1);
      if (!extension2) {
        return false;
      }
      return exports2.types[extension2] || false;
    }
    function populateMaps(extensions, types) {
      var preference = ["nginx", "apache", void 0, "iana"];
      Object.keys(db).forEach(function forEachMimeType(type) {
        var mime = db[type];
        var exts = mime.extensions;
        if (!exts || !exts.length) {
          return;
        }
        extensions[type] = exts;
        for (var i = 0; i < exts.length; i++) {
          var extension2 = exts[i];
          if (types[extension2]) {
            var from = preference.indexOf(db[types[extension2]].source);
            var to = preference.indexOf(mime.source);
            if (types[extension2] !== "application/octet-stream" && (from > to || from === to && types[extension2].substr(0, 12) === "application/")) {
              continue;
            }
          }
          types[extension2] = type;
        }
      });
    }
  }
});

// node_modules/type-is/index.js
var require_type_is = __commonJS({
  "node_modules/type-is/index.js"(exports2, module2) {
    "use strict";
    var typer = require_media_typer();
    var mime = require_mime_types();
    module2.exports = typeofrequest;
    module2.exports.is = typeis;
    module2.exports.hasBody = hasbody;
    module2.exports.normalize = normalize;
    module2.exports.match = mimeMatch;
    function typeis(value, types_) {
      var i;
      var types = types_;
      var val = tryNormalizeType(value);
      if (!val) {
        return false;
      }
      if (types && !Array.isArray(types)) {
        types = new Array(arguments.length - 1);
        for (i = 0; i < types.length; i++) {
          types[i] = arguments[i + 1];
        }
      }
      if (!types || !types.length) {
        return val;
      }
      var type;
      for (i = 0; i < types.length; i++) {
        if (mimeMatch(normalize(type = types[i]), val)) {
          return type[0] === "+" || type.indexOf("*") !== -1 ? val : type;
        }
      }
      return false;
    }
    function hasbody(req) {
      return req.headers["transfer-encoding"] !== void 0 || !isNaN(req.headers["content-length"]);
    }
    function typeofrequest(req, types_) {
      var types = types_;
      if (!hasbody(req)) {
        return null;
      }
      if (arguments.length > 2) {
        types = new Array(arguments.length - 1);
        for (var i = 0; i < types.length; i++) {
          types[i] = arguments[i + 1];
        }
      }
      var value = req.headers["content-type"];
      return typeis(value, types);
    }
    function normalize(type) {
      if (typeof type !== "string") {
        return false;
      }
      switch (type) {
        case "urlencoded":
          return "application/x-www-form-urlencoded";
        case "multipart":
          return "multipart/*";
      }
      if (type[0] === "+") {
        return "*/*" + type;
      }
      return type.indexOf("/") === -1 ? mime.lookup(type) : type;
    }
    function mimeMatch(expected, actual) {
      if (expected === false) {
        return false;
      }
      var actualParts = actual.split("/");
      var expectedParts = expected.split("/");
      if (actualParts.length !== 2 || expectedParts.length !== 2) {
        return false;
      }
      if (expectedParts[0] !== "*" && expectedParts[0] !== actualParts[0]) {
        return false;
      }
      if (expectedParts[1].substr(0, 2) === "*+") {
        return expectedParts[1].length <= actualParts[1].length + 1 && expectedParts[1].substr(1) === actualParts[1].substr(1 - expectedParts[1].length);
      }
      if (expectedParts[1] !== "*" && expectedParts[1] !== actualParts[1]) {
        return false;
      }
      return true;
    }
    function normalizeType(value) {
      var type = typer.parse(value);
      type.parameters = void 0;
      return typer.format(type);
    }
    function tryNormalizeType(value) {
      if (!value) {
        return null;
      }
      try {
        return normalizeType(value);
      } catch (err) {
        return null;
      }
    }
  }
});

// node_modules/busboy/lib/utils.js
var require_utils = __commonJS({
  "node_modules/busboy/lib/utils.js"(exports2, module2) {
    "use strict";
    function parseContentType(str) {
      if (str.length === 0)
        return;
      const params = /* @__PURE__ */ Object.create(null);
      let i = 0;
      for (; i < str.length; ++i) {
        const code = str.charCodeAt(i);
        if (TOKEN[code] !== 1) {
          if (code !== 47 || i === 0)
            return;
          break;
        }
      }
      if (i === str.length)
        return;
      const type = str.slice(0, i).toLowerCase();
      const subtypeStart = ++i;
      for (; i < str.length; ++i) {
        const code = str.charCodeAt(i);
        if (TOKEN[code] !== 1) {
          if (i === subtypeStart)
            return;
          if (parseContentTypeParams(str, i, params) === void 0)
            return;
          break;
        }
      }
      if (i === subtypeStart)
        return;
      const subtype = str.slice(subtypeStart, i).toLowerCase();
      return { type, subtype, params };
    }
    function parseContentTypeParams(str, i, params) {
      while (i < str.length) {
        for (; i < str.length; ++i) {
          const code = str.charCodeAt(i);
          if (code !== 32 && code !== 9)
            break;
        }
        if (i === str.length)
          break;
        if (str.charCodeAt(i++) !== 59)
          return;
        for (; i < str.length; ++i) {
          const code = str.charCodeAt(i);
          if (code !== 32 && code !== 9)
            break;
        }
        if (i === str.length)
          return;
        let name;
        const nameStart = i;
        for (; i < str.length; ++i) {
          const code = str.charCodeAt(i);
          if (TOKEN[code] !== 1) {
            if (code !== 61)
              return;
            break;
          }
        }
        if (i === str.length)
          return;
        name = str.slice(nameStart, i);
        ++i;
        if (i === str.length)
          return;
        let value = "";
        let valueStart;
        if (str.charCodeAt(i) === 34) {
          valueStart = ++i;
          let escaping = false;
          for (; i < str.length; ++i) {
            const code = str.charCodeAt(i);
            if (code === 92) {
              if (escaping) {
                valueStart = i;
                escaping = false;
              } else {
                value += str.slice(valueStart, i);
                escaping = true;
              }
              continue;
            }
            if (code === 34) {
              if (escaping) {
                valueStart = i;
                escaping = false;
                continue;
              }
              value += str.slice(valueStart, i);
              break;
            }
            if (escaping) {
              valueStart = i - 1;
              escaping = false;
            }
            if (QDTEXT[code] !== 1)
              return;
          }
          if (i === str.length)
            return;
          ++i;
        } else {
          valueStart = i;
          for (; i < str.length; ++i) {
            const code = str.charCodeAt(i);
            if (TOKEN[code] !== 1) {
              if (i === valueStart)
                return;
              break;
            }
          }
          value = str.slice(valueStart, i);
        }
        name = name.toLowerCase();
        if (params[name] === void 0)
          params[name] = value;
      }
      return params;
    }
    function parseDisposition(str, defDecoder) {
      if (str.length === 0)
        return;
      const params = /* @__PURE__ */ Object.create(null);
      let i = 0;
      for (; i < str.length; ++i) {
        const code = str.charCodeAt(i);
        if (TOKEN[code] !== 1) {
          if (parseDispositionParams(str, i, params, defDecoder) === void 0)
            return;
          break;
        }
      }
      const type = str.slice(0, i).toLowerCase();
      return { type, params };
    }
    function parseDispositionParams(str, i, params, defDecoder) {
      while (i < str.length) {
        for (; i < str.length; ++i) {
          const code = str.charCodeAt(i);
          if (code !== 32 && code !== 9)
            break;
        }
        if (i === str.length)
          break;
        if (str.charCodeAt(i++) !== 59)
          return;
        for (; i < str.length; ++i) {
          const code = str.charCodeAt(i);
          if (code !== 32 && code !== 9)
            break;
        }
        if (i === str.length)
          return;
        let name;
        const nameStart = i;
        for (; i < str.length; ++i) {
          const code = str.charCodeAt(i);
          if (TOKEN[code] !== 1) {
            if (code === 61)
              break;
            return;
          }
        }
        if (i === str.length)
          return;
        let value = "";
        let valueStart;
        let charset;
        name = str.slice(nameStart, i);
        if (name.charCodeAt(name.length - 1) === 42) {
          const charsetStart = ++i;
          for (; i < str.length; ++i) {
            const code = str.charCodeAt(i);
            if (CHARSET[code] !== 1) {
              if (code !== 39)
                return;
              break;
            }
          }
          if (i === str.length)
            return;
          charset = str.slice(charsetStart, i);
          ++i;
          for (; i < str.length; ++i) {
            const code = str.charCodeAt(i);
            if (code === 39)
              break;
          }
          if (i === str.length)
            return;
          ++i;
          if (i === str.length)
            return;
          valueStart = i;
          let encode = 0;
          for (; i < str.length; ++i) {
            const code = str.charCodeAt(i);
            if (EXTENDED_VALUE[code] !== 1) {
              if (code === 37) {
                let hexUpper;
                let hexLower;
                if (i + 2 < str.length && (hexUpper = HEX_VALUES[str.charCodeAt(i + 1)]) !== -1 && (hexLower = HEX_VALUES[str.charCodeAt(i + 2)]) !== -1) {
                  const byteVal = (hexUpper << 4) + hexLower;
                  value += str.slice(valueStart, i);
                  value += String.fromCharCode(byteVal);
                  i += 2;
                  valueStart = i + 1;
                  if (byteVal >= 128)
                    encode = 2;
                  else if (encode === 0)
                    encode = 1;
                  continue;
                }
                return;
              }
              break;
            }
          }
          value += str.slice(valueStart, i);
          value = convertToUTF8(value, charset, encode);
          if (value === void 0)
            return;
        } else {
          ++i;
          if (i === str.length)
            return;
          if (str.charCodeAt(i) === 34) {
            valueStart = ++i;
            let escaping = false;
            for (; i < str.length; ++i) {
              const code = str.charCodeAt(i);
              if (code === 92) {
                if (escaping) {
                  valueStart = i;
                  escaping = false;
                } else {
                  value += str.slice(valueStart, i);
                  escaping = true;
                }
                continue;
              }
              if (code === 34) {
                if (escaping) {
                  valueStart = i;
                  escaping = false;
                  continue;
                }
                value += str.slice(valueStart, i);
                break;
              }
              if (escaping) {
                valueStart = i - 1;
                escaping = false;
              }
              if (QDTEXT[code] !== 1)
                return;
            }
            if (i === str.length)
              return;
            ++i;
          } else {
            valueStart = i;
            for (; i < str.length; ++i) {
              const code = str.charCodeAt(i);
              if (TOKEN[code] !== 1) {
                if (i === valueStart)
                  return;
                break;
              }
            }
            value = str.slice(valueStart, i);
          }
          value = defDecoder(value, 2);
          if (value === void 0)
            return;
        }
        name = name.toLowerCase();
        if (params[name] === void 0)
          params[name] = value;
      }
      return params;
    }
    function getDecoder(charset) {
      let lc;
      while (true) {
        switch (charset) {
          case "utf-8":
          case "utf8":
            return decoders.utf8;
          case "latin1":
          case "ascii":
          case "us-ascii":
          case "iso-8859-1":
          case "iso8859-1":
          case "iso88591":
          case "iso_8859-1":
          case "windows-1252":
          case "iso_8859-1:1987":
          case "cp1252":
          case "x-cp1252":
            return decoders.latin1;
          case "utf16le":
          case "utf-16le":
          case "ucs2":
          case "ucs-2":
            return decoders.utf16le;
          case "base64":
            return decoders.base64;
          default:
            if (lc === void 0) {
              lc = true;
              charset = charset.toLowerCase();
              continue;
            }
            return decoders.other.bind(charset);
        }
      }
    }
    var decoders = {
      utf8: (data, hint) => {
        if (data.length === 0)
          return "";
        if (typeof data === "string") {
          if (hint < 2)
            return data;
          data = Buffer.from(data, "latin1");
        }
        return data.utf8Slice(0, data.length);
      },
      latin1: (data, hint) => {
        if (data.length === 0)
          return "";
        if (typeof data === "string")
          return data;
        return data.latin1Slice(0, data.length);
      },
      utf16le: (data, hint) => {
        if (data.length === 0)
          return "";
        if (typeof data === "string")
          data = Buffer.from(data, "latin1");
        return data.ucs2Slice(0, data.length);
      },
      base64: (data, hint) => {
        if (data.length === 0)
          return "";
        if (typeof data === "string")
          data = Buffer.from(data, "latin1");
        return data.base64Slice(0, data.length);
      },
      other: (data, hint) => {
        if (data.length === 0)
          return "";
        if (typeof data === "string")
          data = Buffer.from(data, "latin1");
        try {
          const decoder = new TextDecoder(exports2);
          return decoder.decode(data);
        } catch {
        }
      }
    };
    function convertToUTF8(data, charset, hint) {
      const decode = getDecoder(charset);
      if (decode)
        return decode(data, hint);
    }
    function basename(path7) {
      if (typeof path7 !== "string")
        return "";
      for (let i = path7.length - 1; i >= 0; --i) {
        switch (path7.charCodeAt(i)) {
          case 47:
          case 92:
            path7 = path7.slice(i + 1);
            return path7 === ".." || path7 === "." ? "" : path7;
        }
      }
      return path7 === ".." || path7 === "." ? "" : path7;
    }
    var TOKEN = [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      0,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      1,
      1,
      0,
      1,
      1,
      0,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      1,
      0,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ];
    var QDTEXT = [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      1,
      0,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1
    ];
    var CHARSET = [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      0,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      1,
      0,
      0,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      1,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ];
    var EXTENDED_VALUE = [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      0,
      1,
      1,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      1,
      1,
      0,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      1,
      0,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ];
    var HEX_VALUES = [
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      10,
      11,
      12,
      13,
      14,
      15,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      10,
      11,
      12,
      13,
      14,
      15,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1
    ];
    module2.exports = {
      basename,
      convertToUTF8,
      getDecoder,
      parseContentType,
      parseDisposition
    };
  }
});

// node_modules/streamsearch/lib/sbmh.js
var require_sbmh = __commonJS({
  "node_modules/streamsearch/lib/sbmh.js"(exports2, module2) {
    "use strict";
    function memcmp(buf1, pos1, buf2, pos2, num) {
      for (let i = 0; i < num; ++i) {
        if (buf1[pos1 + i] !== buf2[pos2 + i])
          return false;
      }
      return true;
    }
    var SBMH = class {
      constructor(needle, cb) {
        if (typeof cb !== "function")
          throw new Error("Missing match callback");
        if (typeof needle === "string")
          needle = Buffer.from(needle);
        else if (!Buffer.isBuffer(needle))
          throw new Error(`Expected Buffer for needle, got ${typeof needle}`);
        const needleLen = needle.length;
        this.maxMatches = Infinity;
        this.matches = 0;
        this._cb = cb;
        this._lookbehindSize = 0;
        this._needle = needle;
        this._bufPos = 0;
        this._lookbehind = Buffer.allocUnsafe(needleLen);
        this._occ = [
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen,
          needleLen
        ];
        if (needleLen > 1) {
          for (let i = 0; i < needleLen - 1; ++i)
            this._occ[needle[i]] = needleLen - 1 - i;
        }
      }
      reset() {
        this.matches = 0;
        this._lookbehindSize = 0;
        this._bufPos = 0;
      }
      push(chunk, pos) {
        let result;
        if (!Buffer.isBuffer(chunk))
          chunk = Buffer.from(chunk, "latin1");
        const chunkLen = chunk.length;
        this._bufPos = pos || 0;
        while (result !== chunkLen && this.matches < this.maxMatches)
          result = feed(this, chunk);
        return result;
      }
      destroy() {
        const lbSize = this._lookbehindSize;
        if (lbSize)
          this._cb(false, this._lookbehind, 0, lbSize, false);
        this.reset();
      }
    };
    function feed(self2, data) {
      const len = data.length;
      const needle = self2._needle;
      const needleLen = needle.length;
      let pos = -self2._lookbehindSize;
      const lastNeedleCharPos = needleLen - 1;
      const lastNeedleChar = needle[lastNeedleCharPos];
      const end = len - needleLen;
      const occ = self2._occ;
      const lookbehind = self2._lookbehind;
      if (pos < 0) {
        while (pos < 0 && pos <= end) {
          const nextPos = pos + lastNeedleCharPos;
          const ch = nextPos < 0 ? lookbehind[self2._lookbehindSize + nextPos] : data[nextPos];
          if (ch === lastNeedleChar && matchNeedle(self2, data, pos, lastNeedleCharPos)) {
            self2._lookbehindSize = 0;
            ++self2.matches;
            if (pos > -self2._lookbehindSize)
              self2._cb(true, lookbehind, 0, self2._lookbehindSize + pos, false);
            else
              self2._cb(true, void 0, 0, 0, true);
            return self2._bufPos = pos + needleLen;
          }
          pos += occ[ch];
        }
        while (pos < 0 && !matchNeedle(self2, data, pos, len - pos))
          ++pos;
        if (pos < 0) {
          const bytesToCutOff = self2._lookbehindSize + pos;
          if (bytesToCutOff > 0) {
            self2._cb(false, lookbehind, 0, bytesToCutOff, false);
          }
          self2._lookbehindSize -= bytesToCutOff;
          lookbehind.copy(lookbehind, 0, bytesToCutOff, self2._lookbehindSize);
          lookbehind.set(data, self2._lookbehindSize);
          self2._lookbehindSize += len;
          self2._bufPos = len;
          return len;
        }
        self2._cb(false, lookbehind, 0, self2._lookbehindSize, false);
        self2._lookbehindSize = 0;
      }
      pos += self2._bufPos;
      const firstNeedleChar = needle[0];
      while (pos <= end) {
        const ch = data[pos + lastNeedleCharPos];
        if (ch === lastNeedleChar && data[pos] === firstNeedleChar && memcmp(needle, 0, data, pos, lastNeedleCharPos)) {
          ++self2.matches;
          if (pos > 0)
            self2._cb(true, data, self2._bufPos, pos, true);
          else
            self2._cb(true, void 0, 0, 0, true);
          return self2._bufPos = pos + needleLen;
        }
        pos += occ[ch];
      }
      while (pos < len) {
        if (data[pos] !== firstNeedleChar || !memcmp(data, pos, needle, 0, len - pos)) {
          ++pos;
          continue;
        }
        data.copy(lookbehind, 0, pos, len);
        self2._lookbehindSize = len - pos;
        break;
      }
      if (pos > 0)
        self2._cb(false, data, self2._bufPos, pos < len ? pos : len, true);
      self2._bufPos = len;
      return len;
    }
    function matchNeedle(self2, data, pos, len) {
      const lb = self2._lookbehind;
      const lbSize = self2._lookbehindSize;
      const needle = self2._needle;
      for (let i = 0; i < len; ++i, ++pos) {
        const ch = pos < 0 ? lb[lbSize + pos] : data[pos];
        if (ch !== needle[i])
          return false;
      }
      return true;
    }
    module2.exports = SBMH;
  }
});

// node_modules/busboy/lib/types/multipart.js
var require_multipart = __commonJS({
  "node_modules/busboy/lib/types/multipart.js"(exports2, module2) {
    "use strict";
    var { Readable, Writable } = require("stream");
    var StreamSearch = require_sbmh();
    var {
      basename,
      convertToUTF8,
      getDecoder,
      parseContentType,
      parseDisposition
    } = require_utils();
    var BUF_CRLF = Buffer.from("\r\n");
    var BUF_CR = Buffer.from("\r");
    var BUF_DASH = Buffer.from("-");
    function noop() {
    }
    var MAX_HEADER_PAIRS = 2e3;
    var MAX_HEADER_SIZE = 16 * 1024;
    var HPARSER_NAME = 0;
    var HPARSER_PRE_OWS = 1;
    var HPARSER_VALUE = 2;
    var HeaderParser = class {
      constructor(cb) {
        this.header = /* @__PURE__ */ Object.create(null);
        this.pairCount = 0;
        this.byteCount = 0;
        this.state = HPARSER_NAME;
        this.name = "";
        this.value = "";
        this.crlf = 0;
        this.cb = cb;
      }
      reset() {
        this.header = /* @__PURE__ */ Object.create(null);
        this.pairCount = 0;
        this.byteCount = 0;
        this.state = HPARSER_NAME;
        this.name = "";
        this.value = "";
        this.crlf = 0;
      }
      push(chunk, pos, end) {
        let start = pos;
        while (pos < end) {
          switch (this.state) {
            case HPARSER_NAME: {
              let done = false;
              for (; pos < end; ++pos) {
                if (this.byteCount === MAX_HEADER_SIZE)
                  return -1;
                ++this.byteCount;
                const code = chunk[pos];
                if (TOKEN[code] !== 1) {
                  if (code !== 58)
                    return -1;
                  this.name += chunk.latin1Slice(start, pos);
                  if (this.name.length === 0)
                    return -1;
                  ++pos;
                  done = true;
                  this.state = HPARSER_PRE_OWS;
                  break;
                }
              }
              if (!done) {
                this.name += chunk.latin1Slice(start, pos);
                break;
              }
            }
            case HPARSER_PRE_OWS: {
              let done = false;
              for (; pos < end; ++pos) {
                if (this.byteCount === MAX_HEADER_SIZE)
                  return -1;
                ++this.byteCount;
                const code = chunk[pos];
                if (code !== 32 && code !== 9) {
                  start = pos;
                  done = true;
                  this.state = HPARSER_VALUE;
                  break;
                }
              }
              if (!done)
                break;
            }
            case HPARSER_VALUE:
              switch (this.crlf) {
                case 0:
                  for (; pos < end; ++pos) {
                    if (this.byteCount === MAX_HEADER_SIZE)
                      return -1;
                    ++this.byteCount;
                    const code = chunk[pos];
                    if (FIELD_VCHAR[code] !== 1) {
                      if (code !== 13)
                        return -1;
                      ++this.crlf;
                      break;
                    }
                  }
                  this.value += chunk.latin1Slice(start, pos++);
                  break;
                case 1:
                  if (this.byteCount === MAX_HEADER_SIZE)
                    return -1;
                  ++this.byteCount;
                  if (chunk[pos++] !== 10)
                    return -1;
                  ++this.crlf;
                  break;
                case 2: {
                  if (this.byteCount === MAX_HEADER_SIZE)
                    return -1;
                  ++this.byteCount;
                  const code = chunk[pos];
                  if (code === 32 || code === 9) {
                    start = pos;
                    this.crlf = 0;
                  } else {
                    if (++this.pairCount < MAX_HEADER_PAIRS) {
                      this.name = this.name.toLowerCase();
                      if (this.header[this.name] === void 0)
                        this.header[this.name] = [this.value];
                      else
                        this.header[this.name].push(this.value);
                    }
                    if (code === 13) {
                      ++this.crlf;
                      ++pos;
                    } else {
                      start = pos;
                      this.crlf = 0;
                      this.state = HPARSER_NAME;
                      this.name = "";
                      this.value = "";
                    }
                  }
                  break;
                }
                case 3: {
                  if (this.byteCount === MAX_HEADER_SIZE)
                    return -1;
                  ++this.byteCount;
                  if (chunk[pos++] !== 10)
                    return -1;
                  const header = this.header;
                  this.reset();
                  this.cb(header);
                  return pos;
                }
              }
              break;
          }
        }
        return pos;
      }
    };
    var FileStream = class extends Readable {
      constructor(opts, owner) {
        super(opts);
        this.truncated = false;
        this._readcb = null;
        this.once("end", () => {
          this._read();
          if (--owner._fileEndsLeft === 0 && owner._finalcb) {
            const cb = owner._finalcb;
            owner._finalcb = null;
            process.nextTick(cb);
          }
        });
      }
      _read(n) {
        const cb = this._readcb;
        if (cb) {
          this._readcb = null;
          cb();
        }
      }
    };
    var ignoreData = {
      push: (chunk, pos) => {
      },
      destroy: () => {
      }
    };
    function callAndUnsetCb(self2, err) {
      const cb = self2._writecb;
      self2._writecb = null;
      if (err)
        self2.destroy(err);
      else if (cb)
        cb();
    }
    function nullDecoder(val, hint) {
      return val;
    }
    var Multipart = class extends Writable {
      constructor(cfg) {
        const streamOpts = {
          autoDestroy: true,
          emitClose: true,
          highWaterMark: typeof cfg.highWaterMark === "number" ? cfg.highWaterMark : void 0
        };
        super(streamOpts);
        if (!cfg.conType.params || typeof cfg.conType.params.boundary !== "string")
          throw new Error("Multipart: Boundary not found");
        const boundary = cfg.conType.params.boundary;
        const paramDecoder = typeof cfg.defParamCharset === "string" && cfg.defParamCharset ? getDecoder(cfg.defParamCharset) : nullDecoder;
        const defCharset = cfg.defCharset || "utf8";
        const preservePath = cfg.preservePath;
        const fileOpts = {
          autoDestroy: true,
          emitClose: true,
          highWaterMark: typeof cfg.fileHwm === "number" ? cfg.fileHwm : void 0
        };
        const limits = cfg.limits;
        const fieldSizeLimit = limits && typeof limits.fieldSize === "number" ? limits.fieldSize : 1 * 1024 * 1024;
        const fileSizeLimit = limits && typeof limits.fileSize === "number" ? limits.fileSize : Infinity;
        const filesLimit = limits && typeof limits.files === "number" ? limits.files : Infinity;
        const fieldsLimit = limits && typeof limits.fields === "number" ? limits.fields : Infinity;
        const partsLimit = limits && typeof limits.parts === "number" ? limits.parts : Infinity;
        let parts = -1;
        let fields = 0;
        let files = 0;
        let skipPart = false;
        this._fileEndsLeft = 0;
        this._fileStream = void 0;
        this._complete = false;
        let fileSize = 0;
        let field;
        let fieldSize = 0;
        let partCharset;
        let partEncoding;
        let partType;
        let partName;
        let partTruncated = false;
        let hitFilesLimit = false;
        let hitFieldsLimit = false;
        this._hparser = null;
        const hparser = new HeaderParser((header) => {
          this._hparser = null;
          skipPart = false;
          partType = "text/plain";
          partCharset = defCharset;
          partEncoding = "7bit";
          partName = void 0;
          partTruncated = false;
          let filename;
          if (!header["content-disposition"]) {
            skipPart = true;
            return;
          }
          const disp = parseDisposition(
            header["content-disposition"][0],
            paramDecoder
          );
          if (!disp || disp.type !== "form-data") {
            skipPart = true;
            return;
          }
          if (disp.params) {
            if (disp.params.name)
              partName = disp.params.name;
            if (disp.params["filename*"])
              filename = disp.params["filename*"];
            else if (disp.params.filename)
              filename = disp.params.filename;
            if (filename !== void 0 && !preservePath)
              filename = basename(filename);
          }
          if (header["content-type"]) {
            const conType = parseContentType(header["content-type"][0]);
            if (conType) {
              partType = `${conType.type}/${conType.subtype}`;
              if (conType.params && typeof conType.params.charset === "string")
                partCharset = conType.params.charset.toLowerCase();
            }
          }
          if (header["content-transfer-encoding"])
            partEncoding = header["content-transfer-encoding"][0].toLowerCase();
          if (partType === "application/octet-stream" || filename !== void 0) {
            if (files === filesLimit) {
              if (!hitFilesLimit) {
                hitFilesLimit = true;
                this.emit("filesLimit");
              }
              skipPart = true;
              return;
            }
            ++files;
            if (this.listenerCount("file") === 0) {
              skipPart = true;
              return;
            }
            fileSize = 0;
            this._fileStream = new FileStream(fileOpts, this);
            ++this._fileEndsLeft;
            this.emit(
              "file",
              partName,
              this._fileStream,
              {
                filename,
                encoding: partEncoding,
                mimeType: partType
              }
            );
          } else {
            if (fields === fieldsLimit) {
              if (!hitFieldsLimit) {
                hitFieldsLimit = true;
                this.emit("fieldsLimit");
              }
              skipPart = true;
              return;
            }
            ++fields;
            if (this.listenerCount("field") === 0) {
              skipPart = true;
              return;
            }
            field = [];
            fieldSize = 0;
          }
        });
        let matchPostBoundary = 0;
        const ssCb = (isMatch, data, start, end, isDataSafe) => {
          retrydata:
            while (data) {
              if (this._hparser !== null) {
                const ret = this._hparser.push(data, start, end);
                if (ret === -1) {
                  this._hparser = null;
                  hparser.reset();
                  this.emit("error", new Error("Malformed part header"));
                  break;
                }
                start = ret;
              }
              if (start === end)
                break;
              if (matchPostBoundary !== 0) {
                if (matchPostBoundary === 1) {
                  switch (data[start]) {
                    case 45:
                      matchPostBoundary = 2;
                      ++start;
                      break;
                    case 13:
                      matchPostBoundary = 3;
                      ++start;
                      break;
                    default:
                      matchPostBoundary = 0;
                  }
                  if (start === end)
                    return;
                }
                if (matchPostBoundary === 2) {
                  matchPostBoundary = 0;
                  if (data[start] === 45) {
                    this._complete = true;
                    this._bparser = ignoreData;
                    return;
                  }
                  const writecb = this._writecb;
                  this._writecb = noop;
                  ssCb(false, BUF_DASH, 0, 1, false);
                  this._writecb = writecb;
                } else if (matchPostBoundary === 3) {
                  matchPostBoundary = 0;
                  if (data[start] === 10) {
                    ++start;
                    if (parts >= partsLimit)
                      break;
                    this._hparser = hparser;
                    if (start === end)
                      break;
                    continue retrydata;
                  } else {
                    const writecb = this._writecb;
                    this._writecb = noop;
                    ssCb(false, BUF_CR, 0, 1, false);
                    this._writecb = writecb;
                  }
                }
              }
              if (!skipPart) {
                if (this._fileStream) {
                  let chunk;
                  const actualLen = Math.min(end - start, fileSizeLimit - fileSize);
                  if (!isDataSafe) {
                    chunk = Buffer.allocUnsafe(actualLen);
                    data.copy(chunk, 0, start, start + actualLen);
                  } else {
                    chunk = data.slice(start, start + actualLen);
                  }
                  fileSize += chunk.length;
                  if (fileSize === fileSizeLimit) {
                    if (chunk.length > 0)
                      this._fileStream.push(chunk);
                    this._fileStream.emit("limit");
                    this._fileStream.truncated = true;
                    skipPart = true;
                  } else if (!this._fileStream.push(chunk)) {
                    if (this._writecb)
                      this._fileStream._readcb = this._writecb;
                    this._writecb = null;
                  }
                } else if (field !== void 0) {
                  let chunk;
                  const actualLen = Math.min(
                    end - start,
                    fieldSizeLimit - fieldSize
                  );
                  if (!isDataSafe) {
                    chunk = Buffer.allocUnsafe(actualLen);
                    data.copy(chunk, 0, start, start + actualLen);
                  } else {
                    chunk = data.slice(start, start + actualLen);
                  }
                  fieldSize += actualLen;
                  field.push(chunk);
                  if (fieldSize === fieldSizeLimit) {
                    skipPart = true;
                    partTruncated = true;
                  }
                }
              }
              break;
            }
          if (isMatch) {
            matchPostBoundary = 1;
            if (this._fileStream) {
              this._fileStream.push(null);
              this._fileStream = null;
            } else if (field !== void 0) {
              let data2;
              switch (field.length) {
                case 0:
                  data2 = "";
                  break;
                case 1:
                  data2 = convertToUTF8(field[0], partCharset, 0);
                  break;
                default:
                  data2 = convertToUTF8(
                    Buffer.concat(field, fieldSize),
                    partCharset,
                    0
                  );
              }
              field = void 0;
              fieldSize = 0;
              this.emit(
                "field",
                partName,
                data2,
                {
                  nameTruncated: false,
                  valueTruncated: partTruncated,
                  encoding: partEncoding,
                  mimeType: partType
                }
              );
            }
            if (++parts === partsLimit)
              this.emit("partsLimit");
          }
        };
        this._bparser = new StreamSearch(`\r
--${boundary}`, ssCb);
        this._writecb = null;
        this._finalcb = null;
        this.write(BUF_CRLF);
      }
      static detect(conType) {
        return conType.type === "multipart" && conType.subtype === "form-data";
      }
      _write(chunk, enc, cb) {
        this._writecb = cb;
        this._bparser.push(chunk, 0);
        if (this._writecb)
          callAndUnsetCb(this);
      }
      _destroy(err, cb) {
        this._hparser = null;
        this._bparser = ignoreData;
        if (!err)
          err = checkEndState(this);
        const fileStream = this._fileStream;
        if (fileStream) {
          this._fileStream = null;
          fileStream.destroy(err);
        }
        cb(err);
      }
      _final(cb) {
        this._bparser.destroy();
        if (!this._complete)
          return cb(new Error("Unexpected end of form"));
        if (this._fileEndsLeft)
          this._finalcb = finalcb.bind(null, this, cb);
        else
          finalcb(this, cb);
      }
    };
    function finalcb(self2, cb, err) {
      if (err)
        return cb(err);
      err = checkEndState(self2);
      cb(err);
    }
    function checkEndState(self2) {
      if (self2._hparser)
        return new Error("Malformed part header");
      const fileStream = self2._fileStream;
      if (fileStream) {
        self2._fileStream = null;
        fileStream.destroy(new Error("Unexpected end of file"));
      }
      if (!self2._complete)
        return new Error("Unexpected end of form");
    }
    var TOKEN = [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      0,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      1,
      1,
      0,
      1,
      1,
      0,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      1,
      0,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ];
    var FIELD_VCHAR = [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1
    ];
    module2.exports = Multipart;
  }
});

// node_modules/busboy/lib/types/urlencoded.js
var require_urlencoded = __commonJS({
  "node_modules/busboy/lib/types/urlencoded.js"(exports2, module2) {
    "use strict";
    var { Writable } = require("stream");
    var { getDecoder } = require_utils();
    var URLEncoded = class extends Writable {
      constructor(cfg) {
        const streamOpts = {
          autoDestroy: true,
          emitClose: true,
          highWaterMark: typeof cfg.highWaterMark === "number" ? cfg.highWaterMark : void 0
        };
        super(streamOpts);
        let charset = cfg.defCharset || "utf8";
        if (cfg.conType.params && typeof cfg.conType.params.charset === "string")
          charset = cfg.conType.params.charset;
        this.charset = charset;
        const limits = cfg.limits;
        this.fieldSizeLimit = limits && typeof limits.fieldSize === "number" ? limits.fieldSize : 1 * 1024 * 1024;
        this.fieldsLimit = limits && typeof limits.fields === "number" ? limits.fields : Infinity;
        this.fieldNameSizeLimit = limits && typeof limits.fieldNameSize === "number" ? limits.fieldNameSize : 100;
        this._inKey = true;
        this._keyTrunc = false;
        this._valTrunc = false;
        this._bytesKey = 0;
        this._bytesVal = 0;
        this._fields = 0;
        this._key = "";
        this._val = "";
        this._byte = -2;
        this._lastPos = 0;
        this._encode = 0;
        this._decoder = getDecoder(charset);
      }
      static detect(conType) {
        return conType.type === "application" && conType.subtype === "x-www-form-urlencoded";
      }
      _write(chunk, enc, cb) {
        if (this._fields >= this.fieldsLimit)
          return cb();
        let i = 0;
        const len = chunk.length;
        this._lastPos = 0;
        if (this._byte !== -2) {
          i = readPctEnc(this, chunk, i, len);
          if (i === -1)
            return cb(new Error("Malformed urlencoded form"));
          if (i >= len)
            return cb();
          if (this._inKey)
            ++this._bytesKey;
          else
            ++this._bytesVal;
        }
        main:
          while (i < len) {
            if (this._inKey) {
              i = skipKeyBytes(this, chunk, i, len);
              while (i < len) {
                switch (chunk[i]) {
                  case 61:
                    if (this._lastPos < i)
                      this._key += chunk.latin1Slice(this._lastPos, i);
                    this._lastPos = ++i;
                    this._key = this._decoder(this._key, this._encode);
                    this._encode = 0;
                    this._inKey = false;
                    continue main;
                  case 38:
                    if (this._lastPos < i)
                      this._key += chunk.latin1Slice(this._lastPos, i);
                    this._lastPos = ++i;
                    this._key = this._decoder(this._key, this._encode);
                    this._encode = 0;
                    if (this._bytesKey > 0) {
                      this.emit(
                        "field",
                        this._key,
                        "",
                        {
                          nameTruncated: this._keyTrunc,
                          valueTruncated: false,
                          encoding: this.charset,
                          mimeType: "text/plain"
                        }
                      );
                    }
                    this._key = "";
                    this._val = "";
                    this._keyTrunc = false;
                    this._valTrunc = false;
                    this._bytesKey = 0;
                    this._bytesVal = 0;
                    if (++this._fields >= this.fieldsLimit) {
                      this.emit("fieldsLimit");
                      return cb();
                    }
                    continue;
                  case 43:
                    if (this._lastPos < i)
                      this._key += chunk.latin1Slice(this._lastPos, i);
                    this._key += " ";
                    this._lastPos = i + 1;
                    break;
                  case 37:
                    if (this._encode === 0)
                      this._encode = 1;
                    if (this._lastPos < i)
                      this._key += chunk.latin1Slice(this._lastPos, i);
                    this._lastPos = i + 1;
                    this._byte = -1;
                    i = readPctEnc(this, chunk, i + 1, len);
                    if (i === -1)
                      return cb(new Error("Malformed urlencoded form"));
                    if (i >= len)
                      return cb();
                    ++this._bytesKey;
                    i = skipKeyBytes(this, chunk, i, len);
                    continue;
                }
                ++i;
                ++this._bytesKey;
                i = skipKeyBytes(this, chunk, i, len);
              }
              if (this._lastPos < i)
                this._key += chunk.latin1Slice(this._lastPos, i);
            } else {
              i = skipValBytes(this, chunk, i, len);
              while (i < len) {
                switch (chunk[i]) {
                  case 38:
                    if (this._lastPos < i)
                      this._val += chunk.latin1Slice(this._lastPos, i);
                    this._lastPos = ++i;
                    this._inKey = true;
                    this._val = this._decoder(this._val, this._encode);
                    this._encode = 0;
                    if (this._bytesKey > 0 || this._bytesVal > 0) {
                      this.emit(
                        "field",
                        this._key,
                        this._val,
                        {
                          nameTruncated: this._keyTrunc,
                          valueTruncated: this._valTrunc,
                          encoding: this.charset,
                          mimeType: "text/plain"
                        }
                      );
                    }
                    this._key = "";
                    this._val = "";
                    this._keyTrunc = false;
                    this._valTrunc = false;
                    this._bytesKey = 0;
                    this._bytesVal = 0;
                    if (++this._fields >= this.fieldsLimit) {
                      this.emit("fieldsLimit");
                      return cb();
                    }
                    continue main;
                  case 43:
                    if (this._lastPos < i)
                      this._val += chunk.latin1Slice(this._lastPos, i);
                    this._val += " ";
                    this._lastPos = i + 1;
                    break;
                  case 37:
                    if (this._encode === 0)
                      this._encode = 1;
                    if (this._lastPos < i)
                      this._val += chunk.latin1Slice(this._lastPos, i);
                    this._lastPos = i + 1;
                    this._byte = -1;
                    i = readPctEnc(this, chunk, i + 1, len);
                    if (i === -1)
                      return cb(new Error("Malformed urlencoded form"));
                    if (i >= len)
                      return cb();
                    ++this._bytesVal;
                    i = skipValBytes(this, chunk, i, len);
                    continue;
                }
                ++i;
                ++this._bytesVal;
                i = skipValBytes(this, chunk, i, len);
              }
              if (this._lastPos < i)
                this._val += chunk.latin1Slice(this._lastPos, i);
            }
          }
        cb();
      }
      _final(cb) {
        if (this._byte !== -2)
          return cb(new Error("Malformed urlencoded form"));
        if (!this._inKey || this._bytesKey > 0 || this._bytesVal > 0) {
          if (this._inKey)
            this._key = this._decoder(this._key, this._encode);
          else
            this._val = this._decoder(this._val, this._encode);
          this.emit(
            "field",
            this._key,
            this._val,
            {
              nameTruncated: this._keyTrunc,
              valueTruncated: this._valTrunc,
              encoding: this.charset,
              mimeType: "text/plain"
            }
          );
        }
        cb();
      }
    };
    function readPctEnc(self2, chunk, pos, len) {
      if (pos >= len)
        return len;
      if (self2._byte === -1) {
        const hexUpper = HEX_VALUES[chunk[pos++]];
        if (hexUpper === -1)
          return -1;
        if (hexUpper >= 8)
          self2._encode = 2;
        if (pos < len) {
          const hexLower = HEX_VALUES[chunk[pos++]];
          if (hexLower === -1)
            return -1;
          if (self2._inKey)
            self2._key += String.fromCharCode((hexUpper << 4) + hexLower);
          else
            self2._val += String.fromCharCode((hexUpper << 4) + hexLower);
          self2._byte = -2;
          self2._lastPos = pos;
        } else {
          self2._byte = hexUpper;
        }
      } else {
        const hexLower = HEX_VALUES[chunk[pos++]];
        if (hexLower === -1)
          return -1;
        if (self2._inKey)
          self2._key += String.fromCharCode((self2._byte << 4) + hexLower);
        else
          self2._val += String.fromCharCode((self2._byte << 4) + hexLower);
        self2._byte = -2;
        self2._lastPos = pos;
      }
      return pos;
    }
    function skipKeyBytes(self2, chunk, pos, len) {
      if (self2._bytesKey > self2.fieldNameSizeLimit) {
        if (!self2._keyTrunc) {
          if (self2._lastPos < pos)
            self2._key += chunk.latin1Slice(self2._lastPos, pos - 1);
        }
        self2._keyTrunc = true;
        for (; pos < len; ++pos) {
          const code = chunk[pos];
          if (code === 61 || code === 38)
            break;
          ++self2._bytesKey;
        }
        self2._lastPos = pos;
      }
      return pos;
    }
    function skipValBytes(self2, chunk, pos, len) {
      if (self2._bytesVal > self2.fieldSizeLimit) {
        if (!self2._valTrunc) {
          if (self2._lastPos < pos)
            self2._val += chunk.latin1Slice(self2._lastPos, pos - 1);
        }
        self2._valTrunc = true;
        for (; pos < len; ++pos) {
          if (chunk[pos] === 38)
            break;
          ++self2._bytesVal;
        }
        self2._lastPos = pos;
      }
      return pos;
    }
    var HEX_VALUES = [
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      10,
      11,
      12,
      13,
      14,
      15,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      10,
      11,
      12,
      13,
      14,
      15,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1
    ];
    module2.exports = URLEncoded;
  }
});

// node_modules/busboy/lib/index.js
var require_lib = __commonJS({
  "node_modules/busboy/lib/index.js"(exports2, module2) {
    "use strict";
    var { parseContentType } = require_utils();
    function getInstance(cfg) {
      const headers = cfg.headers;
      const conType = parseContentType(headers["content-type"]);
      if (!conType)
        throw new Error("Malformed content type");
      for (const type of TYPES) {
        const matched = type.detect(conType);
        if (!matched)
          continue;
        const instanceCfg = {
          limits: cfg.limits,
          headers,
          conType,
          highWaterMark: void 0,
          fileHwm: void 0,
          defCharset: void 0,
          defParamCharset: void 0,
          preservePath: false
        };
        if (cfg.highWaterMark)
          instanceCfg.highWaterMark = cfg.highWaterMark;
        if (cfg.fileHwm)
          instanceCfg.fileHwm = cfg.fileHwm;
        instanceCfg.defCharset = cfg.defCharset;
        instanceCfg.defParamCharset = cfg.defParamCharset;
        instanceCfg.preservePath = cfg.preservePath;
        return new type(instanceCfg);
      }
      throw new Error(`Unsupported content type: ${headers["content-type"]}`);
    }
    var TYPES = [
      require_multipart(),
      require_urlencoded()
    ].filter(function(typemod) {
      return typeof typemod.detect === "function";
    });
    module2.exports = (cfg) => {
      if (typeof cfg !== "object" || cfg === null)
        cfg = {};
      if (typeof cfg.headers !== "object" || cfg.headers === null || typeof cfg.headers["content-type"] !== "string") {
        throw new Error("Missing Content-Type");
      }
      return getInstance(cfg);
    };
  }
});

// node_modules/append-field/lib/parse-path.js
var require_parse_path = __commonJS({
  "node_modules/append-field/lib/parse-path.js"(exports2, module2) {
    var reFirstKey = /^[^\[]*/;
    var reDigitPath = /^\[(\d+)\]/;
    var reNormalPath = /^\[([^\]]+)\]/;
    function parsePath(key) {
      function failure() {
        return [{ type: "object", key, last: true }];
      }
      var firstKey = reFirstKey.exec(key)[0];
      if (!firstKey) return failure();
      var len = key.length;
      var pos = firstKey.length;
      var tail = { type: "object", key: firstKey };
      var steps = [tail];
      while (pos < len) {
        var m;
        if (key[pos] === "[" && key[pos + 1] === "]") {
          pos += 2;
          tail.append = true;
          if (pos !== len) return failure();
          continue;
        }
        m = reDigitPath.exec(key.substring(pos));
        if (m !== null) {
          pos += m[0].length;
          tail.nextType = "array";
          tail = { type: "array", key: parseInt(m[1], 10) };
          steps.push(tail);
          continue;
        }
        m = reNormalPath.exec(key.substring(pos));
        if (m !== null) {
          pos += m[0].length;
          tail.nextType = "object";
          tail = { type: "object", key: m[1] };
          steps.push(tail);
          continue;
        }
        return failure();
      }
      tail.last = true;
      return steps;
    }
    module2.exports = parsePath;
  }
});

// node_modules/append-field/lib/set-value.js
var require_set_value = __commonJS({
  "node_modules/append-field/lib/set-value.js"(exports2, module2) {
    function valueType(value) {
      if (value === void 0) return "undefined";
      if (Array.isArray(value)) return "array";
      if (typeof value === "object") return "object";
      return "scalar";
    }
    function setLastValue(context, step, currentValue, entryValue) {
      switch (valueType(currentValue)) {
        case "undefined":
          if (step.append) {
            context[step.key] = [entryValue];
          } else {
            context[step.key] = entryValue;
          }
          break;
        case "array":
          context[step.key].push(entryValue);
          break;
        case "object":
          return setLastValue(currentValue, { type: "object", key: "", last: true }, currentValue[""], entryValue);
        case "scalar":
          context[step.key] = [context[step.key], entryValue];
          break;
      }
      return context;
    }
    function setValue(context, step, currentValue, entryValue) {
      if (step.last) return setLastValue(context, step, currentValue, entryValue);
      var obj;
      switch (valueType(currentValue)) {
        case "undefined":
          if (step.nextType === "array") {
            context[step.key] = [];
          } else {
            context[step.key] = /* @__PURE__ */ Object.create(null);
          }
          return context[step.key];
        case "object":
          return context[step.key];
        case "array":
          if (step.nextType === "array") {
            return currentValue;
          }
          obj = /* @__PURE__ */ Object.create(null);
          context[step.key] = obj;
          currentValue.forEach(function(item, i) {
            if (item !== void 0) obj["" + i] = item;
          });
          return obj;
        case "scalar":
          obj = /* @__PURE__ */ Object.create(null);
          obj[""] = currentValue;
          context[step.key] = obj;
          return obj;
      }
    }
    module2.exports = setValue;
  }
});

// node_modules/append-field/index.js
var require_append_field = __commonJS({
  "node_modules/append-field/index.js"(exports2, module2) {
    var parsePath = require_parse_path();
    var setValue = require_set_value();
    function appendField(store, key, value) {
      var steps = parsePath(key);
      steps.reduce(function(context, step) {
        return setValue(context, step, context[step.key], value);
      }, store);
    }
    module2.exports = appendField;
  }
});

// node_modules/multer/lib/counter.js
var require_counter = __commonJS({
  "node_modules/multer/lib/counter.js"(exports2, module2) {
    var EventEmitter = require("events").EventEmitter;
    function Counter() {
      EventEmitter.call(this);
      this.value = 0;
    }
    Counter.prototype = Object.create(EventEmitter.prototype);
    Counter.prototype.increment = function increment() {
      this.value++;
    };
    Counter.prototype.decrement = function decrement() {
      if (--this.value === 0) this.emit("zero");
    };
    Counter.prototype.isZero = function isZero() {
      return this.value === 0;
    };
    Counter.prototype.onceZero = function onceZero(fn) {
      if (this.isZero()) return fn();
      this.once("zero", fn);
    };
    module2.exports = Counter;
  }
});

// node_modules/multer/lib/multer-error.js
var require_multer_error = __commonJS({
  "node_modules/multer/lib/multer-error.js"(exports2, module2) {
    var util = require("util");
    var errorMessages = {
      LIMIT_PART_COUNT: "Too many parts",
      LIMIT_FILE_SIZE: "File too large",
      LIMIT_FILE_COUNT: "Too many files",
      LIMIT_FIELD_KEY: "Field name too long",
      LIMIT_FIELD_VALUE: "Field value too long",
      LIMIT_FIELD_COUNT: "Too many fields",
      LIMIT_UNEXPECTED_FILE: "Unexpected field",
      MISSING_FIELD_NAME: "Field name missing",
      LIMIT_FIELD_NESTING: "Field name nesting too deep"
    };
    function MulterError(code, field) {
      Error.captureStackTrace(this, this.constructor);
      this.name = this.constructor.name;
      this.message = errorMessages[code];
      this.code = code;
      if (field) this.field = field;
    }
    util.inherits(MulterError, Error);
    module2.exports = MulterError;
  }
});

// node_modules/multer/lib/file-appender.js
var require_file_appender = __commonJS({
  "node_modules/multer/lib/file-appender.js"(exports2, module2) {
    function arrayRemove(arr, item) {
      var idx = arr.indexOf(item);
      if (~idx) arr.splice(idx, 1);
    }
    function FileAppender(strategy, req) {
      this.strategy = strategy;
      this.req = req;
      switch (strategy) {
        case "NONE":
          break;
        case "VALUE":
          break;
        case "ARRAY":
          req.files = [];
          break;
        case "OBJECT":
          req.files = /* @__PURE__ */ Object.create(null);
          break;
        default:
          throw new Error("Unknown file strategy: " + strategy);
      }
    }
    FileAppender.prototype.insertPlaceholder = function(file) {
      var placeholder = {
        fieldname: file.fieldname
      };
      switch (this.strategy) {
        case "NONE":
          break;
        case "VALUE":
          break;
        case "ARRAY":
          this.req.files.push(placeholder);
          break;
        case "OBJECT":
          if (this.req.files[file.fieldname]) {
            this.req.files[file.fieldname].push(placeholder);
          } else {
            this.req.files[file.fieldname] = [placeholder];
          }
          break;
      }
      return placeholder;
    };
    FileAppender.prototype.removePlaceholder = function(placeholder) {
      switch (this.strategy) {
        case "NONE":
          break;
        case "VALUE":
          break;
        case "ARRAY":
          arrayRemove(this.req.files, placeholder);
          break;
        case "OBJECT":
          if (this.req.files[placeholder.fieldname].length === 1) {
            delete this.req.files[placeholder.fieldname];
          } else {
            arrayRemove(this.req.files[placeholder.fieldname], placeholder);
          }
          break;
      }
    };
    FileAppender.prototype.replacePlaceholder = function(placeholder, file) {
      if (this.strategy === "VALUE") {
        this.req.file = file;
        return;
      }
      delete placeholder.fieldname;
      Object.assign(placeholder, file);
    };
    module2.exports = FileAppender;
  }
});

// node_modules/multer/lib/remove-uploaded-files.js
var require_remove_uploaded_files = __commonJS({
  "node_modules/multer/lib/remove-uploaded-files.js"(exports2, module2) {
    function removeUploadedFiles(uploadedFiles, remove, cb) {
      var length = uploadedFiles.length;
      var errors = [];
      if (length === 0) return cb(null, errors);
      function handleFile(idx) {
        var file = uploadedFiles[idx];
        remove(file, function(err) {
          if (err) {
            err.file = file;
            err.field = file.fieldname;
            errors.push(err);
          }
          if (idx < length - 1) {
            setImmediate(function() {
              handleFile(idx + 1);
            });
          } else {
            cb(null, errors);
          }
        });
      }
      handleFile(0);
    }
    module2.exports = removeUploadedFiles;
  }
});

// node_modules/multer/lib/make-middleware.js
var require_make_middleware = __commonJS({
  "node_modules/multer/lib/make-middleware.js"(exports2, module2) {
    var is = require_type_is();
    var Busboy = require_lib();
    var appendField = require_append_field();
    var Counter = require_counter();
    var MulterError = require_multer_error();
    var FileAppender = require_file_appender();
    var removeUploadedFiles = require_remove_uploaded_files();
    function drainStream(stream) {
      stream.on("readable", () => {
        while (stream.read() !== null) {
        }
      });
    }
    function makeMiddleware(setup) {
      return function multerMiddleware(req, res, next) {
        if (!is(req, ["multipart"])) return next();
        var options = setup();
        var limits = options.limits;
        var storage2 = options.storage;
        var fileFilter = options.fileFilter;
        var fileStrategy = options.fileStrategy;
        var preservePath = options.preservePath;
        var defParamCharset = options.defParamCharset;
        req.body = /* @__PURE__ */ Object.create(null);
        var busboy;
        var appender = null;
        var isDone = false;
        var readFinished = false;
        var errorOccured = false;
        var pendingWrites = new Counter();
        var uploadedFiles = [];
        var pendingFiles = [];
        function done(err) {
          var called = false;
          function onFinished() {
            if (called) return;
            called = true;
            next(err);
          }
          if (isDone) return;
          isDone = true;
          if (busboy) {
            req.unpipe(busboy);
            setImmediate(() => {
              busboy.removeAllListeners();
            });
          }
          drainStream(req);
          req.resume();
          if (err && req.readable && !req.destroyed) {
            req.once("end", onFinished);
            req.once("error", onFinished);
            req.once("close", onFinished);
            return;
          }
          next(err);
        }
        function indicateDone() {
          if (readFinished && pendingWrites.isZero() && !errorOccured) done();
        }
        function abortWithError(uploadError, skipPendingWait) {
          if (errorOccured) return;
          errorOccured = true;
          function finishAbort() {
            function remove(file, cb) {
              storage2._removeFile(req, file, cb);
            }
            var filesToRemove = uploadedFiles.concat(
              pendingFiles.filter(function(f) {
                return f.path;
              })
            );
            pendingFiles = [];
            removeUploadedFiles(filesToRemove, remove, function(err, storageErrors) {
              if (err) return done(err);
              uploadError.storageErrors = storageErrors;
              done(uploadError);
            });
          }
          if (skipPendingWait) {
            finishAbort();
          } else {
            pendingWrites.onceZero(finishAbort);
          }
        }
        function abortWithCode(code, optionalField) {
          abortWithError(new MulterError(code, optionalField));
        }
        function handleRequestFailure(err) {
          if (isDone) return;
          if (busboy) {
            req.unpipe(busboy);
            busboy.destroy(err);
          }
          abortWithError(err, true);
        }
        req.on("error", function(err) {
          handleRequestFailure(err || new Error("Request error"));
        });
        req.on("aborted", function() {
          handleRequestFailure(new Error("Request aborted"));
        });
        req.on("close", function() {
          if (req.readableEnded) return;
          handleRequestFailure(new Error("Request closed"));
        });
        try {
          busboy = Busboy({
            headers: req.headers,
            limits,
            preservePath,
            defParamCharset
          });
        } catch (err) {
          return next(err);
        }
        appender = new FileAppender(fileStrategy, req);
        busboy.on("field", function(fieldname, value, { nameTruncated, valueTruncated }) {
          if (fieldname == null) return abortWithCode("MISSING_FIELD_NAME");
          if (nameTruncated) return abortWithCode("LIMIT_FIELD_KEY");
          if (valueTruncated) return abortWithCode("LIMIT_FIELD_VALUE", fieldname);
          if (limits && Object.prototype.hasOwnProperty.call(limits, "fieldNameSize")) {
            if (fieldname.length > limits.fieldNameSize) return abortWithCode("LIMIT_FIELD_KEY");
          }
          if (limits && Object.prototype.hasOwnProperty.call(limits, "fieldNestingDepth")) {
            if (fieldname.split("[").length - 1 > limits.fieldNestingDepth) return abortWithCode("LIMIT_FIELD_NESTING", fieldname);
          }
          appendField(req.body, fieldname, value);
        });
        busboy.on("file", function(fieldname, fileStream, { filename, encoding, mimeType }) {
          var pendingWritesIncremented = false;
          fileStream.on("error", function(err) {
            if (pendingWritesIncremented) {
              pendingWrites.decrement();
            }
            abortWithError(err);
          });
          if (fieldname == null) return abortWithCode("MISSING_FIELD_NAME");
          if (!filename) return fileStream.resume();
          if (limits && Object.prototype.hasOwnProperty.call(limits, "fieldNameSize")) {
            if (fieldname.length > limits.fieldNameSize) return abortWithCode("LIMIT_FIELD_KEY");
          }
          var file = {
            fieldname,
            originalname: filename,
            encoding,
            mimetype: mimeType
          };
          var placeholder = appender.insertPlaceholder(file);
          fileFilter(req, file, function(err, includeFile) {
            if (errorOccured) {
              appender.removePlaceholder(placeholder);
              return fileStream.resume();
            }
            if (err) {
              appender.removePlaceholder(placeholder);
              return abortWithError(err);
            }
            if (!includeFile) {
              appender.removePlaceholder(placeholder);
              return fileStream.resume();
            }
            var aborting = false;
            pendingWritesIncremented = true;
            pendingWrites.increment();
            Object.defineProperty(file, "stream", {
              configurable: true,
              enumerable: false,
              value: fileStream
            });
            fileStream.on("limit", function() {
              aborting = true;
              abortWithCode("LIMIT_FILE_SIZE", fieldname);
            });
            pendingFiles.push(file);
            storage2._handleFile(req, file, function(err2, info) {
              var idx = pendingFiles.indexOf(file);
              if (idx !== -1) pendingFiles.splice(idx, 1);
              if (aborting) {
                appender.removePlaceholder(placeholder);
                uploadedFiles.push({ ...file, ...info });
                return pendingWrites.decrement();
              }
              if (err2) {
                appender.removePlaceholder(placeholder);
                pendingWrites.decrement();
                return abortWithError(err2);
              }
              var fileInfo = { ...file, ...info };
              appender.replacePlaceholder(placeholder, fileInfo);
              uploadedFiles.push(fileInfo);
              pendingWrites.decrement();
              indicateDone();
            });
          });
        });
        busboy.on("error", function(err) {
          abortWithError(err);
        });
        busboy.on("partsLimit", function() {
          abortWithCode("LIMIT_PART_COUNT");
        });
        busboy.on("filesLimit", function() {
          abortWithCode("LIMIT_FILE_COUNT");
        });
        busboy.on("fieldsLimit", function() {
          abortWithCode("LIMIT_FIELD_COUNT");
        });
        busboy.on("close", function() {
          readFinished = true;
          indicateDone();
        });
        req.pipe(busboy);
      };
    }
    module2.exports = makeMiddleware;
  }
});

// node_modules/multer/storage/disk.js
var require_disk = __commonJS({
  "node_modules/multer/storage/disk.js"(exports2, module2) {
    var fs5 = require("fs");
    var os = require("os");
    var path7 = require("path");
    var crypto = require("crypto");
    function getFilename(req, file, cb) {
      crypto.randomBytes(16, function(err, raw) {
        cb(err, err ? void 0 : raw.toString("hex"));
      });
    }
    function getDestination(req, file, cb) {
      cb(null, os.tmpdir());
    }
    function DiskStorage(opts) {
      this.getFilename = opts.filename || getFilename;
      if (typeof opts.destination === "string") {
        fs5.mkdirSync(opts.destination, { recursive: true });
        this.getDestination = function($0, $1, cb) {
          cb(null, opts.destination);
        };
      } else {
        this.getDestination = opts.destination || getDestination;
      }
    }
    DiskStorage.prototype._handleFile = function _handleFile(req, file, cb) {
      var that = this;
      that.getDestination(req, file, function(err, destination) {
        if (err) return cb(err);
        that.getFilename(req, file, function(err2, filename) {
          if (err2) return cb(err2);
          var finalPath = path7.join(destination, filename);
          if (file.stream.destroyed) return;
          var outStream = fs5.createWriteStream(finalPath);
          file.path = finalPath;
          file.stream.pipe(outStream);
          outStream.on("error", cb);
          outStream.on("finish", function() {
            cb(null, {
              destination,
              filename,
              path: finalPath,
              size: outStream.bytesWritten
            });
          });
        });
      });
    };
    DiskStorage.prototype._removeFile = function _removeFile(req, file, cb) {
      var path8 = file.path;
      delete file.destination;
      delete file.filename;
      delete file.path;
      fs5.unlink(path8, cb);
    };
    module2.exports = function(opts) {
      return new DiskStorage(opts);
    };
  }
});

// node_modules/readable-stream/lib/internal/streams/stream.js
var require_stream = __commonJS({
  "node_modules/readable-stream/lib/internal/streams/stream.js"(exports2, module2) {
    module2.exports = require("stream");
  }
});

// node_modules/readable-stream/lib/internal/streams/buffer_list.js
var require_buffer_list = __commonJS({
  "node_modules/readable-stream/lib/internal/streams/buffer_list.js"(exports2, module2) {
    "use strict";
    function ownKeys(object, enumerableOnly) {
      var keys = Object.keys(object);
      if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        enumerableOnly && (symbols = symbols.filter(function(sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        })), keys.push.apply(keys, symbols);
      }
      return keys;
    }
    function _objectSpread(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = null != arguments[i] ? arguments[i] : {};
        i % 2 ? ownKeys(Object(source), true).forEach(function(key) {
          _defineProperty(target, key, source[key]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function(key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
      return target;
    }
    function _defineProperty(obj, key, value) {
      key = _toPropertyKey(key);
      if (key in obj) {
        Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
      } else {
        obj[key] = value;
      }
      return obj;
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties(Constructor.prototype, protoProps);
      if (staticProps) _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return typeof key === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (typeof input !== "object" || input === null) return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (typeof res !== "object") return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var _require = require("buffer");
    var Buffer2 = _require.Buffer;
    var _require2 = require("util");
    var inspect = _require2.inspect;
    var custom = inspect && inspect.custom || "inspect";
    function copyBuffer(src, target, offset) {
      Buffer2.prototype.copy.call(src, target, offset);
    }
    module2.exports = /* @__PURE__ */ function() {
      function BufferList() {
        _classCallCheck(this, BufferList);
        this.head = null;
        this.tail = null;
        this.length = 0;
      }
      _createClass(BufferList, [{
        key: "push",
        value: function push(v) {
          var entry = {
            data: v,
            next: null
          };
          if (this.length > 0) this.tail.next = entry;
          else this.head = entry;
          this.tail = entry;
          ++this.length;
        }
      }, {
        key: "unshift",
        value: function unshift(v) {
          var entry = {
            data: v,
            next: this.head
          };
          if (this.length === 0) this.tail = entry;
          this.head = entry;
          ++this.length;
        }
      }, {
        key: "shift",
        value: function shift() {
          if (this.length === 0) return;
          var ret = this.head.data;
          if (this.length === 1) this.head = this.tail = null;
          else this.head = this.head.next;
          --this.length;
          return ret;
        }
      }, {
        key: "clear",
        value: function clear() {
          this.head = this.tail = null;
          this.length = 0;
        }
      }, {
        key: "join",
        value: function join(s) {
          if (this.length === 0) return "";
          var p = this.head;
          var ret = "" + p.data;
          while (p = p.next) ret += s + p.data;
          return ret;
        }
      }, {
        key: "concat",
        value: function concat(n) {
          if (this.length === 0) return Buffer2.alloc(0);
          var ret = Buffer2.allocUnsafe(n >>> 0);
          var p = this.head;
          var i = 0;
          while (p) {
            copyBuffer(p.data, ret, i);
            i += p.data.length;
            p = p.next;
          }
          return ret;
        }
        // Consumes a specified amount of bytes or characters from the buffered data.
      }, {
        key: "consume",
        value: function consume(n, hasStrings) {
          var ret;
          if (n < this.head.data.length) {
            ret = this.head.data.slice(0, n);
            this.head.data = this.head.data.slice(n);
          } else if (n === this.head.data.length) {
            ret = this.shift();
          } else {
            ret = hasStrings ? this._getString(n) : this._getBuffer(n);
          }
          return ret;
        }
      }, {
        key: "first",
        value: function first() {
          return this.head.data;
        }
        // Consumes a specified amount of characters from the buffered data.
      }, {
        key: "_getString",
        value: function _getString(n) {
          var p = this.head;
          var c = 1;
          var ret = p.data;
          n -= ret.length;
          while (p = p.next) {
            var str = p.data;
            var nb = n > str.length ? str.length : n;
            if (nb === str.length) ret += str;
            else ret += str.slice(0, n);
            n -= nb;
            if (n === 0) {
              if (nb === str.length) {
                ++c;
                if (p.next) this.head = p.next;
                else this.head = this.tail = null;
              } else {
                this.head = p;
                p.data = str.slice(nb);
              }
              break;
            }
            ++c;
          }
          this.length -= c;
          return ret;
        }
        // Consumes a specified amount of bytes from the buffered data.
      }, {
        key: "_getBuffer",
        value: function _getBuffer(n) {
          var ret = Buffer2.allocUnsafe(n);
          var p = this.head;
          var c = 1;
          p.data.copy(ret);
          n -= p.data.length;
          while (p = p.next) {
            var buf = p.data;
            var nb = n > buf.length ? buf.length : n;
            buf.copy(ret, ret.length - n, 0, nb);
            n -= nb;
            if (n === 0) {
              if (nb === buf.length) {
                ++c;
                if (p.next) this.head = p.next;
                else this.head = this.tail = null;
              } else {
                this.head = p;
                p.data = buf.slice(nb);
              }
              break;
            }
            ++c;
          }
          this.length -= c;
          return ret;
        }
        // Make sure the linked list only shows the minimal necessary information.
      }, {
        key: custom,
        value: function value(_, options) {
          return inspect(this, _objectSpread(_objectSpread({}, options), {}, {
            // Only inspect one level.
            depth: 0,
            // It should not recurse.
            customInspect: false
          }));
        }
      }]);
      return BufferList;
    }();
  }
});

// node_modules/readable-stream/lib/internal/streams/destroy.js
var require_destroy = __commonJS({
  "node_modules/readable-stream/lib/internal/streams/destroy.js"(exports2, module2) {
    "use strict";
    function destroy(err, cb) {
      var _this = this;
      var readableDestroyed = this._readableState && this._readableState.destroyed;
      var writableDestroyed = this._writableState && this._writableState.destroyed;
      if (readableDestroyed || writableDestroyed) {
        if (cb) {
          cb(err);
        } else if (err) {
          if (!this._writableState) {
            process.nextTick(emitErrorNT, this, err);
          } else if (!this._writableState.errorEmitted) {
            this._writableState.errorEmitted = true;
            process.nextTick(emitErrorNT, this, err);
          }
        }
        return this;
      }
      if (this._readableState) {
        this._readableState.destroyed = true;
      }
      if (this._writableState) {
        this._writableState.destroyed = true;
      }
      this._destroy(err || null, function(err2) {
        if (!cb && err2) {
          if (!_this._writableState) {
            process.nextTick(emitErrorAndCloseNT, _this, err2);
          } else if (!_this._writableState.errorEmitted) {
            _this._writableState.errorEmitted = true;
            process.nextTick(emitErrorAndCloseNT, _this, err2);
          } else {
            process.nextTick(emitCloseNT, _this);
          }
        } else if (cb) {
          process.nextTick(emitCloseNT, _this);
          cb(err2);
        } else {
          process.nextTick(emitCloseNT, _this);
        }
      });
      return this;
    }
    function emitErrorAndCloseNT(self2, err) {
      emitErrorNT(self2, err);
      emitCloseNT(self2);
    }
    function emitCloseNT(self2) {
      if (self2._writableState && !self2._writableState.emitClose) return;
      if (self2._readableState && !self2._readableState.emitClose) return;
      self2.emit("close");
    }
    function undestroy() {
      if (this._readableState) {
        this._readableState.destroyed = false;
        this._readableState.reading = false;
        this._readableState.ended = false;
        this._readableState.endEmitted = false;
      }
      if (this._writableState) {
        this._writableState.destroyed = false;
        this._writableState.ended = false;
        this._writableState.ending = false;
        this._writableState.finalCalled = false;
        this._writableState.prefinished = false;
        this._writableState.finished = false;
        this._writableState.errorEmitted = false;
      }
    }
    function emitErrorNT(self2, err) {
      self2.emit("error", err);
    }
    function errorOrDestroy(stream, err) {
      var rState = stream._readableState;
      var wState = stream._writableState;
      if (rState && rState.autoDestroy || wState && wState.autoDestroy) stream.destroy(err);
      else stream.emit("error", err);
    }
    module2.exports = {
      destroy,
      undestroy,
      errorOrDestroy
    };
  }
});

// node_modules/readable-stream/errors.js
var require_errors = __commonJS({
  "node_modules/readable-stream/errors.js"(exports2, module2) {
    "use strict";
    var codes = {};
    function createErrorType(code, message, Base) {
      if (!Base) {
        Base = Error;
      }
      function getMessage(arg1, arg2, arg3) {
        if (typeof message === "string") {
          return message;
        } else {
          return message(arg1, arg2, arg3);
        }
      }
      class NodeError extends Base {
        constructor(arg1, arg2, arg3) {
          super(getMessage(arg1, arg2, arg3));
        }
      }
      NodeError.prototype.name = Base.name;
      NodeError.prototype.code = code;
      codes[code] = NodeError;
    }
    function oneOf(expected, thing) {
      if (Array.isArray(expected)) {
        const len = expected.length;
        expected = expected.map((i) => String(i));
        if (len > 2) {
          return `one of ${thing} ${expected.slice(0, len - 1).join(", ")}, or ` + expected[len - 1];
        } else if (len === 2) {
          return `one of ${thing} ${expected[0]} or ${expected[1]}`;
        } else {
          return `of ${thing} ${expected[0]}`;
        }
      } else {
        return `of ${thing} ${String(expected)}`;
      }
    }
    function startsWith(str, search, pos) {
      return str.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
    }
    function endsWith(str, search, this_len) {
      if (this_len === void 0 || this_len > str.length) {
        this_len = str.length;
      }
      return str.substring(this_len - search.length, this_len) === search;
    }
    function includes(str, search, start) {
      if (typeof start !== "number") {
        start = 0;
      }
      if (start + search.length > str.length) {
        return false;
      } else {
        return str.indexOf(search, start) !== -1;
      }
    }
    createErrorType("ERR_INVALID_OPT_VALUE", function(name, value) {
      return 'The value "' + value + '" is invalid for option "' + name + '"';
    }, TypeError);
    createErrorType("ERR_INVALID_ARG_TYPE", function(name, expected, actual) {
      let determiner;
      if (typeof expected === "string" && startsWith(expected, "not ")) {
        determiner = "must not be";
        expected = expected.replace(/^not /, "");
      } else {
        determiner = "must be";
      }
      let msg;
      if (endsWith(name, " argument")) {
        msg = `The ${name} ${determiner} ${oneOf(expected, "type")}`;
      } else {
        const type = includes(name, ".") ? "property" : "argument";
        msg = `The "${name}" ${type} ${determiner} ${oneOf(expected, "type")}`;
      }
      msg += `. Received type ${typeof actual}`;
      return msg;
    }, TypeError);
    createErrorType("ERR_STREAM_PUSH_AFTER_EOF", "stream.push() after EOF");
    createErrorType("ERR_METHOD_NOT_IMPLEMENTED", function(name) {
      return "The " + name + " method is not implemented";
    });
    createErrorType("ERR_STREAM_PREMATURE_CLOSE", "Premature close");
    createErrorType("ERR_STREAM_DESTROYED", function(name) {
      return "Cannot call " + name + " after a stream was destroyed";
    });
    createErrorType("ERR_MULTIPLE_CALLBACK", "Callback called multiple times");
    createErrorType("ERR_STREAM_CANNOT_PIPE", "Cannot pipe, not readable");
    createErrorType("ERR_STREAM_WRITE_AFTER_END", "write after end");
    createErrorType("ERR_STREAM_NULL_VALUES", "May not write null values to stream", TypeError);
    createErrorType("ERR_UNKNOWN_ENCODING", function(arg) {
      return "Unknown encoding: " + arg;
    }, TypeError);
    createErrorType("ERR_STREAM_UNSHIFT_AFTER_END_EVENT", "stream.unshift() after end event");
    module2.exports.codes = codes;
  }
});

// node_modules/readable-stream/lib/internal/streams/state.js
var require_state = __commonJS({
  "node_modules/readable-stream/lib/internal/streams/state.js"(exports2, module2) {
    "use strict";
    var ERR_INVALID_OPT_VALUE = require_errors().codes.ERR_INVALID_OPT_VALUE;
    function highWaterMarkFrom(options, isDuplex, duplexKey) {
      return options.highWaterMark != null ? options.highWaterMark : isDuplex ? options[duplexKey] : null;
    }
    function getHighWaterMark(state, options, duplexKey, isDuplex) {
      var hwm = highWaterMarkFrom(options, isDuplex, duplexKey);
      if (hwm != null) {
        if (!(isFinite(hwm) && Math.floor(hwm) === hwm) || hwm < 0) {
          var name = isDuplex ? duplexKey : "highWaterMark";
          throw new ERR_INVALID_OPT_VALUE(name, hwm);
        }
        return Math.floor(hwm);
      }
      return state.objectMode ? 16 : 16 * 1024;
    }
    module2.exports = {
      getHighWaterMark
    };
  }
});

// node_modules/inherits/inherits_browser.js
var require_inherits_browser = __commonJS({
  "node_modules/inherits/inherits_browser.js"(exports2, module2) {
    if (typeof Object.create === "function") {
      module2.exports = function inherits(ctor, superCtor) {
        if (superCtor) {
          ctor.super_ = superCtor;
          ctor.prototype = Object.create(superCtor.prototype, {
            constructor: {
              value: ctor,
              enumerable: false,
              writable: true,
              configurable: true
            }
          });
        }
      };
    } else {
      module2.exports = function inherits(ctor, superCtor) {
        if (superCtor) {
          ctor.super_ = superCtor;
          var TempCtor = function() {
          };
          TempCtor.prototype = superCtor.prototype;
          ctor.prototype = new TempCtor();
          ctor.prototype.constructor = ctor;
        }
      };
    }
  }
});

// node_modules/inherits/inherits.js
var require_inherits = __commonJS({
  "node_modules/inherits/inherits.js"(exports2, module2) {
    try {
      util = require("util");
      if (typeof util.inherits !== "function") throw "";
      module2.exports = util.inherits;
    } catch (e) {
      module2.exports = require_inherits_browser();
    }
    var util;
  }
});

// node_modules/util-deprecate/node.js
var require_node = __commonJS({
  "node_modules/util-deprecate/node.js"(exports2, module2) {
    module2.exports = require("util").deprecate;
  }
});

// node_modules/readable-stream/lib/_stream_writable.js
var require_stream_writable = __commonJS({
  "node_modules/readable-stream/lib/_stream_writable.js"(exports2, module2) {
    "use strict";
    module2.exports = Writable;
    function CorkedRequest(state) {
      var _this = this;
      this.next = null;
      this.entry = null;
      this.finish = function() {
        onCorkedFinish(_this, state);
      };
    }
    var Duplex;
    Writable.WritableState = WritableState;
    var internalUtil = {
      deprecate: require_node()
    };
    var Stream = require_stream();
    var Buffer2 = require("buffer").Buffer;
    var OurUint8Array = (typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : typeof self !== "undefined" ? self : {}).Uint8Array || function() {
    };
    function _uint8ArrayToBuffer(chunk) {
      return Buffer2.from(chunk);
    }
    function _isUint8Array(obj) {
      return Buffer2.isBuffer(obj) || obj instanceof OurUint8Array;
    }
    var destroyImpl = require_destroy();
    var _require = require_state();
    var getHighWaterMark = _require.getHighWaterMark;
    var _require$codes = require_errors().codes;
    var ERR_INVALID_ARG_TYPE = _require$codes.ERR_INVALID_ARG_TYPE;
    var ERR_METHOD_NOT_IMPLEMENTED = _require$codes.ERR_METHOD_NOT_IMPLEMENTED;
    var ERR_MULTIPLE_CALLBACK = _require$codes.ERR_MULTIPLE_CALLBACK;
    var ERR_STREAM_CANNOT_PIPE = _require$codes.ERR_STREAM_CANNOT_PIPE;
    var ERR_STREAM_DESTROYED = _require$codes.ERR_STREAM_DESTROYED;
    var ERR_STREAM_NULL_VALUES = _require$codes.ERR_STREAM_NULL_VALUES;
    var ERR_STREAM_WRITE_AFTER_END = _require$codes.ERR_STREAM_WRITE_AFTER_END;
    var ERR_UNKNOWN_ENCODING = _require$codes.ERR_UNKNOWN_ENCODING;
    var errorOrDestroy = destroyImpl.errorOrDestroy;
    require_inherits()(Writable, Stream);
    function nop() {
    }
    function WritableState(options, stream, isDuplex) {
      Duplex = Duplex || require_stream_duplex();
      options = options || {};
      if (typeof isDuplex !== "boolean") isDuplex = stream instanceof Duplex;
      this.objectMode = !!options.objectMode;
      if (isDuplex) this.objectMode = this.objectMode || !!options.writableObjectMode;
      this.highWaterMark = getHighWaterMark(this, options, "writableHighWaterMark", isDuplex);
      this.finalCalled = false;
      this.needDrain = false;
      this.ending = false;
      this.ended = false;
      this.finished = false;
      this.destroyed = false;
      var noDecode = options.decodeStrings === false;
      this.decodeStrings = !noDecode;
      this.defaultEncoding = options.defaultEncoding || "utf8";
      this.length = 0;
      this.writing = false;
      this.corked = 0;
      this.sync = true;
      this.bufferProcessing = false;
      this.onwrite = function(er) {
        onwrite(stream, er);
      };
      this.writecb = null;
      this.writelen = 0;
      this.bufferedRequest = null;
      this.lastBufferedRequest = null;
      this.pendingcb = 0;
      this.prefinished = false;
      this.errorEmitted = false;
      this.emitClose = options.emitClose !== false;
      this.autoDestroy = !!options.autoDestroy;
      this.bufferedRequestCount = 0;
      this.corkedRequestsFree = new CorkedRequest(this);
    }
    WritableState.prototype.getBuffer = function getBuffer() {
      var current = this.bufferedRequest;
      var out = [];
      while (current) {
        out.push(current);
        current = current.next;
      }
      return out;
    };
    (function() {
      try {
        Object.defineProperty(WritableState.prototype, "buffer", {
          get: internalUtil.deprecate(function writableStateBufferGetter() {
            return this.getBuffer();
          }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003")
        });
      } catch (_) {
      }
    })();
    var realHasInstance;
    if (typeof Symbol === "function" && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] === "function") {
      realHasInstance = Function.prototype[Symbol.hasInstance];
      Object.defineProperty(Writable, Symbol.hasInstance, {
        value: function value(object) {
          if (realHasInstance.call(this, object)) return true;
          if (this !== Writable) return false;
          return object && object._writableState instanceof WritableState;
        }
      });
    } else {
      realHasInstance = function realHasInstance2(object) {
        return object instanceof this;
      };
    }
    function Writable(options) {
      Duplex = Duplex || require_stream_duplex();
      var isDuplex = this instanceof Duplex;
      if (!isDuplex && !realHasInstance.call(Writable, this)) return new Writable(options);
      this._writableState = new WritableState(options, this, isDuplex);
      this.writable = true;
      if (options) {
        if (typeof options.write === "function") this._write = options.write;
        if (typeof options.writev === "function") this._writev = options.writev;
        if (typeof options.destroy === "function") this._destroy = options.destroy;
        if (typeof options.final === "function") this._final = options.final;
      }
      Stream.call(this);
    }
    Writable.prototype.pipe = function() {
      errorOrDestroy(this, new ERR_STREAM_CANNOT_PIPE());
    };
    function writeAfterEnd(stream, cb) {
      var er = new ERR_STREAM_WRITE_AFTER_END();
      errorOrDestroy(stream, er);
      process.nextTick(cb, er);
    }
    function validChunk(stream, state, chunk, cb) {
      var er;
      if (chunk === null) {
        er = new ERR_STREAM_NULL_VALUES();
      } else if (typeof chunk !== "string" && !state.objectMode) {
        er = new ERR_INVALID_ARG_TYPE("chunk", ["string", "Buffer"], chunk);
      }
      if (er) {
        errorOrDestroy(stream, er);
        process.nextTick(cb, er);
        return false;
      }
      return true;
    }
    Writable.prototype.write = function(chunk, encoding, cb) {
      var state = this._writableState;
      var ret = false;
      var isBuf = !state.objectMode && _isUint8Array(chunk);
      if (isBuf && !Buffer2.isBuffer(chunk)) {
        chunk = _uint8ArrayToBuffer(chunk);
      }
      if (typeof encoding === "function") {
        cb = encoding;
        encoding = null;
      }
      if (isBuf) encoding = "buffer";
      else if (!encoding) encoding = state.defaultEncoding;
      if (typeof cb !== "function") cb = nop;
      if (state.ending) writeAfterEnd(this, cb);
      else if (isBuf || validChunk(this, state, chunk, cb)) {
        state.pendingcb++;
        ret = writeOrBuffer(this, state, isBuf, chunk, encoding, cb);
      }
      return ret;
    };
    Writable.prototype.cork = function() {
      this._writableState.corked++;
    };
    Writable.prototype.uncork = function() {
      var state = this._writableState;
      if (state.corked) {
        state.corked--;
        if (!state.writing && !state.corked && !state.bufferProcessing && state.bufferedRequest) clearBuffer(this, state);
      }
    };
    Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
      if (typeof encoding === "string") encoding = encoding.toLowerCase();
      if (!(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((encoding + "").toLowerCase()) > -1)) throw new ERR_UNKNOWN_ENCODING(encoding);
      this._writableState.defaultEncoding = encoding;
      return this;
    };
    Object.defineProperty(Writable.prototype, "writableBuffer", {
      // making it explicit this property is not enumerable
      // because otherwise some prototype manipulation in
      // userland will fail
      enumerable: false,
      get: function get() {
        return this._writableState && this._writableState.getBuffer();
      }
    });
    function decodeChunk(state, chunk, encoding) {
      if (!state.objectMode && state.decodeStrings !== false && typeof chunk === "string") {
        chunk = Buffer2.from(chunk, encoding);
      }
      return chunk;
    }
    Object.defineProperty(Writable.prototype, "writableHighWaterMark", {
      // making it explicit this property is not enumerable
      // because otherwise some prototype manipulation in
      // userland will fail
      enumerable: false,
      get: function get() {
        return this._writableState.highWaterMark;
      }
    });
    function writeOrBuffer(stream, state, isBuf, chunk, encoding, cb) {
      if (!isBuf) {
        var newChunk = decodeChunk(state, chunk, encoding);
        if (chunk !== newChunk) {
          isBuf = true;
          encoding = "buffer";
          chunk = newChunk;
        }
      }
      var len = state.objectMode ? 1 : chunk.length;
      state.length += len;
      var ret = state.length < state.highWaterMark;
      if (!ret) state.needDrain = true;
      if (state.writing || state.corked) {
        var last = state.lastBufferedRequest;
        state.lastBufferedRequest = {
          chunk,
          encoding,
          isBuf,
          callback: cb,
          next: null
        };
        if (last) {
          last.next = state.lastBufferedRequest;
        } else {
          state.bufferedRequest = state.lastBufferedRequest;
        }
        state.bufferedRequestCount += 1;
      } else {
        doWrite(stream, state, false, len, chunk, encoding, cb);
      }
      return ret;
    }
    function doWrite(stream, state, writev, len, chunk, encoding, cb) {
      state.writelen = len;
      state.writecb = cb;
      state.writing = true;
      state.sync = true;
      if (state.destroyed) state.onwrite(new ERR_STREAM_DESTROYED("write"));
      else if (writev) stream._writev(chunk, state.onwrite);
      else stream._write(chunk, encoding, state.onwrite);
      state.sync = false;
    }
    function onwriteError(stream, state, sync, er, cb) {
      --state.pendingcb;
      if (sync) {
        process.nextTick(cb, er);
        process.nextTick(finishMaybe, stream, state);
        stream._writableState.errorEmitted = true;
        errorOrDestroy(stream, er);
      } else {
        cb(er);
        stream._writableState.errorEmitted = true;
        errorOrDestroy(stream, er);
        finishMaybe(stream, state);
      }
    }
    function onwriteStateUpdate(state) {
      state.writing = false;
      state.writecb = null;
      state.length -= state.writelen;
      state.writelen = 0;
    }
    function onwrite(stream, er) {
      var state = stream._writableState;
      var sync = state.sync;
      var cb = state.writecb;
      if (typeof cb !== "function") throw new ERR_MULTIPLE_CALLBACK();
      onwriteStateUpdate(state);
      if (er) onwriteError(stream, state, sync, er, cb);
      else {
        var finished = needFinish(state) || stream.destroyed;
        if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
          clearBuffer(stream, state);
        }
        if (sync) {
          process.nextTick(afterWrite, stream, state, finished, cb);
        } else {
          afterWrite(stream, state, finished, cb);
        }
      }
    }
    function afterWrite(stream, state, finished, cb) {
      if (!finished) onwriteDrain(stream, state);
      state.pendingcb--;
      cb();
      finishMaybe(stream, state);
    }
    function onwriteDrain(stream, state) {
      if (state.length === 0 && state.needDrain) {
        state.needDrain = false;
        stream.emit("drain");
      }
    }
    function clearBuffer(stream, state) {
      state.bufferProcessing = true;
      var entry = state.bufferedRequest;
      if (stream._writev && entry && entry.next) {
        var l = state.bufferedRequestCount;
        var buffer = new Array(l);
        var holder = state.corkedRequestsFree;
        holder.entry = entry;
        var count = 0;
        var allBuffers = true;
        while (entry) {
          buffer[count] = entry;
          if (!entry.isBuf) allBuffers = false;
          entry = entry.next;
          count += 1;
        }
        buffer.allBuffers = allBuffers;
        doWrite(stream, state, true, state.length, buffer, "", holder.finish);
        state.pendingcb++;
        state.lastBufferedRequest = null;
        if (holder.next) {
          state.corkedRequestsFree = holder.next;
          holder.next = null;
        } else {
          state.corkedRequestsFree = new CorkedRequest(state);
        }
        state.bufferedRequestCount = 0;
      } else {
        while (entry) {
          var chunk = entry.chunk;
          var encoding = entry.encoding;
          var cb = entry.callback;
          var len = state.objectMode ? 1 : chunk.length;
          doWrite(stream, state, false, len, chunk, encoding, cb);
          entry = entry.next;
          state.bufferedRequestCount--;
          if (state.writing) {
            break;
          }
        }
        if (entry === null) state.lastBufferedRequest = null;
      }
      state.bufferedRequest = entry;
      state.bufferProcessing = false;
    }
    Writable.prototype._write = function(chunk, encoding, cb) {
      cb(new ERR_METHOD_NOT_IMPLEMENTED("_write()"));
    };
    Writable.prototype._writev = null;
    Writable.prototype.end = function(chunk, encoding, cb) {
      var state = this._writableState;
      if (typeof chunk === "function") {
        cb = chunk;
        chunk = null;
        encoding = null;
      } else if (typeof encoding === "function") {
        cb = encoding;
        encoding = null;
      }
      if (chunk !== null && chunk !== void 0) this.write(chunk, encoding);
      if (state.corked) {
        state.corked = 1;
        this.uncork();
      }
      if (!state.ending) endWritable(this, state, cb);
      return this;
    };
    Object.defineProperty(Writable.prototype, "writableLength", {
      // making it explicit this property is not enumerable
      // because otherwise some prototype manipulation in
      // userland will fail
      enumerable: false,
      get: function get() {
        return this._writableState.length;
      }
    });
    function needFinish(state) {
      return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
    }
    function callFinal(stream, state) {
      stream._final(function(err) {
        state.pendingcb--;
        if (err) {
          errorOrDestroy(stream, err);
        }
        state.prefinished = true;
        stream.emit("prefinish");
        finishMaybe(stream, state);
      });
    }
    function prefinish(stream, state) {
      if (!state.prefinished && !state.finalCalled) {
        if (typeof stream._final === "function" && !state.destroyed) {
          state.pendingcb++;
          state.finalCalled = true;
          process.nextTick(callFinal, stream, state);
        } else {
          state.prefinished = true;
          stream.emit("prefinish");
        }
      }
    }
    function finishMaybe(stream, state) {
      var need = needFinish(state);
      if (need) {
        prefinish(stream, state);
        if (state.pendingcb === 0) {
          state.finished = true;
          stream.emit("finish");
          if (state.autoDestroy) {
            var rState = stream._readableState;
            if (!rState || rState.autoDestroy && rState.endEmitted) {
              stream.destroy();
            }
          }
        }
      }
      return need;
    }
    function endWritable(stream, state, cb) {
      state.ending = true;
      finishMaybe(stream, state);
      if (cb) {
        if (state.finished) process.nextTick(cb);
        else stream.once("finish", cb);
      }
      state.ended = true;
      stream.writable = false;
    }
    function onCorkedFinish(corkReq, state, err) {
      var entry = corkReq.entry;
      corkReq.entry = null;
      while (entry) {
        var cb = entry.callback;
        state.pendingcb--;
        cb(err);
        entry = entry.next;
      }
      state.corkedRequestsFree.next = corkReq;
    }
    Object.defineProperty(Writable.prototype, "destroyed", {
      // making it explicit this property is not enumerable
      // because otherwise some prototype manipulation in
      // userland will fail
      enumerable: false,
      get: function get() {
        if (this._writableState === void 0) {
          return false;
        }
        return this._writableState.destroyed;
      },
      set: function set(value) {
        if (!this._writableState) {
          return;
        }
        this._writableState.destroyed = value;
      }
    });
    Writable.prototype.destroy = destroyImpl.destroy;
    Writable.prototype._undestroy = destroyImpl.undestroy;
    Writable.prototype._destroy = function(err, cb) {
      cb(err);
    };
  }
});

// node_modules/readable-stream/lib/_stream_duplex.js
var require_stream_duplex = __commonJS({
  "node_modules/readable-stream/lib/_stream_duplex.js"(exports2, module2) {
    "use strict";
    var objectKeys = Object.keys || function(obj) {
      var keys2 = [];
      for (var key in obj) keys2.push(key);
      return keys2;
    };
    module2.exports = Duplex;
    var Readable = require_stream_readable();
    var Writable = require_stream_writable();
    require_inherits()(Duplex, Readable);
    {
      keys = objectKeys(Writable.prototype);
      for (v = 0; v < keys.length; v++) {
        method = keys[v];
        if (!Duplex.prototype[method]) Duplex.prototype[method] = Writable.prototype[method];
      }
    }
    var keys;
    var method;
    var v;
    function Duplex(options) {
      if (!(this instanceof Duplex)) return new Duplex(options);
      Readable.call(this, options);
      Writable.call(this, options);
      this.allowHalfOpen = true;
      if (options) {
        if (options.readable === false) this.readable = false;
        if (options.writable === false) this.writable = false;
        if (options.allowHalfOpen === false) {
          this.allowHalfOpen = false;
          this.once("end", onend);
        }
      }
    }
    Object.defineProperty(Duplex.prototype, "writableHighWaterMark", {
      // making it explicit this property is not enumerable
      // because otherwise some prototype manipulation in
      // userland will fail
      enumerable: false,
      get: function get() {
        return this._writableState.highWaterMark;
      }
    });
    Object.defineProperty(Duplex.prototype, "writableBuffer", {
      // making it explicit this property is not enumerable
      // because otherwise some prototype manipulation in
      // userland will fail
      enumerable: false,
      get: function get() {
        return this._writableState && this._writableState.getBuffer();
      }
    });
    Object.defineProperty(Duplex.prototype, "writableLength", {
      // making it explicit this property is not enumerable
      // because otherwise some prototype manipulation in
      // userland will fail
      enumerable: false,
      get: function get() {
        return this._writableState.length;
      }
    });
    function onend() {
      if (this._writableState.ended) return;
      process.nextTick(onEndNT, this);
    }
    function onEndNT(self2) {
      self2.end();
    }
    Object.defineProperty(Duplex.prototype, "destroyed", {
      // making it explicit this property is not enumerable
      // because otherwise some prototype manipulation in
      // userland will fail
      enumerable: false,
      get: function get() {
        if (this._readableState === void 0 || this._writableState === void 0) {
          return false;
        }
        return this._readableState.destroyed && this._writableState.destroyed;
      },
      set: function set(value) {
        if (this._readableState === void 0 || this._writableState === void 0) {
          return;
        }
        this._readableState.destroyed = value;
        this._writableState.destroyed = value;
      }
    });
  }
});

// node_modules/safe-buffer/index.js
var require_safe_buffer = __commonJS({
  "node_modules/safe-buffer/index.js"(exports2, module2) {
    var buffer = require("buffer");
    var Buffer2 = buffer.Buffer;
    function copyProps(src, dst) {
      for (var key in src) {
        dst[key] = src[key];
      }
    }
    if (Buffer2.from && Buffer2.alloc && Buffer2.allocUnsafe && Buffer2.allocUnsafeSlow) {
      module2.exports = buffer;
    } else {
      copyProps(buffer, exports2);
      exports2.Buffer = SafeBuffer;
    }
    function SafeBuffer(arg, encodingOrOffset, length) {
      return Buffer2(arg, encodingOrOffset, length);
    }
    SafeBuffer.prototype = Object.create(Buffer2.prototype);
    copyProps(Buffer2, SafeBuffer);
    SafeBuffer.from = function(arg, encodingOrOffset, length) {
      if (typeof arg === "number") {
        throw new TypeError("Argument must not be a number");
      }
      return Buffer2(arg, encodingOrOffset, length);
    };
    SafeBuffer.alloc = function(size, fill, encoding) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      var buf = Buffer2(size);
      if (fill !== void 0) {
        if (typeof encoding === "string") {
          buf.fill(fill, encoding);
        } else {
          buf.fill(fill);
        }
      } else {
        buf.fill(0);
      }
      return buf;
    };
    SafeBuffer.allocUnsafe = function(size) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      return Buffer2(size);
    };
    SafeBuffer.allocUnsafeSlow = function(size) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      return buffer.SlowBuffer(size);
    };
  }
});

// node_modules/string_decoder/lib/string_decoder.js
var require_string_decoder = __commonJS({
  "node_modules/string_decoder/lib/string_decoder.js"(exports2) {
    "use strict";
    var Buffer2 = require_safe_buffer().Buffer;
    var isEncoding = Buffer2.isEncoding || function(encoding) {
      encoding = "" + encoding;
      switch (encoding && encoding.toLowerCase()) {
        case "hex":
        case "utf8":
        case "utf-8":
        case "ascii":
        case "binary":
        case "base64":
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
        case "raw":
          return true;
        default:
          return false;
      }
    };
    function _normalizeEncoding(enc) {
      if (!enc) return "utf8";
      var retried;
      while (true) {
        switch (enc) {
          case "utf8":
          case "utf-8":
            return "utf8";
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return "utf16le";
          case "latin1":
          case "binary":
            return "latin1";
          case "base64":
          case "ascii":
          case "hex":
            return enc;
          default:
            if (retried) return;
            enc = ("" + enc).toLowerCase();
            retried = true;
        }
      }
    }
    function normalizeEncoding(enc) {
      var nenc = _normalizeEncoding(enc);
      if (typeof nenc !== "string" && (Buffer2.isEncoding === isEncoding || !isEncoding(enc))) throw new Error("Unknown encoding: " + enc);
      return nenc || enc;
    }
    exports2.StringDecoder = StringDecoder;
    function StringDecoder(encoding) {
      this.encoding = normalizeEncoding(encoding);
      var nb;
      switch (this.encoding) {
        case "utf16le":
          this.text = utf16Text;
          this.end = utf16End;
          nb = 4;
          break;
        case "utf8":
          this.fillLast = utf8FillLast;
          nb = 4;
          break;
        case "base64":
          this.text = base64Text;
          this.end = base64End;
          nb = 3;
          break;
        default:
          this.write = simpleWrite;
          this.end = simpleEnd;
          return;
      }
      this.lastNeed = 0;
      this.lastTotal = 0;
      this.lastChar = Buffer2.allocUnsafe(nb);
    }
    StringDecoder.prototype.write = function(buf) {
      if (buf.length === 0) return "";
      var r;
      var i;
      if (this.lastNeed) {
        r = this.fillLast(buf);
        if (r === void 0) return "";
        i = this.lastNeed;
        this.lastNeed = 0;
      } else {
        i = 0;
      }
      if (i < buf.length) return r ? r + this.text(buf, i) : this.text(buf, i);
      return r || "";
    };
    StringDecoder.prototype.end = utf8End;
    StringDecoder.prototype.text = utf8Text;
    StringDecoder.prototype.fillLast = function(buf) {
      if (this.lastNeed <= buf.length) {
        buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
        return this.lastChar.toString(this.encoding, 0, this.lastTotal);
      }
      buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
      this.lastNeed -= buf.length;
    };
    function utf8CheckByte(byte) {
      if (byte <= 127) return 0;
      else if (byte >> 5 === 6) return 2;
      else if (byte >> 4 === 14) return 3;
      else if (byte >> 3 === 30) return 4;
      return byte >> 6 === 2 ? -1 : -2;
    }
    function utf8CheckIncomplete(self2, buf, i) {
      var j = buf.length - 1;
      if (j < i) return 0;
      var nb = utf8CheckByte(buf[j]);
      if (nb >= 0) {
        if (nb > 0) self2.lastNeed = nb - 1;
        return nb;
      }
      if (--j < i || nb === -2) return 0;
      nb = utf8CheckByte(buf[j]);
      if (nb >= 0) {
        if (nb > 0) self2.lastNeed = nb - 2;
        return nb;
      }
      if (--j < i || nb === -2) return 0;
      nb = utf8CheckByte(buf[j]);
      if (nb >= 0) {
        if (nb > 0) {
          if (nb === 2) nb = 0;
          else self2.lastNeed = nb - 3;
        }
        return nb;
      }
      return 0;
    }
    function utf8CheckExtraBytes(self2, buf, p) {
      if ((buf[0] & 192) !== 128) {
        self2.lastNeed = 0;
        return "\uFFFD";
      }
      if (self2.lastNeed > 1 && buf.length > 1) {
        if ((buf[1] & 192) !== 128) {
          self2.lastNeed = 1;
          return "\uFFFD";
        }
        if (self2.lastNeed > 2 && buf.length > 2) {
          if ((buf[2] & 192) !== 128) {
            self2.lastNeed = 2;
            return "\uFFFD";
          }
        }
      }
    }
    function utf8FillLast(buf) {
      var p = this.lastTotal - this.lastNeed;
      var r = utf8CheckExtraBytes(this, buf, p);
      if (r !== void 0) return r;
      if (this.lastNeed <= buf.length) {
        buf.copy(this.lastChar, p, 0, this.lastNeed);
        return this.lastChar.toString(this.encoding, 0, this.lastTotal);
      }
      buf.copy(this.lastChar, p, 0, buf.length);
      this.lastNeed -= buf.length;
    }
    function utf8Text(buf, i) {
      var total = utf8CheckIncomplete(this, buf, i);
      if (!this.lastNeed) return buf.toString("utf8", i);
      this.lastTotal = total;
      var end = buf.length - (total - this.lastNeed);
      buf.copy(this.lastChar, 0, end);
      return buf.toString("utf8", i, end);
    }
    function utf8End(buf) {
      var r = buf && buf.length ? this.write(buf) : "";
      if (this.lastNeed) return r + "\uFFFD";
      return r;
    }
    function utf16Text(buf, i) {
      if ((buf.length - i) % 2 === 0) {
        var r = buf.toString("utf16le", i);
        if (r) {
          var c = r.charCodeAt(r.length - 1);
          if (c >= 55296 && c <= 56319) {
            this.lastNeed = 2;
            this.lastTotal = 4;
            this.lastChar[0] = buf[buf.length - 2];
            this.lastChar[1] = buf[buf.length - 1];
            return r.slice(0, -1);
          }
        }
        return r;
      }
      this.lastNeed = 1;
      this.lastTotal = 2;
      this.lastChar[0] = buf[buf.length - 1];
      return buf.toString("utf16le", i, buf.length - 1);
    }
    function utf16End(buf) {
      var r = buf && buf.length ? this.write(buf) : "";
      if (this.lastNeed) {
        var end = this.lastTotal - this.lastNeed;
        return r + this.lastChar.toString("utf16le", 0, end);
      }
      return r;
    }
    function base64Text(buf, i) {
      var n = (buf.length - i) % 3;
      if (n === 0) return buf.toString("base64", i);
      this.lastNeed = 3 - n;
      this.lastTotal = 3;
      if (n === 1) {
        this.lastChar[0] = buf[buf.length - 1];
      } else {
        this.lastChar[0] = buf[buf.length - 2];
        this.lastChar[1] = buf[buf.length - 1];
      }
      return buf.toString("base64", i, buf.length - n);
    }
    function base64End(buf) {
      var r = buf && buf.length ? this.write(buf) : "";
      if (this.lastNeed) return r + this.lastChar.toString("base64", 0, 3 - this.lastNeed);
      return r;
    }
    function simpleWrite(buf) {
      return buf.toString(this.encoding);
    }
    function simpleEnd(buf) {
      return buf && buf.length ? this.write(buf) : "";
    }
  }
});

// node_modules/readable-stream/lib/internal/streams/end-of-stream.js
var require_end_of_stream = __commonJS({
  "node_modules/readable-stream/lib/internal/streams/end-of-stream.js"(exports2, module2) {
    "use strict";
    var ERR_STREAM_PREMATURE_CLOSE = require_errors().codes.ERR_STREAM_PREMATURE_CLOSE;
    function once(callback) {
      var called = false;
      return function() {
        if (called) return;
        called = true;
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        callback.apply(this, args);
      };
    }
    function noop() {
    }
    function isRequest(stream) {
      return stream.setHeader && typeof stream.abort === "function";
    }
    function eos(stream, opts, callback) {
      if (typeof opts === "function") return eos(stream, null, opts);
      if (!opts) opts = {};
      callback = once(callback || noop);
      var readable = opts.readable || opts.readable !== false && stream.readable;
      var writable = opts.writable || opts.writable !== false && stream.writable;
      var onlegacyfinish = function onlegacyfinish2() {
        if (!stream.writable) onfinish();
      };
      var writableEnded = stream._writableState && stream._writableState.finished;
      var onfinish = function onfinish2() {
        writable = false;
        writableEnded = true;
        if (!readable) callback.call(stream);
      };
      var readableEnded = stream._readableState && stream._readableState.endEmitted;
      var onend = function onend2() {
        readable = false;
        readableEnded = true;
        if (!writable) callback.call(stream);
      };
      var onerror = function onerror2(err) {
        callback.call(stream, err);
      };
      var onclose = function onclose2() {
        var err;
        if (readable && !readableEnded) {
          if (!stream._readableState || !stream._readableState.ended) err = new ERR_STREAM_PREMATURE_CLOSE();
          return callback.call(stream, err);
        }
        if (writable && !writableEnded) {
          if (!stream._writableState || !stream._writableState.ended) err = new ERR_STREAM_PREMATURE_CLOSE();
          return callback.call(stream, err);
        }
      };
      var onrequest = function onrequest2() {
        stream.req.on("finish", onfinish);
      };
      if (isRequest(stream)) {
        stream.on("complete", onfinish);
        stream.on("abort", onclose);
        if (stream.req) onrequest();
        else stream.on("request", onrequest);
      } else if (writable && !stream._writableState) {
        stream.on("end", onlegacyfinish);
        stream.on("close", onlegacyfinish);
      }
      stream.on("end", onend);
      stream.on("finish", onfinish);
      if (opts.error !== false) stream.on("error", onerror);
      stream.on("close", onclose);
      return function() {
        stream.removeListener("complete", onfinish);
        stream.removeListener("abort", onclose);
        stream.removeListener("request", onrequest);
        if (stream.req) stream.req.removeListener("finish", onfinish);
        stream.removeListener("end", onlegacyfinish);
        stream.removeListener("close", onlegacyfinish);
        stream.removeListener("finish", onfinish);
        stream.removeListener("end", onend);
        stream.removeListener("error", onerror);
        stream.removeListener("close", onclose);
      };
    }
    module2.exports = eos;
  }
});

// node_modules/readable-stream/lib/internal/streams/async_iterator.js
var require_async_iterator = __commonJS({
  "node_modules/readable-stream/lib/internal/streams/async_iterator.js"(exports2, module2) {
    "use strict";
    var _Object$setPrototypeO;
    function _defineProperty(obj, key, value) {
      key = _toPropertyKey(key);
      if (key in obj) {
        Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
      } else {
        obj[key] = value;
      }
      return obj;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return typeof key === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (typeof input !== "object" || input === null) return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (typeof res !== "object") return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var finished = require_end_of_stream();
    var kLastResolve = Symbol("lastResolve");
    var kLastReject = Symbol("lastReject");
    var kError = Symbol("error");
    var kEnded = Symbol("ended");
    var kLastPromise = Symbol("lastPromise");
    var kHandlePromise = Symbol("handlePromise");
    var kStream = Symbol("stream");
    function createIterResult(value, done) {
      return {
        value,
        done
      };
    }
    function readAndResolve(iter) {
      var resolve = iter[kLastResolve];
      if (resolve !== null) {
        var data = iter[kStream].read();
        if (data !== null) {
          iter[kLastPromise] = null;
          iter[kLastResolve] = null;
          iter[kLastReject] = null;
          resolve(createIterResult(data, false));
        }
      }
    }
    function onReadable(iter) {
      process.nextTick(readAndResolve, iter);
    }
    function wrapForNext(lastPromise, iter) {
      return function(resolve, reject) {
        lastPromise.then(function() {
          if (iter[kEnded]) {
            resolve(createIterResult(void 0, true));
            return;
          }
          iter[kHandlePromise](resolve, reject);
        }, reject);
      };
    }
    var AsyncIteratorPrototype = Object.getPrototypeOf(function() {
    });
    var ReadableStreamAsyncIteratorPrototype = Object.setPrototypeOf((_Object$setPrototypeO = {
      get stream() {
        return this[kStream];
      },
      next: function next() {
        var _this = this;
        var error = this[kError];
        if (error !== null) {
          return Promise.reject(error);
        }
        if (this[kEnded]) {
          return Promise.resolve(createIterResult(void 0, true));
        }
        if (this[kStream].destroyed) {
          return new Promise(function(resolve, reject) {
            process.nextTick(function() {
              if (_this[kError]) {
                reject(_this[kError]);
              } else {
                resolve(createIterResult(void 0, true));
              }
            });
          });
        }
        var lastPromise = this[kLastPromise];
        var promise;
        if (lastPromise) {
          promise = new Promise(wrapForNext(lastPromise, this));
        } else {
          var data = this[kStream].read();
          if (data !== null) {
            return Promise.resolve(createIterResult(data, false));
          }
          promise = new Promise(this[kHandlePromise]);
        }
        this[kLastPromise] = promise;
        return promise;
      }
    }, _defineProperty(_Object$setPrototypeO, Symbol.asyncIterator, function() {
      return this;
    }), _defineProperty(_Object$setPrototypeO, "return", function _return() {
      var _this2 = this;
      return new Promise(function(resolve, reject) {
        _this2[kStream].destroy(null, function(err) {
          if (err) {
            reject(err);
            return;
          }
          resolve(createIterResult(void 0, true));
        });
      });
    }), _Object$setPrototypeO), AsyncIteratorPrototype);
    var createReadableStreamAsyncIterator = function createReadableStreamAsyncIterator2(stream) {
      var _Object$create;
      var iterator = Object.create(ReadableStreamAsyncIteratorPrototype, (_Object$create = {}, _defineProperty(_Object$create, kStream, {
        value: stream,
        writable: true
      }), _defineProperty(_Object$create, kLastResolve, {
        value: null,
        writable: true
      }), _defineProperty(_Object$create, kLastReject, {
        value: null,
        writable: true
      }), _defineProperty(_Object$create, kError, {
        value: null,
        writable: true
      }), _defineProperty(_Object$create, kEnded, {
        value: stream._readableState.endEmitted,
        writable: true
      }), _defineProperty(_Object$create, kHandlePromise, {
        value: function value(resolve, reject) {
          var data = iterator[kStream].read();
          if (data) {
            iterator[kLastPromise] = null;
            iterator[kLastResolve] = null;
            iterator[kLastReject] = null;
            resolve(createIterResult(data, false));
          } else {
            iterator[kLastResolve] = resolve;
            iterator[kLastReject] = reject;
          }
        },
        writable: true
      }), _Object$create));
      iterator[kLastPromise] = null;
      finished(stream, function(err) {
        if (err && err.code !== "ERR_STREAM_PREMATURE_CLOSE") {
          var reject = iterator[kLastReject];
          if (reject !== null) {
            iterator[kLastPromise] = null;
            iterator[kLastResolve] = null;
            iterator[kLastReject] = null;
            reject(err);
          }
          iterator[kError] = err;
          return;
        }
        var resolve = iterator[kLastResolve];
        if (resolve !== null) {
          iterator[kLastPromise] = null;
          iterator[kLastResolve] = null;
          iterator[kLastReject] = null;
          resolve(createIterResult(void 0, true));
        }
        iterator[kEnded] = true;
      });
      stream.on("readable", onReadable.bind(null, iterator));
      return iterator;
    };
    module2.exports = createReadableStreamAsyncIterator;
  }
});

// node_modules/readable-stream/lib/internal/streams/from.js
var require_from = __commonJS({
  "node_modules/readable-stream/lib/internal/streams/from.js"(exports2, module2) {
    "use strict";
    function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
      try {
        var info = gen[key](arg);
        var value = info.value;
      } catch (error) {
        reject(error);
        return;
      }
      if (info.done) {
        resolve(value);
      } else {
        Promise.resolve(value).then(_next, _throw);
      }
    }
    function _asyncToGenerator(fn) {
      return function() {
        var self2 = this, args = arguments;
        return new Promise(function(resolve, reject) {
          var gen = fn.apply(self2, args);
          function _next(value) {
            asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
          }
          function _throw(err) {
            asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
          }
          _next(void 0);
        });
      };
    }
    function ownKeys(object, enumerableOnly) {
      var keys = Object.keys(object);
      if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        enumerableOnly && (symbols = symbols.filter(function(sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        })), keys.push.apply(keys, symbols);
      }
      return keys;
    }
    function _objectSpread(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = null != arguments[i] ? arguments[i] : {};
        i % 2 ? ownKeys(Object(source), true).forEach(function(key) {
          _defineProperty(target, key, source[key]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function(key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
      return target;
    }
    function _defineProperty(obj, key, value) {
      key = _toPropertyKey(key);
      if (key in obj) {
        Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
      } else {
        obj[key] = value;
      }
      return obj;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return typeof key === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (typeof input !== "object" || input === null) return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (typeof res !== "object") return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var ERR_INVALID_ARG_TYPE = require_errors().codes.ERR_INVALID_ARG_TYPE;
    function from(Readable, iterable, opts) {
      var iterator;
      if (iterable && typeof iterable.next === "function") {
        iterator = iterable;
      } else if (iterable && iterable[Symbol.asyncIterator]) iterator = iterable[Symbol.asyncIterator]();
      else if (iterable && iterable[Symbol.iterator]) iterator = iterable[Symbol.iterator]();
      else throw new ERR_INVALID_ARG_TYPE("iterable", ["Iterable"], iterable);
      var readable = new Readable(_objectSpread({
        objectMode: true
      }, opts));
      var reading = false;
      readable._read = function() {
        if (!reading) {
          reading = true;
          next();
        }
      };
      function next() {
        return _next2.apply(this, arguments);
      }
      function _next2() {
        _next2 = _asyncToGenerator(function* () {
          try {
            var _yield$iterator$next = yield iterator.next(), value = _yield$iterator$next.value, done = _yield$iterator$next.done;
            if (done) {
              readable.push(null);
            } else if (readable.push(yield value)) {
              next();
            } else {
              reading = false;
            }
          } catch (err) {
            readable.destroy(err);
          }
        });
        return _next2.apply(this, arguments);
      }
      return readable;
    }
    module2.exports = from;
  }
});

// node_modules/readable-stream/lib/_stream_readable.js
var require_stream_readable = __commonJS({
  "node_modules/readable-stream/lib/_stream_readable.js"(exports2, module2) {
    "use strict";
    module2.exports = Readable;
    var Duplex;
    Readable.ReadableState = ReadableState;
    var EE = require("events").EventEmitter;
    var EElistenerCount = function EElistenerCount2(emitter, type) {
      return emitter.listeners(type).length;
    };
    var Stream = require_stream();
    var Buffer2 = require("buffer").Buffer;
    var OurUint8Array = (typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : typeof self !== "undefined" ? self : {}).Uint8Array || function() {
    };
    function _uint8ArrayToBuffer(chunk) {
      return Buffer2.from(chunk);
    }
    function _isUint8Array(obj) {
      return Buffer2.isBuffer(obj) || obj instanceof OurUint8Array;
    }
    var debugUtil = require("util");
    var debug;
    if (debugUtil && debugUtil.debuglog) {
      debug = debugUtil.debuglog("stream");
    } else {
      debug = function debug2() {
      };
    }
    var BufferList = require_buffer_list();
    var destroyImpl = require_destroy();
    var _require = require_state();
    var getHighWaterMark = _require.getHighWaterMark;
    var _require$codes = require_errors().codes;
    var ERR_INVALID_ARG_TYPE = _require$codes.ERR_INVALID_ARG_TYPE;
    var ERR_STREAM_PUSH_AFTER_EOF = _require$codes.ERR_STREAM_PUSH_AFTER_EOF;
    var ERR_METHOD_NOT_IMPLEMENTED = _require$codes.ERR_METHOD_NOT_IMPLEMENTED;
    var ERR_STREAM_UNSHIFT_AFTER_END_EVENT = _require$codes.ERR_STREAM_UNSHIFT_AFTER_END_EVENT;
    var StringDecoder;
    var createReadableStreamAsyncIterator;
    var from;
    require_inherits()(Readable, Stream);
    var errorOrDestroy = destroyImpl.errorOrDestroy;
    var kProxyEvents = ["error", "close", "destroy", "pause", "resume"];
    function prependListener(emitter, event, fn) {
      if (typeof emitter.prependListener === "function") return emitter.prependListener(event, fn);
      if (!emitter._events || !emitter._events[event]) emitter.on(event, fn);
      else if (Array.isArray(emitter._events[event])) emitter._events[event].unshift(fn);
      else emitter._events[event] = [fn, emitter._events[event]];
    }
    function ReadableState(options, stream, isDuplex) {
      Duplex = Duplex || require_stream_duplex();
      options = options || {};
      if (typeof isDuplex !== "boolean") isDuplex = stream instanceof Duplex;
      this.objectMode = !!options.objectMode;
      if (isDuplex) this.objectMode = this.objectMode || !!options.readableObjectMode;
      this.highWaterMark = getHighWaterMark(this, options, "readableHighWaterMark", isDuplex);
      this.buffer = new BufferList();
      this.length = 0;
      this.pipes = null;
      this.pipesCount = 0;
      this.flowing = null;
      this.ended = false;
      this.endEmitted = false;
      this.reading = false;
      this.sync = true;
      this.needReadable = false;
      this.emittedReadable = false;
      this.readableListening = false;
      this.resumeScheduled = false;
      this.paused = true;
      this.emitClose = options.emitClose !== false;
      this.autoDestroy = !!options.autoDestroy;
      this.destroyed = false;
      this.defaultEncoding = options.defaultEncoding || "utf8";
      this.awaitDrain = 0;
      this.readingMore = false;
      this.decoder = null;
      this.encoding = null;
      if (options.encoding) {
        if (!StringDecoder) StringDecoder = require_string_decoder().StringDecoder;
        this.decoder = new StringDecoder(options.encoding);
        this.encoding = options.encoding;
      }
    }
    function Readable(options) {
      Duplex = Duplex || require_stream_duplex();
      if (!(this instanceof Readable)) return new Readable(options);
      var isDuplex = this instanceof Duplex;
      this._readableState = new ReadableState(options, this, isDuplex);
      this.readable = true;
      if (options) {
        if (typeof options.read === "function") this._read = options.read;
        if (typeof options.destroy === "function") this._destroy = options.destroy;
      }
      Stream.call(this);
    }
    Object.defineProperty(Readable.prototype, "destroyed", {
      // making it explicit this property is not enumerable
      // because otherwise some prototype manipulation in
      // userland will fail
      enumerable: false,
      get: function get() {
        if (this._readableState === void 0) {
          return false;
        }
        return this._readableState.destroyed;
      },
      set: function set(value) {
        if (!this._readableState) {
          return;
        }
        this._readableState.destroyed = value;
      }
    });
    Readable.prototype.destroy = destroyImpl.destroy;
    Readable.prototype._undestroy = destroyImpl.undestroy;
    Readable.prototype._destroy = function(err, cb) {
      cb(err);
    };
    Readable.prototype.push = function(chunk, encoding) {
      var state = this._readableState;
      var skipChunkCheck;
      if (!state.objectMode) {
        if (typeof chunk === "string") {
          encoding = encoding || state.defaultEncoding;
          if (encoding !== state.encoding) {
            chunk = Buffer2.from(chunk, encoding);
            encoding = "";
          }
          skipChunkCheck = true;
        }
      } else {
        skipChunkCheck = true;
      }
      return readableAddChunk(this, chunk, encoding, false, skipChunkCheck);
    };
    Readable.prototype.unshift = function(chunk) {
      return readableAddChunk(this, chunk, null, true, false);
    };
    function readableAddChunk(stream, chunk, encoding, addToFront, skipChunkCheck) {
      debug("readableAddChunk", chunk);
      var state = stream._readableState;
      if (chunk === null) {
        state.reading = false;
        onEofChunk(stream, state);
      } else {
        var er;
        if (!skipChunkCheck) er = chunkInvalid(state, chunk);
        if (er) {
          errorOrDestroy(stream, er);
        } else if (state.objectMode || chunk && chunk.length > 0) {
          if (typeof chunk !== "string" && !state.objectMode && Object.getPrototypeOf(chunk) !== Buffer2.prototype) {
            chunk = _uint8ArrayToBuffer(chunk);
          }
          if (addToFront) {
            if (state.endEmitted) errorOrDestroy(stream, new ERR_STREAM_UNSHIFT_AFTER_END_EVENT());
            else addChunk(stream, state, chunk, true);
          } else if (state.ended) {
            errorOrDestroy(stream, new ERR_STREAM_PUSH_AFTER_EOF());
          } else if (state.destroyed) {
            return false;
          } else {
            state.reading = false;
            if (state.decoder && !encoding) {
              chunk = state.decoder.write(chunk);
              if (state.objectMode || chunk.length !== 0) addChunk(stream, state, chunk, false);
              else maybeReadMore(stream, state);
            } else {
              addChunk(stream, state, chunk, false);
            }
          }
        } else if (!addToFront) {
          state.reading = false;
          maybeReadMore(stream, state);
        }
      }
      return !state.ended && (state.length < state.highWaterMark || state.length === 0);
    }
    function addChunk(stream, state, chunk, addToFront) {
      if (state.flowing && state.length === 0 && !state.sync) {
        state.awaitDrain = 0;
        stream.emit("data", chunk);
      } else {
        state.length += state.objectMode ? 1 : chunk.length;
        if (addToFront) state.buffer.unshift(chunk);
        else state.buffer.push(chunk);
        if (state.needReadable) emitReadable(stream);
      }
      maybeReadMore(stream, state);
    }
    function chunkInvalid(state, chunk) {
      var er;
      if (!_isUint8Array(chunk) && typeof chunk !== "string" && chunk !== void 0 && !state.objectMode) {
        er = new ERR_INVALID_ARG_TYPE("chunk", ["string", "Buffer", "Uint8Array"], chunk);
      }
      return er;
    }
    Readable.prototype.isPaused = function() {
      return this._readableState.flowing === false;
    };
    Readable.prototype.setEncoding = function(enc) {
      if (!StringDecoder) StringDecoder = require_string_decoder().StringDecoder;
      var decoder = new StringDecoder(enc);
      this._readableState.decoder = decoder;
      this._readableState.encoding = this._readableState.decoder.encoding;
      var p = this._readableState.buffer.head;
      var content = "";
      while (p !== null) {
        content += decoder.write(p.data);
        p = p.next;
      }
      this._readableState.buffer.clear();
      if (content !== "") this._readableState.buffer.push(content);
      this._readableState.length = content.length;
      return this;
    };
    var MAX_HWM = 1073741824;
    function computeNewHighWaterMark(n) {
      if (n >= MAX_HWM) {
        n = MAX_HWM;
      } else {
        n--;
        n |= n >>> 1;
        n |= n >>> 2;
        n |= n >>> 4;
        n |= n >>> 8;
        n |= n >>> 16;
        n++;
      }
      return n;
    }
    function howMuchToRead(n, state) {
      if (n <= 0 || state.length === 0 && state.ended) return 0;
      if (state.objectMode) return 1;
      if (n !== n) {
        if (state.flowing && state.length) return state.buffer.head.data.length;
        else return state.length;
      }
      if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n);
      if (n <= state.length) return n;
      if (!state.ended) {
        state.needReadable = true;
        return 0;
      }
      return state.length;
    }
    Readable.prototype.read = function(n) {
      debug("read", n);
      n = parseInt(n, 10);
      var state = this._readableState;
      var nOrig = n;
      if (n !== 0) state.emittedReadable = false;
      if (n === 0 && state.needReadable && ((state.highWaterMark !== 0 ? state.length >= state.highWaterMark : state.length > 0) || state.ended)) {
        debug("read: emitReadable", state.length, state.ended);
        if (state.length === 0 && state.ended) endReadable(this);
        else emitReadable(this);
        return null;
      }
      n = howMuchToRead(n, state);
      if (n === 0 && state.ended) {
        if (state.length === 0) endReadable(this);
        return null;
      }
      var doRead = state.needReadable;
      debug("need readable", doRead);
      if (state.length === 0 || state.length - n < state.highWaterMark) {
        doRead = true;
        debug("length less than watermark", doRead);
      }
      if (state.ended || state.reading) {
        doRead = false;
        debug("reading or ended", doRead);
      } else if (doRead) {
        debug("do read");
        state.reading = true;
        state.sync = true;
        if (state.length === 0) state.needReadable = true;
        this._read(state.highWaterMark);
        state.sync = false;
        if (!state.reading) n = howMuchToRead(nOrig, state);
      }
      var ret;
      if (n > 0) ret = fromList(n, state);
      else ret = null;
      if (ret === null) {
        state.needReadable = state.length <= state.highWaterMark;
        n = 0;
      } else {
        state.length -= n;
        state.awaitDrain = 0;
      }
      if (state.length === 0) {
        if (!state.ended) state.needReadable = true;
        if (nOrig !== n && state.ended) endReadable(this);
      }
      if (ret !== null) this.emit("data", ret);
      return ret;
    };
    function onEofChunk(stream, state) {
      debug("onEofChunk");
      if (state.ended) return;
      if (state.decoder) {
        var chunk = state.decoder.end();
        if (chunk && chunk.length) {
          state.buffer.push(chunk);
          state.length += state.objectMode ? 1 : chunk.length;
        }
      }
      state.ended = true;
      if (state.sync) {
        emitReadable(stream);
      } else {
        state.needReadable = false;
        if (!state.emittedReadable) {
          state.emittedReadable = true;
          emitReadable_(stream);
        }
      }
    }
    function emitReadable(stream) {
      var state = stream._readableState;
      debug("emitReadable", state.needReadable, state.emittedReadable);
      state.needReadable = false;
      if (!state.emittedReadable) {
        debug("emitReadable", state.flowing);
        state.emittedReadable = true;
        process.nextTick(emitReadable_, stream);
      }
    }
    function emitReadable_(stream) {
      var state = stream._readableState;
      debug("emitReadable_", state.destroyed, state.length, state.ended);
      if (!state.destroyed && (state.length || state.ended)) {
        stream.emit("readable");
        state.emittedReadable = false;
      }
      state.needReadable = !state.flowing && !state.ended && state.length <= state.highWaterMark;
      flow(stream);
    }
    function maybeReadMore(stream, state) {
      if (!state.readingMore) {
        state.readingMore = true;
        process.nextTick(maybeReadMore_, stream, state);
      }
    }
    function maybeReadMore_(stream, state) {
      while (!state.reading && !state.ended && (state.length < state.highWaterMark || state.flowing && state.length === 0)) {
        var len = state.length;
        debug("maybeReadMore read 0");
        stream.read(0);
        if (len === state.length)
          break;
      }
      state.readingMore = false;
    }
    Readable.prototype._read = function(n) {
      errorOrDestroy(this, new ERR_METHOD_NOT_IMPLEMENTED("_read()"));
    };
    Readable.prototype.pipe = function(dest, pipeOpts) {
      var src = this;
      var state = this._readableState;
      switch (state.pipesCount) {
        case 0:
          state.pipes = dest;
          break;
        case 1:
          state.pipes = [state.pipes, dest];
          break;
        default:
          state.pipes.push(dest);
          break;
      }
      state.pipesCount += 1;
      debug("pipe count=%d opts=%j", state.pipesCount, pipeOpts);
      var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;
      var endFn = doEnd ? onend : unpipe;
      if (state.endEmitted) process.nextTick(endFn);
      else src.once("end", endFn);
      dest.on("unpipe", onunpipe);
      function onunpipe(readable, unpipeInfo) {
        debug("onunpipe");
        if (readable === src) {
          if (unpipeInfo && unpipeInfo.hasUnpiped === false) {
            unpipeInfo.hasUnpiped = true;
            cleanup();
          }
        }
      }
      function onend() {
        debug("onend");
        dest.end();
      }
      var ondrain = pipeOnDrain(src);
      dest.on("drain", ondrain);
      var cleanedUp = false;
      function cleanup() {
        debug("cleanup");
        dest.removeListener("close", onclose);
        dest.removeListener("finish", onfinish);
        dest.removeListener("drain", ondrain);
        dest.removeListener("error", onerror);
        dest.removeListener("unpipe", onunpipe);
        src.removeListener("end", onend);
        src.removeListener("end", unpipe);
        src.removeListener("data", ondata);
        cleanedUp = true;
        if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain)) ondrain();
      }
      src.on("data", ondata);
      function ondata(chunk) {
        debug("ondata");
        var ret = dest.write(chunk);
        debug("dest.write", ret);
        if (ret === false) {
          if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
            debug("false write response, pause", state.awaitDrain);
            state.awaitDrain++;
          }
          src.pause();
        }
      }
      function onerror(er) {
        debug("onerror", er);
        unpipe();
        dest.removeListener("error", onerror);
        if (EElistenerCount(dest, "error") === 0) errorOrDestroy(dest, er);
      }
      prependListener(dest, "error", onerror);
      function onclose() {
        dest.removeListener("finish", onfinish);
        unpipe();
      }
      dest.once("close", onclose);
      function onfinish() {
        debug("onfinish");
        dest.removeListener("close", onclose);
        unpipe();
      }
      dest.once("finish", onfinish);
      function unpipe() {
        debug("unpipe");
        src.unpipe(dest);
      }
      dest.emit("pipe", src);
      if (!state.flowing) {
        debug("pipe resume");
        src.resume();
      }
      return dest;
    };
    function pipeOnDrain(src) {
      return function pipeOnDrainFunctionResult() {
        var state = src._readableState;
        debug("pipeOnDrain", state.awaitDrain);
        if (state.awaitDrain) state.awaitDrain--;
        if (state.awaitDrain === 0 && EElistenerCount(src, "data")) {
          state.flowing = true;
          flow(src);
        }
      };
    }
    Readable.prototype.unpipe = function(dest) {
      var state = this._readableState;
      var unpipeInfo = {
        hasUnpiped: false
      };
      if (state.pipesCount === 0) return this;
      if (state.pipesCount === 1) {
        if (dest && dest !== state.pipes) return this;
        if (!dest) dest = state.pipes;
        state.pipes = null;
        state.pipesCount = 0;
        state.flowing = false;
        if (dest) dest.emit("unpipe", this, unpipeInfo);
        return this;
      }
      if (!dest) {
        var dests = state.pipes;
        var len = state.pipesCount;
        state.pipes = null;
        state.pipesCount = 0;
        state.flowing = false;
        for (var i = 0; i < len; i++) dests[i].emit("unpipe", this, {
          hasUnpiped: false
        });
        return this;
      }
      var index = indexOf(state.pipes, dest);
      if (index === -1) return this;
      state.pipes.splice(index, 1);
      state.pipesCount -= 1;
      if (state.pipesCount === 1) state.pipes = state.pipes[0];
      dest.emit("unpipe", this, unpipeInfo);
      return this;
    };
    Readable.prototype.on = function(ev, fn) {
      var res = Stream.prototype.on.call(this, ev, fn);
      var state = this._readableState;
      if (ev === "data") {
        state.readableListening = this.listenerCount("readable") > 0;
        if (state.flowing !== false) this.resume();
      } else if (ev === "readable") {
        if (!state.endEmitted && !state.readableListening) {
          state.readableListening = state.needReadable = true;
          state.flowing = false;
          state.emittedReadable = false;
          debug("on readable", state.length, state.reading);
          if (state.length) {
            emitReadable(this);
          } else if (!state.reading) {
            process.nextTick(nReadingNextTick, this);
          }
        }
      }
      return res;
    };
    Readable.prototype.addListener = Readable.prototype.on;
    Readable.prototype.removeListener = function(ev, fn) {
      var res = Stream.prototype.removeListener.call(this, ev, fn);
      if (ev === "readable") {
        process.nextTick(updateReadableListening, this);
      }
      return res;
    };
    Readable.prototype.removeAllListeners = function(ev) {
      var res = Stream.prototype.removeAllListeners.apply(this, arguments);
      if (ev === "readable" || ev === void 0) {
        process.nextTick(updateReadableListening, this);
      }
      return res;
    };
    function updateReadableListening(self2) {
      var state = self2._readableState;
      state.readableListening = self2.listenerCount("readable") > 0;
      if (state.resumeScheduled && !state.paused) {
        state.flowing = true;
      } else if (self2.listenerCount("data") > 0) {
        self2.resume();
      }
    }
    function nReadingNextTick(self2) {
      debug("readable nexttick read 0");
      self2.read(0);
    }
    Readable.prototype.resume = function() {
      var state = this._readableState;
      if (!state.flowing) {
        debug("resume");
        state.flowing = !state.readableListening;
        resume(this, state);
      }
      state.paused = false;
      return this;
    };
    function resume(stream, state) {
      if (!state.resumeScheduled) {
        state.resumeScheduled = true;
        process.nextTick(resume_, stream, state);
      }
    }
    function resume_(stream, state) {
      debug("resume", state.reading);
      if (!state.reading) {
        stream.read(0);
      }
      state.resumeScheduled = false;
      stream.emit("resume");
      flow(stream);
      if (state.flowing && !state.reading) stream.read(0);
    }
    Readable.prototype.pause = function() {
      debug("call pause flowing=%j", this._readableState.flowing);
      if (this._readableState.flowing !== false) {
        debug("pause");
        this._readableState.flowing = false;
        this.emit("pause");
      }
      this._readableState.paused = true;
      return this;
    };
    function flow(stream) {
      var state = stream._readableState;
      debug("flow", state.flowing);
      while (state.flowing && stream.read() !== null) ;
    }
    Readable.prototype.wrap = function(stream) {
      var _this = this;
      var state = this._readableState;
      var paused = false;
      stream.on("end", function() {
        debug("wrapped end");
        if (state.decoder && !state.ended) {
          var chunk = state.decoder.end();
          if (chunk && chunk.length) _this.push(chunk);
        }
        _this.push(null);
      });
      stream.on("data", function(chunk) {
        debug("wrapped data");
        if (state.decoder) chunk = state.decoder.write(chunk);
        if (state.objectMode && (chunk === null || chunk === void 0)) return;
        else if (!state.objectMode && (!chunk || !chunk.length)) return;
        var ret = _this.push(chunk);
        if (!ret) {
          paused = true;
          stream.pause();
        }
      });
      for (var i in stream) {
        if (this[i] === void 0 && typeof stream[i] === "function") {
          this[i] = /* @__PURE__ */ function methodWrap(method) {
            return function methodWrapReturnFunction() {
              return stream[method].apply(stream, arguments);
            };
          }(i);
        }
      }
      for (var n = 0; n < kProxyEvents.length; n++) {
        stream.on(kProxyEvents[n], this.emit.bind(this, kProxyEvents[n]));
      }
      this._read = function(n2) {
        debug("wrapped _read", n2);
        if (paused) {
          paused = false;
          stream.resume();
        }
      };
      return this;
    };
    if (typeof Symbol === "function") {
      Readable.prototype[Symbol.asyncIterator] = function() {
        if (createReadableStreamAsyncIterator === void 0) {
          createReadableStreamAsyncIterator = require_async_iterator();
        }
        return createReadableStreamAsyncIterator(this);
      };
    }
    Object.defineProperty(Readable.prototype, "readableHighWaterMark", {
      // making it explicit this property is not enumerable
      // because otherwise some prototype manipulation in
      // userland will fail
      enumerable: false,
      get: function get() {
        return this._readableState.highWaterMark;
      }
    });
    Object.defineProperty(Readable.prototype, "readableBuffer", {
      // making it explicit this property is not enumerable
      // because otherwise some prototype manipulation in
      // userland will fail
      enumerable: false,
      get: function get() {
        return this._readableState && this._readableState.buffer;
      }
    });
    Object.defineProperty(Readable.prototype, "readableFlowing", {
      // making it explicit this property is not enumerable
      // because otherwise some prototype manipulation in
      // userland will fail
      enumerable: false,
      get: function get() {
        return this._readableState.flowing;
      },
      set: function set(state) {
        if (this._readableState) {
          this._readableState.flowing = state;
        }
      }
    });
    Readable._fromList = fromList;
    Object.defineProperty(Readable.prototype, "readableLength", {
      // making it explicit this property is not enumerable
      // because otherwise some prototype manipulation in
      // userland will fail
      enumerable: false,
      get: function get() {
        return this._readableState.length;
      }
    });
    function fromList(n, state) {
      if (state.length === 0) return null;
      var ret;
      if (state.objectMode) ret = state.buffer.shift();
      else if (!n || n >= state.length) {
        if (state.decoder) ret = state.buffer.join("");
        else if (state.buffer.length === 1) ret = state.buffer.first();
        else ret = state.buffer.concat(state.length);
        state.buffer.clear();
      } else {
        ret = state.buffer.consume(n, state.decoder);
      }
      return ret;
    }
    function endReadable(stream) {
      var state = stream._readableState;
      debug("endReadable", state.endEmitted);
      if (!state.endEmitted) {
        state.ended = true;
        process.nextTick(endReadableNT, state, stream);
      }
    }
    function endReadableNT(state, stream) {
      debug("endReadableNT", state.endEmitted, state.length);
      if (!state.endEmitted && state.length === 0) {
        state.endEmitted = true;
        stream.readable = false;
        stream.emit("end");
        if (state.autoDestroy) {
          var wState = stream._writableState;
          if (!wState || wState.autoDestroy && wState.finished) {
            stream.destroy();
          }
        }
      }
    }
    if (typeof Symbol === "function") {
      Readable.from = function(iterable, opts) {
        if (from === void 0) {
          from = require_from();
        }
        return from(Readable, iterable, opts);
      };
    }
    function indexOf(xs, x) {
      for (var i = 0, l = xs.length; i < l; i++) {
        if (xs[i] === x) return i;
      }
      return -1;
    }
  }
});

// node_modules/readable-stream/lib/_stream_transform.js
var require_stream_transform = __commonJS({
  "node_modules/readable-stream/lib/_stream_transform.js"(exports2, module2) {
    "use strict";
    module2.exports = Transform;
    var _require$codes = require_errors().codes;
    var ERR_METHOD_NOT_IMPLEMENTED = _require$codes.ERR_METHOD_NOT_IMPLEMENTED;
    var ERR_MULTIPLE_CALLBACK = _require$codes.ERR_MULTIPLE_CALLBACK;
    var ERR_TRANSFORM_ALREADY_TRANSFORMING = _require$codes.ERR_TRANSFORM_ALREADY_TRANSFORMING;
    var ERR_TRANSFORM_WITH_LENGTH_0 = _require$codes.ERR_TRANSFORM_WITH_LENGTH_0;
    var Duplex = require_stream_duplex();
    require_inherits()(Transform, Duplex);
    function afterTransform(er, data) {
      var ts = this._transformState;
      ts.transforming = false;
      var cb = ts.writecb;
      if (cb === null) {
        return this.emit("error", new ERR_MULTIPLE_CALLBACK());
      }
      ts.writechunk = null;
      ts.writecb = null;
      if (data != null)
        this.push(data);
      cb(er);
      var rs = this._readableState;
      rs.reading = false;
      if (rs.needReadable || rs.length < rs.highWaterMark) {
        this._read(rs.highWaterMark);
      }
    }
    function Transform(options) {
      if (!(this instanceof Transform)) return new Transform(options);
      Duplex.call(this, options);
      this._transformState = {
        afterTransform: afterTransform.bind(this),
        needTransform: false,
        transforming: false,
        writecb: null,
        writechunk: null,
        writeencoding: null
      };
      this._readableState.needReadable = true;
      this._readableState.sync = false;
      if (options) {
        if (typeof options.transform === "function") this._transform = options.transform;
        if (typeof options.flush === "function") this._flush = options.flush;
      }
      this.on("prefinish", prefinish);
    }
    function prefinish() {
      var _this = this;
      if (typeof this._flush === "function" && !this._readableState.destroyed) {
        this._flush(function(er, data) {
          done(_this, er, data);
        });
      } else {
        done(this, null, null);
      }
    }
    Transform.prototype.push = function(chunk, encoding) {
      this._transformState.needTransform = false;
      return Duplex.prototype.push.call(this, chunk, encoding);
    };
    Transform.prototype._transform = function(chunk, encoding, cb) {
      cb(new ERR_METHOD_NOT_IMPLEMENTED("_transform()"));
    };
    Transform.prototype._write = function(chunk, encoding, cb) {
      var ts = this._transformState;
      ts.writecb = cb;
      ts.writechunk = chunk;
      ts.writeencoding = encoding;
      if (!ts.transforming) {
        var rs = this._readableState;
        if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) this._read(rs.highWaterMark);
      }
    };
    Transform.prototype._read = function(n) {
      var ts = this._transformState;
      if (ts.writechunk !== null && !ts.transforming) {
        ts.transforming = true;
        this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
      } else {
        ts.needTransform = true;
      }
    };
    Transform.prototype._destroy = function(err, cb) {
      Duplex.prototype._destroy.call(this, err, function(err2) {
        cb(err2);
      });
    };
    function done(stream, er, data) {
      if (er) return stream.emit("error", er);
      if (data != null)
        stream.push(data);
      if (stream._writableState.length) throw new ERR_TRANSFORM_WITH_LENGTH_0();
      if (stream._transformState.transforming) throw new ERR_TRANSFORM_ALREADY_TRANSFORMING();
      return stream.push(null);
    }
  }
});

// node_modules/readable-stream/lib/_stream_passthrough.js
var require_stream_passthrough = __commonJS({
  "node_modules/readable-stream/lib/_stream_passthrough.js"(exports2, module2) {
    "use strict";
    module2.exports = PassThrough;
    var Transform = require_stream_transform();
    require_inherits()(PassThrough, Transform);
    function PassThrough(options) {
      if (!(this instanceof PassThrough)) return new PassThrough(options);
      Transform.call(this, options);
    }
    PassThrough.prototype._transform = function(chunk, encoding, cb) {
      cb(null, chunk);
    };
  }
});

// node_modules/readable-stream/lib/internal/streams/pipeline.js
var require_pipeline = __commonJS({
  "node_modules/readable-stream/lib/internal/streams/pipeline.js"(exports2, module2) {
    "use strict";
    var eos;
    function once(callback) {
      var called = false;
      return function() {
        if (called) return;
        called = true;
        callback.apply(void 0, arguments);
      };
    }
    var _require$codes = require_errors().codes;
    var ERR_MISSING_ARGS = _require$codes.ERR_MISSING_ARGS;
    var ERR_STREAM_DESTROYED = _require$codes.ERR_STREAM_DESTROYED;
    function noop(err) {
      if (err) throw err;
    }
    function isRequest(stream) {
      return stream.setHeader && typeof stream.abort === "function";
    }
    function destroyer(stream, reading, writing, callback) {
      callback = once(callback);
      var closed = false;
      stream.on("close", function() {
        closed = true;
      });
      if (eos === void 0) eos = require_end_of_stream();
      eos(stream, {
        readable: reading,
        writable: writing
      }, function(err) {
        if (err) return callback(err);
        closed = true;
        callback();
      });
      var destroyed = false;
      return function(err) {
        if (closed) return;
        if (destroyed) return;
        destroyed = true;
        if (isRequest(stream)) return stream.abort();
        if (typeof stream.destroy === "function") return stream.destroy();
        callback(err || new ERR_STREAM_DESTROYED("pipe"));
      };
    }
    function call(fn) {
      fn();
    }
    function pipe(from, to) {
      return from.pipe(to);
    }
    function popCallback(streams) {
      if (!streams.length) return noop;
      if (typeof streams[streams.length - 1] !== "function") return noop;
      return streams.pop();
    }
    function pipeline() {
      for (var _len = arguments.length, streams = new Array(_len), _key = 0; _key < _len; _key++) {
        streams[_key] = arguments[_key];
      }
      var callback = popCallback(streams);
      if (Array.isArray(streams[0])) streams = streams[0];
      if (streams.length < 2) {
        throw new ERR_MISSING_ARGS("streams");
      }
      var error;
      var destroys = streams.map(function(stream, i) {
        var reading = i < streams.length - 1;
        var writing = i > 0;
        return destroyer(stream, reading, writing, function(err) {
          if (!error) error = err;
          if (err) destroys.forEach(call);
          if (reading) return;
          destroys.forEach(call);
          callback(error);
        });
      });
      return streams.reduce(pipe);
    }
    module2.exports = pipeline;
  }
});

// node_modules/readable-stream/readable.js
var require_readable = __commonJS({
  "node_modules/readable-stream/readable.js"(exports2, module2) {
    var Stream = require("stream");
    if (process.env.READABLE_STREAM === "disable" && Stream) {
      module2.exports = Stream.Readable;
      Object.assign(module2.exports, Stream);
      module2.exports.Stream = Stream;
    } else {
      exports2 = module2.exports = require_stream_readable();
      exports2.Stream = Stream || exports2;
      exports2.Readable = exports2;
      exports2.Writable = require_stream_writable();
      exports2.Duplex = require_stream_duplex();
      exports2.Transform = require_stream_transform();
      exports2.PassThrough = require_stream_passthrough();
      exports2.finished = require_end_of_stream();
      exports2.pipeline = require_pipeline();
    }
  }
});

// node_modules/buffer-from/index.js
var require_buffer_from = __commonJS({
  "node_modules/buffer-from/index.js"(exports2, module2) {
    var toString = Object.prototype.toString;
    var isModern = typeof Buffer !== "undefined" && typeof Buffer.alloc === "function" && typeof Buffer.allocUnsafe === "function" && typeof Buffer.from === "function";
    function isArrayBuffer(input) {
      return toString.call(input).slice(8, -1) === "ArrayBuffer";
    }
    function fromArrayBuffer(obj, byteOffset, length) {
      byteOffset >>>= 0;
      var maxLength = obj.byteLength - byteOffset;
      if (maxLength < 0) {
        throw new RangeError("'offset' is out of bounds");
      }
      if (length === void 0) {
        length = maxLength;
      } else {
        length >>>= 0;
        if (length > maxLength) {
          throw new RangeError("'length' is out of bounds");
        }
      }
      return isModern ? Buffer.from(obj.slice(byteOffset, byteOffset + length)) : new Buffer(new Uint8Array(obj.slice(byteOffset, byteOffset + length)));
    }
    function fromString(string, encoding) {
      if (typeof encoding !== "string" || encoding === "") {
        encoding = "utf8";
      }
      if (!Buffer.isEncoding(encoding)) {
        throw new TypeError('"encoding" must be a valid string encoding');
      }
      return isModern ? Buffer.from(string, encoding) : new Buffer(string, encoding);
    }
    function bufferFrom(value, encodingOrOffset, length) {
      if (typeof value === "number") {
        throw new TypeError('"value" argument must not be a number');
      }
      if (isArrayBuffer(value)) {
        return fromArrayBuffer(value, encodingOrOffset, length);
      }
      if (typeof value === "string") {
        return fromString(value, encodingOrOffset);
      }
      return isModern ? Buffer.from(value) : new Buffer(value);
    }
    module2.exports = bufferFrom;
  }
});

// node_modules/typedarray/index.js
var require_typedarray = __commonJS({
  "node_modules/typedarray/index.js"(exports2) {
    var undefined2 = void 0;
    var MAX_ARRAY_LENGTH = 1e5;
    var ECMAScript = /* @__PURE__ */ function() {
      var opts = Object.prototype.toString, ophop = Object.prototype.hasOwnProperty;
      return {
        // Class returns internal [[Class]] property, used to avoid cross-frame instanceof issues:
        Class: function(v) {
          return opts.call(v).replace(/^\[object *|\]$/g, "");
        },
        HasProperty: function(o, p) {
          return p in o;
        },
        HasOwnProperty: function(o, p) {
          return ophop.call(o, p);
        },
        IsCallable: function(o) {
          return typeof o === "function";
        },
        ToInt32: function(v) {
          return v >> 0;
        },
        ToUint32: function(v) {
          return v >>> 0;
        }
      };
    }();
    var LN2 = Math.LN2;
    var abs = Math.abs;
    var floor = Math.floor;
    var log = Math.log;
    var min = Math.min;
    var pow = Math.pow;
    var round = Math.round;
    function configureProperties(obj) {
      if (getOwnPropNames && defineProp) {
        var props = getOwnPropNames(obj), i;
        for (i = 0; i < props.length; i += 1) {
          defineProp(obj, props[i], {
            value: obj[props[i]],
            writable: false,
            enumerable: false,
            configurable: false
          });
        }
      }
    }
    var defineProp;
    if (Object.defineProperty && function() {
      try {
        Object.defineProperty({}, "x", {});
        return true;
      } catch (e) {
        return false;
      }
    }()) {
      defineProp = Object.defineProperty;
    } else {
      defineProp = function(o, p, desc) {
        if (!o === Object(o)) throw new TypeError("Object.defineProperty called on non-object");
        if (ECMAScript.HasProperty(desc, "get") && Object.prototype.__defineGetter__) {
          Object.prototype.__defineGetter__.call(o, p, desc.get);
        }
        if (ECMAScript.HasProperty(desc, "set") && Object.prototype.__defineSetter__) {
          Object.prototype.__defineSetter__.call(o, p, desc.set);
        }
        if (ECMAScript.HasProperty(desc, "value")) {
          o[p] = desc.value;
        }
        return o;
      };
    }
    var getOwnPropNames = Object.getOwnPropertyNames || function(o) {
      if (o !== Object(o)) throw new TypeError("Object.getOwnPropertyNames called on non-object");
      var props = [], p;
      for (p in o) {
        if (ECMAScript.HasOwnProperty(o, p)) {
          props.push(p);
        }
      }
      return props;
    };
    function makeArrayAccessors(obj) {
      if (!defineProp) {
        return;
      }
      if (obj.length > MAX_ARRAY_LENGTH) throw new RangeError("Array too large for polyfill");
      function makeArrayAccessor(index) {
        defineProp(obj, index, {
          "get": function() {
            return obj._getter(index);
          },
          "set": function(v) {
            obj._setter(index, v);
          },
          enumerable: true,
          configurable: false
        });
      }
      var i;
      for (i = 0; i < obj.length; i += 1) {
        makeArrayAccessor(i);
      }
    }
    function as_signed(value, bits) {
      var s = 32 - bits;
      return value << s >> s;
    }
    function as_unsigned(value, bits) {
      var s = 32 - bits;
      return value << s >>> s;
    }
    function packI8(n) {
      return [n & 255];
    }
    function unpackI8(bytes) {
      return as_signed(bytes[0], 8);
    }
    function packU8(n) {
      return [n & 255];
    }
    function unpackU8(bytes) {
      return as_unsigned(bytes[0], 8);
    }
    function packU8Clamped(n) {
      n = round(Number(n));
      return [n < 0 ? 0 : n > 255 ? 255 : n & 255];
    }
    function packI16(n) {
      return [n >> 8 & 255, n & 255];
    }
    function unpackI16(bytes) {
      return as_signed(bytes[0] << 8 | bytes[1], 16);
    }
    function packU16(n) {
      return [n >> 8 & 255, n & 255];
    }
    function unpackU16(bytes) {
      return as_unsigned(bytes[0] << 8 | bytes[1], 16);
    }
    function packI32(n) {
      return [n >> 24 & 255, n >> 16 & 255, n >> 8 & 255, n & 255];
    }
    function unpackI32(bytes) {
      return as_signed(bytes[0] << 24 | bytes[1] << 16 | bytes[2] << 8 | bytes[3], 32);
    }
    function packU32(n) {
      return [n >> 24 & 255, n >> 16 & 255, n >> 8 & 255, n & 255];
    }
    function unpackU32(bytes) {
      return as_unsigned(bytes[0] << 24 | bytes[1] << 16 | bytes[2] << 8 | bytes[3], 32);
    }
    function packIEEE754(v, ebits, fbits) {
      var bias = (1 << ebits - 1) - 1, s, e, f, ln, i, bits, str, bytes;
      function roundToEven(n) {
        var w = floor(n), f2 = n - w;
        if (f2 < 0.5)
          return w;
        if (f2 > 0.5)
          return w + 1;
        return w % 2 ? w + 1 : w;
      }
      if (v !== v) {
        e = (1 << ebits) - 1;
        f = pow(2, fbits - 1);
        s = 0;
      } else if (v === Infinity || v === -Infinity) {
        e = (1 << ebits) - 1;
        f = 0;
        s = v < 0 ? 1 : 0;
      } else if (v === 0) {
        e = 0;
        f = 0;
        s = 1 / v === -Infinity ? 1 : 0;
      } else {
        s = v < 0;
        v = abs(v);
        if (v >= pow(2, 1 - bias)) {
          e = min(floor(log(v) / LN2), 1023);
          f = roundToEven(v / pow(2, e) * pow(2, fbits));
          if (f / pow(2, fbits) >= 2) {
            e = e + 1;
            f = 1;
          }
          if (e > bias) {
            e = (1 << ebits) - 1;
            f = 0;
          } else {
            e = e + bias;
            f = f - pow(2, fbits);
          }
        } else {
          e = 0;
          f = roundToEven(v / pow(2, 1 - bias - fbits));
        }
      }
      bits = [];
      for (i = fbits; i; i -= 1) {
        bits.push(f % 2 ? 1 : 0);
        f = floor(f / 2);
      }
      for (i = ebits; i; i -= 1) {
        bits.push(e % 2 ? 1 : 0);
        e = floor(e / 2);
      }
      bits.push(s ? 1 : 0);
      bits.reverse();
      str = bits.join("");
      bytes = [];
      while (str.length) {
        bytes.push(parseInt(str.substring(0, 8), 2));
        str = str.substring(8);
      }
      return bytes;
    }
    function unpackIEEE754(bytes, ebits, fbits) {
      var bits = [], i, j, b, str, bias, s, e, f;
      for (i = bytes.length; i; i -= 1) {
        b = bytes[i - 1];
        for (j = 8; j; j -= 1) {
          bits.push(b % 2 ? 1 : 0);
          b = b >> 1;
        }
      }
      bits.reverse();
      str = bits.join("");
      bias = (1 << ebits - 1) - 1;
      s = parseInt(str.substring(0, 1), 2) ? -1 : 1;
      e = parseInt(str.substring(1, 1 + ebits), 2);
      f = parseInt(str.substring(1 + ebits), 2);
      if (e === (1 << ebits) - 1) {
        return f !== 0 ? NaN : s * Infinity;
      } else if (e > 0) {
        return s * pow(2, e - bias) * (1 + f / pow(2, fbits));
      } else if (f !== 0) {
        return s * pow(2, -(bias - 1)) * (f / pow(2, fbits));
      } else {
        return s < 0 ? -0 : 0;
      }
    }
    function unpackF64(b) {
      return unpackIEEE754(b, 11, 52);
    }
    function packF64(v) {
      return packIEEE754(v, 11, 52);
    }
    function unpackF32(b) {
      return unpackIEEE754(b, 8, 23);
    }
    function packF32(v) {
      return packIEEE754(v, 8, 23);
    }
    (function() {
      var ArrayBuffer = function ArrayBuffer2(length) {
        length = ECMAScript.ToInt32(length);
        if (length < 0) throw new RangeError("ArrayBuffer size is not a small enough positive integer");
        this.byteLength = length;
        this._bytes = [];
        this._bytes.length = length;
        var i;
        for (i = 0; i < this.byteLength; i += 1) {
          this._bytes[i] = 0;
        }
        configureProperties(this);
      };
      exports2.ArrayBuffer = exports2.ArrayBuffer || ArrayBuffer;
      var ArrayBufferView = function ArrayBufferView2() {
      };
      function makeConstructor(bytesPerElement, pack, unpack) {
        var ctor;
        ctor = function(buffer, byteOffset, length) {
          var array, sequence, i, s;
          if (!arguments.length || typeof arguments[0] === "number") {
            this.length = ECMAScript.ToInt32(arguments[0]);
            if (length < 0) throw new RangeError("ArrayBufferView size is not a small enough positive integer");
            this.byteLength = this.length * this.BYTES_PER_ELEMENT;
            this.buffer = new ArrayBuffer(this.byteLength);
            this.byteOffset = 0;
          } else if (typeof arguments[0] === "object" && arguments[0].constructor === ctor) {
            array = arguments[0];
            this.length = array.length;
            this.byteLength = this.length * this.BYTES_PER_ELEMENT;
            this.buffer = new ArrayBuffer(this.byteLength);
            this.byteOffset = 0;
            for (i = 0; i < this.length; i += 1) {
              this._setter(i, array._getter(i));
            }
          } else if (typeof arguments[0] === "object" && !(arguments[0] instanceof ArrayBuffer || ECMAScript.Class(arguments[0]) === "ArrayBuffer")) {
            sequence = arguments[0];
            this.length = ECMAScript.ToUint32(sequence.length);
            this.byteLength = this.length * this.BYTES_PER_ELEMENT;
            this.buffer = new ArrayBuffer(this.byteLength);
            this.byteOffset = 0;
            for (i = 0; i < this.length; i += 1) {
              s = sequence[i];
              this._setter(i, Number(s));
            }
          } else if (typeof arguments[0] === "object" && (arguments[0] instanceof ArrayBuffer || ECMAScript.Class(arguments[0]) === "ArrayBuffer")) {
            this.buffer = buffer;
            this.byteOffset = ECMAScript.ToUint32(byteOffset);
            if (this.byteOffset > this.buffer.byteLength) {
              throw new RangeError("byteOffset out of range");
            }
            if (this.byteOffset % this.BYTES_PER_ELEMENT) {
              throw new RangeError("ArrayBuffer length minus the byteOffset is not a multiple of the element size.");
            }
            if (arguments.length < 3) {
              this.byteLength = this.buffer.byteLength - this.byteOffset;
              if (this.byteLength % this.BYTES_PER_ELEMENT) {
                throw new RangeError("length of buffer minus byteOffset not a multiple of the element size");
              }
              this.length = this.byteLength / this.BYTES_PER_ELEMENT;
            } else {
              this.length = ECMAScript.ToUint32(length);
              this.byteLength = this.length * this.BYTES_PER_ELEMENT;
            }
            if (this.byteOffset + this.byteLength > this.buffer.byteLength) {
              throw new RangeError("byteOffset and length reference an area beyond the end of the buffer");
            }
          } else {
            throw new TypeError("Unexpected argument type(s)");
          }
          this.constructor = ctor;
          configureProperties(this);
          makeArrayAccessors(this);
        };
        ctor.prototype = new ArrayBufferView();
        ctor.prototype.BYTES_PER_ELEMENT = bytesPerElement;
        ctor.prototype._pack = pack;
        ctor.prototype._unpack = unpack;
        ctor.BYTES_PER_ELEMENT = bytesPerElement;
        ctor.prototype._getter = function(index) {
          if (arguments.length < 1) throw new SyntaxError("Not enough arguments");
          index = ECMAScript.ToUint32(index);
          if (index >= this.length) {
            return undefined2;
          }
          var bytes = [], i, o;
          for (i = 0, o = this.byteOffset + index * this.BYTES_PER_ELEMENT; i < this.BYTES_PER_ELEMENT; i += 1, o += 1) {
            bytes.push(this.buffer._bytes[o]);
          }
          return this._unpack(bytes);
        };
        ctor.prototype.get = ctor.prototype._getter;
        ctor.prototype._setter = function(index, value) {
          if (arguments.length < 2) throw new SyntaxError("Not enough arguments");
          index = ECMAScript.ToUint32(index);
          if (index >= this.length) {
            return undefined2;
          }
          var bytes = this._pack(value), i, o;
          for (i = 0, o = this.byteOffset + index * this.BYTES_PER_ELEMENT; i < this.BYTES_PER_ELEMENT; i += 1, o += 1) {
            this.buffer._bytes[o] = bytes[i];
          }
        };
        ctor.prototype.set = function(index, value) {
          if (arguments.length < 1) throw new SyntaxError("Not enough arguments");
          var array, sequence, offset, len, i, s, d, byteOffset, byteLength, tmp;
          if (typeof arguments[0] === "object" && arguments[0].constructor === this.constructor) {
            array = arguments[0];
            offset = ECMAScript.ToUint32(arguments[1]);
            if (offset + array.length > this.length) {
              throw new RangeError("Offset plus length of array is out of range");
            }
            byteOffset = this.byteOffset + offset * this.BYTES_PER_ELEMENT;
            byteLength = array.length * this.BYTES_PER_ELEMENT;
            if (array.buffer === this.buffer) {
              tmp = [];
              for (i = 0, s = array.byteOffset; i < byteLength; i += 1, s += 1) {
                tmp[i] = array.buffer._bytes[s];
              }
              for (i = 0, d = byteOffset; i < byteLength; i += 1, d += 1) {
                this.buffer._bytes[d] = tmp[i];
              }
            } else {
              for (i = 0, s = array.byteOffset, d = byteOffset; i < byteLength; i += 1, s += 1, d += 1) {
                this.buffer._bytes[d] = array.buffer._bytes[s];
              }
            }
          } else if (typeof arguments[0] === "object" && typeof arguments[0].length !== "undefined") {
            sequence = arguments[0];
            len = ECMAScript.ToUint32(sequence.length);
            offset = ECMAScript.ToUint32(arguments[1]);
            if (offset + len > this.length) {
              throw new RangeError("Offset plus length of array is out of range");
            }
            for (i = 0; i < len; i += 1) {
              s = sequence[i];
              this._setter(offset + i, Number(s));
            }
          } else {
            throw new TypeError("Unexpected argument type(s)");
          }
        };
        ctor.prototype.subarray = function(start, end) {
          function clamp(v, min2, max) {
            return v < min2 ? min2 : v > max ? max : v;
          }
          start = ECMAScript.ToInt32(start);
          end = ECMAScript.ToInt32(end);
          if (arguments.length < 1) {
            start = 0;
          }
          if (arguments.length < 2) {
            end = this.length;
          }
          if (start < 0) {
            start = this.length + start;
          }
          if (end < 0) {
            end = this.length + end;
          }
          start = clamp(start, 0, this.length);
          end = clamp(end, 0, this.length);
          var len = end - start;
          if (len < 0) {
            len = 0;
          }
          return new this.constructor(
            this.buffer,
            this.byteOffset + start * this.BYTES_PER_ELEMENT,
            len
          );
        };
        return ctor;
      }
      var Int8Array = makeConstructor(1, packI8, unpackI8);
      var Uint8Array2 = makeConstructor(1, packU8, unpackU8);
      var Uint8ClampedArray = makeConstructor(1, packU8Clamped, unpackU8);
      var Int16Array = makeConstructor(2, packI16, unpackI16);
      var Uint16Array = makeConstructor(2, packU16, unpackU16);
      var Int32Array = makeConstructor(4, packI32, unpackI32);
      var Uint32Array = makeConstructor(4, packU32, unpackU32);
      var Float32Array = makeConstructor(4, packF32, unpackF32);
      var Float64Array = makeConstructor(8, packF64, unpackF64);
      exports2.Int8Array = exports2.Int8Array || Int8Array;
      exports2.Uint8Array = exports2.Uint8Array || Uint8Array2;
      exports2.Uint8ClampedArray = exports2.Uint8ClampedArray || Uint8ClampedArray;
      exports2.Int16Array = exports2.Int16Array || Int16Array;
      exports2.Uint16Array = exports2.Uint16Array || Uint16Array;
      exports2.Int32Array = exports2.Int32Array || Int32Array;
      exports2.Uint32Array = exports2.Uint32Array || Uint32Array;
      exports2.Float32Array = exports2.Float32Array || Float32Array;
      exports2.Float64Array = exports2.Float64Array || Float64Array;
    })();
    (function() {
      function r(array, index) {
        return ECMAScript.IsCallable(array.get) ? array.get(index) : array[index];
      }
      var IS_BIG_ENDIAN = function() {
        var u16array = new exports2.Uint16Array([4660]), u8array = new exports2.Uint8Array(u16array.buffer);
        return r(u8array, 0) === 18;
      }();
      var DataView = function DataView2(buffer, byteOffset, byteLength) {
        if (arguments.length === 0) {
          buffer = new exports2.ArrayBuffer(0);
        } else if (!(buffer instanceof exports2.ArrayBuffer || ECMAScript.Class(buffer) === "ArrayBuffer")) {
          throw new TypeError("TypeError");
        }
        this.buffer = buffer || new exports2.ArrayBuffer(0);
        this.byteOffset = ECMAScript.ToUint32(byteOffset);
        if (this.byteOffset > this.buffer.byteLength) {
          throw new RangeError("byteOffset out of range");
        }
        if (arguments.length < 3) {
          this.byteLength = this.buffer.byteLength - this.byteOffset;
        } else {
          this.byteLength = ECMAScript.ToUint32(byteLength);
        }
        if (this.byteOffset + this.byteLength > this.buffer.byteLength) {
          throw new RangeError("byteOffset and length reference an area beyond the end of the buffer");
        }
        configureProperties(this);
      };
      function makeGetter(arrayType) {
        return function(byteOffset, littleEndian) {
          byteOffset = ECMAScript.ToUint32(byteOffset);
          if (byteOffset + arrayType.BYTES_PER_ELEMENT > this.byteLength) {
            throw new RangeError("Array index out of range");
          }
          byteOffset += this.byteOffset;
          var uint8Array = new exports2.Uint8Array(this.buffer, byteOffset, arrayType.BYTES_PER_ELEMENT), bytes = [], i;
          for (i = 0; i < arrayType.BYTES_PER_ELEMENT; i += 1) {
            bytes.push(r(uint8Array, i));
          }
          if (Boolean(littleEndian) === Boolean(IS_BIG_ENDIAN)) {
            bytes.reverse();
          }
          return r(new arrayType(new exports2.Uint8Array(bytes).buffer), 0);
        };
      }
      DataView.prototype.getUint8 = makeGetter(exports2.Uint8Array);
      DataView.prototype.getInt8 = makeGetter(exports2.Int8Array);
      DataView.prototype.getUint16 = makeGetter(exports2.Uint16Array);
      DataView.prototype.getInt16 = makeGetter(exports2.Int16Array);
      DataView.prototype.getUint32 = makeGetter(exports2.Uint32Array);
      DataView.prototype.getInt32 = makeGetter(exports2.Int32Array);
      DataView.prototype.getFloat32 = makeGetter(exports2.Float32Array);
      DataView.prototype.getFloat64 = makeGetter(exports2.Float64Array);
      function makeSetter(arrayType) {
        return function(byteOffset, value, littleEndian) {
          byteOffset = ECMAScript.ToUint32(byteOffset);
          if (byteOffset + arrayType.BYTES_PER_ELEMENT > this.byteLength) {
            throw new RangeError("Array index out of range");
          }
          var typeArray = new arrayType([value]), byteArray = new exports2.Uint8Array(typeArray.buffer), bytes = [], i, byteView;
          for (i = 0; i < arrayType.BYTES_PER_ELEMENT; i += 1) {
            bytes.push(r(byteArray, i));
          }
          if (Boolean(littleEndian) === Boolean(IS_BIG_ENDIAN)) {
            bytes.reverse();
          }
          byteView = new exports2.Uint8Array(this.buffer, byteOffset, arrayType.BYTES_PER_ELEMENT);
          byteView.set(bytes);
        };
      }
      DataView.prototype.setUint8 = makeSetter(exports2.Uint8Array);
      DataView.prototype.setInt8 = makeSetter(exports2.Int8Array);
      DataView.prototype.setUint16 = makeSetter(exports2.Uint16Array);
      DataView.prototype.setInt16 = makeSetter(exports2.Int16Array);
      DataView.prototype.setUint32 = makeSetter(exports2.Uint32Array);
      DataView.prototype.setInt32 = makeSetter(exports2.Int32Array);
      DataView.prototype.setFloat32 = makeSetter(exports2.Float32Array);
      DataView.prototype.setFloat64 = makeSetter(exports2.Float64Array);
      exports2.DataView = exports2.DataView || DataView;
    })();
  }
});

// node_modules/concat-stream/index.js
var require_concat_stream = __commonJS({
  "node_modules/concat-stream/index.js"(exports2, module2) {
    var Writable = require_readable().Writable;
    var inherits = require_inherits();
    var bufferFrom = require_buffer_from();
    if (typeof Uint8Array === "undefined") {
      U8 = require_typedarray().Uint8Array;
    } else {
      U8 = Uint8Array;
    }
    var U8;
    function ConcatStream(opts, cb) {
      if (!(this instanceof ConcatStream)) return new ConcatStream(opts, cb);
      if (typeof opts === "function") {
        cb = opts;
        opts = {};
      }
      if (!opts) opts = {};
      var encoding = opts.encoding;
      var shouldInferEncoding = false;
      if (!encoding) {
        shouldInferEncoding = true;
      } else {
        encoding = String(encoding).toLowerCase();
        if (encoding === "u8" || encoding === "uint8") {
          encoding = "uint8array";
        }
      }
      Writable.call(this, { objectMode: true });
      this.encoding = encoding;
      this.shouldInferEncoding = shouldInferEncoding;
      if (cb) this.on("finish", function() {
        cb(this.getBody());
      });
      this.body = [];
    }
    module2.exports = ConcatStream;
    inherits(ConcatStream, Writable);
    ConcatStream.prototype._write = function(chunk, enc, next) {
      this.body.push(chunk);
      next();
    };
    ConcatStream.prototype.inferEncoding = function(buff) {
      var firstBuffer = buff === void 0 ? this.body[0] : buff;
      if (Buffer.isBuffer(firstBuffer)) return "buffer";
      if (typeof Uint8Array !== "undefined" && firstBuffer instanceof Uint8Array) return "uint8array";
      if (Array.isArray(firstBuffer)) return "array";
      if (typeof firstBuffer === "string") return "string";
      if (Object.prototype.toString.call(firstBuffer) === "[object Object]") return "object";
      return "buffer";
    };
    ConcatStream.prototype.getBody = function() {
      if (!this.encoding && this.body.length === 0) return [];
      if (this.shouldInferEncoding) this.encoding = this.inferEncoding();
      if (this.encoding === "array") return arrayConcat(this.body);
      if (this.encoding === "string") return stringConcat(this.body);
      if (this.encoding === "buffer") return bufferConcat(this.body);
      if (this.encoding === "uint8array") return u8Concat(this.body);
      return this.body;
    };
    var isArray = Array.isArray || function(arr) {
      return Object.prototype.toString.call(arr) == "[object Array]";
    };
    function isArrayish(arr) {
      return /Array\]$/.test(Object.prototype.toString.call(arr));
    }
    function isBufferish(p) {
      return typeof p === "string" || isArrayish(p) || p && typeof p.subarray === "function";
    }
    function stringConcat(parts) {
      var strings = [];
      var needsToString = false;
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        if (typeof p === "string") {
          strings.push(p);
        } else if (Buffer.isBuffer(p)) {
          strings.push(p);
        } else if (isBufferish(p)) {
          strings.push(bufferFrom(p));
        } else {
          strings.push(bufferFrom(String(p)));
        }
      }
      if (Buffer.isBuffer(parts[0])) {
        strings = Buffer.concat(strings);
        strings = strings.toString("utf8");
      } else {
        strings = strings.join("");
      }
      return strings;
    }
    function bufferConcat(parts) {
      var bufs = [];
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        if (Buffer.isBuffer(p)) {
          bufs.push(p);
        } else if (isBufferish(p)) {
          bufs.push(bufferFrom(p));
        } else {
          bufs.push(bufferFrom(String(p)));
        }
      }
      return Buffer.concat(bufs);
    }
    function arrayConcat(parts) {
      var res = [];
      for (var i = 0; i < parts.length; i++) {
        res.push.apply(res, parts[i]);
      }
      return res;
    }
    function u8Concat(parts) {
      var len = 0;
      for (var i = 0; i < parts.length; i++) {
        if (typeof parts[i] === "string") {
          parts[i] = bufferFrom(parts[i]);
        }
        len += parts[i].length;
      }
      var u8 = new U8(len);
      for (var i = 0, offset = 0; i < parts.length; i++) {
        var part = parts[i];
        for (var j = 0; j < part.length; j++) {
          u8[offset++] = part[j];
        }
      }
      return u8;
    }
  }
});

// node_modules/multer/storage/memory.js
var require_memory = __commonJS({
  "node_modules/multer/storage/memory.js"(exports2, module2) {
    var concat = require_concat_stream();
    function MemoryStorage(opts) {
    }
    MemoryStorage.prototype._handleFile = function _handleFile(req, file, cb) {
      file.stream.pipe(concat({ encoding: "buffer" }, function(data) {
        cb(null, {
          buffer: data,
          size: data.length
        });
      }));
    };
    MemoryStorage.prototype._removeFile = function _removeFile(req, file, cb) {
      delete file.buffer;
      cb(null);
    };
    module2.exports = function(opts) {
      return new MemoryStorage(opts);
    };
  }
});

// node_modules/multer/index.js
var require_multer = __commonJS({
  "node_modules/multer/index.js"(exports2, module2) {
    var makeMiddleware = require_make_middleware();
    var diskStorage = require_disk();
    var memoryStorage = require_memory();
    var MulterError = require_multer_error();
    function allowAll(req, file, cb) {
      cb(null, true);
    }
    function Multer(options) {
      if (options.storage) {
        this.storage = options.storage;
      } else if (options.dest) {
        this.storage = diskStorage({ destination: options.dest });
      } else {
        this.storage = memoryStorage();
      }
      this.limits = options.limits;
      this.preservePath = options.preservePath;
      this.defParamCharset = options.defParamCharset || "latin1";
      this.fileFilter = options.fileFilter || allowAll;
    }
    Multer.prototype._makeMiddleware = function(fields, fileStrategy) {
      function setup() {
        var fileFilter = this.fileFilter;
        var filesLeft = /* @__PURE__ */ Object.create(null);
        fields.forEach(function(field) {
          if (typeof field.maxCount === "number") {
            filesLeft[field.name] = field.maxCount;
          } else {
            filesLeft[field.name] = Infinity;
          }
        });
        function wrappedFileFilter(req, file, cb) {
          if ((filesLeft[file.fieldname] || 0) <= 0) {
            return cb(new MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname));
          }
          filesLeft[file.fieldname] -= 1;
          fileFilter(req, file, cb);
        }
        return {
          limits: this.limits,
          preservePath: this.preservePath,
          defParamCharset: this.defParamCharset,
          storage: this.storage,
          fileFilter: wrappedFileFilter,
          fileStrategy
        };
      }
      return makeMiddleware(setup.bind(this));
    };
    Multer.prototype.single = function(name) {
      return this._makeMiddleware([{ name, maxCount: 1 }], "VALUE");
    };
    Multer.prototype.array = function(name, maxCount) {
      return this._makeMiddleware([{ name, maxCount }], "ARRAY");
    };
    Multer.prototype.fields = function(fields) {
      return this._makeMiddleware(fields, "OBJECT");
    };
    Multer.prototype.none = function() {
      return this._makeMiddleware([], "NONE");
    };
    Multer.prototype.any = function() {
      function setup() {
        return {
          limits: this.limits,
          preservePath: this.preservePath,
          defParamCharset: this.defParamCharset,
          storage: this.storage,
          fileFilter: this.fileFilter,
          fileStrategy: "ARRAY"
        };
      }
      return makeMiddleware(setup.bind(this));
    };
    function multer2(options) {
      if (options === void 0) {
        return new Multer({});
      }
      if (typeof options === "object" && options !== null) {
        return new Multer(options);
      }
      throw new TypeError("Expected object for argument options");
    }
    module2.exports = multer2;
    module2.exports.diskStorage = diskStorage;
    module2.exports.memoryStorage = memoryStorage;
    module2.exports.MulterError = MulterError;
  }
});

// src/index.ts
var import_express = __toESM(require("express"));
var import_cors = __toESM(require("cors"));
var import_path6 = __toESM(require("path"));
var import_dotenv2 = __toESM(require("dotenv"));

// src/middleware/auth.ts
var import_jsonwebtoken = __toESM(require("jsonwebtoken"));
var authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Akses ditolak. Token tidak disediakan." });
  }
  const secret = process.env.JWT_SECRET || "promptstudio_access_secret_key_change_this_in_production_2024";
  import_jsonwebtoken.default.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Sesi telah berakhir, silakan login kembali (Token expired)." });
    }
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };
    next();
  });
};

// src/db.ts
var import_promise = __toESM(require("mysql2/promise"));
var import_path = __toESM(require("path"));
var import_dotenv = __toESM(require("dotenv"));
import_dotenv.default.config({ path: import_path.default.join(__dirname, ".env") });
import_dotenv.default.config({ path: import_path.default.join(__dirname, "../.env") });
var pool = import_promise.default.createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "3306", 10),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
var query = async (text, params) => {
  let mysqlSql = text.replace(/\$\d+/g, "?");
  mysqlSql = mysqlSql.replace(/::text/g, "");
  mysqlSql = mysqlSql.replace(/::jsonb/g, "");
  const [rows] = await pool.execute(mysqlSql, params);
  return { rows };
};

// src/controllers/authController.ts
var import_bcrypt = __toESM(require("bcrypt"));
var import_jsonwebtoken2 = __toESM(require("jsonwebtoken"));
var import_uuid = require("uuid");
var JWT_SECRET = process.env.JWT_SECRET || "promptstudio_access_secret_key_change_this_in_production_2024";
var JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "promptstudio_refresh_secret_key_change_this_in_production_2024";
var signAccessToken = (userId, email, role) => {
  return import_jsonwebtoken2.default.sign(
    { userId, email, role, type: "access" },
    JWT_SECRET,
    { expiresIn: "24h" }
  );
};
var signRefreshToken = (userId, tokenId) => {
  return import_jsonwebtoken2.default.sign(
    { userId, tokenId, type: "refresh" },
    JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
};
var register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required." });
  }
  try {
    const existing = await query("SELECT id FROM users WHERE email = ?", [email.trim()]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: "Email sudah terdaftar." });
    }
    const hashedPassword = await import_bcrypt.default.hash(password, 10);
    const userId = (0, import_uuid.v4)();
    await query(
      `INSERT INTO users (id, name, email, password, role, isDemo, isActive, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, 'USER', false, true, NOW(), NOW())`,
      [userId, name.trim(), email.trim(), hashedPassword]
    );
    await query(
      `INSERT INTO settings (id, userId, language, theme, notifications, createdAt, updatedAt)
       VALUES (?, ?, 'ID', 'SYSTEM', true, NOW(), NOW())
       ON DUPLICATE KEY UPDATE id=id`,
      [(0, import_uuid.v4)(), userId]
    );
    await query(
      "INSERT INTO activity_logs (id, userId, action, createdAt) VALUES (?, ?, ?, NOW())",
      [(0, import_uuid.v4)(), userId, "USER_REGISTERED"]
    );
    const accessToken = signAccessToken(userId, email.trim(), "USER");
    const refreshTokenId = (0, import_uuid.v4)();
    const refreshToken = signRefreshToken(userId, refreshTokenId);
    await query(
      `INSERT INTO refresh_tokens (id, token, userId, expiresAt, isRevoked, createdAt)
       VALUES (?, ?, ?, NOW() + INTERVAL 7 DAY, false, NOW())`,
      [refreshTokenId, refreshToken, userId]
    );
    return res.status(201).json({
      user: {
        id: userId,
        name,
        email: email.trim(),
        avatarUrl: null,
        role: "USER",
        isDemo: false,
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "Server error: " + (error.message || error.toString()) });
  }
};
var login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }
  try {
    const result = await query(
      `SELECT id, name, email, password, avatarUrl, role, isDemo, isActive, createdAt
       FROM users WHERE email = ?`,
      [email.trim()]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Email atau password salah." });
    }
    const userRow = result.rows[0];
    const isActive = userRow.isActive === 1 || userRow.isActive === true || userRow.isActive === "true";
    if (!isActive) {
      return res.status(401).json({ message: "Akun tidak aktif." });
    }
    const isMatch = await import_bcrypt.default.compare(password, userRow.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Email atau password salah." });
    }
    const userId = userRow.id;
    const role = userRow.role || "USER";
    const accessToken = signAccessToken(userId, email.trim(), role);
    const refreshTokenId = (0, import_uuid.v4)();
    const refreshToken = signRefreshToken(userId, refreshTokenId);
    await query(
      `INSERT INTO refresh_tokens (id, token, userId, expiresAt, isRevoked, createdAt)
       VALUES (?, ?, ?, NOW() + INTERVAL 7 DAY, false, NOW())`,
      [refreshTokenId, refreshToken, userId]
    );
    await query(
      "INSERT INTO activity_logs (id, userId, action, createdAt) VALUES (?, ?, ?, NOW())",
      [(0, import_uuid.v4)(), userId, "USER_LOGGED_IN"]
    );
    return res.json({
      user: {
        id: userId,
        name: userRow.name,
        email: userRow.email,
        avatarUrl: userRow.avatarUrl,
        role,
        isDemo: userRow.isDemo === 1 || userRow.isDemo === true,
        createdAt: userRow.createdAt
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error: " + (error.message || error.toString()) });
  }
};
var refresh = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token is required." });
  }
  try {
    let payload;
    try {
      payload = import_jsonwebtoken2.default.verify(refreshToken, JWT_REFRESH_SECRET);
    } catch (_) {
      return res.status(401).json({ message: "Refresh token tidak valid atau sudah kadaluarsa." });
    }
    const result = await query(
      `SELECT rt.id, rt.isRevoked, rt.expiresAt, u.id AS userId, u.email, u.role, u.isActive
       FROM refresh_tokens rt
       JOIN users u ON rt.userId = u.id
       WHERE rt.token = ?`,
      [refreshToken]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Refresh token tidak ditemukan." });
    }
    const row = result.rows[0];
    const isRevoked = row.isRevoked === 1 || row.isRevoked === true || row.isRevoked === "true";
    const expiresAt = new Date(row.expiresAt);
    const isActive = row.isActive === 1 || row.isActive === true || row.isActive === "true";
    if (isRevoked || expiresAt.getTime() < Date.now() || !isActive) {
      return res.status(401).json({ message: "Refresh token tidak valid." });
    }
    const userId = row.userId;
    if (payload.userId !== userId) {
      return res.status(401).json({ message: "Token mismatch." });
    }
    const newAccessToken = signAccessToken(userId, row.email, row.role || "USER");
    return res.json({
      accessToken: newAccessToken
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    return res.status(500).json({ message: "Server error: " + (error.message || error.toString()) });
  }
};
var logout = async (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken) {
    try {
      await query(
        "UPDATE refresh_tokens SET isRevoked = true WHERE token = ?",
        [refreshToken]
      );
    } catch (_) {
    }
  }
  return res.json({ message: "Logged out successfully." });
};

// src/controllers/userController.ts
var import_bcrypt2 = __toESM(require("bcrypt"));
var import_uuid2 = require("uuid");
var getProfile = async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  try {
    const result = await query(
      `SELECT u.id, u.name, u.email, u.avatarUrl, u.role, u.isDemo, u.isActive,
              u.createdAt, u.updatedAt,
              s.theme,
              COUNT(DISTINCT ph.id) AS prompt_count,
              COUNT(DISTINCT fp.id) AS favorite_count
       FROM users u
       LEFT JOIN settings s ON s.userId = u.id
       LEFT JOIN prompt_histories ph ON ph.userId = u.id
       LEFT JOIN favorite_prompts fp ON fp.userId = u.id
       WHERE u.id = ?
       GROUP BY u.id, u.name, u.email, u.avatarUrl, u.role, u.isDemo, u.isActive, u.createdAt, u.updatedAt, s.theme`,
      [userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User tidak ditemukan." });
    }
    const row = result.rows[0];
    return res.json({
      id: row.id,
      name: row.name,
      email: row.email,
      avatarUrl: row.avatarUrl,
      role: row.role || "USER",
      isDemo: row.isDemo === 1 || row.isDemo === true,
      isActive: row.isActive === 1 || row.isActive === true,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      settings: row.theme ? { theme: row.theme } : null,
      _count: {
        promptHistories: parseInt(row.prompt_count, 10) || 0,
        favoritePrompts: parseInt(row.favorite_count, 10) || 0
      }
    });
  } catch (error) {
    console.error("getProfile error:", error);
    return res.status(500).json({ message: "Server error: " + (error.message || error.toString()) });
  }
};
var updateProfile = async (req, res) => {
  const userId = req.user?.userId;
  const { name, avatarUrl } = req.body;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  try {
    await query(
      `UPDATE users SET name = ?, avatarUrl = COALESCE(?, avatarUrl), updatedAt = NOW()
       WHERE id = ?`,
      [name, avatarUrl || null, userId]
    );
    await query(
      "INSERT INTO activity_logs (id, userId, action, createdAt) VALUES (?, ?, ?, NOW())",
      [(0, import_uuid2.v4)(), userId, "PROFILE_UPDATED"]
    );
    return getProfile(req, res);
  } catch (error) {
    console.error("updateProfile error:", error);
    return res.status(500).json({ message: "Server error: " + (error.message || error.toString()) });
  }
};
var changePassword = async (req, res) => {
  const userId = req.user?.userId;
  const { currentPassword, newPassword } = req.body;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Current password and new password are required." });
  }
  try {
    const result = await query("SELECT password FROM users WHERE id = ?", [userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User tidak ditemukan." });
    }
    const storedHash = result.rows[0].password;
    const isMatch = await import_bcrypt2.default.compare(currentPassword, storedHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Password saat ini tidak benar." });
    }
    const newHash = await import_bcrypt2.default.hash(newPassword, 10);
    await query(
      "UPDATE users SET password = ?, updatedAt = NOW() WHERE id = ?",
      [newHash, userId]
    );
    await query(
      "INSERT INTO activity_logs (id, userId, action, createdAt) VALUES (?, ?, ?, NOW())",
      [(0, import_uuid2.v4)(), userId, "PASSWORD_CHANGED"]
    );
    return res.json({ message: "Kata sandi berhasil diubah." });
  } catch (error) {
    console.error("changePassword error:", error);
    return res.status(500).json({ message: "Server error: " + (error.message || error.toString()) });
  }
};

// src/controllers/prompt/groqService.ts
var import_https = __toESM(require("https"));
var getGroqApiKey = async () => {
  try {
    const result = await query(`
      SELECT api_key FROM groq_api_keys
      WHERE is_active = 1 OR is_active = true
      ORDER BY error_count ASC, last_used_at ASC
      LIMIT 1
    `);
    if (result.rows.length > 0) {
      const bestKey = result.rows[0].api_key;
      await query(
        "UPDATE groq_api_keys SET last_used_at = NOW() WHERE api_key = ?",
        [bestKey]
      );
      return bestKey;
    }
  } catch (e) {
    console.error("Gagal mengambil groq_api_keys:", e);
  }
  try {
    const fallback = await query("SELECT value FROM app_config WHERE `key` = 'groq_api_key'");
    if (fallback.rows.length > 0) {
      return fallback.rows[0].value;
    }
  } catch (_) {
  }
  return "";
};
var markGroqApiKeyFailed = async (apiKey) => {
  try {
    await query(
      "UPDATE groq_api_keys SET error_count = error_count + 1 WHERE api_key = ?",
      [apiKey]
    );
  } catch (e) {
    console.error("Gagal update error_count:", e);
  }
};
var callGroqApiWithRotation = (promptInstruction) => {
  return new Promise(async (resolve, reject) => {
    let result = null;
    let retryCount = 0;
    while (retryCount < 3 && result === null) {
      const apiKey = await getGroqApiKey();
      if (!apiKey || apiKey.startsWith("gsk_YOUR_GROQ_API_KEY")) {
        return reject(new Error("Groq API Key belum dikonfigurasi di database."));
      }
      try {
        const payload = JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: promptInstruction }],
          temperature: 0.72
        });
        const options = {
          hostname: "api.groq.com",
          port: 443,
          path: "/openai/v1/chat/completions",
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(payload)
          },
          timeout: 18e3
        };
        const resPromise = new Promise((resResolve, resReject) => {
          const req = import_https.default.request(options, (res) => {
            let body = "";
            res.on("data", (chunk) => body += chunk);
            res.on("end", () => resResolve({ statusCode: res.statusCode, body }));
          });
          req.on("timeout", () => {
            req.destroy();
            resReject(new Error("Request Timeout"));
          });
          req.on("error", (err) => resReject(err));
          req.write(payload);
          req.end();
        });
        const response = await resPromise;
        if (response.statusCode === 200) {
          const data = JSON.parse(response.body);
          result = data.choices[0].message.content;
        } else {
          await markGroqApiKeyFailed(apiKey);
          retryCount++;
          await new Promise((r) => setTimeout(r, 1e3));
        }
      } catch (e) {
        await markGroqApiKeyFailed(apiKey);
        retryCount++;
        await new Promise((r) => setTimeout(r, 1e3));
      }
    }
    if (result) {
      resolve(result);
    } else {
      reject(new Error("Gagal memanggil Groq API setelah rotasi key."));
    }
  });
};
var callGroqVisionApiWithRotation = (messages, customModel) => {
  return new Promise(async (resolve, reject) => {
    let result = null;
    let retryCount = 0;
    let modelToUse = customModel || "llama-3.2-11b-vision-preview";
    if (modelToUse === "llama-4-scout-17b-16e-instruct") {
      modelToUse = "llama-3.2-11b-vision-preview";
    }
    while (retryCount < 3 && result === null) {
      const apiKey = await getGroqApiKey();
      if (!apiKey || apiKey.startsWith("gsk_YOUR_GROQ_API_KEY")) {
        return reject(new Error("Groq API Key belum dikonfigurasi di database."));
      }
      try {
        const payload = JSON.stringify({
          model: modelToUse,
          messages,
          temperature: 0.72
        });
        const options = {
          hostname: "api.groq.com",
          port: 443,
          path: "/openai/v1/chat/completions",
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(payload)
          },
          timeout: 25e3
        };
        const resPromise = new Promise((resResolve, resReject) => {
          const req = import_https.default.request(options, (res) => {
            let body = "";
            res.on("data", (chunk) => body += chunk);
            res.on("end", () => resResolve({ statusCode: res.statusCode, body }));
          });
          req.on("timeout", () => {
            req.destroy();
            resReject(new Error("Request Timeout"));
          });
          req.on("error", (err) => resReject(err));
          req.write(payload);
          req.end();
        });
        const response = await resPromise;
        if (response.statusCode === 200) {
          const data = JSON.parse(response.body);
          result = data.choices[0].message.content;
        } else {
          const parsedBody = JSON.parse(response.body || "{}");
          const errorMsg = parsedBody.error?.message || "";
          if (modelToUse === customModel && (response.statusCode === 400 || response.statusCode === 404 || errorMsg.includes("model") || errorMsg.includes("not found"))) {
            console.warn(`Model ${customModel} tidak tersedia di Groq, beralih ke llama-3.2-11b-vision-preview...`);
            modelToUse = "llama-3.2-11b-vision-preview";
          } else {
            await markGroqApiKeyFailed(apiKey);
          }
          retryCount++;
          await new Promise((r) => setTimeout(r, 1e3));
        }
      } catch (e) {
        await markGroqApiKeyFailed(apiKey);
        retryCount++;
        await new Promise((r) => setTimeout(r, 1e3));
      }
    }
    if (result) {
      resolve(result);
    } else {
      reject(new Error("Gagal memanggil Groq Vision API setelah rotasi key."));
    }
  });
};

// src/controllers/prompt/promptHelpers.ts
var getOrientationSpec = (orientation) => {
  const lower = orientation.toLowerCase();
  if (lower.includes("3:4") || lower.includes("1440") || lower.includes("tiktok") || lower.includes("instagram potret")) {
    return {
      ratio: "3:4",
      widthHint: "1080x1440",
      spec: "Potret TikTok/Instagram (3:4) vertikal \u2014 Canvas: 1080x1440px. Character at bottom corner. Text area: upper 40% of canvas. Safe Area: 80px from all edges."
    };
  } else if (lower.includes("4:5") || lower.includes("1350")) {
    return {
      ratio: "4:5",
      widthHint: "1080x1350",
      spec: "Potret Instagram (4:5) vertikal \u2014 Canvas: 1080x1350px. Character at bottom corner. Text area: upper 35% of canvas."
    };
  } else if (lower.includes("landscape") || lower.includes("16:9") || lower.includes("1920") || lower.includes("persegi panjang")) {
    return {
      ratio: "16:9",
      widthHint: "1920x1080",
      spec: "Landscape/Persegi Panjang (16:9) horizontal \u2014 Canvas: 1920x1080px. Character at bottom-right corner. Text area: left 50% of canvas."
    };
  } else if (lower.includes("square") || lower.includes("persegi") || lower.includes("1:1") || lower.includes("1080x1080")) {
    return {
      ratio: "1:1",
      widthHint: "1080x1080",
      spec: "Persegi (1:1) \u2014 Canvas: 1080x1080px. Character at bottom corner. Text area: upper-center of canvas. Safe Area: 80px from all edges."
    };
  } else if (lower.includes("portrait") || lower.includes("potret")) {
    return {
      ratio: "4:5",
      widthHint: "1080x1350",
      spec: "Potret (4:5) vertikal \u2014 Canvas: 1080x1350px. Character at bottom corner. Text area: upper 35% of canvas."
    };
  } else {
    return {
      ratio: "3:4",
      widthHint: "1080x1440",
      spec: "Potret TikTok/Instagram (3:4) vertikal \u2014 Canvas: 1080x1440px. Character at bottom corner. Text area: upper 40% of canvas. Safe Area: 80px from all edges."
    };
  }
};
var getMandatoryRules = (isPromotional, orientationSpec) => {
  if (isPromotional) {
    return `
=== ATURAN WAJIB AI \u2014 KONTEN IKLAN/PROMO (HARUS DIPATUHI 100%) ===
1. BAHASA: Gunakan bahasa non-formal, semangat, dan persuasif. Bicara langsung ke audiens seperti teman yang meyakinkan, BUKAN seperti brosur formal atau iklan koran.
2. TEKS KONTEN SANGAT RINGKAS: Buat teks overlay (headline, subtext, detail, microTip) sesingkat dan sepadat mungkin. Maksimal 10 kata per elemen. Jangan sampai teks menumpuk atau terlalu panjang di gambar.
3. KAYA VISUAL & ILUSTRASI: Berikan penjelasan objek visual latar, karakter, atau vektor secara mendetail, kaya, dan profesional. Fokuslah mendeskripsikan elemen grafis pendukung yang menarik mata.
4. SATU POIN PER SLIDE: Satu slide = satu pesan utama yang disampaikan dengan BOLD dan percaya diri.
5. TERMINOLOGI IKLAN yang WAJIB diselipkan: promo terbatas, stok mepet, harga spesial hari ini, daftar sekarang jangan tunda, garansi kepuasan, testimoni nyata, bonus eksklusif, harga coret, limited edition, early bird.
6. CTA TEGAS: Slide terakhir wajib ada Call to Action yang spesifik (DM sekarang / klik link / hubungi WA / beli sebelum kehabisan).
7. DIMENSI CANVAS & ASPECT RATIO (MUTLAK): Gunakan Canvas ${orientationSpec.widthHint}px (Aspect Ratio ${orientationSpec.ratio}). Posisikan semua teks dan ikon di area tengah, beri Safe Area minimal 80-120 px dari seluruh sisi tepi luar canvas agar tidak terpotong di berbagai resolusi layar.
=== END ATURAN WAJIB ===`;
  } else {
    return `
=== ATURAN WAJIB AI \u2014 KONTEN EDUKASI/INFORMASI (HARUS DIPATUHI 100%) ===
1. BAHASA: Gunakan bahasa non-formal, santai, dan asik. Bicara seperti kakak/teman yang berbagi ilmu, BUKAN seperti buku pelajaran atau artikel jurnal.
2. TEKS KONTEN SANGAT RINGKAS: Buat teks overlay (headline, subtext, detail, microTip) sesingkat dan sepadat mungkin. Maksimal 10 kata per elemen. Teks di media sosial harus cepat dibaca dan tidak membosankan.
3. KAYA VISUAL & ILUSTRASI: Berikan penjelasan objek visual latar, karakter, atau vektor secara mendetail, kaya, dan profesional. Fokuslah mendeskripsikan elemen grafis pendukung yang edukatif dan menarik mata.
4. SATU POIN PER SLIDE: Satu slide = satu insight/tips/fakta yang disampaikan dengan jelas dan mudah dicerna.
5. TERMINOLOGI EDUKASI yang WAJIB diselipkan: fakta menarik, tahukah kamu, tips praktis, jangan sampai salah, insight penting, studi menunjukkan, cara mudah, langkah simpel, bukti nyata, ternyata begini, coba deh, bisa langsung dipraktekin.
6. PENUTUP AJAK INTERAKSI: Slide terakhir ajak audiens save, share ke teman, follow untuk konten serupa, atau tanya pendapat mereka di kolom komentar.
7. BEBAS PROMOSI: DILARANG KERAS menyebut harga, diskon, promo produk, atau jualan apapun dalam konten edukasi ini.
8. DIMENSI CANVAS & ASPECT RATIO (MUTLAK): Gunakan Canvas ${orientationSpec.widthHint}px (Aspect Ratio ${orientationSpec.ratio}). Posisikan semua teks dan ikon di area tengah, beri Safe Area minimal 80-120 px dari seluruh sisi tepi luar canvas agar tidak terpotong di berbagai resolusi layar.
=== END ATURAN WAJIB ===`;
  }
};
var getTerminologyGlossary = (isPromotional) => {
  if (isPromotional) {
    return `
--- Daftar Istilah Iklan yang Bisa Dipakai ---
\u2022 "Penawaran terbatas" / "Stok terbatas" \u2192 ciptakan urgency
\u2022 "Harga spesial hari ini" / "Diskon X%" \u2192 angka konkret lebih meyakinkan
\u2022 "Garansi uang kembali" / "Garansi kepuasan" \u2192 hilangkan rasa takut
\u2022 "Sudah dipercaya X ribu pelanggan" \u2192 social proof
\u2022 "Eksklusif hanya untuk kamu" / "Member only" \u2192 rasa spesial
\u2022 "Langsung bisa dipakai / langsung kerasa manfaatnya" \u2192 bukti cepat
\u2022 "DM sekarang" / "Klik link di bio" / "Hubungi WA kami" \u2192 CTA spesifik
\u2022 "Jangan tunda lagi" / "Ini saat yang tepat" \u2192 overcome procrastination
\u2022 "Tanpa ribet" / "Mudah banget caranya" \u2192 hilangkan hambatan
\u2022 "Coba gratis dulu" / "Tidak ada syarat tersembunyi" \u2192 mengurangi risiko`;
  } else {
    return `
--- Daftar Istilah Edukasi yang Bisa Dipakai ---
\u2022 "Tahukah kamu?" / "Fakta mengejutkan:" \u2192 memancing rasa ingin tahu
\u2022 "Ternyata begini cara kerjanya..." \u2192 mengungkap sesuatu yang belum diketahui
\u2022 "Tips praktis #X:" / "Cara mudah #X:" \u2192 format listicle yang mudah dicerna
\u2022 "Studi menunjukkan bahwa..." / "Riset terbaru membuktikan..." \u2192 kredibilitas
\u2022 "Kebanyakan orang salah paham soal ini..." \u2192 koreksi mitos
\u2022 "Langsung bisa dipraktekin!" / "Coba sekarang:" \u2192 actionable
\u2022 "Ini yang bikin kamu stuck:" / "Root cause-nya adalah..." \u2192 problem framing
\u2022 "Intinya:" / "Singkatnya begini:" / "Kesimpulannya:" \u2192 simplifikasi
\u2022 "Simpan dulu, nanti butuh!" \u2192 dorong save
\u2022 "Share ke teman yang perlu tahu ini!" \u2192 dorong share`;
  }
};
var getAudienceInstruction = (targetAudience) => {
  const aud = targetAudience.toLowerCase();
  let instructions = `Sesuaikan gaya bahasa (copywriting) berdasarkan Target Audiens: "${targetAudience}".
Aturan penyesuaian khusus:
`;
  if (aud.includes("mahasiswa") || aud.includes("pelajar") || aud.includes("muda")) {
    instructions += `- Bahasa: Kasual, kekinian, trendi, bersemangat, pakai istilah populer anak muda (tetap sopan). Boleh pakai kata "kamu", "gue", "guys", "bro/sis" sesekali.
- Visual: Modern, trendi, dinamis, minimalis kekinian.
`;
  } else if (aud.includes("orang tua") || aud.includes("lansia") || aud.includes("dewasa akhir")) {
    instructions += `- Bahasa: Sederhana, mudah dipahami, hangat, hormat. Hindari singkatan atau istilah asing.
- Visual: Kontras tinggi, font jelas dan besar, elemen visual yang familiar.
`;
  } else if (aud.includes("pebisnis") || aud.includes("umkm") || aud.includes("usaha")) {
    instructions += `- Bahasa: Benefit-oriented, solutif, memotivasi, profesional tapi praktis (straight to the point).
- Visual: Bersih, terpercaya, profesional, penekanan pada poin utama.
`;
  } else if (aud.includes("karyawan") || aud.includes("profesional")) {
    instructions += `- Bahasa: Sopan, formal-kasual (smart casual), berbobot, berbasis data/fakta.
- Visual: Elegan korporat, rapi, terstruktur, minimalis modern.
`;
  } else if (aud.includes("ibu") || aud.includes("keluarga")) {
    instructions += `- Bahasa: Ramah, hangat, empati tinggi, praktis, fokus pada kehidupan sehari-hari.
- Visual: Warna hangat (soft pastel), tata letak bersih.
`;
  } else {
    instructions += `- Bahasa: Indonesia yang baik, umum, komunikatif, bersahabat, mudah dicerna.
- Visual: Seimbang, bersih, kontras tinggi untuk keterbacaan baik.
`;
  }
  instructions += `PENTING: Jangan tulis frasa mentah "untuk ${targetAudience}" di slide. Biarkan pemahaman audiens tercermin secara alami dari diksi dan nuansa penyampaian.`;
  return instructions;
};
var buildPromptFallback = (title, contentType, slideCount, designStyle, targetAudience, imageOrientation) => {
  const contentTypeLower = contentType.toLowerCase();
  const isPromotional = (contentTypeLower.includes("iklan") || contentTypeLower.includes("promo") || contentTypeLower.includes("showcase") || contentTypeLower.includes("ads")) && !contentTypeLower.includes("edukasi");
  let orientation = imageOrientation || "potret";
  if (!imageOrientation && designStyle.includes("|")) {
    const parts = designStyle.split("|");
    for (const part of parts) {
      if (part.includes("Orientasi:")) {
        orientation = part.replace("Orientasi:", "").trim();
      }
    }
  }
  const orientationSpec = getOrientationSpec(orientation);
  const styleName = designStyle.split("|")[0].trim();
  const mandatoryRules = getMandatoryRules(isPromotional, orientationSpec);
  const slides = Array.from({ length: slideCount }, (_, idx) => {
    const n = idx + 1;
    let role = "";
    let headline = "";
    let subtext = "";
    let detail = "";
    let microTip = "";
    let visualContent = "";
    let mediaSosialAturan = "";
    if (n === 1) {
      role = isPromotional ? "HOOK & PENAWARAN UTAMA (Banner Pertama)" : "HOOK & COVER EDUKASI (Slide Pembuka)";
      headline = isPromotional ? `Penawaran Spesial ${title}` : title;
      subtext = isPromotional ? "Jangan sampai kelewatan!" : "Kamu udah tahu fakta penting ini belum?";
      detail = isPromotional ? "Stok terbatas, ambil sekarang sebelum kehabisan." : "Banyak orang masih salah kaprah soal topik ini.";
      visualContent = isPromotional ? `Latar belakang produk premium mewah dengan ${title} di tengah.` : `Latar belakang bersih minimalis dengan tipografi besar membahas ${title}.`;
    } else if (n === slideCount) {
      role = isPromotional ? "CALL TO ACTION & URGENCY (Slide Penutup)" : "PENUTUP & AJAK INTERAKSI (Slide Terakhir)";
      headline = isPromotional ? "Jangan Tunda Lagi!" : "Simpan & Share!";
      subtext = isPromotional ? "DM sekarang atau klik link di bio." : "Kalau info ini berguna buat kamu, share ke teman yang perlu tahu!";
      detail = isPromotional ? "Garansi kepuasan, harga spesial hari ini saja." : `Follow untuk tips ${title} lainnya setiap hari.`;
      visualContent = isPromotional ? "Latar belakang dengan tombol call to action yang kontras dan mencolok." : "Latar belakang minimalis dengan ikon interaksi sosial media.";
    } else {
      role = isPromotional ? `FITUR/MANFAAT PRODUK #${n - 1}` : `POIN EDUKASI #${n - 1}`;
      headline = isPromotional ? `Keunggulan ${title} #${n - 1}` : `Tips Praktis #${n - 1}`;
      subtext = isPromotional ? "Ini yang bikin beda dari yang lain." : `Poin penting yang perlu kamu tahu tentang ${title}.`;
      detail = isPromotional ? "Sudah dipercaya ribuan pelanggan yang puas." : "Fakta menarik: ternyata begini cara kerjanya!";
      visualContent = isPromotional ? `Latar belakang produk minimalis modern menonjolkan fitur #${n - 1}.` : `Ilustrasi visual modern pendukung poin #${n - 1} tentang ${title}.`;
    }
    if (isPromotional) {
      mediaSosialAturan = `Tambahkan layout visual dan teks detail berikut pada gambar secara profesional:
- Di pojok kiri atas gambar, tampilkan teks nomor halaman/slide: "${n}/${slideCount}".
- Di pojok kanan atas gambar, tampilkan teks ajakan follow: "Jangan lupa follow!".
- Di tengah, tepat di atas footer, tambahkan ikon atau teks navigasi swipe.
- Di bagian footer paling bawah gambar secara terpusat/minimalis, tampilkan info produk.`;
    } else {
      mediaSosialAturan = `Tambahkan layout visual dan teks detail berikut pada gambar secara profesional:
- Di pojok kiri atas gambar, buat sebuah overlay kotak berwarna biru dan tampilkan teks nomor halaman/slide saat ini: "${n}/${slideCount}".
- Di pojok kanan atas gambar, buat sebuah overlay dengan warna tersendiri yang konsisten dan tampilkan teks ajakan follow yang manis: "Jangan lupa follow!".
- Di tengah, tepat di atas footer, tambahkan ikon atau teks navigasi swipe ("Swipe right" atau panah ke kanan) untuk mengajak audiens menggeser slide.
- Di bagian footer paling bawah gambar secara terpusat/minimalis, tampilkan informasi sosial media dengan ikon/logo grafis saja tanpa label teks pengantar:
  * Tampilkan ikon/logo Instagram diikuti langsung oleh nama pengguna "arif_ex21" (tanpa kata "Logo" atau "Instagram" di depan).
  * Tampilkan ikon/logo Web/Globe diikuti langsung oleh link website "https://www.inka.my.id/" (tanpa kata "Web" di depan).
  * Tampilkan ikon/logo GitHub diikuti langsung oleh link GitHub "github.com/dresar" (tanpa kata "GitHub" di depan).`;
    }
    const slideObj = formatSlideOutput({
      slideNumber: n,
      totalSlides: slideCount,
      role,
      designStyleName: designStyle,
      orientationSpec,
      stylePromptText: "",
      visualContent,
      negativePrompt: "low quality, blurry, pixelated, noisy image, cluttered, low contrast",
      headline,
      subtext,
      detail,
      microTip,
      isPromotional,
      targetAudience,
      mandatoryRules,
      mediaSosialAturan
    });
    return slideObj;
  });
  return JSON.stringify(slides);
};
var generateSocialCaptions = async (title, contentType, targetAudience, designStyle, isPromotional, stylePrompt) => {
  const tone = isPromotional ? "persuasif, menjual, dengan urgency dan CTA kuat, bahasa non-formal bersemangat" : "edukatif, informatif, inspiratif, bahasa santai dan asik seperti teman berbagi ilmu";
  const captionPrompt = `Kamu adalah Social Media Copywriter profesional Indonesia.
Buat caption media sosial untuk konten ini:
- Topik: "${title}"
- Jenis: ${contentType}
- Audiens: ${targetAudience}
- Gaya Desain: ${designStyle}
${stylePrompt ? `- Visual Style Guide: "${stylePrompt}"` : ""}
- Tone: ${tone}

ATURAN CAPTION:
- Bahasa Indonesia non-formal, santai, seperti ngobrol sama teman
- Pakai emoji yang relevan dan natural
- Jangan kaku atau seperti siaran pers

Buat:
1. CAPTION INSTAGRAM: 2-4 paragraf pendek, engaging, ada hook di awal, ada CTA di akhir. Maks 2200 karakter.
2. CAPTION TIKTOK: Singkat, viral-friendly, ada hook kuat di baris pertama. Maks 150 karakter.
3. HASHTAGS: 15-20 hashtag campuran (besar + medium + niche), pisah dengan spasi.

Format output PERSIS seperti ini:
===INSTAGRAM_CAPTION===
[isi disini]
===TIKTOK_CAPTION===
[isi disini]
===HASHTAGS===
[hashtag disini]`;
  try {
    const raw = await callGroqApiWithRotation(captionPrompt);
    const igMatch = raw.match(/===INSTAGRAM_CAPTION===\s*([\s\S]*?)(?====TIKTOK_CAPTION===|$)/);
    const ttMatch = raw.match(/===TIKTOK_CAPTION===\s*([\s\S]*?)(?====HASHTAGS===|$)/);
    const hashMatch = raw.match(/===HASHTAGS===\s*([\s\S]*?)$/);
    const instagramCaption = igMatch ? igMatch[1].trim() : `\u2728 ${title}

Konten spesial buat kamu yang mau tau lebih banyak!

\u{1F4A1} Simpan dulu biar gak ketinggalan!
\u{1F4CC} Share ke teman yang butuh info ini!

#konten #indonesia`;
    const tiktokCaption = ttMatch ? ttMatch[1].trim() : `${title} \u{1F525} Wajib kamu tahu! #fyp #viral #indonesia`;
    const hashtags = hashMatch ? hashMatch[1].trim() : `#${title.replace(/\s+/g, "")} #konten #indonesia #viral #fyp #mediasosial`;
    return { instagramCaption, tiktokCaption, hashtags };
  } catch (e) {
    console.warn("Caption generation failed, using fallback:", e);
    return {
      instagramCaption: `\u2728 ${title}

Konten terbaik buat ${targetAudience}! Jangan lupa simpan dan share ke teman-teman ya!

\u{1F4AC} Komen pendapatmu di bawah!
\u{1F4CC} Follow untuk konten seru lainnya!

#konten #mediasosial #indonesia`,
      tiktokCaption: `${title} \u{1F525} Wajib tonton sampai habis! #fyp #viral #indonesia`,
      hashtags: `#${designStyle.split("|")[0].trim().replace(/\s+/g, "")} #${contentType.replace(/\s+/g, "")} #konten #mediasosial #indonesia #viral #fyp #edukasi #tips`
    };
  }
};
var getStyleAttributes = (designStyleName, stylePromptText = "") => {
  const name = designStyleName.toLowerCase();
  if (name.includes("infographic") || name.includes("infografis")) {
    return {
      gaya_dominan: "Product Lifestyle Photography dengan sentuhan Infographic Minimalist sebagai layer pendukung (rasio komposisi: 65% area foto produk lifestyle sebagai focal point utama, 35% area infographic minimalist untuk ruang teks/data di sekitar produk). JANGAN membuat gambar menjadi flat infographic penuh \u2014 produk harus tetap terlihat fotorealistik dan jadi pusat perhatian.",
      gaya_visual_wajib: "Premium editorial composition yang menggabungkan product photography dengan elemen infographic minimalist sebagai bingkai pendukung, terinspirasi dari Apple Keynote presentations, Stripe documentation, dan modern editorial layout. Hasil akhir harus terlihat seperti dikerjakan oleh senior art director profesional, bukan seperti AI-generated artwork generik.",
      layout_dan_hierarki: "Gunakan grid system yang terorganisir dengan margin konsisten, whitespace yang cukup, dan alur baca dari headline ke gambar produk ke detail pendukung. Sisakan area kosong yang jelas untuk headline, subtext, detail, dan microTip sesuai posisi yang ditentukan.",
      elemen_infografis_pendukung: "Tambahkan elemen infografis tipis dan halus sebagai dekorasi pendukung (bukan dominan): garis pembatas tipis, kartu statistik kecil, ikon flat monokrom/two-tone dengan stroke bersih, indikator lingkaran/persentase kecil di sudut. Elemen ini berfungsi sebagai aksen, bukan elemen utama.",
      palet_warna: "Warna dasar netral premium: Pure White (#FFFFFF), Off White (#FAFAFA), Light Gray (#F5F5F7), Warm White (#FCFCFC). Warna aksen terbatas: Deep Blue (#2563EB), Cyan (#06B6D4), Emerald Green (#10B981), Orange (#F59E0B), Charcoal (#374151). PENTING: warna aksen tidak boleh menutupi atau mengubah warna asli produk (tetap netral dan akurat).",
      tipografi: "Gunakan tipografi sans-serif modern bergaya Inter/SF Pro Display. Headline: bold, ukuran besar, kontras tinggi terhadap background. Subtext: regular weight, ukuran sedang. Detail & microTip: light/regular, ukuran kecil namun tetap terbaca jelas. Semua teks harus punya kontras warna cukup terhadap background agar mudah dibaca di layar mobile.",
      pencahayaan_dan_kamera: "Soft natural lighting dari arah kiri atas (golden hour tone hangat namun tetap clean), sudut kamera 45 derajat dengan shallow depth of field, produk diposisikan mengikuti rule of thirds sebagai focal point utama.",
      kedalaman_visual: "Bangun depth melalui spacing, layering, dan blur latar belakang alami (bokeh dari depth of field kamera), bukan melalui shadow dramatis, efek glossy, atau gradient berlebihan."
    };
  }
  if (name.includes("minimalist") || name.includes("minimalis")) {
    return {
      gaya_dominan: "Minimalist Studio Design yang sangat bersih dengan fokus utama pada produk (rasio komposisi: 70% area produk visual dengan ruang kosong luas, 30% area teks minimalis).",
      gaya_visual_wajib: "Ultra-minimalist modern graphic design, terinspirasi dari gaya majalah Kinfolk dan estetika brand premium minimalis. Sangat elegan, bersih, dan berkelas.",
      layout_dan_hierarki: "Asymmetric grid yang unik, margin super lebar, ruang bernafas (whitespace) yang sangat dominan untuk menonjolkan keindahan produk secara maksimal.",
      elemen_infografis_pendukung: "Ikon outline tipis satu warna, bullet point minimal berupa titik kecil, garis pembatas horizontal yang sangat tipis untuk menjaga kesederhanaan.",
      palet_warna: "Warna dasar netral premium: Matte Black (#111111), Pure White (#FFFFFF), Light Sand (#F3F2EE), Slate Gray (#6B7280). Warna aksen minimalis terbatas.",
      tipografi: "Gunakan tipografi sans-serif modern geometris bergaya Futura atau Inter. Headline: clean bold, ukuran besar. Detail: regular, ramping, dengan spacing teratur.",
      pencahayaan_dan_kamera: "Soft diffused natural light, bayangan lembut yang panjang, sudut kamera estetik dengan depth of field sangat dangkal (bokeh dramatis).",
      kedalaman_visual: "Menciptakan kedalaman melalui ruang kosong (negative space), bayangan natural yang lembut, dan penempatan layering produk yang elegan."
    };
  }
  if (name.includes("corporate") || name.includes("elegant") || name.includes("bisnis")) {
    return {
      gaya_dominan: "Professional Corporate Slide Design dengan perpaduan elemen bisnis minimalis (rasio komposisi: 60% area visual korporat/produk, 40% area infografis bersih untuk teks).",
      gaya_visual_wajib: "Premium editorial business design yang terstruktur rapi, terinspirasi dari McKinsey reports, Stripe design system, dan slide presentasi Apple Keynote. Terkesan profesional, bersih, dan mewah.",
      layout_dan_hierarki: "Struktur grid Swiss yang kaku, rapi, dan teratur. Whitespace luas, margin seimbang, penataan informasi yang efisien dan logis.",
      elemen_infografis_pendukung: "Garis tipis pembatas, diagram flat 2D minimalis, badge teks kecil, ikon bisnis monokrom bergaris tipis (thin-line icons).",
      palet_warna: "Warna dasar netral: Deep Navy Blue (#0F2D52), Charcoal Gray (#4B5563), Off-White (#FAFAFA). Warna aksen: Steel Blue (#3B82F6), Subtle Silver (#E5E7EB).",
      tipografi: "Sans-serif premium bergaya SF Pro Display / Helvetica Neue. Headline bold ukuran besar, subtext/detail teks rapi dan teratur dengan kontras tinggi.",
      pencahayaan_dan_kamera: "Clean studio lighting, pencahayaan merata dan netral, sudut kamera lurus (eye-level) atau top-down datar.",
      kedalaman_visual: "Menggunakan layering berlapis tipis, margin bersih, dan bayangan drop-shadow yang sangat halus (soft shadow)."
    };
  }
  if (name.includes("vibrant") || name.includes("bold") || name.includes("berani")) {
    return {
      gaya_dominan: "Vibrant High-Contrast Graphic Design dengan warna-warna berani dan layout dinamis (rasio komposisi: 60% elemen grafis ekspresif, 40% area teks kontras tinggi).",
      gaya_visual_wajib: "Bold modern media post design, bergaya pop-art modern dengan visual yang sangat mencolok dan dinamis untuk langsung menarik perhatian di feed media sosial.",
      layout_dan_hierarki: "Tata letak dinamis, asimetris, huruf headline yang menumpuk tebal, alur baca zig-zag yang energik dan menantang.",
      elemen_infografis_pendukung: "Bentuk geometris abstrak berwarna kontras, panah indikator tebal, badge warna neon, ikon dua dimensi yang solid dan tegas.",
      palet_warna: "Warna dasar kontras tinggi: Neon Blue (#00E5FF), Hot Pink (#FF007F), Bright Yellow (#FFD600), Charcoal (#121212).",
      tipografi: "Display font yang tebal dan ekstra bold (Montserrat Black / Impact). Headline sangat besar, subtext berwarna kontras tinggi.",
      pencahayaan_dan_kamera: "Bright direct studio lighting, kontras tinggi antara area terang dan gelap, saturasi warna tinggi.",
      kedalaman_visual: "Kedalaman visual dibangun dari tumpukan elemen datar berwarna kontras (overlapping flat shapes) dan bayangan tajam (hard shadow)."
    };
  }
  if (name.includes("playful") || name.includes("colorful") || name.includes("ceria")) {
    return {
      gaya_dominan: "Playful & Friendly Design dengan ilustrasi ceria 2D, cocok untuk audiens muda dan edukasi yang santai (rasio: 65% area ilustrasi visual, 35% area teks).",
      gaya_visual_wajib: "Gaya ilustratif kartun 2D yang ceria, hangat, ramah, dan penuh energi positif, menyerupai desain editorial modern untuk anak muda.",
      layout_dan_hierarki: "Tata letak yang santai, bentuk-bentuk melengkung organik (organic curves), susunan teks yang ramah dan dinamis.",
      elemen_infografis_pendukung: "Ikon lucu bergaya rounded, gelembung ucapan (speech bubbles), bentuk bintang/bunga dekoratif sederhana, bullet points berbentuk ikon imut.",
      palet_warna: "Warna-warni cerah yang hangat: Pastel Orange (#F59E0B), Soft Yellow (#FBBF24), Mint Green (#34D399), Sky Blue (#60A5FA), Soft Peach (#FCA5A5).",
      tipografi: "Tipografi sans-serif dengan sudut membulat (rounded) seperti Quicksand atau Nunito. Terasa bersahabat, hangat, dan sangat mudah dibaca.",
      pencahayaan_dan_kamera: "Bright warm ambient light, pencahayaan merata tanpa bayangan tajam, warna cerah dan mengundang.",
      kedalaman_visual: "Kedalaman minimalis dengan overlay bentuk melengkung yang tumpang tindih secara halus (soft overlapping layers) dan outline tipis."
    };
  }
  if (name.includes("retro") || name.includes("vintage") || name.includes("klasik")) {
    return {
      gaya_dominan: "Classic 90s Retro Aesthetic dengan tekstur organik dan gaya cetak lama (rasio: 60% visual ilustrasi bergaya retro, 40% area teks klasik).",
      gaya_visual_wajib: "Estetika klasik tahun 90-an (90s retro pop), tekstur kertas grain/grunge halus, gaya ilustrasi datar dengan outline vintage yang elegan.",
      layout_dan_hierarki: "Struktur layout majalah klasik, margin lebar dengan border luar ganda (double border), penempatan teks terpusat yang seimbang.",
      elemen_infografis_pendukung: "Garis dekoratif bergelombang, stiker gaya retro, ikon piksel atau monokrom jadul, bingkai kartu dengan drop-shadow hitam padat.",
      palet_warna: "Palet warna pastel pop hangat pudar: Warm Mustard (#D97706), Terracotta (#C2410C), Olive Green (#4D7C0F), Cream Beige (#FEF3C7), Vintage White (#FDFBF7).",
      tipografi: "Menggunakan font Serif klasik bergaya retro (Playfair Display / Merriweather). Headline: bold serif, anggun dan berkarakter. Subtext: sans-serif klasik.",
      pencahayaan_dan_kamera: "Warm analog film lighting dengan filter warm tone, bayangan pudar (faded shadow), menyerupai hasil foto kamera polaroid/roll film.",
      kedalaman_visual: "Dibangun melalui tekstur grain kertas, bayangan offset padat (hard offset shadow), dan layering elemen grafis gaya kolase cetak."
    };
  }
  if (name.includes("cyberpunk") || name.includes("futuristik")) {
    return {
      gaya_dominan: "Dark Cyberpunk Sci-Fi Design dengan latar belakang gelap gulita dan aksen neon menyala (rasio: 60% visual futuristik, 40% teks neon kontras).",
      gaya_visual_wajib: "Futuristik dark cyberpunk style, memadukan background hitam/abu-abu sangat gelap dengan aksen grafis neon yang berpendar tajam.",
      layout_dan_hierarki: "Tata letak asimetris yang futuristik, menggunakan panel-panel UI bergaya layar komputer canggih, teks dengan orientasi vertikal/horizontal kontras.",
      elemen_infografis_pendukung: "Garis grid teknologi (laser lines), HUD digital, hologram minimalis, indikator glosarium sains, barcode dekoratif.",
      palet_warna: "Latar belakang gelap: Matte Black (#08080C), Charcoal (#12131C). Aksen neon menyala: Electric Pink (#FF007F), Neon Cyan (#00F0FF), Acid Yellow (#CCFF00).",
      tipografi: "Font sans-serif modern bergaya futuristik/mono (JetBrains Mono / Space Grotesk). Teks headline besar dengan efek glow/glow tipis.",
      pencahayaan_dan_kamera: "High contrast neon backlighting, pencahayaan dramatis dari samping, pantulan cahaya neon pada objek utama.",
      kedalaman_visual: "Menciptakan kedalaman dengan efek overlay layer berpendar (glowing cards), kontras kegelapan latar dengan pendaran cahaya neon."
    };
  }
  if (name.includes("brutalist") || name.includes("neo-brutalist")) {
    return {
      gaya_dominan: "Neo-Brutalist Design dengan border hitam tebal, warna flat mentah, dan layout bertumpuk (rasio: 55% visual abstrak/produk, 45% teks bertumpuk).",
      gaya_visual_wajib: "Neo-brutalisme modern yang berani, menggunakan garis tepi hitam tebal dan tegas, warna solid mentah kontras tinggi, dan tata letak asimetris.",
      layout_dan_hierarki: "Grid mentah dengan garis pembatas hitam tebal (2-3px). Kotak teks diletakkan bertumpuk dengan bayangan offset padat tanpa blur.",
      elemen_infografis_pendukung: "Panah penunjuk tebal dengan border hitam, stiker datar, ikon flat yang sangat sederhana, box teks dengan drop shadow offset solid hitam.",
      palet_warna: "Warna datar mentah kontras tinggi: Bright Lemon (#FDE047), Mint Green (#4ADE80), Sky Cyan (#38BDF8), Hot Coral (#FB7185), Pure White (#FFFFFF) dengan border Matte Black (#000000).",
      tipografi: "Gunakan tipografi sans-serif tebal ekstrim bergaya Helvetica/Arial Black atau Archivo. Headline sangat dominan dan tegas.",
      pencahayaan_dan_kamera: "Flat 2D rendering, tidak ada bayangan 3D nyata atau pencahayaan kamera, semua elemen visual digambar sebagai objek datar.",
      kedalaman_visual: "Kedalaman visual disimulasikan murni menggunakan bayangan kotak offset solid (hard shadow offset) bergeser ke kanan bawah."
    };
  }
  if (name.includes("pastel") || name.includes("dream")) {
    return {
      gaya_dominan: "Dreamy Soft Pastel Design dengan gradasi warna halus dan bentuk bulat yang menenangkan (rasio: 65% visual produk/ilustrasi lembut, 35% teks).",
      gaya_visual_wajib: "Estetika pastel impian yang sangat lembut dan menenangkan, memadukan bentuk-bentuk geometris berujung bulat dengan gradasi warna transisi halus.",
      layout_dan_hierarki: "Tata letak yang harmonis, mengalir lembut, margin lebar dengan whitespace yang memberikan ketenangan visual.",
      elemen_infografis_pendukung: "Bentuk awan/bulat halus, ikon bergaris tipis dengan warna pastel senada, kartu berujung bulat (pill shapes), indikator persentase minimalis.",
      palet_warna: "Palet warna pastel lembut: Soft Lavender (#E9D5FF), Pale Pink (#FCE7F3), Mint Cream (#ECFDF5), Soft Cream (#FEF3C7), Sky Blue (#E0F2FE).",
      tipografi: "Gunakan tipografi sans-serif modern berbobot medium/regular seperti Outfit atau Nunito, memberikan kesan bersih dan damai.",
      pencahayaan_dan_kamera: "Super soft diffused light, pencahayaan alami yang lembut tanpa bayangan tegas, memberikan nuansa pagi hari yang berkabut halus.",
      kedalaman_visual: "Menggunakan gradasi warna latar belakang yang sangat halus, blur background ringan, dan bayangan tipis transparan (soft glow shadow)."
    };
  }
  if (name.includes("sketch") || name.includes("hand-drawn") || name.includes("doodle")) {
    return {
      gaya_dominan: "Artistic Hand-Drawn Doodle Design dengan garis tinta organik dan sapuan warna marker air (rasio: 60% visual sketsa organik, 40% area teks).",
      gaya_visual_wajib: "Ilustrasi sketsa tangan artistik (hand-drawn doodle art), menggunakan garis luar tinta hitam organik bergaya gambar tangan personal.",
      layout_dan_hierarki: "Tata letak bergaya jurnal seni (scrapbook/bullet journal), margin bebas, teks dan gambar disusun secara personal dan tidak kaku.",
      elemen_infografis_pendukung: "Panah yang digambar tangan, lingkaran penanda coretan, ikon doodle, garis bawah teks bergelombang buatan tangan.",
      palet_warna: "Warna dasar kertas alami: Paper Beige (#F5F5DC), Warm White (#FCFCFA). Sapuan warna air transparan: Soft Olive (#A3E635), Mustard Yellow (#FACC15), Pale Coral (#FCA5A5).",
      tipografi: "Gunakan tipografi menyerupai tulisan tangan yang kasual tapi rapi (handwriting font seperti Patrick Hand atau Caveat).",
      pencahayaan_dan_kamera: "Flat overhead lighting, menyerupai lembaran buku sketsa yang difoto dari atas di atas meja kerja.",
      kedalaman_visual: "Menciptakan depth melalui tumpukan sapuan warna marker semi-transparan di bawah garis sketsa hitam."
    };
  }
  if (name.includes("geometric") || name.includes("abstract")) {
    return {
      gaya_dominan: "Geometric Abstract Swiss Design dengan bentuk lingkaran, segitiga, dan grid presisi (rasio: 60% komposisi abstrak geometris, 40% teks grid).",
      gaya_visual_wajib: "Seni abstrak geometris klasik Swiss design style. Tata letak grid yang presisi tinggi dengan perpaduan bentuk geometris murni.",
      layout_dan_hierarki: "Grid system internasional yang sangat ketat, sejajar sempurna, penempatan headline dan subtext mengikuti koordinat grid.",
      elemen_infografis_pendukung: "Garis pembatas tebal solid, bentuk lingkaran/segitiga/persegi sebagai aksen layout, penanda poin berupa bentuk geometris kecil.",
      palet_warna: "Warna solid kontras tinggi: Crimson Red (#DC2626), Royal Blue (#1D4ED8), Mustard Yellow (#EAB308), Jet Black (#1A1A1A), Pure White (#FFFFFF).",
      tipografi: "Wajib menggunakan sans-serif netral legendaris (Helvetica / Arial / SF Pro Display) dengan bobot bold/heavy.",
      pencahayaan_dan_kamera: "Flat vector design, tidak ada pencahayaan studio atau bayangan 3D, semua bentuk murni datar 2D solid.",
      kedalaman_visual: "Kedalaman dibangun melalui penyusunan ukuran bentuk geometris (besar ke kecil) dan layering warna solid yang tumpang tindih secara presisi."
    };
  }
  if (name.includes("manga") || name.includes("comic") || name.includes("komik")) {
    return {
      gaya_dominan: "Japanese Manga Comic Style hitam putih dengan panel komik dan speed lines (rasio: 65% visual panel manga, 35% area teks dialog/poin).",
      gaya_visual_wajib: "Seni komik manga Jepang hitam putih tradisional, menggunakan tekstur dot halftone, panel komik tegas, dan garis luar tinta hitam tebal.",
      layout_dan_hierarki: "Pembagian panel komik dengan grid miring yang dinamis. Teks penting diletakkan di dalam balon teks komik atau kotak teks narasi.",
      elemen_infografis_pendukung: "Garis aksi (speed lines), balon teks dialog (speech bubbles), efek suara komik (onomatopoeia), bayangan halftone.",
      palet_warna: "Murni monokromatik hitam-putih: Deep Ink Black (#000000), Stark White (#FFFFFF) dengan variasi abu-abu berpola dot halftone.",
      tipografi: "Menggunakan font komik sans-serif ekspresif yang dinamis (seperti Comic Neue atau font manga Indonesia).",
      pencahayaan_dan_kamera: "High-contrast manga drawing, arsir garis (cross-hatching) untuk bayangan, tidak ada pencahayaan realistik.",
      kedalaman_visual: "Menciptakan kedalaman melalui perspektif panel yang dramatis, ketebalan garis tinta (line weight), dan bayangan arsir halftone."
    };
  }
  if (name.includes("sci-fi") || name.includes("hud") || name.includes("techno") || name.includes("circuit")) {
    return {
      gaya_dominan: "Techno Sci-Fi HUD Design dengan antarmuka sirkuit teknologi masa depan (rasio: 60% visual UI sains futuristik, 40% area teks digital).",
      gaya_visual_wajib: "Desain fiksi ilmiah bertema layar komputer sains (Sci-Fi HUD interface), dengan garis UI berpola sirkuit dan indikator data bercahaya.",
      layout_dan_hierarki: "Tata letak modular terstruktur seperti layar dasbor kontrol pesawat antariksa. Data dan teks dikelompokkan dalam kotak-kotak UI tipis.",
      elemen_infografis_pendukung: "Radar lingkaran, garis sirkuit teknologi, indikator panah digital, koordinat teks kecil, grafik frekuensi gelombang.",
      palet_warna: "Latar belakang gelap luar angkasa: Dark Space Blue (#020617), Tech Black (#090D1A). Indikator menyala: Laser Blue (#06B6D4), Cyan (#22D3EE), Lime Green (#84CC16).",
      tipografi: "Font monospace atau digital teknis bergaya minimal (JetBrains Mono / Share Tech Mono), memberikan kesan data komputer.",
      pencahayaan_dan_kamera: "Glowing display backlight, efek pendaran cahaya dari panel UI tipis di atas latar belakang gelap.",
      kedalaman_visual: "Menciptakan kedalaman dengan tumpukan grid semitransparan (semi-transparent grids) dan elemen HUD yang berlapis-lapis."
    };
  }
  if (name.includes("glassmorphism") || name.includes("glass")) {
    return {
      gaya_dominan: "Glassmorphism Design dengan kartu kaca transparan blur di atas gradien warna premium (rasio: 60% visual kartu kaca, 40% teks kontras).",
      gaya_visual_wajib: "Desain glassmorphism modern kelas atas, menampilkan efek kartu kaca buram transparan (frosted glass) yang elegan di atas background dinamis.",
      layout_dan_hierarki: "Penataan kartu melayang (floating cards) yang rapi secara vertikal atau horizontal, dengan headline berada di dalam kartu kaca utama.",
      elemen_infografis_pendukung: "Kartu kaca transparan dengan border putih sangat tipis, ikon flat bergaya dual-tone dengan transparansi, panah kaca transparan.",
      palet_warna: "Gradien latar belakang mewah: Royal Violet to Deep Emerald (#4C1D95 to #064E3B), Warm Gold to Copper (#78350F to #7C2D12). Kartu kaca: semi-transparan putih dengan blur tinggi.",
      tipografi: "Gunakan tipografi sans-serif modern premium seperti Inter atau Outfit. Teks di atas kaca harus memiliki kontras bayangan halus.",
      pencahayaan_dan_kamera: "Glossy frosted light reflection, pencahayaan studio lembut dengan highlight berkilau pada tepi-tepi kartu kaca.",
      kedalaman_visual: "Sangat kaya kedalaman melalui blur latar belakang (backdrop-filter blur), bayangan melayang (drop shadow lembut), dan border transparan."
    };
  }
  if (name.includes("nature") || name.includes("organic") || name.includes("botanical") || name.includes("alam")) {
    return {
      gaya_dominan: "Organic Botanical Design dengan warna bumi hangat dan sketsa tanaman alam yang tenang (rasio: 60% ilustrasi botani, 40% teks serif).",
      gaya_visual_wajib: "Desain organik berwawasan alam (botanical organic style), memadukan sketsa garis tanaman daun dan bunga yang anggun dengan warna bumi.",
      layout_dan_hierarki: "Tata letak yang tenang, asimetris alami, margin longgar, memberikan kesan bernafas dan dekat dengan alam.",
      elemen_infografis_pendukung: "Sketsa garis tanaman/daun halus, lingkaran tanah liat (terracotta shapes), ikon ramah lingkungan minimalis bergaris tipis.",
      palet_warna: "Warna bumi hangat (earthy tones): Terracotta (#C2410C), Olive Green (#3F6212), Mustard (#CA8A04), Sage Beige (#F5F5DC), Warm Clay (#EFEBE9).",
      tipografi: "Wajib menggunakan Serif klasik yang elegan dan artistik (seperti Playfair Display atau Lora) dikombinasikan dengan sans-serif ramping.",
      pencahayaan_dan_kamera: "Soft warm dappled light (efek bayangan dedaunan alami yang jatuh di atas kertas), nuansa sore hari yang hangat.",
      kedalaman_visual: "Menciptakan kedalaman dengan layering bayangan dedaunan tipis (dappled shadows) dan susunan sketsa botani di latar belakang."
    };
  }
  const cleanPromptText = stylePromptText ? stylePromptText.trim() : "";
  return {
    gaya_dominan: cleanPromptText || `${designStyleName} design style as focal point with professional slide placement.`,
    gaya_visual_wajib: cleanPromptText ? `Premium custom graphic design composition: ${cleanPromptText}` : `Professional custom design styling for ${designStyleName}.`,
    layout_dan_hierarki: "Gunakan grid system terorganisir dengan margin konsisten, whitespace yang cukup, dan alur baca teratur.",
    elemen_infografis_pendukung: "Tambahkan elemen visual pendukung yang tipis dan halus sebagai dekorasi pendukung.",
    palet_warna: `Palet warna disesuaikan dengan tema ${designStyleName}.`,
    tipografi: "Gunakan tipografi sans-serif modern yang bersih dan memiliki kontras warna cukup.",
    pencahayaan_dan_kamera: "Pencahayaan studio lembut (soft studio lighting) dengan sudut kamera estetik.",
    kedalaman_visual: "Menciptakan kedalaman visual melalui spacing, layering, dan bayangan natural yang sangat halus."
  };
};
var formatSlideOutput = (params) => {
  const styleName = params.designStyleName.split("|")[0].trim();
  const styleAttributes = getStyleAttributes(styleName, params.stylePromptText);
  const instruksiAwalWajib = params.customInstruksiAwalWajib || `PERINTAH UTAMA UNTUK AI IMAGE GENERATOR: Sebelum membuat gambar, lakukan analisis internal terhadap seluruh isi prompt ini (deskripsi_visual, objek, layout, teks, warna, komposisi) dan bandingkan dengan pola/hasil yang biasa kamu buat untuk slide-slide lain dalam satu rangkaian carousel ini (slide 1 sampai ${params.totalSlides}). Jika ditemukan potensi kesamaan/duplikasi tinggi pada: sudut kamera, pose objek, posisi elemen infografis, kombinasi warna aksen, atau layout ikon dengan slide sebelumnya \u2014 WAJIB melakukan variasi kreatif (ubah angle, ubah komposisi framing, ubah posisi blok infografis, atau ubah kombinasi ikon pendukung) SELAMA tetap konsisten dengan sistem desain utama (font, palet warna dasar, gaya ${styleName.toLowerCase()}, posisi elemen wajib seperti nomor slide/footer/CTA). Tujuannya: setiap slide harus terasa unik secara visual namun tetap satu kesatuan sistem desain yang koheren sebagai satu carousel.`;
  return {
    instruksi_awal_wajib: instruksiAwalWajib,
    slideNumber: params.slideNumber,
    totalSlides: params.totalSlides,
    role: params.role,
    peran: "Kamu adalah Senior Graphic Designer & Art Director yang mengetahui kombinasi warna, tipografi, dan estetika visual premium.",
    instruksi: "Buatkan saya gambar baru dengan deskripsi berikut, pastikan hasilnya berbeda secara komposisi dari slide lain dalam carousel ini:",
    gaya_dominan: styleAttributes.gaya_dominan,
    deskripsi_visual: `[GAYA VISUAL WAJIB]: ${styleAttributes.gaya_visual_wajib}
[TATA LETAK & HIERARKI]: ${styleAttributes.layout_dan_hierarki}
[ELEMEN PENDUKUNG]: ${styleAttributes.elemen_infografis_pendukung}
[PALET WARNA]: ${styleAttributes.palet_warna}
[TIPOGRAFI]: ${styleAttributes.tipografi}
[PENCAHAYAAN & KAMERA]: ${styleAttributes.pencahayaan_dan_kamera}
[OBJEK & KONTEKS]: ${params.visualContent}
[KEDALAMAN VISUAL]: ${styleAttributes.kedalaman_visual}
[DIMENSI CANVAS]: Canvas ${params.orientationSpec.widthHint}px, Aspect Ratio ${params.orientationSpec.ratio} (--ar ${params.orientationSpec.ratio})`,
    negative_prompt: params.negativePrompt,
    teks_dalam_gambar: {
      headline: params.headline,
      subtext: params.subtext,
      detail: params.detail,
      microTip: params.microTip,
      nomor_slide: `${params.slideNumber} dari ${params.totalSlides}`
    },
    aturan_permanen: `${params.mandatoryRules.trim()}
Target Audiens: ${params.targetAudience}`,
    media_sosial_aturan: params.mediaSosialAturan
  };
};
var getStylePromptText = async (designStyle) => {
  if (!designStyle) return "";
  const styleName = designStyle.split("|")[0].trim();
  try {
    const styleRows = await query(
      `SELECT prompt FROM design_styles 
       WHERE LOWER(name) = LOWER(?) OR id = ? OR LOWER(name) LIKE ? OR ? LIKE LOWER(CONCAT('%', name, '%')) 
       LIMIT 1`,
      [styleName.toLowerCase(), styleName, `%${styleName.toLowerCase()}%`, styleName.toLowerCase()]
    );
    if (styleRows.rows && styleRows.rows.length > 0) {
      return styleRows.rows[0].prompt || "";
    }
    const themeRows = await query(
      `SELECT prompt FROM themes 
       WHERE LOWER(name) = LOWER(?) OR id = ? OR LOWER(name) LIKE ? OR ? LIKE LOWER(CONCAT('%', name, '%')) 
       LIMIT 1`,
      [styleName.toLowerCase(), styleName, `%${styleName.toLowerCase()}%`, styleName.toLowerCase()]
    );
    if (themeRows.rows && themeRows.rows.length > 0) {
      return themeRows.rows[0].prompt || "";
    }
  } catch (err) {
    console.warn("Error fetching style/theme prompt from DB in getStylePromptText:", err);
  }
  return "";
};

// src/controllers/prompt/educationalController.ts
var import_uuid3 = require("uuid");
var generatePrompt = async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  const { title, contentType, slideCount, designStyle, targetAudience, imageOrientation, includeCaption, characterId, useCharacter } = req.body;
  if (!title || !contentType || !slideCount || !designStyle || !targetAudience) {
    return res.status(400).json({ message: "Missing required parameters." });
  }
  const orientationSpec = getOrientationSpec(imageOrientation || "potret");
  const shouldGenerateCaption = includeCaption !== false && includeCaption !== "false";
  let aiTitle = title;
  if (title.trim().length > 25) {
    try {
      const titlePrompt = `Kamu adalah Copywriter profesional. Buatlah judul ringkas (maks 5 kata) yang merangkum topik: "${title}". LANGSUNG berikan hasil judulnya saja, tanpa tanda kutip, tanpa awalan/akhiran.`;
      const summarizedTitle = await callGroqApiWithRotation(titlePrompt);
      if (summarizedTitle && summarizedTitle.trim().length > 0) {
        aiTitle = summarizedTitle.trim().replace(/^"|"$/g, "").trim();
      }
    } catch (e) {
      console.warn("Gagal membuat judul ringkas via Groq:", e);
    }
  }
  let generatedPrompt = "";
  let stylePromptText = "";
  let characterPromptText = "";
  let characterName = "";
  const shouldAddCharacter = useCharacter === true || useCharacter === "true";
  const contentTypeLower = contentType.toLowerCase();
  const isPromotional = (contentTypeLower.includes("iklan") || contentTypeLower.includes("promo") || contentTypeLower.includes("showcase") || contentTypeLower.includes("ads")) && !contentTypeLower.includes("edukasi");
  const mandatoryRules = getMandatoryRules(isPromotional, orientationSpec);
  const terminology = getTerminologyGlossary(isPromotional);
  try {
    stylePromptText = await getStylePromptText(designStyle);
    if (shouldAddCharacter && characterId) {
      try {
        const charRows = await query("SELECT name, prompt FROM characters WHERE id = ?", [characterId]);
        if (charRows.rows && charRows.rows.length > 0) {
          characterName = charRows.rows[0].name;
          characterPromptText = charRows.rows[0].prompt || "";
        }
      } catch (charErr) {
        console.warn("Failed to fetch character from DB:", charErr);
      }
    }
    const audienceInstruction = getAudienceInstruction(targetAudience);
    let bgLabel = "";
    const styleParts = designStyle.split("|");
    const styleName = styleParts[0].trim();
    if (styleParts.length > 1) {
      for (const part of styleParts) {
        const trimmedPart = part.trim();
        if (trimmedPart.toLowerCase().startsWith("latar:")) {
          bgLabel = trimmedPart.substring(6).trim();
        }
      }
    }
    if (!bgLabel) {
      bgLabel = "Putih Bersih";
    }
    const daftarSlideSkeleton = Array.from({ length: slideCount }).map((_, idx) => {
      const slideNumber = idx + 1;
      let role = `POIN EDUKASI #${slideNumber - 1}`;
      if (slideNumber === 1) role = "HOOK & COVER EDUKASI (Slide Pembuka)";
      if (slideNumber === slideCount) role = "PENUTUP & AJAK INTERAKSI (Slide Terakhir)";
      return `    {
      "slideNumber": ${slideNumber},
      "role": "${role}",
      "urutan_alur_belajar": "Step ${slideNumber} dari ${slideCount}: ${slideNumber === 1 ? "Pengenalan & Hook" : slideNumber === slideCount ? "Kesimpulan & CTA" : "Penjelasan Materi"}",
      "objek_visual": "[Deskripsikan elemen visual / ilustrasi spesifik untuk slide ${slideNumber} yang BERBEDA dari slide lainnya, tapi WAJIB mencantumkan penggunaan latar ${bgLabel}]",
      "teks_dalam_gambar": {
        "headline": "[${slideNumber === 1 ? "Headline/Hook menarik" : slideNumber === slideCount ? "Kesimpulan pendek" : "Judul poin edukasi (maks 8 kata)"}]",
        "subtext": "[${slideNumber === 1 ? "Opsional subtext" : slideNumber === slideCount ? "Kosongkan" : "1-2 kalimat santai pembuka penjelasan"}]",
        "detail": "[${slideNumber === 1 ? "Kosongkan" : slideNumber === slideCount ? "Kosongkan" : "3-5 kalimat penjelas lengkap dan asik dibaca"}]",
        "microTip": "[${slideNumber === 1 ? "Kosongkan" : slideNumber === slideCount ? "Ajakan Save, Share, Follow" : "1 kalimat tips praktis"}]"
      }
    }`;
    }).join(",\n");
    let characterInstruction = "";
    if (shouldAddCharacter && characterPromptText) {
      characterInstruction = `
==================================================
ATURAN KARAKTER (WAJIB KONSISTEN):
Kamu WAJIB menyertakan karakter berikut di dalam deskripsi 'objek_visual' pada setiap slide:
- Nama Karakter: "${characterName}"
- Deskripsi Visual Karakter (Wajib disertakan persis seperti ini di setiap slide agar gambar konsisten): "${characterPromptText}"
- Posisi & Gerakan: Kamu (Groq) bebas menentukan pose, gerakan, atau ekspresi karakter yang bervariasi di setiap slide agar presentasi dinamis (misal: menunjuk ke teks, memegang dagu sedang berpikir, ekspresi senang menyapa audiens, dsb).
- Konsistensi: Pastikan warna baju, gaya rambut, dan ciri visual lainnya selalu konsisten di semua slide.
`;
    } else {
      characterInstruction = `
==================================================
ATURAN KARAKTER (DILARANG ADA KARAKTER):
- Kamu dilarang keras memunculkan karakter manusia, maskot, avatar, atau orang di dalam deskripsi 'objek_visual' pada semua slide.
- Slide visual HANYA boleh berisi elemen grafis, ilustrasi objek benda mati, diagram, infografis, mock-up, atau visual abstrak yang sesuai dengan judul dan materi konten.
`;
    }
    const singleGroqPrompt = `Kamu adalah Senior Graphic Designer, Art Director, dan Copywriter profesional yang sangat ahli dalam merancang carousel edukasi media sosial yang estetik, rapi, dan memiliki kombinasi visual premium.
 
Tugasmu adalah menghasilkan SATU data terstruktur lengkap untuk carousel dalam format JSON murni.
 
INFORMASI PROJECT:
- Judul / Topik Utama: "${title}"
- Jenis Konten: "${contentType}"
- Jumlah Slide: ${slideCount}
- Target Audiens: "${targetAudience}"
- Gaya Desain Utama: "${styleName}"
- Deskripsi Gaya Utama (Penting): "${stylePromptText || "Gaya profesional dan minimalis"}"
- Tema Latar Belakang / Warna Pilihan: "${bgLabel}"
- Orientasi Gambar: "${orientationSpec.spec}" (Rasio: ${orientationSpec.ratio})
 
==================================================
ATURAN KONSISTENSI WARNA & VISUAL (SANGAT PENTING):
1. Pilihan warna latar belakang user adalah: "${bgLabel}".
2. Kamu WAJIB menerapkan warna/latar tersebut pada seluruh slide secara konsisten!
3. Di dalam array 'daftar_slide', setiap deskripsi 'objek_visual' harus mencantumkan penggunaan latar "${bgLabel}".
${characterInstruction}

==================================================
ATURAN TEKS KONTEN EDUKASI (WAJIB DIPATUHI 100%):
- Gunakan bahasa non-formal, santai, asik (BUKAN seperti buku pelajaran).
- Batas Teks: Headline maksimal 10 kata, subtext 15 kata, detail 60 kata, microTip 20 kata.
- Selipkan kata-kata edukasi wajib: fakta menarik, tahukah kamu, tips praktis, insight penting, cara mudah.
- Dilarang keras menyebut harga, diskon, promo produk, atau jualan.

==================================================
FORMAT OUTPUT JSON YANG HARUS KAMU HASILKAN:
Kamu wajib mengembalikan output 1 JSON object murni LENGKAP tanpa terpotong-potong. 
JANGAN memecah menjadi beberapa JSON. JANGAN berikan teks penjelasan.
Pastikan array "daftar_slide" berisi TEPAT ${slideCount} object sesuai jumlah slide.
Struktur HARUS persis seperti contoh di bawah (tanda kutip telah disesuaikan agar format JSON valid):

{
  "judul_project": "${title} - Carousel Edukasi ${slideCount} Slide",
  "instruksi_cara_kerja_ai": "PERINTAH UTAMA \u2014 BACA DAN INGAT SELAMA SESI INI BERLANGSUNG:\\nIni adalah satu paket prompt master untuk membuat ${slideCount} gambar carousel edukasi secara berurutan. JANGAN generate semua ${slideCount} gambar sekaligus. Ikuti alur kerja berikut:\\n\\n1. KONFIRMASI: Setelah membaca prompt ini, berikan rangkuman singkat bahwa kamu paham aturan global, gaya visual, dan daftar ${slideCount} slide, lalu TUNGGU perintah 'lanjut'.\\n2. EKSEKUSI PER SLIDE: Setiap user mengetik 'lanjut' atau 'next', generate SATU gambar untuk slide berikutnya sesuai urutan.\\n3. KONSISTENSI KARAKTER & VISUAL (FITUR WAJIB): Simpan metadata visual (warna dominan, ciri fisik karakter, pakaian, jenis lighting, environment/background) di ingatanmu. Gunakan seed atau deskripsi referensi yang identik di setiap prompt gambar selanjutnya untuk mempertahankan konsistensi identitas.\\n4. VARIASI ANGLE & KOMPOSISI: Selalu bandingkan rencana komposisi slide baru dengan slide sebelumnya. Variasikan angle kamera (close-up, medium shot, wide shot, top-down) dan posisi objek utama agar tidak repetitif, NAMUN tetap 100% patuh pada 'gaya_visual_global'.\\n5. KONSISTENSI UI/OVERLAY: Pastikan elemen UI seperti nomor slide, CTA follow, dan footer diletakkan pada posisi pixel yang identik di setiap gambar.\\n6. ATURAN LATAR/BACKGROUND: WAJIB gunakan latar belakang dengan nuansa ${bgLabel} di seluruh slide.\\n7. PROGRESS TRACKING: Jika ditanya 'sudah sampai mana', berikan laporan progres dari total ${slideCount} slide.",
  "aturan_global": {
    "platform_target": "Instagram Carousel Post",
    "peran": "Kamu adalah Senior Graphic Designer & Art Director yang mengetahui kombinasi warna, tipografi, dan estetika visual premium.",
    "target_audiens": "${targetAudience}",
    "level_kesulitan_konten": "Pemula total, asumsikan audiens belum pernah lihat materi ini sebelumnya. Gunakan analogi sehari-hari dan jangan terlalu teknis.",
    "jenis_konten": "${contentType}",
    "catatan_render_kode": "TIDAK BOLEH generate teks sintaks kode presisi (<p>, <a>, dll) sebagai teks asli dalam gambar. AI cukup membuat ilustrasi visual yang menyerupai blok kode dengan syntax highlighting (tanpa teks presisi) untuk diedit manual nantinya.",
    "bahasa_teks_overlay": "Non-formal, santai, dan asik. Bicara seperti kakak/teman yang berbagi ilmu, BUKAN seperti buku pelajaran atau artikel jurnal.",
    "batas_teks": "Maksimal 10 kata per elemen teks (headline, subtext, detail, microTip). Ringkas, padat, cepat dibaca.",
    "satu_poin_per_slide": "Satu slide = satu insight/tips/fakta yang disampaikan jelas dan mudah dicerna.",
    "terminologi_wajib_diselipkan": ["fakta menarik", "tahukah kamu", "tips praktis", "jangan sampai salah", "insight penting", "studi menunjukkan", "cara mudah", "langkah simpel", "bukti nyata", "ternyata begini", "coba deh", "bisa langsung dipraktekin"],
    "larangan": "DILARANG KERAS menyebut harga, diskon, promo produk, atau jualan apapun dalam konten edukasi ini.",
    "call_to_action_variatif": "Selain save/share/follow, variasikan ajakan: misal ajak komentar (\\"Tag HTML favoritmu apa?\\"), atau praktik (\\"Coba tag ini sekarang di text editor kamu\\") agar lebih interaktif."
  },
  "gaya_visual_global": {
    "gaya_visual_wajib": "${(stylePromptText || designStyle).replace(/"/g, '\\"')}",
    "gaya_dominan": "${styleName} dengan perpaduan elemen profesional.",
    "rasio_komposisi": "70% area ilustrasi/kode visual, 30% area teks (whitespace luas) agar AI tidak menginterpretasi bebas proporsi tiap slide.",
    "tata_letak_hierarki": "Struktur grid yang rapi, rapi, dan teratur. Whitespace luas, margin seimbang, penataan informasi yang efisien.",
    "elemen_pendukung": "Garis tipis pembatas, ikon pendukung minimalis, elemen yang sesuai dengan ${styleName}.",
    "gaya_ikon_konsisten": "Flat line icon, duotone, stroke 2px, sudut membulat. Konsisten satu sistem di seluruh slide.",
    "palet_warna": {
      "dasar_netral": ["Deep Navy Blue (#0F2D52)", "Charcoal Gray (#4B5563)", "Off-White (#FAFAFA)", "${bgLabel}"],
      "aksen": ["Steel Blue (#3B82F6)", "Subtle Silver (#E5E7EB)"]
    },
    "tipografi": "Sans-serif premium. Headline bold ukuran besar, subtext/detail teks rapi dan teratur dengan kontras tinggi.",
    "tipografi_kode": "Font khusus untuk elemen menyerupai kode program: Fira Code / JetBrains Mono, monospace, dengan warna syntax-highlight (keyword biru, string hijau, tag oranye).",
    "variasi_wajib_per_slide": "Harus memiliki variasi angle kamera, rotasi posisi ilustrasi (kiri/kanan), dan variasi warna aksen dominan per slide untuk menghindari kebosanan.",
    "referensi_visual_brand": "Desain harus memiliki identitas visual \\"Series Edukasi\\" yang ajeg, sehingga konten-konten lain selanjutnya memiliki benang merah yang sama.",
    "pencahayaan_kamera": "Clean studio lighting, pencahayaan merata dan netral, sudut kamera lurus (eye-level) atau top-down datar.",
    "kedalaman_visual": "Layering berlapis tipis, margin bersih, bayangan drop-shadow yang sangat halus.",
    "dimensi_canvas": "Canvas ${orientationSpec.widthHint}px, Aspect Ratio ${orientationSpec.ratio} (--ar ${orientationSpec.ratio})",
    "negative_prompt": "watermark, blur, teks berantakan, kualitas buruk, anatomi aneh, font aneh, terlalu ramai"
  },
  "layout_media_sosial_global": {
    "pojok_kiri_atas": "Overlay kotak berwarna biru berisi nomor slide (format 'X/${slideCount}'), sesuaikan angka per slide.",
    "pojok_kanan_atas": "Overlay warna konsisten berisi teks ajakan follow: 'Jangan lupa follow!'.",
    "tengah_atas_footer": "Ikon atau teks navigasi swipe ('Swipe right' / panah kanan) untuk ajak audiens geser slide.",
    "footer_bawah": "Terpusat, minimalis, tanpa label teks pengantar (ikon langsung diikuti teks):\\n- Ikon Instagram + \\"arif_ex21\\"\\n- Ikon Web/Globe + \\"https://www.inka.my.id/\\"\\n- Ikon GitHub + \\"github.com/dresar\\""
  },
  "daftar_slide": [
${daftarSlideSkeleton}
  ]
}

PASTIKAN MENGHASILKAN HANYA 1 OBJEK JSON MURNI TANPA TEKS LAIN SEBELUM DAN SESUDAHNYA. JANGAN MENGGUNAKAN MARKDOWN \`\`\`json. LENGKAPI SELURUH ${slideCount} ISI ARRAY DAFTAR_SLIDE.`;
    const resultJson = await callGroqApiWithRotation(singleGroqPrompt);
    let cleanedJson = resultJson.replace(/```json/gi, "").replace(/```/g, "").trim();
    const jsonMatch = cleanedJson.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        if (!parsed.gaya_visual_global) parsed.gaya_visual_global = {};
        if (!parsed.gaya_visual_global.palet_warna) {
          parsed.gaya_visual_global.palet_warna = {
            dasar_netral: ["Off-White (#FAFAFA)", "Charcoal Gray (#4B5563)", bgLabel],
            aksen: []
          };
        }
        const baseColors = parsed.gaya_visual_global.palet_warna.dasar_netral || [];
        if (!baseColors.some((c) => c.toLowerCase().includes(bgLabel.toLowerCase()))) {
          baseColors.unshift(bgLabel);
          parsed.gaya_visual_global.palet_warna.dasar_netral = baseColors;
        }
        generatedPrompt = JSON.stringify(parsed, null, 2);
      } catch (parseErr) {
        console.warn("JSON parsing failed, saving raw prompt result:", parseErr);
        generatedPrompt = jsonMatch[0];
      }
    } else {
      generatedPrompt = cleanedJson;
    }
  } catch (err) {
    console.error("Core generation logic error, compiling fallback:", err);
    generatedPrompt = buildPromptFallback(aiTitle, contentType, slideCount, designStyle, targetAudience);
  }
  let instagramCaption = "";
  let tiktokCaption = "";
  let hashtags = "";
  if (shouldGenerateCaption) {
    try {
      const captions = await generateSocialCaptions(
        aiTitle,
        contentType,
        targetAudience,
        designStyle,
        isPromotional,
        stylePromptText
      );
      instagramCaption = captions.instagramCaption;
      tiktokCaption = captions.tiktokCaption;
      hashtags = captions.hashtags;
    } catch (captionErr) {
      console.warn("Caption generation failed:", captionErr);
    }
  }
  const historyId = (0, import_uuid3.v4)();
  try {
    await query(
      `INSERT INTO prompt_histories (id, userId, title, contentType, slideCount, designStyle, targetAudience, language, generatedPrompt, imageOrientation, instagramCaption, tiktokCaption, hashtags, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'ID', ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        historyId,
        userId,
        aiTitle,
        contentType,
        slideCount,
        designStyle,
        targetAudience,
        generatedPrompt,
        imageOrientation || "Persegi (Square 1:1)",
        instagramCaption,
        tiktokCaption,
        hashtags
      ]
    );
    await query(
      "INSERT INTO activity_logs (id, userId, action, metadata, createdAt) VALUES (?, ?, ?, ?, NOW())",
      [(0, import_uuid3.v4)(), userId, "PROMPT_GENERATED", JSON.stringify({ historyId })]
    );
    return res.status(201).json({
      id: historyId,
      userId,
      title: aiTitle,
      contentType,
      slideCount,
      designStyle,
      targetAudience,
      language: "ID",
      generatedPrompt,
      imageOrientation: imageOrientation || "Persegi (Square 1:1)",
      instagramCaption,
      tiktokCaption,
      hashtags,
      imageUrl: null,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      isFavorite: false
    });
  } catch (error) {
    console.error("Save prompt history error:", error);
    return res.status(500).json({ message: "Server error: " + (error.message || error.toString()) });
  }
};

// src/controllers/prompt/adController.ts
var import_uuid4 = require("uuid");
var generateAdPrompt = async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  const {
    title,
    contentType,
    slideCount,
    designStyle,
    targetAudience,
    imageOrientation,
    includeCaption,
    sourceImageUrl,
    description,
    brand,
    price,
    sellingPoints,
    cta,
    characterId,
    useCharacter
  } = req.body;
  if (!description || !slideCount || !designStyle || !targetAudience) {
    return res.status(400).json({ message: "Missing required parameters. Deskripsi produk wajib diisi." });
  }
  const orientationSpec = getOrientationSpec(imageOrientation || "potret");
  const shouldGenerateCaption = includeCaption !== false && includeCaption !== "false";
  let characterPromptText = "";
  let characterName = "";
  const shouldAddCharacter = useCharacter === true || useCharacter === "true";
  if (shouldAddCharacter && characterId) {
    try {
      const charRows = await query("SELECT name, prompt FROM characters WHERE id = ?", [characterId]);
      if (charRows.rows && charRows.rows.length > 0) {
        characterName = charRows.rows[0].name;
        characterPromptText = charRows.rows[0].prompt || "";
      }
    } catch (charErr) {
      console.warn("Failed to fetch character from DB in adController:", charErr);
    }
  }
  let imageUrls = [];
  if (Array.isArray(sourceImageUrl)) {
    imageUrls = sourceImageUrl.filter((url) => url && typeof url === "string" && url.trim().length > 0);
  } else if (typeof sourceImageUrl === "string" && sourceImageUrl.trim().length > 0) {
    imageUrls = sourceImageUrl.split(",").map((url) => url.trim()).filter((url) => url.length > 0);
  }
  let analysisResult = "";
  if (imageUrls.length > 0) {
    const visionContent = [
      {
        type: "text",
        text: `Kamu adalah asisten AI ahli riset produk dan pemasaran affiliate.
Analisis gambar produk skincare/produk kecantikan/produk fisik lainnya yang diberikan di bawah ini.
User mengunggah ${imageUrls.length} gambar produk untuk referensi analisis Anda. Analisis seluruh produk ini secara detail.
1. Identifikasi produk tersebut: Apa nama mereknya, nama produknya, dan jenis produknya (misal: serum wajah, toner, pembersih wajah).
2. Lakukan riset virtual (simulasi pencarian internet): Sebutkan bahan-bahan utama produk ini, manfaat utama produk ini bagi kulit/pengguna, dan masalah apa saja yang diselesaikannya.
3. Berikan saran promosi: Siapa target audiens ideal untuk produk ini, apa keunggulan unik (Unique Selling Point) yang bisa ditonjolkan dalam iklan?

Jika ada teks atau deskripsi tambahan dari user: "${description || ""}", gabungkan informasi tersebut dalam analisis.
Tulis analisis produk yang rapi, padat, dan informatif.`
      }
    ];
    for (const url of imageUrls) {
      visionContent.push({
        type: "image_url",
        image_url: {
          url
        }
      });
    }
    const analysisPrompt = [
      {
        role: "user",
        content: visionContent
      }
    ];
    try {
      analysisResult = await callGroqVisionApiWithRotation(analysisPrompt, "llama-4-scout-17b-16e-instruct");
    } catch (e) {
      console.error("Gagal analisis gambar via vision model, menggunakan text fallback:", e);
      const textPrompt = `Kamu adalah asisten AI ahli riset produk dan pemasaran affiliate.
Riset produk berikut berdasarkan deskripsi: "${description || "Skincare/Produk Affiliate"}"
1. Sebutkan nama merek/produknya.
2. Jelaskan bahan-bahan utama, manfaat bagi pengguna, dan masalah yang diselesaikan.
3. Berikan saran promosi: target audiens ideal, dan keunggulan unik (Unique Selling Point) yang bisa ditonjolkan.
Tulis analisis produk yang rapi, padat, dan informatif.`;
      try {
        analysisResult = await callGroqApiWithRotation(textPrompt);
      } catch (_) {
        analysisResult = `Produk teridentifikasi berdasarkan input deskripsi user: ${description || "Produk Iklan Affiliate"}.`;
      }
    }
  } else {
    const textPrompt = `Kamu adalah asisten AI ahli riset produk dan pemasaran affiliate.
Riset produk berikut berdasarkan deskripsi: "${description || "Skincare/Produk Affiliate"}"
1. Sebutkan nama merek/produknya.
2. Jelaskan bahan-bahan utama, manfaat bagi pengguna, dan masalah yang diselesaikan.
3. Berikan saran promosi: target audiens ideal, dan keunggulan unik (Unique Selling Point) yang bisa ditonjolkan.
Tulis analisis produk yang rapi, padat, dan informatif.`;
    try {
      analysisResult = await callGroqApiWithRotation(textPrompt);
    } catch (_) {
      analysisResult = `Produk teridentifikasi berdasarkan input deskripsi user: ${description || "Produk Iklan Affiliate"}.`;
    }
  }
  let contextKreatif = `
Hasil Riset/Analisis Produk: ${analysisResult}
`;
  if (brand) contextKreatif += `Merek Produk: ${brand}
`;
  if (price) contextKreatif += `Harga Promo: ${price}
`;
  if (sellingPoints) contextKreatif += `Keunggulan Utama (USP): ${sellingPoints}
`;
  if (cta) contextKreatif += `Kustom Call to Action (CTA): ${cta}
`;
  let aiTitle = title || "";
  if (!aiTitle) {
    try {
      const titlePrompt = `Kamu adalah Copywriter profesional. Buatlah judul iklan ringkas (maks 5 kata) yang merangkum deskripsi produk: "${description.substring(0, 100)}". LANGSUNG berikan hasil judulnya saja, tanpa tanda kutip, tanpa awalan/akhiran.`;
      const summarizedTitle = await callGroqApiWithRotation(titlePrompt);
      if (summarizedTitle && summarizedTitle.trim().length > 0) {
        aiTitle = summarizedTitle.trim().replace(/^"|"$/g, "").trim();
      }
    } catch (e) {
      aiTitle = brand || "Produk Affiliate";
    }
  }
  let generatedPrompt = "";
  let stylePromptText = "";
  const isPromotional = true;
  const mandatoryRules = getMandatoryRules(isPromotional, orientationSpec);
  const terminology = getTerminologyGlossary(isPromotional);
  const audienceInstruction = getAudienceInstruction(targetAudience);
  try {
    stylePromptText = await getStylePromptText(designStyle);
    const setupInstruction = `Kamu adalah Senior Graphic Designer dan Copywriter profesional yang sangat ahli dalam kombinasi warna, estetika visual, tata letak, dan desain promosi media sosial.
Topik Iklan: "${aiTitle}" | Merek: ${brand || "-"} | Audiens: ${targetAudience}
Gaya Desain: ${designStyle}
Orientasi: ${orientationSpec.spec}

Context Produk: ${contextKreatif}

${mandatoryRules}

Tugas: Buatlah SATU paragraf pendek "Konsep Objek Latar" yang menggambarkan elemen/objek apa saja yang sebaiknya ada di latar belakang gambar promosi produk ini agar terkesan premium, mewah, dan konsisten di semua slide.
INGAT: JANGAN tentukan gaya desain atau warna (karena sudah kami tentukan sendiri). Fokus HANYA pada objek visual atau layout pendukung yang konsisten di semua slide.
Berikan HANYA paragraf konsep objek visualnya, tanpa teks lain.`;
    let mainVisualConcept = "";
    try {
      mainVisualConcept = await callGroqApiWithRotation(setupInstruction);
    } catch (e) {
      mainVisualConcept = `Latar produk premium, bersih, minimalis modern, berkelas.${stylePromptText ? " " + stylePromptText : ""}`;
    }
    const finalPromptParts = [];
    const previousSlideContentSummaries = [];
    const previousSlideVisualSummaries = [];
    for (let i = 1; i <= slideCount; i++) {
      let slideRole = "";
      let contentInstruction = "";
      if (i === 1) {
        slideRole = "HOOK UTAMA & COVER PRODUK (Slide 1)";
        contentInstruction = `Buat teks slide jualan penarik perhatian (Slide 1):
[HEADLINE FITUR] (1 kalimat pendek, bold, maks 8 kata, penarik perhatian utama yang sangat menggoda tentang manfaat produk/solusi instan. Jangan sebut kata "Cover".)
[PENJELASAN SINGKAT] (1 kalimat pendek pendukung rasa ingin tahu pembaca tentang produk ini)
[BUKTI/KLAIM] (Abaikan atau kosongkan)
[DETAIL TAMBAHAN] (Abaikan atau kosongkan)
[VISUAL PENDUKUNG]: Deskripsikan visual slide cover utama: Tampilkan produk secara elegan di tengah dengan backdrop mewah.`;
      } else if (i === slideCount) {
        slideRole = "CALL TO ACTION & PENUTUP PROMOSI (Slide Akhir)";
        contentInstruction = `Buat teks slide penutup iklan/pembelian (Slide Akhir):
[HEADLINE FITUR] (1 kalimat tegas ajakan bertindak/CTA, maks 8 kata, misal: "Dapatkan Sekarang!" atau "Jangan Sampai Kehabisan!")
[PENJELASAN SINGKAT] (1 kalimat instruksi pembelian: ${cta || "Klik link di bio atau DM untuk order"})
[BUKTI/KLAIM] (Garansi kepuasan atau jaminan keaslian produk)
[DETAIL TAMBAHAN] (Harga promo jika ada: ${price || "Harga spesial terbatas!"})
[VISUAL PENDUKUNG]: Deskripsikan visual penutup: ilustrasi kemudahan transaksi atau tombol CTA kontras.`;
      } else {
        slideRole = `MANFAAT/KEUNGGULAN PRODUK #${i - 1} (Slide ${i})`;
        contentInstruction = `Buat teks slide isi fitur/manfaat produk yang persuasif:
[HEADLINE FITUR] (1 kalimat bold tentang keunggulan/manfaat spesifik produk, maks 8 kata)
[PENJELASAN SINGKAT] (2-3 kalimat penjelasan mengapa manfaat ini penting berdasarkan analisis produk atau bahan aktif, maks 40 kata total)
[BUKTI/KLAIM] (2 kalimat berisi klaim nyata, manfaat, atau review dari riset, maks 30 kata)
[DETAIL TAMBAHAN] (1-2 kalimat detail ekstra, info harga jika relevan, atau spesifikasi, maks 25 kata)
[VISUAL PENDUKUNG]: Deskripsikan elemen visual / produk / scene pendukung yang relevan dengan manfaat ini (bukan gaya desain, tapi ISI gambarnya \u2014 misal: botol skincare di atas batu marmer, dll)`;
      }
      let antiDuplikatKontenSection = "";
      if (previousSlideContentSummaries.length > 0) {
        antiDuplikatKontenSection = `
=== PERINGATAN ANTI-DUPLIKAT KONTEN ===
Slide sebelumnya sudah membahas:
${previousSlideContentSummaries.map((s, idx) => `  - Slide ${idx + 1}: ${s}`).join("\n")}
DILARANG mengulang poin di atas. Slide ${i} harus membahas aspek baru.`;
      }
      let antiDuplikatVisualSection = "";
      if (previousSlideVisualSummaries.length > 0) {
        antiDuplikatVisualSection = `
=== PERINGATAN ANTI-DUPLIKAT VISUAL ===
Slide sebelumnya sudah menggunakan visual:
${previousSlideVisualSummaries.map((s, idx) => `  - Slide ${idx + 1}: ${s}`).join("\n")}
DILARANG mengulang visual di atas. Buat deskripsi visual slide ${i} yang unik.`;
      }
      let characterInstruction = "";
      if (shouldAddCharacter && characterPromptText) {
        characterInstruction = `
=== ATURAN KARAKTER (WAJIB KONSISTEN) ===
Kamu WAJIB menyertakan karakter berikut di dalam deskripsi visual slide ${i} ini:
- Nama Karakter: "${characterName}"
- Deskripsi Visual Karakter (Wajib ditulis di setiap visual slide agar konsisten): "${characterPromptText}"
- Posisi & Gerakan: Silakan tentukan pose/gerakan karakter yang bervariasi di slide ${i} ini secara logis (misal: memegang produk, menunjuk ke produk, tersenyum menyapa konsumen, dsb).
- Konsistensi: Pastikan warna baju, gaya rambut, aksesoris, dan ciri fisik karakter konsisten dengan slide lainnya.`;
      } else {
        characterInstruction = `
=== ATURAN KARAKTER (DILARANG ADA KARAKTER) ===
- DILARANG keras menyertakan karakter manusia, maskot, avatar, atau orang di dalam deskripsi visual slide ${i} ini.
- Visual harus murni produk, background dekoratif, atau elemen grafis/ilustrasi benda mati yang relevan dengan promosi.`;
      }
      const promptInstruction = `Kamu adalah Senior Graphic Designer dan Copywriter profesional.
Buat data untuk SLIDE ${i} dari ${slideCount} slide iklan.
Peran slide: ${slideRole}
Topik Iklan: "${aiTitle}" | Merek: ${brand || "-"} | Harga: ${price || "-"} | Audiens: ${targetAudience}

${mandatoryRules}
${terminology}
${audienceInstruction}

Orientasi wajib: ${orientationSpec.spec}
Gaya Desain: ${designStyle}

Konsep Objek Latar (konsisten):
"${mainVisualConcept}"
${antiDuplikatKontenSection}
${antiDuplikatVisualSection}
${characterInstruction}

=== INSTRUKSI KONTEN PROMOSI SLIDE ${i} ===
${contentInstruction}

=== FORMAT OUTPUT WAJIB: JSON ===
Kamu WAJIB mengembalikan output dalam format JSON murni. JANGAN ada teks, penjelasan, atau markdown apapun di luar JSON. Mulai langsung dengan { dan akhiri dengan }.

Gunakan format JSON PERSIS seperti ini:
{
  "slideNumber": ${i},
  "totalSlides": ${slideCount},
  "role": "${slideRole}",
  "content": {
    "headline": "[Judul poin \u2014 maks 8 kata]",
    "subtext": "[Pembuka penjelasan \u2014 1-2 kalimat santai]",
    "detail": "[Penjelasan utama lengkap \u2014 3-5 kalimat persuasif]",
    "microTip": "[Tips praktis/insight singkat]"
  },
  "imagePrompt": {
    "visual": "[Deskripsi detail visual slide ini]",
    "visualSummary": "[Ringkasan visual 1 kalimat]",
    "contentSummary": "[Ringkasan konten 1 kalimat]",
    "negativePrompt": "[Negative prompt standard]"
  }
}`;
      const mediaSosialAturan = `Tambahkan layout visual dan teks detail berikut pada gambar secara profesional:
- Di pojok kiri atas gambar, tampilkan teks nomor halaman/slide: "${i}/${slideCount}".
- Di pojok kanan atas gambar, tampilkan teks ajakan follow: "Jangan lupa follow!".
- Di tengah, tepat di atas footer, tambahkan ikon atau teks navigasi swipe.
- Di bagian footer paling bawah gambar secara terpusat/minimalis, tampilkan nama merek "${brand || "Affiliate"}" & info produk.`;
      try {
        const slideResult = await callGroqApiWithRotation(promptInstruction);
        let parsed = null;
        if (slideResult) {
          const jsonMatch = slideResult.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            try {
              parsed = JSON.parse(jsonMatch[0]);
            } catch (parseErr) {
              console.warn(`Slide ${i} JSON parse error:`, parseErr);
            }
          }
        }
        const slideOutput = formatSlideOutput({
          slideNumber: parsed?.slideNumber ?? i,
          totalSlides: parsed?.totalSlides ?? slideCount,
          role: parsed?.role ?? slideRole,
          designStyleName: designStyle,
          orientationSpec,
          stylePromptText,
          visualContent: parsed?.imagePrompt?.visual ?? (slideResult ? slideResult.trim().substring(0, 300) : `Visual pendukung Slide ${i} untuk ${aiTitle}`),
          negativePrompt: parsed?.imagePrompt?.negativePrompt ?? "low quality, blurry, pixelated, noisy image, cluttered, low contrast",
          headline: parsed?.content?.headline ?? (i === 1 ? aiTitle : `Slide ${i}: Poin penting`),
          subtext: parsed?.content?.subtext ?? "",
          detail: parsed?.content?.detail ?? "",
          microTip: parsed?.content?.microTip ?? "",
          isPromotional,
          targetAudience,
          mandatoryRules,
          mediaSosialAturan
        });
        const contentSummary = parsed?.imagePrompt?.contentSummary || slideOutput.teks_dalam_gambar.headline.substring(0, 100);
        const visualSummary = parsed?.imagePrompt?.visualSummary || slideOutput.deskripsi_visual.objek_dan_konteks.substring(0, 120);
        previousSlideContentSummaries.push(contentSummary);
        previousSlideVisualSummaries.push(visualSummary);
        finalPromptParts.push(JSON.stringify(slideOutput));
      } catch (e) {
        console.error(`Slide ${i} generation failed, using fallback:`, e);
        const errorSlide = formatSlideOutput({
          slideNumber: i,
          totalSlides: slideCount,
          role: slideRole,
          designStyleName: designStyle,
          orientationSpec,
          stylePromptText,
          visualContent: `Visual pendukung Slide ${i} untuk ${aiTitle}`,
          negativePrompt: "low quality, blurry, pixelated, noisy image, cluttered, low contrast",
          headline: i === 1 ? aiTitle : `Slide ${i}: Poin penting`,
          subtext: "",
          detail: "",
          microTip: "",
          isPromotional,
          targetAudience,
          mandatoryRules,
          mediaSosialAturan
        });
        previousSlideContentSummaries.push(`Slide ${i}: ${slideRole}`);
        previousSlideVisualSummaries.push(`${slideRole} visual`);
        finalPromptParts.push(JSON.stringify(errorSlide));
      }
    }
    const styleName = designStyle.split("|")[0].trim();
    const styleAttributes = getStyleAttributes(styleName, stylePromptText);
    const fullCarouselObject = {
      aturan_global: {
        platform_target: "Instagram Carousel Post",
        peran: "Kamu adalah Senior Graphic Designer & Art Director yang mengetahui kombinasi warna, tipografi, dan estetika visual premium.",
        target_audiens: targetAudience,
        jenis_konten: contentType || "Iklan Produk",
        larangan: "DILARANG KERAS memodifikasi produk asli atau mengubah warna brand."
      },
      gaya_visual_global: {
        gaya_dominan: styleAttributes.gaya_dominan,
        gaya_visual_wajib: styleAttributes.gaya_visual_wajib,
        layout_dan_hierarki: styleAttributes.layout_dan_hierarki,
        elemen_pendukung: styleAttributes.elemen_infografis_pendukung,
        palet_warna: styleAttributes.palet_warna,
        tipografi: styleAttributes.tipografi,
        pencahayaan_kamera: styleAttributes.pencahayaan_dan_kamera,
        kedalaman_visual: styleAttributes.kedalaman_visual,
        dimensi_canvas: `Canvas ${orientationSpec.widthHint}px, Aspect Ratio ${orientationSpec.ratio} (--ar ${orientationSpec.ratio})`,
        negative_prompt: "low quality, blurry, pixelated, noisy, cluttered, low contrast, text errors, watermark"
      },
      layout_media_sosial_global: {
        footer_bawah: `Instagram & TikTok Watermark`
      },
      daftar_slide: finalPromptParts.map((p) => {
        try {
          return JSON.parse(p);
        } catch (_) {
          return p;
        }
      })
    };
    generatedPrompt = JSON.stringify(fullCarouselObject);
  } catch (err) {
    console.error("Ad prompt generation error:", err);
    generatedPrompt = buildPromptFallback(aiTitle, contentType || "Iklan Produk", slideCount, designStyle, targetAudience);
  }
  let instagramCaption = "";
  let tiktokCaption = "";
  let hashtags = "";
  if (shouldGenerateCaption) {
    try {
      const captions = await generateSocialCaptions(
        aiTitle,
        contentType || "Iklan Produk",
        targetAudience,
        designStyle,
        isPromotional,
        stylePromptText
      );
      instagramCaption = captions.instagramCaption;
      tiktokCaption = captions.tiktokCaption;
      hashtags = captions.hashtags;
    } catch (captionErr) {
      console.warn("Caption generation failed:", captionErr);
    }
  }
  const historyId = (0, import_uuid4.v4)();
  try {
    await query(
      `INSERT INTO prompt_histories (id, userId, title, contentType, slideCount, designStyle, targetAudience, language, generatedPrompt, imageOrientation, instagramCaption, tiktokCaption, hashtags, sourceImageUrl, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'ID', ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        historyId,
        userId,
        aiTitle,
        contentType || "Iklan Produk",
        slideCount,
        designStyle,
        targetAudience,
        generatedPrompt,
        imageOrientation || "Persegi (Square 1:1)",
        instagramCaption,
        tiktokCaption,
        hashtags,
        imageUrls.length > 0 ? imageUrls.join(",") : null
      ]
    );
    await query(
      "INSERT INTO activity_logs (id, userId, action, metadata, createdAt) VALUES (?, ?, ?, ?, NOW())",
      [(0, import_uuid4.v4)(), userId, "PROMPT_GENERATED", JSON.stringify({ historyId, isAd: true })]
    );
    return res.status(201).json({
      id: historyId,
      userId,
      title: aiTitle,
      contentType: contentType || "Iklan Produk",
      slideCount,
      designStyle,
      targetAudience,
      language: "ID",
      generatedPrompt,
      imageOrientation: imageOrientation || "Persegi (Square 1:1)",
      instagramCaption,
      tiktokCaption,
      hashtags,
      imageUrl: null,
      sourceImageUrl: imageUrls.length > 0 ? imageUrls.join(",") : null,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      isFavorite: false
    });
  } catch (error) {
    console.error("Save ad prompt history error:", error);
    return res.status(500).json({ message: "Server error: " + (error.message || error.toString()) });
  }
};

// src/controllers/prompt/historyController.ts
var import_uuid5 = require("uuid");
var getPromptHistory = async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  const page = parseInt(req.query.page || "1", 10) || 1;
  const limit = parseInt(req.query.limit || "10", 10) || 10;
  const offset = (page - 1) * limit;
  const contentTypeFilter = req.query.contentType;
  try {
    let whereClause = "WHERE ph.userId = ?";
    const queryParams = [userId, userId];
    if (contentTypeFilter && contentTypeFilter !== "Semua" && contentTypeFilter.trim() !== "") {
      whereClause += " AND ph.contentType = ?";
      queryParams.splice(1, 0, contentTypeFilter);
      queryParams[0] = userId;
      queryParams[1] = contentTypeFilter;
      queryParams[2] = userId;
    }
    const selectSql = contentTypeFilter && contentTypeFilter !== "Semua" && contentTypeFilter.trim() !== "" ? `SELECT ph.id, ph.userId, ph.title, ph.contentType, ph.slideCount,
              ph.designStyle, ph.targetAudience, ph.language, ph.generatedPrompt,
              ph.imageOrientation, ph.instagramCaption, ph.tiktokCaption, ph.hashtags,
              ph.createdAt, ph.updatedAt, ph.imageUrl, ph.sourceImageUrl,
              fp.id AS favorite_id
       FROM prompt_histories ph
       LEFT JOIN favorite_prompts fp ON fp.promptHistoryId = ph.id AND fp.userId = ?
       WHERE ph.userId = ? AND ph.contentType = ?
       ORDER BY ph.createdAt DESC, ph.id DESC
       LIMIT ${limit} OFFSET ${offset}` : `SELECT ph.id, ph.userId, ph.title, ph.contentType, ph.slideCount,
              ph.designStyle, ph.targetAudience, ph.language, ph.generatedPrompt,
              ph.imageOrientation, ph.instagramCaption, ph.tiktokCaption, ph.hashtags,
              ph.createdAt, ph.updatedAt, ph.imageUrl, ph.sourceImageUrl,
              fp.id AS favorite_id
       FROM prompt_histories ph
       LEFT JOIN favorite_prompts fp ON fp.promptHistoryId = ph.id AND fp.userId = ?
       WHERE ph.userId = ?
       ORDER BY ph.createdAt DESC, ph.id DESC
       LIMIT ${limit} OFFSET ${offset}`;
    const selectParams = contentTypeFilter && contentTypeFilter !== "Semua" && contentTypeFilter.trim() !== "" ? [userId, userId, contentTypeFilter] : [userId, userId];
    const result = await query(selectSql, selectParams);
    const countSql = contentTypeFilter && contentTypeFilter !== "Semua" && contentTypeFilter.trim() !== "" ? "SELECT COUNT(*) AS count FROM prompt_histories WHERE userId = ? AND contentType = ?" : "SELECT COUNT(*) AS count FROM prompt_histories WHERE userId = ?";
    const countParams = contentTypeFilter && contentTypeFilter !== "Semua" && contentTypeFilter.trim() !== "" ? [userId, contentTypeFilter] : [userId];
    const countResult = await query(countSql, countParams);
    const total = parseInt(countResult.rows[0].count, 10) || 0;
    const histories = result.rows.map((row) => ({
      id: row.id,
      userId: row.userId,
      title: row.title,
      contentType: row.contentType,
      slideCount: row.slideCount || 1,
      designStyle: row.designStyle,
      targetAudience: row.targetAudience,
      language: row.language || "ID",
      generatedPrompt: row.generatedPrompt,
      imageOrientation: row.imageOrientation || "Persegi (Square 1:1)",
      instagramCaption: row.instagramCaption || "",
      tiktokCaption: row.tiktokCaption || "",
      hashtags: row.hashtags || "",
      imageUrl: row.imageUrl || null,
      sourceImageUrl: row.sourceImageUrl || null,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      isFavorite: row.favorite_id !== null
    }));
    return res.json({
      histories,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("getPromptHistory error:", error);
    return res.status(500).json({ message: "Server error: " + (error.message || error.toString()) });
  }
};
var getPromptHistoryById = async (req, res) => {
  const userId = req.user?.userId;
  const { id } = req.params;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  try {
    const result = await query(
      `SELECT ph.id, ph.userId, ph.title, ph.contentType, ph.slideCount,
              ph.designStyle, ph.targetAudience, ph.language, ph.generatedPrompt,
              ph.imageOrientation, ph.instagramCaption, ph.tiktokCaption, ph.hashtags,
              ph.createdAt, ph.updatedAt, ph.imageUrl, ph.sourceImageUrl, fp.id AS favorite_id
       FROM prompt_histories ph
       LEFT JOIN favorite_prompts fp ON fp.promptHistoryId = ph.id AND fp.userId = ?
       WHERE ph.id = ? AND ph.userId = ?`,
      [userId, id, userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Prompt history tidak ditemukan." });
    }
    const row = result.rows[0];
    return res.json({
      id: row.id,
      userId: row.userId,
      title: row.title,
      contentType: row.contentType,
      slideCount: row.slideCount || 1,
      designStyle: row.designStyle,
      targetAudience: row.targetAudience,
      language: row.language || "ID",
      generatedPrompt: row.generatedPrompt,
      imageOrientation: row.imageOrientation || "Persegi (Square 1:1)",
      instagramCaption: row.instagramCaption || "",
      tiktokCaption: row.tiktokCaption || "",
      hashtags: row.hashtags || "",
      imageUrl: row.imageUrl || null,
      sourceImageUrl: row.sourceImageUrl || null,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      isFavorite: row.favorite_id !== null
    });
  } catch (error) {
    console.error("getPromptHistoryById error:", error);
    return res.status(500).json({ message: "Server error: " + (error.message || error.toString()) });
  }
};
var deletePromptHistory = async (req, res) => {
  const userId = req.user?.userId;
  const { id } = req.params;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  try {
    const check = await query(
      "SELECT id FROM prompt_histories WHERE id = ? AND userId = ?",
      [id, userId]
    );
    if (check.rows.length === 0) {
      return res.status(404).json({ message: "Prompt history tidak ditemukan." });
    }
    await query("DELETE FROM favorite_prompts WHERE promptHistoryId = ?", [id]);
    await query("DELETE FROM prompt_histories WHERE id = ?", [id]);
    return res.json({ message: "Prompt history berhasil dihapus." });
  } catch (error) {
    console.error("deletePromptHistory error:", error);
    return res.status(500).json({ message: "Server error: " + (error.message || error.toString()) });
  }
};
var getFavoritePrompts = async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  const page = parseInt(req.query.page || "1", 10) || 1;
  const limit = parseInt(req.query.limit || "10", 10) || 10;
  const offset = (page - 1) * limit;
  try {
    const result = await query(
      `SELECT fp.id AS fav_id, fp.userId AS fav_userId, fp.promptHistoryId AS fav_historyId, fp.createdAt AS fav_createdAt,
              ph.id, ph.userId, ph.title, ph.contentType, ph.slideCount,
              ph.designStyle, ph.targetAudience, ph.language, ph.generatedPrompt,
              ph.imageOrientation, ph.instagramCaption, ph.tiktokCaption, ph.hashtags,
              ph.imageUrl, ph.sourceImageUrl,
              ph.createdAt AS ph_createdAt, ph.updatedAt AS ph_updatedAt
       FROM favorite_prompts fp
       JOIN prompt_histories ph ON ph.id = fp.promptHistoryId
       WHERE fp.userId = ?
       ORDER BY fp.createdAt DESC, ph.id DESC
       LIMIT ${limit} OFFSET ${offset}`,
      [userId]
    );
    const countResult = await query(
      "SELECT COUNT(*) AS count FROM favorite_prompts WHERE userId = ?",
      [userId]
    );
    const total = parseInt(countResult.rows[0].count, 10) || 0;
    const favorites = result.rows.map((row) => ({
      id: row.fav_id,
      userId: row.fav_userId,
      promptHistoryId: row.fav_historyId,
      createdAt: row.fav_createdAt,
      promptHistory: {
        id: row.id,
        userId: row.userId,
        title: row.title,
        contentType: row.contentType,
        slideCount: row.slideCount || 1,
        designStyle: row.designStyle,
        targetAudience: row.targetAudience,
        language: row.language || "ID",
        generatedPrompt: row.generatedPrompt,
        imageOrientation: row.imageOrientation || "Persegi (Square 1:1)",
        instagramCaption: row.instagramCaption || "",
        tiktokCaption: row.tiktokCaption || "",
        hashtags: row.hashtags || "",
        imageUrl: row.imageUrl || null,
        sourceImageUrl: row.sourceImageUrl || null,
        createdAt: row.ph_createdAt,
        updatedAt: row.ph_updatedAt,
        isFavorite: true
      }
    }));
    return res.json({
      favorites,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("getFavoritePrompts error:", error);
    return res.status(500).json({ message: "Server error: " + (error.message || error.toString()) });
  }
};
var addFavorite = async (req, res) => {
  const userId = req.user?.userId;
  const { id: promptHistoryId } = req.params;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  try {
    const checkHist = await query(
      "SELECT id FROM prompt_histories WHERE id = ? AND userId = ?",
      [promptHistoryId, userId]
    );
    if (checkHist.rows.length === 0) {
      return res.status(404).json({ message: "Prompt history tidak ditemukan." });
    }
    const checkFav = await query(
      "SELECT id FROM favorite_prompts WHERE promptHistoryId = ? AND userId = ?",
      [promptHistoryId, userId]
    );
    if (checkFav.rows.length > 0) {
      return res.status(409).json({ message: "Prompt sudah ada di favorites." });
    }
    const favoriteId = (0, import_uuid5.v4)();
    await query(
      "INSERT INTO favorite_prompts (id, userId, promptHistoryId, createdAt) VALUES (?, ?, ?, NOW())",
      [favoriteId, userId, promptHistoryId]
    );
    return res.status(201).json({
      id: favoriteId,
      userId,
      promptHistoryId,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch (error) {
    console.error("addFavorite error:", error);
    return res.status(500).json({ message: "Server error: " + (error.message || error.toString()) });
  }
};
var removeFavorite = async (req, res) => {
  const userId = req.user?.userId;
  const { id: promptHistoryId } = req.params;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  try {
    await query(
      "DELETE FROM favorite_prompts WHERE promptHistoryId = ? AND userId = ?",
      [promptHistoryId, userId]
    );
    return res.json({ message: "Prompt berhasil dihapus dari favorites." });
  } catch (error) {
    console.error("removeFavorite error:", error);
    return res.status(500).json({ message: "Server error: " + (error.message || error.toString()) });
  }
};
var updatePromptHistory = async (req, res) => {
  const { id } = req.params;
  const { title, imageUrl } = req.body;
  if (!title) {
    return res.status(400).json({ message: "Title diperlukan" });
  }
  try {
    const result = await query(
      "UPDATE prompt_histories SET title = ?, imageUrl = ?, updatedAt = NOW() WHERE id = ?",
      [title, imageUrl || null, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "History tidak ditemukan" });
    }
    return res.json({ message: "History berhasil diperbarui", id });
  } catch (error) {
    console.error("updatePromptHistory error:", error);
    return res.status(500).json({ message: "Server error: " + (error.message || error.toString()) });
  }
};
var getAllHistoryAdmin = async (req, res) => {
  try {
    const result = await query(
      `SELECT h.id, h.title, h.contentType, h.slideCount, h.designStyle, h.targetAudience, h.language,
              h.createdAt, h.updatedAt, h.imageUrl, h.sourceImageUrl, h.generatedPrompt,
              h.imageOrientation, h.instagramCaption, h.tiktokCaption, h.hashtags,
              u.name as userName, u.email as userEmail
       FROM prompt_histories h
       LEFT JOIN users u ON h.userId = u.id
       ORDER BY h.createdAt DESC, h.id DESC
       LIMIT 100`
    );
    return res.json(result.rows);
  } catch (error) {
    console.error("getAllHistoryAdmin error:", error);
    return res.status(500).json({ message: "Server error: " + (error.message || error.toString()) });
  }
};

// src/controllers/prompt/bannerController.ts
var import_uuid6 = require("uuid");
var getBannerLayoutSpec = (layout) => {
  const lower = layout.toLowerCase();
  if (lower.includes("3:1") || lower.includes("spanduk horizontal")) {
    return {
      ratio: "3:1",
      widthHint: "3000x1000",
      spec: "Spanduk Horizontal (3:1) \u2014 Canvas: 3000x1000px, Aspect Ratio: 3:1. Safe Area: Sisakan ruang sekitar 120\u2013150 px dari setiap sisi batas luar agar seluruh teks utama, penawaran, dan kontak aman dari potongan mesin cetak."
    };
  } else if (lower.includes("4:1") || lower.includes("spanduk panjang")) {
    return {
      ratio: "4:1",
      widthHint: "4000x1000",
      spec: "Spanduk Panjang (4:1) \u2014 Canvas: 4000x1000px, Aspect Ratio: 4:1. Safe Area: Sisakan ruang sekitar 120\u2013150 px dari setiap sisi batas luar agar seluruh teks utama, penawaran, dan kontak aman dari potongan mesin cetak."
    };
  } else if (lower.includes("2:3") || lower.includes("x-banner") || lower.includes("standing")) {
    return {
      ratio: "2:3",
      widthHint: "1200x1800",
      spec: "Vertical X-Banner (2:3) vertikal berdiri \u2014 Canvas: 1200x1800px, Aspect Ratio: 2:3. Safe Area: Sisakan ruang sekitar 100\u2013120 px dari sisi batas luar agar teks aman dari stand banner."
    };
  } else if (lower.includes("16:9") || lower.includes("billboard") || lower.includes("baliho")) {
    return {
      ratio: "16:9",
      widthHint: "1920x1080",
      spec: "Billboard Baliho Raksasa (16:9) \u2014 Canvas: 1920x1080px, Aspect Ratio: 16:9. Safe Area: Sisakan ruang sekitar 150\u2013200 px dari tepi agar terbaca dengan baik dari kejauhan."
    };
  } else {
    return {
      ratio: "1:1",
      widthHint: "1080x1080",
      spec: "Square Banner (1:1) persegi \u2014 Canvas: 1080x1080px, Aspect Ratio: 1:1. Safe Area: Sisakan ruang sekitar 80\u2013120 px dari setiap sisi batas luar."
    };
  }
};
var generateBannerPrompt = async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  const {
    title,
    // e.g. "Doorsmeer Auto Clean"
    contentType,
    // e.g. "Banner Spanduk"
    businessType,
    // e.g. "Doorsmeer Cuci Mobil"
    designStyle,
    // e.g. "Modern", "Retro", "Minimalis"
    description,
    // e.g. "Cuci hidrolik salju, poles bodi, free coffee"
    layoutSize,
    // e.g. "Spanduk Horizontal (3:1) - Canvas: 3000x1000px"
    contactInfo,
    // e.g. "Hubungi: 0812-3456-7890, IG: @doorsmeer.clean"
    includeCaption,
    sourceImageUrl
    // Reference image URL (from user upload)
  } = req.body;
  if (!title || !businessType || !description || !designStyle || !layoutSize) {
    return res.status(400).json({ message: "Missing required parameters. Semua input utama wajib diisi." });
  }
  const layoutSpec = getBannerLayoutSpec(layoutSize);
  const shouldGenerateCaption = includeCaption !== false && includeCaption !== "false";
  let imageUrls = [];
  if (Array.isArray(sourceImageUrl)) {
    imageUrls = sourceImageUrl.filter((url) => url && typeof url === "string" && url.trim().length > 0);
  } else if (typeof sourceImageUrl === "string" && sourceImageUrl.trim().length > 0) {
    imageUrls = sourceImageUrl.split(",").map((url) => url.trim()).filter((url) => url.length > 0);
  }
  let referenceAnalysis = "";
  if (imageUrls.length > 0) {
    const analysisPrompt = [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Kamu adalah asisten AI desainer grafis profesional ahli spanduk/banner promosi.
Analisis gambar referensi desain yang diunggah oleh user di bawah ini.
1. Identifikasi struktur tata letak (layout): letak judul, letak info kontak, pembagian area visual.
2. Identifikasi harmoni warna: warna latar belakang, warna teks, warna highlight.
3. Sebutkan kelebihan/estetika layout ini yang bisa ditiru agar spanduk baru terlihat profesional dan premium.
Tulis analisis desain singkat yang rapi.`
          },
          ...imageUrls.map((url) => ({
            type: "image_url",
            image_url: {
              url
            }
          }))
        ]
      }
    ];
    try {
      referenceAnalysis = await callGroqVisionApiWithRotation(analysisPrompt, "llama-4-scout-17b-16e-instruct");
    } catch (e) {
      console.error("Vision analysis on banner layout reference failed:", e);
      referenceAnalysis = "Gaya visual modern dengan penekanan pada teks headline besar dan ikon minimalis.";
    }
  }
  const stylePromptText = await getStylePromptText(designStyle);
  let finalSlide = null;
  let contextKreatif = `
Informasi Bisnis Banner:
- Nama Bisnis: ${title}
- Jenis Usaha: ${businessType}
- Detail & Layanan: ${description}
- Kontak/Lokasi: ${contactInfo || "-"}
`;
  if (referenceAnalysis) {
    contextKreatif += `- Hasil Analisis Gambar Referensi: ${referenceAnalysis}
`;
  }
  const promptInstruction = `Kamu adalah Senior Graphic Designer, Ahli Tipografi, dan Pembuat Spanduk Cetak Profesional.
Buat data desain untuk 1 BANNER/SPANDUK bisnis premium.
Nama Bisnis: "${title}" | Jenis Usaha: "${businessType}" | Detail: "${description}"

=== ATURAN WAJIB DESAIN BANNER (HARUS DIPATUHI 100%) ===
1. DIMENSI & ASPECT RATIO: Gunakan ukuran ${layoutSpec.spec}. Posisikan teks secara strategis agar tidak terpotong saat proses cetak dan finishing.
2. TATA LETAK & KETERBACAAN:
   - Nama Bisnis/Headline harus menjadi elemen TERBESAR (dominan) yang bisa dibaca jelas dari jarak 10-20 meter.
   - Posisikan Info Kontak di bagian bawah secara rapi dan profesional.
3. GAYA DESAIN: Ikuti gaya "${designStyle}". ${stylePromptText ? "Padukan dengan visual panduan: " + stylePromptText : ""}
4. KOSONGKAN teks penjelasan panjang. Spanduk media luar ruang harus ringkas dan langsung dipahami dalam 3 detik.
5. REFERENSI GAMBAR (PENTING):
   ${imageUrls.length > 0 ? `User telah mengunggah gambar referensi. Di dalam hasil akhir prompa gambar visual (visual prompt), kamu wajib menyisipkan kalimat ini secara persis: "Saya akan merekomendasikan gambar ini" untuk merujuk pada gambar referensi layout yang akan dikirim user ke ChatGPT Image.` : "Jika user ingin meniru gaya spanduk tertentu, beri rekomendasi ruang visual."}

=== FORMAT OUTPUT WAJIB: JSON ===
Kamu WAJIB mengembalikan output dalam format JSON murni. JANGAN ada teks, penjelasan, atau markdown apapun di luar JSON. Mulai langsung dengan { dan akhiri dengan }.

Gunakan format JSON PERSIS seperti ini:
{
  "headline": "[Nama Bisnis/Judul Banner Utama \u2014 bold, kontras tinggi, maks 6 kata]",
  "subtext": "[Sub-headline / Tagline promosi menarik \u2014 maks 8 kata]",
  "detail": "[Ringkasan Layanan/Poin Unggulan Singkat \u2014 pisahkan dengan tanda koma, maks 12 kata]",
  "contact": "[Informasi Alamat / Telepon / Medsos \u2014 maks 10 kata]",
  "imagePrompt": {
    "visual": "[Deskripsi detail visual utama yang harus digambar. Jelaskan komposisi spanduk secara lengkap, latar belakang, dan penempatan objek. ${imageUrls.length > 0 ? 'Sertakan kalimat wajib ini di akhir deskripsi visual: "Saya akan merekomendasikan gambar ini"' : ""}]",
    "negativePrompt": "[Negative prompt: watermark, blur, gambar pecah, teks tidak terbaca, typo]"
  }
}`;
  let generatedPrompt = "";
  try {
    const aiResult = await callGroqApiWithRotation(promptInstruction);
    if (aiResult) {
      const jsonMatch = aiResult.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          const buildVisualPrompt = (style, visual) => {
            let prompt = `[SPANDUK/BANNER DESAIN BLUEPRINT]
`;
            prompt += `[GAYA VISUAL]: ${style.trim()}
`;
            prompt += `[KOMPOSISI VISUAL]: ${visual.trim()}
`;
            prompt += `[DIMENSI CANVAS]: Canvas ${layoutSpec.widthHint}px, Aspect Ratio ${layoutSpec.ratio} (--ar ${layoutSpec.ratio})`;
            return prompt;
          };
          const slideOutput = formatSlideOutput({
            slideNumber: 1,
            totalSlides: 1,
            role: "BANNER UTAMA",
            designStyleName: designStyle,
            orientationSpec: {
              ratio: layoutSpec.ratio,
              widthHint: layoutSpec.widthHint,
              spec: layoutSpec.spec
            },
            stylePromptText,
            visualContent: parsed.imagePrompt?.visual ?? "",
            negativePrompt: parsed.imagePrompt?.negativePrompt ?? "low quality, blurry, pixelated, noisy image, cluttered, low contrast",
            headline: parsed.headline ?? title,
            subtext: parsed.subtext ?? "",
            detail: parsed.detail ?? description,
            microTip: parsed.contact ?? contactInfo ?? "",
            isPromotional: true,
            targetAudience: "Pelanggan Umum",
            mandatoryRules: `Gunakan ukuran layout ${layoutSpec.ratio}. Letakkan judul paling mencolok, detail layanan terstruktur di bagian tengah, dan info kontak di footer banner. Berikan safe area minimal 120-150px dari batas tepi agar tidak terpotong saat cetak spanduk.`,
            mediaSosialAturan: contactInfo ? `Tampilkan info kontak di bagian bawah banner secara rapi: ${contactInfo}` : ""
          });
          finalSlide = slideOutput;
        } catch (parseErr) {
          throw parseErr;
        }
      } else {
        throw new Error("No JSON bracket found");
      }
    } else {
      throw new Error("Empty response from Groq");
    }
  } catch (err) {
    console.error("Banner generator error, compiling fallback:", err);
    finalSlide = formatSlideOutput({
      slideNumber: 1,
      totalSlides: 1,
      role: "BANNER UTAMA",
      designStyleName: designStyle,
      orientationSpec: {
        ratio: layoutSpec.ratio,
        widthHint: layoutSpec.widthHint,
        spec: layoutSpec.spec
      },
      stylePromptText,
      visualContent: "Desain spanduk minimalis modern yang menonjolkan nama bisnis di tengah.",
      negativePrompt: "low quality, blurry, pixelated, noisy image, cluttered, low contrast",
      headline: title,
      subtext: "",
      detail: description,
      microTip: contactInfo || "",
      isPromotional: true,
      targetAudience: "Pelanggan Umum",
      mandatoryRules: `Gunakan ukuran layout ${layoutSpec.ratio}. Letakkan judul paling mencolok, detail layanan terstruktur di bagian tengah, dan info kontak di footer banner. Berikan safe area minimal 120-150px dari batas tepi agar tidak terpotong saat cetak spanduk.`,
      mediaSosialAturan: contactInfo ? `Tampilkan info kontak di bagian bawah banner secara rapi: ${contactInfo}` : ""
    });
  }
  const styleName = designStyle.split("|")[0].trim();
  const styleAttributes = getStyleAttributes(styleName, stylePromptText);
  const fullCarouselObject = {
    aturan_global: {
      platform_target: "Instagram Carousel Post",
      peran: "Kamu adalah Senior Graphic Designer & Art Director yang mengetahui kombinasi warna, tipografi, dan estetika visual premium.",
      target_audiens: "Pelanggan Umum",
      jenis_konten: "Banner Promosi",
      larangan: "DILARANG KERAS menggunakan foto berkualitas rendah atau melanggar safe area."
    },
    gaya_visual_global: {
      gaya_dominan: styleAttributes.gaya_dominan,
      gaya_visual_wajib: styleAttributes.gaya_visual_wajib,
      layout_dan_hierarki: styleAttributes.layout_dan_hierarki,
      elemen_pendukung: styleAttributes.elemen_infografis_pendukung,
      palet_warna: styleAttributes.palet_warna,
      tipografi: styleAttributes.tipografi,
      pencahayaan_kamera: styleAttributes.pencahayaan_dan_kamera,
      kedalaman_visual: styleAttributes.kedalaman_visual,
      dimensi_canvas: `Canvas ${layoutSpec.widthHint}px, Aspect Ratio ${layoutSpec.ratio} (--ar ${layoutSpec.ratio})`,
      negative_prompt: "low quality, blurry, pixelated, noisy image, cluttered, low contrast"
    },
    layout_media_sosial_global: {
      footer_bawah: contactInfo ? `Info Kontak: ${contactInfo}` : ""
    },
    daftar_slide: [finalSlide]
  };
  generatedPrompt = JSON.stringify(fullCarouselObject);
  let instagramCaption = "";
  let tiktokCaption = "";
  let hashtags = "";
  if (shouldGenerateCaption) {
    try {
      const captions = await generateSocialCaptions(
        title,
        "Banner Promosi",
        "Pelanggan Umum",
        designStyle,
        true,
        stylePromptText
      );
      instagramCaption = captions.instagramCaption;
      tiktokCaption = captions.tiktokCaption;
      hashtags = captions.hashtags;
    } catch (captionErr) {
      console.warn("Caption generation failed:", captionErr);
    }
  }
  const historyId = (0, import_uuid6.v4)();
  try {
    await query(
      `INSERT INTO prompt_histories (id, userId, title, contentType, slideCount, designStyle, targetAudience, language, generatedPrompt, imageOrientation, instagramCaption, tiktokCaption, hashtags, sourceImageUrl, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, 1, ?, 'Pelanggan Umum', 'ID', ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        historyId,
        userId,
        title,
        "Banner Promosi",
        designStyle,
        generatedPrompt,
        layoutSize,
        instagramCaption,
        tiktokCaption,
        hashtags,
        imageUrls.length > 0 ? imageUrls.join(",") : null
      ]
    );
    await query(
      "INSERT INTO activity_logs (id, userId, action, metadata, createdAt) VALUES (?, ?, ?, ?, NOW())",
      [(0, import_uuid6.v4)(), userId, "PROMPT_GENERATED", JSON.stringify({ historyId, isBanner: true })]
    );
    return res.status(201).json({
      id: historyId,
      userId,
      title,
      contentType: "Banner Promosi",
      slideCount: 1,
      designStyle,
      targetAudience: "Pelanggan Umum",
      language: "ID",
      generatedPrompt,
      imageOrientation: layoutSize,
      instagramCaption,
      tiktokCaption,
      hashtags,
      imageUrl: null,
      sourceImageUrl: imageUrls.length > 0 ? imageUrls.join(",") : null,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      isFavorite: false
    });
  } catch (error) {
    console.error("Save banner prompt history error:", error);
    return res.status(500).json({ message: "Server error: " + (error.message || error.toString()) });
  }
};

// src/controllers/prompt/logoController.ts
var import_uuid7 = require("uuid");
var getLogoLayoutSpec = (layout) => {
  const lower = layout.toLowerCase();
  if (lower.includes("3:4") || lower.includes("portrait")) {
    return {
      ratio: "3:4",
      widthHint: "768x1024",
      spec: "Portrait (3:4) vertikal \u2014 Canvas: 768x1024px, Aspect Ratio: 3:4. Bagus untuk desain logo memanjang ke bawah."
    };
  } else if (lower.includes("16:9") || lower.includes("landscape") || lower.includes("lanskap")) {
    return {
      ratio: "16:9",
      widthHint: "1024x576",
      spec: "Landscape (16:9) horizontal \u2014 Canvas: 1024x576px, Aspect Ratio: 16:9. Bagus untuk wide logo/wordmark."
    };
  } else {
    return {
      ratio: "1:1",
      widthHint: "1024x1024",
      spec: "Square (1:1) persegi \u2014 Canvas: 1024x1024px, Aspect Ratio: 1:1. Sangat ideal untuk format logo standard, ikon aplikasi, dan profil medsos."
    };
  }
};
var getLogoSlideRoleAndInstruction = (i, totalSlides, title, shape, cta) => {
  if (totalSlides === 1) {
    return {
      role: "LOGO UTAMA",
      instruction: `Buat konsep desain logo utama:
[HEADLINE FITUR] (Nama brand "${title}" dan tagline utama jika ada)
[PENJELASAN SINGKAT] (WAJIB KOSONGKAN/jangan diisi, karena slide pertama khusus logo murni dan judul saja tanpa penjelasan)
[BUKTI/KLAIM] (Abaikan atau kosongkan)
[DETAIL TAMBAHAN] (Abaikan atau kosongkan)
[VISUAL PENDUKUNG]: Rancang dan deskripsikan konsep visual logo utama yang kreatif untuk brand "${title}". Sebagai AI Image Generator, kamu wajib menciptakan ide konsep logo yang paling representatif untuk bidang usaha brand ini (apakah berupa minimalis pictorial mark, monogram/lettermark, geometris, atau abstract mark) dengan bentuk dasar "${shape}". Deskripsikan konsep logo tersebut secara visual secara premium, diletakkan di tengah (centered) dengan latar belakang bersih/solid/lembut, dan beri whitespace yang cukup agar logo tampak menonjol dan elegan.`
    };
  }
  if (i === 1) {
    return {
      role: "COVER & LOGO UTAMA (Slide 1)",
      instruction: `Buat teks slide cover utama identitas brand:
[HEADLINE FITUR] (Nama brand "${title}" dan tagline utama jika ada)
[PENJELASAN SINGKAT] (WAJIB KOSONGKAN/jangan diisi, karena slide pertama khusus logo murni dan judul saja tanpa penjelasan)
[BUKTI/KLAIM] (Abaikan atau kosongkan)
[DETAIL TAMBAHAN] (Abaikan atau kosongkan)
[VISUAL PENDUKUNG]: Rancang dan deskripsikan konsep visual logo utama yang kreatif untuk brand "${title}". Sebagai AI Image Generator, kamu wajib menciptakan ide konsep logo yang paling representatif untuk bidang usaha brand ini (apakah berupa minimalis pictorial mark, monogram/lettermark, geometris, atau abstract mark) dengan bentuk dasar "${shape}". Deskripsikan konsep logo tersebut secara visual secara premium, diletakkan di tengah (centered) dengan latar belakang bersih/solid/lembut, dan beri whitespace yang cukup agar logo tampak menonjol and elegan.`
    };
  }
  if (i === 2) {
    return {
      role: "FILOSOFI BENTUK & SIMBOL (Slide 2)",
      instruction: `Buat teks slide filosofi bentuk/simbol logo:
[HEADLINE FITUR] (Filosofi Bentuk Logo "${shape}")
[PENJELASAN SINGKAT] (Jelaskan makna di balik pemilihan bentuk "${shape}" untuk brand "${title}")
[BUKTI/KLAIM] (Abaikan atau kosongkan)
[DETAIL TAMBAHAN] (Abaikan atau kosongkan)
[VISUAL PENDUKUNG]: Blueprint desain ikon utama logo dengan garis sketsa (white outline sketch) bergaya arsitektur/blueprint di atas latar biru blueprint atau hitam.`
    };
  }
  if (i === 3) {
    return {
      role: "FILOSOFI PALET WARNA (Slide 3)",
      instruction: `Buat teks slide filosofi palet warna logo:
[HEADLINE FITUR] (Palet Warna Identitas)
[PENJELASAN SINGKAT] (Sebutkan 3-4 rekomendasi warna dominan beserta kode Hex dan arti psikologisnya)
[BUKTI/KLAIM] (Abaikan atau kosongkan)
[DETAIL TAMBAHAN] (Abaikan atau kosongkan)
[VISUAL PENDUKUNG]: Swatch palet warna berupa deretan lingkaran berwarna yang disusun secara estetik dan harmonis di atas latar studio bersih.`
    };
  }
  if (i === 4) {
    return {
      role: "TIPOGRAFI & GAYA HURUF (Slide 4)",
      instruction: `Buat teks slide tipografi brand:
[HEADLINE FITUR] (Tipografi & Karakter Font)
[PENJELASAN SINGKAT] (Rekomendasi jenis font yang melambangkan karakter brand "${title}", misalnya font Sans-Serif modern yang kokoh atau Serif yang elegan)
[BUKTI/KLAIM] (Abaikan atau kosongkan)
[DETAIL TAMBAHAN] (Abaikan atau kosongkan)
[VISUAL PENDUKUNG]: Tampilan anatomi huruf/karakter huruf dari font pilihan secara artistik, dengan garis bantu grid tipografi di atas latar minimalis.`
    };
  }
  if (i === 5) {
    return {
      role: "VERSI LOGO TRANSPARAN & FLAT (Slide 5)",
      instruction: `Buat teks slide logo versi transparan/monokrom:
[HEADLINE FITUR] (Logo Versi Transparan & Flat)
[PENJELASAN SINGKAT] (Penjelasan aturan penggunaan logo versi satu warna (hitam/putih) tanpa gradasi atau bayangan untuk diletakkan di latar transparan/baju)
[BUKTI/KLAIM] (Abaikan atau kosongkan)
[DETAIL TAMBAHAN] (Abaikan atau kosongkan)
[VISUAL PENDUKUNG]: Flat vector logo monokrom minimalis (murni warna hitam atau murni warna putih) yang bersih, berujung tajam, diletakkan di atas background solid berwarna abu-abu netral.`
    };
  }
  if (i === 6) {
    return {
      role: "APLIKASI LOGO PADA KAOS & BAJU (Slide 6)",
      instruction: `Buat teks slide aplikasi kaos/baju:
[HEADLINE FITUR] (Merchandise: Apparel Kaos)
[PENJELASAN SINGKAT] (Panduan penempatan logo pada media pakaian agar terlihat modis dan premium)
[BUKTI/KLAIM] (Abaikan atau kosongkan)
[DETAIL TAMBAHAN] (Abaikan atau kosongkan)
[VISUAL PENDUKUNG]: Mockup kaos t-shirt katun premium warna hitam minimalis dengan cetakan logo "${title}" yang presisi di bagian dada tengah, dikenakan oleh model estetik dengan pencahayaan studio yang dramatis.`
    };
  }
  if (i === 7) {
    return {
      role: "APLIKASI LOGO PADA TUMBLER (Slide 7)",
      instruction: `Buat teks slide aplikasi tumbler:
[HEADLINE FITUR] (Merchandise: Tumbler Premium)
[PENJELASAN SINGKAT] (Panduan penempatan logo pada media tumbler logam/stainless steel)
[BUKTI/KLAIM] (Abaikan atau kosongkan)
[DETAIL TAMBAHAN] (Abaikan atau kosongkan)
[VISUAL PENDUKUNG]: Mockup tumbler stainless steel berwarna matte charcoal/hitam dengan ukiran logo "${title}" berwarna perak/emas yang tergravir indah di tengah botol, diletakkan di atas meja kayu estetik dengan blur background.`
    };
  }
  if (i === 8) {
    return {
      role: "APLIKASI LOGO PADA SPANDUK & SIGNAGE (Slide 8)",
      instruction: `Buat teks slide aplikasi spanduk/signage:
[HEADLINE FITUR] (Signage Toko & Media Luar)
[PENJELASAN SINGKAT] (Panduan penerapan logo pada spanduk toko, banner jalanan, atau neon box toko fisik)
[BUKTI/KLAIM] (Abaikan atau kosongkan)
[DETAIL TAMBAHAN] (Abaikan atau kosongkan)
[VISUAL PENDUKUNG]: Mockup papan nama toko (signage) bundar berbahan akrilik hitam dengan logo "${title}" yang bercahaya neon hangat di bagian depan toko modern yang trendi saat sore hari.`
    };
  }
  if (i === 9) {
    return {
      role: "APLIKASI LOGO PADA STATIONERY (Slide 9)",
      instruction: `Buat teks slide aplikasi stationery:
[HEADLINE FITUR] (Branding Bisnis: Stationery)
[PENJELASAN SINGKAT] (Panduan pencetakan logo pada kartu nama bisnis, amplop, kop surat, dan peralatan kantor)
[BUKTI/KLAIM] (Abaikan atau kosongkan)
[DETAIL TAMBAHAN] (Abaikan atau kosongkan)
[VISUAL PENDUKUNG]: Mockup tumpukan kartu nama bisnis kertas tebal bertekstur warna putih gading dengan cetakan logo "${title}" berwarna emas embos (embossed gold logo) yang disusun rapi di atas meja marmer.`
    };
  }
  if (i === totalSlides) {
    return {
      role: "ATURAN BRANDING (DO'S & DON'TS) (Slide Akhir)",
      instruction: `Buat teks slide panduan branding dan penutup:
[HEADLINE FITUR] (Aturan Logo (Do's & Don'ts))
[PENJELASAN SINGKAT] (Aturan menjaga proporsi logo, dilarang memutar miring, mendistorsi rasio, atau merusak warna logo)
[BUKTI/KLAIM] (Abaikan atau kosongkan)
[DETAIL TAMBAHAN] (Call to Action / Info Kontak: ${cta || "Hubungi tim desain kami untuk kelanjutan panduan branding."})
[VISUAL PENDUKUNG]: Poster visual minimalis yang menunjukkan panduan larangan mengubah proporsi logo secara visual (misal contoh logo dicoret merah untuk visual yang salah).`
    };
  }
  return {
    role: `IDENTITAS BRAND SLIDE #${i} (Slide ${i})`,
    instruction: `Buat teks slide identitas logo pendukung:
[HEADLINE FITUR] (Topik visual pendukung ke-${i})
[PENJELASAN SINGKAT] (Panduan penggunaan logo/brand "${title}" pada media promosi yang relevan)
[BUKTI/KLAIM] (Abaikan atau kosongkan)
[DETAIL TAMBAHAN] (Abaikan atau kosongkan)
[VISUAL PENDUKUNG]: Visual mockup logo "${title}" diaplikasikan secara estetik pada produk/media promosi.`
  };
};
var generateLogoPrompt = async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  const {
    title,
    // Brand name, e.g. "Kopi Kenangan"
    contentType,
    // Content Type, e.g. "Logo Desain"
    designStyle,
    // e.g. "Minimalis", "Vintage", "Modern"
    description,
    // Brand philosophy / details
    layoutSize,
    // e.g. "Persegi (Square 1:1)"
    shape,
    // e.g. "Lingkaran", "Persegi", "Abstrak"
    slideCount,
    // Number of slides, e.g. 10
    sourceImageUrl
    // Reference image URLs (comma-separated or array)
  } = req.body;
  if (!title || !description || !designStyle || !shape) {
    return res.status(400).json({ message: "Missing required parameters. Nama Brand, Filosofi, Gaya, dan Bentuk Logo wajib diisi." });
  }
  const parsedSlideCount = parseInt(slideCount || "10", 10) || 10;
  const layoutSpec = getLogoLayoutSpec(layoutSize || "1:1");
  let imageUrls = [];
  if (Array.isArray(sourceImageUrl)) {
    imageUrls = sourceImageUrl.filter((url) => url && typeof url === "string" && url.trim().length > 0);
  } else if (typeof sourceImageUrl === "string" && sourceImageUrl.trim().length > 0) {
    imageUrls = sourceImageUrl.split(",").map((url) => url.trim()).filter((url) => url.length > 0);
  }
  let referenceAnalysis = "";
  if (imageUrls.length > 0) {
    const visionContent = [
      {
        type: "text",
        text: `Kamu adalah Senior Brand Identity Specialist & Art Director.
User mengunggah LOGO ASLI mereka sendiri dan memberikan deskripsi brand: "${description}".
Tugas kamu adalah menganalisis gambar logo asli ini secara cerdas dan mendalam:
1. Identifikasi bentuk geometris utama, simbol, ikon, dan struktur layout logo.
2. Identifikasi harmoni warna dan palet warna spesifik yang digunakan beserta kode Hex jika memungkinkan.
3. Berikan interpretasi filosofis dan makna modern yang cerdas dan berkelas dari logo asli ini sesuai dengan deskripsi brand.
Tulis analisis filosofi dan makna desain logo asli ini secara terperinci, modern, dan profesional agar bisa dirumuskan menjadi penjelasan brand guidelines.`
      }
    ];
    for (const url of imageUrls) {
      visionContent.push({
        type: "image_url",
        image_url: { url }
      });
    }
    const analysisPrompt = [{ role: "user", content: visionContent }];
    try {
      referenceAnalysis = await callGroqVisionApiWithRotation(analysisPrompt, "llama-4-scout-17b-16e-instruct");
    } catch (e) {
      console.error("Vision analysis on logo reference failed, using fallback:", e);
      referenceAnalysis = "Gaya visual bersih minimalis dengan penekanan pada garis tegas (clean line art) dan bentuk logo yang ikonik.";
    }
  }
  let stylePromptText = await getStylePromptText(designStyle);
  const slideOutputs = [];
  const previousSlideContentSummaries = [];
  const previousSlideVisualSummaries = [];
  for (let i = 1; i <= parsedSlideCount; i++) {
    const { role: slideRole, instruction: contentInstruction } = getLogoSlideRoleAndInstruction(i, parsedSlideCount, title, shape);
    let antiDuplikatKontenSection = "";
    if (previousSlideContentSummaries.length > 0) {
      antiDuplikatKontenSection = `
=== PERINGATAN ANTI-DUPLIKAT KONTEN ===
Slide sebelumnya sudah membahas:
${previousSlideContentSummaries.map((s, idx) => `  - Slide ${idx + 1}: ${s}`).join("\n")}
DILARANG mengulang poin di atas. Slide ${i} harus membahas aspek baru.`;
    }
    let antiDuplikatVisualSection = "";
    if (previousSlideVisualSummaries.length > 0) {
      antiDuplikatVisualSection = `
=== PERINGATAN ANTI-DUPLIKAT VISUAL ===
Slide sebelumnya sudah menggunakan visual:
${previousSlideVisualSummaries.map((s, idx) => `  - Slide ${idx + 1}: ${s}`).join("\n")}
DILARANG mengulang visual di atas. Buat deskripsi visual slide ${i} yang unik.`;
    }
    const promptInstruction = `Kamu adalah Senior Brand Identity Designer dan Copywriter profesional.
Buat data untuk SLIDE ${i} dari ${parsedSlideCount} slide Brand Guidelines.
Peran slide: ${slideRole}
Nama Brand: "${title}" | Bentuk Logo: "${shape}" | Gaya Desain/Tema: "${designStyle}"
Filosofi & Deskripsi Umum Brand: "${description}"

=== ATURAN WAJIB DESAIN LOGO & GUIDELINES (HARUS DIPATUHI 100%) ===
1. KEJELASAN & HIERARKI: Pastikan teks headline sangat ringkas (maks 6 kata), dan penjelasan singkat (subtext/detail) mudah dipahami.
2. DETAIL VISUAL: Deskripsikan latar belakang dan komposisi visual utama secara detail untuk AI Image Generator (Midjourney/DALL-E) agar membuat presentasi background yang sesuai tema. ${stylePromptText ? "Gunakan instruksi gaya latar belakang/tema visual ini: " + stylePromptText : ""}
3. PENJELASAN LOGO ASLI (MUTLAK): Slide ini BUKAN untuk mendesain logo baru dari nol, melainkan untuk MENJELASKAN filosofi, makna, dan aturan penggunaan LOGO ASLI milik user yang sudah diunggah. Buat narasi penjelasan dan arti logo menjadi modern, cerdas, menarik, dan profesional.
4. DETAIL LOGO USER (PENTING):
   ${imageUrls.length > 0 ? `User telah mengunggah gambar logo aslinya dengan analisis: "${referenceAnalysis}". Sesuaikan penjelasan filosofi teks slide (headline, subtext, detail, microTip) secara cerdas agar selaras dengan visual logo asli tersebut.` : ""}
${antiDuplikatKontenSection}
${antiDuplikatVisualSection}

=== INSTRUKSI KONTEN SLIDE ${i} ===
${contentInstruction}

=== FORMAT OUTPUT WAJIB: JSON ===
Kamu WAJIB mengembalikan output dalam format JSON murni. JANGAN ada teks, penjelasan, atau markdown apapun di luar JSON. Mulai langsung dengan { dan akhiri dengan }.

Gunakan format JSON PERSIS seperti ini:
{
  "slideNumber": ${i},
  "totalSlides": ${parsedSlideCount},
  "role": "${slideRole}",
  "content": {
    "headline": "[Judul slide/Headline \u2014 maks 6 kata]",
    "subtext": "[Penjelasan singkat slide \u2014 1-2 kalimat]",
    "detail": "[Detail teknis / penjelasan filosofi mendalam \u2014 2-3 kalimat]",
    "microTip": "[Tips praktis / info tambahan \u2014 1 kalimat pendek]"
  },
  "imagePrompt": {
    "visual": "[Deskripsi detail visual utama untuk AI Image Generator (Midjourney/DALL-E) agar menggambar visual sesuai tema slide ini. Sertakan detail objek, bentuk '${shape}', warna, pencahayaan studio, dan background yang kontras/bersih. JANGAN ada teks typo di dalam gambar.]",
    "negativePrompt": "[Negative prompt: photo, realistic, 3d render, shadows, gradients, realistic texture, blurry, noisy, low quality, watermark, complex details]"
  }
}`;
    try {
      const slideResult = await callGroqApiWithRotation(promptInstruction);
      let parsed = null;
      if (slideResult) {
        const jsonMatch = slideResult.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            parsed = JSON.parse(jsonMatch[0]);
          } catch (parseErr) {
            console.warn(`Slide ${i} JSON parse error:`, parseErr);
          }
        }
      }
      const visualSummary = parsed?.imagePrompt?.visual ? parsed.imagePrompt.visual.substring(0, 100) : `Visual Slide ${i}`;
      const contentSummary = parsed?.content?.headline ?? `Slide ${i}`;
      previousSlideVisualSummaries.push(visualSummary);
      previousSlideContentSummaries.push(contentSummary);
      const slideOutput = formatSlideOutput({
        slideNumber: parsed?.slideNumber ?? i,
        totalSlides: parsed?.totalSlides ?? parsedSlideCount,
        role: parsed?.role ?? slideRole,
        designStyleName: designStyle,
        orientationSpec: {
          ratio: layoutSpec.ratio,
          widthHint: layoutSpec.widthHint,
          spec: layoutSpec.spec
        },
        stylePromptText,
        visualContent: parsed?.imagePrompt?.visual ?? `Mockup visual logo untuk ${title}`,
        negativePrompt: parsed?.imagePrompt?.negativePrompt ?? "photo, realistic, 3d render, shadows, gradients, realistic texture, blurry, noisy, low quality, watermark, complex details",
        headline: parsed?.content?.headline ?? title,
        subtext: i === 1 ? "" : parsed?.content?.subtext ?? "",
        detail: i === 1 ? "" : parsed?.content?.detail ?? "",
        microTip: i === 1 ? "" : parsed?.content?.microTip ?? "",
        isPromotional: true,
        targetAudience: "Pelanggan Umum",
        mandatoryRules: `Ikuti panduan layout logo ${shape} untuk ${title} pada slide ini.`,
        mediaSosialAturan: ""
      });
      slideOutputs.push(slideOutput);
    } catch (slideErr) {
      console.error(`Gagal membuat slide ${i}, fallback...`, slideErr);
      const fallbackOutput = formatSlideOutput({
        slideNumber: i,
        totalSlides: parsedSlideCount,
        role: slideRole,
        designStyleName: designStyle,
        orientationSpec: {
          ratio: layoutSpec.ratio,
          widthHint: layoutSpec.widthHint,
          spec: layoutSpec.spec
        },
        stylePromptText,
        visualContent: `Mockup visual logo untuk ${title} gaya ${designStyle}`,
        negativePrompt: "photo, realistic, 3d render, shadows, gradients, realistic texture, blurry, noisy, low quality, watermark, complex details",
        headline: title,
        subtext: i === 1 ? "" : `Konsep: ${description}`,
        detail: i === 1 ? "" : `Pengaplikasian logo pada ${slideRole}`,
        microTip: i === 1 ? "" : `Bentuk: ${shape}`,
        isPromotional: true,
        targetAudience: "Pelanggan Umum",
        mandatoryRules: `Ikuti panduan layout logo ${shape} untuk ${title} pada slide ini.`,
        mediaSosialAturan: ""
      });
      slideOutputs.push(fallbackOutput);
    }
  }
  const styleName = designStyle.split("|")[0].trim();
  const styleAttributes = getStyleAttributes(styleName, stylePromptText);
  const fullCarouselObject = {
    aturan_global: {
      platform_target: "Instagram Carousel Post",
      peran: "Kamu adalah Senior Graphic Designer & Art Director yang mengetahui kombinasi warna, tipografi, dan estetika visual premium.",
      target_audiens: "Pelanggan Umum",
      jenis_konten: "Pembuatan Logo",
      larangan: "DILARANG KERAS menggunakan foto realistis atau detail 3D jika logo meminta format datar/vektor."
    },
    gaya_visual_global: {
      gaya_dominan: styleAttributes.gaya_dominan,
      gaya_visual_wajib: styleAttributes.gaya_visual_wajib,
      layout_dan_hierarki: styleAttributes.layout_dan_hierarki,
      elemen_pendukung: styleAttributes.elemen_infografis_pendukung,
      palet_warna: styleAttributes.palet_warna,
      tipografi: styleAttributes.tipografi,
      pencahayaan_kamera: styleAttributes.pencahayaan_dan_kamera,
      kedalaman_visual: styleAttributes.kedalaman_visual,
      dimensi_canvas: `Canvas ${layoutSpec.widthHint}px, Aspect Ratio ${layoutSpec.ratio} (--ar ${layoutSpec.ratio})`,
      negative_prompt: "photo, realistic, 3d render, shadows, gradients, realistic texture, blurry, noisy, low quality, watermark, complex details"
    },
    layout_media_sosial_global: {
      footer_bawah: `Logo Showcase`
    },
    daftar_slide: slideOutputs
  };
  const generatedPrompt = JSON.stringify(fullCarouselObject);
  const historyId = (0, import_uuid7.v4)();
  try {
    await query(
      `INSERT INTO prompt_histories (id, userId, title, contentType, slideCount, designStyle, targetAudience, language, generatedPrompt, imageOrientation, instagramCaption, tiktokCaption, hashtags, sourceImageUrl, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, 'Pelanggan Umum', 'ID', ?, ?, '', '', '', ?, NOW(), NOW())`,
      [
        historyId,
        userId,
        title,
        "Pembuatan Logo",
        parsedSlideCount,
        designStyle,
        generatedPrompt,
        layoutSize || "Persegi (Square 1:1)",
        imageUrls.length > 0 ? imageUrls.join(",") : null
      ]
    );
    await query(
      "INSERT INTO activity_logs (id, userId, action, metadata, createdAt) VALUES (?, ?, ?, ?, NOW())",
      [(0, import_uuid7.v4)(), userId, "PROMPT_GENERATED", JSON.stringify({ historyId, isLogo: true, slideCount: parsedSlideCount })]
    );
    return res.status(201).json({
      id: historyId,
      userId,
      title,
      contentType: "Pembuatan Logo",
      slideCount: parsedSlideCount,
      designStyle,
      targetAudience: "Pelanggan Umum",
      language: "ID",
      generatedPrompt,
      imageOrientation: layoutSize || "Persegi (Square 1:1)",
      instagramCaption: "",
      tiktokCaption: "",
      hashtags: "",
      imageUrl: null,
      sourceImageUrl: imageUrls.length > 0 ? imageUrls.join(",") : null,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      isFavorite: false
    });
  } catch (error) {
    console.error("Save logo prompt history error:", error);
    return res.status(500).json({ message: "Server error: " + (error.message || error.toString()) });
  }
};

// src/controllers/prompt/quoteController.ts
var import_uuid8 = require("uuid");
var MOOD_ATMOSPHERE_MAP = {
  sedih: {
    label: "Sedih / Melankolis",
    atmosphere: "A cinematic night cityscape viewed from a rooftop or hilltop, city lights glowing in the dark, moody blue-grey overcast sky, lone figure sitting at the edge with back to camera, foggy distant buildings, melancholic and solitary mood, photorealistic, cinematic shot, 8K",
    color: "#4A6FA5"
  },
  motivasi: {
    label: "Motivasi / Semangat",
    atmosphere: "A breathtaking golden sunrise over a vast mountain range, dramatic rays of light piercing through clouds, silhouette of a person standing at a cliff edge looking into the horizon, warm amber and orange sky, epic cinematic wide shot, photorealistic, 8K",
    color: "#F59E0B"
  },
  cinta: {
    label: "Cinta / Romantis",
    atmosphere: "A beautiful night city skyline with warm glowing lights reflected on a calm river or lake, pink and purple sky with stars, a lone figure sitting on a bench or pier looking at the lights, romantic and dreamy atmosphere, cinematic photography, 8K",
    color: "#EC4899"
  },
  religius: {
    label: "Religius / Spiritual",
    atmosphere: "A majestic mosque silhouette against a golden dawn sky, divine light rays streaming through clouds, reflective water in the foreground, peaceful and sacred atmosphere, cinematic wide shot, photorealistic, 8K",
    color: "#10B981"
  },
  bijak: {
    label: "Bijak / Filosofis",
    atmosphere: "A tranquil night mountain scene with a clear starry sky and Milky Way visible, a small lone figure sitting on a rock looking at the stars, vast landscape, deep blue and purple tones, contemplative and wise mood, astrophotography style, 8K",
    color: "#8B5CF6"
  },
  bahagia: {
    label: "Kebahagiaan / Gembira",
    atmosphere: "A vibrant sunset over the ocean with golden and orange sky reflecting on calm water, warm and cheerful colors, a small figure at the shoreline, joyful and uplifting mood, cinematic wide shot, photorealistic, 8K",
    color: "#EAB308"
  },
  perjuangan: {
    label: "Perjuangan / Kerja Keras",
    atmosphere: "A dramatic pre-dawn cityscape with deep blue and purple sky, city lights still glowing, a lone figure at a high vantage point looking down at the city, determined and resilient mood, cinematic photography, gritty and raw, 8K",
    color: "#EF4444"
  },
  alam: {
    label: "Kedamaian / Alam",
    atmosphere: "A serene misty forest waterfall scene at dawn, soft golden light filtering through tall trees, lush tropical greenery, morning mist rising from the water, a small lone figure sitting by the water, peaceful and tranquil, photorealistic nature photography, 8K",
    color: "#059669"
  },
  nostalgia: {
    label: "Nostalgia / Kenangan",
    atmosphere: "A warm golden sunset over a quiet Indonesian rural village, traditional houses, dirt road lined with palm trees, a lone figure sitting and watching the sunset, nostalgic film photography aesthetic, warm sepia and amber tones, cinematic, 8K",
    color: "#D97706"
  }
};
var detectMoodFromText = (text) => {
  const lower = text.toLowerCase();
  if (lower.match(/sedih|tangis|air mata|kehilangan|pergi|rindu|sendirian|sunyi|sepi|duka|lara|pilu/)) return "sedih";
  if (lower.match(/semangat|bangkit|juara|sukses|raih|mimpi|tujuan|kuat|berani|tekad|gapai|optimis|percaya diri/)) return "motivasi";
  if (lower.match(/cinta|sayang|kasih|hati|rindu|kekasih|rasa|perasaan|asmara|romantis/)) return "cinta";
  if (lower.match(/allah|tuhan|doa|syukur|iman|takwa|rezeki|berkah|sholat|bismillah|ibadah|qur'an|hadist/)) return "religius";
  if (lower.match(/bijak|ilmu|pelajaran|hikmah|falsafah|wisdom|pengetahuan|buku|pikiran|akal|logika/)) return "bijak";
  if (lower.match(/senang|bahagia|gembira|senyum|tertawa|tawa|kebahagiaan|indah|ceria|hebat/)) return "bahagia";
  if (lower.match(/berjuang|kerja keras|susah|lelah|capek|usaha|perjuangan|gagal|bangkit|tidak menyerah/)) return "perjuangan";
  if (lower.match(/alam|angin|pohon|gunung|laut|sungai|hujan|bunga|daun|langit|bumi/)) return "alam";
  if (lower.match(/dulu|masa lalu|kenangan|ingat|waktu|zaman|masa kecil|nostalgia/)) return "nostalgia";
  return "bijak";
};
var generateQuotePrompt = async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  const {
    quoteText,
    quoteAuthor,
    characterId,
    useCharacter,
    imageOrientation,
    moodOverride
  } = req.body;
  if (!quoteText || quoteText.trim().length < 5) {
    return res.status(400).json({ message: "Kata mutiara wajib diisi (minimal 5 karakter)." });
  }
  const orientationSpec = getOrientationSpec(imageOrientation || "Persegi (Square 1:1)");
  const shouldAddCharacter = useCharacter === true || useCharacter === "true";
  let detectedMood = moodOverride || detectMoodFromText(quoteText.trim());
  const moodData = MOOD_ATMOSPHERE_MAP[detectedMood] || MOOD_ATMOSPHERE_MAP["bijak"];
  let characterName = "";
  let characterPromptText = "";
  try {
    if (shouldAddCharacter && characterId) {
      try {
        const charRows = await query("SELECT name, prompt FROM characters WHERE id = ?", [characterId]);
        if (charRows.rows && charRows.rows.length > 0) {
          characterName = charRows.rows[0].name;
          characterPromptText = charRows.rows[0].prompt || "";
        }
      } catch (charErr) {
        console.warn("Failed to fetch character from DB:", charErr);
      }
    }
    const authorLine = quoteAuthor && quoteAuthor.trim().length > 0 ? `- Penulis / Sumber Kutipan: "${quoteAuthor.trim()}"` : `- Penulis: (Tidak disebutkan \u2014 jangan tampilkan nama penulis di gambar)`;
    const characterInstruction = shouldAddCharacter && characterPromptText ? `
CHARACTER PLACEMENT RULES (MANDATORY):
- Include character: "${characterName}" \u2014 described as: "${characterPromptText}"
- Character MUST be SMALL (maximum 15-20% of total canvas height) \u2014 like a tiny figure in the landscape
- Character MUST be positioned at the BOTTOM-LEFT or BOTTOM-RIGHT corner of the image
- Character pose: Sitting down, back FACING THE VIEWER, looking at the scenery ahead \u2014 NOT facing camera
- Character must feel like a tiny lonely figure in a vast landscape, NOT a main subject
- DO NOT let the character overlap or cover the quote text area
- The character blends naturally into the scene like a person watching a view` : `
CHARACTER: NONE \u2014 This image contains NO human figures, NO avatars, NO cartoon characters, NO mascots. Only the pure scenic landscape/environment.`;
    const groqPrompt = `You are a Senior AI Image Prompt Engineer specializing in cinematic photo-realistic quote wallpapers for social media.

Your goal: Generate a SINGLE pure JSON object (no markdown, no extra text) for an image prompt that follows THIS EXACT VISUAL STYLE:
- BACKGROUND: A stunning, cinematic, photo-realistic SCENIC LANDSCAPE ONLY (city skyline at night, mountains, ocean, forest, etc.). NO decorative frames, NO borders, NO vignettes, NO artistic overlays, NO abstract patterns.
- TEXT: The quote text appears as SMALL, SIMPLE, WHITE or light-colored plain text overlaid on the image \u2014 positioned at upper-left, upper-center, or center of the image. Font style: clean sans-serif or simple serif, NOT bold, NOT huge, NOT decorative. Just simple readable text.
- CHARACTER (if any): A very tiny figure (cartoon/anime/realistic) sitting at the bottom-left or bottom-right corner, BACK FACING the viewer, looking at the scenery. Like a person sitting alone watching a city at night or a sunset \u2014 small and unobtrusive.
- OVERALL FEEL: Like a viral Indonesian quote wallpaper \u2014 minimal, cinematic, emotional, no excess decorations.

STRICT VISUAL REALISM & PROFESSIONAL DESIGN RULES (CRITICAL):
1. The background MUST look like an authentic real photograph or a high-end professional graphic design backdrop.
2. ABSOLUTELY NO typical low-quality AI art styles, no generic 3D CGI look, no fake glossy renders, no cheap fantasy drawing/digital painting styles, no abstract neon vectors.
3. The prompt must describe the scenery with photorealistic camera parameters (e.g. "shot on 35mm lens, realistic depth of field, authentic textures, natural atmospheric fog, award-winning photography, high realism, shot on RED camera") to force the generator to create an organic, real-life photo instead of a generic AI drawing.
4. Ensure the scene feels highly professional, clean, and real.

INPUT DATA:
- Quote text: "${quoteText.trim()}"
${authorLine}
- Mood: "${moodData.label}"
- Scenic atmosphere base: "${moodData.atmosphere}"
- Image dimensions: ${orientationSpec.spec} (Canvas: ${orientationSpec.widthHint}px)
${characterInstruction}

TEXT OVERLAY RULES (MANDATORY \u2014 Match reference style):
1. Quote text must be SMALL and readable \u2014 NOT giant typography
2. Text color: White or very light colored \u2014 high contrast against the background
3. Font style: Simple, clean \u2014 NO decorative effects, NO emboss, NO glow halos, NO shadow effects
4. Text position: Upper-left area or center-left of the canvas
5. If author name exists: Show it below the quote in even smaller, italic text
6. NO decorative lines, NO frames around text, NO quote marks as design elements, NO ornaments

OUTPUT JSON FORMAT:
{
  "detected_mood": "${moodData.label}",
  "mood_color_accent": "${moodData.color}",
  "image_prompt_english": "[Full English image generation prompt \u2014 Include: (1) The exact scenic background description in full detail, (2) text overlay instruction with small/minimal style, (3) character placement if applicable (tiny figure at corner, back to viewer), (4) canvas dimensions, (5) quality specs. MINIMUM 120 words. Style must match cinematic photorealistic quote wallpaper \u2014 NOT an illustrated poster.]",
  "typography_instruction": "[Typography guide: small clean sans-serif or simple serif font, white/light color, no decoration, positioned at upper-left or center, author name smaller below if exists]",
  "visual_style": "[Overall style: e.g. Cinematic photorealistic night cityscape, astrophotography, golden hour photography, etc.]",
  "color_palette": {
    "primary": "[Dominant background color]",
    "accent": "[Accent color]",
    "text_color": "white or #F5F5F5"
  },
  "negative_prompt": "watermark, logo, low quality, blurry, decorative frame, ornamental border, vignette overlay, abstract pattern, illustrated poster style, typography art, bold large text, neon text, glowing text effect, bokeh text, text decoration, bad anatomy, deformed, extra limbs",
  "tiktok_caption": "[TikTok caption in Indonesian \u2014 3-4 sentences, emotional and relatable tone matching ${moodData.label}, invite engagement (like, comment, share, save). Use relevant emojis. Max 200 words.]",
  "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3", "#hashtag4", "#hashtag5"]
}

CRITICAL: Output ONLY the JSON object above. Exactly 5 hashtags. NO markdown code blocks. NO text before or after the JSON.`;
    const resultRaw = await callGroqApiWithRotation(groqPrompt);
    let cleanedJson = resultRaw.replace(/```json/gi, "").replace(/```/g, "").trim();
    const jsonMatch = cleanedJson.match(/\{[\s\S]*\}/);
    let parsedResult = null;
    if (jsonMatch) {
      try {
        parsedResult = JSON.parse(jsonMatch[0]);
        if (Array.isArray(parsedResult.hashtags) && parsedResult.hashtags.length > 5) {
          parsedResult.hashtags = parsedResult.hashtags.slice(0, 5);
        }
      } catch (parseErr) {
        console.warn("JSON parse failed, using raw:", parseErr);
      }
    }
    const imagePromptEnglish = parsedResult?.image_prompt_english || `${moodData.atmosphere}, minimal clean white quote text "${quoteText.trim()}" in small sans-serif font at upper-left area, ${shouldAddCharacter && characterName ? `tiny ${characterName} figure sitting at bottom-right corner with back to camera, ` : ""}${orientationSpec.ratio} aspect ratio, cinematic photorealistic, 8K quality`;
    const typographyInstruction = parsedResult?.typography_instruction || "Small clean white sans-serif text, positioned upper-left, no decoration";
    const visualStyle = parsedResult?.visual_style || moodData.label;
    const colorPalette = parsedResult?.color_palette || {};
    const negativePrompt = parsedResult?.negative_prompt || "watermark, blurry, low quality, decorative frame, bold large text";
    const tiktokCaption = parsedResult?.tiktok_caption || "";
    const hashtags = parsedResult?.hashtags ? parsedResult.hashtags.join(" ") : "";
    const detectedMoodLabel = parsedResult?.detected_mood || moodData.label;
    const generatedPromptObj = {
      type: "kata_mutiara",
      quote: quoteText.trim(),
      author: quoteAuthor?.trim() || null,
      detected_mood: detectedMoodLabel,
      mood_color_accent: parsedResult?.mood_color_accent || moodData.color,
      image_prompt_english: imagePromptEnglish,
      typography_instruction: typographyInstruction,
      visual_style: visualStyle,
      color_palette: colorPalette,
      negative_prompt: negativePrompt,
      orientation: orientationSpec.spec,
      canvas_size: orientationSpec.widthHint,
      character: shouldAddCharacter && characterName ? { name: characterName, prompt: characterPromptText } : null
    };
    const generatedPrompt = JSON.stringify(generatedPromptObj, null, 2);
    const historyId = (0, import_uuid8.v4)();
    await query(
      `INSERT INTO prompt_histories (id, userId, title, contentType, slideCount, designStyle, targetAudience, language, generatedPrompt, imageOrientation, tiktokCaption, hashtags, quoteText, quoteAuthor, createdAt, updatedAt)
       VALUES (?, ?, ?, 'Kata Mutiara', 1, ?, '', 'ID', ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        historyId,
        userId,
        quoteText.trim().substring(0, 100),
        detectedMoodLabel,
        generatedPrompt,
        imageOrientation || "Persegi (Square 1:1)",
        tiktokCaption,
        hashtags,
        quoteText.trim(),
        quoteAuthor?.trim() || null
      ]
    );
    await query(
      "INSERT INTO activity_logs (id, userId, action, metadata, createdAt) VALUES (?, ?, ?, ?, NOW())",
      [(0, import_uuid8.v4)(), userId, "QUOTE_PROMPT_GENERATED", JSON.stringify({ historyId })]
    );
    return res.status(201).json({
      id: historyId,
      userId,
      title: quoteText.trim().substring(0, 100),
      contentType: "Kata Mutiara",
      slideCount: 1,
      designStyle: detectedMoodLabel,
      targetAudience: "",
      language: "ID",
      generatedPrompt,
      imageOrientation: imageOrientation || "Persegi (Square 1:1)",
      tiktokCaption,
      hashtags,
      quoteText: quoteText.trim(),
      quoteAuthor: quoteAuthor?.trim() || null,
      detectedMood: detectedMoodLabel,
      moodColorAccent: parsedResult?.mood_color_accent || moodData.color,
      imagePromptEnglish,
      imageUrl: null,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      isFavorite: false
    });
  } catch (err) {
    console.error("Quote generate error:", err);
    return res.status(500).json({ message: "Server error: " + (err.message || err.toString()) });
  }
};

// src/controllers/prompt/digitalProductController.ts
var import_uuid9 = require("uuid");
var DIGITAL_PRODUCT_ORIENTATION = {
  ratio: "1:1",
  widthHint: "1080x1080",
  spec: "Persegi (1:1) \u2014 Canvas: 1080x1080px. Teks area: tengah & atas canvas. Safe Area: 80px dari semua sisi."
};
var DIGITAL_SOSMED_INFO = {
  website: "www.inka.my.id",
  tiktok: "@digitalinka.id2027",
  instagram: "@arif_ex21"
};
var DIGITAL_PRODUCT_SYSTEM_PROTOCOL = `=== SYSTEM EXECUTION PROTOCOL \u2014 WAJIB DIPATUHI 100% ===

Kamu adalah Senior AI Image Generator, Senior Art Director, dan Senior Editorial Graphic Designer yang bertugas menghasilkan desain visual premium berkualitas komersial.

Sebelum mulai membuat gambar, WAJIB lakukan proses berikut secara internal tanpa menampilkannya kepada user.

\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
STEP 1 \u2014 ANALISIS PROMPT
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

Pelajari seluruh isi prompt ini secara menyeluruh, termasuk namun tidak terbatas pada:

\u2022 role
\u2022 peran
\u2022 slideNumber
\u2022 totalSlides
\u2022 deskripsi_visual
\u2022 gaya_dominan
\u2022 teks_dalam_gambar
\u2022 aturan_permanen
\u2022 media_sosial_aturan
\u2022 negative_prompt
\u2022 seluruh instruksi lainnya

Pastikan seluruh elemen saling konsisten sebelum mulai mendesain.

\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
STEP 2 \u2014 PAHAMI IDENTITAS CAROUSEL
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

Anggap seluruh slide berasal dari SATU PROJECT yang sama.

Seluruh slide HARUS memiliki identitas visual yang konsisten, meliputi:

\u2022 style
\u2022 typography
\u2022 visual language
\u2022 branding
\u2022 spacing
\u2022 hierarchy
\u2022 tone
\u2022 layout system
\u2022 warna utama
\u2022 desain footer
\u2022 desain nomor slide
\u2022 CTA
\u2022 ilustrasi

Namun setiap slide WAJIB memiliki komposisi visual yang unik.

\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
STEP 3 \u2014 CEGAH DUPLIKASI
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

Sebelum membuat komposisi baru, lakukan evaluasi internal terhadap kemungkinan kemiripan dengan slide lain dalam carousel.

Jika ditemukan kemiripan tinggi pada salah satu aspek berikut:

\u2022 angle kamera
\u2022 framing
\u2022 pose karakter
\u2022 posisi objek utama
\u2022 urutan visual
\u2022 komposisi layout
\u2022 proporsi ruang kosong
\u2022 bentuk abstrak
\u2022 distribusi warna
\u2022 ukuran objek
\u2022 peletakan ikon
\u2022 peletakan headline
\u2022 peletakan CTA

maka WAJIB membuat variasi baru.

Variasi harus tetap mempertahankan identitas visual carousel tetapi memberikan pengalaman visual yang benar-benar berbeda.

\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
STEP 4 \u2014 PRIORITAS DESAIN
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

Selalu prioritaskan:

1. Hierarki visual yang jelas.
2. Komposisi premium.
3. Keseimbangan visual.
4. Keterbacaan teks.
5. Fokus terhadap pesan utama slide.
6. Konsistensi branding.
7. Kesan eksklusif.
8. Kesan profesional.
9. Kesan modern.
10. Mudah dipahami dalam waktu kurang dari 3 detik.

\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
STEP 5 \u2014 KUALITAS DESAIN
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

Hasil akhir HARUS terlihat seperti karya desainer profesional, BUKAN template AI biasa.

Hindari:

\u2022 layout generik
\u2022 objek mengambang tanpa tujuan
\u2022 penempatan ikon acak
\u2022 teks bertumpuk
\u2022 komposisi kosong
\u2022 elemen yang tidak memiliki fungsi visual
\u2022 proporsi tidak seimbang
\u2022 visual membosankan
\u2022 komposisi monoton

\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
STEP 6 \u2014 EKSEKUSI
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

Gunakan seluruh instruksi pada slide ini sebagai sumber utama.

JANGAN mengurangi kualitas hanya karena keterbatasan ruang.

Optimalkan komposisi secara profesional agar seluruh elemen tetap nyaman dibaca.

Jika terdapat konflik instruksi, prioritaskan:

1. instruksi_awal_wajib
2. aturan_permanen
3. deskripsi_visual
4. teks_dalam_gambar
5. media_sosial_aturan
6. negative_prompt

\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
HASIL AKHIR
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

Hasil akhir harus memenuhi seluruh kriteria berikut:

\u2713 Premium
\u2713 Modern
\u2713 Bersih
\u2713 High-end
\u2713 Konsisten
\u2713 Tidak duplikat
\u2713 Siap dipublikasikan
\u2713 Layak dijadikan materi promosi profesional
\u2713 Memiliki identitas visual yang kuat
\u2713 Mudah dipahami dalam sekali lihat

=== END SYSTEM EXECUTION PROTOCOL ===`;
var buildDigitalSosmedAturan = (slideNumber, slideCount) => {
  return `Tambahkan layout visual dan teks detail berikut pada gambar secara profesional dan permanen di setiap slide:
- Di pojok kiri atas gambar, tampilkan nomor slide: "${slideNumber}/${slideCount}" dalam kotak kecil berwarna gelap transparan.
- Di pojok kanan atas gambar, tampilkan teks ajakan kecil: "Swipe \u2192" atau "Geser \u2192".
- Di bagian FOOTER BAWAH gambar, tampilkan info sosial media dengan layout horizontal premium:
  * LOGO TIKTOK (ikon TikTok asli, monochrome putih) diikuti teks: "${DIGITAL_SOSMED_INFO.tiktok}"
  * LOGO INSTAGRAM (ikon Instagram gradient/putih) diikuti teks: "${DIGITAL_SOSMED_INFO.instagram}" + badge kecil bertuliskan "FOLLOW" (berwarna kontras, seperti tombol)
  * IKON GLOBE/WEB diikuti teks: "${DIGITAL_SOSMED_INFO.website}"
- Footer ini menggunakan background strip semi-transparan gelap agar tetap terbaca di atas background apapun.
- PENTING: Footer sosmed ini WAJIB tampil di setiap slide tanpa kecuali.`;
};
var generateDigitalProductPrompt = async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  const {
    title,
    slideCount,
    designStyle,
    targetAudience,
    includeCaption,
    sourceImageUrl,
    description,
    brand,
    price,
    productType,
    additionalPrompt,
    characterId,
    useCharacter,
    contentType,
    color1,
    color2
  } = req.body;
  if (!description || !slideCount || !designStyle || !targetAudience) {
    return res.status(400).json({
      message: "Missing required parameters. Deskripsi produk digital, jumlah slide, gaya desain, dan target audiens wajib diisi."
    });
  }
  const validatedSlideCount = Math.max(2, Math.min(5, parseInt(slideCount, 10) || 3));
  const orientationSpec = DIGITAL_PRODUCT_ORIENTATION;
  const shouldGenerateCaption = includeCaption !== false && includeCaption !== "false";
  let characterPromptText = "";
  let characterName = "";
  const shouldAddCharacter = useCharacter === true || useCharacter === "true";
  if (shouldAddCharacter && characterId) {
    try {
      const charRows = await query("SELECT name, prompt FROM characters WHERE id = ?", [characterId]);
      if (charRows.rows && charRows.rows.length > 0) {
        characterName = charRows.rows[0].name;
        characterPromptText = charRows.rows[0].prompt || "";
      }
    } catch (charErr) {
      console.warn("Failed to fetch character from DB in digitalProductController:", charErr);
    }
  }
  let imageUrls = [];
  if (Array.isArray(sourceImageUrl)) {
    imageUrls = sourceImageUrl.filter((url) => url && typeof url === "string" && url.trim().length > 0);
  } else if (typeof sourceImageUrl === "string" && sourceImageUrl.trim().length > 0) {
    imageUrls = sourceImageUrl.split(",").map((url) => url.trim()).filter((url) => url.length > 0);
  }
  let analysisResult = "";
  const digitalAnalysisPrompt = `Kamu adalah pakar pemasaran produk digital dan konten kreator Indonesia yang berpengalaman.
Analisis produk digital berikut secara mendalam untuk keperluan pembuatan konten promosi media sosial (Instagram/TikTok).

Produk Digital: "${description || "Produk Digital"}"
${brand ? `Brand/Nama Penjual: ${brand}` : ""}
${price ? `Harga: ${price}` : ""}
${productType ? `Jenis Produk Digital: ${productType}` : ""}
${additionalPrompt ? `Informasi Tambahan dari Pemilik: "${additionalPrompt}"` : ""}

Berikan analisis yang mencakup:
1. Jenis & kategori produk digital ini (ebook, course, template, preset, tools, dll)
2. Target pembeli ideal dan pain point yang diselesaikan
3. Manfaat utama & keunggulan kompetitif (Unique Selling Point)
4. Fitur atau konten apa saja yang kemungkinan ada di dalamnya
5. Saran harga & positioning (jika tidak ada harga, sarankan range harga wajar)
6. Hook/angle marketing yang paling efektif untuk media sosial Indonesia

Tulis analisis yang terstruktur, padat, dan langsung ke poin.`;
  if (imageUrls.length > 0) {
    const visionContent = [
      {
        type: "text",
        text: `Kamu adalah pakar pemasaran produk digital Indonesia.
Analisis gambar produk digital yang diupload user. User mengirim ${imageUrls.length} gambar.
Identifikasi:
1. Jenis produk digital apa ini (ebook, template, course, preset, tools, software, dll)?
2. Tampilan/preview produknya seperti apa (mockup di laptop/HP, cover buku digital, screenshot dashboard, dll)?
3. Keunggulan visual yang bisa ditonjolkan dalam promosi?
4. Saran copywriting untuk social media Indonesia?

Deskripsi tambahan dari pemilik: "${description || ""}"
${brand ? `Brand: ${brand}` : ""}
${price ? `Harga: ${price}` : ""}
${additionalPrompt ? `Info tambahan: "${additionalPrompt}"` : ""}

Tulis analisis yang padat dan informatif.`
      }
    ];
    for (const url of imageUrls) {
      visionContent.push({ type: "image_url", image_url: { url } });
    }
    try {
      analysisResult = await callGroqVisionApiWithRotation(
        [{ role: "user", content: visionContent }],
        "llama-4-scout-17b-16e-instruct"
      );
    } catch (e) {
      console.warn("Vision analysis failed, using text fallback:", e);
      try {
        analysisResult = await callGroqApiWithRotation(digitalAnalysisPrompt);
      } catch (_) {
        analysisResult = `Produk digital teridentifikasi: ${description || "Produk Digital"}. ${brand ? `Brand: ${brand}.` : ""}`;
      }
    }
  } else {
    try {
      analysisResult = await callGroqApiWithRotation(digitalAnalysisPrompt);
    } catch (_) {
      analysisResult = `Produk digital teridentifikasi: ${description || "Produk Digital"}. ${brand ? `Brand: ${brand}.` : ""}`;
    }
  }
  let aiTitle = title || "";
  if (!aiTitle) {
    try {
      const titlePrompt = `Kamu adalah Copywriter ahli produk digital Indonesia. Buat judul konten promosi yang menarik (maks 5 kata) untuk produk digital: "${description.substring(0, 120)}". LANGSUNG berikan judul tanpa tanda kutip, tanpa awalan/akhiran.`;
      const generated = await callGroqApiWithRotation(titlePrompt);
      if (generated && generated.trim().length > 0) {
        aiTitle = generated.trim().replace(/^"|"$/g, "").trim();
      }
    } catch (_) {
      aiTitle = brand || "Produk Digital";
    }
  }
  const stylePromptText = await getStylePromptText(designStyle);
  const contextProduk = `
Analisis Produk Digital: ${analysisResult}
${brand ? `Brand/Penjual: ${brand}` : ""}
${price ? `Harga: ${price}` : ""}
${productType ? `Jenis: ${productType}` : ""}
${additionalPrompt ? `Prompt Tambahan dari User: "${additionalPrompt}"` : ""}`;
  const isPromotional = true;
  const mandatoryRules = getMandatoryRules(isPromotional, orientationSpec);
  const terminology = getTerminologyGlossary(isPromotional);
  const audienceInstruction = getAudienceInstruction(targetAudience);
  const visualConceptPrompt = `Kamu adalah Senior Art Director spesialis produk digital dan e-commerce Indonesia.
Produk Digital: "${aiTitle}" | Brand: ${brand || "-"} | Audiens: ${targetAudience}
Gaya Desain: ${designStyle}
${color1 && color2 ? `Paduan Warna Konten Wajib: ${color1} dan ${color2}` : ""}

Context Produk: ${contextProduk}

${mandatoryRules}

Tugas: Buat SATU paragraf "Konsep Visual Latar" untuk semua slide produk digital ini.
Fokus pada: elemen visual digital (mockup laptop/HP, dashboard app, ebook cover, template preview, dll), latar yang modern dan bersih.
${color1 && color2 ? `PENTING: Gunakan paduan kombinasi warna ${color1} dan ${color2} sebagai warna dasar visual utama.` : "JANGAN tentukan gaya warna/tipografi \u2014 fokus pada OBJEK visual dan komposisi."}
Berikan HANYA paragraf konsepnya, tanpa teks lain.`;
  let mainVisualConcept = "";
  try {
    mainVisualConcept = await callGroqApiWithRotation(visualConceptPrompt);
  } catch (_) {
    mainVisualConcept = `Mockup produk digital premium (laptop/smartphone screen), latar bersih modern, elemen grafis digital minimalis, nuansa warna brand yang konsisten.`;
  }
  const finalPromptParts = [];
  const previousSlideContentSummaries = [];
  const previousSlideVisualSummaries = [];
  for (let i = 1; i <= validatedSlideCount; i++) {
    let slideRole = "";
    let contentInstruction = "";
    if (i === 1) {
      slideRole = "COVER EKSKLUSIF PRODUK DIGITAL (Slide 1)";
      contentInstruction = `SLIDE COVER EKSKLUSIF \u2014 Buat visual cover yang memukau dan premium untuk produk digital ini:
[HEADLINE] (nama/judul produk digital yang kuat, maks 6 kata, BESAR dan dominan di tengah)
[SUBTEXT] (tagline singkat produk, maks 8 kata, premium dan menggoda)
[DETAIL] (benefit utama atau kategori produk, sangat singkat)
[MICRO TIP] (kosongkan atau badge kecil seperti "NEW RELEASE" / "BEST SELLER")

[VISUAL COVER EKSKLUSIF]: 
Deskripsikan visual cover yang memukau:
- Mockup produk digital yang realistis dan premium (laptop terbuka dengan dashboard/ebook di layar, HP menampilkan interface app, atau preview cover ebook floating 3D)
- Background menggunakan gradient premium (sesuai gaya desain) atau dark premium
- Elemen dekoratif digital: partikel cahaya, garis circuit halus, atau shape geometris futuristik
- Typography area yang jelas: judul besar di tengah/atas, tagline di bawahnya
- Tampilkan preview/thumbnail produk secara visual yang nyata dan menarik
- Kesan PREMIUM, PROFESIONAL, dan EKSKLUSIF \u2014 seperti landing page brand ternama
- Sudut kamera: isometric atau 3/4 view untuk mockup produk digital`;
    } else if (i === validatedSlideCount) {
      slideRole = `INFO PEMBELIAN & CTA (Slide ${i} \u2014 Penutup)`;
      contentInstruction = `Buat slide penutup berisi info cara beli & CTA produk digital:
[HEADLINE] (ajakan bertindak tegas, maks 8 kata, seperti "Dapatkan Akses Sekarang!" atau "Raih Hasilnya Mulai Hari Ini!")
[SUBTEXT] (info harga + cara beli: ${price ? `Harga: ${price}` : "Harga spesial tersedia"}. ${brand ? `Hub: ${brand}` : "DM/komentar untuk info pembelian"})
[DETAIL] (apa yang didapat setelah beli: akses, bonus, lifetime, dll \u2014 berdasarkan analisis produk)
[MICRO TIP] (garansi, jaminan, atau keunggulan: "Garansi Puas atau Uang Kembali" / "Akses Seumur Hidup")

[VISUAL PENDUKUNG]: Visual penutup yang persuasif \u2014 tombol CTA besar kontras, countdown timer visual (jika relevan), mockup produk + tangan sedang mengakses, elemen "sebelum & sesudah" ringan, atau visual hasil yang bisa dicapai setelah menggunakan produk.`;
    } else {
      const infoIndex = i - 1;
      const infoTopics = [
        "ISI & KONTEN PRODUK \u2014 Apa saja yang didapat pembeli",
        "MANFAAT UTAMA & HASIL NYATA \u2014 Transformasi setelah menggunakan produk",
        "KEUNGGULAN & DIFERENSIASI \u2014 Kenapa pilih produk ini dibanding yang lain"
      ];
      const topicHint = infoTopics[(infoIndex - 1) % infoTopics.length];
      slideRole = `INFO PRODUK DIGITAL #${infoIndex} \u2014 ${topicHint} (Slide ${i})`;
      contentInstruction = `Buat slide informasi produk digital yang menarik dan informatif \u2014 TOPIK: ${topicHint}:
[HEADLINE] (poin utama dari topik ini, maks 8 kata, bold dan eye-catching)
[SUBTEXT] (pembuka 1-2 kalimat, santai, asik, bikin penasaran)
[DETAIL] (3-5 poin konkret atau kalimat persuasif tentang topik ini, berdasarkan analisis produk \u2014 maks 50 kata)
[MICRO TIP] (fakta menarik, angka, atau testimoni singkat yang memperkuat slide ini)

[VISUAL PENDUKUNG]: Deskripsikan visual yang relevan dengan topik \u2014 bisa berupa: preview konten/materi di dalam produk (screenshot mockup), infografis ringkas manfaat, before/after visual, icon-based layout, atau ilustrasi yang mewakili manfaat produk ini secara visual.`;
    }
    let antiDuplikatKontenSection = "";
    if (previousSlideContentSummaries.length > 0) {
      antiDuplikatKontenSection = `
=== ANTI-DUPLIKAT KONTEN ===
Slide sebelumnya sudah membahas:
${previousSlideContentSummaries.map((s, idx) => `  - Slide ${idx + 1}: ${s}`).join("\n")}
Slide ${i} WAJIB membahas aspek yang berbeda dan baru.`;
    }
    let antiDuplikatVisualSection = "";
    if (previousSlideVisualSummaries.length > 0) {
      antiDuplikatVisualSection = `
=== ANTI-DUPLIKAT VISUAL ===
Visual slide sebelumnya:
${previousSlideVisualSummaries.map((s, idx) => `  - Slide ${idx + 1}: ${s}`).join("\n")}
Buat deskripsi visual slide ${i} yang UNIK dan berbeda.`;
    }
    let characterInstruction = "";
    if (shouldAddCharacter && characterPromptText) {
      characterInstruction = `
=== ATURAN KARAKTER (WAJIB KONSISTEN & BERVARIASI) ===
Sertakan karakter berikut di visual slide ${i}:
- Nama: "${characterName}"
- Deskripsi Visual: "${characterPromptText}"
- KONSISTENSI VISUAL MUTLAK: Karakter harus memiliki penampilan yang konsisten di semua slide: warna baju/pakaian, gaya rambut, warna rambut, warna kulit, ekspresi dasar, dan aksesoris harus 100% konsisten. Pakaian karakter wajib menggunakan kombinasi warna ${color1 || "brand"} dan ${color2 || "brand"}.
- VARIASI PELETAKAN & POSE: Posisi (peletakan) dan pose karakter HARUS berbeda-beda/bervariasi di setiap slide agar tidak membosankan atau terlihat seperti duplikat. (Contoh: jika slide 1 di kanan menunjuk ke kiri, slide 2 di kiri sedang memegang laptop, slide 3 close-up ekspresi/sedang mengetik, dst.).
- PENTING: Jangan menaruh karakter di posisi atau pose yang sama di dua slide berbeda.`;
    } else {
      characterInstruction = `
=== ATURAN KARAKTER: TIDAK ADA KARAKTER ===
DILARANG menampilkan karakter manusia, avatar, atau maskot.
Visual hanya boleh berisi produk digital, mockup, elemen grafis, atau ilustrasi benda.`;
    }
    const promptInstruction = `Kamu adalah Senior Graphic Designer & Digital Marketing Specialist spesialis produk digital Indonesia.
Buat data untuk SLIDE ${i} dari ${validatedSlideCount} slide konten promosi produk digital.

Peran Slide: ${slideRole}
Produk: "${aiTitle}" | Brand: ${brand || "-"} | Harga: ${price || "Harga spesial"} | Audiens: ${targetAudience}

${mandatoryRules}
${terminology}
${audienceInstruction}

Orientasi: ${orientationSpec.spec}
Gaya Desain: ${designStyle}
${stylePromptText ? `Style Guide: "${stylePromptText}"` : ""}
${color1 && color2 ? `ATURAN WARNA MUTLAK: Gunakan HANYA paduan 2 warna utama yaitu ${color1} dan ${color2}. Jangan campur warna lain di luar paduan ini untuk elemen utama/latar belakang/grafis/teks, demi hasil paduan yang sempurna.` : ""}

Context Produk Digital:
${contextProduk}

Konsep Visual Global (konsisten di semua slide):
"${mainVisualConcept}"
${antiDuplikatKontenSection}
${antiDuplikatVisualSection}
${characterInstruction}

=== INSTRUKSI KONTEN SLIDE ${i} ===
${contentInstruction}

=== FORMAT OUTPUT WAJIB: JSON ===
Kembalikan HANYA JSON murni, tanpa teks apapun di luar JSON. Mulai dengan { dan akhiri dengan }.

{
  "slideNumber": ${i},
  "totalSlides": ${validatedSlideCount},
  "role": "${slideRole}",
  "content": {
    "headline": "[Judul poin \u2014 maks 8 kata]",
    "subtext": "[Pembuka \u2014 1-2 kalimat]",
    "detail": "[Penjelasan utama \u2014 3-5 kalimat atau poin]",
    "microTip": "[Tips/fakta/badge singkat]"
  },
  "imagePrompt": {
    "visual": "[Deskripsi visual lengkap dan detail untuk slide ini]",
    "visualSummary": "[Ringkasan visual 1 kalimat]",
    "contentSummary": "[Ringkasan konten 1 kalimat]",
    "negativePrompt": "[Negative prompt standar]"
  }
}`;
    const digitalSosmedAturan = buildDigitalSosmedAturan(i, validatedSlideCount);
    try {
      const slideResult = await callGroqApiWithRotation(promptInstruction);
      let parsed = null;
      if (slideResult) {
        const jsonMatch = slideResult.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            parsed = JSON.parse(jsonMatch[0]);
          } catch (parseErr) {
            console.warn(`Digital Product Slide ${i} JSON parse error:`, parseErr);
          }
        }
      }
      const slideOutput = formatSlideOutput({
        slideNumber: parsed?.slideNumber ?? i,
        totalSlides: parsed?.totalSlides ?? validatedSlideCount,
        role: parsed?.role ?? slideRole,
        designStyleName: designStyle,
        orientationSpec,
        stylePromptText,
        visualContent: parsed?.imagePrompt?.visual ?? `Visual produk digital premium Slide ${i} untuk ${aiTitle}`,
        negativePrompt: parsed?.imagePrompt?.negativePrompt ?? "low quality, blurry, pixelated, noisy, cluttered, low contrast, text errors, watermark",
        headline: parsed?.content?.headline ?? (i === 1 ? aiTitle : `Slide ${i}`),
        subtext: parsed?.content?.subtext ?? "",
        detail: parsed?.content?.detail ?? "",
        microTip: parsed?.content?.microTip ?? "",
        isPromotional,
        targetAudience,
        mandatoryRules,
        mediaSosialAturan: digitalSosmedAturan,
        customInstruksiAwalWajib: DIGITAL_PRODUCT_SYSTEM_PROTOCOL
      });
      const contentSummary = parsed?.imagePrompt?.contentSummary || slideOutput.teks_dalam_gambar.headline.substring(0, 100);
      const visualSummary = parsed?.imagePrompt?.visualSummary || slideOutput.deskripsi_visual.objek_dan_konteks.substring(0, 120);
      previousSlideContentSummaries.push(contentSummary);
      previousSlideVisualSummaries.push(visualSummary);
      finalPromptParts.push(JSON.stringify(slideOutput));
    } catch (e) {
      console.error(`Digital Product Slide ${i} generation failed:`, e);
      const fallbackSlide = formatSlideOutput({
        slideNumber: i,
        totalSlides: validatedSlideCount,
        role: slideRole,
        designStyleName: designStyle,
        orientationSpec,
        stylePromptText,
        visualContent: `Visual premium produk digital Slide ${i}: ${aiTitle}`,
        negativePrompt: "low quality, blurry, pixelated, noisy, cluttered",
        headline: i === 1 ? aiTitle : `Slide ${i}: Info Produk`,
        subtext: "",
        detail: "",
        microTip: "",
        isPromotional,
        targetAudience,
        mandatoryRules,
        mediaSosialAturan: buildDigitalSosmedAturan(i, validatedSlideCount),
        customInstruksiAwalWajib: DIGITAL_PRODUCT_SYSTEM_PROTOCOL
      });
      previousSlideContentSummaries.push(`Slide ${i}: ${slideRole}`);
      previousSlideVisualSummaries.push(`${slideRole} visual`);
      finalPromptParts.push(JSON.stringify(fallbackSlide));
    }
  }
  const styleName = designStyle.split("|")[0].trim();
  const styleAttributes = getStyleAttributes(styleName, stylePromptText);
  const fullCarouselObject = {
    aturan_global: {
      platform_target: "Instagram Carousel Post",
      peran: "Kamu adalah Senior Graphic Designer & Art Director yang mengetahui kombinasi warna, tipografi, dan estetika visual premium.",
      target_audiens: targetAudience,
      jenis_konten: contentType || "Produk Digital",
      larangan: "DILARANG KERAS memodifikasi produk asli atau mengubah warna brand."
    },
    gaya_visual_global: {
      gaya_dominan: styleAttributes.gaya_dominan,
      gaya_visual_wajib: styleAttributes.gaya_visual_wajib,
      layout_dan_hierarki: styleAttributes.layout_dan_hierarki,
      elemen_pendukung: styleAttributes.elemen_infografis_pendukung,
      palet_warna: styleAttributes.palet_warna,
      tipografi: styleAttributes.tipografi,
      pencahayaan_kamera: styleAttributes.pencahayaan_dan_kamera,
      kedalaman_visual: styleAttributes.kedalaman_visual,
      dimensi_canvas: `Canvas ${orientationSpec.widthHint}px, Aspect Ratio ${orientationSpec.ratio} (--ar ${orientationSpec.ratio})`,
      negative_prompt: "low quality, blurry, pixelated, noisy, cluttered, low contrast, text errors, watermark"
    },
    layout_media_sosial_global: {
      footer_bawah: `TikTok: ${DIGITAL_SOSMED_INFO.tiktok} | Instagram: ${DIGITAL_SOSMED_INFO.instagram} | Web: ${DIGITAL_SOSMED_INFO.website}`
    },
    daftar_slide: finalPromptParts.map((p) => {
      try {
        return JSON.parse(p);
      } catch (_) {
        return p;
      }
    })
  };
  const generatedPrompt = JSON.stringify(fullCarouselObject);
  let instagramCaption = "";
  let tiktokCaption = "";
  let hashtags = "";
  if (shouldGenerateCaption) {
    try {
      const captionPromptText = `Kamu adalah Social Media Copywriter Indonesia spesialis produk digital.
Buat caption untuk konten promosi produk digital:
- Produk: "${aiTitle}"
- Deskripsi: ${description}
${brand ? `- Brand/Penjual: ${brand}` : ""}
${price ? `- Harga: ${price}` : ""}
- Target Audiens: ${targetAudience}
- Gaya: ${designStyle}

SOSMED PEMILIK (WAJIB disebut di caption):
- Website: ${DIGITAL_SOSMED_INFO.website}
- TikTok: ${DIGITAL_SOSMED_INFO.tiktok}
- Instagram: ${DIGITAL_SOSMED_INFO.instagram}

ATURAN CAPTION:
- Bahasa Indonesia non-formal, santai, persuasif
- Sertakan info sosmed di bagian akhir caption
- Pakai emoji yang relevan

Buat:
1. CAPTION INSTAGRAM: 3-4 paragraf, ada hook kuat, CTA beli/DM, mention sosmed. Maks 2200 karakter.
2. CAPTION TIKTOK: Singkat, viral-friendly, maks 150 karakter, sertakan TikTok handle.
3. HASHTAGS: 15-20 hashtag campuran (produk digital, jualan online, dll).

Format PERSIS seperti ini:
===INSTAGRAM_CAPTION===
[isi]
===TIKTOK_CAPTION===
[isi]
===HASHTAGS===
[hashtag]`;
      const captionResult = await callGroqApiWithRotation(captionPromptText);
      if (captionResult) {
        const igMatch = captionResult.match(/===INSTAGRAM_CAPTION===\s*([\s\S]*?)(?====|$)/);
        const ttMatch = captionResult.match(/===TIKTOK_CAPTION===\s*([\s\S]*?)(?====|$)/);
        const hashMatch = captionResult.match(/===HASHTAGS===\s*([\s\S]*?)(?====|$)/);
        instagramCaption = igMatch ? igMatch[1].trim() : "";
        tiktokCaption = ttMatch ? ttMatch[1].trim() : "";
        hashtags = hashMatch ? hashMatch[1].trim() : "";
      }
    } catch (captionErr) {
      console.warn("Digital product caption generation failed:", captionErr);
    }
  }
  const historyId = (0, import_uuid9.v4)();
  const finalContentType = contentType || "Produk Digital";
  try {
    await query(
      `INSERT INTO prompt_histories (id, userId, title, contentType, slideCount, designStyle, targetAudience, language, generatedPrompt, imageOrientation, instagramCaption, tiktokCaption, hashtags, sourceImageUrl, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'ID', ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        historyId,
        userId,
        aiTitle,
        finalContentType,
        validatedSlideCount,
        designStyle,
        targetAudience,
        generatedPrompt,
        "Persegi (Square 1:1)",
        instagramCaption,
        tiktokCaption,
        hashtags,
        imageUrls.length > 0 ? imageUrls.join(",") : null
      ]
    );
    await query(
      "INSERT INTO activity_logs (id, userId, action, metadata, createdAt) VALUES (?, ?, ?, ?, NOW())",
      [(0, import_uuid9.v4)(), userId, "PROMPT_GENERATED", JSON.stringify({ historyId, isDigitalProduct: true })]
    );
    return res.status(201).json({
      id: historyId,
      userId,
      title: aiTitle,
      contentType: finalContentType,
      slideCount: validatedSlideCount,
      designStyle,
      targetAudience,
      language: "ID",
      generatedPrompt,
      imageOrientation: "Persegi (Square 1:1)",
      instagramCaption,
      tiktokCaption,
      hashtags,
      imageUrl: null,
      sourceImageUrl: imageUrls.length > 0 ? imageUrls.join(",") : null,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      isFavorite: false,
      // Info sosmed untuk referensi di app
      digitalSosmed: {
        website: DIGITAL_SOSMED_INFO.website,
        tiktok: DIGITAL_SOSMED_INFO.tiktok,
        instagram: DIGITAL_SOSMED_INFO.instagram
      }
    });
  } catch (error) {
    console.error("Save digital product prompt history error:", error);
    return res.status(500).json({ message: "Server error: " + (error.message || error.toString()) });
  }
};

// src/controllers/optionsController.ts
var import_uuid10 = require("uuid");
var import_fs3 = __toESM(require("fs"));
var import_path4 = __toESM(require("path"));

// src/utils/pathHelper.ts
var import_path2 = __toESM(require("path"));
var import_fs = __toESM(require("fs"));
var getAssetsPath = () => {
  const candidates = [
    import_path2.default.resolve(__dirname, "../../assets"),
    import_path2.default.resolve(__dirname, "assets"),
    import_path2.default.resolve(__dirname, "../public_html/assets"),
    import_path2.default.resolve(__dirname, "../../public_html/assets"),
    import_path2.default.resolve(process.cwd(), "../public_html/assets"),
    import_path2.default.resolve(process.cwd(), "../../public_html/assets"),
    import_path2.default.resolve(process.cwd(), "backednya/assets"),
    import_path2.default.resolve(process.cwd(), "assets")
  ];
  const assetsPath = candidates.find((candidate) => import_fs.default.existsSync(candidate)) || candidates[0];
  if (!import_fs.default.existsSync(assetsPath)) {
    import_fs.default.mkdirSync(assetsPath, { recursive: true });
  }
  return assetsPath;
};

// src/utils/assetCleanup.ts
var import_fs2 = __toESM(require("fs"));
var import_path3 = __toESM(require("path"));
var getLocalAssetRelativePath = (url) => {
  if (!url) return null;
  let parsedPath = url;
  if (url.startsWith("http://") || url.startsWith("https://")) {
    try {
      const u = new URL(url);
      parsedPath = u.pathname;
    } catch (_) {
      return null;
    }
  }
  parsedPath = parsedPath.replace(/\\/g, "/");
  parsedPath = parsedPath.replace(/^\/+/, "");
  let resolvedPath = "";
  if (parsedPath.startsWith("assets/")) {
    resolvedPath = import_path3.default.join(getAssetsPath(), parsedPath.substring("assets/".length));
  } else {
    resolvedPath = import_path3.default.join(getAssetsPath(), parsedPath);
  }
  return resolvedPath;
};
var isAssetReferenced = async (filePath) => {
  const relativeFromAssets = import_path3.default.relative(getAssetsPath(), filePath).replace(/\\/g, "/");
  const searchPaths = [
    relativeFromAssets,
    `assets/${relativeFromAssets}`,
    `/assets/${relativeFromAssets}`,
    import_path3.default.basename(filePath)
  ];
  const tablesAndColumns = [
    { table: "characters", column: "imageUrl" },
    { table: "design_styles", column: "imageUrl" },
    { table: "prompt_histories", column: "imageUrl" },
    { table: "prompt_histories", column: "sourceImageUrl" },
    { table: "users", column: "avatarUrl" },
    { table: "templates", column: "thumbnailUrl" },
    { table: "uploaded_images", column: "url" }
  ];
  for (const searchPath of searchPaths) {
    const likePattern = `%${searchPath}%`;
    for (const tc of tablesAndColumns) {
      try {
        const sql = `SELECT COUNT(*) as count FROM ${tc.table} WHERE ${tc.column} LIKE ?`;
        const result = await query(sql, [likePattern]);
        const count = parseInt(result.rows[0]?.count || "0", 10);
        if (count > 0) {
          return true;
        }
      } catch (err) {
      }
    }
  }
  return false;
};
var cleanUnusedAsset = async (imageUrl) => {
  if (!imageUrl) return false;
  const filePath = getLocalAssetRelativePath(imageUrl);
  if (filePath && import_fs2.default.existsSync(filePath)) {
    const referenced = await isAssetReferenced(filePath);
    if (!referenced) {
      try {
        import_fs2.default.unlinkSync(filePath);
        console.log(`Auto-deleted unused local asset file: ${filePath}`);
        return true;
      } catch (err) {
        console.error(`Failed to delete local asset file: ${filePath}`, err);
      }
    }
  }
  return false;
};
var cleanAllUnusedAssets = async () => {
  let deletedCount = 0;
  const uploadsDir = import_path3.default.join(getAssetsPath(), "uploads");
  const charactersDir = import_path3.default.join(getAssetsPath(), "images/characters");
  const stylesDir = import_path3.default.join(getAssetsPath(), "images/styles");
  const directories = [uploadsDir, charactersDir, stylesDir];
  for (const dir of directories) {
    if (import_fs2.default.existsSync(dir)) {
      const files = import_fs2.default.readdirSync(dir);
      for (const file of files) {
        const filePath = import_path3.default.join(dir, file);
        const stat = import_fs2.default.statSync(filePath);
        if (stat.isFile()) {
          const referenced = await isAssetReferenced(filePath);
          if (!referenced) {
            try {
              import_fs2.default.unlinkSync(filePath);
              deletedCount++;
              console.log(`General cleanup: Deleted unused asset file: ${filePath}`);
            } catch (err) {
              console.error(`General cleanup: Failed to delete: ${filePath}`, err);
            }
          }
        }
      }
    }
  }
  return deletedCount;
};

// src/controllers/optionsController.ts
var getTargetAudiences = async (req, res) => {
  try {
    const result = await query("SELECT id, name FROM target_audiences ORDER BY name ASC");
    return res.json(result.rows);
  } catch (error) {
    console.error("getTargetAudiences error:", error);
    let details = error.message || error.toString();
    if (error.errors && Array.isArray(error.errors)) {
      details += " (" + error.errors.map((e) => e.message || e.toString()).join(", ") + ")";
    }
    return res.status(500).json({ message: "Server error: " + details });
  }
};
var createTargetAudience = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "Name is required." });
  try {
    const existing = await query("SELECT id FROM target_audiences WHERE LOWER(name) = LOWER(?)", [name.trim()]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: `Target Audiens "${name}" sudah ada.` });
    }
    const id = (0, import_uuid10.v4)();
    await query("INSERT INTO target_audiences (id, name) VALUES (?, ?)", [id, name.trim()]);
    return res.status(201).json({ id, name: name.trim() });
  } catch (error) {
    console.error("createTargetAudience error:", error);
    return res.status(500).json({ message: "Server error: " + (error.message || error.toString()) });
  }
};
var updateTargetAudience = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "Name is required." });
  try {
    const existing = await query("SELECT id FROM target_audiences WHERE LOWER(name) = LOWER(?) AND id != ?", [name.trim(), id]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: `Target Audiens "${name}" sudah ada.` });
    }
    await query("UPDATE target_audiences SET name = ? WHERE id = ?", [name.trim(), id]);
    return res.json({ id, name: name.trim() });
  } catch (error) {
    console.error("updateTargetAudience error:", error);
    return res.status(500).json({ message: "Server error: " + (error.message || error.toString()) });
  }
};
var deleteTargetAudience = async (req, res) => {
  const { id } = req.params;
  try {
    await query("DELETE FROM target_audiences WHERE id = ?", [id]);
    return res.json({ message: "Target audiens berhasil dihapus." });
  } catch (error) {
    console.error("deleteTargetAudience error:", error);
    return res.status(500).json({ message: "Server error: " + (error.message || error.toString()) });
  }
};
var getDesignStyles = async (req, res) => {
  try {
    const result = await query("SELECT id, name, description, prompt, imageUrl FROM design_styles ORDER BY name ASC");
    return res.json(result.rows);
  } catch (error) {
    console.error("getDesignStyles error:", error);
    return res.status(500).json({ message: "Server error: " + (error.message || error.toString()) });
  }
};
var createDesignStyle = async (req, res) => {
  const { name, description, prompt, imageUrl } = req.body;
  if (!name) return res.status(400).json({ message: "Name is required." });
  try {
    const existing = await query("SELECT id FROM design_styles WHERE LOWER(name) = LOWER(?)", [name.trim()]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: `Gaya Desain "${name}" sudah ada.` });
    }
    const id = (0, import_uuid10.v4)();
    await query("INSERT INTO design_styles (id, name, description, prompt, imageUrl) VALUES (?, ?, ?, ?, ?)", [id, name.trim(), description || null, prompt || null, imageUrl || null]);
    return res.status(201).json({ id, name: name.trim(), description, prompt, imageUrl });
  } catch (error) {
    console.error("createDesignStyle error:", error);
    return res.status(500).json({ message: "Server error: " + (error.message || error.toString()) });
  }
};
var updateDesignStyle = async (req, res) => {
  const { id } = req.params;
  const { name, description, prompt, imageUrl } = req.body;
  if (!name) return res.status(400).json({ message: "Name is required." });
  try {
    const existing = await query("SELECT id FROM design_styles WHERE LOWER(name) = LOWER(?) AND id != ?", [name.trim(), id]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: `Gaya Desain "${name}" sudah ada.` });
    }
    const oldResult = await query("SELECT imageUrl FROM design_styles WHERE id = ?", [id]);
    const oldImageUrl = oldResult.rows[0]?.imageUrl;
    await query("UPDATE design_styles SET name = ?, description = ?, prompt = ?, imageUrl = ? WHERE id = ?", [name.trim(), description || null, prompt || null, imageUrl || null, id]);
    if (oldImageUrl && oldImageUrl !== imageUrl) {
      cleanUnusedAsset(oldImageUrl).catch((err) => console.error("Error cleaning up design style image:", err));
    }
    return res.json({ id, name: name.trim(), description, prompt, imageUrl });
  } catch (error) {
    console.error("updateDesignStyle error:", error);
    return res.status(500).json({ message: "Server error: " + (error.message || error.toString()) });
  }
};
var deleteDesignStyle = async (req, res) => {
  const { id } = req.params;
  try {
    const oldResult = await query("SELECT imageUrl FROM design_styles WHERE id = ?", [id]);
    const oldImageUrl = oldResult.rows[0]?.imageUrl;
    await query("DELETE FROM design_styles WHERE id = ?", [id]);
    if (oldImageUrl) {
      cleanUnusedAsset(oldImageUrl).catch((err) => console.error("Error cleaning up design style image:", err));
    }
    return res.json({ message: "Gaya desain berhasil dihapus." });
  } catch (error) {
    console.error("deleteDesignStyle error:", error);
    return res.status(500).json({ message: "Server error: " + (error.message || error.toString()) });
  }
};
var getGroqApiKeys = async (req, res) => {
  try {
    const result = await query("SELECT id, api_key, is_active, error_count FROM groq_api_keys ORDER BY error_count ASC");
    const mapped = result.rows.map((row) => ({
      id: row.id,
      api_key: row.api_key,
      is_active: row.is_active === 1 || row.is_active === true || row.is_active === "true",
      error_count: parseInt(row.error_count, 10) || 0
    }));
    return res.json(mapped);
  } catch (error) {
    console.error("getGroqApiKeys error:", error);
    return res.status(500).json({ message: "Server error: " + (error.message || error.toString()) });
  }
};
var createGroqApiKey = async (req, res) => {
  const { apiKey } = req.body;
  if (!apiKey) return res.status(400).json({ message: "API Key is required." });
  try {
    const existing = await query("SELECT id FROM groq_api_keys WHERE api_key = ?", [apiKey.trim()]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: "API Key tersebut sudah ditambahkan sebelumnya." });
    }
    const id = (0, import_uuid10.v4)();
    await query(
      "INSERT INTO groq_api_keys (id, api_key, is_active, error_count) VALUES (?, ?, ?, ?)",
      [id, apiKey.trim(), true, 0]
    );
    return res.status(201).json({ id, api_key: apiKey.trim(), is_active: true, error_count: 0 });
  } catch (error) {
    console.error("createGroqApiKey error:", error);
    return res.status(500).json({ message: "Server error: " + (error.message || error.toString()) });
  }
};
var deleteGroqApiKey = async (req, res) => {
  const { id } = req.params;
  try {
    await query("DELETE FROM groq_api_keys WHERE id = ?", [id]);
    return res.json({ message: "API Key berhasil dihapus." });
  } catch (error) {
    console.error("deleteGroqApiKey error:", error);
    return res.status(500).json({ message: "Server error: " + (error.message || error.toString()) });
  }
};
var resetGroqApiKeyErrors = async (req, res) => {
  const { id } = req.params;
  try {
    await query("UPDATE groq_api_keys SET error_count = 0 WHERE id = ?", [id]);
    return res.json({ message: "Error count berhasil direset." });
  } catch (error) {
    console.error("resetGroqApiKeyErrors error:", error);
    return res.status(500).json({ message: "Server error: " + (error.message || error.toString()) });
  }
};
var getThemes = async (req, res) => {
  try {
    const { category } = req.query;
    let sql = "SELECT id, name, category, description, prompt, imageUrl FROM themes";
    const params = [];
    if (category) {
      sql += " WHERE LOWER(category) = LOWER(?)";
      params.push(category.trim());
    }
    sql += " ORDER BY name ASC";
    const result = await query(sql, params);
    return res.json(result.rows);
  } catch (error) {
    console.error("getThemes error:", error);
    return res.status(500).json({ message: "Server error: " + (error.message || error.toString()) });
  }
};
var createTheme = async (req, res) => {
  const { name, category, description, prompt, imageUrl } = req.body;
  if (!name || !category) return res.status(400).json({ message: "Name and Category are required." });
  try {
    const existing = await query("SELECT id FROM themes WHERE LOWER(name) = LOWER(?)", [name.trim()]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: `Tema "${name}" sudah ada.` });
    }
    const id = (0, import_uuid10.v4)();
    await query("INSERT INTO themes (id, name, category, description, prompt, imageUrl) VALUES (?, ?, ?, ?, ?, ?)", [id, name.trim(), category.trim().toUpperCase(), description || null, prompt || null, imageUrl || null]);
    return res.status(201).json({ id, name: name.trim(), category: category.trim().toUpperCase(), description, prompt, imageUrl });
  } catch (error) {
    console.error("createTheme error:", error);
    return res.status(500).json({ message: "Server error: " + (error.message || error.toString()) });
  }
};
var updateTheme = async (req, res) => {
  const { id } = req.params;
  const { name, category, description, prompt, imageUrl } = req.body;
  if (!name || !category) return res.status(400).json({ message: "Name and Category are required." });
  try {
    const existing = await query("SELECT id FROM themes WHERE LOWER(name) = LOWER(?) AND id != ?", [name.trim(), id]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: `Tema "${name}" sudah ada.` });
    }
    const oldResult = await query("SELECT imageUrl FROM themes WHERE id = ?", [id]);
    const oldImageUrl = oldResult.rows[0]?.imageUrl;
    await query("UPDATE themes SET name = ?, category = ?, description = ?, prompt = ?, imageUrl = ? WHERE id = ?", [name.trim(), category.trim().toUpperCase(), description || null, prompt || null, imageUrl || null, id]);
    if (oldImageUrl && oldImageUrl !== imageUrl) {
      cleanUnusedAsset(oldImageUrl).catch((err) => console.error("Error cleaning up theme image:", err));
    }
    return res.json({ id, name: name.trim(), category: category.trim().toUpperCase(), description, prompt, imageUrl });
  } catch (error) {
    console.error("updateTheme error:", error);
    return res.status(500).json({ message: "Server error: " + (error.message || error.toString()) });
  }
};
var deleteTheme = async (req, res) => {
  const { id } = req.params;
  try {
    const oldResult = await query("SELECT imageUrl FROM themes WHERE id = ?", [id]);
    const oldImageUrl = oldResult.rows[0]?.imageUrl;
    await query("DELETE FROM themes WHERE id = ?", [id]);
    if (oldImageUrl) {
      cleanUnusedAsset(oldImageUrl).catch((err) => console.error("Error cleaning up theme image:", err));
    }
    return res.json({ message: "Tema berhasil dihapus." });
  } catch (error) {
    console.error("deleteTheme error:", error);
    return res.status(500).json({ message: "Server error: " + (error.message || error.toString()) });
  }
};
var normalizeLocalAssetUrl = (imageUrl) => {
  if (typeof imageUrl !== "string") return null;
  const trimmed = imageUrl.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const normalized = trimmed.replace(/\\/g, "/").replace(/^\/+/, "");
  const relativePath = normalized.startsWith("assets/") ? normalized.substring("assets/".length) : normalized;
  const fullPath = import_path4.default.join(getAssetsPath(), relativePath);
  return import_fs3.default.existsSync(fullPath) ? normalized : null;
};
var getCharacters = async (req, res) => {
  try {
    const result = await query("SELECT id, name, prompt, imageUrl, createdAt, updatedAt FROM characters ORDER BY name ASC");
    const rows = result.rows.map((row) => ({
      ...row,
      imageUrl: normalizeLocalAssetUrl(row.imageUrl)
    }));
    return res.json(rows);
  } catch (error) {
    console.error("getCharacters error:", error);
    return res.status(500).json({ message: "Server error: " + (error.message || error.toString()) });
  }
};
var createCharacter = async (req, res) => {
  const { name, prompt, imageUrl } = req.body;
  if (!name || !prompt) return res.status(400).json({ message: "Name and Prompt are required." });
  try {
    const existing = await query("SELECT id FROM characters WHERE LOWER(name) = LOWER(?)", [name.trim()]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: `Karakter "${name}" sudah ada.` });
    }
    const id = (0, import_uuid10.v4)();
    await query("INSERT INTO characters (id, name, prompt, imageUrl) VALUES (?, ?, ?, ?)", [id, name.trim(), prompt.trim(), imageUrl || null]);
    return res.status(201).json({ id, name: name.trim(), prompt: prompt.trim(), imageUrl });
  } catch (error) {
    console.error("createCharacter error:", error);
    return res.status(500).json({ message: "Server error: " + (error.message || error.toString()) });
  }
};
var updateCharacter = async (req, res) => {
  const { id } = req.params;
  const { name, prompt, imageUrl } = req.body;
  if (!name || !prompt) return res.status(400).json({ message: "Name and Prompt are required." });
  try {
    const existing = await query("SELECT id FROM characters WHERE LOWER(name) = LOWER(?) AND id != ?", [name.trim(), id]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: `Karakter "${name}" sudah ada.` });
    }
    const oldResult = await query("SELECT imageUrl FROM characters WHERE id = ?", [id]);
    const oldImageUrl = oldResult.rows[0]?.imageUrl;
    await query("UPDATE characters SET name = ?, prompt = ?, imageUrl = ?, updatedAt = NOW() WHERE id = ?", [name.trim(), prompt.trim(), imageUrl || null, id]);
    if (oldImageUrl && oldImageUrl !== imageUrl) {
      cleanUnusedAsset(oldImageUrl).catch((err) => console.error("Error cleaning up character image:", err));
    }
    return res.json({ id, name: name.trim(), prompt: prompt.trim(), imageUrl });
  } catch (error) {
    console.error("updateCharacter error:", error);
    return res.status(500).json({ message: "Server error: " + (error.message || error.toString()) });
  }
};
var deleteCharacter = async (req, res) => {
  const { id } = req.params;
  try {
    const oldResult = await query("SELECT imageUrl FROM characters WHERE id = ?", [id]);
    const oldImageUrl = oldResult.rows[0]?.imageUrl;
    await query("DELETE FROM characters WHERE id = ?", [id]);
    if (oldImageUrl) {
      cleanUnusedAsset(oldImageUrl).catch((err) => console.error("Error cleaning up character image:", err));
    }
    return res.json({ message: "Karakter berhasil dihapus." });
  } catch (error) {
    console.error("deleteCharacter error:", error);
    return res.status(500).json({ message: "Server error: " + (error.message || error.toString()) });
  }
};
var getDigitalProductTypes = async (req, res) => {
  try {
    const result = await query("SELECT id, name FROM digital_product_types ORDER BY name ASC");
    return res.json(result.rows);
  } catch (error) {
    console.error("getDigitalProductTypes error:", error);
    return res.status(500).json({ message: "Server error: " + (error.message || error.toString()) });
  }
};

// src/controllers/categoryController.ts
var import_uuid11 = require("uuid");
var getCategories = async (req, res) => {
  try {
    const result = await query(
      `SELECT c.id, c.name, c.slug, c.icon, c.color,
              COUNT(t.id) AS templates_count
       FROM categories c
       LEFT JOIN templates t ON t.categoryId = c.id
       GROUP BY c.id, c.name, c.slug, c.icon, c.color
       ORDER BY c.name ASC`
    );
    const categories = result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      icon: row.icon,
      color: row.color,
      templatesCount: parseInt(row.templates_count, 10) || 0
    }));
    return res.json(categories);
  } catch (error) {
    console.error("getCategories error:", error);
    return res.status(500).json({ message: "Server error: " + (error.message || error.toString()) });
  }
};
var createCategory = async (req, res) => {
  const { name, icon, color } = req.body;
  if (!name) return res.status(400).json({ message: "Name is required." });
  try {
    const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const existing = await query("SELECT id FROM categories WHERE LOWER(name) = LOWER(?)", [name.trim()]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: `Kategori "${name}" sudah ada.` });
    }
    const id = (0, import_uuid11.v4)();
    await query(
      "INSERT INTO categories (id, name, slug, icon, color) VALUES (?, ?, ?, ?, ?)",
      [id, name.trim(), slug, icon || "folder", color || "#6366F1"]
    );
    return res.status(201).json({ id, name: name.trim(), slug, icon: icon || "folder", color: color || "#6366F1" });
  } catch (error) {
    console.error("createCategory error:", error);
    return res.status(500).json({ message: "Server error: " + (error.message || error.toString()) });
  }
};
var updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, icon, color } = req.body;
  if (!name) return res.status(400).json({ message: "Name is required." });
  try {
    const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const existing = await query("SELECT id FROM categories WHERE LOWER(name) = LOWER(?) AND id != ?", [name.trim(), id]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: `Kategori "${name}" sudah ada.` });
    }
    await query(
      "UPDATE categories SET name = ?, slug = ?, icon = ?, color = ? WHERE id = ?",
      [name.trim(), slug, icon || "folder", color || "#6366F1", id]
    );
    return res.json({ id, name: name.trim(), slug, icon: icon || "folder", color: color || "#6366F1" });
  } catch (error) {
    console.error("updateCategory error:", error);
    return res.status(500).json({ message: "Server error: " + (error.message || error.toString()) });
  }
};
var deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    await query("DELETE FROM categories WHERE id = ?", [id]);
    return res.json({ message: "Kategori berhasil dihapus." });
  } catch (error) {
    console.error("deleteCategory error:", error);
    return res.status(500).json({ message: "Server error: " + (error.message || error.toString()) });
  }
};

// src/controllers/templateController.ts
var import_uuid12 = require("uuid");
var getTemplates = async (req, res) => {
  const categoryId = req.query.categoryId;
  const isPremium = req.query.isPremium;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const offset = (page - 1) * limit;
  const conditions = [];
  const params = [];
  if (categoryId) {
    conditions.push("t.categoryId = ?");
    params.push(categoryId);
  }
  if (isPremium !== void 0) {
    const isPremiumBool = isPremium === "true";
    conditions.push("t.isPremium = ?");
    params.push(isPremiumBool ? 1 : 0);
  }
  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  try {
    const templatesResult = await query(
      `SELECT t.id, t.title, t.description, t.content, t.thumbnailUrl,
              t.categoryId, t.isPremium, t.usageCount, t.createdAt, t.updatedAt
       FROM templates t
       ${whereClause}
       ORDER BY t.usageCount DESC, t.createdAt DESC
       LIMIT ${limit} OFFSET ${offset}`,
      params
    );
    const countResult = await query(
      `SELECT COUNT(*) AS count FROM templates t ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].count, 10) || 0;
    const templates = templatesResult.rows.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      content: row.content,
      thumbnailUrl: row.thumbnailUrl,
      categoryId: row.categoryId,
      isPremium: row.isPremium === 1 || row.isPremium === true,
      usageCount: row.usageCount || 0,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      category: null
    }));
    return res.json({
      templates,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("getTemplates error:", error);
    return res.status(500).json({ message: "Server error: " + (error.message || error.toString()) });
  }
};
var searchTemplates = async (req, res) => {
  const searchQuery = req.query.query || "";
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const offset = (page - 1) * limit;
  const searchPattern = `%${searchQuery.toLowerCase()}%`;
  try {
    const result = await query(
      `SELECT t.id, t.title, t.description, t.content, t.thumbnailUrl,
              t.categoryId, t.isPremium, t.usageCount, t.createdAt, t.updatedAt
       FROM templates t
       WHERE LOWER(t.title) LIKE ? OR LOWER(t.description) LIKE ?
       ORDER BY t.usageCount DESC
       LIMIT ${limit} OFFSET ${offset}`,
      [searchPattern, searchPattern]
    );
    const countResult = await query(
      "SELECT COUNT(*) AS count FROM templates WHERE LOWER(title) LIKE ? OR LOWER(description) LIKE ?",
      [searchPattern, searchPattern]
    );
    const total = parseInt(countResult.rows[0].count, 10) || 0;
    const templates = result.rows.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      content: row.content,
      thumbnailUrl: row.thumbnailUrl,
      categoryId: row.categoryId,
      isPremium: row.isPremium === 1 || row.isPremium === true,
      usageCount: row.usageCount || 0,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      category: null
    }));
    return res.json({
      templates,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("searchTemplates error:", error);
    return res.status(500).json({ message: "Server error: " + (error.message || error.toString()) });
  }
};
var getTemplateById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await query(
      `SELECT t.id, t.title, t.description, t.content, t.thumbnailUrl,
              t.categoryId, t.isPremium, t.usageCount, t.createdAt, t.updatedAt
       FROM templates t
       WHERE t.id = ?`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Template tidak ditemukan." });
    }
    const row = result.rows[0];
    return res.json({
      id: row.id,
      title: row.title,
      description: row.description,
      content: row.content,
      thumbnailUrl: row.thumbnailUrl,
      categoryId: row.categoryId,
      isPremium: row.isPremium === 1 || row.isPremium === true,
      usageCount: row.usageCount || 0,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      category: null
    });
  } catch (error) {
    console.error("getTemplateById error:", error);
    return res.status(500).json({ message: "Server error: " + (error.message || error.toString()) });
  }
};
var createTemplate = async (req, res) => {
  const { title, content, categoryId, description, thumbnailUrl } = req.body;
  if (!title || !content || !categoryId) {
    return res.status(400).json({ message: "Title, content, and categoryId are required." });
  }
  const templateId = (0, import_uuid12.v4)();
  try {
    await query(
      `INSERT INTO templates (id, title, description, content, thumbnailUrl, categoryId, isPremium, usageCount, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, false, 0, NOW(), NOW())`,
      [templateId, title, description || null, content, thumbnailUrl || null, categoryId]
    );
    req.params.id = templateId;
    return getTemplateById(req, res);
  } catch (error) {
    console.error("createTemplate error:", error);
    return res.status(500).json({ message: "Server error: " + (error.message || error.toString()) });
  }
};
var deleteTemplate = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await query("DELETE FROM templates WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Template tidak ditemukan" });
    }
    res.json({ message: "Template berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting template:", error);
    res.status(500).json({ message: "Gagal menghapus template" });
  }
};
var updateTemplate = async (req, res) => {
  const { id } = req.params;
  const { title, description, content, thumbnailUrl, categoryId, isPremium } = req.body;
  if (!title || !content) {
    return res.status(400).json({ message: "Title dan content diperlukan" });
  }
  try {
    const isPremiumValue = isPremium ? 1 : 0;
    const result = await query(
      "UPDATE templates SET title = ?, description = ?, content = ?, thumbnailUrl = ?, categoryId = ?, isPremium = ? WHERE id = ?",
      [title, description || null, content, thumbnailUrl || null, categoryId || null, isPremiumValue, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Template tidak ditemukan" });
    }
    res.json({ message: "Template berhasil diperbarui", id });
  } catch (error) {
    console.error("Error updating template:", error);
    res.status(500).json({ message: "Gagal memperbarui template" });
  }
};

// src/controllers/configController.ts
var import_uuid13 = require("uuid");
var getAppConfig = async (req, res) => {
  try {
    const result = await query("SELECT `key`, `value` FROM app_config");
    const config = {};
    result.rows.forEach((row) => {
      config[row.key] = row.value;
    });
    return res.json(config);
  } catch (error) {
    console.error("getAppConfig error:", error);
    return res.status(500).json({ message: "Server error: " + (error.message || error.toString()) });
  }
};
var setAppConfig = async (req, res) => {
  const { key, value } = req.body;
  if (!key || value === void 0) {
    return res.status(400).json({ message: "Key and value are required." });
  }
  try {
    await query(
      `INSERT INTO app_config (\`key\`, \`value\`, updated_at) VALUES (?, ?, NOW())
       ON DUPLICATE KEY UPDATE \`value\` = VALUES(\`value\`), updated_at = NOW()`,
      [key, value]
    );
    return res.json({ key, value });
  } catch (error) {
    console.error("setAppConfig error:", error);
    return res.status(500).json({ message: "Server error: " + (error.message || error.toString()) });
  }
};
var getUserSettings = async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  try {
    await query(
      `INSERT INTO settings (id, userId, theme, createdAt, updatedAt)
       VALUES (?, ?, 'SYSTEM', NOW(), NOW())
       ON DUPLICATE KEY UPDATE id=id`,
      [(0, import_uuid13.v4)(), userId]
    );
    const result = await query(
      "SELECT theme FROM settings WHERE userId = ?",
      [userId]
    );
    if (result.rows.length === 0) {
      return res.json({ theme: "SYSTEM" });
    }
    return res.json({ theme: result.rows[0].theme || "SYSTEM" });
  } catch (error) {
    console.error("getUserSettings error:", error);
    return res.status(500).json({ message: "Server error: " + (error.message || error.toString()) });
  }
};
var updateUserSettings = async (req, res) => {
  const userId = req.user?.userId;
  const { theme } = req.body;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  if (!theme) return res.status(400).json({ message: "Theme is required." });
  try {
    await query(
      `INSERT INTO settings (id, userId, theme, createdAt, updatedAt)
       VALUES (?, ?, ?, NOW(), NOW())
       ON DUPLICATE KEY UPDATE theme = VALUES(theme), updatedAt = NOW()`,
      [(0, import_uuid13.v4)(), userId, theme]
    );
    await query(
      "INSERT INTO activity_logs (id, userId, action, createdAt) VALUES (?, ?, ?, NOW())",
      [(0, import_uuid13.v4)(), userId, "SETTINGS_UPDATED"]
    );
    return res.json({ theme });
  } catch (error) {
    console.error("updateUserSettings error:", error);
    return res.status(500).json({ message: "Server error: " + (error.message || error.toString()) });
  }
};

// src/controllers/uploadController.ts
var import_multer = __toESM(require_multer());
var import_path5 = __toESM(require("path"));
var import_fs4 = __toESM(require("fs"));
var uploadDir = import_path5.default.join(getAssetsPath(), "uploads");
if (!import_fs4.default.existsSync(uploadDir)) {
  import_fs4.default.mkdirSync(uploadDir, { recursive: true });
}
var storage = import_multer.default.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = import_path5.default.extname(file.originalname);
    const shortId = Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
    cb(null, `${shortId}${ext}`);
  }
});
var upload = (0, import_multer.default)({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }
  // 5 MB limit
});
var copyToAllAssetCandidates = (filename, sourcePath) => {
  const candidates = [
    import_path5.default.resolve(__dirname, "../../assets"),
    import_path5.default.resolve(__dirname, "assets"),
    import_path5.default.resolve(__dirname, "../public_html/assets"),
    import_path5.default.resolve(__dirname, "../../public_html/assets"),
    import_path5.default.resolve(process.cwd(), "../public_html/assets"),
    import_path5.default.resolve(process.cwd(), "../../public_html/assets"),
    import_path5.default.resolve(process.cwd(), "backednya/assets"),
    import_path5.default.resolve(process.cwd(), "assets")
  ];
  for (const candidate of candidates) {
    if (import_fs4.default.existsSync(candidate)) {
      const targetDir = import_path5.default.join(candidate, "uploads");
      if (!import_fs4.default.existsSync(targetDir)) {
        try {
          import_fs4.default.mkdirSync(targetDir, { recursive: true });
        } catch (e) {
          console.error(`Failed to create directory ${targetDir}:`, e);
        }
      }
      const targetPath = import_path5.default.join(targetDir, filename);
      if (import_path5.default.resolve(sourcePath) !== import_path5.default.resolve(targetPath)) {
        try {
          import_fs4.default.copyFileSync(sourcePath, targetPath);
          console.log(`Successfully synced asset to: ${targetPath}`);
        } catch (e) {
          console.error(`Failed to sync asset to ${targetPath}:`, e);
        }
      }
    }
  }
};
var uploadFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY || "";
  const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT || "";
  if (!privateKey || !urlEndpoint) {
    const fileUrl = `assets/uploads/${req.file.filename}`;
    copyToAllAssetCandidates(req.file.filename, req.file.path);
    return res.json({ url: fileUrl, message: "File uploaded locally (No ImageKit configuration)" });
  }
  try {
    const fileBuffer = import_fs4.default.readFileSync(req.file.path);
    const base64File = fileBuffer.toString("base64");
    const authHeader = "Basic " + Buffer.from(privateKey + ":").toString("base64");
    const payload = JSON.stringify({
      file: `data:${req.file.mimetype};base64,${base64File}`,
      fileName: req.file.filename,
      useUniqueFileName: true
    });
    const https2 = require("https");
    const url = new URL("https://upload.imagekit.io/api/v1/files/upload");
    const options = {
      method: "POST",
      hostname: url.hostname,
      path: url.pathname,
      headers: {
        "Authorization": authHeader,
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(payload)
      }
    };
    const reqUpload = https2.request(options, (resUpload) => {
      let chunks = "";
      resUpload.on("data", (chunk) => {
        chunks += chunk;
      });
      resUpload.on("end", () => {
        try {
          const parsed = JSON.parse(chunks);
          if (resUpload.statusCode === 200 && parsed.url) {
            import_fs4.default.unlinkSync(req.file.path);
            return res.json({ url: parsed.url, message: "File uploaded successfully to ImageKit CDN" });
          } else {
            console.error("ImageKit upload error response:", parsed);
            const fileUrl = `assets/uploads/${req.file.filename}`;
            copyToAllAssetCandidates(req.file.filename, req.file.path);
            return res.json({ url: fileUrl, message: "Uploaded locally (ImageKit failed)" });
          }
        } catch (e) {
          console.error("ImageKit parse error:", e);
          const fileUrl = `assets/uploads/${req.file.filename}`;
          copyToAllAssetCandidates(req.file.filename, req.file.path);
          return res.json({ url: fileUrl, message: "Uploaded locally (ImageKit parse error)" });
        }
      });
    });
    reqUpload.on("error", (error) => {
      console.error("ImageKit upload request error:", error);
      const fileUrl = `assets/uploads/${req.file.filename}`;
      copyToAllAssetCandidates(req.file.filename, req.file.path);
      return res.json({ url: fileUrl, message: "Uploaded locally (ImageKit request error)" });
    });
    reqUpload.write(payload);
    reqUpload.end();
  } catch (err) {
    console.error("Upload handler error:", err);
    const fileUrl = `assets/uploads/${req.file.filename}`;
    copyToAllAssetCandidates(req.file.filename, req.file.path);
    return res.json({ url: fileUrl, message: "Uploaded locally (catch)" });
  }
};
var uploadFiles = async (req, res) => {
  if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
    return res.status(400).json({ message: "No files uploaded." });
  }
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY || "";
  const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT || "";
  const results = [];
  for (const file of req.files) {
    if (!privateKey || !urlEndpoint) {
      const fileUrl = `assets/uploads/${file.filename}`;
      copyToAllAssetCandidates(file.filename, file.path);
      results.push({ url: fileUrl, message: "File uploaded locally (No ImageKit configuration)" });
      continue;
    }
    try {
      const fileBuffer = import_fs4.default.readFileSync(file.path);
      const base64File = fileBuffer.toString("base64");
      const authHeader = "Basic " + Buffer.from(privateKey + ":").toString("base64");
      const payload = JSON.stringify({
        file: `data:${file.mimetype};base64,${base64File}`,
        fileName: file.filename,
        useUniqueFileName: true
      });
      const https2 = require("https");
      const url = new URL("https://upload.imagekit.io/api/v1/files/upload");
      const options = {
        method: "POST",
        hostname: url.hostname,
        path: url.pathname,
        headers: {
          "Authorization": authHeader,
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(payload)
        }
      };
      const result = await new Promise((resolve, reject) => {
        const reqUpload = https2.request(options, (resUpload) => {
          let chunks = "";
          resUpload.on("data", (chunk) => {
            chunks += chunk;
          });
          resUpload.on("end", () => {
            try {
              const parsed = JSON.parse(chunks);
              if (resUpload.statusCode === 200 && parsed.url) {
                import_fs4.default.unlinkSync(file.path);
                resolve({ url: parsed.url, message: "File uploaded successfully to ImageKit CDN" });
              } else {
                console.error("ImageKit upload error response:", parsed);
                const fileUrl = `assets/uploads/${file.filename}`;
                copyToAllAssetCandidates(file.filename, file.path);
                resolve({ url: fileUrl, message: "Uploaded locally (ImageKit failed)" });
              }
            } catch (e) {
              console.error("ImageKit parse error:", e);
              const fileUrl = `assets/uploads/${file.filename}`;
              copyToAllAssetCandidates(file.filename, file.path);
              resolve({ url: fileUrl, message: "Uploaded locally (ImageKit parse error)" });
            }
          });
        });
        reqUpload.on("error", (error) => {
          console.error("ImageKit upload request error:", error);
          const fileUrl = `assets/uploads/${file.filename}`;
          copyToAllAssetCandidates(file.filename, file.path);
          resolve({ url: fileUrl, message: "Uploaded locally (ImageKit request error)" });
        });
        reqUpload.write(payload);
        reqUpload.end();
      });
      results.push(result);
    } catch (err) {
      console.error("Upload handler error:", err);
      const fileUrl = `assets/uploads/${file.filename}`;
      copyToAllAssetCandidates(file.filename, file.path);
      results.push({ url: fileUrl, message: "Uploaded locally (catch)" });
    }
  }
  return res.json({
    urls: results.map((r) => r.url),
    message: "Files processed successfully",
    results
  });
};

// src/admin/adminHtml.ts
var getAdminHtml = () => `
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PromptStudio - Admin Panel</title>
    <!-- Vue 3 -->
    <script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"></script>
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- FontAwesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-gray-100 text-gray-800 font-sans">
    <div id="app">

    <!-- LOGIN SCREEN -->
    <div v-if="!isLoggedIn" class="min-h-screen flex items-center justify-center bg-gray-900 px-4">
        <div class="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
            <div class="text-center mb-8">
                <h2 class="text-3xl font-bold text-gray-900">Admin Panel</h2>
                <p class="text-gray-500 mt-2">Login ke PromptStudio</p>
            </div>
            
            <form @submit.prevent="login">
                <div v-if="loginError" class="mb-4 bg-red-100 text-red-700 p-3 rounded-lg text-sm">
                    {{ loginError }}
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input v-model="loginForm.email" type="email" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                </div>
                <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input v-model="loginForm.password" type="password" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                </div>
                <button type="submit" :disabled="isLoading" class="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition">
                    {{ isLoading ? 'Loading...' : 'Login' }}
                </button>
            </form>
        </div>
    </div>

    <!-- DASHBOARD -->
    <div v-else class="min-h-screen flex flex-col md:flex-row bg-gray-100">
        <!-- Sidebar -->
        <div :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'" class="fixed md:relative md:translate-x-0 z-20 w-64 h-screen bg-gray-900 text-white transition-transform duration-300 ease-in-out">
            <div class="p-6 flex justify-between items-center">
                <h1 class="text-2xl font-bold">PromptStudio</h1>
                <button @click="sidebarOpen = false" class="md:hidden text-gray-400 hover:text-white">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <nav class="mt-6 px-4 space-y-2">
                <a @click="currentView = 'audiences'" :class="currentView === 'audiences' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'" class="block px-4 py-3 rounded-lg cursor-pointer transition flex items-center gap-3">
                    <i class="fas fa-bullseye w-5 text-center"></i> Target Audiens
                </a>
                <a @click="currentView = 'styles'" :class="currentView === 'styles' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'" class="block px-4 py-3 rounded-lg cursor-pointer transition flex items-center gap-3">
                    <i class="fas fa-paint-brush w-5 text-center"></i> Gaya & Tema Desain
                </a>
                <a @click="currentView = 'templates'" :class="currentView === 'templates' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'" class="block px-4 py-3 rounded-lg cursor-pointer transition flex items-center gap-3">
                    <i class="fas fa-file-alt w-5 text-center"></i> Templates
                </a>
                <a @click="currentView = 'characters'" :class="currentView === 'characters' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'" class="block px-4 py-3 rounded-lg cursor-pointer transition flex items-center gap-3">
                    <i class="fas fa-user-friends w-5 text-center"></i> Karakter AI
                </a>
                <a @click="currentView = 'history'" :class="currentView === 'history' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'" class="block px-4 py-3 rounded-lg cursor-pointer transition flex items-center gap-3">
                    <i class="fas fa-history w-5 text-center"></i> Riwayat Prompt
                </a>
                <a @click="currentView = 'apikeys'" :class="currentView === 'apikeys' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'" class="block px-4 py-3 rounded-lg cursor-pointer transition flex items-center gap-3">
                    <i class="fas fa-key w-5 text-center"></i> Groq API Keys
                </a>
            </nav>
            <div class="absolute bottom-0 w-full p-4">
                <button @click="logout" class="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition flex items-center justify-center gap-2">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </button>
            </div>
        </div>

        <!-- Mobile Overlay -->
        <div v-if="sidebarOpen" @click="sidebarOpen = false" class="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"></div>

        <!-- Main Content -->
        <div class="flex-1 flex flex-col h-screen overflow-hidden">
            <!-- Header -->
            <header class="bg-white shadow-sm h-16 flex items-center px-4 justify-between">
                <button @click="sidebarOpen = true" class="md:hidden text-gray-600 hover:text-gray-900">
                    <i class="fas fa-bars text-xl"></i>
                </button>
                <h2 class="text-xl font-semibold capitalize">{{ currentView.replace('apikeys', 'API Keys') }}</h2>
                <div class="flex items-center gap-3">
                    <img :src="user?.avatarUrl || 'https://ui-avatars.com/api/?name=Admin'" class="w-8 h-8 rounded-full border">
                    <span class="font-medium hidden sm:block">{{ user?.name }}</span>
                </div>
            </header>

            <!-- Content Area -->
            <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-8">
                
                <!-- Toast Notification -->
                <div v-if="toast.show" :class="toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'" class="fixed top-4 right-4 z-50 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 transition-opacity">
                    <i :class="toast.type === 'error' ? 'fas fa-exclamation-circle' : 'fas fa-check-circle'"></i>
                    {{ toast.message }}
                </div>

                <!-- View: CATEGORIES -->
                <div v-if="currentView === 'categories'">
                    <div class="flex justify-between mb-6">
                        <h3 class="text-2xl font-bold">Kelola Kategori</h3>
                        <button @click="openModal('categories')" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"><i class="fas fa-plus mr-2"></i>Tambah Kategori</button>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div v-for="cat in data.categories" :key="cat.id" class="bg-white rounded-xl shadow p-4 flex flex-col justify-between">
                            <div class="flex items-center space-x-3 mb-4">
                                <div class="w-12 h-12 rounded-lg flex items-center justify-center text-2xl overflow-hidden" :style="{ backgroundColor: cat.color ? cat.color + '33' : '#f3f4f6' }">
                                    <img v-if="cat.icon && (cat.icon.startsWith('http') || cat.icon.includes('assets/'))" :src="getImageUrl(cat.icon)" class="w-full h-full object-cover" @error="$event.target.src='https://placehold.co/100x100?text=Error'">
                                    <span v-else>{{ cat.icon || '\u{1F4C1}' }}</span>
                                </div>
                                <div>
                                    <h4 class="font-bold text-gray-800">{{ cat.name }}</h4>
                                    <div class="flex items-center space-x-1 mt-1">
                                        <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: cat.color || '#6366F1' }"></div>
                                        <span class="text-xs text-gray-500">{{ cat.color || '#6366F1' }}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="flex justify-end space-x-2 border-t pt-3">
                                <button @click="openModal('categories', cat)" class="text-blue-600 hover:bg-blue-50 px-3 py-1 rounded"><i class="fas fa-edit mr-1"></i> Edit</button>
                                <button @click="deleteItem('categories', cat.id)" class="text-red-600 hover:bg-red-50 px-3 py-1 rounded"><i class="fas fa-trash mr-1"></i> Hapus</button>
                            </div>
                        </div>
                        <div v-if="!data.categories.length" class="col-span-full bg-white rounded-xl shadow p-8 text-center text-gray-500">
                            Belum ada kategori
                        </div>
                    </div>
                </div>

                <!-- View: AUDIENCES -->
                <div v-if="currentView === 'audiences'">
                    <div class="flex justify-between mb-6">
                        <h3 class="text-2xl font-bold">Target Audiens</h3>
                        <button @click="openModal('audiences')" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"><i class="fas fa-plus mr-2"></i>Tambah Audiens</button>
                    </div>
                    <div class="bg-white rounded-xl shadow overflow-hidden">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Audiens</th>
                                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200">
                                <tr v-for="aud in data.audiences" :key="aud.id">
                                    <td class="px-6 py-4 font-medium">{{ aud.name }}</td>
                                    <td class="px-6 py-4 text-right space-x-3">
                                        <button @click="openModal('audiences', aud)" class="text-blue-600 hover:text-blue-900"><i class="fas fa-edit"></i></button>
                                        <button @click="deleteItem('audiences', aud.id)" class="text-red-600 hover:text-red-900"><i class="fas fa-trash"></i></button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- View: STYLES -->
                <div v-if="currentView === 'styles'">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-2xl font-bold text-gray-900">Kelola Gaya Desain</h3>
                        <button @click="openModal('styles')" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition duration-150 flex items-center gap-2 shadow-sm">
                            <i class="fas fa-plus"></i> Tambah Gaya Desain
                        </button>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <div v-for="style in data.styles" :key="style.id" class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition duration-200">
                            <!-- Image container -->
                            <div class="h-44 bg-gray-100 relative group overflow-hidden">
                                <img v-if="style.imageUrl" :src="getImageUrl(style.imageUrl)" class="w-full h-full object-cover group-hover:scale-105 transition duration-300 cursor-pointer" @click="openModal('styleDetail', style)" @error="$event.target.src='https://placehold.co/300x200?text=No+Image'">
                                <div v-else class="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50 cursor-pointer" @click="openModal('styleDetail', style)">
                                    <i class="fas fa-paint-brush text-3xl"></i>
                                </div>
                                <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none"></div>
                                <span class="absolute bottom-3 left-4 text-white font-bold text-base drop-shadow-sm">{{ style.name }}</span>
                            </div>
                            
                            <!-- Card Body -->
                            <div class="p-4 flex-1 flex flex-col justify-between">
                                <p class="text-xs text-gray-500 line-clamp-2 mb-4 flex-1">
                                    {{ style.description || 'Tidak ada deskripsi singkat.' }}
                                </p>
                                
                                <div class="flex items-center justify-between border-t border-gray-100 pt-3 mt-auto">
                                    <!-- View Detail Button -->
                                    <button @click="openModal('styleDetail', style)" class="text-xs text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition font-medium flex items-center gap-1">
                                        <i class="fas fa-eye"></i> Detail
                                    </button>
                                    
                                    <!-- Action buttons -->
                                    <div class="flex gap-1">
                                        <button @click="openModal('styles', style)" class="text-gray-500 hover:text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg transition" title="Edit">
                                            <i class="fas fa-edit text-xs"></i>
                                        </button>
                                        <button @click="deleteItem('styles', style.id)" class="text-gray-500 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition" title="Hapus">
                                            <i class="fas fa-trash text-xs"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-if="!data.styles.length" class="col-span-full bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center text-gray-500">
                            Belum ada gaya desain
                        </div>
                    </div>
                </div>

                <!-- View: API KEYS -->
                <div v-if="currentView === 'apikeys'">
                    <div class="flex justify-between mb-6">
                        <h3 class="text-2xl font-bold">Groq API Keys</h3>
                        <button @click="openModal('apikeys')" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"><i class="fas fa-plus mr-2"></i>Tambah API Key</button>
                    </div>
                    <div class="bg-white rounded-xl shadow overflow-hidden">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">API Key</th>
                                    <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Error Count</th>
                                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200">
                                <tr v-for="key in data.apikeys" :key="key.id">
                                    <td class="px-6 py-4 font-mono text-sm">
                                        {{ key.api_key.substring(0, 8) }}...{{ key.api_key.substring(key.api_key.length - 4) }}
                                    </td>
                                    <td class="px-6 py-4 text-center">
                                        <span :class="key.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" class="px-2 py-1 rounded-full text-xs font-medium">
                                            {{ key.is_active ? 'Aktif' : 'Nonaktif' }}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 text-center">
                                        <span :class="key.error_count > 0 ? 'text-orange-600 font-bold' : 'text-gray-500'">{{ key.error_count }}</span>
                                    </td>
                                    <td class="px-6 py-4 text-right space-x-3">
                                        <button v-if="key.error_count > 0 || !key.is_active" @click="resetApiKey(key.id)" title="Reset Error Count" class="text-green-600 hover:text-green-900"><i class="fas fa-sync-alt"></i></button>
                                        <button @click="deleteItem('apikeys', key.id)" class="text-red-600 hover:text-red-900"><i class="fas fa-trash"></i></button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- View: TEMPLATES -->
                <div v-if="currentView === 'templates'">
                    <div class="flex justify-between mb-6">
                        <h3 class="text-2xl font-bold">Templates & Preset</h3>
                        <button @click="openModal('templates')" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"><i class="fas fa-plus mr-2"></i>Tambah Template</button>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div v-for="temp in data.templates" :key="temp.id" class="bg-white rounded-xl shadow-md overflow-hidden flex flex-col border border-gray-200">
                            <div class="h-40 bg-gray-200 relative">
                                <img v-if="getFirstImage(temp.thumbnailUrl)" :src="getImageUrl(getFirstImage(temp.thumbnailUrl))" class="w-full h-full object-cover cursor-pointer" @click="previewZoomImage(getFirstImage(temp.thumbnailUrl))" @error="$event.target.src='https://placehold.co/100x100?text=Error'">
                                <div v-else class="w-full h-full flex items-center justify-center text-gray-400"><i class="fas fa-file-image text-4xl"></i></div>
                                <span v-if="getImageCount(temp.thumbnailUrl) > 1" class="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-medium"><i class="fas fa-images mr-1"></i>{{ getImageCount(temp.thumbnailUrl) }}</span>
                            </div>
                            <div class="p-4 flex-1 flex flex-col">
                                <h4 class="font-bold text-gray-900 mb-1">{{ temp.title }}</h4>
                                <p class="text-xs text-blue-600 font-medium mb-2">{{ temp.category?.name || 'Uncategorized' }}</p>
                                <p class="text-sm text-gray-600 flex-1 line-clamp-3">{{ temp.description }}</p>
                                <div class="mt-4 pt-4 border-t flex justify-end items-center">
                                    <div class="gap-2 flex">
                                        <button @click="openModal('templates', temp)" class="text-blue-600 hover:bg-blue-50 px-2 py-1 rounded"><i class="fas fa-edit"></i></button>
                                        <button @click="deleteItem('templates', temp.id)" class="text-red-600 hover:bg-red-50 px-2 py-1 rounded"><i class="fas fa-trash"></i></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>



                <!-- View: CHARACTERS -->
                <div v-if="currentView === 'characters'">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-2xl font-bold text-gray-900">Kelola Karakter AI</h3>
                        <button @click="openModal('characters')" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition duration-150 flex items-center gap-2 shadow-sm">
                            <i class="fas fa-plus"></i> Tambah Karakter
                        </button>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <div v-for="char in data.characters" :key="char.id" class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition duration-200">
                            <!-- Image container -->
                            <div class="h-44 bg-gray-100 relative group overflow-hidden">
                                <img v-if="char.imageUrl" :src="getImageUrl(char.imageUrl)" class="w-full h-full object-contain bg-gray-50 group-hover:scale-105 transition duration-300 cursor-pointer" @click="openModal('styleDetail', char)" @error="$event.target.src='https://placehold.co/300x200?text=No+Image'">
                                <div v-else class="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50 cursor-pointer" @click="openModal('styleDetail', char)">
                                    <i class="fas fa-user-circle text-3xl"></i>
                                </div>
                                <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none"></div>
                                <span class="absolute bottom-3 left-4 text-white font-bold text-base drop-shadow-sm">{{ char.name }}</span>
                            </div>
                            
                            <!-- Card Body -->
                            <div class="p-4 flex-1 flex flex-col justify-between">
                                <p class="text-xs text-gray-500 line-clamp-3 mb-4 flex-1">
                                    {{ char.prompt }}
                                </p>
                                
                                <div class="flex items-center justify-between border-t border-gray-100 pt-3 mt-auto">
                                    <!-- View Detail Button -->
                                    <button @click="openModal('styleDetail', char)" class="text-xs text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition font-medium flex items-center gap-1">
                                        <i class="fas fa-eye"></i> Detail
                                    </button>
                                    
                                    <!-- Action buttons -->
                                    <div class="flex gap-1">
                                        <button @click="openModal('characters', char)" class="text-gray-500 hover:text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg transition" title="Edit">
                                            <i class="fas fa-edit text-xs"></i>
                                        </button>
                                        <button @click="deleteItem('characters', char.id)" class="text-gray-500 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition" title="Hapus">
                                            <i class="fas fa-trash text-xs"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-if="!data.characters.length" class="col-span-full bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center text-gray-500">
                            Belum ada karakter
                        </div>
                    </div>
                </div>

                <!-- View: HISTORY -->
                <div v-if="currentView === 'history'">
                    <div class="flex justify-between mb-6">
                        <h3 class="text-2xl font-bold">Riwayat Pembuatan (History)</h3>
                    </div>
                    <div class="bg-white rounded-xl shadow overflow-hidden">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gambar</th>
                                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Judul / Prompt</th>
                                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                                    <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200">
                                <tr v-for="hist in data.history" :key="hist.id" class="hover:bg-gray-50">
                                    <td class="px-4 py-3">
                                        <img v-if="hist.imageUrl" :src="getImageUrl(hist.imageUrl)" class="w-12 h-12 rounded object-cover border" @error="$event.target.src='https://placehold.co/100x100?text=Error'">
                                        <div v-else class="w-12 h-12 rounded bg-gray-200 flex items-center justify-center text-gray-400 text-xs"><i class="fas fa-image"></i></div>
                                    </td>
                                    <td class="px-4 py-3">
                                        <p class="font-semibold text-gray-900">{{ hist.title }}</p>
                                        <p class="text-xs text-gray-500">{{ hist.designStyle }} \u2022 {{ hist.slideCount }} slide</p>
                                    </td>
                                    <td class="px-4 py-3 text-sm text-gray-600">{{ hist.userName || hist.userEmail || 'Unknown User' }}</td>
                                    <td class="px-4 py-3 text-sm text-gray-500">{{ new Date(hist.createdAt).toLocaleDateString('id-ID') }}</td>
                                    <td class="px-4 py-3 text-right space-x-2">
                                        <button @click="openModal('historyDetail', hist)" class="text-indigo-600 hover:text-indigo-900 bg-indigo-50 p-2 rounded-lg" title="Lihat Detail Prompt"><i class="fas fa-eye"></i></button>
                                        <button @click="convertToTemplate(hist)" class="text-green-600 hover:text-green-900 bg-green-50 p-2 rounded-lg" title="Alihkan jadi Template"><i class="fas fa-copy"></i></button>
                                        <button @click="openModal('history', hist)" class="text-blue-600 hover:text-blue-900 bg-blue-50 p-2 rounded-lg" title="Edit/Upload Gambar"><i class="fas fa-edit"></i></button>
                                        <button @click="deleteItem('history', hist.id)" class="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-lg" title="Hapus Riwayat"><i class="fas fa-trash"></i></button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </main>
        </div>
    </div>

    <!-- MODAL OVERLAY -->
    <div v-if="modal.show" class="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div class="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
                <h3 class="text-lg font-bold text-gray-900">
                    <span v-if="modal.type === 'styleDetail'">Detail Gaya Desain</span>
                    <span v-else-if="modal.type === 'historyDetail'">Detail Riwayat Prompt</span>
                    <span v-else>{{ modal.isEdit ? 'Edit' : 'Tambah' }} {{ modal.type.toUpperCase() }}</span>
                </h3>
                <button @click="modal.show = false" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times"></i></button>
            </div>
            
            <div class="p-6 overflow-y-auto">
                <form @submit.prevent="submitModal">
                    
                    <!-- Kategori / Audiens -->
                    <div v-if="modal.type === 'categories' || modal.type === 'audiences'" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                            <input v-model="modal.form.name" type="text" required class="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500">
                        </div>
                        <div v-if="modal.type === 'categories'" class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Icon URL (CDN/External)</label>
                                <input v-model="modal.form.iconCdnUrl" type="text" class="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Contoh: https://...">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Atau Upload Icon</label>
                                <input type="file" @change="e => uploadImage(e, 'icon')" accept="image/*" class="w-full px-3 py-1.5 border rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm">
                            </div>
                        </div>
                        <div v-if="modal.type === 'categories' && (modal.form.icon || modal.form.iconCdnUrl)" class="mt-2">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Pratinjau Icon</label>
                            <div class="w-12 h-12 rounded-lg flex items-center justify-center text-2xl overflow-hidden border">
                                <img v-if="(modal.form.iconCdnUrl || modal.form.icon) && ((modal.form.iconCdnUrl || modal.form.icon).startsWith('http') || (modal.form.iconCdnUrl || modal.form.icon).includes('assets/'))" :src="getImageUrl(modal.form.iconCdnUrl || modal.form.icon)" class="w-full h-full object-cover">
                                <span v-else>{{ modal.form.iconCdnUrl || modal.form.icon }}</span>
                            </div>
                        </div>
                        <div v-if="modal.type === 'categories'">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Warna Aksen (Hex)</label>
                            <input v-model="modal.form.color" type="color" class="w-full h-10 border rounded-lg cursor-pointer">
                        </div>
                    </div>

                    <!-- API Keys -->
                    <div v-if="modal.type === 'apikeys'" class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Groq API Key</label>
                        <input v-model="modal.form.apiKey" type="text" required class="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 font-mono text-sm">
                    </div>

                    <!-- Gaya Desain -->
                    <div v-if="modal.type === 'styles'" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Nama Desain</label>
                            <input v-model="modal.form.name" type="text" required class="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Deskripsi Singkat</label>
                            <textarea v-model="modal.form.description" rows="2" class="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"></textarea>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Deskripsi Detail / Instruksi AI (Prompt)</label>
                            <textarea v-model="modal.form.prompt" rows="3" class="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"></textarea>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">URL Gambar (CDN)</label>
                                <input v-model="modal.form.cdnUrl" type="text" class="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="https://...">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Atau Upload Gambar</label>
                                <input type="file" @change="e => uploadImage(e, 'imageUrl')" accept="image/*" class="w-full px-3 py-1.5 border rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm">
                            </div>
                        </div>
                        <div v-if="modal.form.imageUrl || modal.form.cdnUrl" class="mt-2">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Pratinjau Gambar</label>
                            <img :src="getImageUrl(modal.form.cdnUrl || modal.form.imageUrl)" class="h-24 rounded-lg border object-cover">
                        </div>
                    </div>

                    <!-- Templates -->
                    <div v-if="modal.type === 'templates'" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Judul Template</label>
                            <input v-model="modal.form.title" type="text" required class="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500">
                        </div>
                        <div class="grid grid-cols-1 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                                <select v-model="modal.form.categoryId" class="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500">
                                    <option :value="null">Pilih Kategori</option>
                                    <option v-for="c in data.categories" :key="c.id" :value="c.id">{{ c.name }}</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Deskripsi Singkat</label>
                            <input v-model="modal.form.description" type="text" class="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Isi Content (Prompt Template)</label>
                            <textarea v-model="modal.form.content" rows="4" required class="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Contoh: Buatlah postingan Instagram tentang [topik]..."></textarea>
                        </div>
                        <div class="pt-4 border-t">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Gambar Template (bisa lebih dari 1)</label>
                            
                            <!-- Preview uploaded images -->
                            <div v-if="modal.form.imageList && modal.form.imageList.length > 0" class="grid grid-cols-4 gap-3 mb-3">
                                <div v-for="(img, idx) in modal.form.imageList" :key="idx" class="relative group">
                                    <img :src="getImageUrl(img)" class="w-full h-24 object-cover rounded-lg border border-gray-200 cursor-pointer" @click="previewZoomImage(img)" @error="$event.target.src='https://placehold.co/100x100?text=Error'">
                                    <button type="button" @click="removeTemplateImage(idx)" class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow"><i class="fas fa-times"></i></button>
                                    <span class="absolute bottom-1 left-1 bg-black bg-opacity-60 text-white text-xs px-1.5 py-0.5 rounded">{{ idx + 1 }}</span>
                                </div>
                            </div>
                            
                            <input type="file" @change="uploadMultipleImages" accept="image/*" multiple class="w-full px-3 py-1.5 border rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm">
                            <p class="text-xs text-gray-500 mt-1">Upload beberapa gambar sekaligus (setiap slide/prompt bisa punya gambar sendiri)</p>
                        </div>
                    </div>

                    <!-- Themes Form -->
                    <div v-if="modal.type === 'themes'" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Nama Tema</label>
                            <input v-model="modal.form.name" type="text" required class="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Kategori Peruntukan</label>
                            <select v-model="modal.form.category" required class="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500">
                                <option value="LOGO">LOGO (Penjelasan Logo Modern)</option>
                                <option value="IKLAN">IKLAN (Carousel Promosi/Iklan)</option>
                                <option value="UMUM">UMUM / LAINNYA</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Deskripsi Singkat</label>
                            <textarea v-model="modal.form.description" rows="2" class="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"></textarea>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Deskripsi Detail / Instruksi Latar Belakang (Prompt)</label>
                            <textarea v-model="modal.form.prompt" rows="3" class="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Contoh: Premium minimalist brand deck, off-white background..."></textarea>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">URL Gambar Pratinjau (CDN)</label>
                                <input v-model="modal.form.cdnUrl" type="text" class="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="https://...">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Atau Upload Gambar</label>
                                <input type="file" @change="e => uploadImage(e, 'imageUrl')" accept="image/*" class="w-full px-3 py-1.5 border rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm">
                            </div>
                        </div>
                        <div v-if="modal.form.imageUrl || modal.form.cdnUrl" class="mt-2">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Pratinjau Gambar</label>
                            <img :src="getImageUrl(modal.form.cdnUrl || modal.form.imageUrl)" class="h-24 rounded-lg border object-cover">
                        </div>
                    </div>

                    <!-- Characters Form -->
                    <div v-if="modal.type === 'characters'" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Nama Karakter</label>
                            <input v-model="modal.form.name" type="text" required class="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Deskripsi Prompt Karakter (Detail, Pakaian, Ciri Fisik, dll)</label>
                            <textarea v-model="modal.form.prompt" rows="4" required class="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Contoh: A 25-year-old Asian man, short black hair, wearing a white t-shirt and blue jeans, simple minimalist cartoon style..."></textarea>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">URL Gambar Pratinjau (CDN)</label>
                                <input v-model="modal.form.cdnUrl" type="text" class="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="https://...">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Atau Upload Gambar</label>
                                <input type="file" @change="e => uploadImage(e, 'imageUrl')" accept="image/*" class="w-full px-3 py-1.5 border rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm">
                            </div>
                        </div>
                        <div v-if="modal.form.imageUrl || modal.form.cdnUrl" class="mt-2">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Pratinjau Gambar</label>
                            <img :src="getImageUrl(modal.form.cdnUrl || modal.form.imageUrl)" class="h-32 rounded-lg border object-contain bg-gray-50">
                        </div>
                    </div>

                    <!-- History -->
                    <div v-if="modal.type === 'history'" class="space-y-4">
                        <div class="bg-blue-50 p-4 rounded-lg mb-4 text-sm text-blue-800 border border-blue-200">
                            <strong>Info:</strong> Anda dapat mengedit Judul atau menambahkan gambar hasil *render* akhir agar pengguna dapat melihat contoh nyata dari *prompt* ini.
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Judul Riwayat Topik</label>
                            <input v-model="modal.form.title" type="text" required class="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500">
                        </div>
                        <div class="grid grid-cols-2 gap-4 pt-4 border-t">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Image URL (CDN/Hasil)</label>
                                <input v-model="modal.form.cdnUrl" type="text" class="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="https://...">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Atau Upload Gambar Hasil</label>
                                <input type="file" @change="e => uploadImage(e, 'imageUrl')" accept="image/*" class="w-full px-3 py-1.5 border rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm">
                            </div>
                        </div>
                        <div v-if="modal.form.imageUrl || modal.form.cdnUrl" class="mt-2">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Pratinjau Gambar Hasil</label>
                            <img :src="getImageUrl(modal.form.cdnUrl || modal.form.imageUrl)" class="h-24 rounded-lg border object-cover">
                        </div>
                    </div>

                    <!-- Style Detail (View Only) -->
                    <div v-if="modal.type === 'styleDetail'" class="space-y-4">
                        <div class="flex flex-col md:flex-row gap-6">
                            <div class="w-full md:w-1/3">
                                <div class="relative group rounded-xl overflow-hidden shadow border border-gray-200 bg-gray-50">
                                    <img v-if="modal.form.imageUrl" :src="getImageUrl(modal.form.imageUrl)" class="w-full h-64 object-contain cursor-zoom-in hover:scale-105 transition duration-300" @click="previewZoomImage(modal.form.imageUrl)" @error="$event.target.src='https://placehold.co/200x200?text=Error'">
                                    <div v-else class="w-full h-40 bg-gray-100 flex items-center justify-center text-gray-400 text-3xl"><i class="fas fa-paint-brush"></i></div>
                                </div>
                            </div>
                            <div class="flex-1 space-y-4">
                                <div>
                                    <h4 class="text-xl font-bold text-gray-900">{{ modal.form.name }}</h4>
                                </div>
                                <div v-if="modal.form.description" class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Deskripsi Singkat</p>
                                    <p class="text-sm text-gray-700 whitespace-pre-wrap">{{ modal.form.description }}</p>
                                </div>
                                <div class="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                                    <div class="flex justify-between items-center mb-2">
                                        <p class="text-xs font-semibold text-indigo-700 uppercase tracking-wider">Prompt Visual (AI Instructions)</p>
                                        <button type="button" @click="copyText(modal.form.prompt)" class="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium bg-white px-2 py-1 rounded shadow-sm hover:shadow transition border border-indigo-100">
                                            <i class="fas fa-copy"></i> Salin Prompt
                                        </button>
                                    </div>
                                    <p class="text-sm font-mono text-gray-800 bg-white p-3 rounded border border-indigo-50 whitespace-pre-wrap overflow-y-auto max-h-60 leading-relaxed">{{ modal.form.prompt || 'Tidak ada instruksi prompt.' }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- History Detail (View Only) -->
                    <div v-if="modal.type === 'historyDetail'" class="space-y-4">
                        <div class="bg-gray-50 p-4 rounded-lg border">
                            <h4 class="font-bold text-gray-900 mb-2">Judul: {{ modal.form.title }}</h4>
                            <div class="text-sm text-gray-600 mb-4 whitespace-pre-wrap">{{ modal.form.content }}</div>
                            <div v-if="modal.form.imageUrl" class="mt-4">
                                <p class="font-bold text-gray-900 mb-2">Gambar Hasil:</p>
                                <img :src="getImageUrl(modal.form.imageUrl)" class="max-h-64 rounded-lg border" @error="$event.target.src='https://placehold.co/100x100?text=Error'">
                            </div>
                        </div>
                    </div>

                    <div class="mt-6 flex justify-end gap-3 pt-4 border-t">
                        <button type="button" @click="modal.show = false" class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                            {{ (modal.type === 'historyDetail' || modal.type === 'styleDetail') ? 'Tutup' : 'Batal' }}
                        </button>
                        <button v-if="modal.type !== 'historyDetail' && modal.type !== 'styleDetail'" type="submit" :disabled="isLoading" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
                            {{ isLoading ? 'Menyimpan...' : 'Simpan' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    </div>

    <script>
        const { createApp } = Vue;

        createApp({
            data() {
                return {
                    isLoggedIn: false,
                    token: '',
                    user: null,
                    sidebarOpen: false,
                    currentView: 'styles',
                    isLoading: false,
                    loginError: '',
                    loginForm: { email: '', password: '' },
                    toast: { show: false, message: '', type: 'success' },
                    data: {
                        categories: [],
                        audiences: [],
                        styles: [],
                        themes: [],
                        apikeys: [],
                        templates: [],
                        characters: [],
                        history: []
                    },
                    modal: {
                        show: false,
                        type: '',
                        isEdit: false,
                        id: null,
                        form: {}
                    },

                }
            },
            mounted() {
                const savedToken = localStorage.getItem('admin_token');
                if (savedToken) {
                    this.token = savedToken;
                    this.isLoggedIn = true;
                    this.loadAllData();
                }
            },
            watch: {
                currentView() {
                    this.sidebarOpen = false;
                    this.loadDataForView(this.currentView);
                }
            },
            methods: {
                getImageUrl(url) {
                    if (!url) return '';
                    if (url.startsWith('http') || url.startsWith('data:')) return url;
                    // Handle relative paths like /assets/... by prepending server origin
                    const base = window.location.origin;
                    return url.startsWith('/') ? (base + url) : (base + '/' + url);
                },
                copyText(text) {
                    if (!text) return;
                    navigator.clipboard.writeText(text)
                        .then(() => this.showToast('Prompt disalin ke clipboard!'))
                        .catch(() => this.showToast('Gagal menyalin prompt', 'error'));
                },
                showToast(msg, type = 'success') {
                    this.toast = { show: true, message: msg, type };
                    setTimeout(() => this.toast.show = false, 3000);
                },
                getHeaders() {
                    return {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + this.token
                    };
                },
                async fetchApi(url, options = {}) {
                    options.headers = this.getHeaders();
                    const res = await fetch(url, options);
                    
                    if (res.status === 401 || res.status === 403) {
                        this.logout();
                        throw new Error('Sesi telah berakhir, silakan login kembali.');
                    }
                    
                    const json = await res.json();
                    if (!res.ok) throw new Error(json.message || 'Gagal memproses request');
                    return json;
                },
                async login() {
                    this.isLoading = true;
                    this.loginError = '';
                    try {
                        const res = await fetch('/api/auth/login', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(this.loginForm)
                        });
                        const data = await res.json();
                        if (res.ok) {
                            this.token = data.accessToken;
                            this.user = data.user;
                            localStorage.setItem('admin_token', this.token);
                            this.isLoggedIn = true;
                            this.loadAllData();
                        } else {
                            this.loginError = data.message || 'Login gagal';
                        }
                    } catch (e) {
                        this.loginError = 'Terjadi kesalahan jaringan.';
                    } finally {
                        this.isLoading = false;
                    }
                },
                logout() {
                    this.isLoggedIn = false;
                    this.token = '';
                    this.user = null;
                    localStorage.removeItem('admin_token');
                    window.location.reload();
                },
                async loadAllData() {
                    await this.loadDataForView(this.currentView);
                },
                async loadDataForView(view) {
                    try {
                        if (view === 'categories') {
                            const res = await this.fetchApi('/api/categories');
                            this.data.categories = res;
                        } else if (view === 'audiences') {
                            const res = await this.fetchApi('/api/options/audiences');
                            this.data.audiences = res;
                        } else if (view === 'styles') {
                            const res = await this.fetchApi('/api/options/styles');
                            this.data.styles = res;
                        } else if (view === 'apikeys') {
                            const res = await this.fetchApi('/api/options/groq-keys');
                            this.data.apikeys = res;
                        } else if (view === 'templates') {
                            const res = await this.fetchApi('/api/templates?limit=100');
                            this.data.templates = res.templates || res.data || [];
                        } else if (view === 'history') {
                            const res = await this.fetchApi('/api/prompt/history/all');
                            this.data.history = res;
                        } else if (view === 'themes') {
                            const res = await this.fetchApi('/api/options/themes');
                            this.data.themes = res;
                        } else if (view === 'characters') {
                            const res = await this.fetchApi('/api/options/characters');
                            this.data.characters = res;
                        }
                    } catch(e) {
                        this.showToast(e.message, 'error');
                    }
                },
                openModal(type, item = null) {
                    this.modal.type = type;
                    this.modal.isEdit = !!item;
                    this.modal.id = item ? item.id : null;
                    
                    if (type === 'categories') {
                        const icon = item ? item.icon : '';
                        const isCdn = icon && (icon.startsWith('http://') || icon.startsWith('https://'));
                        this.modal.form = { 
                            name: item ? item.name : '', 
                            icon: icon,
                            iconCdnUrl: isCdn ? icon : '',
                            color: item && item.color ? item.color : '#6366F1' 
                        };
                    } else if (type === 'audiences') {
                        this.modal.form = { name: item ? item.name : '' };
                    } else if (type === 'apikeys') {
                        this.modal.form = { apiKey: '' }; 
                    } else if (type === 'styles') {
                        const imageUrl = item ? item.imageUrl : '';
                        const isCdn = imageUrl && (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'));
                        this.modal.form = { 
                            name: item ? item.name : '', 
                            description: item ? item.description : '',
                            prompt: item ? item.prompt : '',
                            imageUrl: imageUrl,
                            cdnUrl: isCdn ? imageUrl : ''
                        };
                    } else if (type === 'themes') {
                        const imageUrl = item ? item.imageUrl : '';
                        const isCdn = imageUrl && (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'));
                        this.modal.form = { 
                            name: item ? item.name : '', 
                            category: item ? item.category : 'LOGO', 
                            description: item ? item.description : '',
                            prompt: item ? item.prompt : '',
                            imageUrl: imageUrl,
                            cdnUrl: isCdn ? imageUrl : ''
                        };
                    } else if (type === 'characters') {
                        const imageUrl = item ? item.imageUrl : '';
                        const isCdn = imageUrl && (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'));
                        this.modal.form = { 
                            name: item ? item.name : '', 
                            prompt: item ? item.prompt : '',
                            imageUrl: imageUrl,
                            cdnUrl: isCdn ? imageUrl : ''
                        };
                    } else if (type === 'styleDetail') {
                        this.modal.form = { 
                            name: item ? item.name : '', 
                            description: item ? item.description : '',
                            prompt: item ? item.prompt : '',
                            imageUrl: item ? item.imageUrl : ''
                        };
                    } else if (type === 'templates') {
                        let imageList = [];
                        if (item && item.thumbnailUrl) {
                            try {
                                const parsed = JSON.parse(item.thumbnailUrl);
                                if (Array.isArray(parsed)) imageList = parsed;
                                else imageList = [item.thumbnailUrl];
                            } catch(e) {
                                imageList = item.thumbnailUrl ? [item.thumbnailUrl] : [];
                            }
                        }
                        this.modal.form = {
                            title: item ? item.title : '',
                            description: item ? item.description : '',
                            content: item ? item.content : '',
                            categoryId: item ? item.categoryId : null,
                            imageList: imageList,
                            isPremium: false
                        };
                    } else if (type === 'history') {
                        const imageUrl = item ? item.imageUrl : '';
                        const isCdn = imageUrl && (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'));
                        this.modal.form = {
                            title: item ? item.title : '',
                            imageUrl: imageUrl,
                            cdnUrl: isCdn ? imageUrl : ''
                        };
                    } else if (type === 'historyDetail') {
                        this.modal.form = {
                            title: item ? item.title : '',
                            content: item ? item.generatedPrompt : '',
                            imageUrl: item ? item.imageUrl : ''
                        };
                    }
                    this.modal.show = true;
                },
                convertToTemplate(hist) {
                    this.currentView = 'templates';
                    this.modal.type = 'templates';
                    this.modal.isEdit = false;
                    this.modal.id = null;
                    this.modal.form = {
                        title: hist.title || '',
                        description: 'Dibuat dari riwayat: ' + (hist.designStyle || ''),
                        content: hist.generatedPrompt || '',
                        categoryId: null,
                        imageList: hist.imageUrl ? [hist.imageUrl] : [],
                        isPremium: false
                    };
                    this.modal.show = true;
                },

                getFirstImage(thumbnailUrl) {
                    if (!thumbnailUrl) return null;
                    try {
                        const parsed = JSON.parse(thumbnailUrl);
                        if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
                    } catch(e) {}
                    return thumbnailUrl;
                },

                getImageCount(thumbnailUrl) {
                    if (!thumbnailUrl) return 0;
                    try {
                        const parsed = JSON.parse(thumbnailUrl);
                        if (Array.isArray(parsed)) return parsed.length;
                    } catch(e) {}
                    return thumbnailUrl ? 1 : 0;
                },

                async uploadImage(event, fieldTarget) {
                    const file = event.target.files[0];
                    if (!file) return;
                    
                    this.isLoading = true;
                    try {
                        const formData = new FormData();
                        formData.append('file', file);
                        
                        const response = await fetch('/api/upload', {
                            method: 'POST',
                            headers: {
                                'Authorization': 'Bearer ' + this.token
                            },
                            body: formData
                        });
                        
                        if (response.status === 401 || response.status === 403) {
                            this.logout();
                            throw new Error('Sesi telah berakhir, silakan login kembali.');
                        }

                        const data = await response.json();
                        if (!response.ok) throw new Error(data.message || 'Gagal mengupload gambar');
                        
                        // Using dynamic fieldTarget to assign to correct property (imageUrl or thumbnailUrl)
                        this.modal.form[fieldTarget] = data.url;
                        if (fieldTarget === 'imageUrl') {
                            this.modal.form.cdnUrl = '';
                        } else if (fieldTarget === 'icon') {
                            this.modal.form.iconCdnUrl = '';
                        }
                        this.showToast('Gambar berhasil diupload');
                    } catch (e) {
                        this.showToast(e.message, 'error');
                    } finally {
                        this.isLoading = false;
                        // Reset file input value so same file can be chosen again if needed
                        event.target.value = '';
                    }
                },

                async uploadMultipleImages(event) {
                    const files = event.target.files;
                    if (!files || files.length === 0) return;
                    
                    this.isLoading = true;
                    try {
                        if (!this.modal.form.imageList) this.modal.form.imageList = [];
                        
                        for (let i = 0; i < files.length; i++) {
                            const formData = new FormData();
                            formData.append('file', files[i]);
                            
                            const response = await fetch('/api/upload', {
                                method: 'POST',
                                headers: { 'Authorization': 'Bearer ' + this.token },
                                body: formData
                            });
                            
                            if (response.status === 401 || response.status === 403) {
                                this.logout();
                                throw new Error('Sesi telah berakhir, silakan login kembali.');
                            }
                            
                            const data = await response.json();
                            if (!response.ok) throw new Error(data.message || 'Gagal mengupload gambar');
                            
                            this.modal.form.imageList.push(data.url);
                        }
                        this.showToast(files.length + ' gambar berhasil diupload');
                    } catch (e) {
                        this.showToast(e.message, 'error');
                    } finally {
                        this.isLoading = false;
                        event.target.value = '';
                    }
                },

                removeTemplateImage(idx) {
                    this.modal.form.imageList.splice(idx, 1);
                },

                previewZoomImage(imgUrl) {
                    const overlay = document.createElement('div');
                    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:9999;display:flex;align-items:center;justify-content:center;cursor:zoom-out;';
                    const img = document.createElement('img');
                    img.src = this.getImageUrl(imgUrl);
                    img.style.cssText = 'max-width:90%;max-height:90%;border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,0.5);';
                    overlay.appendChild(img);
                    overlay.addEventListener('click', () => overlay.remove());
                    document.body.appendChild(overlay);
                },

                async submitModal() {
                    this.isLoading = true;
                    try {
                        let url = '';
                        let method = this.modal.isEdit ? 'PUT' : 'POST';
                        let body = { ...this.modal.form };

                        if (body.cdnUrl !== undefined) {
                            if (body.cdnUrl) {
                                body.imageUrl = body.cdnUrl;
                            }
                            delete body.cdnUrl;
                        }
                        if (body.iconCdnUrl !== undefined) {
                            if (body.iconCdnUrl) {
                                body.icon = body.iconCdnUrl;
                            }
                            delete body.iconCdnUrl;
                        }

                        if (this.modal.type === 'categories') {
                            url = '/api/categories';
                            if (this.modal.isEdit) url += '/' + this.modal.id;
                        } else if (this.modal.type === 'audiences') {
                            url = '/api/options/audiences';
                            if (this.modal.isEdit) url += '/' + this.modal.id;
                        } else if (this.modal.type === 'styles') {
                            url = '/api/options/styles';
                            if (this.modal.isEdit) url += '/' + this.modal.id;
                        } else if (this.modal.type === 'themes') {
                            url = '/api/options/themes';
                            if (this.modal.isEdit) url += '/' + this.modal.id;
                        } else if (this.modal.type === 'characters') {
                            url = '/api/options/characters';
                            if (this.modal.isEdit) url += '/' + this.modal.id;
                        } else if (this.modal.type === 'apikeys') {
                            url = '/api/options/groq-keys';
                            body = { apiKey: this.modal.form.apiKey };
                        } else if (this.modal.type === 'templates') {
                            if (!this.modal.form.categoryId) {
                                this.showToast('Kategori harus dipilih untuk Template!', 'error');
                                this.isLoading = false;
                                return;
                            }
                            // Serialize imageList array as JSON for thumbnailUrl
                            body.thumbnailUrl = (this.modal.form.imageList && this.modal.form.imageList.length > 0)
                                ? JSON.stringify(this.modal.form.imageList)
                                : null;
                            delete body.imageList;
                            url = '/api/templates';
                            if (this.modal.isEdit) url += '/' + this.modal.id;
                        } else if (this.modal.type === 'history') {
                            url = '/api/prompt/history/' + this.modal.id;
                            // History only supports edit (PUT) from admin panel
                            method = 'PUT';
                        }

                        await this.fetchApi(url, {
                            method,
                            body: JSON.stringify(body)
                        });

                        this.showToast('Berhasil disimpan!');
                        this.modal.show = false;
                        this.loadDataForView(this.modal.type);
                    } catch (e) {
                        this.showToast(e.message, 'error');
                    } finally {
                        this.isLoading = false;
                    }
                },
                async deleteItem(type, id) {
                    if (!confirm('Anda yakin ingin menghapus data ini?')) return;
                    try {
                        let url = '';
                        if (type === 'categories') url = '/api/categories/' + id;
                        else if (type === 'audiences') url = '/api/options/audiences/' + id;
                        else if (type === 'styles') url = '/api/options/styles/' + id;
                        else if (type === 'themes') url = '/api/options/themes/' + id;
                        else if (type === 'characters') url = '/api/options/characters/' + id;
                        else if (type === 'apikeys') url = '/api/options/groq-keys/' + id;
                        else if (type === 'templates') url = '/api/templates/' + id;
                        else if (type === 'history') url = '/api/prompt/history/' + id;

                        await this.fetchApi(url, { method: 'DELETE' });
                        this.showToast('Berhasil dihapus!');
                        this.loadDataForView(type);
                    } catch (e) {
                        this.showToast(e.message, 'error');
                    }
                }
            }
        }).mount('#app');
    </script>
</body>
</html>
`;

// src/index.ts
import_dotenv2.default.config({ path: import_path6.default.join(__dirname, ".env") });
import_dotenv2.default.config({ path: import_path6.default.join(__dirname, "../.env") });
var app = (0, import_express.default)();
var PORT = process.env.PORT || 3e3;
app.use((0, import_cors.default)());
app.use(import_express.default.json({ limit: "50mb" }));
app.use("/assets", import_express.default.static(getAssetsPath(), {
  setHeaders: (res) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  }
}));
app.use(import_express.default.urlencoded({ limit: "50mb", extended: true }));
app.get("/", (req, res) => {
  const htmlContent = `
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PromptStudio AI - Gateway Dashboard</title>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-color: #0b0c10;
            --card-bg: rgba(22, 26, 37, 0.6);
            --primary: #6366f1;
            --accent: #10b981;
            --text-main: #f3f4f6;
            --text-muted: #9ca3af;
            --border: rgba(255, 255, 255, 0.08);
        }

        body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            background: radial-gradient(circle at top right, rgba(99, 102, 241, 0.1), transparent), var(--bg-color);
            color: var(--text-main);
            margin: 0;
            padding: 40px 20px;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .container {
            max-width: 900px;
            width: 100%;
            background: var(--card-bg);
            backdrop-filter: blur(16px);
            border: 1px solid var(--border);
            border-radius: 24px;
            padding: 40px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
        }

        header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid var(--border);
            padding-bottom: 24px;
            margin-bottom: 32px;
        }

        .logo-area h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
            letter-spacing: -0.5px;
            background: linear-gradient(135deg, #fff 30%, var(--primary));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .logo-area p {
            margin: 4px 0 0 0;
            color: var(--text-muted);
            font-size: 14px;
        }

        .status-badge {
            display: flex;
            align-items: center;
            gap: 8px;
            background: rgba(16, 185, 129, 0.1);
            color: var(--accent);
            padding: 8px 16px;
            border-radius: 100px;
            font-weight: 600;
            font-size: 13px;
            border: 1px solid rgba(16, 185, 129, 0.2);
        }

        .status-dot {
            width: 8px;
            height: 8px;
            background: var(--accent);
            border-radius: 50%;
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
            70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
            100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }

        h2 {
            font-size: 18px;
            color: var(--text-main);
            margin-top: 0;
            margin-bottom: 20px;
            font-weight: 600;
        }

        .endpoint-grid {
            display: grid;
            gap: 12px;
        }

        .endpoint-card {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 16px 20px;
            transition: all 0.2s ease;
        }

        .endpoint-card:hover {
            background: rgba(255, 255, 255, 0.04);
            border-color: rgba(99, 102, 241, 0.3);
            transform: translateX(4px);
        }

        .endpoint-left {
            display: flex;
            align-items: center;
            gap: 16px;
        }

        .method {
            font-family: 'JetBrains Mono', monospace;
            font-size: 12px;
            font-weight: 700;
            padding: 4px 10px;
            border-radius: 6px;
            width: 52px;
            text-align: center;
        }

        .method.get { background: rgba(59, 130, 246, 0.1); color: #3b82f6; border: 1px solid rgba(59, 130, 246, 0.2); }
        .method.post { background: rgba(16, 185, 129, 0.1); color: var(--accent); border: 1px solid rgba(16, 185, 129, 0.2); }
        .method.put { background: rgba(245, 158, 11, 0.1); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.2); }
        .method.delete { background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2); }

        .path {
            font-family: 'JetBrains Mono', monospace;
            color: var(--text-main);
            font-weight: 500;
            font-size: 14px;
        }

        .desc {
            color: var(--text-muted);
            font-size: 13px;
        }

        .auth-badge {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--border);
            color: var(--text-muted);
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 500;
        }

        .auth-badge.required {
            background: rgba(99, 102, 241, 0.1);
            border-color: rgba(99, 102, 241, 0.2);
            color: var(--primary);
        }

        .section-separator {
            height: 1px;
            background: var(--border);
            margin: 32px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <div class="logo-area">
                <h1>PromptStudio Gateway</h1>
                <p>Gateway API Node.js TypeScript \u2014 Berjalan 24 jam</p>
            </div>
            <div class="status-badge">
                <div class="status-dot"></div>
                SYSTEM READY
            </div>
        </header>

        <div style="text-align: center; margin-bottom: 40px; background: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 16px; padding: 24px;">
            <h2 style="margin-bottom: 16px;">Kelola Data Aplikasi</h2>
            <p style="margin-bottom: 24px; font-size: 15px;">Akses Panel Admin Web untuk mengelola Kategori, Audiens, Gaya Desain, Templates, Riwayat, dan API Keys.</p>
            <a href="/admin" style="display: inline-block; background-color: var(--primary); color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; transition: opacity 0.3s;" onmouseover="this.style.opacity=0.8" onmouseout="this.style.opacity=1">Buka Panel Admin</a>
        </div>

        <section>
            <h2>\u{1F511} Autentikasi (/api/auth/*)</h2>
            <div class="endpoint-grid">
                <div class="endpoint-card">
                    <div class="endpoint-left">
                        <span class="method post">POST</span>
                        <span class="path">/api/auth/register</span>
                        <span class="desc">Daftar pengguna baru</span>
                    </div>
                    <span class="auth-badge">Public</span>
                </div>
                <div class="endpoint-card">
                    <div class="endpoint-left">
                        <span class="method post">POST</span>
                        <span class="path">/api/auth/login</span>
                        <span class="desc">Masuk ke aplikasi</span>
                    </div>
                    <span class="auth-badge">Public</span>
                </div>
                <div class="endpoint-card">
                    <div class="endpoint-left">
                        <span class="method post">POST</span>
                        <span class="path">/api/auth/refresh</span>
                        <span class="desc">Perbarui access token</span>
                    </div>
                    <span class="auth-badge">Public</span>
                </div>
            </div>

            <div class="section-separator"></div>

            <h2>\u26A1 Prompting & AI (/api/prompt/*)</h2>
            <div class="endpoint-grid">
                <div class="endpoint-card">
                    <div class="endpoint-left">
                        <span class="method post">POST</span>
                        <span class="path">/api/prompt/generate</span>
                        <span class="desc">Buat Prompt Gambar AI dengan Groq</span>
                    </div>
                    <span class="auth-badge required">Bearer Auth</span>
                </div>
                <div class="endpoint-card">
                    <div class="endpoint-left">
                        <span class="method get">GET</span>
                        <span class="path">/api/prompt/history</span>
                        <span class="desc">Ambil riwayat pembuatan prompt</span>
                    </div>
                    <span class="auth-badge required">Bearer Auth</span>
                </div>
                <div class="endpoint-card">
                    <div class="endpoint-left">
                        <span class="method delete">DELETE</span>
                        <span class="path">/api/prompt/history/:id</span>
                        <span class="desc">Hapus riwayat prompt</span>
                    </div>
                    <span class="auth-badge required">Bearer Auth</span>
                </div>
            </div>

            <div class="section-separator"></div>

            <h2>\u{1F464} Profil Pengguna (/api/user/*)</h2>
            <div class="endpoint-grid">
                <div class="endpoint-card">
                    <div class="endpoint-left">
                        <span class="method get">GET</span>
                        <span class="path">/api/user/profile</span>
                        <span class="desc">Ambil informasi profil aktif</span>
                    </div>
                    <span class="auth-badge required">Bearer Auth</span>
                </div>
                <div class="endpoint-card">
                    <div class="endpoint-left">
                        <span class="method put">PUT</span>
                        <span class="path">/api/user/profile</span>
                        <span class="desc">Perbarui profil</span>
                    </div>
                    <span class="auth-badge required">Bearer Auth</span>
                </div>

            </div>
        </section>
    </div>
</body>
</html>
  `;
  res.send(htmlContent);
});
app.get("/admin", (req, res) => {
  res.send(getAdminHtml());
});
app.post("/api/auth/register", register);
app.post("/api/auth/login", login);
app.post("/api/auth/refresh", refresh);
app.post("/api/auth/logout", logout);
app.get("/api/user/profile", authenticateToken, getProfile);
app.put("/api/user/profile", authenticateToken, updateProfile);
app.put("/api/user/change-password", authenticateToken, changePassword);
app.post("/api/prompt/generate", authenticateToken, generatePrompt);
app.post("/api/prompt/generate-ad", authenticateToken, generateAdPrompt);
app.post("/api/prompt/generate-banner", authenticateToken, generateBannerPrompt);
app.post("/api/prompt/generate-logo", authenticateToken, generateLogoPrompt);
app.post("/api/prompt/generate-quote", authenticateToken, generateQuotePrompt);
app.post("/api/prompt/generate-digital-product", authenticateToken, generateDigitalProductPrompt);
app.get("/api/prompt/history/all", authenticateToken, getAllHistoryAdmin);
app.get("/api/prompt/history", authenticateToken, getPromptHistory);
app.get("/api/prompt/history/:id", authenticateToken, getPromptHistoryById);
app.put("/api/prompt/history/:id", authenticateToken, updatePromptHistory);
app.delete("/api/prompt/history/:id", authenticateToken, deletePromptHistory);
app.get("/api/prompt/favorites", authenticateToken, getFavoritePrompts);
app.post("/api/prompt/favorite/:id", authenticateToken, addFavorite);
app.delete("/api/prompt/favorite/:id", authenticateToken, removeFavorite);
app.post("/api/upload", authenticateToken, upload.single("file"), uploadFile);
app.post("/api/upload-multi", authenticateToken, upload.array("files", 10), uploadFiles);
app.get("/api/options/audiences", getTargetAudiences);
app.post("/api/options/audiences", authenticateToken, createTargetAudience);
app.put("/api/options/audiences/:id", authenticateToken, updateTargetAudience);
app.delete("/api/options/audiences/:id", authenticateToken, deleteTargetAudience);
app.get("/api/options/styles", getDesignStyles);
app.post("/api/options/styles", authenticateToken, createDesignStyle);
app.put("/api/options/styles/:id", authenticateToken, updateDesignStyle);
app.delete("/api/options/styles/:id", authenticateToken, deleteDesignStyle);
app.get("/api/options/themes", getThemes);
app.post("/api/options/themes", authenticateToken, createTheme);
app.put("/api/options/themes/:id", authenticateToken, updateTheme);
app.delete("/api/options/themes/:id", authenticateToken, deleteTheme);
app.get("/api/options/characters", getCharacters);
app.post("/api/options/characters", authenticateToken, createCharacter);
app.put("/api/options/characters/:id", authenticateToken, updateCharacter);
app.delete("/api/options/characters/:id", authenticateToken, deleteCharacter);
app.get("/api/options/groq-keys", authenticateToken, getGroqApiKeys);
app.post("/api/options/groq-keys", authenticateToken, createGroqApiKey);
app.delete("/api/options/groq-keys/:id", authenticateToken, deleteGroqApiKey);
app.post("/api/options/groq-keys/:id/reset", authenticateToken, resetGroqApiKeyErrors);
app.get("/api/categories", getCategories);
app.post("/api/categories", authenticateToken, createCategory);
app.put("/api/categories/:id", authenticateToken, updateCategory);
app.delete("/api/categories/:id", authenticateToken, deleteCategory);
app.get("/api/templates", getTemplates);
app.get("/api/templates/search", searchTemplates);
app.get("/api/templates/:id", getTemplateById);
app.post("/api/templates", authenticateToken, createTemplate);
app.put("/api/templates/:id", authenticateToken, updateTemplate);
app.delete("/api/templates/:id", authenticateToken, deleteTemplate);
app.get("/api/config", authenticateToken, getAppConfig);
app.post("/api/config", authenticateToken, setAppConfig);
app.get("/api/settings", authenticateToken, getUserSettings);
app.post("/api/settings", authenticateToken, updateUserSettings);
app.get("/api/options/digital-product-types", getDigitalProductTypes);
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  try {
    console.log("Initializing/Migrating digital_product_types in MySQL...");
    await query(`
      CREATE TABLE IF NOT EXISTS digital_product_types (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL
      )
    `);
    const checkEmpty = await query("SELECT COUNT(*) as count FROM digital_product_types");
    const count = checkEmpty.rows[0]?.count || 0;
    if (parseInt(count, 10) === 0) {
      console.log("Seeding default digital product types...");
      const defaultTypes = [
        "E-book / Buku Digital",
        "Online Course / Kelas Online",
        "Template Desain (Canva, Figma, dll)",
        "Preset Foto / Lightroom Preset",
        "Aplikasi / Software / SaaS",
        "Plugin / Add-on / Extension",
        "Kursus / Panduan Video",
        "Digital Art / Wallpaper",
        "Tools & Resources Pack",
        "Membership / Komunitas Digital"
      ];
      const { v4: uuidv414 } = require("uuid");
      for (const type of defaultTypes) {
        await query(
          "INSERT INTO digital_product_types (id, name) VALUES (?, ?)",
          [uuidv414(), type]
        );
      }
      console.log("Seeding digital product types completed.");
    }
  } catch (dbErr) {
    console.error("Failed to initialize digital_product_types table in MySQL:", dbErr);
  }
  cleanAllUnusedAssets().then((deletedCount) => {
    if (deletedCount > 0) {
      console.log(`[Asset Cleanup] Deleted ${deletedCount} unused local asset files.`);
    }
  }).catch((err) => {
    console.error("[Asset Cleanup] Failed to run startup cleanup:", err);
  });
});
/*! Bundled license information:

media-typer/index.js:
  (*!
   * media-typer
   * Copyright(c) 2014 Douglas Christopher Wilson
   * MIT Licensed
   *)

mime-db/index.js:
  (*!
   * mime-db
   * Copyright(c) 2014 Jonathan Ong
   * Copyright(c) 2015-2022 Douglas Christopher Wilson
   * MIT Licensed
   *)

mime-types/index.js:
  (*!
   * mime-types
   * Copyright(c) 2014 Jonathan Ong
   * Copyright(c) 2015 Douglas Christopher Wilson
   * MIT Licensed
   *)

type-is/index.js:
  (*!
   * type-is
   * Copyright(c) 2014 Jonathan Ong
   * Copyright(c) 2014-2015 Douglas Christopher Wilson
   * MIT Licensed
   *)

safe-buffer/index.js:
  (*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> *)
*/
