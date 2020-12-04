module evt {
    export class ModuleEventMgr {
        private static _instance: EventDispatcher = new EventDispatcher();
        static addEvents(ary: Array<BaseEvent>, fun: Function, thisObj: any): void {
            for (let i: number = 0; i < ary.length; i++) {
                this._instance.addEventListener(ary[i].type, fun, thisObj);
            }
        }

        static dispatchEvent(event: BaseEvent, data = null): void {
            event.extParam = data;
            this._instance.dispatchEvent(event);
        }

        static addEvent(type: string, listener: Function, thisObject: any): void {
            this._instance.addEventListener(type, listener, thisObject);
        }

        static rmEvent(type: string, listener: Function, thisObject: any): void {
            this._instance.rmEventListener(type, listener, thisObject);
        }

        static rmEventByName(type: string): void {
            this._instance.rmEventListenerByName(type);
        }

        static rmEventByNameAndTarget(type: string, thisObject: any): void {
            this._instance.rmEventListenerByNameAndTarget(type, thisObject);
        }

        static rmEventByTarget(thisObject: any): void {
            this._instance.rmEventListenerByTarget(thisObject);
        }
    }
}