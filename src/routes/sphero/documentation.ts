export default [
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
        title: "roll(speed, direction, duration)",
        description:
            "Make Sphero roll at a specific speed (-255 - 255) in a specific direction (0° - 360°) for a specific duration (in milliseconds).",
        code: `
 // Roll at full speed in the forward direction for 1 second
sphero.roll(255, 0, 1000)
`,
    },
]