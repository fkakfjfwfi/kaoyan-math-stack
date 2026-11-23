/* 研数 · 可视化证明播放器：分步播放 + 可拖拽图形 */
(function () {
  "use strict";

  var proofs = window.MATH_PROOFS || [];
  var state = { id: proofs.length ? proofs[0].id : "", step: 0, param: 0, playing: false, timer: null };
  var canvas = null;
  var ctx = null;
  var readoutEl = null;

  function $(sel) { return document.querySelector(sel); }
  function current() {
    for (var i = 0; i < proofs.length; i++) if (proofs[i].id === state.id) return proofs[i];
    return proofs[0];
  }
  function fmt(n, d) {
    if (!isFinite(n)) return "—";
    return Number(n).toFixed(d == null ? 2 : d);
  }
  function palette() {
    var s = getComputedStyle(document.documentElement);
    var get = function (k, fb) { var v = s.getPropertyValue(k).trim(); return v || fb; };
    return {
      ink: get("--ink", "#1a2230"),
      ink2: get("--ink-2", "#3d4757"),
      ink3: get("--ink-3", "#7d766a"),
      line: get("--line", "#e4ddcf"),
      brand: get("--brand", "#b03a2e"),
      accent: get("--accent", "#a97c24"),
      blue: get("--blue", "#1f4e6b"),
      green: get("--green", "#2f6b4f"),
      violet: get("--violet", "#5b4b8a"),
      card: get("--card", "#fffdf8"),
      soft: get("--card-2", "#faf7f0")
    };
  }

  /* ── 画布基础 ── */
  function fitCanvas() {
    if (!canvas) return null;
    var rect = canvas.getBoundingClientRect();
    var w = Math.max(280, rect.width);
    var h = Math.max(220, rect.height);
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { w: w, h: h };
  }

  function mapper(w, h, pad, xmin, xmax, ymin, ymax) {
    var iw = w - pad.l - pad.r;
    var ih = h - pad.t - pad.b;
    return {
      pad: pad, iw: iw, ih: ih,
      X: function (x) { return pad.l + (x - xmin) / (xmax - xmin) * iw; },
      Y: function (y) { return pad.t + (ymax - y) / (ymax - ymin) * ih; },
      xmin: xmin, xmax: xmax, ymin: ymin, ymax: ymax
    };
  }

  function line(c, x1, y1, x2, y2, color, width, dash) {
    c.save();
    c.strokeStyle = color;
    c.lineWidth = width || 1;
    if (dash) c.setLineDash(dash);
    c.beginPath();
    c.moveTo(x1, y1);
    c.lineTo(x2, y2);
    c.stroke();
    c.restore();
  }

  function dot(c, x, y, r, color) {
    c.beginPath();
    c.arc(x, y, r || 4, 0, Math.PI * 2);
    c.fillStyle = color;
    c.fill();
  }

  function text(c, str, x, y, color, size, align, baseline) {
    c.save();
    c.fillStyle = color;
    c.font = (size || 11) + 'px "PingFang SC","Microsoft YaHei",system-ui,sans-serif';
    c.textAlign = align || "left";
    c.textBaseline = baseline || "middle";
    c.fillText(str, x, y);
    c.restore();
  }

  function arrow(c, x1, y1, x2, y2, color, width) {
    var ang = Math.atan2(y2 - y1, x2 - x1);
    line(c, x1, y1, x2, y2, color, width || 2);
    c.save();
    c.fillStyle = color;
    c.beginPath();
    c.moveTo(x2, y2);
    c.lineTo(x2 - 10 * Math.cos(ang - 0.38), y2 - 10 * Math.sin(ang - 0.38));
    c.lineTo(x2 - 10 * Math.cos(ang + 0.38), y2 - 10 * Math.sin(ang + 0.38));
    c.closePath();
    c.fill();
    c.restore();
  }

  function axes(c, m, C, opts) {
    opts = opts || {};
    var y0 = (m.ymin <= 0 && m.ymax >= 0) ? m.Y(0) : m.Y(m.ymin);
    var x0 = (m.xmin <= 0 && m.xmax >= 0) ? m.X(0) : m.X(m.xmin);
    line(c, m.pad.l, y0, m.pad.l + m.iw, y0, C.line, 1);
    line(c, x0, m.pad.t, x0, m.pad.t + m.ih, C.line, 1);
    if (opts.grid) {
      var i;
      for (i = 1; i <= opts.grid; i++) {
        var gx = m.pad.l + m.iw * i / (opts.grid + 1);
        var gy = m.pad.t + m.ih * i / (opts.grid + 1);
        line(c, gx, m.pad.t, gx, m.pad.t + m.ih, C.line, 1, [2, 4]);
        line(c, m.pad.l, gy, m.pad.l + m.iw, gy, C.line, 1, [2, 4]);
      }
    }
    if (opts.xLabel) text(c, opts.xLabel, m.pad.l + m.iw, y0 - 9, C.ink3, 10, "right");
    if (opts.yLabel) text(c, opts.yLabel, x0 + 7, m.pad.t + 2, C.ink3, 10, "left", "top");
  }

  function plot(c, m, f, xmin, xmax, color, width, dash) {
    c.save();
    c.strokeStyle = color;
    c.lineWidth = width || 2;
    if (dash) c.setLineDash(dash);
    c.beginPath();
    var started = false;
    for (var i = 0; i <= 260; i++) {
      var x = xmin + (xmax - xmin) * i / 260;
      var y = f(x);
      if (!isFinite(y) || y < m.ymin - 2 || y > m.ymax + 2) { started = false; continue; }
      var px = m.X(x), py = m.Y(y);
      if (!started) { c.moveTo(px, py); started = true; } else c.lineTo(px, py);
    }
    c.stroke();
    c.restore();
  }

  function bisectRoot(f, a, b, tol) {
    var fa = f(a), fb = f(b);
    if (fa === 0) return a;
    if (fb === 0) return b;
    if (fa * fb > 0) return NaN;
    for (var i = 0; i < 60; i++) {
      var m = (a + b) / 2, fm = f(m);
      if (Math.abs(fm) < (tol || 1e-9)) return m;
      if (fa * fm < 0) { b = m; fb = fm; } else { a = m; fa = fm; }
    }
    return (a + b) / 2;
  }

  /* ── 七个图形引擎 ── */
  var VIZ = {
    ivt: {
      draw: function (c, w, h, S, C) {
        var f = function (x) { return x * x * x - x - 1; };
        var m = mapper(w, h, { l: 44, r: 18, t: 16, b: 72 }, 0, 2.05, -1.35, 5.35);
        axes(c, m, C, { grid: 4, xLabel: "x", yLabel: "f(x)" });
        plot(c, m, f, 0, 2, C.brand, 2.4);
        var a = 0, b = 2, fa = f(a), fb = f(b);
        dot(c, m.X(a), m.Y(fa), 4, C.blue);
        dot(c, m.X(b), m.Y(fb), 4, C.blue);
        text(c, "a=0", m.X(a) + 6, m.Y(fa) + 14, C.ink2, 10);
        text(c, "b=2", m.X(b) - 6, m.Y(fb) - 10, C.ink2, 10, "right");
        if (S.step >= 1) {
          line(c, m.X(0), m.Y(fa), m.X(0.28), m.Y(fa), C.blue, 1, [3, 3]);
          text(c, "f(0)=−1 < 0", m.X(0.28) + 4, m.Y(fa), C.blue, 10);
          text(c, "f(2)=5 > 0", m.X(1.55), m.Y(fb) - 12, C.blue, 10);
        }
        var intervals = [];
        var la = 0, lb = 2;
        for (var k = 0; k < 5; k++) {
          intervals.push([la, lb]);
          var mid = (la + lb) / 2;
          if (f(mid) === 0) break;
          if (f(la) * f(mid) < 0) lb = mid; else la = mid;
        }
        if (S.step >= 2) {
          var mid0 = 1;
          dot(c, m.X(mid0), m.Y(f(mid0)), 3.5, C.accent);
          line(c, m.X(mid0), m.Y(f(mid0)), m.X(mid0), m.Y(0), C.accent, 1, [3, 3]);
          text(c, "中点 m=1", m.X(mid0) + 5, m.Y(f(mid0)) + 16, C.accent, 10);
        }
        if (S.step >= 3) {
          var baseY = h - 58;
          text(c, "闭区间套（每次长度减半）", 44, baseY - 9, C.ink3, 10);
          for (var j = 0; j < Math.min(5, intervals.length); j++) {
            var x1 = 44 + (intervals[j][0] / 2) * (m.iw - 10);
            var x2 = 44 + (intervals[j][1] / 2) * (m.iw - 10);
            var yy = baseY + j * 10;
            if (j > 0) x1 = Math.max(44, x1), x2 = Math.min(44 + m.iw, x2);
            line(c, x1, yy, x2, yy, j === 0 ? C.ink3 : C.violet, j === 0 ? 2 : 4);
          }
        }
        var root = bisectRoot(f, 0, 2);
        if (S.step >= 4) {
          line(c, m.X(root), m.Y(-1.2), m.X(root), m.Y(5.2), C.green, 1.5, [4, 4]);
          dot(c, m.X(root), m.Y(0), 4.5, C.green);
          text(c, "ξ ≈ " + fmt(root, 3), m.X(root) + 6, m.Y(0) - 12, C.green, 11, "left");
        }
        var cc = S.param;
        var target = Math.max(-1, Math.min(5, cc));
        var xr = bisectRoot(function (x) { return f(x) - target; }, 0, 2);
        line(c, m.pad.l, m.Y(target), m.pad.l + m.iw, m.Y(target), C.accent, 1.2, [6, 4]);
        if (isFinite(xr)) {
          dot(c, m.X(xr), m.Y(target), 4, C.accent);
          text(c, "y=c=" + fmt(target, 2), m.pad.l + 4, m.Y(target) - 9, C.accent, 10);
          if (S.step >= 5) text(c, "f(ξ)=c", m.X(xr) + 8, m.Y(target) + 14, C.accent, 10);
        }
        return "f(0)=−1 · f(2)=5 · 根 ξ≈" + fmt(root, 4) + " · 当前 c=" + fmt(target, 2) +
          (isFinite(xr) ? " → 交点 x≈" + fmt(xr, 4) : "");
      }
    },

    mvt: {
      draw: function (c, w, h, S, C, proof) {
        var mode = (proof.vizOpts && proof.vizOpts.mode) || "lagrange";
        var a, b, f, m, labelA, labelB, secantInfo;
        if (mode === "rolle") {
          a = 0; b = 4;
          f = function (x) { return 4 * x - x * x; };
          m = mapper(w, h, { l: 46, r: 20, t: 18, b: 34 }, -0.35, 4.35, -0.5, 4.6);
          labelA = "a=0"; labelB = "b=4";
        } else if (mode === "cauchy") {
          a = 1; b = 2;
          f = function (t) { return t * t; };
          m = mapper(w, h, { l: 50, r: 22, t: 18, b: 36 }, 0.8, 8.4, 0.8, 4.3);
          labelA = "t=1"; labelB = "t=2";
        } else {
          a = 0; b = 2;
          f = function (x) { return x * x; };
          m = mapper(w, h, { l: 50, r: 22, t: 18, b: 36 }, -0.25, 2.25, -0.35, 4.35);
          labelA = "a=0"; labelB = "b=2";
        }
        var g = mode === "cauchy" ? function (t) { return t * t * t; } : function (x) { return x; };
        var xPix = function (t) { return m.X(g(t)); };
        var yPix = function (t) { return m.Y(f(t)); };

        axes(c, m, C, { grid: 3, xLabel: mode === "cauchy" ? "g(t)" : "x", yLabel: mode === "cauchy" ? "f(t)" : "f(x)" });
        c.save();
        c.strokeStyle = C.brand;
        c.lineWidth = 2.4;
        c.beginPath();
        for (var i = 0; i <= 240; i++) {
          var t = a + (b - a) * i / 240;
          var px = xPix(t), py = yPix(t);
          if (i === 0) c.moveTo(px, py); else c.lineTo(px, py);
        }
        c.stroke();
        c.restore();

        var k = (f(b) - f(a)) / (g(b) - g(a));
        line(c, xPix(a), yPix(a), xPix(b), yPix(b), C.blue, 1.8, [6, 4]);
        dot(c, xPix(a), yPix(a), 4, C.blue);
        dot(c, xPix(b), yPix(b), 4, C.blue);
        text(c, labelA, xPix(a) + 6, yPix(a) + 14, C.ink2, 10);
        text(c, labelB, xPix(b) - 4, yPix(b) + 14, C.ink2, 10, "right");

        if (S.step >= 1) {
          text(c, "割线斜率 k=" + fmt(k, 3), m.pad.l + 6, m.pad.t + 12, C.blue, 10);
          if (mode === "rolle") text(c, "f(a)=f(b)，割线水平", m.pad.l + 6, m.pad.t + 27, C.ink3, 10);
        }

        var t0 = a + (b - a) * S.param;
        var x0 = g(t0), y0 = f(t0);
        var slope;
        if (mode === "cauchy") {
          slope = (2 * t0) / (3 * t0 * t0);
        } else {
          slope = mode === "rolle" ? 4 - 2 * t0 : 2 * t0;
        }
        if (S.step >= 2) {
          var xmin = m.xmin, xmax = m.xmax;
          var yL = slope * (xmin - x0) + y0;
          var yR = slope * (xmax - x0) + y0;
          c.save();
          c.beginPath();
          c.rect(m.pad.l, m.pad.t, m.iw, m.ih);
          c.clip();
          line(c, m.X(xmin), m.Y(yL), m.X(xmax), m.Y(yR), C.violet, 1.6, [4, 4]);
          c.restore();
          var px0 = m.X(x0), py0 = m.Y(y0);
          dot(c, px0, py0, 5, C.violet);
          text(c, "切点 " + (mode === "cauchy" ? "t" : "x") + "=" + fmt(t0, 3), px0 + 7, py0 - 13, C.violet, 10);
        }

        var diff = Math.abs(slope - k);
        var hit = diff < 0.008;
        if (S.step >= 3) {
          text(c, "切线斜率 m=" + fmt(slope, 3), m.pad.l + 6, m.pad.t + 42, hit ? C.green : C.violet, 10);
          if (hit) {
            text(c, "✓ 切线 ∥ 割线", m.pad.l + 6, m.pad.t + 57, C.green, 11);
            line(c, m.X(x0), m.Y(y0), m.X(x0), m.Y(m.ymin), C.green, 1, [3, 3]);
          }
        }
        var out = "割线斜率 k=" + fmt(k, 4) + " · 切线斜率 m=" + fmt(slope, 4);
        if (mode === "cauchy") {
          out += " · 对应 ξ=t=" + fmt(t0, 4);
        } else {
          out += " · 切点 x=" + fmt(t0, 4);
        }
        out += hit ? " · 已找到平行位置" : " · 继续拖动";

        if (S.step >= 4 && hit) {
          text(c, "f′(ξ)=k", m.pad.l + m.iw - 8, m.pad.t + 14, C.green, 12, "right");
        }
        return out;
      }
    },

    taylor: {
      draw: function (c, w, h, S, C) {
        var n = Math.max(1, Math.min(7, Math.round(S.param)));
        var m = mapper(w, h, { l: 44, r: 18, t: 18, b: 34 }, -1.15, 1.15, -0.25, 4.35);
        axes(c, m, C, { grid: 4, xLabel: "x", yLabel: "y" });
        var f = function (x) { return Math.exp(x); };
        function poly(x) {
          var s = 0, term = 1;
          for (var k = 0; k <= n; k++) {
            if (k > 0) term *= x / k;
            s += term;
          }
          return s;
        }
        if (S.step >= 0) plot(c, m, f, -1.1, 1.1, C.ink, 2.4);
        if (S.step >= 1) plot(c, m, poly, -1.1, 1.1, C.brand, 2.2);
        if (S.step >= 4) {
          c.save();
          c.globalAlpha = 0.13;
          c.fillStyle = C.brand;
          c.beginPath();
          for (var i = 0; i <= 160; i++) {
            var x = -1.1 + 2.2 * i / 160;
            var px = m.X(x), py = m.Y(poly(x));
            if (i === 0) c.moveTo(px, py); else c.lineTo(px, py);
          }
          for (var j = 160; j >= 0; j--) {
            var x2 = -1.1 + 2.2 * j / 160;
            c.lineTo(m.X(x2), m.Y(f(x2)));
          }
          c.closePath();
          c.fill();
          c.restore();
        }
        dot(c, m.X(0), m.Y(1), 4, C.accent);
        text(c, "x₀=0", m.X(0) + 7, m.Y(1) + 14, C.accent, 10);
        if (S.step >= 2) {
          text(c, "P" + n + "(x) 与 eˣ 在 x₀ 处同值、同斜率、同曲率", m.pad.l + 4, m.pad.t + 10, C.ink2, 9.5);
        }
        if (S.step >= 3) {
          var xr = 1;
          line(c, m.X(xr), m.Y(poly(xr)), m.X(xr), m.Y(f(xr)), C.violet, 2.4);
          dot(c, m.X(xr), m.Y(poly(xr)), 3.5, C.violet);
          dot(c, m.X(xr), m.Y(f(xr)), 3.5, C.violet);
          text(c, "R" + n, m.X(xr) + 6, (m.Y(poly(xr)) + m.Y(f(xr))) / 2, C.violet, 10);
        }
        text(c, "eˣ", m.X(1.02), m.Y(Math.exp(1.02)) - 10, C.ink, 11);
        text(c, "P" + n, m.X(0.98), m.Y(poly(0.98)) - 10, C.brand, 11);
        var err = Math.abs(poly(1) - Math.E);
        return "n=" + n + " · P" + n + "(1)=" + fmt(poly(1), 4) + " · e=" + fmt(Math.E, 4) + " · |R" + n + "(1)|=" + fmt(err, 4);
      }
    },

    "integral-mean": {
      draw: function (c, w, h, S, C) {
        var f = function (x) { return 1 + Math.sin(x); };
        var a = 0, b = 3;
        var avg = 1 + (1 - Math.cos(3)) / 3;
        var m = mapper(w, h, { l: 46, r: 20, t: 18, b: 38 }, -0.1, 3.2, 0.55, 2.35);
        axes(c, m, C, { grid: 3, xLabel: "x", yLabel: "y" });

        // 被积函数与积分面积
        c.save();
        c.globalAlpha = 0.12;
        c.fillStyle = C.ink3;
        c.beginPath();
        c.moveTo(m.X(a), m.Y(0));
        for (var i = 0; i <= 160; i++) {
          var x = a + (b - a) * i / 160;
          c.lineTo(m.X(x), m.Y(f(x)));
        }
        c.lineTo(m.X(b), m.Y(0));
        c.closePath();
        c.fill();
        c.restore();
        plot(c, m, f, a, b, C.brand, 2.4);

        if (S.step >= 1) {
          line(c, m.pad.l, m.Y(1), m.pad.l + m.iw, m.Y(1), C.blue, 1.1, [4, 4]);
          line(c, m.pad.l, m.Y(2), m.pad.l + m.iw, m.Y(2), C.blue, 1.1, [4, 4]);
          text(c, "m=1", m.pad.l + 3, m.Y(1) - 9, C.blue, 10);
          text(c, "M=2", m.pad.l + 3, m.Y(2) - 9, C.blue, 10);
          text(c, "m(b−a) ≤ ∫f ≤ M(b−a)", m.pad.l + 6, m.pad.t + 10, C.ink2, 9.5);
        }
        if (S.step >= 2) {
          line(c, m.X(a), m.Y(avg), m.X(b), m.Y(avg), C.green, 1.6, [6, 4]);
          text(c, "平均高度 η=" + fmt(avg, 3), m.X(b) - 4, m.Y(avg) - 11, C.green, 10, "right");
        }
        // 拖拽水平线：正负面积
        var hgt = S.param;
        c.save();
        for (var px = m.pad.l; px <= m.pad.l + m.iw; px += 2) {
          var xx = a + (px - m.pad.l) / m.iw * (b - a);
          var d = f(xx) - hgt;
          c.globalAlpha = 0.16;
          c.fillStyle = d >= 0 ? C.green : C.brand;
          c.fillRect(px, Math.min(m.Y(f(xx)), m.Y(hgt)), 2, Math.abs(m.Y(f(xx)) - m.Y(hgt)));
        }
        c.restore();
        line(c, m.pad.l, m.Y(hgt), m.pad.l + m.iw, m.Y(hgt), Math.abs(hgt - avg) < 0.012 ? C.green : C.accent, 2);
        text(c, "h=" + fmt(hgt, 3), m.pad.l + 4, m.Y(hgt) - 10, Math.abs(hgt - avg) < 0.012 ? C.green : C.accent, 10);

        if (S.step >= 3) {
          var roots = [];
          var prev = f(a) - avg;
          for (var s = 1; s <= 300; s++) {
            var x1 = a + (b - a) * s / 300;
            var cur = f(x1) - avg;
            if (prev === 0 || prev * cur < 0) roots.push(x1);
            prev = cur;
          }
          var xi = roots.length > 1 ? roots[1] : (roots[0] || NaN);
          if (isFinite(xi)) {
            line(c, m.X(xi), m.Y(0.6), m.X(xi), m.Y(avg), C.violet, 1.3, [3, 3]);
            dot(c, m.X(xi), m.Y(avg), 4.5, C.violet);
            text(c, "ξ≈" + fmt(xi, 3), m.X(xi) + 6, m.Y(avg) + 15, C.violet, 10);
          }
        }
        if (S.step >= 4) {
          text(c, "∫f = f(ξ)(b−a)：曲边面积 = 矩形面积", m.pad.l + 6, m.pad.t + 26, C.green, 9.5);
        }
        // 数值积分（梯形）
        var sum = 0, N = 600;
        for (var q = 0; q < N; q++) {
          var xa = a + (b - a) * q / N, xb = a + (b - a) * (q + 1) / N;
          sum += (f(xa) + f(xb)) / 2 * (xb - xa);
        }
        var area = sum, rect = hgt * (b - a);
        return "∫f≈" + fmt(area, 4) + " · h(b−a)=" + fmt(rect, 4) + " · 差=" + fmt(area - rect, 4) +
          (Math.abs(area - rect) < 0.01 ? " · 面积相等 ✓" : "");
      }
    },

    ftc: {
      draw: function (c, w, h, S, C) {
        var f = function (t) { return 1 + 0.55 * Math.sin(t) + 0.15 * Math.cos(2 * t); };
        function F(x) {
          var n = 80, s = 0, dt = x / n;
          for (var i = 0; i < n; i++) {
            var t1 = i * dt, t2 = (i + 1) * dt;
            s += (f(t1) + f(t2)) / 2 * dt;
          }
          return s;
        }
        var topH = Math.round(h * 0.56);
        var m1 = mapper(w, topH, { l: 40, r: 16, t: 16, b: 10 }, -0.05, 3.1, 0, 2.05);
        var m2 = mapper(w, h - topH, { l: 40, r: 16, t: 18, b: 26 }, -0.05, 3.1, 0, 4.4);
        m2.Y = (function (orig) { return function (y) { return topH + orig(y); }; })(m2.Y);
        m2.pad = { l: 40, r: 16, t: topH + 18, b: 26 };
        m2.ih = (h - topH) - 18 - 26;

        // 上图：f(t)
        axes(c, m1, C, { xLabel: "t", yLabel: "f(t)" });
        plot(c, m1, f, 0, 3, C.brand, 2.2);
        var x = Math.max(0.2, Math.min(3, S.param));
        c.save();
        c.globalAlpha = 0.16;
        c.fillStyle = C.brand;
        c.beginPath();
        c.moveTo(m1.X(0), m1.Y(0));
        for (var i = 0; i <= 120; i++) {
          var t = x * i / 120;
          c.lineTo(m1.X(t), m1.Y(f(t)));
        }
        c.lineTo(m1.X(x), m1.Y(0));
        c.closePath();
        c.fill();
        c.restore();
        line(c, m1.X(x), m1.Y(0), m1.X(x), m1.Y(2), C.accent, 1.4, [4, 3]);
        dot(c, m1.X(x), m1.Y(f(x)), 4.5, C.accent);
        text(c, "f(x)=" + fmt(f(x), 3), m1.X(x) + 6, m1.Y(f(x)) - 10, C.accent, 9.5);

        // 下图：F(x)
        axes(c, m2, C, { xLabel: "x", yLabel: "F(x)" });
        plot(c, m2, F, 0, 3, C.violet, 2.2);
        line(c, m2.X(x), m2.Y(0), m2.X(x), m2.Y(4.4), C.accent, 1.2, [4, 3]);
        dot(c, m2.X(x), m2.Y(F(x)), 4.5, C.violet);
        text(c, "F(x)=" + fmt(F(x), 3), m2.X(x) + 6, m2.Y(F(x)) - 10, C.violet, 9.5);

        if (S.step >= 1) {
          var d = 0.35;
          c.save();
          c.globalAlpha = 0.28;
          c.fillStyle = C.green;
          c.beginPath();
          c.moveTo(m1.X(x), m1.Y(0));
          for (var k = 0; k <= 24; k++) {
            var tk = x + d * k / 24;
            c.lineTo(m1.X(tk), m1.Y(f(tk)));
          }
          c.lineTo(m1.X(x + d), m1.Y(0));
          c.closePath();
          c.fill();
          c.restore();
          text(c, "ΔF", m1.X(x + d / 2) - 6, m1.Y(0) - 9, C.green, 9.5);
        }
        if (S.step >= 2) {
          var xi = x + 0.175;
          dot(c, m1.X(xi), m1.Y(f(xi)), 3.5, C.green);
          line(c, m1.X(xi), m1.Y(0), m1.X(xi), m1.Y(f(xi)), C.green, 1, [3, 3]);
          text(c, "f(ξ)", m1.X(xi) + 4, m1.Y(f(xi)) + 18, C.green, 9.5);
        }
        if (S.step >= 3) {
          var d2 = 0.22;
          line(c, m2.X(x - d2), m2.Y(F(x - d2)), m2.X(x + d2), m2.Y(F(x + d2)), C.green, 2);
          text(c, "切线斜率 = f(x)", m2.pad.l + 6, m2.pad.t + 12, C.green, 9.5);
        }
        if (S.step >= 4) {
          text(c, "F′(x)=f(x)", w - 16, 14, C.green, 12, "right");
        }
        var deriv = (F(x + 0.002) - F(x - 0.002)) / 0.004;
        return "x=" + fmt(x, 3) + " · f(x)=" + fmt(f(x), 4) + " · F(x)=" + fmt(F(x), 4) +
          " · 数值 F′(x)=" + fmt(deriv, 4);
      }
    },

    green: {
      draw: function (c, w, h, S, C) {
        var n = Math.max(2, Math.min(18, Math.round(S.param)));
        var cx = w / 2, cy = h / 2 + 4;
        var R = Math.min(w, h) * 0.40;
        function X(x) { return cx + x * R; }
        function Y(y) { return cy - y * R; }
        // 圆盘
        c.save();
        c.beginPath();
        c.arc(cx, cy, R, 0, Math.PI * 2);
        c.fillStyle = C.soft;
        c.fill();
        c.clip();
        c.strokeStyle = C.line;
        c.lineWidth = 1;
        for (var i = 1; i < n; i++) {
          var gx = -1 + 2 * i / n;
          c.beginPath();
          c.moveTo(X(gx), Y(-1.1));
          c.lineTo(X(gx), Y(1.1));
          c.stroke();
          c.beginPath();
          c.moveTo(X(-1.1), Y(gx));
          c.lineTo(X(1.1), Y(gx));
          c.stroke();
        }
        c.restore();
        // 高亮小格
        if (S.step >= 2) {
          var step = 2 / n;
          var gx0 = -1 + Math.floor((0.25 + 1) / step) * step;
          var gy0 = -1 + Math.floor((0.25 + 1) / step) * step;
          c.save();
          c.globalAlpha = 0.35;
          c.fillStyle = C.accent;
          c.beginPath();
          c.arc(cx, cy, R, 0, Math.PI * 2);
          c.clip();
          c.fillRect(X(gx0), Y(gy0 + step), X(gx0 + step) - X(gx0), Y(gy0) - Y(gy0 + step));
          c.restore();
          // 小格逆时针箭头
          var bx1 = X(gx0), bx2 = X(gx0 + step), by1 = Y(gy0 + step), by2 = Y(gy0);
          arrow(c, bx1 + 3, by2 - 3, bx2 - 3, by2 - 3, C.accent, 1.4);
          arrow(c, bx2 - 3, by2 - 3, bx2 - 3, by1 + 3, C.accent, 1.4);
          arrow(c, bx2 - 3, by1 + 3, bx1 + 3, by1 + 3, C.accent, 1.4);
          arrow(c, bx1 + 3, by1 + 3, bx1 + 3, by2 - 3, C.accent, 1.4);
          text(c, "旋度 2 × 面积", bx2 + 6, (by1 + by2) / 2, C.accent, 9.5);
        }
        // 相邻格公共边方向相反
        if (S.step >= 3) {
          var mx = X(gx0 + step / 2), my1 = Y(gy0 + step), my2 = Y(gy0);
          arrow(c, mx - 8, my2 + 8, mx - 8, my1 - 8, C.brand, 1.2);
          arrow(c, mx + 8, my1 - 8, mx + 8, my2 + 8, C.blue, 1.2);
          text(c, "内部边抵消", cx + 10, cy - R - 8, C.ink2, 10, "center");
        }
        // 外边界与方向
        c.beginPath();
        c.arc(cx, cy, R, 0, Math.PI * 2);
        c.strokeStyle = S.step >= 4 ? C.brand : C.ink2;
        c.lineWidth = S.step >= 4 ? 2.6 : 1.8;
        c.stroke();
        for (var a = 0; a < 8; a++) {
          var ang = a * Math.PI / 4;
          var px = cx + R * Math.cos(ang), py = cy + R * Math.sin(ang);
          var tx = -Math.sin(ang), ty = -Math.cos(ang);
          arrow(c, px - 7 * tx, py - 7 * ty, px + 7 * tx, py + 7 * ty, C.green, 1.6);
        }
        text(c, "L：逆时针（正向）", cx, cy + R + 16, C.green, 10, "center");
        if (S.step >= 4) {
          text(c, "∮ = 2π ≈ 6.283", 12, 14, C.brand, 10.5);
          text(c, "∬ 2 dσ = 2 × π = 2π", 12, 30, C.brand, 10.5);
        }
        var cells = Math.round(Math.PI * n * n / 4);
        return "网格 " + n + "×" + n + " · 约 " + cells + " 个小格 · 边界环流 2π≈6.2832 · 二重积分 2×π=6.2832";
      }
    },

    schmidt: {
      draw: function (c, w, h, S, C) {
        var m = mapper(w, h, { l: 40, r: 18, t: 16, b: 32 }, -0.6, 2.7, -1.7, 2.3);
        axes(c, m, C, { grid: 4, xLabel: "x", yLabel: "y" });
        var a1 = { x: 1.8, y: 0.9 };
        var th = S.param * Math.PI / 180;
        var a2 = { x: 1.9 * Math.cos(th), y: 1.9 * Math.sin(th) };
        var coeff = (a2.x * a1.x + a2.y * a1.y) / (a1.x * a1.x + a1.y * a1.y);
        var proj = { x: coeff * a1.x, y: coeff * a1.y };
        var b2 = { x: a2.x - proj.x, y: a2.y - proj.y };
        function A(v, color, width, label) {
          arrow(c, m.X(0), m.Y(0), m.X(v.x), m.Y(v.y), color, width || 2);
          if (label) text(c, label, m.X(v.x) + 6, m.Y(v.y) - 8, color, 11);
        }
        if (S.step >= 0) {
          A(a1, C.brand, 2.4, "α₁");
          A(a2, C.blue, 2.4, "α₂");
        }
        if (S.step >= 1) text(c, "β₁=α₁", m.X(a1.x) + 6, m.Y(a1.y) + 8, C.brand, 10);
        if (S.step >= 2) {
          line(c, m.X(a2.x), m.Y(a2.y), m.X(proj.x), m.Y(proj.y), C.ink3, 1.2, [3, 3]);
          arrow(c, m.X(0), m.Y(0), m.X(proj.x), m.Y(proj.y), C.accent, 1.6);
          text(c, "投影", (m.X(0) + m.X(proj.x)) / 2 + 4, m.Y(proj.y / 2) + 12, C.accent, 10);
        }
        if (S.step >= 3) {
          A(b2, C.green, 2.4, "β₂");
          // 直角标记
          var ux = a1.x / Math.hypot(a1.x, a1.y), uy = a1.y / Math.hypot(a1.x, a1.y);
          var bx = b2.x / Math.hypot(b2.x, b2.y), by = b2.y / Math.hypot(b2.x, b2.y);
          var p0x = m.X(proj.x), p0y = m.Y(proj.y);
          var s = 14;
          c.save();
          c.strokeStyle = C.green;
          c.lineWidth = 1.2;
          c.beginPath();
          c.moveTo(p0x + s * bx, p0y - s * by);
          c.lineTo(p0x + s * bx + s * ux, p0y - s * by - s * uy);
          c.lineTo(p0x + s * ux, p0y - s * uy);
          c.stroke();
          c.restore();
        }
        if (S.step >= 4) {
          var e1 = { x: a1.x / Math.hypot(a1.x, a1.y), y: a1.y / Math.hypot(a1.x, a1.y) };
          var bl = Math.hypot(b2.x, b2.y) || 1;
          var e2 = { x: b2.x / bl, y: b2.y / bl };
          A(e1, C.violet, 2, "e₁");
          A(e2, C.violet, 2, "e₂");
          text(c, "‖e₁‖=‖e₂‖=1", m.pad.l + 6, m.pad.t + 10, C.violet, 10);
        }
        var ip = b2.x * a1.x + b2.y * a1.y;
        return "θ=" + Math.round(S.param) + "° · (α₂,α₁)=" + fmt(a2.x * a1.x + a2.y * a1.y, 3) +
          " · ‖β₂‖=" + fmt(Math.hypot(b2.x, b2.y), 3) + " · (β₂,β₁)=" + fmt(ip, 6);
      }
    },

    symmetric: {
      draw: function (c, w, h, S, C) {
        var m = mapper(w, h, { l: 40, r: 18, t: 16, b: 32 }, -3.7, 3.7, -3.7, 3.7);
        axes(c, m, C, { grid: 4, xLabel: "x", yLabel: "y" });
        // 单位圆
        c.save();
        c.strokeStyle = C.ink3;
        c.lineWidth = 1.2;
        c.setLineDash([4, 4]);
        c.beginPath();
        c.arc(m.X(0), m.Y(0), m.X(1) - m.X(0), 0, Math.PI * 2);
        c.stroke();
        c.restore();
        // 椭圆 A(单位圆)
        if (S.step >= 1) {
          c.save();
          c.strokeStyle = C.blue;
          c.lineWidth = 2.2;
          c.beginPath();
          for (var i = 0; i <= 180; i++) {
            var t = Math.PI * 2 * i / 180;
            var ex = 2 * Math.cos(t) + Math.sin(t);
            var ey = Math.cos(t) + 2 * Math.sin(t);
            if (i === 0) c.moveTo(m.X(ex), m.Y(ey)); else c.lineTo(m.X(ex), m.Y(ey));
          }
          c.stroke();
          c.restore();
          text(c, "A·单位圆 = 椭圆", m.X(2.2), m.Y(2.4), C.blue, 10);
        }
        // 特征方向
        if (S.step >= 2) {
          line(c, m.X(-2.7), m.Y(-2.7), m.X(2.7), m.Y(2.7), C.violet, 1.2, [5, 4]);
          line(c, m.X(-2.7), m.Y(2.7), m.X(2.7), m.Y(-2.7), C.accent, 1.2, [5, 4]);
          text(c, "λ=3：(1,1)", m.X(2.05), m.Y(2.05) - 10, C.violet, 10);
          text(c, "λ=1：(1,−1)", m.X(2.05), m.Y(-2.05) + 13, C.accent, 10);
        }
        // 输入向量 v 与 Av
        var th = S.param * Math.PI / 180;
        var v = { x: Math.cos(th), y: Math.sin(th) };
        var av = { x: 2 * v.x + v.y, y: v.x + 2 * v.y };
        arrow(c, m.X(0), m.Y(0), m.X(v.x), m.Y(v.y), C.green, 2.2);
        text(c, "v", m.X(v.x) + 6, m.Y(v.y) - 8, C.green, 11);
        if (S.step >= 3) {
          arrow(c, m.X(0), m.Y(0), m.X(av.x), m.Y(av.y), C.brand, 2.4);
          text(c, "Av", m.X(av.x) + 6, m.Y(av.y) - 8, C.brand, 11);
        }
        var cross = v.x * av.y - v.y * av.x;
        var aligned = Math.abs(cross) < 0.03;
        if (aligned && S.step >= 3) {
          text(c, "Av ∥ v：v 是特征向量", m.pad.l + 6, m.pad.t + 12, C.green, 10.5);
        }
        if (S.step >= 4) {
          text(c, "QᵀAQ = diag(3,1)", m.pad.l + 6, m.pad.t + 28, C.violet, 10.5);
        }
        return "θ=" + Math.round(S.param) + "° · v=(" + fmt(v.x, 2) + "," + fmt(v.y, 2) + ")" +
          " · Av=(" + fmt(av.x, 2) + "," + fmt(av.y, 2) + ") · |Av|=" + fmt(Math.hypot(av.x, av.y), 3) +
          (aligned ? " · 共线 ✓" : "");
      }
    }
  };

  /* ── 页面渲染 ── */
  function renderTabs() {
    var tabs = $("#proofTabs");
    if (!tabs) return;
    tabs.innerHTML = proofs.map(function (p) {
      return '<button class="proof-tab' + (p.id === state.id ? " on" : "") + '" type="button" data-proof="' + p.id + '">' +
        p.short + "<small>" + p.tag.split("·").pop().trim() + "</small></button>";
    }).join("");
  }

  function renderSteps(p) {
    var box = $("#proofSteps");
    if (!box) return;
    box.innerHTML = p.steps.map(function (s, i) {
      return '<button class="proof-step' + (i === state.step ? " on" : "") + '" type="button" data-step="' + i + '">' +
        '<span class="ps-num">' + (i + 1) + "</span>" +
        '<span><span class="ps-name">' + s.name + '</span><span class="ps-math">' + s.math + "</span></span>" +
        "</button>";
    }).join("");
  }

  function renderDetail(p) {
    var s = p.steps[state.step] || p.steps[0];
    var name = $("#proofDetailName");
    var math = $("#proofDetailMath");
    var why = $("#proofWhy");
    if (name) name.textContent = "第 " + (state.step + 1) + " 步 · " + s.name;
    if (math) math.innerHTML = s.math;
    if (why) why.innerHTML = "<b>为什么这一步成立：</b>" + s.why;
    var counter = $("#proofCounter");
    if (counter) counter.textContent = (state.step + 1) + " / " + p.steps.length;
    renderSteps(p);
  }

  function renderSlider(p) {
    var wrap = $("#proofSliderWrap");
    var input = $("#proofParam");
    var label = $("#proofParamLabel");
    var val = $("#proofParamVal");
    if (!wrap || !input) return;
    if (!p.param) {
      wrap.style.display = "none";
      return;
    }
    wrap.style.display = "flex";
    input.min = p.param.min;
    input.max = p.param.max;
    input.step = p.param.step;
    input.value = state.param;
    if (label) label.textContent = p.param.label;
    if (val) val.textContent = fmt(state.param, p.param.step < 1 ? 2 : 0) + (p.param.unit || "");
  }

  function draw() {
    var p = current();
    if (!p) return;
    var size = fitCanvas();
    if (!size) return;
    ctx.clearRect(0, 0, size.w, size.h);
    var viz = VIZ[p.viz];
    var out = "";
    if (viz) out = viz.draw(ctx, size.w, size.h, { step: state.step, param: state.param }, palette(), p) || "";
    if (readoutEl) readoutEl.textContent = out;
  }

  function render() {
    var p = current();
    if (!p) return;
    $("#proofTag").textContent = p.tag;
    $("#proofTitle").textContent = p.title;
    $("#proofGoal").textContent = p.goal;
    var ch = $("#proofChapter");
    if (ch) ch.setAttribute("href", "chapter.html?ch=" + p.chapter);
    $("#proofConclusion").innerHTML = p.conclusion;
    $("#proofExam").innerHTML = p.exam;
    renderTabs();
    renderSlider(p);
    renderDetail(p);
    requestAnimationFrame(draw);
  }

  function stopPlay() {
    state.playing = false;
    clearTimeout(state.timer);
    var btn = $("#proofPlay");
    if (btn) { btn.textContent = "▶ 自动播放"; btn.classList.remove("primary"); }
  }

  function play() {
    if (state.playing) { stopPlay(); return; }
    var p = current();
    if (state.step >= p.steps.length - 1) state.step = 0;
    state.playing = true;
    var btn = $("#proofPlay");
    if (btn) { btn.textContent = "⏸ 暂停"; btn.classList.add("primary"); }
    renderDetail(p);
    draw();
    state.timer = setTimeout(function tick() {
      if (!state.playing) return;
      var pr = current();
      if (state.step >= pr.steps.length - 1) { stopPlay(); return; }
      state.step += 1;
      renderDetail(pr);
      draw();
      state.timer = setTimeout(tick, 2400);
    }, 2400);
  }

  function go(delta) {
    var p = current();
    stopPlay();
    state.step = Math.max(0, Math.min(p.steps.length - 1, state.step + delta));
    renderDetail(p);
    draw();
  }

  function selectProof(id) {
    if (!id) return;
    var p = null;
    for (var i = 0; i < proofs.length; i++) if (proofs[i].id === id) p = proofs[i];
    if (!p) return;
    stopPlay();
    state.id = id;
    state.step = 0;
    state.param = p.param ? p.param.value : 0;
    try {
      if (history.replaceState) history.replaceState(null, "", "?p=" + id);
    } catch (err) { /* file:// 下可能禁止改地址，忽略即可 */ }
    render();
  }

  function bind() {
    $("#proofTabs").addEventListener("click", function (ev) {
      var btn = ev.target.closest("[data-proof]");
      if (btn) selectProof(btn.getAttribute("data-proof"));
    });
    $("#proofSteps").addEventListener("click", function (ev) {
      var btn = ev.target.closest("[data-step]");
      if (!btn) return;
      stopPlay();
      state.step = Number(btn.getAttribute("data-step"));
      renderDetail(current());
      draw();
    });
    $("#proofPrev").addEventListener("click", function () { go(-1); });
    $("#proofNext").addEventListener("click", function () { go(1); });
    $("#proofPlay").addEventListener("click", play);
    $("#proofReset").addEventListener("click", function () {
      var p = current();
      stopPlay();
      state.step = 0;
      state.param = p.param ? p.param.value : 0;
      renderSlider(p);
      renderDetail(p);
      draw();
    });
    $("#proofParam").addEventListener("input", function (ev) {
      state.param = Number(ev.target.value);
      var p = current();
      var val = $("#proofParamVal");
      if (val) val.textContent = fmt(state.param, p.param.step < 1 ? 2 : 0) + (p.param.unit || "");
      draw();
    });
    document.addEventListener("keydown", function (ev) {
      if (ev.target && /input|select|textarea/i.test(ev.target.tagName)) return;
      if (ev.key === "ArrowRight") { ev.preventDefault(); go(1); }
      if (ev.key === "ArrowLeft") { ev.preventDefault(); go(-1); }
    });
    var resizeTimer = null;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(draw, 120);
    });
    document.addEventListener("themechange", function () { setTimeout(draw, 30); });
    window.addEventListener("hashchange", function () {
      var id = new URLSearchParams(location.search).get("p");
      if (id) selectProof(id);
    });
  }

  function init() {
    var app = document.getElementById("proofApp");
    if (!app || !proofs.length) return;
    canvas = document.getElementById("proofCanvas");
    readoutEl = document.getElementById("proofReadout");
    var id = new URLSearchParams(location.search).get("p");
    var found = false;
    for (var i = 0; i < proofs.length; i++) if (proofs[i].id === id) { state.id = id; found = true; }
    if (!found) state.id = proofs[0].id;
    var p = current();
    state.param = p.param ? p.param.value : 0;
    render();
    bind();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
