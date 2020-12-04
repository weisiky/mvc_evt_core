module evt {
    export class BaseEvent {
        public type: string;
        public target: EventDispatcher;
        public extParam: any;

        public constructor(type: string) {
            this.type = type;
        }

        static COMPLETE: string = "complete";
    }
}