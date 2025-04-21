<script lang="ts">
  import Wizard from "$lib/components/Wizard.svelte";
  import { fail } from "$lib/common";
  import { ensureVariableExists } from "$lib/verifications.svelte";
</script>

<Wizard
  title="Warmup: Functions"
  stages={[
    {
      stateId: "warmup-functions",
      title: "Problem 1",
      iframeVisibility: "hidden",
      showConsole: true,
      questions: [
        {
          type: "mc",
          stateId: "warmup-function-1-x+3",
          text: "What would be the output of <code>console.log(x + 3)</code>?",
          options: [
            { text: "x + 3", hint: "The + sign in code results in addition." },
            { text: "8", correct: true },
            {
              text: "5",
              hint: "Note that we are adding to the initial value of x",
            },
            { text: "7", hint: "Please check your math." },
          ],
        },

        {
          type: "code",
          validate: (inputs) => {
            let value = inputs["warmup-functions-change-to-10"].value;
            switch (value) {
              case "":
                fail("Please select one of the options.");
                break;
              case "x = 10":
                break;
              case "x = '10'":
                fail("<code>x</code> is a number, not a string.");
                break;
              case "var x = 10":
                fail(
                  "<code>x</code> has already been declared, you cannot declare it again.",
                );
                break;
              case "x == 10":
                fail(
                  "<code>==</code> is a comparison operator, not an assignment operator.",
                );
                break;
              case "x === 10":
                fail(
                  "<code>===</code> is a comparison operator, not an assignment operator.",
                );
                break;
            }
          },
          text: "On <b>Line 2</b>, please select the code that will change the value of <code>x</code> to 10.",
        },
        {
          type: "code",
          text: "On <b>Line 3</b>, please declare a variable called y and assign it the value of 7.",
          validate: (inputs, iframe) => {
            let value = inputs["warmup-functions-declare-y"].value;
            if (!value) {
              fail("Please enter something on Line 3.");
            }
            let y = ensureVariableExists("y", "number", iframe);
            if (!value.startsWith("var")) {
              fail("You must use <code>var</code> to declare variables.");
            }
            if (y !== 7) {
              fail("The value of <code>y</code> is not 7.");
            }
          },
        },
      ],
      base: {
        js: `var x = 5;
{{ "id": "warmup-functions-change-to-10", "options": ["", "x = '10'", "var x = 10", "x == 10", "x === 10", "x = 10"] }}
{{ "id": "warmup-functions-declare-y", "width": 15 }}`,
      },
    },
    {
      stateId: "warmup-functions-2",
      title: "Problem 2",
      iframeVisibility: "hidden",
      showConsole: true,
      questions: [
        {
          type: "mc",
          stateId: "warmup-functions-2",
          text: "What would be the output of <code>greet('world')</code>?",
          options: [
            { text: "Hello, world!", correct: true },
            { text: "Hello, John!" },
            { text: "Hello, Jane!" },
            { text: "Hello, everyone!" },
          ],
        },
        {
          type: "code",
          text: 'On <b>Line 4</b>, choose the code that correctly calls the function <code>greet</code> with the argument "John".',
          validate: (inputs) => {
            switch (inputs["warmup-functions-2-call-greet"].value) {
              case "greet(John)":
                fail("You need to use quotes around the name.");
                break;
              case "greet = John":
                fail(
                  "This would assign the value of John to greet but you need to <code>call</code> greet.",
                );
                break;
              case "":
                fail("Please select one of the options.");
              case "greet('John')":
              case 'greet("John")':
                break;
            }
          },
        },
        {
          type: "code",
          solution: 'firstName + " " + lastName',
          text: 'On <b>Line 6</b>, please change the <code>greetFullName</code> function to use the variables <code>firstName</code> and <code>lastName</code> to print the full name. For example, the output of <code>greetFullName(\"John\", \"Doe\")</code> should be "Hello, John Doe!"',
          validate: (inputs) => {
            let value = inputs["warmup-functions-2-call-greet-full-name"].value;
            let result = eval(
              "var firstName = 'John'; var lastName = 'Doe';" + value,
            );
            console.log("result", result);
            switch (result) {
              case "John Doe":
                break;
              case "John":
                fail("Remember to include the last name.");
                break;
              case "Doe":
                fail("Remember to include the first name.");
                break;
              case "JohnDoe":
                fail(
                  "Remember to put a space between the first and last name.",
                );
                break;
            }
          },
        },
      ],
      base: {
        js: `var greet = (name) => {
  console.log("Hello, " + name + "!");
}
{{ "id": "warmup-functions-2-call-greet", "width": 15, "options": ["", "greet(\\\"John\\\")", "greet(John)", "greet = John"] }}
var greetFullName = (firstName, lastName) => {
  console.log("Hello, " + {{ "id": "warmup-functions-2-call-greet-full-name", "width": 30 }} + "!");
}`,
      },
    },
    {
      iframeVisibility: "hidden",
      title: "Problem 3",
      stateId: "warmup-functions-3",
      showConsole: true,
      questions: [
        {
          type: "mc",
          stateId: "warmup-function-3-comprehension",
          text: "What would be the output of <code>console.log(add(2, 3))</code>",
          options: [
            {
              text: "23",
              hint: "The arguments to add are numbers, so they are added, not concatenated like strings.",
            },
            {
              text: "2 + 3",
              hint: "You're not wrong, exactly, but this is not the most complete answer.",
            },
            { text: "5", correct: true },
            { text: "6", hint: "Please check your math." },
          ],
        },
        {
          type: "code",
          text: "On <b>Line 6</b>, please change the <code>multiply</code> function to return the product of <code>a</code> and <code>b</code> instead of the sum.",
          validate: (inputs) => {
            let value = inputs["warmup-function-3-multiply"].value;
            switch (value) {
              case "":
                fail("Please select one of the options.");
                break;
              case "a + b":
                fail("This is the original code.");
                break;
              case "a - b":
                fail("- represents subtraction");
                break;
              case "a / b":
                fail("/ represents division");
                break;
              case "a * b":
                break;
            }
          },
        },
        {
          type: "code",
          text: "Please finish implementing the <code>subtract</code> function by finishing the function signature on <b>Line 9</b> and the operation on <b>Line 10</b>. The function should return the difference of <code>a</code> and <code>b</code>.",
          solution:
            'You should have entered "<code>a, b</code>" on <b>Line 9</b> and "<code>a - b</code>" on <b>Line 10</b>.',
          validate: (inputs) => {
            let signature =
              inputs["warmup-function-3-subtract-signature"].value;
            let operation =
              inputs["warmup-function-3-subtract-operation"].value;
            let difference = eval("var a = 5; var b = 3;" + operation);
            if (operation === "" || difference != 2) {
              fail("Please subtract b from a on line 10.");
            }
            if (signature === "") {
              fail("Please add the function signature on line 9.");
            }
            if (signature !== "a, b") {
              fail("Please use a and b as the function parameters.");
            }
          },
        },
      ],
      base: {
        js: `var add = (a, b) => {
  return a + b;
}

var multiply = (a, b) => {
  return {{ "id": "warmup-function-3-multiply", "options": ["a + b", "a - b", "a / b", "a * b"] }};
}

var subtract = ({{ "id": "warmup-function-3-subtract-signature", "width": 15 }}) => {
  return {{ "id": "warmup-function-3-subtract-operation", "width": 15 }};
}`,
      },
    },
  ]}
/>
