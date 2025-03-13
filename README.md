# starforce calculator

This is an analytical starforce calculator for post-Savior starforce costs,
based on the math from https://amph.shinyapps.io/starforce.

This came about from a personal desire to have a starforce calculator that was
correct, fast, and up-to-date.
  - Starcatch is 1.05x multiplicative on success chance.
  - MVP discount is multiplicative, and applies on all stars up to and
      including 16* to 17*.
  - Safeguard increases the cost per star by the base cost before any discounts.

If you want to check the math, you can take a look at
[src/lib/calcs.ts](src/lib/calcs.ts).

I don't claim to be an expert on probability or statistics, so its pretty
unlikely that I'll be able to add additional features in that realm. Where the
results here differ from the results you see in other calculators though, I'm
reasonably confident that the results here are correct.

Feel free to open issues in this project if you believe there are any mistakes,
although I can't promise I'll answer them super quickly.

@cary on Discord, `aCyr` in GMS Reboot

# Changelog

## 2025-03-13

Added new KMS starforce system from KMST.

## 2023-06-13

Updated starforce calculations for GMS Savior

### Added

  - Compute probability of success before booming
  - Cost calculation for stars below 10

### Changed

  - Cost calculations updated for GMS Savior.
  - Only allow starcatching on 12+ to reduce the number of buttons. Breaking
      change for old URLs.

### Removed

  - 12-15 no boom, as that is no longer relevant
  - No-starcatch no-event computations, as that was frequently a source of
      confusion

## 2022-11-19

Updated starforce costs for GMS Ignition

### Changed

  - Use `PointerEvent` instead of `MouseEvent` to support dragging on touch devices
  - Improved text wrapping in results section on smaller screens

## 2022-10-13

Initial release
