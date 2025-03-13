<script lang="ts">
  import type { Config } from "./types";
  import { MAX_STARS } from "./types";

  export let config: Config;

  const reject_non_numeric = (e: InputEvent) => {
    if (e.data) {
      if (/[^0-9]/.test(e.data)) {
        e.preventDefault();
      }
    }
  };

  let drag_start: number | null = null;
  let drag_end: number | null = null;

  const between = (a: number | null, b: number | null, x: number) => {
    if (a === x || b === x) {
      return true;
    }

    if (a === null || b === null) {
      return false;
    }
    let [start, end] = a < b ? [a, b] : [b, a];
    return x >= start && x <= end;
  };
  const starcatch_enabling = (star: number) => !config.starcatch.includes(star);
  const starcatch_drag_start = (star: number) => (e: PointerEvent) => {
    drag_start = star;
    const target = e.target as HTMLElement;
    target.releasePointerCapture(e.pointerId);
  };
  const starcatch_drag_continue = (star: number) => () => {
    if (drag_start != null) {
      drag_end = star;
    }
  };
  const starcatch_drag_cancel = () => {
    drag_end = null;
  };
  const starcatch_drag_commit = () => {
    if (drag_start != null && drag_end != null && drag_start !== drag_end) {
      let new_starcatch = [];
      for (let i = 10; i < MAX_STARS; i++) {
        if (between(drag_start, drag_end, i)) {
          if (starcatch_enabling(drag_start)) {
            new_starcatch.push(i);
          }
        } else if (config.starcatch.includes(i)) {
          new_starcatch.push(i);
        }
      }
      config.starcatch = new_starcatch;
    }
    drag_start = drag_end = null;
  };
</script>

<fieldset>
  <legend><span>Item info</span></legend>

  <div class="inputs item-info">
    <label class="numeric level">
      <span>Level</span>
      <input
        type="number"
        placeholder="#"
        on:beforeinput={reject_non_numeric}
        bind:value={config.item_level}
      />
    </label>

    <span class="inputs-group">
      <label class="numeric from-stars">
        <input
          type="number"
          placeholder="#"
          on:beforeinput={reject_non_numeric}
          bind:value={config.item_from_star}
        />
        <span>stars</span>
      </label>

      <span>⟩</span>

      <label class="numeric to-stars">
        <input
          type="number"
          placeholder="#"
          on:beforeinput={reject_non_numeric}
          bind:value={config.item_to_star}
        />
        <span>stars</span>
      </label>
    </span>

    <label class="numeric replacement-cost">
      <span>Replacement cost</span>
      <input
        type="number"
        placeholder="#"
        on:beforeinput={reject_non_numeric}
        bind:value={config.replacement_cost}
      />
    </label>

    <label class="button" class:checked={config.safeguard}>
      <input type="checkbox" bind:checked={config.safeguard} />
      <span>Safeguard</span>
    </label>
  </div>
</fieldset>

<fieldset>
  <legend><span>Events</span></legend>

  <div class="inputs">
    <label class="button" class:checked={config.event_thirty_off}>
      <input type="checkbox" bind:checked={config.event_thirty_off} />
      <span>30% off</span>
    </label>

    <label class="button" class:checked={config.event_destruction}>
      <input type="checkbox" bind:checked={config.event_destruction} />
      <span>-30% boom ≤21</span>
    </label>
  </div>
</fieldset>

<fieldset>
  <legend><span>MVP Discount</span></legend>

  <div class="inputs">
    <label class="button" class:checked={config.mvp_discount === 0}>
      <input type="radio" bind:group={config.mvp_discount} value={0} />
      <span>None</span>
    </label>

    <label class="button" class:checked={config.mvp_discount === 0.03}>
      <input type="radio" bind:group={config.mvp_discount} value={0.03} />
      <span>Silver</span>
    </label>

    <label class="button" class:checked={config.mvp_discount === 0.05}>
      <input type="radio" bind:group={config.mvp_discount} value={0.05} />
      <span>Gold</span>
    </label>

    <label class="button" class:checked={config.mvp_discount === 0.1}>
      <input type="radio" bind:group={config.mvp_discount} value={0.1} />
      <span>Diamond+</span>
    </label>
  </div>
</fieldset>

<fieldset on:pointerleave={starcatch_drag_cancel}>
  <legend>
    <span>Starcatch</span>
    <span class="help">(click and drag)</span>
  </legend>

  <div class="inputs">
    {#each { length: MAX_STARS - 12 } as _, star}
      <label
        class="button draggable"
        class:checked={config.starcatch.includes(star + 12)}
        class:disabling={!starcatch_enabling(drag_start)}
        class:active={between(drag_start, drag_end, star + 12)}
        on:pointerdown={starcatch_drag_start(star + 12)}
        on:pointerenter={starcatch_drag_continue(star + 12)}
      >
        <input type="checkbox" bind:group={config.starcatch} value={star + 12} />
        <span>
          {star + 12}
        </span>
      </label>
    {/each}
  </div>
</fieldset>

<svelte:window on:pointerup={starcatch_drag_commit} />

<style lang="postcss">
  @tailwind utilities;

  fieldset {
    @apply py-3;
    @apply my-6;
    @apply lg:border-l lg:border-slate-600;

    user-select: none;

    position: relative;

    legend {
      @apply lg:absolute;
      @apply lg:px-3;
      right: 100%;

      top: 0;
      bottom: 0;
      display: flex;
      @apply items-baseline gap-x-1 lg:flex-col lg:items-end lg:justify-center;

      span {
        @apply text-slate-600;
        @apply text-2xl;
        font-weight: 500;
        white-space: nowrap;

        &.help {
          @apply text-sm;
          font-weight: 300;
        }
      }
    }

    .inputs {
      @apply lg:px-3;
      display: flex;
      place-items: baseline center;
      flex-wrap: wrap;
      @apply gap-x-2 gap-y-2;

      &.item-info {
        justify-content: space-between;
      }

      .inputs-group {
        display: flex;
        place-items: baseline center;
        @apply gap-x-2;
      }
    }
  }

  label {
    @apply py-1.5;
    @apply border-b-4 border-slate-600;
    transition: background-color ease-out 0.3s, border-color ease-out 0.3s;

    &:hover {
      @apply border-slate-400;
    }
  }

  label.button {
    @apply px-3;
    cursor: pointer;
    touch-action: none;

    &:focus-within {
      @apply bg-slate-700;
    }

    &.checked {
      @apply font-medium;
      @apply border-amber-400;
    }

    &:not(.draggable):active,
    &.active {
      transition: none;
      @apply font-medium;
      @apply bg-amber-400;
      @apply border-slate-50;
    }

    &.checked:not(.draggable):active,
    &.active.disabling {
      @apply font-light;
      @apply text-slate-900;
      @apply bg-slate-50;
      @apply border-none;
    }

    input[type="checkbox"],
    input[type="radio"] {
      @apply sr-only;
    }
  }

  label.numeric {
    &:focus-within {
      @apply border-slate-50;
    }

    input[type="number"] {
      @apply bg-transparent;
      @apply font-medium;
      text-align: right;
    }

    &.level input {
      @apply ml-1;
      @apply w-8;
    }

    &.from-stars input {
      @apply mr-1;
      @apply w-6;
    }

    &.to-stars input {
      @apply mr-1;
      @apply w-6;
    }

    &.replacement-cost input {
      @apply ml-1;
      @apply w-32;
    }
  }
</style>
