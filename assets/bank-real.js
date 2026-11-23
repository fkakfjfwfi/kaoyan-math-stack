/* 研数 · 十年真题库加载器：把各年份的紧凑数组转成题库对象 */
(function () {
  "use strict";

  var CHAPTER = {
    g1: "极限与连续", g2: "一元微分学", g3: "一元积分学", g4: "向量代数与空间解析几何",
    g5: "多元函数微分学", g6: "多元函数积分学", g7: "无穷级数", g8: "常微分方程",
    x1: "行列式", x2: "矩阵", x3: "向量", x4: "线性方程组", x5: "特征值与特征向量", x6: "二次型",
    p1: "随机事件与概率", p2: "一维随机变量及其分布", p3: "多维随机变量及其分布",
    p4: "随机变量的数字特征", p5: "大数定律与中心极限定理", p6: "数理统计的基本概念",
    p7: "参数估计", p8: "假设检验"
  };
  var SUBJECT = { g: "高数", x: "线代", p: "概率" };
  var TYPE = function (no) { return no <= 10 ? "选择" : no <= 16 ? "填空" : "解答"; };

  var raw = window.MATH_REAL_RAW || [];
  var bank = window.MATH_BANK || (window.MATH_BANK = []);
  var seen = {};
  var supSeq = 0;
  bank.forEach(function (q) { seen[q.id] = 1; });
  function pad(n) { return n < 10 ? "0" + n : String(n); }

  raw.forEach(function (r) {
    var year = r[0], no = r[1], ch = r[2];
    if (!year) supSeq += 1;
    var id = year ? "r" + year + "-" + pad(no) : "rs-" + pad(supSeq);
    if (seen[id] || !CHAPTER[ch]) return;
    seen[id] = 1;
    var origin = r[7] || "改编";
    bank.push({
      id: id,
      subject: SUBJECT[ch.charAt(0)],
      chapterId: ch,
      chapter: CHAPTER[ch],
      level: "real",
      year: year || null,
      no: no,
      origin: origin,
      type: TYPE(no),
      source: year ? (year === 2022
        ? year + " 数一 · 第 " + no + " 题改编"
        : year + " 数一 · 考点改编 " + no)
        : "同源补充 · 第 " + supSeq + " 题",
      q: r[3],
      options: r[4],
      answer: r[5],
      exp: r[6]
    });
  });
})();
