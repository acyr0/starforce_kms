<script lang="ts">
  import qs from "qs";
  import UrlPattern from "url-pattern";

  import type { Config } from "./types";
  import { MAX_STARS } from "./types";
  import { DEFAULT_CONFIG, make_config } from "./types";

  export let config: Config;

  const PATTERN = new UrlPattern("/:level/:from/:to/");

  const deserialize = (ser: string) => {
    let [url, query] = ser.split("?");

    let url_parts = null;
    let match = PATTERN.match(url);
    if (match != null) {
      url_parts = {
        item_level: match.level,
        item_from_star: match.from,
        item_to_star: match.to,
      };
    }

    let opts = qs.parse(query);
    if ("starcatch" in opts && typeof opts["starcatch"] === "string") {
      let packed: string = opts["starcatch"];

      let starcatch = [];
      for (let i = 12; i < MAX_STARS; i++) {
        if (packed.charAt(i - 12) === "1") {
          starcatch.push(i);
        }
      }
      opts["starcatch"] = starcatch;
    } else {
      delete opts["starcatch"];
    }
    let ret = { ...opts, ...url_parts };
    return make_config(ret);
  };

  const serialize = (config: Config) => {
    let { item_level, item_from_star, item_to_star, starcatch, ...rest } = config;

    // Remove default values.
    for (let [k, v] of Object.entries(rest)) {
      if (DEFAULT_CONFIG[k] === v) {
        delete rest[k];
      }
    }

    // Add starcatch as a bitmap.
    if (starcatch.length > 0) {
      let bitmap = [];
      for (let i = 12; i < MAX_STARS; i++) {
        bitmap.push(starcatch.includes(i) ? 1 : 0);
      }
      rest["starcatch"] = bitmap.join("");
    }
    return `/${item_level}/${item_from_star}/${item_to_star}/?${qs.stringify(rest)}`;
  };

  const load_config = () => {
    try {
      config = deserialize(window.location.hash.slice(1));
    } catch (e) {
      config = { ...DEFAULT_CONFIG };
    }
  };

  const store_config = (config: Config) => {
    let url = new URL(window.location.href);
    url.hash = `#${serialize(config)}`;
    window.history.replaceState({}, "", url);
  };

  load_config();
  $: store_config(config);
</script>

<svelte:window on:hashchange={load_config} />
