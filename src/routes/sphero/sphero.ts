
import constants from "./constants"

type CharacteristicName = keyof typeof constants.characteristics

interface PacketConfiguration {
    cid: number,
    data: number[],
    did: number
}

const encode = (value: number) => {
    if (value < 0 || value > 255) {
        throw new Error("Value must be between 0 and 255")
    }
    // Escape values according to https://sdk.sphero.com/documentation/api-documents#h.e2aai3smjz3b
    if ([constants.packetCodes.delimiters.sop, constants.packetCodes.delimiters.eop, constants.packetCodes.delimiters.esc].includes(value)) {
        return [constants.packetCodes.delimiters.esc, value & ~constants.packetCodes.delimiters.mask]
    }
    return value
}

const createPacket = (seq: number, config: PacketConfiguration) => {
    // https://sdk.sphero.com/documentation/api-documents
    let flags = constants.packetCodes.flags.resetsInactivityTimeout + constants.packetCodes.flags.requestsResponse
    let body = [flags, config.did, config.cid, seq, ...config.data].map(encode).flat()
    let checksum = 0xff - body.reduce((previous, val) => (previous + val) & 0xff, 0)
    let packet = [constants.packetCodes.delimiters.sop, ...body, checksum, constants.packetCodes.delimiters.eop]
    return new Uint8Array(packet)
}


class Sphero {
    public device: BluetoothDevice | null;
    private server: BluetoothRemoteGATTServer | null;
    private seq: number;
    private characteristics: { [key in CharacteristicName]: BluetoothRemoteGATTCharacteristic };

    constructor() {
        this.server = null
        this.device = null
        this.seq = 0
        this.characteristics = {} as { [key in CharacteristicName]: BluetoothRemoteGATTCharacteristic }
    }

    private connect = async () => {
        if (this.server && this.server.connected) {
            console.log("Server is already connected.")
            return
        }
        console.log("Connecting to device server.")
        this.server = await this.getDevice().gatt!.connect()
        await this.setupCharacteristics()
    }

    public async setupCharacteristics() {
        return await Promise.all((Object.keys(constants.characteristics) as CharacteristicName[]).map(async (name) => {
            try {
                console.log(`Setting up API notifications for ${name}.`)
                let characteristic = await this.getServer().then((s) => s.getPrimaryService(constants.characteristics[name].serviceUUID))
                    .then((service) => service.getCharacteristic(constants.characteristics[name].characteristicUUID))
                this.characteristics[name as CharacteristicName] = characteristic
                characteristic = await characteristic.startNotifications()
                // characteristic.addEventListener("characteristicvaluechanged", (event) => console.log(`characteristic: ${name}, event: ${event}`))
                characteristic.oncharacteristicvaluechanged = (event) => console.log(`characteristic: ${name}, event: ${event}`)
                console.log(`Successfully added event listener for ${name}.`)
            } catch (e) {
                console.error(`Could not set up API notifications for ${name}.`, e)
            }
        }))
    }

    public async setup(bluetooth: Bluetooth) {
        if (!bluetooth) {
            throw new Error("Your browser does not support Web Bluetooth.");
        }
        console.log("Requesting device.")
        this.device = await bluetooth.requestDevice({
            filters: [{ services: [constants.services.api] }],
            optionalServices: [constants.services.battery, constants.services.dfu],
        })
        console.log("Connecting to server for the first time.")
        await this.connect()
        console.log("Adding server disconnection callback.")
        this.device.addEventListener("gattserverdisconnected", this.connect)

        console.log("Sending anti-DOS unlock code")
        await this.getCharacteristic("antidos").writeValueWithoutResponse(new TextEncoder().encode("usetheforce...band"))
    }

    private getCharacteristic = (name: CharacteristicName) => {
        if (this.characteristics[name]) {
            return this.characteristics[name]
        }
        throw new Error(`Characteristic ${name} has not been set up.`)

    }

    private read = (name: CharacteristicName) =>
        this.getCharacteristic(name).readValue();

    private async write(config: PacketConfiguration, name: CharacteristicName) {
        let seq = this.seq++;
        let characteristic = this.getCharacteristic(name)
        let packet = createPacket(seq, config)
        console.log(`Writing to ${name}:`, [...packet].map((v) => v.toString(16)))
        return await characteristic.writeValueWithoutResponse(packet.buffer)
    }

    public setColor = (color: { red: number, green: number, blue: number }) =>
        this.write(
            {
                data: [0x00, 0x0e, color.red, color.green, color.blue],
                cid: constants.packetCodes.ioCommands.allLEDs,
                did: constants.packetCodes.deviceInfo.userIO
            },
            "api"
        )

    public wake = () => this.write({ data: [], cid: constants.packetCodes.powerCommands.wake, did: constants.packetCodes.deviceInfo.powerInfo }, "api")

    public sleep = () => this.write({ data: [], cid: constants.packetCodes.powerCommands.sleep, did: constants.packetCodes.deviceInfo.powerInfo }, "api")

    public getBatteryLevel = () => this.read("battery_level").then((value) => value.getUint8(0))

    public getDevice() {
        if (this.device) {
            return this.device
        }
        throw new Error("The device has not been connected yet.")
    }

    public async getServer() {
        if (!this.server) {
            throw new Error("The server has not been connected yet.")
        }
        if (!this.server.connected) {
            await this.connect()
        }
        return this.server
    }

}


export { Sphero }