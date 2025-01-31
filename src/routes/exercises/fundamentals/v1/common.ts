import { fail } from "$lib/common"

export const expectedCssStyling = [{
    class: `house`,
    property: `width`,
    value: `350px`,
},
{
    class: `foundation`,
    property: `width`,
    value: `350px`,
},
{
    class: `roof`,
    property: `width`,
    value: `350px`,
},
{
    class: `foundation`,
    property: `height`,
    value: `25px`,
}, {
    class: `roof`,
    property: `height`,
    value: `25px`,
}, {
    class: 'house',
    property: 'text-align',
    value: 'center'
}, {
    class: 'roof',
    property: 'background-color',
    value: 'lightgray'
},
{
    class: 'interior',
    property: 'display',
    value: 'flex',
}, {
    class: 'interior',
    property: 'justify-content',
    value: 'space-between'
}, {
    class: 'room',
    property: 'width',
    value: '100px',

}, {
    class: 'room',
    property: 'height',
    value: '50px',

}, {
    class: 'room',
    property: 'background-color',
    value: 'yellow',

}, {
    class: 'room:hover',
    property: 'background-color',
    value: 'lightyellow'
}, {
    class: 'foundation',
    property: 'background-color',
    value: 'gray'
}]

export const verifyRoomStyling = (iframe: HTMLIFrameElement, message: string) => {
    const rooms = iframe.contentDocument?.querySelectorAll(".room");
    if (!rooms) {
        fail("No room elements found.");
    } else if (rooms.length !== 3) {
        fail("There should be 3 room elements.");
    } else {
        rooms.forEach((room: any) => {
            let computed = iframe.contentWindow?.getComputedStyle(room);
            if (
                (room.style.width != "100px" &&
                    computed?.width != "100px") ||
                (room.style.height != "50px" &&
                    computed?.height != "50px") ||
                (room.style.backgroundColor != "yellow" &&
                    computed?.backgroundColor != "rgb(255, 255, 0)")
            ) {
                fail(
                    message
                );
            }
        });
    }
}

export const verifyHouseStyle = (iframe: HTMLIFrameElement) => {
    let window = iframe.contentWindow;
    if (!window) {
        fail("No window object found.");
        return
    }
    const house = window.document.querySelector(".house");
    const interior = house?.querySelector(".interior")
    const rooms = interior?.querySelectorAll(".room");
    const foundation = house?.querySelector(".foundation");
    const roof = house?.querySelector(".roof");
    if (!house) {
        fail("No house element found.");
    } else if (!interior) {
        fail("No interior element found.");
    } else if (!rooms) {
        fail("No room elements found.");
    } else if (rooms.length !== 3) {
        fail("There should be 3 room elements.");
    } else if (!foundation) {
        fail("No foundation element found.");
    } else if (!roof) {
        fail("No roof element found.");
    }
    else {
        let mapping: any = {
            house: window.getComputedStyle(house),
            interior: window.getComputedStyle(interior),
            foundation: window.getComputedStyle(foundation),
            roof: window.getComputedStyle(roof),
        }
        expectedCssStyling.forEach((style) => {
            if (style.class !== "room" && style.property !== "background-color" && mapping[style.class][style.property] != style.value) {
                fail(`The ${style.property} of the ${style.class} is not set to ${style.value}.`);
            }
        })
    }

}