import { create, receive, encodeSpeedAndHeading, type PacketConfiguration, type Packet } from "./packets"

const services: { [key: string]: string } = {
    api: "00010001-574f-4f20-5370-6865726f2121",
    dfu: "00020001-574f-4f20-5370-6865726f2121",
    battery: "0000180f-0000-1000-8000-00805f9b34fb",
};


const characteristics = {
    known_unknown1: {
        "serviceUUID": services.dfu,
        "characteristicUUID": "00020003-574f-4f20-5370-6865726f2121"
    },
    dfu_control: {
        "serviceUUID": services.dfu,
        "characteristicUUID": "00020002-574f-4f20-5370-6865726f2121"
    },
    dfu_info: {
        "serviceUUID": services.dfu,
        "characteristicUUID": "00020004-574f-4f20-5370-6865726f2121"
    },
    antidos: {
        "serviceUUID": services.dfu,
        "characteristicUUID": "00020005-574f-4f20-5370-6865726f2121"
    },
    battery_level: {
        "serviceUUID": services.battery,
        "characteristic": "battery_level",
        "characteristicUUID": "00002a19-0000-1000-8000-00805f9b34fb"
    },
    api: {
        "serviceUUID": services.api,
        "characteristic": "api",
        "characteristicUUID": "00010002-574f-4f20-5370-6865726f2121"
    },
    known_unknown2: {
        "serviceUUID": services.api,
        "characteristic": "known-unknown2",
        "characteristicUUID": "00010003-574f-4f20-5370-6865726f2121"
    },
}

type CharacteristicName = keyof typeof characteristics

export default class Sphero {
    private seq: number;
    private device: BluetoothDevice | undefined;
    private characteristics: { [key in CharacteristicName]: {
        characteristic: BluetoothRemoteGATTCharacteristic;
        buffer: number[]
    } };
    private acknowledgements: { [key: number]: (packet: Packet) => void } = {}
    constructor() {
        this.seq = 0
        this.characteristics = {} as any
    }
    private log = (message: any, category: string = "Sphero") => console.log(`[${category}] ${message}`)
    private logApi = (packet: Packet, direction: "TRANSMIT" | "RECEIVE") => this.log(`[API] [${direction}]: ${packet.config.command} (SEQ: ${packet.sequence}, FLAGS: ${packet.config.flags})`)
    private acknowledge = (packet: Packet) => {
        let ack = this.acknowledgements[packet.sequence];
        if (ack) {
            ack(packet)
            delete this.acknowledgements[packet.sequence]
        }
    }
    private receive = (name: CharacteristicName, event: any) => {
        let value = (event.target.value as DataView).getUint8(0)
        if (name === "battery_level") {
            this.log(`[BATTERY] [RECEIVE]: ${value}`)
        } else if (name === "api") {
            let packet = receive(this.characteristics[name].buffer, value)

            if (packet) {
                this.acknowledge(packet)
                this.logApi(packet, "RECEIVE")
            }
        } else {
            this.log(`Received message from ${name}`)
        }
    }

    private setup = async ({ target: device }: { target: BluetoothDevice }) => {
        this.log("Connecting to device server.")
        let server = await device.gatt!.connect()
        await Promise.all((Object.keys(characteristics) as CharacteristicName[]).map(async (name) => {
            try {
                this.log(`Setting up API notifications for ${name}.`)
                let characteristic = await server.getPrimaryService(characteristics[name].serviceUUID)
                    .then((service) => service.getCharacteristic(characteristics[name].characteristicUUID))
                this.characteristics[name as CharacteristicName] = { characteristic, buffer: [] }
                await characteristic.startNotifications()
                characteristic.addEventListener("characteristicvaluechanged", (event) => this.receive(name, event))
                this.log(`Successfully added event listener for ${name}.`)
            } catch (e) {
                this.log(`Could not set up API notifications for ${name}.`)
            }
        }))
    }

    private getSequence = () => {
        // Reserve SEQ = 255 for special cases
        this.seq = (this.seq + 1) % 255
        // Make sure we aren't already waiting on
        // a response for this sequence number.
        if (this.seq in this.acknowledgements) {
            throw new Error("Attempted to use existing sequence number. This should never happen.")
        }
        return this.seq
    }

    private read = (name: CharacteristicName) =>
        this.characteristics[name].characteristic.readValue();
    private write = (name: CharacteristicName, value: Uint8Array) => this.characteristics[name].characteristic.writeValueWithoutResponse(value)
    private writeToApi = (config: PacketConfiguration, timeout: number = 1000) =>
        new Promise<Packet>((resolve, reject) => {
            let packet = create(this.getSequence(), config)
            let acknowledge = new Promise<Packet>((resolve, reject) => {
                this.acknowledgements[packet.sequence] = resolve
                setTimeout(() => {
                    this.acknowledge(packet)
                    reject(`Timed out waiting for response to ${packet.config.command} (SEQ: ${packet.sequence})`)
                }, timeout)
            })
            this.logApi(packet, "TRANSMIT")
            let transmission = new Promise((resolve, reject) => this.write("api", packet.bytes).then(resolve, reject))
            Promise.all([acknowledge, transmission]).then(([ack, trans]) => {
                resolve(ack)
            }, reject)
        })
    public async connect(bluetooth: Bluetooth) {
        if (!bluetooth) {
            throw new Error("Your browser does not support Web Bluetooth.");
        }
        this.log("Requesting device.")
        this.device = await bluetooth.requestDevice({
            filters: [{ services: [services.api] }],
            optionalServices: [services.battery, services.dfu],
        })
        await this.setup({ target: this.device })
        await this.authenticate()
        this.device.addEventListener("gattserverdisconnected", this.setup as any)
    }
    public async disconnect() {
        if (this.device) {
            this.device.removeEventListener("gattserverdisconnected", this.setup as any)
            await this.device.gatt!.disconnect()
        }
    }
    public setColor = (color: { red: number, green: number, blue: number }) =>
        this.writeToApi({
            data: [0x00, 0x0e, color.red, color.green, color.blue],
            command: "io:color",
        })
    public wake = () => this.writeToApi({ data: [], command: "power:wake" })
    public sleep = () => this.writeToApi({ data: [], command: "power:sleep" })
    public resetHeading = () => this.writeToApi({ data: [], command: "driving:resetHeading" })
    public roll = (speed: number, heading: number) => this.writeToApi({
        data: encodeSpeedAndHeading(speed, heading),
        command: "driving:driveWithHeading",
    })
    public rollTime = (speed: number, heading: number, time: number) =>
        new Promise<Packet>((resolve, reject) => this.roll(speed, heading).then(() =>
            setTimeout(() => this.roll(0, heading).then(resolve, reject), time), reject))
    public authenticate = () => this.write("antidos", (new TextEncoder()).encode("usetheforce...band"))
    public getBatteryLevel = () => this.read("battery_level").then((value) => value.getUint8(0))

}
