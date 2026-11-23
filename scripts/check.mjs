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
  "assets/real/2016.js",
  "assets/real/2017.js",
  "assets/real/2018.js",
  "assets/real/2019.js",
  "assets/real/2020.js",
  "assets/real/2021.js",
  "assets/real/2022.js",
  "assets/real/2023.js",
  "assets/real/2024.js",
  "assets/real/2025.js",
  "assets/real/supplement.js",
  "assets/bank-real.js",
  "assets/chapters/gaoshu-1.js",
  "assets/chapters/gaoshu-2.js",
  "assets/chapters/xiandai.js",
  "assets/chapters/gailv.js",
  "assets/proof-data.js",
  "assets/reasoning-data.js",
  "assets/lectures/l01-l03.js",
  "assets/lectures/l04-l06.js",
  "assets/lectures/l07-l09.js",
  "assets/lectures/l10-l12.js",
  "assets/lectures/l13-l15.js",
  "assets/lectures/l16-l18.js",
  "assets/solution-data.js",
  "assets/solution-why.js"
].forEach((f) => load(f, ctx));

const bank = ctx.window.MATH_BANK || [];
const chapters = ctx.window.MATH_CHAPTERS || {};
const proofs = ctx.window.MATH_PROOFS || [];
const solutions = ctx.window.MATH_SOLUTIONS || {};
const reasoning = ctx.window.MATH_REASONING || {};
const solutionWhy = ctx.window.MATH_SOLUTION_WHY || {};
const lectures = ctx.window.MATH_LECTURES || [];

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
if (bank.length !== 305) fail(`题库应为 305 题，实际 ${bank.length}`);
const realByYear = {};
bank.forEach((q) => {
  if (q.year) realByYear[q.year] = (realByYear[q.year] || 0) + 1;
});
Object.keys(realByYear).sort().forEach((y) => {
  if (realByYear[y] !== 15) fail(`${y} 年真题应为 15 题，实际 ${realByYear[y]}`);
});
const supplements = bank.filter((q) => q.origin === "补充").length;
if (supplements !== 75) fail(`同源补充应为 75 题，实际 ${supplements}`);
notes.push(`题库 ${bank.length} 题，章节 ${Object.keys(chapters).length} 个`);
notes.push(`十年真题 ${Object.keys(realByYear).length} 年 × 15 题，补充 ${supplements} 题`);

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

/* ── 底层逻辑与「为什么这样想」 ── */
const chapterIds = Object.keys(chapters);
chapterIds.forEach((id) => {
  const r = reasoning[id];
  if (!r) { fail(`章节 ${id} 缺少底层逻辑卡`); return; }
  ["core", "why", "wrong", "bridge", "drill"].forEach((k) => {
    if (!r[k]) fail(`章节 ${id} 的底层逻辑缺字段：${k}`);
  });
  if (!Array.isArray(r.signals) || r.signals.length < 2) fail(`章节 ${id} 的信号少于 2 条`);
  (r.signals || []).forEach((s, i) => {
    if (!s.cue || !s.move || !s.why) fail(`章节 ${id} 第 ${i + 1} 条信号不完整`);
  });
});
if (Object.keys(reasoning).length !== chapterIds.length) {
  fail(`底层逻辑卡应为 ${chapterIds.length} 章，实际 ${Object.keys(reasoning).length}`);
}
const whyIds = Object.keys(solutionWhy);
if (whyIds.length !== solIds.length) fail(`题解 why 应为 ${solIds.length} 题，实际 ${whyIds.length}`);
whyIds.forEach((id) => {
  if (!solutions[id]) fail(`solution-why 多出题解 ${id}`);
});
solIds.forEach((id) => {
  const w = solutionWhy[id];
  if (!w) { fail(`题解 ${id} 缺少 why 数据`); return; }
  ["signal", "principle", "decision", "repair", "transfer"].forEach((k) => {
    if (!w[k]) fail(`题解 ${id} 的 why 缺字段：${k}`);
  });
});
notes.push(`底层逻辑 ${Object.keys(reasoning).length} 章；题解 why ${whyIds.length} 题`);

/* ── 高数 18 讲精讲 ── */
const lectureIds = new Set();
lectures.forEach((l, i) => {
  const where = `第 ${i + 1} 讲（${l.id || "无 id"}）`;
  if (!/^l\d+$/.test(l.id || "")) fail(`${where} id 非法`);
  if (lectureIds.has(l.id)) fail(`${where} id 重复`);
  lectureIds.add(l.id);
  if (l.no !== i + 1) fail(`${where} 讲次应为 ${i + 1}，实际 ${l.no}`);
  ["part", "title", "intro"].forEach((k) => {
    if (!l[k]) fail(`${where} 缺少 ${k}`);
  });
  if (!Number.isInteger(l.bookPage) || l.bookPage < 1) fail(`${where} bookPage 非法`);
  if (!Array.isArray(l.chapters) || !l.chapters.length) fail(`${where} 未关联章节`);
  (l.chapters || []).forEach((id) => {
    if (!chapters[id]) fail(`${where} 关联章节不存在：${id}`);
  });
  ["score", "types", "freq", "note"].forEach((k) => {
    if (!l.exam || !l.exam[k]) fail(`${where} exam 缺字段：${k}`);
  });
  if (!Array.isArray(l.tree) || l.tree.length < 4) fail(`${where} 知识结构少于 4 块`);
  if (!Array.isArray(l.concepts) || l.concepts.length < 3) fail(`${where} 概念精讲少于 3 段`);
  (l.concepts || []).forEach((c, j) => {
    if (!c.title || !c.html) fail(`${where} 概念 ${j + 1} 不完整`);
  });
  if (!Array.isArray(l.methods) || l.methods.length < 5) fail(`${where} 方法卡少于 5 个`);
  (l.methods || []).forEach((m, j) => {
    ["signal", "name", "why"].forEach((k) => {
      if (!m[k]) fail(`${where} 方法 ${j + 1} 缺字段：${k}`);
    });
    if (!Array.isArray(m.steps) || m.steps.length < 2) fail(`${where} 方法 ${j + 1} 步骤少于 2 步`);
  });
  if (!Array.isArray(l.examples) || l.examples.length < 4) fail(`${where} 例题少于 4 道`);
  (l.examples || []).forEach((e, j) => {
    ["title", "question", "think", "answer", "trap"].forEach((k) => {
      if (!e[k]) fail(`${where} 例题 ${j + 1} 缺字段：${k}`);
    });
    if (!Array.isArray(e.steps) || e.steps.length < 2) fail(`${where} 例题 ${j + 1} 步骤少于 2 步`);
  });
  if (!Array.isArray(l.conclusions) || l.conclusions.length < 4) fail(`${where} 二级结论少于 4 条`);
  if (!Array.isArray(l.pitfalls) || l.pitfalls.length < 4) fail(`${where} 避坑少于 4 条`);
  if (!Array.isArray(l.selfCheck) || l.selfCheck.length < 4) fail(`${where} 自测少于 4 条`);
});
if (lectures.length !== 18) fail(`高数精讲应为 18 讲，实际 ${lectures.length}`);
notes.push(`高数精讲 ${lectures.length} 讲，${lectures.reduce((n, l) => n + (l.methods || []).length, 0)} 个方法卡，${lectures.reduce((n, l) => n + (l.examples || []).length, 0)} 道例题`);

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
  for (const m of html.matchAll(/href="lecture\.html\?l=(l\d+)"/g)) {
    if (!lectureIds.has(m[1])) fail(`${file} 链接到不存在的讲次：${m[1]}`);
  }
  if (!html.includes('href="proof.html"')) fail(`${file} 导航缺少「证明」入口`);
  if (!html.includes('href="practice.html#real"')) fail(`${file} 导航缺少「真题」入口`);
  if (!html.includes('href="lectures.html"')) fail(`${file} 导航缺少「高数18讲」入口`);
});

/* ── 脚本接入顺序 ── */
const practiceHtml = read("practice.html");
[
  "assets/real/2016.js", "assets/real/2017.js", "assets/real/2018.js", "assets/real/2019.js",
  "assets/real/2020.js", "assets/real/2021.js", "assets/real/2022.js", "assets/real/2023.js",
  "assets/real/2024.js", "assets/real/2025.js", "assets/real/supplement.js", "assets/bank-real.js"
].forEach((f) => {
  if (!practiceHtml.includes(f)) fail(`practice.html 未加载 ${f}`);
});
["practice.html", "chapter.html", "gaoshu-1.html", "gaoshu-2.html", "xiandai.html", "gailv.html"].forEach((file) => {
  const html = read(file);
  const dataAt = html.indexOf("assets/solution-data.js");
  const whyAt = html.indexOf("assets/solution-why.js");
  const coachAt = html.indexOf("assets/solution-coach.js");
  const appAt = html.indexOf("assets/app.js");
  if (dataAt < 0 || coachAt < 0) fail(`${file} 未接入交互题解脚本`);
  if (whyAt < 0) fail(`${file} 未接入 solution-why.js`);
  if (dataAt > appAt || coachAt > appAt || whyAt > appAt) fail(`${file} 交互题解脚本必须在 app.js 之前`);
});
const chapterHtml = read("chapter.html");
const reasonAt = chapterHtml.indexOf("assets/reasoning-data.js");
const chapterAt = chapterHtml.indexOf("assets/chapter.js");
if (reasonAt < 0) fail("chapter.html 未接入 reasoning-data.js");
if (reasonAt > chapterAt) fail("reasoning-data.js 必须在 chapter.js 之前");
const lectureAt = chapterHtml.indexOf("assets/lectures/l01-l03.js");
if (lectureAt < 0) fail("chapter.html 未接入 18 讲数据");
if (lectureAt > chapterAt) fail("18 讲数据必须在 chapter.js 之前");

const lectureHtml = read("lecture.html");
if (lectureHtml.indexOf("assets/chapters/gaoshu-1.js") < 0) {
  fail("lecture.html 未加载章节数据，讲次页无法生成章节链接");
}
["lectures.html", "lecture.html"].forEach((file) => {
  const html = read(file);
  const pageAt = html.indexOf("assets/lecture-page.js");
  if (pageAt < 0) fail(`${file} 未接入 lecture-page.js`);
  ["l01-l03", "l04-l06", "l07-l09", "l10-l12", "l13-l15", "l16-l18"].forEach((name) => {
    const at = html.indexOf(`assets/lectures/${name}.js`);
    if (at < 0) fail(`${file} 未加载 ${name}.js`);
    if (at > pageAt) fail(`${file} 的 ${name}.js 必须在 lecture-page.js 之前`);
  });
});

/* ── 输出 ── */
notes.forEach((n) => console.log("· " + n));
if (errors.length) {
  console.error("\n发现 " + errors.length + " 个问题：");
  errors.forEach((e) => console.error("  ✗ " + e));
  process.exit(1);
}
console.log("\n✓ 内容校验全部通过");
