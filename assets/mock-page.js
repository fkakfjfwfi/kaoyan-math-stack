/* 研数 · 全真模拟卷渲染与判分 */
(function () {
  "use strict";

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var app = document.getElementById("mockApp");
  if (!app || !window.MATH_MOCK) return;

  var MOCK = window.MATH_MOCK;
  var BANK = window.MATH_BANK || [];
  var byId = {};
  BANK.forEach(function (q) { byId[q.id] = q; });
  var choiceQs = MOCK.choiceIds.map(function (id) { return byId[id]; }).filter(Boolean);
  var FILL = MOCK.fill || [];
  var SOL = MOCK.solution || [];
  var DURATION = 180 * 60;
  var TOTAL = 150;
  var state = {
    started: false,
    submitted: false,
    remaining: DURATION,
    timer: null,
    choice: {},
    fill: {},
    grades: {},
    revealed: {}
  };

  function escapeHTML(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function fmtClock(sec) {
    var h = Math.floor(sec / 3600);
    var m = Math.floor((sec % 3600) / 60);
    var s = sec % 60;
    var pad = function (n) { return String(n).padStart(2, "0"); };
    return pad(h) + ":" + pad(m) + ":" + pad(s);
  }

  function renderStart() {
    app.innerHTML =
      '<header class="hero">' +
        '<p class="eyebrow">全真模拟 · 数学一 · 150 分</p>' +
        '<h1>一次完整的上场演练</h1>' +
        '<p class="lede">严格按 2027 数一结构组卷：10 道单选 50 分、6 道填空 30 分、6 道解答 70 分，180 分钟计时。选择题和填空题自动判分，解答题对答案后按步骤自评。</p>' +
        '<p class="tagline">150 分 · 180 分钟 · 22 题 · 90 分 = 60% 线</p>' +
      '</header>' +
      '<div class="grid cols-2">' +
        '<div class="card"><h3>考试规则</h3><ul><li>选择 10 × 5 = 50 分，填空 6 × 5 = 30 分，解答 6 题 = 70 分。</li><li>建议按「选填 55 分钟 + 解答 115 分钟 + 检查 10 分钟」分配。</li><li>解答题先在纸上写完整步骤，再对答案自评，不要只写答案。</li><li>刷新页面会重置本次模拟；建议一次做完。</li></ul></div>' +
        '<div class="card"><h3>判分方式</h3><ul><li>选择题：点击选项，交卷后自动判分。</li><li>填空题：填写数值，交卷后按数值比较。</li><li>解答题：点击「对答案 / 自评」，按步骤给自己 0 / 部分 / 满分。</li><li>90 / 150 分相当于 100 分制的 60 分。</li></ul></div>' +
      '</div>' +
      '<div class="callout exam"><div class="co-title">📌 先做诊断，再来模拟</div><p style="margin-bottom:0">如果 20 题诊断还没到 60 分，建议先回章节页补基础，再用这套模拟验收。模拟分数低不代表没救，先看是选填丢分还是解答步骤丢分。</p></div>' +
      '<p class="muted small">说明：选择题来自章内题库，填空与解答为新编题；重点是结构演练与 180 分钟时间分配。</p>' +
      '<p class="center" style="margin-top:24px"><button class="btn" id="startMock" type="button">开始模拟 · 180 分钟 →</button></p>';
    $("#startMock").addEventListener("click", start);
  }

  function renderExam() {
    var choiceHtml = choiceQs.map(function (q, i) {
      var opts = q.options.map(function (opt, oi) {
        return '<button class="opt mock-opt" type="button" data-choice="' + q.id + '" data-i="' + oi + '"><b>' + "ABCD"[oi] + '</b><span>' + escapeHTML(opt) + "</span></button>";
      }).join("");
      return '<article class="quiz mock-q" data-qid="' + q.id + '">' +
        '<div class="q-head"><div class="q-tag"><span class="q-lvl ' + q.level + '">选择</span><span>' + escapeHTML(q.chapter) + '</span></div><div class="q-title"><b>' + (i + 1) + ".</b> " + escapeHTML(q.q) + '</div></div>' +
        '<div class="opts">' + opts + '</div>' +
      '</article>';
    }).join("");

    var fillHtml = FILL.map(function (item, i) {
      return '<article class="quiz mock-q" data-fill-card="' + item.id + '">' +
        '<div class="q-head"><div class="q-tag"><span class="q-lvl basic">填空</span><span>第 ' + (i + 1) + ' 题 · ' + item.points + ' 分</span></div><div class="q-title"><b>' + (11 + i) + ".</b> " + escapeHTML(item.q) + '</div></div>' +
        '<div class="mock-fill"><input class="mock-input" type="text" inputmode="decimal" autocomplete="off" data-fill="' + item.id + '" placeholder="填写数值答案"></div>' +
      '</article>';
    }).join("");

    var solHtml = SOL.map(function (item, i) {
      var steps = (item.steps || []).map(function (s) { return "<li>" + escapeHTML(s) + "</li>"; }).join("");
      return '<article class="quiz mock-q" data-sol-card="' + item.id + '">' +
        '<div class="q-head"><div class="q-tag"><span class="q-lvl mid">解答</span><span>第 ' + (i + 1) + ' 题 · ' + item.points + ' 分</span></div><div class="q-title"><b>' + (17 + i) + ".</b> " + escapeHTML(item.q) + '</div></div>' +
        '<div class="q-foot"><button class="btn-ans" type="button" data-reveal="' + item.id + '">对答案 / 自评</button><span class="q-res" data-grade-label="' + item.id + '">未自评</span></div>' +
        '<div class="q-exp" id="sol-exp-' + item.id + '"><b>答案：</b>' + escapeHTML(item.answer) + '<ol class="mock-steps">' + steps + "</ol></div>" +
        '<div class="mock-grade" data-grade-box="' + item.id + '" hidden><span>自评：</span>' +
          '<button type="button" data-grade="' + item.id + '" data-points="0">0 分</button>' +
          '<button type="button" data-grade="' + item.id + '" data-points="half">部分分</button>' +
          '<button type="button" data-grade="' + item.id + '" data-points="full">满分</button>' +
        '</div>' +
      '</article>';
    }).join("");

    app.innerHTML =
      '<div class="mock-timer" id="mockTimerBar"><div class="mock-clock"><span>剩余时间</span><b id="mockClock">03:00:00</b></div>' +
        '<div class="mock-timer-actions"><span class="muted small">选择/填空自动判分，解答题自评</span><button class="btn sm" id="submitMock" type="button">交卷</button></div>' +
      '</div>' +
      '<header class="hero mock-hero"><p class="eyebrow">2027 数学一 · 全真模拟</p><h1>150 分 · 180 分钟</h1><p class="lede">先把会做的做对，再回头啃难题。选填控制在 55 分钟内，解答题写完整步骤。</p></header>' +
      '<h2 class="sec">一、单项选择题 <span class="en">10 × 5 = 50</span></h2>' + choiceHtml +
      '<h2 class="sec">二、填空题 <span class="en">6 × 5 = 30</span></h2>' + fillHtml +
      '<h2 class="sec">三、解答题 <span class="en">6 题 · 70 分</span></h2>' + solHtml +
      '<div class="callout"><b>交卷前检查：</b>选择题是否全部选择、填空题是否填写、解答题是否完成自评。未自评的解答题按 0 分计。</div>' +
      '<p class="center" style="margin-top:18px"><button class="btn" id="submitMockBottom" type="button">交卷并查看成绩 →</button></p>';

    bindExam();
    updateClock();
  }

  function bindExam() {
    $$(".mock-opt").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (state.submitted) return;
        var id = btn.getAttribute("data-choice");
        var idx = Number(btn.getAttribute("data-i"));
        state.choice[id] = idx;
        $$('.mock-opt[data-choice="' + id + '"]').forEach(function (b) {
          b.classList.toggle("sel", Number(b.getAttribute("data-i")) === idx);
        });
      });
    });

    $$(".mock-input").forEach(function (input) {
      input.addEventListener("input", function () {
        state.fill[input.getAttribute("data-fill")] = input.value;
      });
    });

    $$("[data-reveal]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-reveal");
        var exp = document.getElementById("sol-exp-" + id);
        var box = document.querySelector('[data-grade-box="' + id + '"]');
        if (!exp || !box) return;
        state.revealed[id] = true;
        exp.classList.toggle("show");
        box.hidden = !exp.classList.contains("show");
        btn.textContent = exp.classList.contains("show") ? "收起解析" : "对答案 / 自评";
      });
    });

    $$("[data-grade]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (state.submitted) return;
        var id = btn.getAttribute("data-grade");
        var kind = btn.getAttribute("data-points");
        var item = SOL.filter(function (s) { return s.id === id; })[0];
        if (!item) return;
        var points = kind === "full" ? item.points : kind === "half" ? Math.round(item.points / 2) : 0;
        state.grades[id] = points;
        $$('[data-grade="' + id + '"]').forEach(function (b) { b.classList.toggle("on", b === btn); });
        var label = document.querySelector('[data-grade-label="' + id + '"]');
        if (label) label.textContent = "已自评 " + points + " / " + item.points + " 分";
      });
    });

    var top = $("#submitMock");
    var bottom = $("#submitMockBottom");
    if (top) top.addEventListener("click", function () { submit(false); });
    if (bottom) bottom.addEventListener("click", function () { submit(false); });
  }

  function start() {
    if (state.started) return;
    state.started = true;
    state.submitted = false;
    state.remaining = DURATION;
    renderExam();
    window.scrollTo(0, 0);
    state.timer = setInterval(function () {
      state.remaining -= 1;
      if (state.remaining <= 0) {
        state.remaining = 0;
        updateClock();
        clearInterval(state.timer);
        submit(true);
        return;
      }
      updateClock();
    }, 1000);
    window.addEventListener("beforeunload", function (ev) {
      if (state.started && !state.submitted) {
        ev.preventDefault();
        ev.returnValue = "";
      }
    });
  }

  function updateClock() {
    var clock = $("#mockClock");
    if (!clock) return;
    clock.textContent = fmtClock(state.remaining);
    var bar = $("#mockTimerBar");
    if (bar) bar.classList.toggle("urgent", state.remaining <= 300);
  }

  function normalize(value) {
    return String(value == null ? "" : value).trim().replace(/\s+/g, "").replace(/，/g, ",").replace(/－/g, "-");
  }

  function toNumber(value) {
    var s = normalize(value);
    if (/^-?\d+(\.\d+)?$/.test(s)) return Number(s);
    var m = s.match(/^(-?\d+)\/(-?\d+)$/);
    if (m) {
      var denominator = Number(m[2]);
      if (denominator !== 0) return Number(m[1]) / denominator;
    }
    return NaN;
  }

  function fillCorrect(value, answer) {
    var a = toNumber(value);
    var b = toNumber(answer);
    if (!isNaN(a) && !isNaN(b)) return Math.abs(a - b) < 1e-6;
    return normalize(value) === normalize(answer);
  }

  function submit(auto) {
    if (!state.started || state.submitted) return;

    var unanswered = 0;
    choiceQs.forEach(function (q) { if (state.choice[q.id] === undefined) unanswered += 1; });
    FILL.forEach(function (item) { if (!normalize(state.fill[item.id])) unanswered += 1; });
    SOL.forEach(function (item) { if (state.grades[item.id] === undefined) unanswered += 1; });

    if (!auto && unanswered > 0 && !confirm("还有 " + unanswered + " 题未完成或未自评，确定交卷？未自评的解答题按 0 分计。")) {
      return;
    }

    state.submitted = true;
    if (state.timer) clearInterval(state.timer);

    var choiceScore = 0;
    var choiceDetails = [];
    choiceQs.forEach(function (q) {
      var selected = state.choice[q.id];
      var ok = selected === q.answer;
      if (ok) choiceScore += 5;
      choiceDetails.push({ q: q, selected: selected, ok: ok });
    });

    var fillScore = 0;
    var fillDetails = [];
    FILL.forEach(function (item) {
      var value = state.fill[item.id] || "";
      var ok = fillCorrect(value, item.answer);
      if (ok) fillScore += item.points;
      fillDetails.push({ item: item, value: value, ok: ok });
    });

    var solutionScore = 0;
    SOL.forEach(function (item) { solutionScore += state.grades[item.id] || 0; });

    var total = choiceScore + fillScore + solutionScore;
    var pct = Math.round(total / TOTAL * 100);
    var pass = total >= 90;

    var details = choiceDetails.map(function (d, i) {
      return "<li><b>第 " + (i + 1) + " 题</b> " + (d.ok ? "✅" : "❌") +
        " 你的答案 " + (d.selected === undefined ? "未答" : "ABCD"[d.selected]) +
        "，正确 " + "ABCD"[d.q.answer] + "。" + escapeHTML(d.q.exp) + "</li>";
    }).join("") + fillDetails.map(function (d, i) {
      return "<li><b>填空 " + (i + 1) + "</b> " + (d.ok ? "✅" : "❌") +
        " 你的答案 " + (d.value || "未填") + "，正确 " + escapeHTML(d.item.answer) + "。" + escapeHTML(d.item.exp) + "</li>";
    }).join("");

    var html =
      '<div class="mock-result ' + (pass ? "pass" : "fail") + '">' +
        '<div class="mock-score"><b>' + total + '</b><span>/150</span><em>' + pct + '%</em></div>' +
        '<p class="mock-verdict">' + (pass ? "达到 60% 线（90/150）" : "未达 60% 线（90/150）") + (auto ? " · 时间到自动交卷" : "") + '</p>' +
        '<div class="mock-breakdown">' +
          '<div><b>' + choiceScore + '</b><span>选择 / 50</span></div>' +
          '<div><b>' + fillScore + '</b><span>填空 / 30</span></div>' +
          '<div><b>' + solutionScore + '</b><span>解答 / 70</span></div>' +
        '</div>' +
        '<p class="mock-advice">' + (pass
          ? "基础分已经拿到。下一步看丢分是在选填还是解答步骤，再回错题和章节页补。"
          : "先别刷新重做。回章节页把错得最多的两章重看一遍，再做基础卷，最后回来重测。") + '</p>' +
        '<details class="mock-details"><summary>查看选择题与填空题答案</summary><ul>' + details + '</ul></details>' +
        '<div class="mock-actions"><button class="btn sm" id="retryMock" type="button">重新开始</button><a class="btn ghost sm" href="practice.html#diagnostic">去做 20 题诊断</a></div>' +
      '</div>';

    app.insertAdjacentHTML("afterbegin", html);
    var bar = $("#mockTimerBar");
    if (bar) {
      bar.innerHTML = '<div class="mock-clock"><span>状态</span><b>已交卷</b></div><div class="mock-timer-actions"><span class="muted small">成绩见上方</span></div>';
    }
    $$(".mock-opt").forEach(function (b) { b.disabled = true; });
    $$(".mock-input").forEach(function (i) { i.disabled = true; });
    $$("[data-reveal]").forEach(function (b) { b.disabled = true; });
    $$("[data-grade]").forEach(function (b) { b.disabled = true; });
    var retry = $("#retryMock");
    if (retry) retry.addEventListener("click", function () { location.reload(); });
    window.scrollTo(0, 0);
  }

  renderStart();
})();
