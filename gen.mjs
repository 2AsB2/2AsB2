// Generates the profile SVGs in assets/. Run: node gen.mjs
import { writeFileSync, readFileSync } from "node:fs";

// sketchbook palette: paper, ink, one cobalt accent, two quiet supports
const LIGHT = { paper: "#F1EBDF", sand: "#E2D7C3", ink: "#26221E", muted: "#6F665A", cobalt: "#2E4C8F", cobaltDeep: "#1F3566", terra: "#A9502B", olive: "#5F6B3A", onSpine: "#F1EBDF" };
const DARK = { paper: "#1C1A17", sand: "#2E2A24", ink: "#EDE6D8", muted: "#A39A8C", cobalt: "#7C9BE0", cobaltDeep: "#5272BD", terra: "#D9845C", olive: "#A3AF74", onSpine: "#1C1A17" };
const SPRITE = "#16130F"; // sprite outlines stay dark in both themes so the white ermine reads
let C = LIGHT;
const SANS = `-apple-system,'Segoe UI',Helvetica,Arial,sans-serif`;
const NOMOTION = `@media (prefers-reduced-motion:reduce){*{animation:none!important}}`;
const svg = (w, h, style, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><style>${style}${NOMOTION}</style><rect width="${w}" height="${h}" rx="10" fill="${C.paper}"/>${body}</svg>`;

// Draw a pixel grid: each char maps to a color, "." is empty.
function pixels(rows, x0, y0, s, palette, attrs = "") {
  let out = "";
  rows.forEach((row, y) => [...row].forEach((ch, x) => {
    if (ch !== ".") out += `<rect x="${x0 + x * s}" y="${y0 + y * s}" width="${s}" height="${s}" fill="${palette[ch]}"/>`;
  }));
  return `<g shape-rendering="crispEdges" ${attrs}>${out}</g>`;
}

// Pad a sprite by one cell and ring it with "o" (ink outline). Shifts the sprite by +1,+1.
function outline(rows) {
  const w = rows[0].length + 2, g = [".".repeat(w), ...rows.map((r) => `.${r}.`), ".".repeat(w)];
  const filled = (x, y) => g[y]?.[x] !== undefined && g[y][x] !== ".";
  return g.map((r, y) => [...r].map((ch, x) => ch !== "." ? ch : (filled(x - 1, y) || filled(x + 1, y) || filled(x, y - 1) || filled(x, y + 1)) ? "o" : ".").join(""));
}

const FONT = {
  A: [".###.", "#...#", "#...#", "#####", "#...#", "#...#", "#...#"],
  N: ["#...#", "##..#", "##..#", "#.#.#", "#..##", "#..##", "#...#"],
  G: [".####", "#....", "#....", "#.###", "#...#", "#...#", ".###."],
  E: ["#####", "#....", "#....", "####.", "#....", "#....", "#####"],
};
const word = (text, x, y, s) => [...text].map((ch, i) => pixels(FONT[ch], x + i * 7 * s, y, s, { "#": C.ink })).join("");

// Typewriter line: a clip rect slides open in steps.
function typed(id, text, x, y, size, color, delay, extra = "") {
  const w = Math.ceil(text.length * size * 0.58) + 20, n = text.length;
  return `<style>#${id} rect{animation:${id} ${(n * 0.045).toFixed(2)}s steps(${n}) ${delay}s both}@keyframes ${id}{from{transform:translateX(-${w}px)}}</style>` +
    `<clipPath id="${id}"><rect x="${x}" y="${y - size - 4}" width="${w}" height="${size + 10}"/></clipPath>` +
    `<text clip-path="url(#${id})" x="${x}" y="${y}" font-size="${size}" fill="${color}" font-family="${SANS}">${text}${extra}</text>`;
}

// ---------- hero: ermine with pixel glasses and a blue scarf, swaying gently ----------
const ERMINE = [
  ".w............w.",
  ".ww..........ww.",
  ".wpw........wpw.",
  ".wwwwwwwwwwwwww.",
  ".wwGGGwwwwGGGww.",
  ".wGwwwGGGGwwwGw.",
  ".wGwkwGwwGwkwGw.",
  "..GwwwGwwGwwwG..",
  "..wGGGwwwwGGGw..",
  "..wwwwwwwwwwww..",
  "...wwwwwwwwww...",
  "...wwwwwwwwww...",
  "....wwwwwwww....",
  "...bbbbbbbbbb...",
  "..bbBbbbbbbbBb..",
  "...bbbbbbbbbb...",
  "...wwwwwwwwbBw..",
  "..w.wwwwwwwbB.w.",
  ".ww.wwwwwwwwb.ww",
  "....wwwwwwww....",
  "....wwwwwwww....",
  "....wwwwwwww....",
  "....wwwwwwww....",
  "....wwwwwwww....",
  "....wwwwwwww....",
  "....wwwwwwww....",
  "....wwwwwwww..k.",
  "....wwwwwwww..w.",
  "....wwwwwwwwww..",
  ".....wwwwww.....",
  ".....ss..ss.....",
];
// idle frame B: head and scarf drop one row (a body row is removed) and the tail tip flicks out
const frameB = (rows) => { const r = rows.slice(); r.splice(25, 1); r.unshift(".".repeat(16)); return r.map((x) => x === "....wwwwwwww..k." ? "....wwwwwwww...k" : x); };
const ermine = outline(ERMINE), ermineB = outline(frameB(ERMINE));
const erminePal = () => ({ o: SPRITE, w: "#FFFFFF", p: "#D9546A", s: "#D8CFBF", k: SPRITE, G: SPRITE, b: C.cobalt, B: C.cobaltDeep });
const ES = 7, EX = 84, EY = 22;
// eyes at sprite (4,6) and (11,6); mole() also draws the small ^ mouth; +1,+1 from the outline padding
const eyes = (dy) => `<g class="eye" shape-rendering="crispEdges">${[[5, 7], [12, 7]].map(([c, r]) => `<rect x="${EX + c * ES}" y="${EY + (r + dy) * ES}" width="${ES}" height="${ES}"/>`).join("")}</g>`;
const half = (sx, sy, dy) => `<rect x="${EX + (sx + 1) * ES}" y="${EY + (sy + 1 + dy) * ES}" width="${ES / 2}" height="${ES / 2}" fill="${SPRITE}"/>`;
const nose = (dy) => `<rect x="${EX + 8.5 * ES}" y="${EY + (8.4 + dy) * ES}" width="${ES}" height="${ES / 2}" fill="#D9546A"/>`;
const mole = (dy) => nose(dy) + half(7.75, 8.9, dy) + half(7.25, 9.4, dy) + half(8.25, 9.4, dy) + half(9.4, 10.1, dy);
const groundY = EY + ermine.length * ES;
function build(sfx) {
const hero = svg(840, 280,
  `.eye{fill:${SPRITE};animation:blink 5s step-end infinite}@keyframes blink{92%{fill:#FFFFFF}96%{fill:${SPRITE}}}.cur{animation:on 1s step-end infinite}@keyframes on{50%{opacity:0}}` +
  `.fa{animation:fa 1.4s step-end infinite}.fb{animation:fb 1.4s step-end infinite}@keyframes fa{50%{opacity:0}}@keyframes fb{0%{opacity:0}50%{opacity:1}}`,
  `<rect x="${EX - 12}" y="${groundY - 2}" width="${ermine[0].length * ES + 24}" height="6" fill="${C.sand}"/>` +
  `<g class="fa">${pixels(ermine, EX, EY, ES, erminePal()) + eyes(0) + mole(0)}</g><g class="fb">${pixels(ermineB, EX, EY, ES, erminePal()) + eyes(1) + mole(1)}</g>` +
  word("ANGE", 290, 66, 8) +
  typed("t1", "ceo of usad labs.", 292, 166, 18, C.ink, 0.4) +
  typed("t2", "we build the systems small businesses run on.", 292, 194, 18, C.ink, 1.4, `<tspan class="cur"> _</tspan>`) +
  `<text x="292" y="232" font-size="13" fill="${C.muted}" font-family="${SANS}">built with friends  ·  philippines  ·  open for projects</text>`);

// ---------- bookshelf: work on top, off hours below, plus a few things on the shelves ----------
const SPINE = [C.cobalt, C.sand, C.terra, C.ink, C.olive];
const WOOD = sfx ? ["#7A5338", "#4E3424"] : ["#9A6B47", "#6E4A31"];
const textOn = (col) => col === C.sand ? C.ink : col === C.ink ? C.paper : C.onSpine;
// a spine: shaded left edge, two bands at the top, one at the bottom, title running up
function book(x, baseY, w, h, col, title, delay) {
  const ink = textOn(col);
  return `<g class="b" style="animation-delay:${delay.toFixed(2)}s">` +
    `<rect x="${x}" y="${baseY - h}" width="${w}" height="${h}" fill="${col}"/>` +
    `<rect x="${x}" y="${baseY - h}" width="3" height="${h}" fill="${SPRITE}" opacity=".2"/>` +
    `<rect x="${x + 3}" y="${baseY - h + 7}" width="${w - 3}" height="2" fill="${ink}"/>` +
    `<rect x="${x + 3}" y="${baseY - h + 11}" width="${w - 3}" height="2" fill="${ink}"/>` +
    `<rect x="${x + 3}" y="${baseY - 8}" width="${w - 3}" height="2" fill="${ink}"/>` +
    (title ? `<text transform="translate(${x + w / 2 + 5} ${baseY - 15}) rotate(-90)" font-size="12" font-weight="600" fill="${ink}" font-family="${SANS}">${title}</text>` : "") + `</g>`;
}
function shelf(label, titles, baseY, startDelay) {
  let x = 40, out = `<text x="40" y="${baseY - 136}" font-size="13" fill="${C.muted}" font-family="${SANS}">${label}</text>`;
  titles.forEach((t, i) => {
    const w = 34 + (t.length % 3) * 6, h = 104 + ((i * 37) % 22);
    out += book(x, baseY, w, h, SPINE[i % SPINE.length], t, startDelay + i * 0.12);
    x += w + 4;
  });
  // one untitled book leaning back onto the row
  const lx = x + 22;
  out += `<g transform="rotate(-14 ${lx} ${baseY})">${book(lx, baseY, 28, 96, SPINE[(titles.length + 1) % SPINE.length], "", startDelay + titles.length * 0.12)}</g>`;
  return { svg: out, end: lx + 40 };
}
const flatStack = (x, baseY, delay) => [[86, C.terra], [74, C.cobalt], [80, C.olive]].map(([w, col], i) =>
  `<g class="b" style="animation-delay:${(delay + i * 0.1).toFixed(2)}s"><rect x="${x + i * 4}" y="${baseY - (i + 1) * 13}" width="${w}" height="12" fill="${col}"/><rect x="${x + i * 4}" y="${baseY - (i + 1) * 13 + 5}" width="${w}" height="2" fill="${textOn(col)}"/></g>`).join("");
const PS = 5;
const prop = (rows, x, baseY, pal) => pixels(outline(rows), x, baseY - (rows.length + 2) * PS, PS, { o: SPRITE, ...pal });
const PLANT = ["..g...g..", ".ggg.ggg.", "ggggggggg", "..ggggg..", "...ggg...", ".ppppppp.", ".ppppppp.", "..ppppp..", "..ppppp.."];
const JAR = ["b.c.d", "b.c.d", "w.w.w", "w.w.w", "jjjjj", "jjjjj", "jjjjj", "jjjjj"];
const MUG = ["mmmm..", "mmmmmm", "mmmm.m", "mmmm.m", "mmmmmm", "mmmm.."];
const steam = (x, y, dx) => [[0, 0], [1, -1], [0, -2], [1, -3]].map(([c, r]) => `<rect x="${x + (c + dx) * PS}" y="${y + r * PS}" width="${PS}" height="${PS}" fill="${C.muted}"/>`).join("");
const top = shelf("at usad labs", ["strategy", "sales", "delivery", "code", "pos", "booking", "inventory", "payroll", "websites", "ai"], 160, 0.2);
const bottom = shelf("off hours", ["art", "reading", "coding", "sketches", "novels", "side projects"], 330, 1.6);
const board = (y) => `<rect x="28" y="${y}" width="784" height="4" fill="${WOOD[0]}"/><rect x="28" y="${y + 4}" width="784" height="5" fill="${WOOD[1]}"/>`;
const bookshelf = svg(840, 360,
  `.b{animation:up .4s ease-out both}@keyframes up{from{opacity:0;transform:translateY(8px)}}.f0{animation:f0 1.2s step-end infinite}.f1{animation:f1 1.2s step-end infinite}@keyframes f0{50%{opacity:0}}@keyframes f1{0%{opacity:0}50%{opacity:1}}`,
  `<rect x="22" y="18" width="6" height="321" fill="${WOOD[1]}"/><rect x="812" y="18" width="6" height="321" fill="${WOOD[1]}"/>` +
  top.svg + flatStack(top.end + 10, 160, 1.4) + prop(PLANT, 690, 160, { g: C.olive, p: C.terra }) + board(160) +
  bottom.svg + prop(JAR, bottom.end + 20, 330, { b: C.cobalt, c: C.terra, d: C.olive, w: WOOD[0], j: C.sand }) +
  prop(MUG, bottom.end + 110, 330, { m: C.cobalt }) +
  `<g class="f0">${steam(bottom.end + 110 + 10, 330 - 48, 0)}</g><g class="f1">${steam(bottom.end + 110 + 10, 330 - 48, 1)}</g>` +
  flatStack(660, 330, 2.6) + board(330));

// ---------- project cards with a small pixel icon each ----------
const ICONS = {
  house: ["...#...", "..###..", ".#####.", "#######", ".#.#.#.", ".#.#.#.", ".#####."],
  snow: ["#..#..#", ".#.#.#.", "..###..", "#######", "..###..", ".#.#.#.", "#..#..#"],
  screen: ["#######", "#.....#", "#.....#", "#.....#", "#######", "...#...", ".#####."],
};
const projectCard = (title, l1, l2, stack, icon, color) => svg(270, 140, "",
  pixels(ICONS[icon], 222, 22, 4, { "#": color }) +
  `<text x="22" y="42" font-size="16" font-weight="700" fill="${C.ink}" font-family="${SANS}">${title}</text>` +
  `<text x="22" y="72" font-size="13" fill="${C.muted}" font-family="${SANS}">${l1}</text>` +
  `<text x="22" y="92" font-size="13" fill="${C.muted}" font-family="${SANS}">${l2}</text>` +
  `<text x="22" y="118" font-size="12" fill="${color}" font-family="${SANS}">${stack}</text>`);

// ---------- footer: red roadster (modern MX-5 shape) driving right to left ----------
const car = outline([
  "...............g...kk.......",
  "..............g...kkk.......",
  "....rrrrr....g...kkk.rrrrr..",
  "..rrrrrrrrrrrrr.....rrrrrrr.",
  ".lrrrrrrrrrrrrrrrrrrrrrrrrrT",
  "rrrrrrrrrrrrrrrrrrrrrrrrrrrr",
  "rdd.ooo.dddddddddddd.ooo.dd.",
  "...ooooo............ooooo...",
  "....ooo..............ooo....",
]);
const carPal = { o: "#1F1C19", r: "#C8323A", d: "#8E1F27", l: "#F2E3A0", T: "#5A1015", g: "#CFE0EA", k: SPRITE };
const CY = 22;
// rim pixel hops left/right of the wheel centre (cols 5 and 22, row 7; +1 padding) so the wheels read as spinning
const hubs = (dx) => [5, 22].map((c) => `<rect x="${(c + 1 + dx) * 4}" y="${CY + 8 * 4}" width="4" height="4" fill="#6B6B70"/>`).join("");
const footer = svg(840, 72,
  `.drive{animation:drive 12s linear infinite}@keyframes drive{from{transform:translateX(880px)}to{transform:translateX(-130px)}}.f0{animation:f0 .3s step-end infinite}.f1{animation:f1 .3s step-end infinite}@keyframes f0{50%{opacity:0}}@keyframes f1{0%{opacity:0}50%{opacity:1}}`,
  `<rect x="20" y="${CY + car.length * 4 - 2}" width="800" height="3" fill="${C.sand}"/>` +
  `<g class="drive">${pixels(car, 0, CY, 4, carPal)}<g class="f0">${hubs(-1)}</g><g class="f1">${hubs(1)}</g></g>`);

return {
  [`assets/hero${sfx}.svg`]: hero,
  [`assets/bookshelf${sfx}.svg`]: bookshelf,
  [`assets/card-rentals${sfx}.svg`]: projectCard("5A Rentals", "rental site + owner dashboard", "with messenger reminders", "next.js · sqlite", "house", C.cobalt),
  [`assets/card-bluefrost${sfx}.svg`]: projectCard("Bluefrost Aircon", "landing page for an aircon", "repair shop · lighthouse 100", "astro · typescript", "snow", C.olive),
  [`assets/card-portfolio${sfx}.svg`]: projectCard("Portfolio", "my personal site", "and older web work", "html · css · js", "screen", C.terra),
  [`assets/footer${sfx}.svg`]: footer,
};
}
const out = {};
C = LIGHT; Object.assign(out, build(""));
C = DARK; Object.assign(out, build("-dark"));
for (const [path, s] of Object.entries(out)) writeFileSync(path, s);

// self-check: every file is one well-formed-looking svg; outline adds exactly one ring
console.assert(ermineB.length === 33 && ermineB.join("") !== ermine.join("") && ermine.length === 33 && ermine[0].length === 18, "outline size");
for (const path of Object.keys(out)) {
  const s = readFileSync(path, "utf8");
  console.assert(s.startsWith("<svg") && s.endsWith("</svg>") && !s.includes("undefined") && !s.includes("NaN"), path);
}
console.log("ok", Object.keys(out).join(", "));
