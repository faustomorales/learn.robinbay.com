// @ts-nocheck
let stepSize = 25;
let stepDuration = 500;
let defaultGrid = `xoxxxxxx,xooooxxx,xxxxoxxx,xxxxooox,xxxxxxox,xxxxxxox,xxxxxxox,xxxxxxox,xxxxxxox`
var executed = false;

function run(commands, grid) {
    executed = true;
    if (!grid) {
        grid = defaultGrid
    }
    document.querySelector("#maze").innerHTML = grid.split(",")
        .map((r) => r.trim())
        .filter((r) => r.length > 0)
        .map(
            (r) => (
                "<div class=\"row\">" +
                r.split("").map((c) => `<div class="${c}"></div>`).join("") +
                "</div>"
            )
        ).join("")
    let top = 0;
    let left = 25;
    let robot = document.querySelector("#robot")
    let positions = [{ left, top }]
    commands.forEach((command, i) => {
        if (command == "up") {
            top -= stepSize
        } else if (command == "down") {
            top += stepSize
        } else if (command == "left") {
            left -= stepSize
        } else if (command == "right") {
            left += stepSize
        }
        positions.push({ left, top })
    })
    positions.forEach((p, i) => {
        setTimeout(() => {
            robot.style.left = `${p.left}px`
            robot.style.top = `${p.top}px`
        }, (i + 1) * stepDuration)
    })
}