//evtLib
window.evt={};
(function (evt) {
    var BaseEvent = /** @class */ (function () {
        function BaseEvent(type) {
            this.type = type;
        }
        BaseEvent.COMPLETE = "complete";
        return BaseEvent;
    }());
    evt.BaseEvent = BaseEvent;
})(evt || (evt = {}));

(function (evt) {
    var EventDispatcher = /** @class */ (function () {
        function EventDispatcher() {
            this._eventsMap = null;
        }
        EventDispatcher.prototype.addEventListener = function (types, listener, thisObject) {
            if (!this._eventsMap) {
                this._eventsMap = new Object;
            }
            var list = this._eventsMap[types];
            if (!list) {
                list = this._eventsMap[types] = [];
            }
            var eventBin = { listener: listener, thisObject: thisObject };
            for (var i = 0; i < list.length; i++) {
                var bin = list[i];
                if (bin.listener == listener && bin.thisObject == thisObject) {
                    return;
                }
            }
            list.push(eventBin);
        };
        //是否存在监听
        EventDispatcher.prototype.hasEventListener = function (type) {
            return this._eventsMap && this._eventsMap[type] != null;
        };
        EventDispatcher.prototype.rmEventListener = function (type, listener, thisObject) {
            if (this._eventsMap == null) {
                return;
            }
            var list = this._eventsMap[type];
            for (var i = 0; list && i < list.length; i++) {
                var bin = list[i];
                if (bin.listener == listener && bin.thisObject == thisObject) {
                    list.splice(i, 1);
                    return;
                }
            }
        };
        EventDispatcher.prototype.rmEventListenerByName = function (type) {
            if (this._eventsMap == null) {
                return;
            }
            var list = this._eventsMap[type];
            if (list) {
                list.length = 0;
            }
        };
        EventDispatcher.prototype.rmEventListenerByTarget = function (thisObject) {
            if (this._eventsMap == null) {
                return;
            }
            for (var type in this._eventsMap) {
                var list = this._eventsMap[type];
                if (list) {
                    for (var i = 0; list && i < list.length; i++) {
                        var bin = list[i];
                        if (bin.thisObject == thisObject) {
                            list.splice(i, 1);
                            return;
                        }
                    }
                }
            }
        };
        EventDispatcher.prototype.rmEventListenerByNameAndTarget = function (type, thisObject) {
            if (this._eventsMap == null) {
                return;
            }
            var list = this._eventsMap[type];
            if (list) {
                for (var i = 0; list && i < list.length; i++) {
                    var bin = list[i];
                    if (bin.thisObject == thisObject) {
                        list.splice(i, 1);
                        return;
                    }
                }
            }
        };
        EventDispatcher.prototype.dispatchEvent = function (event) {
            var eventMap = this._eventsMap;
            if (!eventMap) {
                return true;
            }
            var list = eventMap[event.type];
            if (!list) {
                return true;
            }
            var length = list.length;
            if (length == 0) {
                return true;
            }
            event.target = this;
            var copyList = [].concat.apply([], list);
            for (var i = 0; i < length; i++) {
                var eventBin = copyList[i];
                if (eventBin) {
                    eventBin.listener.call(eventBin.thisObject, event);
                }
            }
        };
        return EventDispatcher;
    }());
    evt.EventDispatcher = EventDispatcher;
})(evt || (evt = {}));

(function (evt) {
    var Module = /** @class */ (function () {
        function Module() {
            /**
                 * processor字典
                 */
            this.processorMap = new Object();
        }
        Module.prototype.getModuleName = function () {
            throw new Error("namespace必须复写命名");
            //return "";
        };
        /**
        * 注册的Processor的集合
        * 请注意：返回为Processor的实例数组
        * @return
        *
        */
        Module.prototype.listProcessors = function () {
            return null;
        };
        /**
         * 模块初始化
         */
        Module.prototype.onRegister = function () {
        };
        /**
         * 重置模块数据
         */
        Module.prototype.onResetonRegister = function () {
        };
        /**
        * 注册所有的Processor
        */
        Module.prototype.registerProcessors = function () {
            //注册Processor
            var processorArr = this.listProcessors();
            if (processorArr != null && processorArr.length > 0) {
                for (var i = 0; i < processorArr.length; i++) {
                    this.registerProcessor(processorArr[i]);
                }
            }
        };
        /**
        * 注册Processor
        * @param processor
        */
        Module.prototype.registerProcessor = function (processor) {
            //单例
            if (this.processorMap[processor.getName()] != null) {
                throw new Error("同一namespace不能注册两个相同的Processor");
            }
            this.processorMap[processor.getName()] = processor;
            processor.registerEvents();
            //NetManager.getInstance().reg(processor);
        };
        /**
        * 注册namespace
        * @param namespace
        */
        Module.registerModule = function (namespace) {
            //单例
            if (Module.namespaceMap[namespace.getModuleName()] != null) {
                throw new Error("不能注册两个相同的namespace：" + namespace.getModuleName());
            }
            Module.namespaceMap[namespace.getModuleName()] = namespace;
            namespace.registerProcessors();
            namespace.onRegister();
        };
        /**
        * namespace字典
        */
        Module.namespaceMap = new Object();
        return Module;
    }());
    evt.Module = Module;
})(evt || (evt = {}));

(function (evt) {
    var ModuleEventMgr = /** @class */ (function () {
        function ModuleEventMgr() {
        }
        ModuleEventMgr.addEvents = function (ary, fun, thisObj) {
            for (var i = 0; i < ary.length; i++) {
                this._instance.addEventListener(ary[i].type, fun, thisObj);
            }
        };
        ModuleEventMgr.dispatchEvent = function (event, data) {
            if (data === void 0) { data = null; }
            event.extParam = data;
            this._instance.dispatchEvent(event);
        };
        ModuleEventMgr.addEvent = function (type, listener, thisObject) {
            this._instance.addEventListener(type, listener, thisObject);
        };
        ModuleEventMgr.rmEvent = function (type, listener, thisObject) {
            this._instance.rmEventListener(type, listener, thisObject);
        };
        ModuleEventMgr.rmEventByName = function (type) {
            this._instance.rmEventListenerByName(type);
        };
        ModuleEventMgr.rmEventByNameAndTarget = function (type, thisObject) {
            this._instance.rmEventListenerByNameAndTarget(type, thisObject);
        };
        ModuleEventMgr.rmEventByTarget = function (thisObject) {
            this._instance.rmEventListenerByTarget(thisObject);
        };
        ModuleEventMgr._instance = new evt.EventDispatcher();
        return ModuleEventMgr;
    }());
    evt.ModuleEventMgr = ModuleEventMgr;
})(evt || (evt = {}));

(function (evt) {
    var Processor = /** @class */ (function () {
        function Processor() {
        }
        Processor.prototype.getName = function () {
            throw new Error("process必须复写命名");
            //return "";
        };
        /**
        * 解析事件，之后交给处理函数
        * @param notification
        */
        Processor.prototype.receivedModuleEvent = function (event) {
        };
        /**
        * 监听的事件类的集合
        * 请注意：返回为事件的CLASS(这些CLASS必须继承自namespaceEvent)的数组
        * @return
        *
        */
        Processor.prototype.listenModuleEvents = function () {
            return null;
        };
        Processor.prototype.registerEvents = function () {
            //注册消息监听
            var meClassArr = this.listenModuleEvents();
            if (meClassArr != null && meClassArr.length > 0) {
                evt.ModuleEventMgr.addEvents(meClassArr, this.receivedModuleEvent, this);
            }
        };
        Processor.prototype.getHanderMap = function () {
            var obj = new Object;
            return obj;
        };
        return Processor;
    }());
    evt.Processor = Processor;
})(evt || (evt = {}));
