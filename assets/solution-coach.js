/* 研数 · 交互题解：逐步解析 + 错因诊断 + 可拖拽图形 */
(function () {
  "use strict";

  var DATA = window.MATH_SOLUTIONS || {};

  function esc(v) {
    return String(v == null ? "" : v)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function has(id) { return !!DATA[id]; }

  function palette() {
    var s = getComputedStyle(document.documentElement);
    var g = function (k, fb) { return (s.getPropertyValue(k) || fb).trim() || fb; };
    return {
      ink: g("--ink", "#1a2230"), ink2: g("--ink-2", "#3d4757"), ink3: g("--ink-3", "#7d766a"),
      line: g("--line", "#e4ddcf"), brand: g("--brand", "#b03a2e"), accent: g("--accent", "#a97c24"),
      blue: g("--blue", "#1f4e6b"), green: g("--green", "#2f6b4f"), violet: g("--violet", "#5b4b8a"),
      card: g("--card", "#fffdf8"), soft: g("--card-2", "#faf7f0")
    };
  }

  function fmt(n, d) {
    if (!isFinite(n)) return "—";
    return Number(n).toFixed(d == null ? 3 : d);
  }

  /* ── 小画布工具 ── */
  function setup(cv) {
    var rect = cv.getBoundingClientRect();
    if (rect.width < 20) return null;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = Math.round(rect.width * dpr);
    cv.height = Math.round(rect.height * dpr);
    var c = cv.getContext("2d");
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { c: c, w: rect.width, h: rect.height };
  }

  function line(c, x1, y1, x2, y2, color, width, dash) {
    c.save();
    c.strokeStyle = color; c.lineWidth = width || 1;
    if (dash) c.setLineDash(dash);
    c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke();
    c.restore();
  }

  function dot(c, x, y, r, color) {
    c.beginPath(); c.arc(x, y, r || 4, 0, Math.PI * 2);
    c.fillStyle = color; c.fill();
  }

  function text(c, str, x, y, color, size, align, baseline) {
    c.save();
    c.fillStyle = color;
    c.font = (size || 10.5) + 'px "PingFang SC","Microsoft YaHei",system-ui,sans-serif';
    c.textAlign = align || "left";
    c.textBaseline = baseline || "middle";
    c.fillText(str, x, y);
    c.restore();
  }

  function map(w, h, pad, xmin, xmax, ymin, ymax) {
    var iw = w - pad.l - pad.r, ih = h - pad.t - pad.b;
    return {
      pad: pad, iw: iw, ih: ih,
      X: function (x) { return pad.l + (x - xmin) / (xmax - xmin) * iw; },
      Y: function (y) { return pad.t + (ymax - y) / (ymax - ymin) * ih; },
      xmin: xmin, xmax: xmax, ymin: ymin, ymax: ymax
    };
  }

  function axes(c, m, C) {
    var y0 = m.ymin <= 0 && m.ymax >= 0 ? m.Y(0) : m.Y(m.ymin);
    var x0 = m.xmin <= 0 && m.xmax >= 0 ? m.X(0) : m.X(m.xmin);
    line(c, m.pad.l, y0, m.pad.l + m.iw, y0, C.line, 1);
    line(c, x0, m.pad.t, x0, m.pad.t + m.ih, C.line, 1);
  }

  function plot(c, m, f, xmin, xmax, color, width) {
    c.save();
    c.strokeStyle = color; c.lineWidth = width || 2;
    c.beginPath();
    var started = false;
    for (var i = 0; i <= 200; i++) {
      var x = xmin + (xmax - xmin) * i / 200;
      var y = f(x);
      if (!isFinite(y) || y < m.ymin - 1 || y > m.ymax + 1) { started = false; continue; }
      var px = m.X(x), py = m.Y(y);
      if (!started) { c.moveTo(px, py); started = true; } else c.lineTo(px, py);
    }
    c.stroke();
    c.restore();
  }

  /* ── 四个题解图形 ── */
  var VIZ = {
    limit: {
      label: function (v) { return "x = " + fmt(v, 3) + " · f(x) = " + fmt((Math.tan(v) - Math.sin(v)) / (v * v * v), 4); },
      draw: function (cv, v) {
        var s = setup(cv); if (!s) return;
        var c = s.c, w = s.w, h = s.h, C = palette();
        var m = map(w, h, { l: 38, r: 14, t: 14, b: 26 }, 0, 1.25, 0, 1.15);
        axes(c, m, C);
        plot(c, m, function (x) { return (Math.tan(x) - Math.sin(x)) / (x * x * x); }, 0.02, 1.2, C.brand, 2.2);
        line(c, m.pad.l, m.Y(0.5), m.pad.l + m.iw, m.Y(0.5), C.green, 1.2, [5, 4]);
        text(c, "极限 1/2", m.pad.l + m.iw - 2, m.Y(0.5) - 9, C.green, 10, "right");
        var x = Math.min(1.2, Math.max(0.02, v));
        var y = (Math.tan(x) - Math.sin(x)) / (x * x * x);
        dot(c, m.X(x), m.Y(Math.min(1.1, y)), 4.5, C.accent);
        line(c, m.X(x), m.Y(0), m.X(x), m.Y(Math.min(1.1, y)), C.accent, 1, [3, 3]);
        text(c, "x→0 时贴近 0.5", m.pad.l + 4, m.pad.t + 10, C.ink3, 9.5);
      }
    },

    polar: {
      label: function (v) {
        var n = Math.max(1, Math.round(v));
        var dr = 1 / n, dth = 2 * Math.PI / (2 * n);
        var sum = 0;
        for (var i = 0; i < n; i++) {
          var r = (i + 0.5) * dr;
          sum += r * r * (r * dr * dth) * (2 * n);
        }
        return "n = " + n + " × " + (2 * n) + " 格 · 黎曼和 ≈ " + fmt(sum, 4) + " · 目标 π/2 ≈ " + fmt(Math.PI / 2, 4);
      },
      draw: function (cv, v) {
        var s = setup(cv); if (!s) return;
        var c = s.c, w = s.w, h = s.h, C = palette();
        var n = Math.max(1, Math.round(v));
        var cx = w / 2, cy = h / 2 + 4, R = Math.min(w, h) * 0.40;
        var m = Math.max(4, 2 * n);
        c.save();
        c.beginPath(); c.arc(cx, cy, R, 0, Math.PI * 2);
        c.fillStyle = C.soft; c.fill(); c.clip();
        c.strokeStyle = C.line; c.lineWidth = 1;
        for (var i = 1; i < n; i++) {
          c.beginPath(); c.arc(cx, cy, R * i / n, 0, Math.PI * 2); c.stroke();
        }
        for (var j = 0; j < m; j++) {
          var a = Math.PI * 2 * j / m;
          c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + R * Math.cos(a), cy + R * Math.sin(a)); c.stroke();
        }
        c.restore();
        c.beginPath(); c.arc(cx, cy, R, 0, Math.PI * 2);
        c.strokeStyle = C.brand; c.lineWidth = 2; c.stroke();
        text(c, "面积元 r dr dθ", cx, h - 10, C.ink3, 9.5, "center");
        dot(c, cx, cy, 2.5, C.ink3);
      }
    },

    eigen: {
      label: function (v) {
        var th = v * Math.PI / 180;
        var vx = Math.cos(th), vy = Math.sin(th);
        var ax = 2 * vx + vy, ay = vx + 2 * vy;
        var cross = vx * ay - vy * ax;
        return "θ = " + Math.round(v) + "° · Av = (" + fmt(ax, 2) + ", " + fmt(ay, 2) + ") · |Av| = " + fmt(Math.hypot(ax, ay), 3) +
          (Math.abs(cross) < 0.04 ? " · 共线 ✓" : "");
      },
      draw: function (cv, v) {
        var s = setup(cv); if (!s) return;
        var c = s.c, w = s.w, h = s.h, C = palette();
        var m = map(w, h, { l: 32, r: 16, t: 12, b: 22 }, -3.2, 3.2, -3.2, 3.2);
        axes(c, m, C);
        c.save();
        c.strokeStyle = C.ink3; c.lineWidth = 1; c.setLineDash([4, 4]);
        c.beginPath(); c.arc(m.X(0), m.Y(0), m.X(1) - m.X(0), 0, Math.PI * 2); c.stroke();
        c.restore();
        line(c, m.X(-2.4), m.Y(-2.4), m.X(2.4), m.Y(2.4), C.violet, 1, [4, 4]);
        line(c, m.X(-2.4), m.Y(2.4), m.X(2.4), m.Y(-2.4), C.accent, 1, [4, 4]);
        text(c, "λ=3", m.X(2.1), m.Y(2.1) - 8, C.violet, 9.5);
        text(c, "λ=1", m.X(2.1), m.Y(-2.1) + 11, C.accent, 9.5);
        var th = v * Math.PI / 180;
        var vx = Math.cos(th), vy = Math.sin(th);
        var ax = 2 * vx + vy, ay = vx + 2 * vy;
        line(c, m.X(0), m.Y(0), m.X(vx), m.Y(vy), C.green, 2.2);
        text(c, "v", m.X(vx) + 5, m.Y(vy) - 7, C.green, 10);
        line(c, m.X(0), m.Y(0), m.X(ax), m.Y(ay), C.brand, 2.4);
        text(c, "Av", m.X(ax) + 5, m.Y(ay) - 7, C.brand, 10);
      }
    },

    normal: {
      label: function (v) {
        var mu = v;
        return "X~N(0,1) · Y~N(" + fmt(mu, 2) + ",1) · X+Y~N(" + fmt(mu, 2) + ",2)";
      },
      draw: function (cv, v) {
        var s = setup(cv); if (!s) return;
        var c = s.c, w = s.w, h = s.h, C = palette();
        var m = map(w, h, { l: 34, r: 14, t: 14, b: 24 }, -4, 5, 0, 0.45);
        axes(c, m, C);
        function pdf(x, mu, sg) {
          return Math.exp(-((x - mu) * (x - mu)) / (2 * sg * sg)) / (sg * Math.sqrt(2 * Math.PI));
        }
        var mu = v;
        plot(c, m, function (x) { return pdf(x, 0, 1); }, -4, 5, C.ink3, 1.6);
        plot(c, m, function (x) { return pdf(x, mu, 1); }, -4, 5, C.blue, 1.8);
        plot(c, m, function (x) { return pdf(x, mu, Math.SQRT2); }, -4, 5, C.brand, 2.2);
        line(c, m.X(mu), m.Y(0), m.X(mu), m.Y(pdf(mu, mu, Math.SQRT2)), C.brand, 1, [3, 3]);
        text(c, "X", m.X(0), m.Y(pdf(0, 0, 1)) - 8, C.ink3, 10, "center");
        text(c, "Y", m.X(mu) + 8, m.Y(pdf(mu, mu, 1)) - 6, C.blue, 10);
        text(c, "X+Y", m.X(mu) - 8, m.Y(pdf(mu, mu, Math.SQRT2)) - 9, C.brand, 10, "right");
      }
    }
  };

  function visualHTML(data) {
    if (!data.visual || !VIZ[data.visual]) return "";
    var p = data.visualParam || { min: 0, max: 1, step: 0.01, value: 0 };
    return '<div class="sol-visual" data-viz="' + data.visual + '">' +
      '<canvas class="sv-canvas" aria-label="题解图形"></canvas>' +
      '<div class="sv-ctrl"><span>' + esc(data.visualLabel || "拖动参数") + '</span>' +
        '<input type="range" class="sv-range" min="' + p.min + '" max="' + p.max + '" step="' + p.step + '" value="' + p.value + '">' +
        '<b class="sv-val"></b></div>' +
      '<div class="sol-readout"></div>' +
    '</div>';
  }

  function mountVisual(panel, data) {
    if (!data.visual || !VIZ[data.visual]) return;
    var box = panel.querySelector(".sol-visual");
    if (!box) return;
    var cv = box.querySelector(".sv-canvas");
    var range = box.querySelector(".sv-range");
    var val = box.querySelector(".sv-val");
    var read = box.querySelector(".sol-readout");
    var viz = VIZ[data.visual];
    function draw() {
      var v = Number(range.value);
      if (val) val.textContent = String(v);
      viz.draw(cv, v);
      if (read) read.textContent = viz.label(v);
    }
    if (range) range.addEventListener("input", draw);
    if (window.ResizeObserver) {
      var ro = new ResizeObserver(function () { draw(); });
      ro.observe(cv);
    } else {
      setTimeout(draw, 80);
    }
    setTimeout(draw, 40);
    document.addEventListener("themechange", draw);
  }

  function show(panel, q, selected) {
    var data = DATA[q.id];
    if (!data || !panel) return;
    var correct = selected === q.answer;
    var trap = "";
    if (!correct && selected != null) trap = data.traps[selected] || "";
    var lead = "";
    if (selected == null) {
      lead = '<b>尚未作答。</b>先自己选一个，再对照下面的逻辑链；答案本身不如「哪一步没想到」重要。';
    } else if (correct) {
      lead = '<b>✓ 答对了，你选的是 ' + "ABCD"[selected] + '。</b>下面把完整逻辑链复盘一遍，确认每一步都能独立写出来。';
    } else {
      var cleaned = trap.replace(/^你选了[^：]*：/, "");
      lead = '<b>✗ 你选了 ' + "ABCD"[selected] + '，正确答案是 ' + "ABCD"[q.answer] + '。</b>' +
        (cleaned ? "<br>" + esc(cleaned) : "<br>这次更像是计算或审题失误；对照步骤找出断点。");
    }
    var steps = (data.steps || []).map(function (s, i) {
      return '<li class="sol-step"><span class="ss-num">' + (i + 1) + '</span><span><b>' + esc(s.name) + '</b>：' + esc(s.body) +
        (s.why ? '<span class="ss-why">' + esc(s.why) + '</span>' : "") + "</span></li>";
    }).join("");
    var chapterLink = data.link ? '<div class="sol-link">回 <a href="chapter.html?ch=' + esc(data.link) +
      '">对应章节</a> 重看知识块；也可去 <a href="proof.html">可视化证明</a> 补底层逻辑。</div>' : "";
    panel.innerHTML =
      '<div class="sol-head">逐步解析 · 错因诊断 <span>本题收录于「交互题解」</span></div>' +
      '<div class="sol-body">' +
        '<div class="sol-verdict ' + (correct || selected == null ? "good" : "bad") + '">' + lead + "</div>" +
        '<div class="sol-idea"><b>破题关键：</b>' + esc(data.idea) + "</div>" +
        visualHTML(data) +
        '<ol class="sol-steps">' + steps + "</ol>" +
        (data.check ? '<div class="sol-check"><b>' + esc(data.check) + "</div>" : "") +
        chapterLink +
      "</div>";
    panel.classList.add("has-sol");
    mountVisual(panel, data);
  }

  function hide(panel) {
    if (!panel) return;
    panel.classList.remove("show");
    panel.removeAttribute("data-built");
    panel.innerHTML = "";
  }

  window.SolutionCoach = { has: has, show: show, hide: hide };
})();
