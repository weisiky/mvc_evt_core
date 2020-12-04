declare module evt {
    class BaseEvent {
        type: string;
        target: EventDispatcher;
        extParam: any;
        constructor(type: string);
        static COMPLETE: string;
    }
}
declare module evt {
    class EventDispatcher {
        protected _eventsMap: Object;
        addEventListener(types: string, listener: Function, thisObject: any): void;
        hasEventListener(type: string): boolean;
        rmEventListener(type: string, listener: Function, thisObject: any): void;
        rmEventListenerByName(type: string): void;
        rmEventListenerByTarget(thisObject: any): void;
        rmEventListenerByNameAndTarget(type: string, thisObject: any): void;
        dispatchEvent(event: BaseEvent): boolean;
    }
}
declare module evt {
    class Module {
        constructor();
        getModuleName(): string;
        /**
        * 注册的Processor的集合
        * 请注意：返回为Processor的实例数组
        * @return
        *
        */
        protected listProcessors(): Array<Processor>;
        /**
             * processor字典
             */
        private processorMap;
        /**
         * 模块初始化
         */
        protected onRegister(): void;
        /**
         * 重置模块数据
         */
        onResetonRegister(): void;
        /**
        * 注册所有的Processor
        */
        private registerProcessors;
        /**
        * 注册Processor
        * @param processor
        */
        private registerProcessor;
        /**
        * namespace字典
        */
        static namespaceMap: Object;
        /**
        * 注册namespace
        * @param namespace
        */
        static registerModule(namespace: Module): void;
    }
}
declare module evt {
    class ModuleEventMgr {
        private static _instance;
        static addEvents(ary: Array<BaseEvent>, fun: Function, thisObj: any): void;
        static dispatchEvent(event: BaseEvent, data?: any): void;
        static addEvent(type: string, listener: Function, thisObject: any): void;
        static rmEvent(type: string, listener: Function, thisObject: any): void;
        static rmEventByName(type: string): void;
        static rmEventByNameAndTarget(type: string, thisObject: any): void;
        static rmEventByTarget(thisObject: any): void;
    }
}
declare module evt {
    class Processor {
        constructor();
        getName(): string;
        /**
        * 解析事件，之后交给处理函数
        * @param notification
        */
        protected receivedModuleEvent(event: BaseEvent): void;
        /**
        * 监听的事件类的集合
        * 请注意：返回为事件的CLASS(这些CLASS必须继承自namespaceEvent)的数组
        * @return
        *
        */
        protected listenModuleEvents(): Array<BaseEvent>;
        registerEvents(): void;
        getHanderMap(): Object;
    }
}
