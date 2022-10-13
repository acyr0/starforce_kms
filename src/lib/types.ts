export type Config = {
  item_level: number;
  item_from_star: number;
  item_to_star: number;
  replacement_cost: number;
  safeguard: boolean;
  event_thirty_off: boolean;
  event_five_ten: boolean;
  event_no_boom: boolean;
  event_one_plus_one: boolean;
  mvp_discount: number;
  starcatch: number[];
};

export const DEFAULT_CONFIG: Config = {
  item_level: 150,
  item_from_star: 10,
  item_to_star: 17,
  replacement_cost: 0,
  safeguard: false,
  event_thirty_off: false,
  event_five_ten: false,
  event_no_boom: false,
  event_one_plus_one: false,
  mvp_discount: 0,
  starcatch: [],
};

export const make_config = (obj: any): Config => {
  let ret = { ...DEFAULT_CONFIG };
  for (let key of Object.getOwnPropertyNames(DEFAULT_CONFIG)) {
    if (obj.hasOwnProperty(key)) {
      // Actually have to validate that `mvp_discount` is a valid value.
      if (key === "mvp_discount") {
        if (["0", "0.03", "0.05", "0.1"].includes(obj[key])) {
          ret[key] = Number(obj[key]);
        } else {
          ret[key] = DEFAULT_CONFIG[key];
        }
      } else if (typeof DEFAULT_CONFIG[key] === "boolean" && ["false", "true"].includes(obj[key])) {
        ret[key] = Boolean(obj[key]);
      } else if (typeof DEFAULT_CONFIG[key] === "number" && !isNaN(obj[key])) {
        ret[key] = Number(obj[key]);
      } else if (typeof DEFAULT_CONFIG[key] === "object") {
        // Do nothing, the only object is `starcatch`, which we manually construct.
        ret[key] = obj[key];
      } else {
        ret[key] = DEFAULT_CONFIG[key];
      }
    }
  }
  return ret as Config;
};
