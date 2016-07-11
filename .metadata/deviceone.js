(function (mod) {
    if (typeof exports == "object" && typeof module == "object") {
        return mod(require.main.require("../lib/infer"), require.main.require("../lib/tern"), require);
    }
    if (typeof define == "function" && define.amd)
        return define(["tern/lib/infer", "tern/lib/tern"], mod);
    mod(tern, tern);
})(function (infer, tern, require) {
    "use strict";
    function ResolvePath(base, path) {
        if (path[0] == "/")
            return path;
        var slash = base.lastIndexOf("/"),
            m;
        if (slash >= 0)
            path = base.slice(0, slash + 1) + path;
        while (m = /[^\/]*[^\/\.][^\/]*\/\.\.\//.exec(path))
            path = path.slice(0, m.index) + path.slice(m.index + m[0].length);
        return path.replace(/(^|[^\.])\.\//g, "$1");
    }

    function StringEndWith(that, str) {
        if (!that || !str || str.length > that.length)
            return false;
        return that.substring(that.length - str.length) == str;
    }

    function RelativePath(from, to) {
        if (from[from.length - 1] != "/")
            from += "/";
        if (to.indexOf(from) == 0)
            return to.slice(from.length);
        else
            return to;
    }

    function GetModule(data, name) {
        return data.modules[name] || (data.modules[name] = new infer.AVal);
    }

    function BuildWrappingScope(parent, origin, node) {
        var scope = new infer.Scope(parent);
        scope.originNode = node;
        infer.cx().definitions.deviceone.require.propagate(scope.defProp("require"));
        var module = new infer.Obj(infer.cx().definitions.deviceone.Module.getProp("prototype").getType());
        module.propagate(scope.defProp("module"));
        var exports = new infer.Obj(true, "exports");
        module.origin = exports.origin = origin;
        module.originNode = exports.originNode = scope.originNode;
        exports.propagate(scope.defProp("exports"));
        var moduleExports = scope.exports = module.defProp("exports");
        exports.propagate(moduleExports, 95);
        return scope;
    }

    function ResolveModule(server, name, _parent) {
        server.addFile(name, null, server._node.currentOrigin);
        return GetModule(server._node, name);
    }

    function BuildUIFileIDMap(obj, r) {
        r = r || {};
        if (obj.RootView) {
            r.$ = obj.RootView.type;
            BuildUIFileIDMap(obj.RootView, r);
        }
        if (obj.id) {
            r[obj.id] = obj.type;
        }
        if (obj.views) {
            var i = 0,
                l = obj.views.length;
            for (; i < l; i++) {
                BuildUIFileIDMap(obj.views[i], r);
            }
        }
        return r;
    }

    function GetScriptJSName(dir, fy, rs) {
        return [];
    }

    /** ******************************************************************************************************************** */
    var DEFINES;
    if (require)
        (function () {
            var fs = require("fs"),
                module_ = require("module"),
                path = require("path");
            RelativePath = path.relative;
            ResolveModule = function (server, name, parent) {
                var data = server._node;
                if (data.options.dontLoad == true || data.options.dontLoad && new RegExp(data.options.dontLoad).test(name) || data.options.load && !new RegExp(data.options.load).test(name))
                    return infer.ANull;
                if (data.modules[name])
                    return data.modules[name];
                var file = server.options.projectDir + "/source/default/script/" + name + ".js";
                var norm = NormPath(file);
                if (data.modules[norm])
                    return data.modules[norm];

                if (fs.existsSync(file) && /^(\.js)?$/.test(path.extname(file)))
                    server.addFile(RelativePath(server.options.projectDir, file), null, data.currentOrigin);
                return data.modules[norm] = new infer.AVal;
            };


            GetScriptJSName = function (dir, fy, rs) {
                rs = rs || [];
                fy = fy || "";
                var list = fs.readdirSync(dir);
                for (var i = 0; i < list.length; i++) {
                    var fx = list[i];
                    var file = dir + '/' + fx;
                    var stat = fs.statSync(file);
                    if (!stat) continue;
                    if (stat.isFile() && file.split(".").pop().toLowerCase() === "js") {
                        rs.push(fy + fx);
                    }
                    if (stat.isDirectory()) {
                        GetScriptJSName(file, fy + fx + "/", rs);
                    }
                }
                return rs;
            };

        })();
    /** ******************************************************************************************************************** */

    function NormPath(name) {
        return name.replace(/\\/g, "/");
    }

    function ResolveProjectPath(server, pth) {
        return ResolvePath(NormPath(server.options.projectDir || "") + "/", NormPath(pth));
    }

    function PreCondenseReach(state) {
        var mods = infer.cx().parent._node.modules;
        var node = state.roots["!node"] = new infer.Obj(null);
        for (var name in mods) {
            var mod = mods[name];
            var id = mod.origin || name;
            var prop = node.defProp(id.replace(/\./g, "`"));
            mod.propagate(prop);
            prop.origin = mod.origin;
        }
    }

    function PostLoadDef(data) {
        var cx = infer.cx(),
            mods = cx.definitions[data["!name"]]["!node"];
        var data = cx.parent._node;
        if (mods)
            for (var name in mods.props) {
                var origin = name.replace(/`/g, ".");
                var mod = GetModule(data, origin);
                mod.origin = origin;
                mods.props[name].propagate(mod);
            }
    }

    function FindTypeAt(file, pos, expr, type) {
        var isStringLiteral = expr.node.type === "Literal" && typeof expr.node.value === "string";
        var isRequireArg = !!expr.node.required;
        if (isStringLiteral && isRequireArg) {
            type = Object.create(type);
            var exportedType = expr.node.required.types[0];
            type.origin = exportedType.origin;
            type.originNode = exportedType.originNode;
        }
        return type;
    }

    function MaybeSet(obj, prop, val) {
        if (val != null)
            obj[prop] = val;
    }

    /** ***************Properties************* */
    function GetObjectProperties(proto) {
        var cx = infer.cx(),
            locals = cx.definitions.deviceone;
        var objectName = proto.name,
            index = objectName.indexOf("UI.");
        if (index == 0)
            objectName = objectName.substring("UI.".length, objectName.length);
        objectName = objectName.substring(0, objectName.indexOf('.'));
        return locals["!pp"].hasProp(objectName);
    }

    function GetPropertyType(widgetType, propertyName) {
        if (!(widgetType))
            return null;
        var proto = widgetType.proto,
            propertyType = null;
        while (proto) {
            var objectType = GetObjectProperties(proto);
            if (objectType && objectType.getType)
                propertyType = objectType.getType().hasProp(propertyName);
            if (propertyType)
                return propertyType;
            proto = proto.proto;
        }
        return null;
    }

    /** ***************Events************* */
    function GetEventProperties(proto) {
        var cx = infer.cx(),
            locals = cx.definitions.deviceone;
        var oname = proto.name;
        if (!oname.indexOf("UI.") || !oname.indexOf("SM.") || !oname.indexOf("MM.")) {
            oname = oname.substring("UI.".length, oname.length);
        }
        oname = oname.substring(0, oname.indexOf('.'));
        return locals["!ee"].hasProp(oname);
    }

    function Completion(file, query) {
        function getQuote(c) {
            return c === "'" || c === '"' ? c : null;
        }

        if (!query.end)
            return;

        var wordPos = tern.resolvePos(file, query.end);
        var word = null,
            completions = [];
        var wrapAsObjs = query.types || query.depths || query.docs || query.urls || query.origins;
        var cx = infer.cx(),
            overrideType = null;

        function gather(prop, obj, depth, addInfo) {
            if (obj == cx.protos.Object && !word)
                return;
            if (query.filter !== false && word && (query.caseInsensitive ? prop.toLowerCase() : prop).indexOf(word) !== 0)
                return;
            for (var i = 0; i < completions.length; ++i) {
                var c = completions[i];
                if ((wrapAsObjs ? c.name : c) == prop)
                    return;
            }
            var rec = wrapAsObjs ? {
                name: prop
            }
                : prop;
            completions.push(rec);

            if (obj && (query.types || query.docs || query.urls || query.origins)) {
                var val = obj.props[prop];
                infer.resetGuessing();
                var type = val.getType();
                rec.guess = infer.didGuess();
                if (query.types)
                    rec.type = overrideType != null ? overrideType : infer.toString(type);
                if (query.docs)
                    MaybeSet(rec, "doc", val.doc || type && type.doc);
                if (query.urls)
                    MaybeSet(rec, "url", val.url || type && type.url);
                if (query.origins)
                    MaybeSet(rec, "origin", val.origin || type && type.origin);
            }
            if (query.depths)
                rec.depth = depth;
            if (wrapAsObjs && addInfo)
                addInfo(rec);
        }

        var callExpr = infer.findExpressionAround(file.ast, null, wordPos, file.scope, "CallExpression");
        if (callExpr && callExpr.node.arguments && callExpr.node.arguments.length && callExpr.node.arguments.length > 0) {
            var nodeArg = callExpr.node.arguments[0];
            if (!(nodeArg.start <= wordPos && nodeArg.end >= wordPos))
                return;
            if (nodeArg._do_type) {
                var startQuote = getQuote(nodeArg.raw.charAt(0)),
                    endQuote = getQuote(nodeArg.raw.length > 1 ? nodeArg.raw.charAt(nodeArg.raw.length - 1) : null);
                var wordEnd = endQuote != null ? nodeArg.end - 1 : nodeArg.end,
                    wordStart = startQuote != null ? nodeArg.start + 1 : nodeArg.start,
                    word = nodeArg.value.slice(0,
                        nodeArg.value.length - (wordEnd - wordPos));
                if (query.caseInsensitive)
                    word = word.toLowerCase();

                switch (nodeArg._do_type.type) {
                    case "deviceone_pp":
                        var widgetType = nodeArg._do_type.proxy,
                            proto = widgetType.proto,
                            propertyType = null;
                        while (proto) {
                            var objType = GetObjectProperties(proto);
                            if (objType)
                                infer.forAllPropertiesOf(objType, gather);
                            proto = proto.proto;
                        }
                        break;

                    case "deviceone_ee":
                        var widgetType = nodeArg._do_type.proxy,
                            proto = widgetType.proto,
                            propertyType = null;
                        while (proto) {
                            var objType = GetEventProperties(proto);
                            if (objType)
                                infer.forAllPropertiesOf(objType, gather);
                            proto = proto.proto;
                        }
                        break;
                    case "deviceone_ui":
                        var server = cx.parent;
                        var _uimap = server._node.currentIDMap;
                        for (var k in _uimap) {
                            var _t = {};
                            _t.name = k;
                            _t.type = _uimap[k];
                            completions.push(_t);
                        }
                        break;
                    case "deviceone_sm":
                        var types = cx.definitions.deviceone["SM"];
                        overrideType = "SM";
                        infer.forAllPropertiesOf(types, gather);
                        break;
                    case "deviceone_mm":
                        var types = cx.definitions.deviceone["MM"];
                        overrideType = "MM";
                        infer.forAllPropertiesOf(types, gather);
                        break;
                    case "deviceone_rq":
                    	completions.push({ name : "deviceone", type:"module" });
                        var server = cx.parent;
                        var rs = GetScriptJSName(server.options.projectDir + "/source/default/script/");
                        var _t, _m;
                        for (var i = 0; i < rs.length; i++) {
                            _m = rs[i];
                            _t = {};
                            _t.name = _m.substring(0, _m.lastIndexOf(".js"));
                            _t.type = "module";
                            completions.push(_t);
                        }
                        break;
                }

                return {
                    start: tern.outputPos(query, file, wordStart),
                    end: tern.outputPos(query, file, wordEnd),
                    isProperty: false,
                    isStringAround: true,
                    startQuote: startQuote,
                    endQuote: endQuote,
                    completions: completions
                }
            }
        }
    }

    /** ******************************************************************************************************************** */

    infer.registerFunction("deviceone_ui", function (_self, args, argNodes) {
        if (!argNodes || !argNodes.length || argNodes[0].type != "Literal" || typeof argNodes[0].value != "string")
            return infer.ANull;
        var name = argNodes[0].value;
        var cx = infer.cx(),
            server = cx.parent;
        name = server._node.currentIDMap[name];
        var locals = cx.definitions.deviceone["UI"],
            dType = locals.hasProp(name);
        argNodes[0]._do_type = {
            "type": "deviceone_ui"
        };
        if (dType)
            return new infer.Obj(dType.getType().getProp("prototype").getType());
        return infer.ANull;
    });

    infer.registerFunction("deviceone_sm", function (_self, args, argNodes) {
        if (!argNodes || !argNodes.length || argNodes[0].type != "Literal" || typeof argNodes[0].value != "string")
            return infer.ANull;
        var name = argNodes[0].value;
        var cx = infer.cx(),
            server = cx.parent;
        var locals = cx.definitions.deviceone["SM"],
            dType = locals.hasProp(name);
        argNodes[0]._do_type = {
            "type": "deviceone_sm"
        };
        if (dType)
            return new infer.Obj(dType.getType().getProp("prototype").getType());
        return infer.ANull;
    });

    infer.registerFunction("deviceone_mm", function (_self, args, argNodes) {
        if (!argNodes || !argNodes.length || argNodes[0].type != "Literal" || typeof argNodes[0].value != "string")
            return infer.ANull;
        var name = argNodes[0].value;
        var cx = infer.cx(),
            server = cx.parent;
        var locals = cx.definitions.deviceone["MM"],
            dType = locals.hasProp(name);
        argNodes[0]._do_type = {
            "type": "deviceone_mm"
        };
        if (dType)
            return new infer.Obj(dType.getType().getProp("prototype").getType());
        return infer.ANull;
    });

    infer.registerFunction("deviceone_ee", function (_self, args, argNodes) {
        if (!argNodes || !argNodes.length || argNodes[0].type != "Literal" || typeof argNodes[0].value != "string")
            return infer.ANull;
        var proxy = _self.getType();
        argNodes[0]._do_type = {
            "type": "deviceone_ee",
            "proxy": proxy
        };
    });

    infer.registerFunction("deviceone_pp", function (_self, args, argNodes) {
        if (!argNodes || !argNodes.length || argNodes[0].type != "Literal" || typeof argNodes[0].value != "string")
            return infer.ANull;
        var widgetType = _self.getType(),
            propertyName = argNodes[0].value,
            propertyType = GetPropertyType(widgetType, propertyName);
        argNodes[0]._do_type = {
            "type": "deviceone_pp",
            "proxy": widgetType
        };
        if (propertyType)
            return propertyType.getType();
        return infer.ANull;
    });

    infer.registerFunction("deviceone_rq", function (_self, _args, argNodes) {
        if (!argNodes || !argNodes.length || argNodes[0].type != "Literal" || typeof argNodes[0].value != "string")
            return infer.ANull;
        var cx = infer.cx(),
            server = cx.parent,
            data = server._node,
            name = argNodes[0].value;

        argNodes[0]._do_type = {
            "type": "deviceone_rq",
            "proxy": _self.getType()
        };

        if (name == "deviceone") {
            return new infer.Obj(cx.definitions.deviceone["!$"]);
        }
        var result;
        if (data.options.modules && data.options.modules.hasOwnProperty(name)) {
            var scope = BuildWrappingScope(cx.topScope, name);
            infer.def.load(data.options.modules[name], scope);
            result = data.modules[name] = scope.exports;
        } else {
            var currentFile = data.currentFile || ResolveProjectPath(server, argNodes[0].sourceFile.name);
            var relative = /^\.{0,2}\//.test(name);
            if (relative) {
                if (!currentFile)
                    return argNodes[0].required || infer.ANull;
                name = ResolvePath(currentFile, name);
            }
            result = ResolveModule(server, name, currentFile);
        }
        return argNodes[0].required = result;
    });
    
    infer.registerFunction("deviceone_cs", function(_self, args, argNodes) {
        var cx = infer.cx();
        var Cs = new infer.Obj(null);
        Cs.defProp("fn");
        return Cs;
    });

    tern.registerPlugin("deviceone", function (server, options) {

        server._node = {
            modules: Object.create(null),
            options: options || {},
            currentFile: null,
            currentRequires: [],
            currentOrigin: null,
            server: server
        };

        server.on("beforeLoad", function (file) {
            var fs = require("fs");
            if (StringEndWith(file.name, ".ui.js")) {
                var pathui = (server.options.projectDir + "/" + file.name).replace(".ui.js", ".ui");
                if (fs.existsSync(pathui)) {
                    this._node.currentIDMap = BuildUIFileIDMap(JSON.parse(fs.readFileSync(pathui)));
                }
            }
            this._node.currentFile = ResolveProjectPath(server, file.name);
            this._node.currentOrigin = file.name;
            this._node.currentRequires = [];
            file.scope = BuildWrappingScope(file.scope, this._node.currentOrigin, file.ast);
        });

        server.on("afterLoad", function (file) {
            var mod = GetModule(this._node, this._node.currentFile);
            mod.origin = this._node.currentOrigin;
            file.scope.exports.propagate(mod);
            this._node.currentFile = null;
            this._node.currentOrigin = null;
        });

        server.on("reset", function () {
            this._node.modules = Object.create(null);
        });

        return {
            defs: DEFINES,
            passes: {
                completion: Completion,
                preCondenseReach: PreCondenseReach,
                postLoadDef: PostLoadDef,
                typeAt: FindTypeAt
            }

        };
    });
/**}); **/ 
DEFINES={"mm":{"!type":"deviceone.mm"},"deviceone":{"mm":{"!type":"fn(id: string) -> !custom:deviceone_mm"},"foreach":{"!effects":["call !1 string !0.<i>"],"!type":"fn(obj: ?, f: fn(key: string, value: ?))"},"print":{"!type":"fn(info: string, name?: string)"},"ui":{"!type":"fn(id: string) -> !custom:deviceone_ui"},"merge":{"!effects":["copy !1 !0","copy !2 !0"],"!type":"fn(target: ?, source: ?, source2?: ?) -> !0"},"sm":{"!type":"fn(id: string) -> !custom:deviceone_sm"},"Class":{"!type":"fn(Super: ?, init: fn()) -> !custom:deviceone_cs"},"foreachi":{"!effects":["call !1 number !0.<i>"],"!type":"fn(list: [?], f: fn(index: number, value: ?))"}},"ui":{"!type":"deviceone.ui"},"!name":"deviceone","sm":{"!type":"deviceone.sm"},"!define":{"MM":{"do_HashData":{"!type":"fn()","prototype":{"addOne":{"!type":"fn(key: string, value: string)"},"removeAll":{"!type":"fn()"},"getAll":{"!type":"fn() -> Node"},"getOne":{"!type":"fn(key: string) -> string"},"!proto":"!MM.prototype","addData":{"!type":"fn(data: Node)"},"getCount":{"!type":"fn() -> number"},"removeData":{"!type":"fn(keys: Node)"},"removeOne":{"!type":"fn(key: string)"},"getData":{"!type":"fn(keys: Node) -> Node"}},"!url":""},"do_ListData":{"!type":"fn()","prototype":{"addOne":{"!type":"fn(data: Node, index: number)"},"removeAll":{"!type":"fn()"},"getRange":{"!type":"fn(fromIndex: number, toIndex: number)"},"getOne":{"!type":"fn(index: number) -> string"},"removeRange":{"!type":"fn(fromIndex: number, toIndex: number)"},"!proto":"!MM.prototype","addData":{"!type":"fn(data: Node, index: number)"},"updateOne":{"!type":"fn(index: number, data: string)"},"getCount":{"!type":"fn() -> number"},"removeData":{"!type":"fn(indexs: Node)"},"getData":{"!type":"fn(indexs: Node) -> string"}},"!url":""},"do_Timer":{"!type":"fn()","prototype":{"delay":{"!type":"number"},"stop":{"!type":"fn()"},"start":{"!type":"fn()"},"!proto":"!MM.prototype","interval":{"!type":"number"},"isStart":{"!type":"fn() -> bool"}},"!url":""},"do_Http":{"!type":"fn()","prototype":{"request":{"!type":"fn()"},"method":{"!type":"string"},"upload":{"!type":"fn(path: string, name: string)"},"setRequestHeader":{"!type":"fn(key: string, value: string)"},"responseEncoding":{"!type":"string"},"!proto":"!MM.prototype","body":{"!type":"string"},"timeout":{"!type":"number"},"url":{"!type":"string"},"download":{"!type":"fn(path: string)"},"form":{"!type":"fn(data: Node)"},"getResponseHeader":{"!type":"fn(key: string) -> string"},"contentType":{"!type":"string"}},"!url":""},"do_Animation":{"!type":"fn()","prototype":{"rotate":{"!type":"fn(data: Node, id: string)"},"transfer":{"!type":"fn(data: Node, id: string)"},"alpha":{"!type":"fn(data: Node, id: string)"},"!proto":"!MM.prototype","scale":{"!type":"fn(data: Node, id: string)"},"fillAfter":{"!type":"bool"}},"!url":""},"do_Animator":{"!type":"fn()","prototype":{"!proto":"!MM.prototype","append":{"!type":"fn(duration: number, props: Node, curve: string)"}},"!url":""},"do_Socket":{"!type":"fn()","prototype":{"!proto":"!MM.prototype","close":{"!type":"fn() -> bool"},"send":{"!effects":["call !2 this=!this"],"!type":"fn(type: string, content: string, f: fn(data: bool, e: ?)) -> !this"},"connect":{"!effects":["call !2 this=!this"],"!type":"fn(ip: string, port: string, f: fn(data: bool, e: ?)) -> !this"}},"!url":""}},"!pp":{"do_SlideListView":{"isHeaderVisible":{"!type":"bool"},"isShowbar":{"!type":"bool"},"isFooterVisible":{"!type":"bool"},"templates":{"!type":"string"},"canScrollToTop":{"!type":"bool"},"selectedColor":{"!type":"string"},"footerView":{"!type":"string"},"headerView":{"!type":"string"}},"do_Timer":{"delay":{"!type":"number"},"interval":{"!type":"number"}},"do_BaiduMapView":{"zoomLevel":{"!type":"number"},"mapType":{"!type":"string"}},"do_Button":{"fontSize":{"!type":"number"},"bgImage":{"!type":"string"},"text":{"!type":"string"},"fontStyle":{"!type":"string"},"radius":{"!type":"number"},"enabled":{"!type":"bool"},"fontColor":{"!type":"string"},"textFlag":{"!type":"string"}},"do_WebView":{"isShowLoadingProgress":{"!type":"bool"},"isHeaderVisible":{"!type":"bool"},"allowDeviceOne":{"!type":"bool"},"zoom":{"!type":"bool"},"headerView":{"!type":"string"},"cacheType":{"!type":"string"},"url":{"!type":"string"}},"do_ListView":{"isHeaderVisible":{"!type":"bool"},"isShowbar":{"!type":"bool"},"isFooterVisible":{"!type":"bool"},"templates":{"!type":"string"},"canScrollToTop":{"!type":"bool"},"bounces":{"!type":"bool"},"selectedColor":{"!type":"string"},"footerView":{"!type":"string"},"headerView":{"!type":"string"}},"do_BarcodeView":{"scanArea":{"!type":"string"}},"do_HashData":{},"do_ProgressBar1":{"changeImage":{"!type":"string"},"style":{"!type":"string"},"defaultImage":{"!type":"string"},"pointNum":{"!type":"number"},"pointColors":{"!type":"string"}},"do_SegmentView":{"templates":{"!type":"string"},"index":{"!type":"number"}},"do_Animation":{"fillAfter":{"!type":"bool"}},"do_FrameAnimationView":{},"do_Label":{"maxHeight":{"!type":"number"},"textAlign":{"!type":"string"},"maxLines":{"!type":"number"},"fontSize":{"!type":"number"},"text":{"!type":"string"},"fontStyle":{"!type":"string"},"fontColor":{"!type":"string"},"textFlag":{"!type":"string"},"maxWidth":{"!type":"number"}},"do_Picker":{"index":{"!type":"number"},"fontSize":{"!type":"number"},"fontStyle":{"!type":"string"},"fontColor":{"!type":"string"}},"do_ImageView":{"scale":{"!type":"string"},"source":{"!type":"string"},"radius":{"!type":"number"},"cacheType":{"!type":"string"},"defaultImage":{"!type":"string"},"enabled":{"!type":"bool"},"animation":{"!type":"string"}},"do_ListData":{},"do_ProgressBar":{"progress":{"!type":"number"},"style":{"!type":"string"}},"do_ProgressBar2":{"progressWidth":{"!type":"number"},"progressColor":{"!type":"string"},"progressBgColor":{"!type":"string"},"progress":{"!type":"number"},"fontSize":{"!type":"number"},"style":{"!type":"string"},"text":{"!type":"string"},"fontColor":{"!type":"string"}},"do_Http":{"method":{"!type":"string"},"responseEncoding":{"!type":"string"},"body":{"!type":"string"},"contentType":{"!type":"string"},"timeout":{"!type":"number"},"url":{"!type":"string"}},"do_SlideView":{"looping":{"!type":"bool"},"templates":{"!type":"Node"},"isAllCache":{"!type":"bool"},"index":{"!type":"number"},"allowGesture":{"!type":"bool"}},"do_TextBox":{"hintColor":{"!type":"string"},"hint":{"!type":"string"},"fontSize":{"!type":"number"},"text":{"!type":"string"},"fontStyle":{"!type":"string"},"enabled":{"!type":"bool"},"fontColor":{"!type":"string"},"maxLength":{"!type":"number"},"textFlag":{"!type":"string"},"cursorColor":{"!type":"string"}},"do_ImageCropView":{"cropArea":{"!type":"string"},"source":{"!type":"string"}},"do_MarqueeLabel":{"fontSize":{"!type":"number"},"text":{"!type":"string"},"fontStyle":{"!type":"string"},"fontColor":{"!type":"string"},"textFlag":{"!type":"string"},"direction":{"!type":"string"}},"do_LinearLayout":{"padding":{"!type":"string"},"bgImageFillType":{"!type":"string"},"bgImage":{"!type":"string"},"enabled":{"!type":"bool"},"direction":{"!type":"string"}},"do_ALayout":{"bgImageFillType":{"!type":"string"},"layoutAlign":{"!type":"string"},"bgImage":{"!type":"string"},"isStretch":{"!type":"bool"},"enabled":{"!type":"bool"}},"do_TextField":{"textAlign":{"!type":"string"},"clearImg":{"!type":"string"},"fontStyle":{"!type":"string"},"clearAll":{"!type":"bool"},"enabled":{"!type":"bool"},"cursorColor":{"!type":"string"},"hintColor":{"!type":"string"},"password":{"!type":"bool"},"hint":{"!type":"string"},"fontSize":{"!type":"number"},"inputType":{"!type":"string"},"text":{"!type":"string"},"enterText":{"!type":"string"},"fontColor":{"!type":"string"},"maxLength":{"!type":"number"},"textFlag":{"!type":"string"}},"do_Animator":{},"do_GridView":{"isHeaderVisible":{"!type":"bool"},"isShowbar":{"!type":"bool"},"templates":{"!type":"Node"},"hSpacing":{"!type":"number"},"vSpacing":{"!type":"number"},"canScrollToTop":{"!type":"bool"},"selectedColor":{"!type":"string"},"headerView":{"!type":"string"},"numColumns":{"!type":"number"}},"do_Socket":{},"do_ViewShower":{},"do_ScrollView":{"isHeaderVisible":{"!type":"bool"},"isShowbar":{"!type":"bool"},"canScrollToTop":{"!type":"bool"},"headerView":{"!type":"string"},"direction":{"!type":"string"}}},"!ee":{"do_SlideListView":{"pull":{"!type":"Event"},"longTouch":{"!type":"Event"},"touch1":{"!type":"Event"},"scroll":{"!type":"Event"},"touch":{"!type":"Event"},"longTouch1":{"!type":"Event"},"push":{"!type":"Event"}},"do_BaiduMapView":{"touchMarker":{"!type":"Event"},"touchMap":{"!type":"Event"}},"do_Button":{"touchDown":{"!type":"Event"},"touchUp":{"!type":"Event"},"touch":{"!type":"Event"}},"do_ListView":{"pull":{"!type":"Event"},"longTouch":{"!type":"Event"},"touch1":{"!type":"Event"},"scroll":{"!type":"Event"},"touch":{"!type":"Event"},"longTouch1":{"!type":"Event"},"push":{"!type":"Event"}},"do_BarcodeView":{},"do_HashData":{},"do_ProgressBar1":{},"do_App":{"loaded":{"!type":"Event"}},"do_DataCache":{},"do_FrameAnimationView":{},"do_Picker":{"selectChanged":{"!type":"Event"}},"do_ImageView":{"touch":{"!type":"Event"}},"do_ListData":{},"do_ProgressBar2":{},"do_TencentWX":{},"do_Algorithm":{},"do_TextBox":{"focusIn":{"!type":"Event"},"focusOut":{"!type":"Event"},"textChanged":{"!type":"Event"}},"do_ImageCropView":{},"do_CacheManager":{},"do_MarqueeLabel":{},"do_LinearLayout":{"touch":{"!type":"Event"}},"do_ALayout":{"touchDown":{"!type":"Event"},"touchUp":{"!type":"Event"},"longTouch":{"!type":"Event"},"touch":{"!type":"Event"}},"do_Album":{},"do_Device":{},"do_Animator":{},"do_GridView":{"pull":{"!type":"Event"},"longTouch":{"!type":"Event"},"touch1":{"!type":"Event"},"scroll":{"!type":"Event"},"touch":{"!type":"Event"},"longTouch1":{"!type":"Event"}},"do_ScrollView":{"pull":{"!type":"Event"},"scroll":{"!type":"Event"}},"do_Alipay":{},"do_Timer":{"tick":{"!type":"Event"}},"do_InitData":{},"do_QRCode":{},"do_ImageBrowser":{"longTouch":{"!type":"Event"}},"do_WebView":{"loaded":{"!type":"Event"},"pull":{"!type":"Event"},"start":{"!type":"Event"},"failed":{"!type":"Event"}},"do_Camera":{},"do_SegmentView":{"indexChanged":{"!type":"Event"}},"do_Page":{"loaded":{"!type":"Event"},"resume":{"!type":"Event"},"result":{"!type":"Event"},"back":{"!type":"Event"},"menu":{"!type":"Event"},"pause":{"!type":"Event"}},"do_Animation":{},"do_Network":{"changed":{"!type":"Event"}},"do_Label":{},"do_ProgressBar":{},"do_Http":{"result":{"!type":"Event"},"fail":{"!type":"Event"},"success":{"!type":"Event"},"progress":{"!type":"Event"}},"do_SlideView":{"indexChanged":{"!type":"Event"},"touch":{"!type":"Event"}},"do_Global":{"broadcast":{"!type":"Event"},"background":{"!type":"Event"},"launch":{"!type":"Event"},"foreground":{"!type":"Event"}},"do_BaiduLocation":{"result":{"!type":"Event"}},"do_BaiduPush":{"bind":{"!type":"Event"},"unbind":{"!type":"Event"},"iOSMessage":{"!type":"Event"},"message":{"!type":"Event"},"notificationClicked":{"!type":"Event"}},"do_Storage":{},"do_DateTimePicker":{},"do_External":{},"do_Notification":{},"do_TextField":{"focusIn":{"!type":"Event"},"focusOut":{"!type":"Event"},"enter":{"!type":"Event"},"textChanged":{"!type":"Event"}},"do_Socket":{"receive":{"!type":"Event"},"error":{"!type":"Event"}},"do_ViewShower":{"viewChanged":{"!type":"Event"}}},"!MM":{"!type":"fn()","prototype":{"loadSync":{"!type":"fn(source: string)"},"load":{"!effects":["call !1 this=!this"],"!type":"fn(source: string, f: fn(data: , e: ?)) -> !this"},"setMapping":{"!type":"fn(data: Node)"},"!proto":"!Q.prototype","refreshData":{"!type":"fn()"},"bindData":{"!type":"fn(data: string, mapping: Node)"}},"!url":""},"!$":"deviceone","!E":{"prototype":{"getType":{"!doc":"","!type":"fn() -> string","!url":""},"fire":{"!effects":["custom deviceone_ee"],"!doc":"","!type":"fn(name: string, data?: Node) -> !this","!url":""},"getAddress":{"!doc":"","!type":"fn() -> string","!url":""},"off":{"!effects":["custom deviceone_ee"],"!doc":"","!type":"fn(name: string) -> !this","!url":""},"on":{"!effects":["custom deviceone_ee","call !3 this=!this"],"!doc":"","!type":"fn(name: string, data: Node, delay: number, f: fn(data: Node, e: Node)) -> !this","!url":""}}},"Node":{},"require":{"!doc":"","!type":"fn(id: string) -> !custom:deviceone_rq","!url":""},"!Q":{"!doc":"","!type":"fn()","prototype":{"set":{"!type":"fn(data: Node) -> !custom:deviceone_pp"},"setMapping":{"!type":"fn(data: Node, mapping: Node) -> !this"},"get":{"!type":"fn(data: [string]) -> !custom:deviceone_pp"},"!proto":"!E.prototype","refreshData":{"!type":"fn() -> !this"},"bindData":{"!type":"fn(data: Node, mapping: Node) -> !this"}},"!url":""},"UI":{"do_FrameAnimationView":{"!type":"fn()","prototype":{"startImages":{"!type":"fn(data: Node, repeat: number)"},"stop":{"!type":"fn()"},"!proto":"!UI.prototype","startGif":{"!type":"fn(data: string, repeat: number)"}},"!url":""},"do_Label":{"!type":"fn()","prototype":{"maxHeight":{"!type":"number"},"textAlign":{"!type":"string"},"!proto":"!UI.prototype","maxLines":{"!type":"number"},"fontSize":{"!type":"number"},"text":{"!type":"string"},"fontStyle":{"!type":"string"},"fontColor":{"!type":"string"},"textFlag":{"!type":"string"},"maxWidth":{"!type":"number"}},"!url":""},"do_Picker":{"!type":"fn()","prototype":{"!proto":"!UI.prototype","bindItems":{"!type":"fn(data: Node)"},"index":{"!type":"number"},"fontSize":{"!type":"number"},"fontStyle":{"!type":"string"},"refreshItems":{"!type":"fn()"},"fontColor":{"!type":"string"}},"!url":""},"do_ImageView":{"!type":"fn()","prototype":{"setBitmap":{"!type":"fn(bitmap: string)"},"!proto":"!UI.prototype","scale":{"!type":"string"},"source":{"!type":"string"},"radius":{"!type":"number"},"cacheType":{"!type":"string"},"defaultImage":{"!type":"string"},"enabled":{"!type":"bool"},"animation":{"!type":"string"}},"!url":""},"do_SlideListView":{"!type":"fn()","prototype":{"scrollToPosition":{"!type":"fn(position: number, isSmooth: bool)"},"isHeaderVisible":{"!type":"bool"},"isShowbar":{"!type":"bool"},"templates":{"!type":"string"},"!proto":"!UI.prototype","selectedColor":{"!type":"string"},"refreshItems":{"!type":"fn()"},"footerView":{"!type":"string"},"headerView":{"!type":"string"},"rebound":{"!type":"fn()"},"isFooterVisible":{"!type":"bool"},"bindItems":{"!type":"fn(data: Node)"},"canScrollToTop":{"!type":"bool"}},"!url":""},"do_ProgressBar":{"!type":"fn()","prototype":{"!proto":"!UI.prototype","progress":{"!type":"number"},"style":{"!type":"string"}},"!url":""},"do_ProgressBar2":{"!type":"fn()","prototype":{"progressWidth":{"!type":"number"},"progressColor":{"!type":"string"},"progressBgColor":{"!type":"string"},"!proto":"!UI.prototype","progress":{"!type":"number"},"fontSize":{"!type":"number"},"style":{"!type":"string"},"text":{"!type":"string"},"fontColor":{"!type":"string"}},"!url":""},"do_BaiduMapView":{"!type":"fn()","prototype":{"getDistance":{"!type":"fn(startPoint: string, endPoint: string) -> number"},"zoomLevel":{"!type":"number"},"removeAll":{"!type":"fn()"},"poiSearch":{"!effects":["call !5 this=!this"],"!type":"fn(type: number, keyword: string, param: Node, pageIndex: number, pageSize: number, f: fn(data: Node, e: ?)) -> !this"},"removeMarker":{"!type":"fn(ids: Node)"},"setCenter":{"!type":"fn(latitude: string, longitude: string) -> bool"},"!proto":"!UI.prototype","mapType":{"!type":"string"},"removeOverlay":{"!type":"fn(ids: Node)"},"addMarkers":{"!type":"fn(data: Node) -> bool"},"addOverlay":{"!type":"fn(type: number, data: Node, id: string, fillColor: string, strokeColor: string, width: number, isDash: bool)"}},"!url":""},"do_SlideView":{"!type":"fn()","prototype":{"stopLoop":{"!type":"fn()"},"looping":{"!type":"bool"},"startLoop":{"!type":"fn(interval: number)"},"templates":{"!type":"Node"},"isAllCache":{"!type":"bool"},"!proto":"!UI.prototype","bindItems":{"!type":"fn(data: Node)"},"index":{"!type":"number"},"refreshItems":{"!type":"fn()"},"allowGesture":{"!type":"bool"}},"!url":""},"do_TextBox":{"!type":"fn()","prototype":{"!proto":"!UI.prototype","setFocus":{"!type":"fn(value: bool)"},"fontStyle":{"!type":"string"},"enabled":{"!type":"bool"},"cursorColor":{"!type":"string"},"hintColor":{"!type":"string"},"setSelection":{"!type":"fn(position: number)"},"hint":{"!type":"string"},"fontSize":{"!type":"number"},"text":{"!type":"string"},"fontColor":{"!type":"string"},"maxLength":{"!type":"number"},"textFlag":{"!type":"string"}},"!url":""},"do_ImageCropView":{"!type":"fn()","prototype":{"cropArea":{"!type":"string"},"!proto":"!UI.prototype","source":{"!type":"string"},"crop":{"!effects":["call !0 this=!this"],"!type":"fn(f: fn(data: string, e: ?)) -> !this"}},"!url":""},"do_Button":{"!type":"fn()","prototype":{"!proto":"!UI.prototype","fontSize":{"!type":"number"},"bgImage":{"!type":"string"},"text":{"!type":"string"},"fontStyle":{"!type":"string"},"radius":{"!type":"number"},"enabled":{"!type":"bool"},"fontColor":{"!type":"string"},"textFlag":{"!type":"string"}},"!url":""},"do_MarqueeLabel":{"!type":"fn()","prototype":{"!proto":"!UI.prototype","fontSize":{"!type":"number"},"text":{"!type":"string"},"fontStyle":{"!type":"string"},"fontColor":{"!type":"string"},"textFlag":{"!type":"string"},"direction":{"!type":"string"}},"!url":""},"do_LinearLayout":{"!type":"fn()","prototype":{"add":{"!type":"fn(id: string, path: string, target: string) -> string"},"padding":{"!type":"string"},"bgImageFillType":{"!type":"string"},"!proto":"!UI.prototype","bgImage":{"!type":"string"},"enabled":{"!type":"bool"},"direction":{"!type":"string"}},"!url":""},"do_WebView":{"!type":"fn()","prototype":{"isHeaderVisible":{"!type":"bool"},"forward":{"!type":"fn()"},"allowDeviceOne":{"!type":"bool"},"canForward":{"!type":"fn() -> bool"},"!proto":"!UI.prototype","back":{"!type":"fn()"},"zoom":{"!type":"bool"},"canBack":{"!type":"fn() -> bool"},"headerView":{"!type":"string"},"url":{"!type":"string"},"isShowLoadingProgress":{"!type":"bool"},"rebound":{"!type":"fn()"},"reload":{"!type":"fn()"},"stop":{"!type":"fn()"},"loadString":{"!effects":["call !1 this=!this"],"!type":"fn(text: string, f: fn(data: , e: ?)) -> !this"},"cacheType":{"!type":"string"}},"!url":""},"do_ListView":{"!type":"fn()","prototype":{"scrollToPosition":{"!type":"fn(position: number, isSmooth: bool)"},"isHeaderVisible":{"!type":"bool"},"isShowbar":{"!type":"bool"},"templates":{"!type":"string"},"!proto":"!UI.prototype","selectedColor":{"!type":"string"},"refreshItems":{"!type":"fn()"},"footerView":{"!type":"string"},"headerView":{"!type":"string"},"rebound":{"!type":"fn()"},"isFooterVisible":{"!type":"bool"},"bindItems":{"!type":"fn(data: Node)"},"canScrollToTop":{"!type":"bool"},"bounces":{"!type":"bool"}},"!url":""},"do_ALayout":{"!type":"fn()","prototype":{"add":{"!type":"fn(id: string, path: string, x: string, y: string) -> string"},"bgImageFillType":{"!type":"string"},"layoutAlign":{"!type":"string"},"!proto":"!UI.prototype","bgImage":{"!type":"string"},"isStretch":{"!type":"bool"},"enabled":{"!type":"bool"}},"!url":""},"do_BarcodeView":{"!type":"fn()","prototype":{"start":{"!effects":["call !0 this=!this"],"!type":"fn(f: fn(data: Node, e: ?)) -> !this"},"!proto":"!UI.prototype","scanArea":{"!type":"string"},"flash":{"!type":"fn(status: string)"}},"!url":""},"do_ProgressBar1":{"!type":"fn()","prototype":{"changeImage":{"!type":"string"},"!proto":"!UI.prototype","style":{"!type":"string"},"defaultImage":{"!type":"string"},"pointNum":{"!type":"number"},"pointColors":{"!type":"string"}},"!url":""},"do_SegmentView":{"!type":"fn()","prototype":{"templates":{"!type":"string"},"!proto":"!UI.prototype","bindItems":{"!type":"fn(data: Node)"},"index":{"!type":"number"},"refreshItems":{"!type":"fn()"}},"!url":""},"do_TextField":{"!type":"fn()","prototype":{"textAlign":{"!type":"string"},"!proto":"!UI.prototype","setFocus":{"!type":"fn(value: bool)"},"clearImg":{"!type":"string"},"fontStyle":{"!type":"string"},"clearAll":{"!type":"bool"},"enabled":{"!type":"bool"},"cursorColor":{"!type":"string"},"hintColor":{"!type":"string"},"password":{"!type":"bool"},"setSelection":{"!type":"fn(position: number)"},"hint":{"!type":"string"},"fontSize":{"!type":"number"},"inputType":{"!type":"string"},"text":{"!type":"string"},"enterText":{"!type":"string"},"fontColor":{"!type":"string"},"maxLength":{"!type":"number"},"textFlag":{"!type":"string"}},"!url":""},"do_GridView":{"!type":"fn()","prototype":{"isHeaderVisible":{"!type":"bool"},"isShowbar":{"!type":"bool"},"templates":{"!type":"Node"},"!proto":"!UI.prototype","selectedColor":{"!type":"string"},"refreshItems":{"!type":"fn()"},"headerView":{"!type":"string"},"rebound":{"!type":"fn()"},"hSpacing":{"!type":"number"},"bindItems":{"!type":"fn(data: Node)"},"vSpacing":{"!type":"number"},"canScrollToTop":{"!type":"bool"},"numColumns":{"!type":"number"}},"!url":""},"do_ViewShower":{"!type":"fn()","prototype":{"removeView":{"!type":"fn(id: string)"},"!proto":"!UI.prototype","showView":{"!type":"fn(id: string, animationType: string, animationTime: number)"},"addViews":{"!type":"fn(data: Node)"}},"!url":""},"do_ScrollView":{"!type":"fn()","prototype":{"toBegin":{"!type":"fn()"},"rebound":{"!type":"fn()"},"isHeaderVisible":{"!type":"bool"},"isShowbar":{"!type":"bool"},"toEnd":{"!type":"fn()"},"!proto":"!UI.prototype","canScrollToTop":{"!type":"bool"},"headerView":{"!type":"string"},"scrollTo":{"!type":"fn(offset: number)"},"direction":{"!type":"string"}},"!url":""}},"!UI":{"!type":"fn()","prototype":{"margin":{"!type":"string"},"visible":{"!type":"bool"},"typeDesc":{"!type":"string"},"setMapping":{"!type":"fn(data: Node)"},"show":{"!type":"fn(animationType: string, animationTime: number)"},"!proto":"!Q.prototype","type":{"!type":"string"},"animate":{"!effects":["call !1 this=!this"],"!type":"fn(animation: string, f: fn(data: , e: ?)) -> !this"},"remove":{"!type":"fn()"},"redraw":{"!type":"fn()"},"hide":{"!type":"fn(animationType: string, animationTime: number)"},"bgColor":{"!type":"string"},"x":{"!type":"number"},"width":{"!type":"string"},"y":{"!type":"number"},"id":{"!type":"string"},"tag":{"!type":"string"},"getRect":{"!type":"fn() -> Node"},"bindData":{"!type":"fn(data: string, mapping: Node)"},"height":{"!type":"string"}},"!url":""},"Event":{},"SM":{"do_App":{"!type":"fn()","prototype":{"openPage":{"!effects":["call !8 this=!this"],"!type":"fn(source: string, data: string, animationType: string, keyboardMode: string, scriptType: string, statusBarState: string, statusBarFgColor: string, id: string, f: fn(data: , e: ?)) -> !this"},"closePageToID":{"!effects":["call !3 this=!this"],"!type":"fn(data: string, animationType: string, id: string, f: fn(data: , e: ?)) -> !this"},"!proto":"!SM.prototype","update":{"!effects":["call !2 this=!this"],"!type":"fn(source: Node, target: string, f: fn(data: bool, e: ?)) -> !this"},"closePage":{"!effects":["call !3 this=!this"],"!type":"fn(data: string, animationType: string, layer: number, f: fn(data: , e: ?)) -> !this"},"getAppID":{"!type":"fn() -> string"}},"!url":""},"do_DataCache":{"!type":"fn()","prototype":{"removeAll":{"!type":"fn() -> bool"},"hasData":{"!type":"fn(key: string) -> bool"},"saveData":{"!type":"fn(key: string, value: string) -> bool"},"!proto":"!SM.prototype","loadData":{"!type":"fn(key: string) -> string"},"removeData":{"!type":"fn(key: string) -> bool"}},"!url":""},"do_Alipay":{"!type":"fn()","prototype":{"!proto":"!SM.prototype","pay":{"!effects":["call !10 this=!this"],"!type":"fn(rsaPrivate: string, rsaPublic: string, partner: string, notifyUrl: string, tradeNo: string, subject: string, sellerId: string, totalFee: string, body: string, timeOut: string, f: fn(data: Node, e: ?)) -> !this"}},"!url":""},"do_InitData":{"!type":"fn()","prototype":{"copyFile":{"!effects":["call !2 this=!this"],"!type":"fn(source: string, target: string, f: fn(data: bool, e: ?)) -> !this"},"zip":{"!effects":["call !2 this=!this"],"!type":"fn(source: string, target: string, f: fn(data: bool, e: ?)) -> !this"},"getDirs":{"!effects":["call !1 this=!this"],"!type":"fn(path: string, f: fn(data: Node, e: ?)) -> !this"},"fileExist":{"!type":"fn(path: string) -> bool"},"readFileSync":{"!type":"fn(path: string) -> string"},"readFile":{"!effects":["call !1 this=!this"],"!type":"fn(path: string, f: fn(data: string, e: ?)) -> !this"},"!proto":"!SM.prototype","dirExist":{"!type":"fn(path: string) -> bool"},"copy":{"!effects":["call !2 this=!this"],"!type":"fn(source: Node, target: string, f: fn(data: bool, e: ?)) -> !this"},"unzip":{"!effects":["call !2 this=!this"],"!type":"fn(source: string, target: string, f: fn(data: bool, e: ?)) -> !this"},"getFiles":{"!effects":["call !1 this=!this"],"!type":"fn(path: string, f: fn(data: Node, e: ?)) -> !this"},"zipFiles":{"!effects":["call !2 this=!this"],"!type":"fn(source: Node, target: string, f: fn(data: bool, e: ?)) -> !this"}},"!url":""},"do_QRCode":{"!type":"fn()","prototype":{"recognition":{"!effects":["call !1 this=!this"],"!type":"fn(path: string, f: fn(data: string, e: ?)) -> !this"},"!proto":"!SM.prototype","create":{"!effects":["call !2 this=!this"],"!type":"fn(text: string, length: number, f: fn(data: string, e: ?)) -> !this"}},"!url":""},"do_TencentWX":{"!type":"fn()","prototype":{"isWXAppInstalled":{"!type":"fn() -> bool"},"!proto":"!SM.prototype","pay":{"!effects":["call !7 this=!this"],"!type":"fn(appId: string, partnerId: string, prepayId: string, package: string, nonceStr: string, timeStamp: string, sign: string, f: fn(data: number, e: ?)) -> !this"},"share":{"!effects":["call !8 this=!this"],"!type":"fn(appId: string, scene: number, type: number, title: string, content: string, url: string, image: string, audio: string, f: fn(data: bool, e: ?)) -> !this"},"login":{"!effects":["call !1 this=!this"],"!type":"fn(appId: string, f: fn(data: Node, e: ?)) -> !this"}},"!url":""},"do_Algorithm":{"!type":"fn()","prototype":{"sha1":{"!effects":["call !2 this=!this"],"!type":"fn(type: string, value: string, f: fn(data: string, e: ?)) -> !this"},"des3Sync":{"!type":"fn(key: string, type: string, source: string) -> string"},"md5Sync":{"!type":"fn(value: string) -> string"},"base64":{"!effects":["call !3 this=!this"],"!type":"fn(type: string, sourceType: string, source: string, f: fn(data: string, e: ?)) -> !this"},"!proto":"!SM.prototype","base64Sync":{"!type":"fn(type: string, source: string) -> string"},"hex2Binary":{"!effects":["call !2 this=!this"],"!type":"fn(source: string, path: string, f: fn(data: bool, e: ?)) -> !this"},"hex2Str":{"!effects":["call !2 this=!this"],"!type":"fn(source: string, encoding: string, f: fn(data: string, e: ?)) -> !this"},"sha1Sync":{"!type":"fn(type: string, value: string) -> string"},"des3":{"!effects":["call !3 this=!this"],"!type":"fn(key: string, type: string, source: string, f: fn(data: string, e: ?)) -> !this"},"md5":{"!effects":["call !2 this=!this"],"!type":"fn(type: string, value: string, f: fn(data: string, e: ?)) -> !this"}},"!url":""},"do_Global":{"!type":"fn()","prototype":{"getVersion":{"!type":"fn() -> Node"},"getFromPasteboard":{"!type":"fn() -> string"},"exit":{"!type":"fn()"},"setToPasteboard":{"!type":"fn(data: string) -> bool"},"install":{"!effects":["call !1 this=!this"],"!type":"fn(src: string, f: fn(data: bool, e: ?)) -> !this"},"getTime":{"!type":"fn(format: string) -> string"},"!proto":"!SM.prototype","setMemory":{"!type":"fn(key: string, value: string)"},"getMemory":{"!type":"fn(key: string) -> string"},"getWakeupID":{"!type":"fn() -> string"}},"!url":""},"do_BaiduLocation":{"!type":"fn()","prototype":{"getDistance":{"!type":"fn(startPoint: string, endPoint: string) -> number"},"stop":{"!type":"fn()"},"locate":{"!effects":["call !1 this=!this"],"!type":"fn(model: string, f: fn(data: Node, e: ?)) -> !this"},"reverseGeoCode":{"!effects":["call !2 this=!this"],"!type":"fn(latitude: string, longitude: string, f: fn(data: Node, e: ?)) -> !this"},"start":{"!type":"fn(model: string, isLoop: bool)"},"!proto":"!SM.prototype","geoCode":{"!effects":["call !2 this=!this"],"!type":"fn(city: string, address: string, f: fn(data: Node, e: ?)) -> !this"},"stopScan":{"!type":"fn()"},"startScan":{"!type":"fn(model: string, span: number)"}},"!url":""},"do_BaiduPush":{"!type":"fn()","prototype":{"setIconBadgeNumber":{"!type":"fn(quantity: number)"},"stopWork":{"!type":"fn()"},"startWork":{"!type":"fn()"},"getIconBadgeNumber":{"!type":"fn() -> number"},"!proto":"!SM.prototype"},"!url":""},"do_CacheManager":{"!type":"fn()","prototype":{"clearImageCache":{"!effects":["call !0 this=!this"],"!type":"fn(f: fn(data: bool, e: ?)) -> !this"},"getImageCacheSize":{"!effects":["call !0 this=!this"],"!type":"fn(f: fn(data: string, e: ?)) -> !this"},"!proto":"!SM.prototype"},"!url":""},"do_Storage":{"!type":"fn()","prototype":{"deleteFile":{"!effects":["call !1 this=!this"],"!type":"fn(path: string, f: fn(data: bool, e: ?)) -> !this"},"zip":{"!effects":["call !2 this=!this"],"!type":"fn(source: string, target: string, f: fn(data: bool, e: ?)) -> !this"},"getDirs":{"!effects":["call !1 this=!this"],"!type":"fn(path: string, f: fn(data: Node, e: ?)) -> !this"},"fileExist":{"!type":"fn(path: string) -> bool"},"!proto":"!SM.prototype","unzip":{"!effects":["call !2 this=!this"],"!type":"fn(source: string, target: string, f: fn(data: bool, e: ?)) -> !this"},"getFiles":{"!effects":["call !1 this=!this"],"!type":"fn(path: string, f: fn(data: Node, e: ?)) -> !this"},"readFile":{"!effects":["call !1 this=!this"],"!type":"fn(path: string, f: fn(data: string, e: ?)) -> !this"},"dirExist":{"!type":"fn(path: string) -> bool"},"copy":{"!effects":["call !2 this=!this"],"!type":"fn(source: Node, target: string, f: fn(data: bool, e: ?)) -> !this"},"deleteDir":{"!effects":["call !1 this=!this"],"!type":"fn(path: string, f: fn(data: bool, e: ?)) -> !this"},"writeFile":{"!effects":["call !2 this=!this"],"!type":"fn(path: string, data: string, f: fn(data: bool, e: ?)) -> !this"},"zipFiles":{"!effects":["call !2 this=!this"],"!type":"fn(source: Node, target: string, f: fn(data: bool, e: ?)) -> !this"}},"!url":""},"do_ImageBrowser":{"!type":"fn()","prototype":{"show":{"!type":"fn(data: Node, index: number)"},"!proto":"!SM.prototype"},"!url":""},"do_Camera":{"!type":"fn()","prototype":{"!proto":"!SM.prototype","capture":{"!effects":["call !6 this=!this"],"!type":"fn(width: number, height: number, quality: number, iscut: bool, facingFront: bool, outPath: string, f: fn(data: string, e: ?)) -> !this"}},"!url":""},"do_DateTimePicker":{"!type":"fn()","prototype":{"show":{"!effects":["call !6 this=!this"],"!type":"fn(type: number, data: string, maxDate: string, minDate: string, title: string, buttons: Node, f: fn(data: Node, e: ?)) -> !this"},"!proto":"!SM.prototype"},"!url":""},"do_Album":{"!type":"fn()","prototype":{"select":{"!effects":["call !5 this=!this"],"!type":"fn(maxCount: number, width: number, height: number, quality: number, iscut: bool, f: fn(data: Node, e: ?)) -> !this"},"save":{"!effects":["call !5 this=!this"],"!type":"fn(path: string, name: string, width: number, height: number, quality: number, f: fn(data: bool, e: ?)) -> !this"},"!proto":"!SM.prototype"},"!url":""},"do_Device":{"!type":"fn()","prototype":{"beep":{"!type":"fn()"},"srceenShotAsBitmap":{"!effects":["call !2 this=!this"],"!type":"fn(bitmap: string, rect: string, f: fn(data: , e: ?)) -> !this"},"getInfo":{"!type":"fn() -> Node"},"getGPSInfo":{"!type":"fn() -> Node"},"getAllAppInfo":{"!type":"fn() -> Node"},"screenShot":{"!effects":["call !1 this=!this"],"!type":"fn(rect: string, f: fn(data: string, e: ?)) -> !this"},"!proto":"!SM.prototype","vibrate":{"!type":"fn(duration: number)"},"getLocale":{"!type":"fn() -> Node"},"flash":{"!type":"fn(status: string)"},"home":{"!type":"fn()"}},"!url":""},"do_External":{"!type":"fn()","prototype":{"openURL":{"!type":"fn(url: string)"},"openApp":{"!type":"fn(wakeupid: string, data: Node) -> bool"},"openFile":{"!type":"fn(path: string)"},"openSystemSetting":{"!type":"fn(type: string)"},"!proto":"!SM.prototype","openMail":{"!type":"fn(to: string, subject: string, body: string)"},"bulkSMS":{"!type":"fn(number: Node, body: string)"},"openSMS":{"!type":"fn(number: string, body: string)"},"installApp":{"!type":"fn(path: string)"},"openContact":{"!type":"fn()"},"openDial":{"!type":"fn(number: string)"}},"!url":""},"do_Page":{"!type":"fn()","prototype":{"hideKeyboard":{"!type":"fn()"},"!proto":"!SM.prototype","getData":{"!type":"fn() -> string"},"remove":{"!type":"fn(id: )"},"supportPanClosePage":{"!type":"fn(data: string)"}},"!url":""},"do_Notification":{"!type":"fn()","prototype":{"confirm":{"!effects":["call !4 this=!this"],"!type":"fn(text: string, title: string, button1text: string, button2text: string, f: fn(data: number, e: ?)) -> !this"},"toast":{"!type":"fn(text: string, x: number, y: number)"},"alert":{"!effects":["call !2 this=!this"],"!type":"fn(text: string, title: string, f: fn(data: , e: ?)) -> !this"},"!proto":"!SM.prototype"},"!url":""},"do_Network":{"!type":"fn()","prototype":{"openWifiSetting":{"!type":"fn()"},"getIP":{"!type":"fn() -> string"},"!proto":"!SM.prototype","getStatus":{"!type":"fn() -> string"},"getMACAddress":{"!type":"fn() -> string"}},"!url":""}},"!SM":{"!type":"fn()","prototype":{"!proto":"!E.prototype"},"!url":""},"Module":{"!type":"fn()","prototype":{"loaded":{"!doc":"","!type":"bool","!url":""},"parent":{"!doc":"","!type":"+Module","!url":""},"filename":{"!doc":"","!type":"string","!url":""},"children":{"!doc":"","!type":"[+Module]","!url":""},"exports":{"!doc":"","!type":"?","!url":""},"require":{"!doc":"","!type":"require","!url":""},"id":{"!doc":"","!type":"string","!url":""}}}}}});