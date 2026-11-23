/* 研数 · 高数 18 讲渲染器
   目录页：lectures.html；详情页：lecture.html?l=l1
   数据由 assets/lectures/*.js 提供，统一挂在 window.MATH_LECTURES
*/
(function () {
  "use strict";

  var KEY = "yanshu.lectures";
  var ALL = (window.MATH_LECTURES || []).slice().sort(function (a, b) { return a.no - b.no; });
  var CHAPTERS = window.MATH_CHAPTERS || {};

  function $(sel, root) { return (root || document).querySelector(sel); }

  function doneSet() {
    try {
      var arr = JSON.parse(localStorage.getItem(KEY) || "[]");
      return new Set(Array.isArray(arr) ? arr : []);
    } catch (e) {
      return new Set();
    }
  }

  function saveDone(set) {
    try { localStorage.setItem(KEY, JSON.stringify(Array.from(set))); } catch (e) {}
  }

  function partGroups() {
    var groups = [];
    ALL.forEach(function (l) {
      var g = groups[groups.length - 1];
      if (!g || g.part !== l.part) { g = { part: l.part, items: [] }; groups.push(g); }
      g.items.push(l);
    });
    return groups;
  }

  function pct(done) {
    return ALL.length ? Math.round(done.size / ALL.length * 100) : 0;
  }

  /* ── 目录页 ── */
  function renderIndex() {
    var list = document.getElementById("lectureList");
    if (!list) return;
    var done = doneSet();

    var progress = document.getElementById("lecProgress");
    if (progress) {
      progress.innerHTML =
        '<div class="lec-progress-inner">' +
          '<div><b>' + done.size + '</b> / ' + ALL.length + ' 讲已掌握</div>' +
          '<div class="lec-bar"><i style="width:' + pct(done) + '%"></i></div>' +
          '<div class="small">完成一讲就点开详情页右上角的「标记已掌握」。进度只存在本机浏览器。</div>' +
        '</div>';
    }

    list.innerHTML = partGroups().map(function (g) {
      return '<h2 class="sec">' + g.part + '</h2>' +
        '<div class="grid cols-2">' + g.items.map(function (l) {
          var ok = done.has(l.id);
          return '<a class="card clickable lec-card" href="lecture.html?l=' + l.id + '">' +
            '<span class="ch-num">第 ' + l.no + ' 讲 · 参考书 p.' + l.bookPage + '</span>' +
            '<h3>' + l.title + (ok ? ' <span class="lec-done">✓ 已掌握</span>' : '') + '</h3>' +
            '<p>' + l.intro + '</p>' +
            '<p class="ch-wave">' + l.exam.score + ' · ' + l.exam.freq + ' · ' + (l.methods || []).length +
              ' 个方法卡 · ' + (l.examples || []).length + ' 道精讲例题</p>' +
          '</a>';
        }).join("") + '</div>';
    }).join("");
  }

  /* ── 详情页 ── */
  function sideHtml(current, done) {
    var groups = partGroups().map(function (g) {
      return '<div class="lec-side-group"><p class="lec-side-part">' + g.part + '</p>' +
        g.items.map(function (l) {
          var cls = l.id === current.id ? " active" : "";
          return '<a class="lec-side-link' + cls + '" href="lecture.html?l=' + l.id + '">' +
            '<span>第 ' + l.no + ' 讲</span><b>' + l.title + '</b>' +
            (done.has(l.id) ? '<i class="lec-side-done">✓</i>' : '') +
          '</a>';
        }).join("") + '</div>';
    }).join("");
    return '<a class="lec-side-home" href="lectures.html">← 18 讲目录</a>' +
      '<div class="lec-side-progress">已掌握 ' + done.size + ' / ' + ALL.length + '</div>' +
      groups;
  }

  function examHtml(l) {
    return '<div class="lec-meta">' +
      '<span><b>分值</b>' + l.exam.score + '</span>' +
      '<span><b>题型</b>' + l.exam.types + '</span>' +
      '<span><b>频率</b>' + l.exam.freq + '</span>' +
      '<span><b>定位</b>' + l.exam.note + '</span>' +
    '</div>';
  }

  function treeHtml(l) {
    if (!l.tree || !l.tree.length) return "";
    return '<div class="lec-tree">' + l.tree.map(function (node) {
      return '<div class="lec-tree-node"><b>' + node.label + '</b><ul>' +
        (node.items || []).map(function (it) { return "<li>" + it + "</li>"; }).join("") +
      '</ul></div>';
    }).join("") + '</div>';
  }

  function conceptsHtml(l) {
    return (l.concepts || []).map(function (c, i) {
      return '<div class="card lec-concept"><span class="ch-num">概念 ' + (i + 1) + '</span>' +
        '<h3>' + c.title + '</h3><div class="lec-rich">' + c.html + '</div></div>';
    }).join("");
  }

  function methodHtml(m, i) {
    return '<details class="lec-method">' +
      '<summary><span class="lec-signal">' + m.signal + '</span>' +
        '<b>' + m.name + '</b><span class="lec-method-no">方法 ' + (i + 1) + '</span></summary>' +
      '<div class="lec-method-body">' +
        '<p class="lec-why"><b>为什么用它：</b>' + m.why + '</p>' +
        '<div class="steps">' + (m.steps || []).map(function (s) { return '<div class="step">' + s + '</div>'; }).join("") + '</div>' +
        (m.example ? '<p class="lec-mini"><b>小例子：</b>' + m.example + '</p>' : "") +
      '</div>' +
    '</details>';
  }

  function examplesHtml(l) {
    return (l.examples || []).map(function (e, i) {
      return '<div class="card example-card lec-example">' +
        '<span class="ch-num">例题 ' + (i + 1) + '</span>' +
        '<h3>' + e.title + '</h3>' +
        '<p><b>题目：</b>' + e.question + '</p>' +
        (e.think ? '<p class="example-logic"><b>第一眼为什么这样想：</b>' + e.think + '</p>' : "") +
        '<div class="steps">' + (e.steps || []).map(function (s) { return '<div class="step">' + s + '</div>'; }).join("") + '</div>' +
        '<p class="example-answer"><b>答案：</b>' + e.answer + '</p>' +
        (e.trap ? '<p class="lec-trap"><b>易错点：</b>' + e.trap + '</p>' : "") +
      '</div>';
    }).join("");
  }

  function conclusionsHtml(l) {
    return (l.conclusions || []).map(function (c) {
      return '<div class="formula"><span class="fx-label">' + c.name + '</span>' + c.formula +
        '<span class="small">' + c.note + '</span></div>';
    }).join("");
  }

  function listHtml(items, cls, icon) {
    return '<ul class="lec-list ' + (cls || "") + '">' + (items || []).map(function (t) {
      return "<li>" + (icon || "") + t + "</li>";
    }).join("") + '</ul>';
  }

  function linksHtml(l) {
    var links = (l.chapters || []).map(function (id) {
      var c = CHAPTERS[id];
      return c ? '<a class="btn ghost sm" href="chapter.html?ch=' + id + '">' + c.no + " " + c.title + ' →</a>' : "";
    }).join("");
    var practice = (l.chapters || []).map(function (id) {
      return CHAPTERS[id] ? '<a class="btn sm" href="chapter.html?ch=' + id + '#practice">做第 ' + CHAPTERS[id].no + ' 章练习 →</a>' : "";
    }).join("");
    return '<div class="lec-links">' + links + practice + '</div>';
  }

  function renderDetail() {
    var app = document.getElementById("lectureApp");
    if (!app) return;
    var id = new URLSearchParams(location.search).get("l") || "l1";
    if (/^\d+$/.test(id)) id = "l" + id;
    var l = ALL.filter(function (x) { return x.id === id; })[0];
    if (!l) {
      app.innerHTML = '<div class="card"><h3>没有找到这一讲</h3><p>链接可能有误，回<a href="lectures.html">18 讲目录</a>重新选择。</p></div>';
      return;
    }

    var done = doneSet();
    var idx = ALL.indexOf(l);
    var prev = idx > 0 ? ALL[idx - 1] : null;
    var next = idx < ALL.length - 1 ? ALL[idx + 1] : null;
    var isDone = done.has(l.id);

    document.title = "第 " + l.no + " 讲 " + l.title + " | 高数 18 讲 | 研数";
    var desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", "高数第 " + l.no + " 讲 " + l.title + "：知识结构、概念精讲、题型方法、精讲例题与自测清单。");

    var side = document.getElementById("lecSide");
    if (side) side.innerHTML = sideHtml(l, done);

    app.innerHTML =
      '<header class="lec-head">' +
        '<p class="eyebrow">高等数学 · 第 ' + l.no + ' 讲 · 参考书 p.' + l.bookPage + '</p>' +
        '<h1>' + l.title + '</h1>' +
        '<p class="lede">' + l.intro + '</p>' +
        examHtml(l) +
        '<div class="hero-actions">' +
          '<button class="btn" type="button" id="lecDone">' + (isDone ? "已掌握 ✓（点击取消）" : "标记本讲已掌握") + '</button>' +
          '<a class="btn ghost" href="#examples">直接看例题</a>' +
          '<a class="btn ghost" href="lectures.html">回 18 讲目录</a>' +
        '</div>' +
      '</header>' +

      '<div class="toc">' +
        '<span class="toc-label">本讲目录</span>' +
        '<a href="#structure">知识结构</a>' +
        '<a href="#concepts">概念精讲</a>' +
        '<a href="#methods">题型方法</a>' +
        '<a href="#examples">精讲例题</a>' +
        '<a href="#conclusions">二级结论</a>' +
        '<a href="#pitfalls">避坑</a>' +
        '<a href="#selfcheck">自测</a>' +
      '</div>' +

      '<h2 class="sec" id="structure">知识结构 <span class="en">STRUCTURE</span></h2>' +
      '<p class="muted">先看全貌：这一讲由哪些块组成，每块对应什么题型。看不懂细节没关系，先知道「有什么」。</p>' +
      treeHtml(l) +

      '<h2 class="sec" id="concepts">概念精讲 <span class="en">CONCEPTS</span></h2>' +
      '<p class="muted">定义不是背的，是拿来判断的。每段都写清「为什么这样定义、条件缺了会怎样、常见反例是什么」。</p>' +
      conceptsHtml(l) +

      '<h2 class="sec" id="methods">题型方法 <span class="en">METHODS</span></h2>' +
      '<p class="muted">先认信号，再选方法。每条方法卡都能点开：信号 → 为什么 → 标准步骤 → 小例子。</p>' +
      '<div class="lec-methods">' + (l.methods || []).map(methodHtml).join("") + '</div>' +

      '<h2 class="sec" id="examples">精讲例题 <span class="en">EXAMPLES</span></h2>' +
      '<p class="muted">遮住步骤，先自己写「第一眼为什么这样想」，再对照步骤。只看懂不算会。</p>' +
      examplesHtml(l) +

      '<h2 class="sec" id="conclusions">二级结论 <span class="en">CONCLUSIONS</span></h2>' +
      '<p class="muted">这些结论不替代定义，但能让你在选填和计算里少走弯路。用之前先确认条件。</p>' +
      conclusionsHtml(l) +

      '<h2 class="sec" id="pitfalls">本讲避坑 <span class="en">PITFALLS</span></h2>' +
      '<div class="callout warn"><div class="co-title">⚠️ 错题时回来对一遍</div>' + listHtml(l.pitfalls) + '</div>' +

      '<h2 class="sec" id="selfcheck">自测清单 <span class="en">SELF CHECK</span></h2>' +
      '<div class="callout ok"><div class="co-title">✅ 能全部打勾，再进入下一讲</div>' + listHtml(l.selfCheck, "lec-check", "☐ ") + '</div>' +
      linksHtml(l) +

      '<div class="chapter-nav">' +
        (prev ? '<a class="chapter-nav-link" href="lecture.html?l=' + prev.id + '"><span>上一讲</span><b>第 ' + prev.no + ' 讲 ' + prev.title + '</b></a>' : "<span></span>") +
        '<a class="chapter-nav-link center-link" href="lectures.html">回 18 讲目录</a>' +
        (next ? '<a class="chapter-nav-link" href="lecture.html?l=' + next.id + '"><span>下一讲</span><b>第 ' + next.no + ' 讲 ' + next.title + '</b></a>' : "<span></span>") +
      '</div>';

    var btn = document.getElementById("lecDone");
    if (btn) {
      btn.addEventListener("click", function () {
        var set = doneSet();
        if (set.has(l.id)) set.delete(l.id); else set.add(l.id);
        saveDone(set);
        renderDetail();
      });
    }
  }

  function boot() {
    if (document.getElementById("lectureList")) renderIndex();
    if (document.getElementById("lectureApp")) renderDetail();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
