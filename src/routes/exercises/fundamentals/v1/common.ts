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

