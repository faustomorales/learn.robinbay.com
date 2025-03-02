export default [
    { title: "wake()", description: "Wake the Sphero up. This must be your code's first command, otherwise other commands will have no effect.", code: "await sphero.wake()" },
    { title: "sleep()", description: "Put the Sphero to sleep.", code: "await sphero.sleep()" },
    {
        title: "roll(speed, direction)",
        description:
            "Make Sphero roll at a specific speed (-255 - 255) in a specific direction (0° - 360°).",
        code: `
// Roll at full speed in the forward direction
await sphero.roll(255, 0)

// Roll at 200 speed in the right direction
await sphero.roll(200, 90)

// Roll at 100 speed in the backward direction
await sphero.roll(100, 180)
`,
    },
    {
        title: "rollTime(speed, direction, duration)",
        description:
            "Make Sphero roll at a specific speed (-255 - 255) in a specific direction (0° - 360°) for a specific duration (in milliseconds) and then come back to a complete stop.",
        code: `
 // Roll at full speed in the forward direction for 1 second
await sphero.rollTime(255, 0, 1000)
`,
    },
    {
        title: "delay(duration)",
        description: "Pause sending commands to the Sphero for duration (in milliseconds).",
        code: `
// Wait for 1 second
await sphero.delay(1000);
`
    },
    {
        title: "setColor(red, green, blue)",
        describe: "Set the color of the Sphero's LED light.",
        code: `
// Set the color to red
await sphero.setColor(255, 0, 0)
`
    },
    {
        title: "aim(duration)",
        desscribe: "Run the aiming function for duration (in milliseconds). When aiming, the Sphero will turn off its main LED and turn on the back LED. Point the back LED in the opposite direction of what you want forward to be.",
        code: `
// Give the user 5 seconds to aim the Sphero
await sphero.aim(5000)
`
    },
    {
        title: "setBackLed(brightness)",
        description: "Set the brightness (0-255) of the Sphero's back LED light.",
        code: `
// Set the brightness to full
await sphero.setBackLed(255)

// Turn off the back LED
await sphero.setBackLed(0)
`
    },
    {
        title: "getBatteryLevel()",
        description: "Get the battery level of the Sphero.",
        code: `
// Get the battery level
const batteryLevel = await sphero.getBatteryLevel()
console.log("Battery level:", batteryLevel)
`
    },
]