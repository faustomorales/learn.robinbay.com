import * as THREE from "three";
import { OBB } from "three/addons/math/OBB.js";
import type { Packet, Drivable, Command } from "./packets";
import { create, aim } from "./packets"

const degreesToRadians = (degrees: number) => degrees * (Math.PI / 180);

const PPI = 10;

const CONSTANTS = {
    dimensions: { width: 30 * PPI, height: 30 * PPI },
    radius: (1.57 / 2) * PPI,
    z: new THREE.Vector3(0, 0, 1),
    maxDegreesPerSecond: 2 * 360,
    maxIntensity: PPI * 30,
}


const createResponsePacket = (sequence: number, command: Command) => create(
    sequence,
    { command, response: true, flags: ["isResponse", "resetsInactivityTimeout"], }
)

export default class SpheroMiniSimulator implements Drivable {
    private time: number;
    private settings: {
        heading: { vector: THREE.Vector3; radiansPerSecond: number };
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
    }

    constructor(element: HTMLElement, walls: { x1: number, y1: number, x2: number, y2: number }[] = []) {
        this.time = 0;
        this.contents = {
            floor: new THREE.Mesh(
                new THREE.PlaneGeometry(60 * PPI, 60 * PPI),
                new THREE.MeshToonMaterial({
                    map: new THREE.TextureLoader().load('carpet.jpg', (texture) => {
                        texture.wrapS = THREE.RepeatWrapping;
                        texture.wrapT = THREE.RepeatWrapping;
                        texture.repeat.set(8, 8);
                    }),
                    side: THREE.DoubleSide
                })
            ),
            renderer: new THREE.WebGLRenderer(),
            camera: new THREE.PerspectiveCamera(
                100 * PPI,
                CONSTANTS.dimensions.width / CONSTANTS.dimensions.height,
                0.1,
                2000,
            ),
            ball: new THREE.Mesh(
                new THREE.SphereGeometry(CONSTANTS.radius, 32, 16),
                new THREE.MeshToonMaterial({
                    map: new THREE.TextureLoader().load("/sphiro.png"),
                }),
            ),
            scene: new THREE.Scene(),
            light: new THREE.PointLight(0xffffff, PPI * 1000),
            backLed: new THREE.PointLight(0xff0000, 0, PPI * 30),
            mainLed: new THREE.PointLight(0xffffff, 0, PPI * 30),
            walls: []
        }
        this.contents.camera.position.z = 10 * PPI;
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

        walls.forEach((w) => {
            let dx = w.x2 - w.x1;
            let dy = w.y2 - w.y1;
            let length = new THREE.Vector3(dx, dy).length();
            let dz = 3 * PPI;
            let wall = new THREE.Mesh(
                new THREE.BoxGeometry(length * PPI, 1 * PPI, dz),
                new THREE.MeshToonMaterial({ color: 0xffff00 }),
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
        this.settings = {
            heading: {
                radiansPerSecond: 0,
                vector: new THREE.Vector3(1, 0, 0),
            },
            awake: false,
            color: { red: 255, green: 255, blue: 255 },
        }

        this.sequence = 0;
        element.innerHTML = "";
        element.appendChild(this.contents.renderer.domElement);
        this.contents.renderer.setAnimationLoop(this.animate);
        this.contents.ball.material.map!.colorSpace = THREE.SRGBColorSpace;
        this.contents.renderer.setSize(CONSTANTS.dimensions.width, CONSTANTS.dimensions.height);
    }

    private animate = (time: number) => {
        let deltaSeconds = (time - this.time) / 1000;
        let deltaAngleRadians = deltaSeconds * this.settings.heading.radiansPerSecond;
        let axis = this.settings.heading.vector.clone().cross(CONSTANTS.z).negate()
        this.contents.ball.rotateOnWorldAxis(axis, deltaAngleRadians);
        let deltaPosition = this.settings.heading.vector
            .clone()
            .multiplyScalar(deltaAngleRadians * CONSTANTS.radius);
        this.contents.ball.position.add(deltaPosition);
        this.contents.camera.position.add(deltaPosition);
        this.contents.light.position.add(deltaPosition);

        // Check for intersection with walls
        let sphere = this.contents.ball.geometry.boundingSphere!.clone().applyMatrix4(this.contents.ball.matrixWorld);
        if (
            this.contents.walls.some((w) => w.intersectsSphere(sphere))
        ) {
            throw new Error("You touched one of the boundaries!");
        }
        this.time = time;
        this.contents.renderer.render(this.contents.scene, this.contents.camera);
    };

    public wake = () => {
        this.settings.awake = true;
        this.contents.mainLed.color.setRGB(this.settings.color.red / 255, this.settings.color.green / 255, this.settings.color.blue / 255);
        this.contents.mainLed.intensity = CONSTANTS.maxIntensity;
        return Promise.resolve(createResponsePacket(this.sequence++, "power:wake"))
    }
    public sleep = () => {
        this.settings.awake = false;
        this.contents.mainLed.color.setRGB(0, 0, 0);
        this.contents.mainLed.intensity = 0;
        this.contents.backLed.intensity = 0;
        return Promise.resolve(createResponsePacket(this.sequence++, "power:sleep"))
    }
    public setColor = (red: number, green: number, blue: number) => {
        if (!this.settings.awake) {
            throw new Error("Sphero is asleep.")
        }
        this.settings.color = { red, green, blue }
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
        }
        return Promise.resolve(createResponsePacket(this.sequence++, "driving:driveWithHeading"))
    }
    public rollTime = (speed: number, heading: number, time: number) =>
        new Promise<Packet>((resolve, reject) => this.roll(speed, heading).then(() =>
            setTimeout(() => this.roll(0, heading).then(resolve, reject), time), reject))
    public setStabilization = (enabled: boolean) => Promise.resolve(createResponsePacket(this.sequence++, "driving:setStabilization"))
    public resetAim = () => Promise.resolve(createResponsePacket(this.sequence++, "driving:resetAim"))
    public aim = async (duration: number = 5000) => aim(this, duration)
    public connect = async () => Promise.resolve()
    public disconnect = async () => Promise.resolve()
}