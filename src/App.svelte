<script lang="ts">
  import Inputs from "./lib/Inputs.svelte";
  import Result from "./lib/Result.svelte";
  import Router from "./lib/Router.svelte";
  import type { Config } from "./lib/types";
  import { DEFAULT_CONFIG } from "./lib/types";

  let config: Config = { ...DEFAULT_CONFIG };
</script>

<Router bind:config />
<main>
  <h1><span class="starforce">★ Starforce</span> Calc <sup class="kmst">(kmst)</sup></h1>

  <Inputs bind:config />
  <Result bind:config />
</main>

<style lang="postcss">
  @tailwind utilities;

  h1 {
    user-select: none;
  }

  .starforce {
    @apply text-amber-400;
    @apply font-medium;
  }

  .kmst {
    @apply text-red-400;
  }
</style>
