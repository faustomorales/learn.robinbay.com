import type { Drivable } from "./packets"

var driveInCircles = async (sphero: Drivable) => {
    await sphero.wake()
    await sphero.delay(1000)
    var colors = [
        { red: 255, green: 0, blue: 0 },
        { red: 0, green: 255, blue: 0 },
        { red: 0, green: 0, blue: 255 },
    ]
    let bpm = 130
    let delay = (1 / (bpm / 60)) * 1000
    let increment = 30;
    let speed = 10;
    for (var i = 0; i < 100; i++) {
        let color = colors[i % colors.length]
        let heading = i * increment;
        const start = Date.now();
        sphero.setColor(color.red, color.green, color.blue)
        sphero.roll(speed, heading)
        await sphero.delay(Math.abs(delay - (Date.now() - start)))
    }
}