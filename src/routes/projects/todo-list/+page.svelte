<script lang="ts">
  import type { CodeInput, Tooltip } from "$lib/codemirror.svelte";
  import Editor from "../../../lib/components/Editor.svelte";
  import Question from "../../../lib/components/Question.svelte";
  import BaseQuestion from "../../../lib/components/BaseQuestion.svelte";
  import { ensureVariableExists } from "$lib/verifications.svelte";
  import { fail, getKeyValue } from "$lib/common";
  var template = $state({
    html: `<h1>             </h1>
<input id="task" type="text" placeholder="New task" />
<button onclick="addTask(event)">Add</button>
<ul id="list"></ul>
`,
    css: `body {
  font-family: Arial;
  background-color: white;
}
ul#list {
  padding-left: 0px;
  list-style-type: none;
}
.completed {
  text-decoration: line-through;                 
  color: gray;
}
button.delete-btn {
  margin-left: 10px;
}
ul#list span {
  margin-left: 8px;
}`,
    js: `var addTask = (event) => {
  var taskText = document.getElementById('task').value;
  var li = document.createElement('li');
  
  var checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.onchange = toggleTask;
  
  var span = document.createElement('span');
  span.textContent = taskText;
                                                                                  
  
  var delBtn = document.createElement('button');
  delBtn.textContent = 'Delete';
  delBtn.className = 'delete-btn';
  delBtn.onclick = deleteTask;
  
  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(delBtn);                         
  document.getElementById('list').appendChild(li);
  document.getElementById('task').value = '';
  if (event) { saveTasks() }
  return li
}

var deleteTask = (event) => {
  event.target.parentElement.remove();
  saveTasks();
}

var toggleTask = (event) => {
  event.target.parentElement.classList.toggle("completed");
  var completed = event.target.parentElement.classList.contains("completed")
  if (completed) {
    confetti();                                                                             
  }
  saveTasks();
}

var saveTasks = () => {
  var tasks = [];
  for (var li of document.querySelectorAll("li")) {
    tasks.push({
      text: li.querySelector("span").textContent,
      completed: li.classList.contains("completed")
    });
  }
  localStorage.setItem("tasks", JSON.stringify(tasks))
}

var loadTasks = () => {
  for (var task of JSON.parse(localStorage.getItem("tasks") || "[]")) {
    var li = addTask();
    li.querySelector("span").textContent = task.text;
    if (task.completed) {
      li.classList.toggle("completed");
      li.querySelector("input").checked = true;
    }
  }
}

loadTasks();`,
  });
  var tooltips: Tooltip[] = $state([]);
  var inputs: { [key: string]: CodeInput } = $state(
    Object.fromEntries(
      Object.entries({
        "todo/heading-tag": {
          language: "html",
          options: ["h1", "h2", "h3", "p"],
          stateId: "todo/heading-tag",
          default: "h1",
          width: 2,
          positions: [
            {
              line: 1,
              character: 1,
              id: "heading-tag-open",
            },
            {
              line: 1,
              character: 19,
              id: "heading-tag-close",
            },
          ],
        },
        "todo/span-selector": {
          language: "css",
          stateId: "todo/span-selector",
          options: ["ul#list", "ol#list span", "ul#list span"],
          default: "",
          width: 12,
          positions: [
            {
              line: 16,
              character: 0,
            },
          ],
        },
        "todo/span-rule": {
          language: "css",
          stateId: "todo/span-rule",
          default: "",
          width: 17,
          positions: [
            {
              line: 17,
              character: 2,
            },
          ],
        },
        "todo/span-margin": {
          language: "js",
          stateId: "todo/span-margin",
          default: "span.style.marginLeft = '8px';",
          options: ["span.style.marginLeft = '8px';", ""],
          width: 40,
          positions: [{ line: 11, character: 2 }],
        },
        "todo/clear-input": {
          language: "js",
          stateId: "todo/clear-input",
          default: "",
          options: [
            "",
            "document.getElementById('task');",
            "document.getElementById('task').value = '';",
            "document.getElementById('list').value = '';",
          ],
          width: 43,
          positions: [{ line: 22, character: 2 }],
        },
        "todo/heading-text": {
          language: "html",
          stateId: "todo/heading-text",
          default: "Todo List",
          width: 13,
          positions: [{ line: 1, character: 4, id: "heading-text" }],
        },
        "todo/append-child": {
          language: "js",
          stateId: "todo/append-child",
          default: "document.getElementById('list').appendChild(li);",
          options: ["", "document.getElementById('list').appendChild(li);"],
          width: 48,
          positions: [{ line: 21, character: 2, id: "append-child" }],
        },
        "todo/text-decoration": {
          language: "css",
          stateId: "todo/text-decoration",
          default: "line-through;",
          width: 23,
          positions: [{ line: 10, character: 19, id: "text-decoration" }],
        },
        "todo/addDelBtn": {
          language: "js",
          stateId: "todo/addDelBtn",
          default: "",
          width: 23,
          positions: [{ line: 20, character: 2, id: "addDelBtn" }],
        },
        "todo/confetti": {
          language: "js",
          stateId: "todo/confetti",
          default: "",
          width: 80,
          positions: [{ line: 36, character: 4, id: "confetti" }],
        },
      }).map(([key, value]) => [
        key,
        {
          ...value,
          value: getKeyValue(value.stateId, value.default),
        } as CodeInput,
      ]),
    ),
  );
  let iframe: HTMLIFrameElement | undefined = $state();
  const questions: (
    | {
        type: "mc";
        text: string;
        stateId: string;
        options: { text: string; correct: boolean; hint: string }[];
      }
    | {
        type: "code";
        text: string;
        validate: () => void;
      }
  )[] = $state([
    {
      type: "code",
      text: `
      As part of your design, you want to try different heading sizes.
      On <strong>Line 1</strong> of the <strong>HTML</strong> code, please try a few different
      heading options to see how they change the look of the page.
      When you're done, please set it to <code>h3</code>.`,
      validate: () => {
        if (inputs["todo/heading-tag"].value !== "h3") {
          throw new Error(
            "Make sure you switched to the correct tag for the heading.",
          );
        }
      },
    },
    {
      type: "mc",
      text: "When you add a new task to the list, what happens to the text inside the input box?",
      stateId: "todo-list:is-input-clear",
      options: [
        { text: "The text is cleared.", correct: false, hint: "" },
        {
          text: "The text stays the same.",
          correct: true,
          hint: "Look at the contents of the input box. Do they stay the same after adding the item to the list?",
        },
      ],
    },
    {
      type: "code",
      text: `The user's input shouldn't stay in the input box after the task has been added to the list. That's a bug! Fix the bug by changing <b>Line 22</b>
      in the <b>JavaScript</b> code to something that will clear the contents of the input box.`,
      validate: () => {
        if (
          inputs["todo/clear-input"].value !==
          "document.getElementById('task').value = '';"
        ) {
          throw new Error(
            "Which of the options in the list sets the input element to a blank string?",
          );
        }
      },
    },
    {
      type: "code",
      text: `The code currently sets the styling for the <code>span</code> element in the JavaScript code. This is okay, but ideally we would define that in CSS
      because it makes it easier to see all the styles applied to an element. For this step, modify the contents of all of the following so that left margin on
      the span element is set in CSS:
      
      <ul class="list-disc list-outside ml-4 mt-4">
        <li><b>Line 11</b> of the <b>JavaScript</b> code (which should be removed).</li>
        <li><b>Line 16</b> of the <b>CSS</b> code (which should define the selector for the <code>span</code> element).
        <li><b>Line 17</b> of the <b>CSS</b> code (which should set the left margin property for the span to 8px).
      </ul>
      `,
      validate: () => {
        let rule = inputs["todo/span-rule"].value;
        let selector = inputs["todo/span-selector"].value;
        let jsRule = inputs["todo/span-margin"].value;
        if (jsRule) {
          fail(
            "Make sure to remove the JavaScript code currently setting margin.",
          );
        }
        if (selector != "ul#list span") {
          fail(
            "Your CSS selector does not correctly target the span in the list. Please look carefully at the options.",
          );
        }
        let list = iframe!.contentWindow!.document.getElementById("list")!;
        let li = iframe!.contentWindow!.document.createElement("li");

        li.style.visibility = "hidden";
        li.innerHTML = "<span></span>";
        list.appendChild(li);
        let style = iframe!.contentWindow!.getComputedStyle(
          li.querySelector("span")!,
        );
        // li.remove();
        console.log("style", style.marginLeft);
        if (!(style.marginLeft == "8px")) {
          fail(
            "Your selector is correct but your CSS rule does not seem to work properly.",
          );
        }
      },
    },
    {
      type: "code",
      text: `Let's spruce up what happens when the user completes a task. On <b>Line 36</b> of the <b>JavaScript</b>, add a call to <code>confetti()</code>.
      Try passing different <a target="_blank" href="https://www.kirilv.com/canvas-confetti/" class="external">settings</a> from the library.`,
      validate: () => {
        if (!inputs["todo/confetti"].value.includes("confetti(")) {
          throw new Error("Please make sure you call the confetti function ");
        }
      },
    },
    {
      type: "code",
      text: `Try a different styling for the completed items. Use the documentation on the <a class="external" target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/CSS/text-decoration">text-decoration</a> CSS property to choose a new way for completed items to look.`,
      validate: () => {
        console.log("line-through", inputs["todo/text-decoration"].value);
        if (inputs["todo/text-decoration"].value === "line-through;") {
          throw new Error(
            "It doesn't look like you've changed the styling. Please try something other than <code>line-through;</code>.",
          );
        }
      },
    },
    {
      type: "code",
      text: `
      How does the user delete tasks from the list? They can't! <b>Lines 13-16</b> of the <b>JavaScript</b> create a delete button but, critically, we never add that element to the <code>li</code> element that gets inserted into the page. To remedy this, on <b>Line 20</b> of the <b>JavaScript</b> code, add code to append the <code>delBtn</code> element to the <code>&lt;li></code> element.
      `,
      validate: () => {
        var li: HTMLLIElement = ensureVariableExists(
          "addTask",
          "function",
          iframe,
        )();
        var button = li.querySelector("button");
        li.remove();
        if (!button) {
          throw new Error("Look at lines 18 and 19 for an example.");
        }
      },
    },
  ]);
  var prepend = {
    html: '<script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js"></\script>',
  };
</script>

<svelte:head>
  <title>Todo List Project</title>
</svelte:head>

<div class="p-4 h-screen">
  <div class="flex gap-3">
    <div class="w-1/3 max-h-screen overflow-y-auto pb-6">
      <h2 class="text-xl font-bold mb-2 mt-3">The Todo List Project</h2>
      <p class="mb-2">
        One of the classic projects for student software developers is to build
        a humble todo list application. In this project, you will start with a
        mostly-working todo list app and make modifications to fix bugs and add
        features.
      </p>
      <p class="mb-4">
        Start by playing with the application. Type some things in the box,
        click on the <code>Add</code> button, and check the boxes. Once you've familiarized
        yourself with it, complete the following exercises.
      </p>
      <hr class="mb-4 border-gray-200" />
      {#each questions as question, i}
        {#if question.type === "mc"}
          <Question
            stateId={question.stateId}
            width="w-full"
            class="mt-4 mb-4"
            options={question.options}><p>{@html question.text}</p></Question
          >
        {:else}
          <BaseQuestion class="mt-4 mb-4" validate={question.validate}
            ><p>{@html question.text}</p></BaseQuestion
          >
        {/if}
      {/each}
    </div>
    <div class="w-2/3 h-full max-h-screen editor">
      <Editor
        {prepend}
        class="pb-4"
        stateId="todolist"
        initial={template}
        tabs={["html", "js", "css"]}
        bind:inputs
        bind:iframe
        {tooltips}
      />
    </div>
  </div>
</div>

<style>
  .editor {
    --editor-height: 480px;
  }
</style>
