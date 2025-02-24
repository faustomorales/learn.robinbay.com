export interface PacketConfiguration {
    command: keyof typeof commands,
    response?: boolean,
    flags?: (keyof typeof flags)[],
    data?: number[],
}

export interface Packet {
    config: PacketConfiguration;
    sequence: number;
    checksum: number;
    bytes: Uint8Array;
}

export interface Word {
    high: number;
    low: number;
}

const flags = {
    isResponse: 0x01,
    requestsResponse: 0x02,
    requestsOnlyErrorResponse: 0x04,
    resetsInactivityTimeout: 0x08,
}

const commands = {
    "power:wake": { did: 0x13, cid: 0x0D },
    "power:sleep": { did: 0x13, cid: 0x01 },
    "io:color": { did: 0x1a, cid: 0x0E },
    "driving:resetHeading": { did: 0x16, cid: 0x06 },
    "driving:driveWithHeading": { did: 0x16, cid: 0x07 },
}

const delimiters = {
    sop: 0x8d,
    eop: 0xd8,
    esc: 0xab,
    mask: 0x88
}

const encodeWord = (value: number) => {
    if (value < 0 || value > 65535) {
        throw new Error("Number is out of range for a two-byte word (0-65535)");
    }
    return {
        high: (value >> 8) & 0xFF,
        low: value & 0xFF
    }
}

const decodeWord = (word: Word) => (word.high << 8) | word.low

export const encodeSpeedAndHeading = (speed: number, heading: number) => {
    // Negative values get converted to positive values and result
    // in the ball rolling in the opposite direction
    let speedBytes = encodeWord(speed < 0 ? -1 * speed + 256 : speed)
    let headingBytes = encodeWord(heading)
    return [speedBytes.low, headingBytes.high, headingBytes.low, speedBytes.high]
}


const escape = (value: number) => {
    if (value < 0 || value > 255) {
        throw new Error("Value must be between 0 and 255")
    }
    // Escape values according to https://sdk.sphero.com/documentation/api-documents#h.e2aai3smjz3b
    if ([delimiters.sop, delimiters.eop, delimiters.esc].includes(value)) {
        return [delimiters.esc, value & ~delimiters.mask]
    }
    return value
}

const toHex = (value: number) => value.toString(16).padStart(2, "0")

export const parse = (buffer: number[]): Packet => {
    if (buffer[0] !== delimiters.sop) {
        throw new Error(`Invalid Packet: Expected first byte to be ${delimiters.sop}, got ${buffer[0]}`)
    } else if (buffer[buffer.length - 1] !== delimiters.eop) {
        throw new Error(`Invalid Packet: Expected last byte to be ${delimiters.eop}, got ${buffer[buffer.length - 1]}`)
    }
    let packetFlags = Object.keys(flags).filter((f) => flags[f as keyof typeof flags] & buffer[1]) as (keyof typeof flags)[]
    return {
        bytes: new Uint8Array(buffer),
        checksum: buffer[buffer.length - 2],
        sequence: buffer[4],
        config: {
            flags: packetFlags,
            command: (
                (Object.keys(commands) as Array<keyof typeof commands>).find((c) => commands[c].did === buffer[2] && commands[c].cid === buffer[3]) ||
                `unknown (cid: ${toHex(buffer[2])}, did: ${toHex(buffer[3])}, flags: ${packetFlags.join("|")}, raw: ${buffer.map(toHex).join(",")})`
            ) as keyof typeof commands,
            response: packetFlags.includes("isResponse"),
            data: buffer.slice(8, buffer.length - 2),
        }
    }
}

export const receive = (buffer: number[], value: number) => {
    buffer.push(value)
    if (value === delimiters.eop) {
        let parsed = parse(buffer)
        buffer.length = 0; // Empty the buffer
        return parsed
    }
}

export const create = (sequence: number, config: PacketConfiguration): Packet => {
    let packetFlags = config.flags || ["resetsInactivityTimeout", "requestsResponse"]
    // https://sdk.sphero.com/documentation/api-documents
    let body = [
        (packetFlags).reduce((s, f) => s + flags[f], 0),
        commands[config.command].did,
        commands[config.command].cid,
        sequence, ...(config.data || [])
    ].map(escape).flat()
    let checksum = 0xff - body.reduce((previous, val) => (previous + val) & 0xff, 0)
    let packet = [delimiters.sop, ...body, checksum, delimiters.eop]
    return {
        config: { ...config, flags: packetFlags },
        checksum,
        sequence,
        bytes: (new Uint8Array(packet))
    }
}
