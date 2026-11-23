/* 研数 · 共享逻辑：明暗主题 / 导航高亮 / 打卡 / 题库 HUD / 练习场 / 公式速查 */
(function () {
  "use strict";

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  function escapeHTML(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function loadJSON(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (err) {
      return fallback;
    }
  }

  function saveJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      return false;
    }
  }

  var storageOK = (function () {
    try {
      var k = "__yanshu_probe__";
      localStorage.setItem(k, "1");
      var ok = localStorage.getItem(k) === "1";
      localStorage.removeItem(k);
      return ok;
    } catch (err) {
      return false;
    }
  })();

  /* ── 主题 ── */
  var THEME_KEY = "yanshu.theme";
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    var btn = $(".theme-btn");
    if (btn) {
      btn.textContent = theme === "dark" ? "☀️" : "🌙";
      btn.title = theme === "dark" ? "切换到明亮主题" : "切换到暗色主题";
    }
  }
  applyTheme(loadJSON(THEME_KEY, "light"));

  document.addEventListener("click", function (ev) {
    var btn = ev.target.closest(".theme-btn");
    if (!btn) return;
    var current = document.documentElement.getAttribute("data-theme") || "light";
    var next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    saveJSON(THEME_KEY, next);
    document.dispatchEvent(new CustomEvent("themechange"));
  });

  /* ── 导航高亮 ── */
  var path = location.pathname.split("/").pop() || "index.html";
  $$(".nav-links a").forEach(function (a) {
    if (a.getAttribute("href") === path) a.classList.add("active");
  });

  /* ── 打卡清单 ── */
  var CK_KEY = "yanshu.checklist.v2";
  var CK_RE = /^(gs1|gs2|xd|gl|mth)-[1-6]$/;

  function loadCK() {
    var state = loadJSON(CK_KEY, {});
    return state && typeof state === "object" ? state : {};
  }

  function refreshChecklist() {
    var state = loadCK();
    var items = $$(".check-item");
    var done = 0;
    items.forEach(function (item) {
      var id = item.getAttribute("data-ck");
      var box = item.querySelector("input[type=checkbox]");
      var checked = !!(id && state[id]);
      if (checked) done += 1;
      item.classList.toggle("done", checked);
      if (box) box.checked = checked;
    });
    $$("[data-ck-page]").forEach(function (el) {
      el.textContent = done + " / " + items.length + " 已打卡";
    });
    var total = 0;
    Object.keys(state).forEach(function (k) {
      if (CK_RE.test(k) && state[k] === true) total += 1;
    });
    $$("[data-ck-total]").forEach(function (el) {
      var max = parseInt(el.getAttribute("data-ck-total"), 10) || 30;
      el.textContent = total + " / " + max + " 项已打卡";
    });
  }

  document.addEventListener("change", function (ev) {
    var box = ev.target.closest(".check-item input[type=checkbox]");
    if (!box) return;
    var item = box.closest(".check-item");
    var id = item.getAttribute("data-ck");
    if (!id) return;
    var state = loadCK();
    state[id] = box.checked;
    if (!saveJSON(CK_KEY, state)) {
      if (window.console) console.warn("打卡状态保存失败：localStorage 不可用");
    }
    item.classList.toggle("done", box.checked);
    refreshChecklist();
  });

  /* ── 题库持久化 ── */
  var QS_KEY = "yanshu.qstats.v1";
  var FAV_KEY = "yanshu.fav.v1";
  var qstats = loadJSON(QS_KEY, {});
  var favs = loadJSON(FAV_KEY, {});
  if (!qstats || typeof qstats !== "object") qstats = {};
  if (!favs || typeof favs !== "object") favs = {};

  function persistQS() {
    return saveJSON(QS_KEY, qstats);
  }
  function persistFav() {
    return saveJSON(FAV_KEY, favs);
  }

  var LEVEL_LABEL = { basic: "基础", mid: "提高", real: "真题改编" };
  var SUBJECT_LABEL = { 高数: "高等数学", 线代: "线性代数", 概率: "概率统计" };

  function buildCard(q, index) {
    var level = LEVEL_LABEL[q.level] || "练习";
    var options = q.options.map(function (opt, i) {
      return '<button class="opt" type="button" data-opt="' + i + '"><b>' + "ABCD"[i] + '</b><span>' + escapeHTML(opt) + "</span></button>";
    }).join("");
    var card = document.createElement("article");
    card.className = "quiz";
    card.setAttribute("data-qid", q.id);
    card.setAttribute("data-answer", String(q.answer));
    card.innerHTML =
      '<div class="q-head">' +
        '<div class="q-tag">' +
          '<span class="q-lvl ' + q.level + '">' + level + '</span>' +
          '<span>' + escapeHTML(SUBJECT_LABEL[q.subject] || q.subject) + ' · ' + escapeHTML(q.chapter) + '</span>' +
        '</div>' +
        '<div class="q-title"><b>' + (index + 1) + ".</b> " + escapeHTML(q.q) + '</div>' +
      '</div>' +
      '<div class="opts">' + options + '</div>' +
      '<div class="q-foot">' +
        '<button class="btn-ans" type="button">提交答案</button>' +
        '<span class="q-res"></span>' +
      '</div>' +
      '<div class="q-exp"><b>解析：</b>' + escapeHTML(q.exp) + '</div>' +
      '<button class="q-fav" type="button" title="收藏这道题">☆</button>';
    return card;
  }

  function mountQuiz(container, questions) {
    container.innerHTML = "";
    if (!questions || !questions.length) {
      container.innerHTML = '<div class="quiz-empty">当前筛选下没有题目，换一套卷或切换科目试试。</div>';
      return;
    }

    var hud = document.createElement("div");
    hud.className = "quiz-hud";
    hud.innerHTML =
      '<div class="hud-stats">' +
        '<span>已答 <b class="hud-n">0</b> / ' + questions.length + '</span>' +
        '<span>正确率 <b class="hud-acc">—</b></span>' +
        '<span class="hud-wrong">错题 <b>0</b></span>' +
        '<span class="hud-fav">收藏 <b>0</b></span>' +
        '<span class="hud-auto">进度自动保存在本机</span>' +
      '</div>' +
      '<div class="hud-actions">' +
        '<button type="button" data-hud="wrong">只看错题</button>' +
        '<button type="button" data-hud="fav">只看收藏</button>' +
        '<button type="button" data-hud="random">随机 10 题</button>' +
        '<button type="button" data-hud="all" class="on">显示全部</button>' +
        '<button type="button" data-hud="reset">重置进度</button>' +
      '</div>' +
      '<div class="hud-msg"></div>' +
      '<div class="hud-warn"></div>';

    var list = document.createElement("div");
    list.className = "quiz-list";

    var cards = questions.map(function (q, i) {
      var card = buildCard(q, i);
      list.appendChild(card);
      return { q: q, el: card };
    });

    container.appendChild(hud);
    container.appendChild(list);

    var mode = "all";
    var msgTimer = null;

    function recOf(q) {
      var r = qstats[q.id];
      return r && typeof r === "object" ? r : null;
    }

    function announce(message, bad) {
      var el = hud.querySelector(".hud-msg");
      if (!el) return;
      el.textContent = message;
      el.classList.toggle("bad", !!bad);
      el.classList.add("show");
      clearTimeout(msgTimer);
      msgTimer = setTimeout(function () { el.classList.remove("show"); }, 2800);
    }

    function refreshHud() {
      var answered = 0;
      var correct = 0;
      var wrong = 0;
      var fav = 0;
      questions.forEach(function (q) {
        var r = recOf(q);
        if (r && (r.r === 0 || r.r === 1)) {
          answered += 1;
          if (r.r === 1) correct += 1;
          else wrong += 1;
        }
        if (favs[q.id]) fav += 1;
      });
      var nEl = hud.querySelector(".hud-n");
      var accEl = hud.querySelector(".hud-acc");
      var wrongEl = hud.querySelector(".hud-wrong b");
      var favEl = hud.querySelector(".hud-fav b");
      if (nEl) nEl.textContent = answered;
      if (accEl) accEl.textContent = answered ? Math.round(correct / answered * 100) + "%" : "—";
      if (wrongEl) wrongEl.textContent = wrong;
      if (favEl) favEl.textContent = fav;
      var warn = hud.querySelector(".hud-warn");
      if (warn && !storageOK) {
        warn.style.display = "block";
        warn.textContent = "⚠️ 浏览器禁用了本地存储（无痕模式？），答题进度与打卡无法保存。";
      }
    }

    function applyMode(next) {
      mode = next;
      var show = cards.slice();
      if (mode === "wrong") {
        show = cards.filter(function (c) { var r = recOf(c.q); return r && r.r === 0; });
      } else if (mode === "fav") {
        show = cards.filter(function (c) { return !!favs[c.q.id]; });
      } else if (mode === "random") {
        show = cards.slice();
        for (var i = show.length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1));
          var t = show[i]; show[i] = show[j]; show[j] = t;
        }
        show = show.slice(0, Math.min(10, show.length));
      }
      cards.forEach(function (c) {
        c.el.style.display = show.indexOf(c) >= 0 ? "" : "none";
      });
      $$("[data-hud]", hud).forEach(function (b) {
        var m = b.getAttribute("data-hud");
        b.classList.toggle("on", m === mode);
      });
      if (mode === "wrong" && !show.length) announce("错题本是空的 —— 继续保持！");
      if (mode === "fav" && !show.length) announce("还没有收藏题 —— 点题卡右上角的 ☆");
      if (mode === "random") announce("已随机抽取 " + show.length + " 题");
      if (mode === "all") announce("已显示全部 " + cards.length + " 题");
      refreshHud();
    }

    cards.forEach(function (entry) {
      var q = entry.q;
      var card = entry.el;
      var opts = $$(".opt", card);
      var res = $(".q-res", card);
      var exp = $(".q-exp", card);
      var ansBtn = $(".btn-ans", card);
      var favBtn = $(".q-fav", card);
      var selected = null;
      var done = false;

      function paintSelected(value) {
        opts.forEach(function (o) {
          o.classList.toggle("sel", Number(o.getAttribute("data-opt")) === value);
        });
      }

      function lockOptions() {
        opts.forEach(function (o) { o.disabled = true; });
      }

      function showAnswer(record) {
        opts.forEach(function (o) {
          var value = Number(o.getAttribute("data-opt"));
          o.classList.toggle("right", value === q.answer);
          o.classList.toggle("wrong", !!record && record.d === value && value !== q.answer);
        });
        if (res) {
          if (record && record.r === 1) {
            res.textContent = "✅ 上次答对（已保存）";
            res.className = "q-res good";
          } else if (record && record.r === 0) {
            res.textContent = "❌ 上次答错（正确答案 " + "ABCD"[q.answer] + "）";
            res.className = "q-res bad";
          }
        }
        if (ansBtn) ansBtn.textContent = "查看解析";
        lockOptions();
        done = true;
      }

      var record = recOf(q);
      if (record && (record.r === 0 || record.r === 1)) {
        showAnswer(record);
      }

      if (favs[q.id]) {
        favBtn.classList.add("on");
        favBtn.textContent = "★";
      }

      opts.forEach(function (opt) {
        opt.addEventListener("click", function () {
          if (done) return;
          selected = Number(opt.getAttribute("data-opt"));
          paintSelected(selected);
          if (res) {
            res.textContent = "已选择 " + "ABCD"[selected] + "，点「提交答案」判分";
            res.className = "q-res";
          }
        });
      });

      favBtn.addEventListener("click", function () {
        if (favs[q.id]) {
          delete favs[q.id];
          favBtn.classList.remove("on");
          favBtn.textContent = "☆";
        } else {
          favs[q.id] = 1;
          favBtn.classList.add("on");
          favBtn.textContent = "★";
        }
        if (!persistFav()) announce("⚠️ 收藏保存失败：本地存储不可用", true);
        refreshHud();
      });

      ansBtn.addEventListener("click", function () {
        if (done) {
          exp.classList.toggle("show");
          ansBtn.textContent = exp.classList.contains("show") ? "收起解析" : "查看解析";
          return;
        }
        if (selected === null) {
          if (res) { res.textContent = "先选一个答案再提交"; res.className = "q-res"; }
          return;
        }
        var ok = selected === q.answer;
        qstats[q.id] = { r: ok ? 1 : 0, d: selected };
        persistQS();
        opts.forEach(function (o) {
          var value = Number(o.getAttribute("data-opt"));
          o.classList.toggle("right", value === q.answer);
          o.classList.toggle("wrong", value === selected && value !== q.answer);
        });
        if (res) {
          res.textContent = ok ? "✅ 答对了！" : "❌ 答错了，正确答案是 " + "ABCD"[q.answer];
          res.className = "q-res " + (ok ? "good" : "bad");
        }
        exp.classList.add("show");
        ansBtn.textContent = "收起解析";
        lockOptions();
        done = true;
        refreshHud();
        announce(ok ? "已保存 ✓" : "已保存 ✓ 并收入错题本，可点「只看错题」重做");
      });
    });

    hud.addEventListener("click", function (ev) {
      var btn = ev.target.closest("[data-hud]");
      if (!btn) return;
      var m = btn.getAttribute("data-hud");
      if (m === "reset") {
        if (!confirm("确定清空当前这一组题的答题进度？收藏不受影响。")) return;
        questions.forEach(function (q) { delete qstats[q.id]; });
        persistQS();
        mountQuiz(container, questions);
        return;
      }
      applyMode(m);
    });

    refreshHud();
  }

  /* ── 章节页自动挂载 ── */
  function initChapterQuizzes() {
    var bank = window.MATH_BANK || [];
    $$("[data-quiz]").forEach(function (container) {
      var ids = (container.getAttribute("data-chapters") || "").split(",").filter(Boolean);
      var subject = container.getAttribute("data-subject");
      var questions = bank.filter(function (q) {
        if (ids.length && ids.indexOf(q.chapterId) === -1) return false;
        if (subject && subject !== "全部" && q.subject !== subject) return false;
        return true;
      });
      mountQuiz(container, questions);
    });
  }

  /* ── 练习场 ── */
  var PAPERS = {
    basic: { title: "基础卷", count: 12, minutes: 25, levels: ["basic"], desc: "概念与基本计算，学完一章就来做。" },
    mid: { title: "提高卷", count: 12, minutes: 30, levels: ["mid"], desc: "辨析与综合计算，二轮复习用。" },
    real: { title: "真题改编卷", count: 10, minutes: 35, levels: ["real", "mid"], desc: "按真题题型改编，覆盖高频考点。" },
    mock: { title: "全真模拟卷", count: 16, minutes: 45, levels: ["basic", "mid", "real"], desc: "三科混合，模拟考场节奏。" }
  };

  function shuffle(arr) {
    var copy = arr.slice();
    for (var i = copy.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = copy[i]; copy[i] = copy[j]; copy[j] = t;
    }
    return copy;
  }

  function buildPaper(kind, subject) {
    var bank = window.MATH_BANK || [];
    var meta = PAPERS[kind] || PAPERS.basic;
    var pool = bank.filter(function (q) { return meta.levels.indexOf(q.level) !== -1; });
    if (kind === "real") {
      var real = bank.filter(function (q) { return q.level === "real"; });
      var mid = bank.filter(function (q) { return q.level === "mid"; });
      pool = shuffle(real.concat(shuffle(mid).slice(0, Math.max(0, meta.count - real.length))));
    } else if (kind === "mock") {
      // 模拟卷按三科均衡抽题：高数 8、线代 4、概率 4
      var bySubject = { 高数: [], 线代: [], 概率: [] };
      bank.forEach(function (q) { if (bySubject[q.subject]) bySubject[q.subject].push(q); });
      pool = shuffle(
        shuffle(bySubject["高数"]).slice(0, 8)
          .concat(shuffle(bySubject["线代"]).slice(0, 4))
          .concat(shuffle(bySubject["概率"]).slice(0, 4))
      );
    } else {
      pool = shuffle(pool);
    }
    if (subject && subject !== "全部") {
      pool = pool.filter(function (q) { return q.subject === subject; });
    }
    return pool.slice(0, meta.count);
  }

  function initPractice() {
    var grid = document.getElementById("paperGrid");
    var target = document.getElementById("practiceQuiz");
    if (!grid || !target) return;

    var state = { paper: "basic", subject: "全部" };
    var current = [];

    function mountCurrent() {
      current = buildPaper(state.paper, state.subject);
      mountQuiz(target, current);
      var meta = PAPERS[state.paper];
      var msg = document.getElementById("bankMsg");
      if (msg) {
        var subjectText = state.subject === "全部" ? "三科混合" : (SUBJECT_LABEL[state.subject] || state.subject);
        msg.textContent = meta.title + " · " + subjectText +
          " · 共 " + current.length + " 题 · 建议 " + meta.minutes + " 分钟";
      }
    }

    $$(".paper-card", grid).forEach(function (card) {
      card.addEventListener("click", function () {
        state.paper = card.getAttribute("data-paper");
        $$(".paper-card", grid).forEach(function (c) { c.classList.toggle("on", c === card); });
        mountCurrent();
        var anchor = document.getElementById("bankAnchor");
        if (anchor) anchor.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });

    var filter = document.getElementById("subjectFilter");
    if (filter) {
      $$("button", filter).forEach(function (btn) {
        btn.addEventListener("click", function () {
          state.subject = btn.getAttribute("data-subject");
          $$("button", filter).forEach(function (b) { b.classList.toggle("on", b === btn); });
          mountCurrent();
        });
      });
    }

    mountCurrent();
  }

  /* ── 公式速查 ── */
  function initFormulas() {
    var list = document.getElementById("formulaList");
    if (!list || !window.MATH_FORMULAS) return;
    var state = { cat: "全部", q: "" };
    var tabs = document.getElementById("formulaTabs");
    var search = document.getElementById("formulaSearch");
    var empty = document.getElementById("formulaEmpty");

    function render() {
      var items = window.MATH_FORMULAS.filter(function (f) {
        if (state.cat !== "全部" && f.cat !== state.cat) return false;
        var q = state.q.trim().toLowerCase();
        if (!q) return true;
        return (f.name + " " + f.formula + " " + f.note).toLowerCase().indexOf(q) !== -1;
      });
      list.innerHTML = items.map(function (f) {
        var copyText = f.name + "：" + f.formula;
        return '<div class="formula-row">' +
          '<div class="f-name">' + escapeHTML(f.name) + '</div>' +
          '<div class="f-main"><div class="f-body">' + escapeHTML(f.formula) + '</div>' +
          '<div class="f-note">' + escapeHTML(f.note) + '</div></div>' +
          '<button class="copy" type="button" data-copy="' + escapeHTML(copyText) + '">复制</button>' +
        '</div>';
      }).join("");
      if (empty) empty.hidden = items.length !== 0;
      $$(".copy", list).forEach(function (btn) {
        btn.addEventListener("click", function () {
          var text = btn.getAttribute("data-copy") || "";
          copyText(text).then(function (ok) {
            btn.textContent = ok ? "已复制" : "复制失败";
            setTimeout(function () { btn.textContent = "复制"; }, 1600);
          });
        });
      });
    }

    if (tabs) {
      $$(".tab", tabs).forEach(function (tab) {
        tab.addEventListener("click", function () {
          state.cat = tab.getAttribute("data-cat");
          $$(".tab", tabs).forEach(function (t) { t.classList.toggle("is-active", t === tab); });
          render();
        });
      });
    }
    if (search) {
      search.addEventListener("input", function () {
        state.q = search.value;
        render();
      });
    }
    render();
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(function () { return true; }).catch(function () { return fallbackCopy(text); });
    }
    return Promise.resolve(fallbackCopy(text));
  }

  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (err) { ok = false; }
    ta.remove();
    return ok;
  }

  /* ── 考试倒计时（首页） ── */
  function initCountdown() {
    var el = document.getElementById("cdDays");
    if (!el) return;
    function thirdSaturday(year) {
      var d = new Date(year, 11, 1);
      var count = 0;
      while (true) {
        if (d.getDay() === 6) {
          count += 1;
          if (count === 3) return new Date(d.getTime());
        }
        d.setDate(d.getDate() + 1);
      }
    }
    var now = new Date();
    var year = now.getFullYear();
    var sat = thirdSaturday(year);
    var exam = new Date(sat.getTime());
    exam.setDate(exam.getDate() + 1);
    exam.setHours(8, 30, 0, 0);
    if (now.getTime() >= exam.getTime()) {
      year += 1;
      sat = thirdSaturday(year);
      exam = new Date(sat.getTime());
      exam.setDate(exam.getDate() + 1);
      exam.setHours(8, 30, 0, 0);
    }
    el.textContent = String(Math.max(0, Math.ceil((exam.getTime() - now.getTime()) / 86400000)));
  }

  /* ── 启动 ── */
  function init() {
    refreshChecklist();
    initCountdown();
    initChapterQuizzes();
    initPractice();
    initFormulas();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
