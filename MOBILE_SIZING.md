# Mobile sizing changes: Competition Details screen

**Problem.** The reference design (`reference/original-design.png`, 390×844) squeezes a long, scrolling screen into one phone-height image. At 1:1 on a real phone, the text is 5–15pt, the icons are 8–12pt and the tap targets are 14–28pt. All of these fall below the iOS and Android minimums (about 11pt for text and 44pt for tap targets).

**Fix.** Keep the design's order, colours, hierarchy and look. Enlarge type, icons and spacing by roughly **1.6×**, and let the screen **scroll**. The screen stays one screen wide (390pt), so a few rows that were side by side must wrap or stack. Those rows are listed in §4.

This file updates §1 and §2 of `HANDOFF.md`. Wherever the two differ, this file wins. Mention the change as a design decision in the README: "Scaled type and targets to platform minimums; the design image is a compressed full-page capture."

---

## 1. Global rules

| Rule | Value |
|---|---|
| Side gutter | 16pt (was 18px) |
| Card inner padding | 16pt (was 9–12) |
| Gap between cards | 12pt (was 4–7) |
| Card radius | 12pt (was 8); strips and inputs 8pt |
| Card border / shadow | Unchanged (1px `#EEF0F3`, very soft shadow) |
| Minimum text size | 11pt, and only for captions and labels. Body text is at least 13pt. |
| Minimum tap target | 44×44pt. Use `hitSlop` where the visible shape is smaller. |
| Fixed heights | **Remove them.** Every card sizes to its content. The px heights in HANDOFF §2 only described the reference image. |
| Scrolling | `ScrollView`/`FlatList` between the header and the sticky CTA. The sticky CTA and bottom nav respect `SafeAreaView` insets. |
| Dynamic Type | Keep `allowFontScaling` on. Set `maxFontSizeMultiplier={1.3}` on dense rows (dates grid, rewards, nav labels) so large accessibility sizes don't break them. |
| Font | Poppins, unchanged. Weights: 400 body, 500 labels, 600 titles, 700 numbers and headings. |

## 2. Type scale (design px → mobile pt)

| Token | Design px | **Mobile pt** / line height | Used for |
|---|---|---|---|
| `display` | 21 | **30** / 36, 700 | Prize pool "₹ 1,500" |
| `amountLg` | 16.5 | **24** / 30, 700 | Entry fee "₹ 99" |
| `title` | 14.5 | **20** / 26, 700 | "Feedants Classical Dance" |
| `timer` | 10–11.5 | **18** / 24, 700 | Countdown "01d : 06h : 28m : 32s" |
| `name` | 10.5 | **16** / 22, 700 | Judge name |
| `section` | 7–7.5 bold | **15** / 22, 600 | Section headings: Important Dates, Previous Winners, Rewards, Refer & Earn, Hear From Our Users |
| `button` | 8 | **16** / 22, 600 | CTA title "Upload Submission" |
| `bodyStrong` | 7–8 semibold | **14** / 20, 600 | Reward labels, date values, "Only 19 spots left", tab labels, "Registration closes in" |
| `amount` | 8 | **15** / 20, 700 | Reward amounts "₹ 550" |
| `body` | 6–6.5 | **13** / 20, 400 | About text, judge subtitle lines, disclaimer, trust rows |
| `label` | 6–6.5 | **12** / 16, 400–500 | "Prize Pool", "Entry Fee", "Judge", date labels, "1 / 20 Booked", chips |
| `caption` | 5–5.5 | **11** / 14, 400–500 | Winner name and role, CTA sub-line, "You earn ₹10…", nav labels, "Watch video to know more" |

## 3. Icons, images and controls

| Element | Design px | **Mobile pt** | Notes |
|---|---|---|---|
| Back arrow | 14 | **24** icon, 44 target | "Go back" moves to `section` 16/600 |
| Language toggle | 64×24 | **88×36** (each pill 42×32) | ENG 12/700, हिंदी 13/500 |
| Registered badge | 16h, 10 icon | **28h**, 16 icon, 12/600 text | Pad 6×10, radius 8 |
| Tag chips | 6px text | **12pt** text, 26h | Pad 4×10 |
| Certificate / people / info icons | 8–10 | **16** | |
| Section icons (dates, rewards, shield, chat, ad) | 10–12 | **20** | Stroke width 1.75 |
| Countdown hourglass / stopwatch | 8–12 | **20** | |
| Spots progress bar | 3 | **6** tall, radius 3 | |
| Judge avatar | 43 | **64** | |
| Intro-video play button | 28 | **44** circle, 16 triangle | "Intro Video" `caption` |
| Winner thumbnail | 42 | **72** square, radius 10 | Play badge 14 → **24** with a 2pt white ring |
| Prize-money play block | 26×27 | **48×48**, radius 10, inner circle 28 | |
| Reward icons (trophy, medals, stars) | 10 | **22** | |
| Megaphone (Refer) | 26×20 | **40×32** | |
| Referral input / Copy Link | 15h, 5px text | **44h**, 13pt text | radius 8 |
| Refer Now button | 16h | **44h**, full width, 15/600 | |
| Chevron right (Hear From Our Users) | 8 | **20** | Whole row is the tap target, min 56h |
| Ad slot | 22h | **64h** (fits a 320×50 banner + padding) | |
| Sticky CTA | 24h | **56h**, radius 12 | Title 16/600, sub-line 11 |
| Bottom nav | 30h, 12 icons | **64h** + bottom inset, **24** icons | Centre + button 28 → **52** square, radius 14. Profile avatar 14 → **26** |

## 4. Layout changes (rows that no longer fit side by side)

1. **Competition card.** Row 1: title + Registered badge. The badge moves under the title if the title wraps. Row 2: tag chips + certificate line, wrapping allowed. Row 3: **Prize Pool | Entry Fee** as two columns. Row 4: the **spots block runs full width**: people icon + "Only 19 spots left" on the left, "1 / 20 Booked" on the right, 6pt bar below.
2. **Judge card.** Unchanged structure: avatar | text column (flex 1) | play button column. Subtitle lines may wrap.
3. **Countdown strip.** A single line no longer fits. Use **two lines**. Left: hourglass + "Registration closes in" (`bodyStrong`), with the timer below in `timer` style. Right: stopwatch + "Hurry up!" chip, vertically centred. Strip padding 12×16, radius 12.
4. **Important Dates.** Keep the 2×2 grid. Each cell is left-aligned: icon on top or left, then label / date / time stacked. Cell padding 12. The grid needs about 170pt per cell. Below 340pt of content width (small phones), fall back to one column.
5. **Previous Winners.** A horizontal `FlatList` of tiles about 180pt wide: thumbnail 72 + text column. About 2 tiles are visible, and the rest scroll into view (the design's clipped fourth tile becomes a scroll hint). Use `snapToInterval`.
6. **Tabs.** The three labels at 14pt are about 360pt wide and don't fit. Use a **horizontally scrollable tab bar**, or `flex: 1` tabs at 13pt with `numberOfLines={1}` and `adjustsFontSizeToFit`. Scrolling is preferred. The active underline becomes 2pt. Body text is `body` 13/20. "View more" is `bodyStrong` in primary colour with a 44pt tap target.
7. **Rewards.** Rows 16 → **44pt** tall: icon 22 | label | amount right-aligned. Hairline dividers between rows are optional.
8. **Disclaimer.** Wraps to 2 lines. The info icon is top-aligned.
9. **Prize money / trust card.** **Stack vertically.** Top: the play block + "How will you receive prize money?" + caption, as one tappable row. A horizontal divider follows. Bottom: the two shield rows, "Refund policy" and "Secure payments powered by [Razorpay]", each 13pt with 20pt icons.
10. **Refer & Earn.** **Stack.** Row 1: megaphone + "Refer & Earn more discount". Row 2: referral input (flex 1) + "Copy Link" button (about 96w), both 44h. Row 3: "Refer Now", full width, 44h. Row 4: "You earn ₹10 for every signup" (`caption`, centred).
11. **Hear From Our Users.** One row, min 56h: chat icon 20 | title + subtitle | chevron.
12. **Sticky CTA + nav.** The CTA sits above the nav, with 12pt margin, a white background and a top shadow. Add the scroll view's bottom padding so the last card clears the CTA (56 + 12 + nav height).

## 5. Bottom sheets and modals (prototype)

- Sheet titles 20/700, body 14, rows 48h. Buttons 52h, radius 12. Grab handle 40×4.
- Video modal: 16:9, full width minus 32. Close button 44×44.
- Toast: 14pt text, pad 12×20, placed 16pt above the CTA.

## 6. React Native tokens (drop-in)

```ts
// theme/tokens.ts
export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 };
export const radius = { sm: 8, md: 12, lg: 14, pill: 999 };

export const font = {
  display:    { fontFamily: 'Poppins_700Bold',     fontSize: 30, lineHeight: 36 },
  amountLg:   { fontFamily: 'Poppins_700Bold',     fontSize: 24, lineHeight: 30 },
  title:      { fontFamily: 'Poppins_700Bold',     fontSize: 20, lineHeight: 26 },
  timer:      { fontFamily: 'Poppins_700Bold',     fontSize: 18, lineHeight: 24 },
  name:       { fontFamily: 'Poppins_700Bold',     fontSize: 16, lineHeight: 22 },
  section:    { fontFamily: 'Poppins_600SemiBold', fontSize: 15, lineHeight: 22 },
  button:     { fontFamily: 'Poppins_600SemiBold', fontSize: 16, lineHeight: 22 },
  amount:     { fontFamily: 'Poppins_700Bold',     fontSize: 15, lineHeight: 20 },
  bodyStrong: { fontFamily: 'Poppins_600SemiBold', fontSize: 14, lineHeight: 20 },
  body:       { fontFamily: 'Poppins_400Regular',  fontSize: 13, lineHeight: 20 },
  label:      { fontFamily: 'Poppins_500Medium',   fontSize: 12, lineHeight: 16 },
  caption:    { fontFamily: 'Poppins_400Regular',  fontSize: 11, lineHeight: 14 },
} as const;

export const icon = { xs: 16, sm: 20, md: 24, lg: 44 };
export const hit = 44; // minimum touch target
```

Colours stay exactly as in HANDOFF §1.

## 7. Checklist

- [ ] No `fontSize` below 11 anywhere (grep for it).
- [ ] Every pressable is at least 44×44 (or uses `hitSlop`).
- [ ] No hardcoded card heights. Content sizes itself.
- [ ] Checked on a small phone (iPhone SE, 375×667) and a large one (Pixel 8 Pro). Nothing clips or overlaps, and the tabs and winners scroll horizontally.
- [ ] Checked with the system font size at maximum: the dense rows cap at 1.3× and still read correctly.
- [ ] Side-by-side with the design image: same section order, colours, icon choices and hierarchy. Only the size and the reflows in §4 differ.
