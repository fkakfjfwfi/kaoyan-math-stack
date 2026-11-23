/* 研数 · 内容校验：题库 / 证明 / 题解 / 页面链接 / 脚本接入
   运行：node scripts/check.mjs
*/
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const notes = [];

function read(rel) {
  return fs.readFileSync(path.join(root, rel), "utf8");
}

function load(rel, ctx) {
  vm.runInContext(read(rel), ctx, { filename: rel });
}

function fail(msg) { errors.push(msg); }

/* ── 载入浏览器全局数据 ── */
const ctx = { window: {}, console };
vm.createContext(ctx);
[
  "assets/bank.js",
  "assets/bank-external.js",
  "assets/chapters/gaoshu-1.js",
  "assets/chapters/gaoshu-2.js",
  "assets/chapters/xiandai.js",
  "assets/chapters/gailv.js",
  "assets/proof-data.js",
  "assets/solution-data.js"
].forEach((f) => load(f, ctx));

const bank = ctx.window.MATH_BANK || [];
const chapters = ctx.window.MATH_CHAPTERS || {};
const proofs = ctx.window.MATH_PROOFS || [];
const solutions = ctx.window.MATH_SOLUTIONS || {};

/* ── 题库 ── */
const ids = new Set();
bank.forEach((q, i) => {
  const where = `题库第 ${i + 1} 题（${q.id || "无 id"}）`;
  if (!q.id) fail(`${where} 缺少 id`);
  if (ids.has(q.id)) fail(`${where} id 重复`);
  ids.add(q.id);
  if (!["高数", "线代", "概率"].includes(q.subject)) fail(`${where} subject 非法：${q.subject}`);
  if (!chapters[q.chapterId]) fail(`${where} chapterId 不存在：${q.chapterId}`);
  if (!Array.isArray(q.options) || q.options.length !== 4) fail(`${where} 选项数不是 4`);
  if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer > 3) fail(`${where} answer 非法：${q.answer}`);
  if (!q.q || !q.exp) fail(`${where} 题干或解析为空`);
});
if (bank.length !== 80) fail(`题库应为 80 题，实际 ${bank.length}`);
notes.push(`题库 ${bank.length} 题，章节 ${Object.keys(chapters).length} 个`);

/* ── 可视化证明 ── */
const proofIds = new Set();
const vizAllowed = new Set(["ivt", "mvt", "taylor", "integral-mean", "ftc", "green", "schmidt", "symmetric"]);
proofs.forEach((p) => {
  if (!p.id || proofIds.has(p.id)) fail(`证明 id 缺失或重复：${p.id}`);
  proofIds.add(p.id);
  if (!p.title || !p.goal || !p.conclusion || !p.exam) fail(`证明 ${p.id} 字段不完整`);
  if (!chapters[p.chapter]) fail(`证明 ${p.id} 的章节不存在：${p.chapter}`);
  if (!vizAllowed.has(p.viz)) fail(`证明 ${p.id} 的 viz 未知：${p.viz}`);
  if (!Array.isArray(p.steps) || p.steps.length < 3) fail(`证明 ${p.id} 步骤少于 3 步`);
  (p.steps || []).forEach((s, i) => {
    if (!s.name || !s.math || !s.why) fail(`证明 ${p.id} 第 ${i + 1} 步字段不完整`);
  });
});
if (proofs.length < 8) fail(`证明应不少于 8 个，实际 ${proofs.length}`);
notes.push(`证明 ${proofs.length} 个，共 ${proofs.reduce((n, p) => n + (p.steps || []).length, 0)} 步`);

/* ── 交互题解 ── */
const solIds = Object.keys(solutions);
const visualAllowed = new Set(["limit", "polar", "eigen", "normal"]);
solIds.forEach((id) => {
  const s = solutions[id];
  const q = bank.find((item) => item.id === id);
  if (!q) { fail(`题解 ${id} 在题库中不存在`); return; }
  if (!s.idea) fail(`题解 ${id} 缺少 idea`);
  if (!Array.isArray(s.steps) || s.steps.length < 2) fail(`题解 ${id} 步骤少于 2 步`);
  (s.steps || []).forEach((st, i) => {
    if (!st.name || !st.body || !st.why) fail(`题解 ${id} 第 ${i + 1} 步字段不完整`);
  });
  if (!Array.isArray(s.traps) || s.traps.length !== 4) fail(`题解 ${id} 的 traps 必须是 4 项`);
  (s.traps || []).forEach((t, i) => {
    if (i !== q.answer && !t) fail(`题解 ${id} 的错误选项 ${"ABCD"[i]} 缺少错因`);
    if (i === q.answer && t) fail(`题解 ${id} 的正确选项 ${"ABCD"[i]} 不应写错因`);
  });
  if (s.visual && !visualAllowed.has(s.visual)) fail(`题解 ${id} 的 visual 未知：${s.visual}`);
  if (!s.link || !chapters[s.link]) fail(`题解 ${id} 的章节链接非法：${s.link}`);
});
if (solIds.length < 12) fail(`交互题解应不少于 12 题，实际 ${solIds.length}`);
notes.push(`交互题解 ${solIds.length} 题，其中带图 ${solIds.filter((id) => solutions[id].visual).length} 题`);

/* ── HTML 内部链接 ── */
const htmlFiles = fs.readdirSync(root).filter((f) => f.endsWith(".html"));
const pageSet = new Set(htmlFiles);
htmlFiles.forEach((file) => {
  const html = read(file);
  for (const m of html.matchAll(/href="([^"#]+\.html)(?:[?#][^"]*)?"/g)) {
    const target = m[1];
    if (/^https?:/i.test(target)) continue;
    if (!pageSet.has(target)) fail(`${file} 链接到不存在的页面：${target}`);
  }
  for (const m of html.matchAll(/href="chapter\.html\?ch=([a-zA-Z0-9]+)"/g)) {
    if (!chapters[m[1]]) fail(`${file} 链接到不存在的章节：${m[1]}`);
  }
  for (const m of html.matchAll(/href="proof\.html\?p=([a-z-]+)"/g)) {
    if (!proofIds.has(m[1])) fail(`${file} 链接到不存在的证明：${m[1]}`);
  }
  if (!html.includes('href="proof.html"')) fail(`${file} 导航缺少「证明」入口`);
});

/* ── 脚本接入顺序 ── */
["practice.html", "chapter.html", "gaoshu-1.html", "gaoshu-2.html", "xiandai.html", "gailv.html"].forEach((file) => {
  const html = read(file);
  const dataAt = html.indexOf("assets/solution-data.js");
  const coachAt = html.indexOf("assets/solution-coach.js");
  const appAt = html.indexOf("assets/app.js");
  if (dataAt < 0 || coachAt < 0) fail(`${file} 未接入交互题解脚本`);
  if (dataAt > appAt || coachAt > appAt) fail(`${file} 交互题解脚本必须在 app.js 之前`);
});

/* ── 输出 ── */
notes.forEach((n) => console.log("· " + n));
if (errors.length) {
  console.error("\n发现 " + errors.length + " 个问题：");
  errors.forEach((e) => console.error("  ✗ " + e));
  process.exit(1);
}
console.log("\n✓ 内容校验全部通过");
