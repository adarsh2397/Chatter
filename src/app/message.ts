export class Message {
    public _id: number;
    public from_name: String;
    public to_name: String;
    public body: String;
    public time: Date;
    public seen: boolean;

    constructor() {
        this.from_name = '';
        this.to_name = '';
        this.body = '';
        this.seen = false;
    }

    createMessage(from_name, to_name, body, time,seen, id = 0) {
        this._id = id;
        this.from_name = from_name;
        this.to_name = to_name;
        this.body = body;
        this.time = time;
        this.seen = seen;
    }
}
