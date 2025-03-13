import type { Config } from "./types";
import { MAX_STARS } from "./types";

// Per official KMS site.
const STARCATCH_MULTI = 1.05;

// These are (success chance, boom chance given no success).
const PROBABILITIES: { [star: number]: [number, number] } = {
  0: [0.95, 0],
  1: [0.9, 0],
  2: [0.85, 0],
  3: [0.85, 0],
  4: [0.8, 0],
  5: [0.75, 0],
  6: [0.7, 0],
  7: [0.65, 0],
  8: [0.6, 0],
  9: [0.55, 0],
  10: [0.5, 0],
  11: [0.45, 0],
  12: [0.4, 0],
  13: [0.35, 0],
  14: [0.3, 0],
  15: [0.3, 0.03],
  16: [0.3, 0.03],
  17: [0.15, 0.08],
  18: [0.15, 0.08],
  19: [0.15, 0.1],
  20: [0.3, 0.15],
  21: [0.15, 0.15],
  22: [0.15, 0.2],
  23: [0.1, 0.2],
  24: [0.1, 0.2],
  25: [0.1, 0.2],
  26: [0.07, 0.2],
  27: [0.05, 0.2],
  28: [0.03, 0.2],
  29: [0.01, 0.2],
};

// Starforce cost KMST.
const COST: { [star: number]: (level: number) => number } = {
  0: (level) => 100 * Math.round(10 + (level ** 3 * 1) / 2500),
  1: (level) => 100 * Math.round(10 + (level ** 3 * 2) / 2500),
  2: (level) => 100 * Math.round(10 + (level ** 3 * 3) / 2500),
  3: (level) => 100 * Math.round(10 + (level ** 3 * 4) / 2500),
  4: (level) => 100 * Math.round(10 + (level ** 3 * 5) / 2500),
  5: (level) => 100 * Math.round(10 + (level ** 3 * 6) / 2500),
  6: (level) => 100 * Math.round(10 + (level ** 3 * 7) / 2500),
  7: (level) => 100 * Math.round(10 + (level ** 3 * 8) / 2500),
  8: (level) => 100 * Math.round(10 + (level ** 3 * 9) / 2500),
  9: (level) => 100 * Math.round(10 + (level ** 3 * 10) / 2500),
  10: (level) => 100 * Math.round(10 + (level ** 3 * 11 ** 2.7) / 40000),
  11: (level) => 100 * Math.round(10 + (level ** 3 * 12 ** 2.7) / 22000),
  12: (level) => 100 * Math.round(10 + (level ** 3 * 13 ** 2.7) / 15000),
  13: (level) => 100 * Math.round(10 + (level ** 3 * 14 ** 2.7) / 11000),
  14: (level) => 100 * Math.round(10 + (level ** 3 * 15 ** 2.7) / 7500),
  15: (level) => 100 * Math.round(10 + (level ** 3 * 16 ** 2.7) / 20000),
  16: (level) => 100 * Math.round(10 + (level ** 3 * 17 ** 2.7) / 20000),
  17: (level) => 100 * Math.round(10 + (level ** 3 * 18 ** 2.7) / 15000),
  18: (level) => 100 * Math.round(10 + (level ** 3 * 19 ** 2.7) / 7000),
  19: (level) => 100 * Math.round(10 + (level ** 3 * 20 ** 2.7) / 4500),
  20: (level) => 100 * Math.round(10 + (level ** 3 * 21 ** 2.7) / 20000),
  21: (level) => 100 * Math.round(10 + (level ** 3 * 22 ** 2.7) / 12500),
  22: (level) => 100 * Math.round(10 + (level ** 3 * 23 ** 2.7) / 20000),
  23: (level) => 100 * Math.round(10 + (level ** 3 * 24 ** 2.7) / 20000),
  24: (level) => 100 * Math.round(10 + (level ** 3 * 25 ** 2.7) / 20000),
  25: (level) => 100 * Math.round(10 + (level ** 3 * 26 ** 2.7) / 20000),
  26: (level) => 100 * Math.round(10 + (level ** 3 * 27 ** 2.7) / 20000),
  27: (level) => 100 * Math.round(10 + (level ** 3 * 28 ** 2.7) / 20000),
  28: (level) => 100 * Math.round(10 + (level ** 3 * 29 ** 2.7) / 20000),
  29: (level) => 100 * Math.round(10 + (level ** 3 * 30 ** 2.7) / 20000),
};

export const DEFAULT_VALUES = {
  event_thirty_off: false,
  event_destruction: false,
  starcatch: [],
  mvp_discount: 0,
};

// Compile error if we add new fields to `Config` and forget to add them to `DEFAULT_VALUES` above.
(): Config => {
  return {
    item_level: 150,
    item_from_star: 12,
    item_to_star: 17,
    replacement_cost: 0,
    safeguard: false,
    ...DEFAULT_VALUES,
  };
};

const cost_and_odds = (config: Config, star: number) => {
  let c = COST[star](config.item_level) * (config.event_thirty_off ? 0.7 : 1);
  if (star < 17) {
    c *= 1 - config.mvp_discount;
  }

  const [success_chance, boom_chance_given_no_success] = PROBABILITIES[star];
  let s = success_chance * (config.starcatch.includes(star) ? STARCATCH_MULTI : 1);
  let d: number;
  if (config.safeguard && star >= 15 && star < 18) {
    c += 2 * COST[star](config.item_level);
    d = 0;
  } else {
    d = (1 - s) * boom_chance_given_no_success;
  }

  if (config.event_destruction && star <= 21) {
    d *= 0.7;
  }

  return [c, s, d];
};

const expected_cost_to_next = (config: Config, star: number, prior_costs: number[]) => {
  const [c, s, d] = cost_and_odds(config, star);

  let F = 0;
  for (let i = 12; i < star; i++) {
    F += prior_costs[i];
  }

  return (c + d * (F + config.replacement_cost)) / s;
};

const expected_booms_to_next = (config: Config, star: number, prior_booms: number[]) => {
  const [_c, s, d] = cost_and_odds(config, star);

  let F = 0;
  for (let i = 12; i < star; i++) {
    F += prior_booms[i];
  }

  return (d * (1 + F)) / s;
};

const prob_success_to_next = (config: Config, star: number, prior_prob_success: number[]) => {
  // Intuitively, the value we want to compute is:
  //     sum P(success from current star) * P(return to current star without booming) ^ n
  //     n = 0 to infinity
  // Because this is a geometric sum that always converges with the values we have, we easily have a
  // closed form of:
  //     P(success from current star) / (1 - P(return to current star without booming))
  const [_c, s, d] = cost_and_odds(config, star);

  return s / (s + d);
};

export type Result = {
  cost: number;
  booms: number;
  prob_success: number;
};

export const expected_from_config = (config: Config): Result => {
  let cost_to_next_star: number[] = [];
  let booms_to_next_star: number[] = [];
  let prob_success_to_next_star: number[] = [];
  for (let i = 0; i < MAX_STARS; i++) {
    cost_to_next_star[i] = expected_cost_to_next(config, i, cost_to_next_star);
    booms_to_next_star[i] = expected_booms_to_next(config, i, booms_to_next_star);
    prob_success_to_next_star[i] = prob_success_to_next(config, i, prob_success_to_next_star);
  }

  let cost = 0;
  let booms = 0;
  let prob_success = 1;
  for (let i = config.item_from_star; i < config.item_to_star; i++) {
    cost += cost_to_next_star[i];
    booms += booms_to_next_star[i];
    prob_success *= prob_success_to_next_star[i];
  }

  return { cost, booms, prob_success };
};
