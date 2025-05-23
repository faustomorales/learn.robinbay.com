<script lang="ts">
  import { fail } from "$lib/common";
  import ProjectV2 from "$lib/components/ProjectV2.svelte";
  import javascriptTemplate from "./template.js?raw";
  import htmlTemplate from "./template.html?raw";
  import cssTemplate from "./template.css?raw";
  import { onMount } from "svelte";
  import SpheroMiniSimulator from "$lib/sphero/simulator";
  let sphero = $state(undefined as SpheroMiniSimulator | undefined);
  let simulator: HTMLDivElement;
  onMount(() => {
    sphero = new SpheroMiniSimulator(
      simulator!,
      [],
      Array.from({ length: 10 }, () => ({
        x1: Math.random() * 10,
        y1: Math.random() * 10,
      })).map((p) => ({
        x1: p.x1,
        y1: p.y1,
        x2: p.x1 + 1,
        y2: p.y1 + 1,
        color: 0xff0000,
      })),
    );
  });
</script>

<svelte:head>
  <title>Minefield Clearance</title>
</svelte:head>

<ProjectV2
  stateId="minefield-clearance"
  title="Minefield Clearance"
  onIframeLoad={(iframe) => ((iframe.contentWindow! as any).sphero = sphero)}
  base={{
    js: javascriptTemplate,
    html: htmlTemplate,
    css: cssTemplate,
  }}
  questions={[
    {
      type: "mc",
      text: "When driving, what happens when you press and release one of the driving keys?",
      stateId: "minefield-clearance/question/driving",
      options: [
        {
          text: "The Sphero drives in the given direction.",
          correct: false,
          hint: "",
        },
        {
          text: "The Sphero drives in the given direction while the button is held down and stops when the button is released.",
          correct: true,
          hint: "Try pressing and holding the button and then releasing it.",
        },
      ],
    },
    {
      type: "code",
      text: `
      <b>HTML:</b> As part of your design, you want to try different indicators for left, right, up, and down. Initially,
      they are just the text "left", "right", "up", and "down". You can change the text by modifying the content
      of the direction buttons in the HTML. Please change them to something else. In Chrome, you can use the tool under "Edit > Emoji and Symbols" to find emoji that might be suitable (e.g., ↑, ←, →, ↓).`,
      validate: (inputs) => {
        ["Left", "Right", "Up", "Down"].forEach((dir) => {
          if (inputs[`minefield/arrow-${dir.toLowerCase()}`].value === dir) {
            throw new Error(
              `The ${dir} button should not have the text "${dir}".`,
            );
          }
        });
      },
    },
    {
      type: "code",
      text: `<b>HTML:</b> Initially, the direction buttons only have a direction-specific class. But we might want to style all the buttons using some common rules. Please add a class called <code>direction</code> to each of the buttons using the blank input box.`,
      validate: (inputs) => {
        var values = [
          ...new Set(
            [1, 2, 3, 4].map(
              (i) => inputs[`minefield/direction-class-${i}`].value,
            ),
          ),
        ];
        if (values.some((v) => v === "")) {
          fail(
            "Please make sure to add a class to all of the buttons. You can use the blank input box.",
          );
        }
        if (!values.every((v) => v === "direction")) {
          var bad = values
            .filter((v) => v !== "direction")
            .map((v) => `<code>${v}</code>`)
            .join(", ");
          fail(
            `The class names should all be <code>direction</code>, but you have ${bad}. Please check your answer.`,
          );
        }
      },
    },
    {
      type: "code",
      text: `
      <b>CSS:</b> Now that we have a way of referring to all the buttons, let's make them a little more attractive. In the CSS code,
      please edit <b>Lines 1-5</b> to style the direction buttons. First, you'll choose the correct selector for the buttons. Then use valid CSS to set the <code>border</code>, <code>padding</code>, and <code>border-radius</code> properties. `,
      validate: (inputs) => {
        let selector = inputs["minefield/css/direction/selector"].value;
        if (selector === "") {
          fail("Please make sure to choose a selector for the buttons.");
        }
        if (selector === "#direction") {
          fail(
            "The # prefix is used for IDs, not classes. Please check your answer.",
          );
        }
        if (selector === "direction") {
          fail(
            "When no . or # are used, the selector refers to a tag name. But you are trying to select using class, which uses the . prefix.",
          );
        }
        if (selector !== ".direction") {
          fail(
            "The selector should be .direction, but you have something else. Please check your answer.",
          );
        }
        if (
          ["border", "border-radius", "padding"]
            .map((v) => inputs[`minefield/css/direction/${v}`].value)
            .some((v) => v === "")
        ) {
          fail(
            "Please make sure to set the border, padding, and border-radius properties.",
          );
        }
      },
    },
    {
      type: "code",
      text: `<b>HTML:</b> The <code>onclick</code> handler on the Auto button is currently not set! That's why the button doesn't do anything. Please set the <code>onclick</code> handler to <b>call</b> the <code>driveAuto</code> function.`,
      validate: (inputs) => {
        let value = inputs["minefield/html/auto/onclick"].value;
        if (value === "") {
          fail("Please make sure to set the onclick handler.");
        }
        if (value === "driveAuto") {
          fail(
            "The onclick handler should be a function call, not just the function name.",
          );
        }
        if (value === "move()") {
          fail(
            "The onclick handler should point to <code>driveAuto</code>, not <code>move</code>.",
          );
        }
      },
    },
    {
      type: "code",
      text: `<b>JavaScript</b>: When you push the <b>Auto</b> button, the robot doesn't manage to hit all of the mines.
      It leaves big gaps. Please modify <b>Lines 6-10</b> (you may not need to change all of them) to make the robot path
      cover all of the mines.`,
      validate: (inputs) => {
        var keys = [
          "minefield/count",
          "minefield/limit",
          "minefield/speed",
          "minefield/short",
          "minefield/long",
        ];
        if (
          keys
            .map((k) => inputs[k])
            .every((input) => input.value === input.default)
        ) {
          fail(
            "Please modify at least some of the lines. The default values don't cover the mines.",
          );
        }
        let reducedShortLength =
          parseInt(inputs["minefield/short"].value) <
          parseInt(inputs["minefield/short"].default);
        if (!reducedShortLength) {
          fail(
            "Please make changes that improve the coverage of the robot (how do you make the robot path travel for less distance in the short direction?).",
          );
        }
      },
    },
    {
      type: "code",
      text: `<b>JavaScript</b>: When driving the robot, the speed is currently fixed. Please modify <b>Line 40</b> of the JavaScript code to set the speed using the range slider input in the HTML.`,
      solution: `You can get the value of the range slider using
      <code>document.querySelector("#speed").value</code> or <code>document.getElementById("speed").value</code>.
      Then convert it to an integer using <code>parseInt()</code>. So the final code is <code>parseInt(document.querySelector("#speed").value</code>)`,
      validate: (inputs, iframe) => {
        let input = iframe.contentDocument!.querySelector(
          "#speed",
        ) as HTMLInputElement;
        let getSpeed = (iframe.contentWindow! as any).getSpeed as () =>
          | number
          | string;
        let initialValue = input.value;
        let desired = 42;

        input.value = desired.toString();
        let actual = getSpeed();
        input.value = initialValue.toString();
        if (typeof actual === "string") {
          fail(
            "The value of an input is always a string. Please make sure to convert to an integer using <code>parseInt()</code>.",
          );
        }
        if (actual !== desired) {
          fail(
            `The getSpeed function is not querying the range slider correctly. You can get its value using
            <code>document.querySelector("#speed").value</code> or <code>document.getElementById("#speed").value</code>`,
          );
        }
      },
    },
  ]}
>
  {#snippet introduction()}
    <p class="mb-4">
      In this project, you will implement a user interface and automated
      algorithm that will navigate a robot to successfully trigger all the mines
      in a minefield. The mines are represented by red platforms in the
      simulator. Start by manually driving the robot to trigger the mines. Once
      you've done that, start addressing the questions and exercises below to
      complete the project.
    </p>
  {/snippet}
  {#snippet secondary()}
    <div bind:this={simulator} class="simulator mt-4 mb-4"></div>
  {/snippet}
</ProjectV2>

<style>
  :global(.editor) {
    --editor-height: 240px;
    --iframe-height: 120px;
  }
</style>
