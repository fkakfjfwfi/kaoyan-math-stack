/* 研数 · 六个 Canvas 交互实验室 */
(function () {
  "use strict";

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var drawers = [];

  // 实验室统一使用「纸上作图」配色，保证明暗主题下曲线与标注都清晰
  function palette() {
    return {
      ink: "#1a2230",
      ink2: "#3d4757",
      ink3: "#8b8578",
      line: "#e6dfd1",
      card: "#fffdf8",
      card2: "#fbf8f1",
      brand: "#b03a2e",
      accent: "#a97c24",
      green: "#2f6b4f",
      blue: "#1f4e6b",
      red: "#b03a2e"
    };
  }

  function setup(canvas, height) {
    var parent = canvas.parentElement;
    var width = Math.max(280, parent.clientWidth - 20);
    var h = height;
    var dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = width + "px";
    canvas.style.height = h + "px";
    var ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx: ctx, w: width, h: h };
  }

  function clear(ctx, w, h, p) {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = p.card2;
    ctx.fillRect(0, 0, w, h);
  }

  function line(ctx, x1, y1, x2, y2, color, width, dash) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = width || 1;
    if (dash) ctx.setLineDash(dash);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
  }

  function label(ctx, text, x, y, color, size, align) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.font = (size || 11) + 'px "PingFang SC","Microsoft YaHei",sans-serif';
    ctx.textAlign = align || "left";
    ctx.textBaseline = "middle";
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  function arrow(ctx, x1, y1, x2, y2, color, width) {
    var a = Math.atan2(y2 - y1, x2 - x1);
    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = width || 1.8;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - 7 * Math.cos(a - 0.4), y2 - 7 * Math.sin(a - 0.4));
    ctx.lineTo(x2 - 7 * Math.cos(a + 0.4), y2 - 7 * Math.sin(a + 0.4));
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function debounce(fn, wait) {
    var timer = null;
    return function () {
      clearTimeout(timer);
      timer = setTimeout(fn, wait || 120);
    };
  }

  /* ── 1. 极限逼近器 ── */
  function initLimit(lab) {
    var canvas = $("#labLimit", lab);
    if (!canvas) return;
    var slider = $("#limX", lab);
    var val = $("#limXVal", lab);
    var playBtn = $("#limPlay", lab);
    var resetBtn = $("#limReset", lab);
    var note = $("#limNote", lab);
    var read = $("#limRead", lab);
    var env = setup(canvas, 320);
    var raf = null;

    function draw() {
      var p = palette();
      var ctx = env.ctx, w = env.w, h = env.h;
      clear(ctx, w, h, p);
      var padL = 38, padR = 18, padT = 20, padB = 34;
      var plotW = w - padL - padR, plotH = h - padT - padB;
      var xMin = -6, xMax = 6, yMin = -0.35, yMax = 1.18;
      var X = function (x) { return padL + (x - xMin) / (xMax - xMin) * plotW; };
      var Y = function (y) { return padT + (yMax - y) / (yMax - yMin) * plotH; };

      // 网格
      for (var gx = -6; gx <= 6; gx += 2) line(ctx, X(gx), padT, X(gx), h - padB, p.line, 1);
      for (var gy = 0; gy <= 1; gy += 0.25) line(ctx, padL, Y(gy), w - padR, Y(gy), p.line, 1);

      // 坐标轴
      line(ctx, padL, Y(0), w - padR, Y(0), p.ink3, 1.2);
      line(ctx, X(0), padT, X(0), h - padB, p.ink3, 1.2);
      label(ctx, "0", X(0) - 4, Y(0) + 12, p.ink3, 10, "right");
      label(ctx, "x", w - padR + 2, Y(0), p.ink3, 11, "left");
      label(ctx, "y", X(0) + 6, padT + 2, p.ink3, 11, "left");

      // y=1 参考线
      line(ctx, padL, Y(1), w - padR, Y(1), p.accent, 1.4, [5, 4]);
      label(ctx, "y = 1", w - padR - 2, Y(1) - 10, p.accent, 10, "right");

      // 曲线
      ctx.save();
      ctx.strokeStyle = p.brand;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      var started = false;
      for (var sx = xMin; sx <= xMax; sx += 0.02) {
        if (Math.abs(sx) < 1e-6) continue;
        var sy = Math.sin(sx) / sx;
        var px = X(sx), py = Y(sy);
        if (!started) { ctx.moveTo(px, py); started = true; } else { ctx.lineTo(px, py); }
      }
      ctx.stroke();
      ctx.restore();

      // 当前点
      var cur = Number(slider.value);
      if (cur < 0.01) cur = 0.01;
      var cy = Math.sin(cur) / cur;
      var cxPx = X(cur), cyPx = Y(cy);
      line(ctx, cxPx, cyPx, cxPx, Y(0), p.ink3, 1, [3, 3]);
      ctx.save();
      ctx.fillStyle = p.brand;
      ctx.beginPath();
      ctx.arc(cxPx, cyPx, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = p.card;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
      label(ctx, "(" + cur.toFixed(2) + ", " + cy.toFixed(4) + ")", cxPx + 9, cyPx - 10, p.ink2, 11);

      val.textContent = cur.toFixed(2);
      read.innerHTML = "<span>x = <b>" + cur.toFixed(3) + "</b></span><span>sin x / x = <b>" + cy.toFixed(6) + "</b></span>";
      if (cur < 0.05) {
        note.innerHTML = "已经非常接近 0 了：函数值 <b>" + cy.toFixed(6) + "</b> 与 1 的差距只有 " + Math.abs(1 - cy).toExponential(2) + "。";
      } else {
        note.innerHTML = "继续把 x 往 0 推，观察函数值是否稳定靠近 <b>1</b>。注意 x 永远不等于 0，但极限存在。";
      }
    }

    slider.addEventListener("input", function () { stop(); draw(); });

    function stop() {
      if (raf) cancelAnimationFrame(raf);
      raf = null;
      playBtn.textContent = "播放逼近";
    }

    playBtn.addEventListener("click", function () {
      if (raf) { stop(); return; }
      var from = Number(slider.value);
      if (from <= 0.02) { from = 1.5; slider.value = "1.5"; }
      var start = performance.now();
      playBtn.textContent = "暂停";
      function step(now) {
        var t = Math.min(1, (now - start) / 2600);
        var eased = 1 - Math.pow(1 - t, 2);
        var x = from + (0.01 - from) * eased;
        slider.value = x.toFixed(2);
        draw();
        if (t < 1) raf = requestAnimationFrame(step);
        else { raf = null; playBtn.textContent = "播放逼近"; }
      }
      raf = requestAnimationFrame(step);
    });

    resetBtn.addEventListener("click", function () {
      stop();
      slider.value = "1.2";
      draw();
    });

    drawers.push(draw);
    window.addEventListener("resize", debounce(function () {
      env = setup(canvas, 320);
      draw();
    }, 150));
    draw();
  }

  /* ── 2. 黎曼和 ── */
  function initRiemann(lab) {
    var canvas = $("#labRiemann", lab);
    if (!canvas) return;
    var slider = $("#rieN", lab);
    var val = $("#rieNVal", lab);
    var playBtn = $("#riePlay", lab);
    var resetBtn = $("#rieReset", lab);
    var read = $("#rieRead", lab);
    var note = $("#rieNote", lab);
    var env = setup(canvas, 320);
    var timer = null;
    var exact = 8 / 3;

    function draw() {
      var p = palette();
      var ctx = env.ctx, w = env.w, h = env.h;
      clear(ctx, w, h, p);
      var padL = 40, padR = 18, padT = 18, padB = 32;
      var plotW = w - padL - padR, plotH = h - padT - padB;
      var xMin = 0, xMax = 2, yMin = 0, yMax = 4.3;
      var X = function (x) { return padL + (x - xMin) / (xMax - xMin) * plotW; };
      var Y = function (y) { return padT + (yMax - y) / (yMax - yMin) * plotH; };
      var n = Number(slider.value);
      var dx = (xMax - xMin) / n;
      var sum = 0;

      for (var gy = 0; gy <= 4; gy += 1) line(ctx, padL, Y(gy), w - padR, Y(gy), p.line, 1);
      line(ctx, padL, Y(0), w - padR, Y(0), p.ink3, 1.2);
      line(ctx, X(0), padT, X(0), h - padB, p.ink3, 1.2);
      label(ctx, "0", X(0) - 4, Y(0) + 12, p.ink3, 10, "right");
      label(ctx, "1", X(1), Y(0) + 12, p.ink3, 10, "center");
      label(ctx, "2", X(2), Y(0) + 12, p.ink3, 10, "center");
      label(ctx, "y = x²", w - padR - 2, Y(4) + 2, p.ink3, 11, "right");

      // 矩形
      for (var i = 0; i < n; i++) {
        var x0 = i * dx;
        var f = x0 * x0;
        sum += f * dx;
        var rx = X(x0), ry = Y(f), rw = plotW / n, rh = Y(0) - Y(f);
        ctx.save();
        ctx.globalAlpha = 0.18;
        ctx.fillStyle = p.brand;
        ctx.fillRect(rx, ry, Math.max(1, rw), rh);
        ctx.globalAlpha = 0.62;
        ctx.strokeStyle = p.brand;
        ctx.lineWidth = Math.max(0.6, Math.min(1.4, 80 / n));
        ctx.strokeRect(rx, ry, Math.max(1, rw), rh);
        ctx.restore();
      }

      // 曲线
      ctx.save();
      ctx.strokeStyle = p.blue;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      for (var sx = 0; sx <= 2; sx += 0.01) {
        var px = X(sx), py = Y(sx * sx);
        if (sx === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.restore();

      val.textContent = String(n);
      read.innerHTML = "<span>n = <b>" + n + "</b></span><span>黎曼和 ≈ <b>" + sum.toFixed(5) + "</b></span><span>精确值 = <b>" + exact.toFixed(5) + "</b></span><span>误差 <b>" + Math.abs(exact - sum).toFixed(5) + "</b></span>";
      note.innerHTML = n < 10
        ? "矩形还很粗，误差明显。把 n 拉大，看看和式如何逼近 <b>8/3</b>。"
        : "n 越大，矩形越贴合曲线。定积分就是 n → ∞ 时黎曼和的极限。";
    }

    function stop() {
      if (timer) clearInterval(timer);
      timer = null;
      playBtn.textContent = "播放细分";
    }

    slider.addEventListener("input", function () { stop(); draw(); });

    playBtn.addEventListener("click", function () {
      if (timer) { stop(); return; }
      var n = 1;
      slider.value = "1";
      draw();
      playBtn.textContent = "暂停";
      timer = setInterval(function () {
        n += 1;
        slider.value = String(n);
        draw();
        if (n >= 60) stop();
      }, 80);
    });

    resetBtn.addEventListener("click", function () {
      stop();
      slider.value = "8";
      draw();
    });

    drawers.push(draw);
    window.addEventListener("resize", debounce(function () {
      env = setup(canvas, 320);
      draw();
    }, 150));
    draw();
  }

  /* ── 3. 幂级数逼近 ── */
  function initSeries(lab) {
    var canvas = $("#labSeries", lab);
    if (!canvas) return;
    var slider = $("#serN", lab);
    var val = $("#serNVal", lab);
    var playBtn = $("#serPlay", lab);
    var resetBtn = $("#serReset", lab);
    var read = $("#serRead", lab);
    var note = $("#serNote", lab);
    var env = setup(canvas, 320);
    var timer = null;

    function partial(x, n) {
      var sum = 0;
      var term = 1;
      for (var k = 0; k <= n; k++) {
        if (k > 0) term *= x / k;
        sum += term;
      }
      return sum;
    }

    function draw() {
      var p = palette();
      var ctx = env.ctx, w = env.w, h = env.h;
      clear(ctx, w, h, p);
      var padL = 40, padR = 18, padT = 18, padB = 32;
      var plotW = w - padL - padR, plotH = h - padT - padB;
      var xMin = -2, xMax = 2, yMin = -1.2, yMax = 7.8;
      var X = function (x) { return padL + (x - xMin) / (xMax - xMin) * plotW; };
      var Y = function (y) { return padT + (yMax - y) / (yMax - yMin) * plotH; };
      var n = Number(slider.value);

      for (var gx = -2; gx <= 2; gx += 1) line(ctx, X(gx), padT, X(gx), h - padB, p.line, 1);
      for (var gy = 0; gy <= 7; gy += 2) line(ctx, padL, Y(gy), w - padR, Y(gy), p.line, 1);
      line(ctx, padL, Y(0), w - padR, Y(0), p.ink3, 1.2);
      line(ctx, X(0), padT, X(0), h - padB, p.ink3, 1.2);
      label(ctx, "x", w - padR + 2, Y(0), p.ink3, 11, "left");
      label(ctx, "y", X(0) + 5, padT, p.ink3, 11, "left");

      // e^x
      ctx.save();
      ctx.strokeStyle = p.brand;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      for (var sx = xMin; sx <= xMax; sx += 0.02) {
        var py = Y(Math.exp(sx));
        if (sx === xMin) ctx.moveTo(X(sx), py); else ctx.lineTo(X(sx), py);
      }
      ctx.stroke();
      ctx.restore();
      label(ctx, "eˣ", X(1.55), Y(Math.exp(1.55)) - 12, p.brand, 12);

      // 部分和
      ctx.save();
      ctx.strokeStyle = p.blue;
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 3]);
      ctx.beginPath();
      for (var tx = xMin; tx <= xMax; tx += 0.02) {
        var sy = partial(tx, n);
        if (sy > yMax + 2 || sy < yMin - 2) continue;
        if (tx === xMin) ctx.moveTo(X(tx), Y(sy)); else ctx.lineTo(X(tx), Y(sy));
      }
      ctx.stroke();
      ctx.restore();
      label(ctx, "P" + n + "(x)", X(-1.8), Y(partial(-1.8, n)) - 12, p.blue, 11);

      var err = Math.abs(Math.exp(2) - partial(2, n));
      val.textContent = String(n);
      read.innerHTML = "<span>展开到 n = <b>" + n + "</b></span><span>P" + n + "(2) = <b>" + partial(2, n).toFixed(4) + "</b></span><span>e² = <b>" + Math.exp(2).toFixed(4) + "</b></span><span>误差 <b>" + err.toFixed(4) + "</b></span>";
      note.innerHTML = n < 4
        ? "项数太少，蓝色虚线还贴不住 eˣ。把 n 加到 8 以上再看。"
        : "在收敛区间内，部分和会越来越贴近 <b>eˣ</b>。幂级数展开就是把函数拆成无穷多个多项式项。";
    }

    function stop() {
      if (timer) clearInterval(timer);
      timer = null;
      playBtn.textContent = "播放展开";
    }

    slider.addEventListener("input", function () { stop(); draw(); });

    playBtn.addEventListener("click", function () {
      if (timer) { stop(); return; }
      var n = 0;
      slider.value = "0";
      draw();
      playBtn.textContent = "暂停";
      timer = setInterval(function () {
        n += 1;
        slider.value = String(n);
        draw();
        if (n >= 12) stop();
      }, 420);
    });

    resetBtn.addEventListener("click", function () {
      stop();
      slider.value = "3";
      draw();
    });

    drawers.push(draw);
    window.addEventListener("resize", debounce(function () {
      env = setup(canvas, 320);
      draw();
    }, 150));
    draw();
  }

  /* ── 4. 极坐标面积元 ── */
  function initPolar(lab) {
    var canvas = $("#labPolar", lab);
    if (!canvas) return;
    var rSlider = $("#polR", lab);
    var tSlider = $("#polT", lab);
    var rVal = $("#polRVal", lab);
    var tVal = $("#polTVal", lab);
    var read = $("#polRead", lab);
    var note = $("#polNote", lab);
    var env = setup(canvas, 340);
    var dr = 0.3;
    var dth = Math.PI / 12;

    function draw() {
      var p = palette();
      var ctx = env.ctx, w = env.w, h = env.h;
      clear(ctx, w, h, p);
      var cx = w / 2, cy = h / 2 + 8;
      var scale = Math.min(w, h) / 2 - 34;
      var r0 = Number(rSlider.value);
      var th = Number(tSlider.value);

      // 极坐标网格
      for (var rr = 0.5; rr <= 2.5; rr += 0.5) {
        ctx.save();
        ctx.strokeStyle = p.line;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, rr * scale, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
      for (var a = 0; a < Math.PI * 2; a += Math.PI / 8) {
        line(ctx, cx, cy, cx + Math.cos(a) * 2.6 * scale, cy - Math.sin(a) * 2.6 * scale, p.line, 1);
      }
      line(ctx, cx, cy, cx + 2.7 * scale, cy, p.ink3, 1.2);
      line(ctx, cx, cy, cx, cy - 2.7 * scale, p.ink3, 1.2);
      label(ctx, "x", cx + 2.7 * scale - 6, cy + 12, p.ink3, 10);
      label(ctx, "y", cx + 6, cy - 2.7 * scale + 8, p.ink3, 10);

      // 高亮面积元
      ctx.save();
      ctx.fillStyle = p.brand;
      ctx.globalAlpha = 0.25;
      ctx.beginPath();
      ctx.arc(cx, cy, (r0 + dr) * scale, -th, -(th + dth), true);
      ctx.arc(cx, cy, r0 * scale, -(th + dth), -th, false);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 0.9;
      ctx.strokeStyle = p.brand;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      // 半径与角度标注
      line(ctx, cx, cy, cx + Math.cos(th) * (r0 + dr) * scale, cy - Math.sin(th) * (r0 + dr) * scale, p.ink3, 1, [3, 3]);
      label(ctx, "r", cx + Math.cos(th) * (r0 + dr) * scale / 2 - 8, cy - Math.sin(th) * (r0 + dr) * scale / 2, p.ink2, 11);
      label(ctx, "dθ", cx + 26, cy - 14, p.ink2, 10);

      var approx = r0 * dr * dth;
      var exact = 0.5 * ((r0 + dr) * (r0 + dr) - r0 * r0) * dth;
      rVal.textContent = r0.toFixed(2);
      tVal.textContent = (th / Math.PI).toFixed(2) + "π";
      read.innerHTML = "<span>r = <b>" + r0.toFixed(2) + "</b></span><span>Δr = <b>" + dr + "</b></span><span>Δθ = <b>π/12</b></span><span>ΔA ≈ rΔrΔθ = <b>" + approx.toFixed(4) + "</b></span><span>精确值 <b>" + exact.toFixed(4) + "</b></span>";
      note.innerHTML = "极坐标下的面积元不是 <b>dr dθ</b>，而是 <b>r dr dθ</b>。那个多出来的 r，就是雅可比行列式的贡献。";
    }

    rSlider.addEventListener("input", draw);
    tSlider.addEventListener("input", draw);
    drawers.push(draw);
    window.addEventListener("resize", debounce(function () {
      env = setup(canvas, 340);
      draw();
    }, 150));
    draw();
  }

  /* ── 5. 矩阵变换 ── */
  function initMatrix(lab) {
    var canvas = $("#labMatrix", lab);
    if (!canvas) return;
    var ids = { a: "#matA", b: "#matB", c: "#matC", d: "#matD" };
    var vals = { a: "#matAVal", b: "#matBVal", c: "#matCVal", d: "#matDVal" };
    var read = $("#matRead", lab);
    var note = $("#matNote", lab);
    var env = setup(canvas, 360);

    function getM() {
      return {
        a: Number($(ids.a, lab).value),
        b: Number($(ids.b, lab).value),
        c: Number($(ids.c, lab).value),
        d: Number($(ids.d, lab).value)
      };
    }

    function draw() {
      var p = palette();
      var ctx = env.ctx, w = env.w, h = env.h;
      clear(ctx, w, h, p);
      var cx = w / 2, cy = h / 2;
      var scale = Math.min(w, h) / 2 - 26;
      var m = getM();
      var X = function (x) { return cx + x * scale; };
      var Y = function (y) { return cy - y * scale; };

      // 原始网格
      for (var i = -3; i <= 3; i++) {
        line(ctx, X(i), Y(-3), X(i), Y(3), p.line, 1);
        line(ctx, X(-3), Y(i), X(3), Y(i), p.line, 1);
      }
      line(ctx, X(-3), Y(0), X(3), Y(0), p.ink3, 1.2);
      line(ctx, X(0), Y(-3), X(0), Y(3), p.ink3, 1.2);

      // 变换后的网格
      ctx.save();
      ctx.strokeStyle = p.brand;
      ctx.globalAlpha = 0.55;
      ctx.lineWidth = 1.2;
      for (var k = -3; k <= 3; k++) {
        ctx.beginPath();
        for (var t = -3; t <= 3; t += 0.1) {
          var x1 = m.a * k + m.b * t;
          var y1 = m.c * k + m.d * t;
          if (t === -3) ctx.moveTo(X(x1), Y(y1)); else ctx.lineTo(X(x1), Y(y1));
        }
        ctx.stroke();
        ctx.beginPath();
        for (var s = -3; s <= 3; s += 0.1) {
          var x2 = m.a * s + m.b * k;
          var y2 = m.c * s + m.d * k;
          if (s === -3) ctx.moveTo(X(x2), Y(y2)); else ctx.lineTo(X(x2), Y(y2));
        }
        ctx.stroke();
      }
      ctx.restore();

      // 基向量
      arrow(ctx, X(0), Y(0), X(m.a), Y(m.c), p.brand, 2.4);
      arrow(ctx, X(0), Y(0), X(m.b), Y(m.d), p.accent, 2.4);
      label(ctx, "Ae₁", X(m.a) + 6, Y(m.c) - 8, p.brand, 11);
      label(ctx, "Ae₂", X(m.b) + 6, Y(m.d) + 12, p.accent, 11);

      var det = m.a * m.d - m.b * m.c;
      var tr = m.a + m.d;
      var disc = tr * tr - 4 * det;
      var lam = "—";
      var eigText = "复特征值";
      if (disc >= 0) {
        var l1 = (tr + Math.sqrt(disc)) / 2;
        var l2 = (tr - Math.sqrt(disc)) / 2;
        lam = l1.toFixed(2) + " , " + l2.toFixed(2);
        eigText = "实特征值";
        // 实特征向量方向
        [l1, l2].forEach(function (l) {
          var vx = m.b, vy = l - m.a;
          if (Math.abs(vx) < 1e-6 && Math.abs(vy) < 1e-6) { vx = l - m.d; vy = m.c; }
          var len = Math.hypot(vx, vy);
          if (len < 1e-6) return;
          vx /= len; vy /= len;
          line(ctx, X(-vx * 3), Y(-vy * 3), X(vx * 3), Y(vy * 3), p.green, 1.4, [6, 5]);
        });
      }
      read.innerHTML = "<span>det A = <b>" + det.toFixed(2) + "</b></span><span>tr A = <b>" + tr.toFixed(2) + "</b></span><span>" + eigText + " λ = <b>" + lam + "</b></span>";
      note.innerHTML = Math.abs(det) < 0.05
        ? "det A ≈ 0：矩阵把平面压扁了，面积变成 0，不可逆。"
        : "绿色虚线是特征向量方向。矩阵作用在它上面的向量，只会伸缩、不改变方向。";
    }

    Object.keys(ids).forEach(function (k) {
      var input = $(ids[k], lab);
      var out = $(vals[k], lab);
      input.addEventListener("input", function () {
        out.textContent = Number(input.value).toFixed(1);
        draw();
      });
    });

    $$("[data-preset]", lab).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var v = btn.getAttribute("data-preset").split(",");
        ["a", "b", "c", "d"].forEach(function (k, i) {
          $(ids[k], lab).value = v[i];
          $(vals[k], lab).textContent = Number(v[i]).toFixed(1);
        });
        draw();
      });
    });

    drawers.push(draw);
    window.addEventListener("resize", debounce(function () {
      env = setup(canvas, 360);
      draw();
    }, 150));
    draw();
  }

  /* ── 6. 中心极限定理 ── */
  function initCLT(lab) {
    var canvas = $("#labCLT", lab);
    if (!canvas) return;
    var select = $("#cltDist", lab);
    var slider = $("#cltN", lab);
    var nVal = $("#cltNVal", lab);
    var btn = $("#cltDraw", lab);
    var read = $("#cltRead", lab);
    var note = $("#cltNote", lab);
    var env = setup(canvas, 330);

    function meanOfSample(n, kind) {
      var sum = 0;
      for (var i = 0; i < n; i++) {
        sum += kind === "exp" ? -Math.log(1 - Math.random()) : Math.random();
      }
      return sum / n;
    }

    function normalPdf(x, mu, sd) {
      return Math.exp(-(x - mu) * (x - mu) / (2 * sd * sd)) / (sd * Math.sqrt(2 * Math.PI));
    }

    function draw() {
      var p = palette();
      var ctx = env.ctx, w = env.w, h = env.h;
      clear(ctx, w, h, p);
      var n = Number(slider.value);
      var kind = select.value;
      var samples = [];
      var i;
      for (i = 0; i < 1500; i++) samples.push(meanOfSample(n, kind));

      var mu = kind === "exp" ? 1 : 0.5;
      var sd = kind === "exp" ? 1 / Math.sqrt(n) : 1 / Math.sqrt(12 * n);
      var min = Math.min.apply(null, samples);
      var max = Math.max.apply(null, samples);
      var pad = (max - min) * 0.08 || 0.1;
      min -= pad; max += pad;
      var bins = 28;
      var binW = (max - min) / bins;
      var counts = new Array(bins).fill(0);
      samples.forEach(function (v) {
        var idx = Math.floor((v - min) / binW);
        if (idx >= 0 && idx < bins) counts[idx] += 1;
      });
      var dens = counts.map(function (c) { return c / (samples.length * binW); });
      var maxDens = Math.max.apply(null, dens);

      var padL = 40, padR = 16, padT = 16, padB = 32;
      var plotW = w - padL - padR, plotH = h - padT - padB;
      var curMax = Math.max(maxDens, normalPdf(mu, mu, sd)) * 1.18;
      var X = function (x) { return padL + (x - min) / (max - min) * plotW; };
      var Y = function (y) { return padT + (1 - y / curMax) * plotH; };

      // 网格与坐标轴
      line(ctx, padL, padT + plotH, w - padR, padT + plotH, p.ink3, 1.2);
      for (var k = 0; k <= 4; k++) {
        var xv = min + (max - min) * k / 4;
        line(ctx, X(xv), padT, X(xv), padT + plotH, p.line, 1);
        label(ctx, xv.toFixed(1), X(xv), padT + plotH + 12, p.ink3, 10, "center");
      }

      // 直方图
      ctx.save();
      ctx.fillStyle = p.brand;
      ctx.globalAlpha = 0.42;
      for (var b = 0; b < bins; b++) {
        var bx = X(min + b * binW);
        var bw = Math.max(1, X(min + (b + 1) * binW) - bx - 1);
        var by = Y(dens[b]);
        ctx.fillRect(bx, by, bw, padT + plotH - by);
      }
      ctx.restore();

      // 正态曲线
      ctx.save();
      ctx.strokeStyle = p.blue;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (var t = 0; t <= 1; t += 0.005) {
        var x = min + (max - min) * t;
        var pdf = normalPdf(x, mu, sd);
        if (t === 0) ctx.moveTo(X(x), Y(pdf)); else ctx.lineTo(X(x), Y(pdf));
      }
      ctx.stroke();
      ctx.restore();

      var mean = samples.reduce(function (a, b) { return a + b; }, 0) / samples.length;
      nVal.textContent = String(n);
      read.innerHTML = "<span>n = <b>" + n + "</b></span><span>样本均值 <b>" + mean.toFixed(4) + "</b></span><span>理论均值 <b>" + mu + "</b></span><span>理论标准差 <b>" + sd.toFixed(4) + "</b></span>";
      note.innerHTML = n < 5
        ? "n 很小时，样本均值的分布还保留着原分布的偏态，正态曲线只是勉强覆盖。"
        : "随着 n 增大，无论原分布是什么，样本均值的直方图都越来越贴合蓝色正态曲线。这就是中心极限定理。";
    }

    slider.addEventListener("input", draw);
    select.addEventListener("change", draw);
    btn.addEventListener("click", draw);
    drawers.push(draw);
    window.addEventListener("resize", debounce(function () {
      env = setup(canvas, 330);
      draw();
    }, 150));
    draw();
  }

  var initializers = {
    limit: initLimit,
    riemann: initRiemann,
    series: initSeries,
    polar: initPolar,
    matrix: initMatrix,
    clt: initCLT
  };

  function initAll() {
    $$("[data-lab]").forEach(function (lab) {
      var type = lab.getAttribute("data-lab");
      if (initializers[type]) initializers[type](lab);
    });
  }

  document.addEventListener("themechange", function () {
    drawers.forEach(function (draw) { draw(); });
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }
})();
