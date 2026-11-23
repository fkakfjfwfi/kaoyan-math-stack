/* 研数 · 章节课程渲染器 */
(function () {
  "use strict";

  var ORDER = [
    "g1", "g2", "g3", "g4", "g5", "g6", "g7", "g8",
    "x1", "x2", "x3", "x4", "x5", "x6",
    "p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8"
  ];

  function $(sel, root) { return (root || document).querySelector(sel); }

  function stars(n) {
    return '<span style="color:var(--accent)">' + "★".repeat(n) + '</span><span style="color:var(--line)">' + "★".repeat(5 - n) + "</span>";
  }

  function render() {
    var app = document.getElementById("chapterApp");
    if (!app) return;
    var id = new URLSearchParams(location.search).get("ch") || "g1";
    var chapters = window.MATH_CHAPTERS || {};
    var c = chapters[id];

    if (!c) {
      app.innerHTML = '<div class="card"><h3>没有找到这一章</h3><p>链接可能有误，回<a href="index.html">总览</a>重新选择章节。</p></div>';
      return;
    }

    document.title = c.title + " · 第 " + c.no + " 章 | 研数";
    var desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", c.title + "：考研数学一章节课程，含人话导入、知识块、例题、公式与章末练习。");

    var idx = ORDER.indexOf(c.id);
    var prev = idx > 0 ? chapters[ORDER[idx - 1]] : null;
    var next = idx >= 0 && idx < ORDER.length - 1 ? chapters[ORDER[idx + 1]] : null;
    var bank = window.MATH_BANK || [];
    var drillCount = bank.filter(function (q) { return q.chapterId === c.id; }).length;

    var blocks = (c.blocks || []).map(function (b, i) {
      return '<h3 class="sub">' + (i + 1) + ". " + b.title + "</h3><div class=\"lesson-block\">" + b.html + "</div>";
    }).join("");

    var examples = (c.examples || []).map(function (e, i) {
      var steps = (e.steps || []).map(function (s) { return '<div class="step">' + s + "</div>"; }).join("");
      return '<div class="card example-card">' +
        '<span class="ch-num">例题 ' + (i + 1) + '</span>' +
        '<h3>' + e.title + '</h3>' +
        '<p><b>题目：</b>' + e.question + '</p>' +
        (e.logic ? '<p class="example-logic"><b>为什么先这样想：</b>' + e.logic + '</p>' : "") +
        '<div class="steps">' + steps + '</div>' +
        '<p class="example-answer"><b>答案：</b>' + e.answer + '</p>' +
      '</div>';
    }).join("");

    var formulas = (c.formulas || []).map(function (f) {
      return '<div class="formula"><span class="fx-label">' + f.name + '</span>' + f.formula +
        '<span class="small">' + f.note + '</span></div>';
    }).join("");

    var pitfalls = (c.pitfalls || []).map(function (p) { return "<li>" + p + "</li>"; }).join("");

    // 本章底层逻辑：先讲「为什么这样想」，再进入知识点
    var logic = (window.MATH_REASONING || {})[c.id];
    var logicHtml = logic
      ? '<h2 class="sec" id="logic">底层逻辑 <span class="en">WHY THIS WAY</span></h2>' +
        '<div class="logic-card">' +
          '<div class="logic-core">' + logic.core + '</div>' +
          '<p class="logic-why">' + logic.why + '</p>' +
          '<div class="logic-signals">' + (logic.signals || []).map(function (s) {
            return '<div class="logic-signal">' +
              '<span class="cue">' + s.cue + '</span><span class="arrow">→</span><span class="move">' + s.move + '</span>' +
              '<p>' + s.why + '</p>' +
            '</div>';
          }).join("") + '</div>' +
          '<div class="logic-wrong"><b>最容易错的直觉：</b>' + logic.wrong + '</div>' +
          '<div class="logic-bridge"><b>往后接：</b>' + logic.bridge + '</div>' +
          '<div class="logic-drill"><b>先自问：</b>' + logic.drill + '</div>' +
        '</div>'
      : "";

    // 本章对应的系统精讲讲次（lecture-data 提供）
    var lectures = (window.MATH_LECTURES || []).filter(function (l) {
      return (l.chapters || []).indexOf(c.id) >= 0;
    });
    var lectureHtml = lectures.length
      ? '<h2 class="sec" id="lectures">系统精讲 <span class="en">LECTURES</span></h2>' +
        '<div class="callout exam">' +
          '<div class="co-title">📖 本章只是速览；要补到 120 分，按讲次学深</div>' +
          '<p>对应讲义把概念、方法卡和例题讲透，每讲含 5～9 个题型方法与 4～11 道精讲例题。</p>' +
          '<p style="margin-bottom:0">' + lectures.map(function (l) {
            return '<a class="btn sm" style="margin:3px 6px 3px 0" href="lecture.html?l=' + l.id + '">第 ' + l.no + ' 讲 ' + l.title + ' →</a>';
          }).join("") + '</p>' +
        '</div>'
      : "";

    // 本章对应的可视化证明（proof-data.js 提供）
    var proofs = (window.MATH_PROOFS || []).filter(function (p) { return p.chapter === c.id; });
    var proofHtml = proofs.length
      ? '<h2 class="sec" id="proofs">可视化证明 <span class="en">PROOFS</span></h2>' +
        '<div class="callout exam">' +
          '<div class="co-title">🎬 本章必看：把证明拆成分步画面</div>' +
          '<p>先拖动图形找到「平行 / 相等 / 抵消」的瞬间，再回来写标准证明。每一步都附「为什么成立」与考场写法。</p>' +
          '<p style="margin-bottom:0">' + proofs.map(function (p) {
            return '<a class="btn sm" style="margin:3px 6px 3px 0" href="proof.html?p=' + p.id + '">' + p.short + ' →</a>';
          }).join("") + '</p>' +
        '</div>'
      : "";

    var prevHtml = prev
      ? '<a class="chapter-nav-link" href="chapter.html?ch=' + prev.id + '"><span>上一章</span><b>' + prev.no + " " + prev.title + "</b></a>"
      : "<span></span>";
    var nextHtml = next
      ? '<a class="chapter-nav-link" href="chapter.html?ch=' + next.id + '"><span>下一章</span><b>' + next.no + " " + next.title + "</b></a>"
      : "<span></span>";

    app.innerHTML =
      '<header class="hero">' +
        '<p class="eyebrow">第 ' + c.no + ' 章 · ' + (c.subject === "高数" ? "高等数学" : c.subject === "线代" ? "线性代数" : "概率统计") + ' · 年均约 ' + c.score + ' 分</p>' +
        '<h1>' + c.title + '</h1>' +
        '<p class="lede">' + c.intro + '</p>' +
        '<p class="tagline">' + stars(c.stars) + ' · ' + c.freq + ' · 本章题库 ' + drillCount + ' 题 + 模块页跨章题</p>' +
        '<div class="hero-actions">' +
          '<a class="btn" href="#lesson">开始本章 →</a>' +
          '<a class="btn ghost" href="' + c.module + '">回 ' + c.moduleName + '</a>' +
          '<a class="btn ghost" href="practice.html">去练习场</a>' +
        '</div>' +
      '</header>' +

      '<div class="toc">' +
        '<span class="toc-label">本章目录</span>' +
        '<a href="#logic">底层逻辑</a>' +
        (lectures.length ? '<a href="#lectures">系统精讲</a>' : '') +
        '<a href="#lesson">知识块</a>' +
        (proofs.length ? '<a href="#proofs">可视化证明</a>' : '') +
        '<a href="#examples">典型例题</a>' +
        '<a href="#formulas">公式清单</a>' +
        '<a href="#pitfalls">避坑</a>' +
        '<a href="#practice">章末练习</a>' +
      '</div>' +

      '<div class="callout exam">' +
        '<div class="co-title">📌 先建立主线</div>' +
        '<p style="margin-bottom:0">本章平均约 <b>' + c.score + ' 分</b>，重要度 ' + "★".repeat(c.stars) + '。先读人话导入和知识块，再动手做例题；不要直接跳到章末题。</p>' +
      '</div>' +
      logicHtml +
      lectureHtml +

      '<h2 class="sec" id="lesson">本章讲解 <span class="en">LESSON</span></h2>' +
      blocks +
      proofHtml +

      '<h2 class="sec" id="examples">典型例题 <span class="en">EXAMPLES</span></h2>' +
      '<p class="muted">先遮住步骤自己做一遍，再对照。例题比章末题更重要，它决定你会不会「按步骤拿分」。</p>' +
      examples +

      '<h2 class="sec" id="formulas">公式清单 <span class="en">FORMULAS</span></h2>' +
      formulas +

      '<h2 class="sec" id="pitfalls">本章避坑 <span class="en">PITFALLS</span></h2>' +
      '<div class="callout warn"><div class="co-title">⚠️ 做错题时回来对一遍</div><ul style="margin-bottom:0">' + pitfalls + '</ul></div>' +

      '<h2 class="sec" id="practice">章末练习 <span class="en">PRACTICE</span></h2>' +
      '<p class="muted">先做本章题库；做完再回 <a href="' + c.module + '">' + c.moduleName + '</a> 做跨章题，最后去练习场组卷。</p>' +
      '<div data-quiz data-chapters="' + c.id + '"></div>' +

      '<div class="chapter-nav">' + prevHtml + '<a class="chapter-nav-link center-link" href="' + c.module + '">回模块页</a>' + nextHtml + '</div>' +

      '<p class="center" style="margin-top:24px"><a class="btn ghost" href="practice.html">去练习场组卷 →</a></p>';

    document.querySelectorAll(".nav-links a").forEach(function (a) {
      if (a.getAttribute("href") === c.module) a.classList.add("active");
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render);
  } else {
    render();
  }
})();
