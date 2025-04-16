import SpheroMiniSimulator from "./simulator";
import type { Drivable } from "./packets";
import Sphero from "./sphero";

export const createSpheroState = (
  precheck: (iframe: HTMLIFrameElement) => void,
  simulatorContainer?: HTMLDivElement,
  iframe?: HTMLIFrameElement,
) => {
  let ball: Drivable | undefined = undefined;
  let sphero: Sphero = $state(new Sphero());
  let status = $state({ driving: false, error: "" });
  const drive = async (simulate: boolean) => {
    try {
      if (!iframe) {
        throw new Error("No iframe found");
      }
      if (precheck) {
        precheck(iframe);
      }
      let window: {
        drive: (ball: Drivable) => Promise<any>;
        walls?: { x1: number; y1: number; x2: number; y2: number }[];
        platforms?: {
          x1: number;
          y1: number;
          x2: number;
          y2: number;
        }[];
      } = iframe.contentWindow! as any;
      if (typeof window.drive !== "function") {
        throw new Error("No drive function found");
      }
      let walls =
        window.walls && typeof window.walls === "object" && window.walls.length
          ? window.walls
          : [];
      let platforms =
        window.platforms &&
        typeof window.platforms === "object" &&
        window.platforms.length
          ? window.platforms
          : [];
      ball = simulate
        ? new SpheroMiniSimulator(simulatorContainer!, walls, platforms)
        : sphero;
      await ball!.connect(navigator.bluetooth);
      status.driving = true;
      status.error = "";
      try {
        await window.drive(ball!);
      } catch (e) {
        status.error = `${e}`;
      }
      await ball!.delay(500);
      await ball!.sleep();
      await ball!.disconnect();
    } catch (e) {
      status.error = `${e}`;
    }
    status.driving = false;
    ball = undefined;
  };
  const stop = (iframe?: HTMLIFrameElement) => {
    ball?.roll(0, 0);
    ball?.delay(500);
    ball?.disconnect();
    iframe?.contentWindow?.location.reload();
    ball = undefined;
    status.driving = false;
  };
  return { drive, stop, status };
};
