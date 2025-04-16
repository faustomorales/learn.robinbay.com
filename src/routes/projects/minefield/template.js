// @ts-nocheck
var directions = { up: 270, right: 0, down: 90, left: 180 };
var driveAuto = async () => {
  await sphero.wake();
  await sphero.setColor(/*{{ "stateId": "minefield/color", "default": "\"red\"", "width": 15 }}*/);
  // Drive the Sphero out to a fixed distance.
  var count = /*{{ "stateId": "minefield/count", "default": "0", "width": 2 }}*/;
  var limit = /*{{ "stateId": "minefield/limit", "default": "5", "width": 2 }}*/;
  var speed = /*{{ "stateId": "minefield/speed", "default": "150", "width": 4 }}*/;
  var short = /*{{ "stateId": "minefield/short", "default": "250", "width": 4 }}*/;
  var long = /*{{ "stateId": "minefield/long", "default": "1000", "width": 4 }}*/;
  while (count < limit) {
    // Drive up
    await sphero.roll(speed, directions.up);
    await sphero.delay(long);
    // Drive right
    await sphero.roll(speed, directions.right);
    await sphero.delay(short);
    // Drive down
    await sphero.roll(speed, directions.down);
    await sphero.delay(long);
    // Drive right
    await sphero.roll(speed, directions.right);
    await sphero.delay(short);
    count = count + 1;
  }
  // Stop
  await sphero.roll(0, 0);
};

var toggleOnOff = async (event) => {
  if (event.target.classList.contains("on")) {
    await sphero.sleep();
  } else {
    await sphero.wake();
  }
  event.target.classList.toggle("on");
};

var getSpeed = () => {
  return /*{{ "stateId": "minefield/manual-speed", "default": "100", "width": 50 }}*/
}

var move = async (direction) => {
  var speed = getSpeed();
  try {
    if (direction === "left") {
      await sphero.roll(speed, directions.left);
    } else if (direction === "right") {
      await sphero.roll(speed, directions.right);
    } else if (direction === "down") {
      await sphero.roll(speed, directions.down);
    } else if (direction === "up") {
      await sphero.roll(speed, directions.up);
    } else if (direction === "stop") {
      await sphero.roll(0, 0);
    }
  } catch (e) {
    alert(`${e}`)
  }

};
