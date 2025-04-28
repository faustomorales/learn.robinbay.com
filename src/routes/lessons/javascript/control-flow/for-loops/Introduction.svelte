<script lang="ts">
  import AnnotatedCodeV2 from "$lib/components/AnnotatedCodeV2.svelte";
</script>

<p>
  Loops are handy, if you want to run the same code over and over again, each
  time with a different value. That means that instead of doing this:
</p>

<AnnotatedCodeV2 language="js" code={`
circle(0, 0);
circle(10, 0);
`} />

<p>You can do this:</p>

<AnnotatedCodeV2 language="js" code={`for`} />

