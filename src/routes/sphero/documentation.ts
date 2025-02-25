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
        title: "wait(duration)",
        description: "Pause sending commands to the Sphero for duration (in milliseconds).",
        code: `
// Wait for 1 second
await sphero.wait(1000);
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
]