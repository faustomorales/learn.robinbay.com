import { test, expect } from "vitest"
import { encodeSpeedAndHeading } from "./packets";

test('encodeSpeedAndHeading', () => {
    // Right, stopped
    expect(encodeSpeedAndHeading(0, 90)).toEqual([0x0, 0x0, 0x5a, 0x0])

    // Right, moving
    expect(encodeSpeedAndHeading(196, 90)).toEqual([0xc4, 0x0, 0x5a, 0x0])

    // Left, moving
    expect(encodeSpeedAndHeading(196, 270)).toEqual([0xc4, 0x1, 0xe, 0x0])
});