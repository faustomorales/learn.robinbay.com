import * as THREE from "three";
import { OBB } from "three/addons/math/OBB.js";
import type { Packet, Drivable, Command } from "./packets";
import { create, aim, interpretColor } from "./packets"

const degreesToRadians = (degrees: number) => degrees * (Math.PI / 180);

const PPI = 10;

const CONSTANTS = {
    dimensions: { width: 40 * PPI, height: 40 * PPI },
    radius: (1.57 / 2) * PPI,
    z: new THREE.Vector3(0, 0, 1),
    /*
        The ball can roll up to 37 inches per second
        (measured experimentally) and has diameter
        1.57in. This means we roll
        (37 / (2 * pi * 1.57)) * 360 =  degrees per second.
    */
    maxDegreesPerSecond: (37 / (Math.PI * 1.57)) * 360,
    maxIntensity: PPI * 30,
}


const createResponsePacket = (sequence: number, command: Command) => create(
    sequence,
    { command, response: true, flags: ["isResponse", "resetsInactivityTimeout"], }
)

const renderPlatformUsingCoordinates = (p: { x1: number, y1: number, x2: number, y2: number, color?: number }) => {
    let dx = p.x2 - p.x1;
    let dy = p.y2 - p.y1;
    let platform = new THREE.Mesh(
        new THREE.PlaneGeometry(dx, dy),
        new THREE.MeshToonMaterial({ color: p.color || 0xff0000 })
    )
    platform.position.z = 0.05;
    platform.position.x = (p.x1 + dx / 2);
    platform.position.y = (p.y1 + dy / 2);
    return platform
}

export default class SpheroMiniSimulator implements Drivable {
    private time: number;
    private settings: {
        heading: { vector: THREE.Vector3; radiansPerSecond: number, z: number };
        awake: boolean;
        color: { red: number, green: number, blue: number },
    }
    private sequence: number;
    private contents: {
        scene: THREE.Scene;
        camera: THREE.PerspectiveCamera;
        renderer: THREE.WebGLRenderer;
        light: THREE.PointLight;
        ball: THREE.Mesh<
            THREE.SphereGeometry,
            THREE.MeshToonMaterial | THREE.MeshBasicMaterial
        >;
        floor: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshToonMaterial>;
        mainLed: THREE.PointLight;
        backLed: THREE.PointLight;
        walls: OBB[];
        platforms: { mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshToonMaterial>, coordinates: { x1: number, y1: number, x2: number, y2: number } }[];
    }

    constructor(element: HTMLElement, walls: { x1: number, y1: number, x2: number, y2: number }[] = [], platforms: { x1: number, y1: number, x2: number, y2: number, color?: number }[]) {
        this.time = 0;
        let dimensions = { width: element.getBoundingClientRect().width, height: CONSTANTS.dimensions.height }
        this.contents = {
            floor: new THREE.Mesh(
                new THREE.PlaneGeometry(90 * PPI, 90 * PPI),
                new THREE.MeshToonMaterial({
                    map: new THREE.TextureLoader().load('/carpet.jpg', (texture) => {
                        texture.wrapS = THREE.RepeatWrapping;
                        texture.wrapT = THREE.RepeatWrapping;
                        texture.repeat.set(12, 12);
                    }),
                    side: THREE.FrontSide
                })
            ),
            renderer: new THREE.WebGLRenderer(),
            camera: new THREE.PerspectiveCamera(
                100 * PPI,
                dimensions.width / dimensions.height,
                0.1,
                2000,
            ),
            ball: new THREE.Mesh(
                new THREE.SphereGeometry(CONSTANTS.radius, 32, 16),
                new THREE.MeshToonMaterial({
                    map: new THREE.TextureLoader().load("/sphiro.png"),
                    side: THREE.DoubleSide,
                }),
            ),
            scene: new THREE.Scene(),
            light: new THREE.PointLight(0xffffff, PPI * 1000),
            backLed: new THREE.PointLight(0xff0000, 0, PPI * 30),
            mainLed: new THREE.PointLight(0xffffff, 0, PPI * 30),
            walls: [],
            platforms: [],
        }
        this.contents.camera.position.z = 12 * PPI;
        this.contents.camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.contents.camera.rotateOnWorldAxis(CONSTANTS.z, (2 * Math.PI) / 2);
        this.contents.ball.position.set(0, 0, CONSTANTS.radius);
        this.contents.backLed.position.set(-CONSTANTS.radius, 0, CONSTANTS.radius);
        this.contents.ball.geometry.computeBoundingSphere();

        this.contents.light.position.set(0, 0, 10 * PPI);
        this.contents.scene.add(this.contents.light);
        this.contents.scene.add(this.contents.ball);
        this.contents.scene.add(this.contents.floor);
        this.contents.ball.add(this.contents.backLed)
        this.contents.ball.add(this.contents.mainLed)
        this.contents.scene.add(new THREE.AxesHelper(20 * PPI));

        let wallTexture = new THREE.TextureLoader().load('/brick.jpg', (texture) => {
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.wrapS = THREE.ClampToEdgeWrapping;
            texture.wrapT = THREE.RepeatWrapping;
        })
        walls.forEach((w) => {
            let dx = Math.abs(w.x2 - w.x1);
            let dy = Math.abs(w.y2 - w.y1);
            let length = new THREE.Vector3(dx, dy).length();
            let dz = 3 * PPI;
            let wall = new THREE.Mesh(
                new THREE.BoxGeometry(length * PPI, 1 * PPI, dz),
                new THREE.MeshToonMaterial({ map: wallTexture }),
            );
            let transform = new THREE.Matrix4()
                .makeTranslation(PPI * (w.x1 + dx / 2), PPI * (w.y1 + dy / 2), dz / 2)
                .multiply(new THREE.Matrix4().makeRotationZ(Math.atan(dy / dx)));
            wall.geometry.computeBoundingBox();
            this.contents.walls.push(
                new OBB().fromBox3(wall.geometry.boundingBox!).applyMatrix4(transform),
            );
            wall.geometry.applyMatrix4(transform);
            this.contents.scene.add(wall);
        });
        platforms.forEach((p) => {
            let scaled = { x1: p.x1 * PPI, y1: p.y1 * PPI, x2: p.x2 * PPI, y2: p.y2 * PPI, color: p.color }
            let platform = renderPlatformUsingCoordinates(scaled)
            this.contents.scene.add(platform);
            this.contents.platforms.push({ mesh: platform, coordinates: scaled });
        })
        this.settings = {
            heading: {
                radiansPerSecond: 0,
                vector: new THREE.Vector3(1, 0, 0),
                z: 0,
            },
            awake: false,
            color: { red: 255, green: 255, blue: 255 },
        }

        this.sequence = 0;
        element.innerHTML = "";
        element.appendChild(this.contents.renderer.domElement);
        this.contents.renderer.setAnimationLoop(this.animate);
        this.contents.ball.material.map!.colorSpace = THREE.SRGBColorSpace;
        this.contents.renderer.setSize(dimensions.width, dimensions.height);
    }

    private animate = (time: number) => {
        let deltaSeconds = (time - this.time) / 1000;
        let deltaAngleRadians = deltaSeconds * this.settings.heading.radiansPerSecond;
        let axis = this.settings.heading.vector.clone().cross(CONSTANTS.z).negate()
        this.contents.ball.rotation.z = this.settings.heading.z;
        this.contents.ball.rotateOnWorldAxis(axis, deltaAngleRadians);
        let deltaPosition = this.settings.heading.vector
            .clone()
            .multiplyScalar(deltaAngleRadians * CONSTANTS.radius);
        this.contents.ball.position.add(deltaPosition);
        let paint = 5;
        this.contents.scene.add(
            renderPlatformUsingCoordinates({
                x1: this.contents.ball.position.x - paint,
                y1: this.contents.ball.position.y - paint,
                x2: this.contents.ball.position.x + paint,
                y2: this.contents.ball.position.y + paint,
                color: 0x005500,
            }
        ))

        // Update target position based on the object's position
        this.contents.camera.position.lerp(this.contents.camera.position.clone().add(deltaPosition), 0.90);
        this.contents.camera.lookAt(this.contents.ball.position);

        this.contents.camera.rotation.z = Math.PI;
        this.contents.light.position.add(deltaPosition);

        // Check for intersection with walls
        let sphere = this.contents.ball.geometry.boundingSphere!.clone().applyMatrix4(this.contents.ball.matrixWorld);
        if (
            this.contents.walls.some((w) => w.intersectsSphere(sphere))
        ) {
            this.contents.renderer.setAnimationLoop(null);
            throw new Error("You touched one of the boundaries!");
        }
        this.contents.platforms.filter((p) => sphere.center.x >= p.coordinates.x1 && sphere.center.x <= p.coordinates.x2 && sphere.center.y >= p.coordinates.y1 && sphere.center.y <= p.coordinates.y2).forEach((p) => {
            p.mesh.material.color.setHex(0x00ff00);
        })
        this.time = time;
        this.contents.renderer.render(this.contents.scene, this.contents.camera);
    };

    public wake = () => {
        this.settings.awake = true;
        this.contents.mainLed.color.setRGB(this.settings.color.red / 255, this.settings.color.green / 255, this.settings.color.blue / 255);
        this.contents.mainLed.intensity = CONSTANTS.maxIntensity;
        return new Promise<Packet>((resolve) => setTimeout(() => resolve(createResponsePacket(this.sequence++, "power:wake")), 500))
    }
    public sleep = () => {
        this.settings.awake = false;
        this.contents.mainLed.color.setRGB(0, 0, 0);
        this.contents.mainLed.intensity = 0;
        this.contents.backLed.intensity = 0;
        return Promise.resolve(createResponsePacket(this.sequence++, "power:sleep"))
    }
    public setColor = (red: number | string, green?: number, blue?: number) => {
        this.settings.color = interpretColor(red, green, blue);
        this.contents.mainLed.color.setRGB(this.settings.color.red / 255, this.settings.color.green / 255, this.settings.color.blue / 255);
        return Promise.resolve(createResponsePacket(this.sequence++, "io:color"))
    }
    public delay = (time: number) => new Promise((resolve) => setTimeout(resolve, time))
    public getBatteryLevel = () => Promise.resolve(100)
    public setBackLed = (brightness: number) => {
        if (!this.settings.awake) {
            throw new Error("Sphero is asleep.")
        }
        this.contents.backLed.intensity = (brightness / 255) * CONSTANTS.maxIntensity;
        return Promise.resolve(createResponsePacket(this.sequence++, "io:rearLightBrightness"))
    }
    public roll = (speed: number, heading: number) => {
        if (!this.settings.awake) {
            throw new Error("Sphero is asleep.")
        }
        this.settings.heading = {
            radiansPerSecond: degreesToRadians((speed / 255) * CONSTANTS.maxDegreesPerSecond),
            vector: new THREE.Vector3(Math.cos(degreesToRadians(-heading)), Math.sin(degreesToRadians(-heading)), 0),
            z: degreesToRadians(-heading),
        }
        return Promise.resolve(createResponsePacket(this.sequence++, "driving:driveWithHeading"))
    }
    public rollTime = (speed: number, heading: number, time: number) =>
        new Promise<Packet>((resolve, reject) => this.roll(speed, heading).then(() =>
            setTimeout(() => this.roll(0, heading).then(resolve, reject), time), reject))
    public setStabilization = (enabled: boolean) => Promise.resolve(createResponsePacket(this.sequence++, "driving:setStabilization"))
    public resetAim = () => Promise.resolve(createResponsePacket(this.sequence++, "driving:resetAim"))
    public aim = async (duration: number = 2000) => aim(this, duration)
    public connect = async () => Promise.resolve()
    public disconnect = async () => {
        this.contents.renderer.setAnimationLoop(null);
        return Promise.resolve()
    }
}