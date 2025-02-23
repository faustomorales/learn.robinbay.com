const services: { [key: string]: string } = {
    api: "00010001-574f-4f20-5370-6865726f2121",
    dfu: "00020001-574f-4f20-5370-6865726f2121",
    battery: "0000180f-0000-1000-8000-00805f9b34fb",
};


const packetCodes = {
    deviceInfo: {
        "apiProcessor": 0x10,
        "systemInfo": 0x11,
        "driving": 0x16,
        "animatronics": 0x17,
        "sensor": 0x18,
        "something": 0x19,
        "somethingAPI": 0x1f
    },
    systemInfo: {
        "mainApplicationVersion": 0x00,
        "bootloaderVersion": 0x01,
        "something": 0x06,
        "something2": 0x13,
        "something6": 0x12,
        "something7": 0x28
    },
    powerCommands: {
        "deepSleep": 0x00,
        "batteryVoltage": 0x03,
        "something": 0x05,
        "something2": 0x10,
        "something3": 0x04,
        "something4": 0x1E
    },
    drivingCommands: {
        "rawMotor": 0x01,
        "resetHeading": 0x06,
        "driveAsSphero": 0x04,
        "driveAsRc": 0x02,
        "driveWithHeading": 0x07,
        "stabilization": 0x0C,
    },
    sensorComands: {
        'sensorMask': 0x00,
        'sensorResponse': 0x02,
        'configureCollision': 0x11,
        'collisionDetectedAsync': 0x12,
        'resetLocator': 0x13,
        'enableCollisionAsync': 0x14,
        'sensor1': 0x0F,
        'sensor2': 0x17,
        'configureSensorStream': 0x0C
    }
}


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

export default { characteristics, services, packetCodes }