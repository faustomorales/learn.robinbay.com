<script lang="ts">
    import { onMount } from "svelte";
    var roomWidth = 50;
    var roomColor = "yellow";
    var increaseRoomWidth = () => {
        roomWidth = roomWidth + 1;
    }
    onMount(() => {
        const rooms = document.querySelectorAll(".room");
        rooms.forEach((room: any) => {
            room.addEventListener("click", () => {
                room.style.backgroundColor = "black";
            });
        });
    });
</script>

<div class="example"></div>
<div class="house">
    <div class="roof">Roof</div>
    <div class="interior">
        <div class="room">Room</div>
        <div class="room">Room</div>
        <div class="room">Room</div>
    </div>
    <div class="foundation">Foundation</div>
</div>

<style>
    .house, .foundation, .roof {
        width: 350px;
    }
    .roof, .foundation {
        height: 25px;
    }
    .house {
        text-align: center;
    }
    .roof {
        background-color: lightgray;
    }
    .interior {
        display: flex;
        justify-content: space-between;
    }
    .room {
        width: 100px;
        height: 50px;
        background-color: yellow;
    }
    .room:hover {
        background-color: lightyellow;
    }
    .foundation {
        background-color: gray;
    }
</style>
