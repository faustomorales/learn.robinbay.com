<script lang="ts">
  import { onMount } from "svelte";
  import * as THREE from "three";
  import { OBB } from "three/addons/math/OBB.js";

  let container: HTMLDivElement;
  let ball: THREE.Mesh<
    THREE.SphereGeometry,
    THREE.MeshToonMaterial | THREE.MeshBasicMaterial
  >;
  let sphere = new THREE.Sphere();
  let scene: THREE.Scene;
  let camera: THREE.PerspectiveCamera;
  let renderer: THREE.WebGLRenderer;
  let light: THREE.PointLight;
  const walls: OBB[] = [];
  const radiusIn = 3;
  const ppi = 10;
  const radiusPx = radiusIn * ppi;
  const dimensions = { width: 30 * ppi, height: 30 * ppi };
  const z = new THREE.Vector3(0, 0, 1);
  let wallConfigs = [
    {
      x1: 0,
      y1: 5,
      x2: 20,
      y2: 20,
    },
    { x1: 20, y1: 20, x2: 50, y2: 20 },
    {x1: 0, y1: -10, x2: 20, y2: 5 },
  ];
  const degreesToRadians = (degrees: number) => degrees * (Math.PI / 180);
  let previousTimeMs: number = 0;
  let radiansPerSecond = degreesToRadians(180);
  let heading = new THREE.Vector3(1, 0, 0);
  const animate = (timeMs: number) => {
    let deltaSeconds = (timeMs - previousTimeMs) / 1000;
    let deltaAngleRadians = deltaSeconds * radiansPerSecond;
    ball.rotateOnWorldAxis(
      heading.clone().cross(z).negate(),
      deltaAngleRadians,
    );
    let deltaPosition = heading
      .clone()
      .multiplyScalar(deltaAngleRadians * radiusPx);
    ball.position.add(deltaPosition);
    camera.position.add(deltaPosition);
    light.position.add(deltaPosition);
    // Check for intersection with walls
    sphere.copy(ball.geometry.boundingSphere!).applyMatrix4(ball.matrixWorld);
    if (
      walls.some((w) => {
        return w.intersectsSphere(sphere);
      })
    ) {
      console.log("Crossed boundary!");
    }
    previousTimeMs = timeMs;
    renderer.render(scene, camera);
  };
  const keyToHeading: { [key: string]: THREE.Vector3 } = {
    ArrowLeft: new THREE.Vector3(-1, 0, 0),
    ArrowRight: new THREE.Vector3(1, 0, 0),
    ArrowDown: new THREE.Vector3(0, -1, 0),
    ArrowUp: new THREE.Vector3(0, 1, 0),
  };
  const setup = (element: HTMLElement) => {
    document.addEventListener("keydown", (event: KeyboardEvent) => {
      const updated = keyToHeading[event.key];
      if (updated) {
        event.preventDefault();
        heading = updated;
      }
    });
    camera = new THREE.PerspectiveCamera(
      100 * ppi,
      dimensions.width / dimensions.height,
      0.1,
      2000,
    );
    camera.position.z = 30 * ppi;
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    camera.rotateOnWorldAxis(z, (2 * Math.PI) / 2);
    renderer = new THREE.WebGLRenderer();
    ball = new THREE.Mesh(
      new THREE.SphereGeometry(radiusPx, 32, 16),
      new THREE.MeshToonMaterial({
        map: new THREE.TextureLoader().load("/sphiro.png", (data) => {
          data.colorSpace = THREE.SRGBColorSpace;
        }),
      }),
    );
    ball.position.set(-10 * ppi, 0, radiusPx)
    ball.geometry.computeBoundingSphere();
    scene = new THREE.Scene();
    light = new THREE.PointLight(0xffffff, ppi * 1000);
    light.position.set(0, 0, 10 * ppi);
    scene.add(light);
    scene.add(ball);
    // scene.add(new THREE.AxesHelper(20 * ppi));

    wallConfigs.forEach((w) => {
      let dx = w.x2 - w.x1;
      let dy = w.y2 - w.y1;
      let length = new THREE.Vector3(dx, dy).length();
      let dz = 5 * ppi;
      let wall = new THREE.Mesh(
        new THREE.BoxGeometry(length * ppi, 1 * ppi, dz),
        new THREE.MeshToonMaterial({ color: 0xffff00 }),
      );
      let transform = new THREE.Matrix4()
        .makeTranslation(ppi * (w.x1 + dx / 2), ppi * (w.y1 + dy / 2), dz / 2)
        .multiply(new THREE.Matrix4().makeRotationZ(Math.atan(dy / dx)));
      wall.geometry.computeBoundingBox();
      walls.push(
        new OBB().fromBox3(wall.geometry.boundingBox!).applyMatrix4(transform),
      );
      wall.geometry.applyMatrix4(transform);
      scene.add(wall);
    });
    console.log(walls);
    element.appendChild(renderer.domElement);
    renderer.setAnimationLoop(animate);
    renderer.setSize(dimensions.width, dimensions.height);
  };

  onMount(() => setup(container));
</script>

<div bind:this={container}></div>
