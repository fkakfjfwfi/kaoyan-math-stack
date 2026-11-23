/* 高数（上）章节课程数据：g1 - g3 */
window.MATH_CHAPTERS = window.MATH_CHAPTERS || {};
Object.assign(window.MATH_CHAPTERS, {
  g1: {
    id: "g1", subject: "高数", no: "01", title: "函数、极限与连续",
    score: 10, stars: 5, freq: "必考", module: "gaoshu-1.html", moduleName: "高数（上）",
    intro: "极限是「无限靠近」：x 可以无限接近 0，但不一定到达 0。整张数一卷子都建立在极限上，先学会判断类型，再选工具。",
    blocks: [
      {
        title: "极限的三种问法",
        html: "<p>数列极限看 n→∞，函数极限看 x→x₀ 或 x→∞，左右极限则分别从两侧靠近。分段函数在分段点、绝对值在拐点，都必须分别算左右极限。</p><p><b>极限存在</b> ⇔ 左极限、右极限都存在且相等。只算一侧就下结论，是选择题最常见的陷阱。</p><div class='formula'><span class='fx-label'>连续的定义</span>f 在 x₀ 连续 ⇔ lim(x→x₀) f(x) = f(x₀)<span class='small'>可导一定连续，连续不一定可导；|x| 在 0 处连续但不可导。</span></div>"
      },
      {
        title: "求极限的工具箱",
        html: "<p>先代入看类型：0/0、∞/∞、0·∞、∞−∞、1^∞、0⁰、∞⁰。能化简先化简，能等价替换先替换；仍是未定式再洛必达；出现高阶项考虑泰勒。</p><div class='formula'><span class='fx-label'>等价无穷小（x→0）</span>sin x ~ tan x ~ arcsin x ~ arctan x ~ ln(1+x) ~ eˣ−1 ~ x<br>1−cos x ~ x²/2；(1+x)^α − 1 ~ αx<span class='small'>只允许在乘除因子中替换；加减法里直接替换是最高频错误。</span></div>"
      },
      {
        title: "连续与间断点",
        html: "<p>间断点分两类：第一类包括可去间断点与跳跃间断点（左右极限都存在）；第二类包括无穷间断点与振荡间断点（至少一侧极限不存在）。闭区间上连续函数具有有界性、最值性、介值性和零点定理。</p><p>做证明题时，看到「存在 ξ 使 f(ξ)=0」先想零点定理；看到「存在 ξ 使 f(ξ)=c」先想介值定理。</p>"
      }
    ],
    examples: [
      {
        title: "三种工具串起来",
        question: "求 lim(x→0) (tan x − sin x) / x³。",
        logic: "先别急着洛必达：分子是两个等价无穷小相减，一阶项会抵消；先提公因式把「差」变「乘积」，才能安全替换。",
        steps: ["先化简结构：tan x − sin x = tan x(1 − cos x)。", "等价替换：tan x ~ x，1 − cos x ~ x²/2，所以分子 ~ x³/2。", "约分：(x³/2)/x³ = 1/2。"],
        answer: "1/2"
      },
      {
        title: "1^∞ 型",
        question: "求 lim(x→0) (1 + 2x)^(1/x)。",
        logic: "底趋于 1、指数趋于无穷，是 1^∞ 型；把它凑成 (1+u)^{1/u} 的标准形式，指数里多出来的 2 最后变成平方。",
        steps: ["凑第二个重要极限：把指数改写成 1/(2x) 的 2 倍。", "(1+2x)^(1/x) = [(1+2x)^(1/(2x))]²。", "中括号内趋于 e，所以原式趋于 e²。"],
        answer: "e²"
      }
    ],
    formulas: [
      { name: "两个重要极限", formula: "lim(x→0) sin x / x = 1；lim(x→∞) (1 + 1/x)ˣ = e", note: "所有 1^∞ 型都可凑第二个" },
      { name: "泰勒展开", formula: "eˣ = 1 + x + x²/2! + …；sin x = x − x³/3! + …；ln(1+x) = x − x²/2 + …", note: "高阶未定式优先泰勒" },
      { name: "零点定理", formula: "f 在 [a,b] 连续，f(a)f(b) < 0 ⇒ 存在 ξ∈(a,b)，f(ξ)=0", note: "证明根的存在性" }
    ],
    pitfalls: ["加减法中滥用等价无穷小，sin x − x 不能直接换成 0。", "洛必达前不验证 0/0 或 ∞/∞，结论无效。", "分段点只算一侧极限，就判断极限存在。"],
    drills: ["g1-1", "g1-2", "g1-3", "g1-4"]
  },
  g2: {
    id: "g2", subject: "高数", no: "02", title: "一元函数微分学",
    score: 14, stars: 5, freq: "必考", module: "gaoshu-1.html", moduleName: "高数（上）",
    intro: "导数是「仪表盘上的瞬时速度」：把平均变化率的 Δx 压到 0，得到某一瞬间的变化率。中值定理则告诉你，平均变化率总会在某一刻被瞬时变化率追上。",
    blocks: [
      {
        title: "导数定义与可导性",
        html: "<p>导数定义：f′(x₀) = lim(Δx→0) [f(x₀+Δx) − f(x₀)]/Δx。判断分段函数在分段点是否可导，必须分别算左右导数，且两者相等。</p><div class='formula'><span class='fx-label'>关系链</span>可导 ⇒ 连续 ⇒ 极限存在<span class='small'>反过来都不成立：|x| 在 0 处连续不可导。</span></div>"
      },
      {
        title: "求导与中值定理",
        html: "<p>复合函数用链式法则，隐函数两边对 x 求导，参数方程 dy/dx = y′(t)/x′(t)，幂指函数用对数求导。中值定理看到「存在 ξ」先想罗尔/拉格朗日/柯西/泰勒；证明题从结论逆推辅助函数。</p><div class='formula'><span class='fx-label'>拉格朗日中值定理</span>f(b) − f(a) = f′(ξ)(b − a)，ξ∈(a,b)<span class='small'>看到 f(b)−f(a) 就想它；看到二阶导想泰勒。</span></div>"
      },
      {
        title: "函数性态与曲率",
        html: "<p>列表讨论：定义域 → 导数 → 驻点/不可导点 → 单调性 → 极值 → 二阶导 → 凹凸/拐点 → 渐近线。曲率 K = |y″|/(1+y′²)^(3/2)，曲率半径 R = 1/K。</p>"
      }
    ],
    examples: [
      {
        title: "极值与渐近线一次做完",
        question: "求 y = x e⁻ˣ 的单调区间、极值与渐近线。",
        logic: "先问「要求什么」：单调、极值、渐近线都由一阶导和极限决定；求导后先找驻点，再分别看两侧符号，不要只代一个点。",
        steps: ["y′ = (1 − x)e⁻ˣ，令 y′ = 0 得 x = 1。", "x<1 递增，x>1 递减，所以 x=1 为极大值点，极大值 1/e。", "x→+∞ 时 y→0，得水平渐近线 y=0；x→−∞ 时 y→−∞，无垂直渐近线。"],
        answer: "极大值 1/e；水平渐近线 y=0"
      },
      {
        title: "用中值定理证明不等式",
        question: "证明：当 x>0 时，ln(1+x) < x。",
        logic: "要证函数值的大小，最自然的桥是拉格朗日：把两个函数值之差写成 f′(ξ) 乘区间长度，再用 ξ 的范围控制符号。",
        steps: ["设 f(t)=ln(1+t)，在 [0,x] 上用拉格朗日中值定理。", "ln(1+x) − ln1 = x/(1+ξ)，其中 0<ξ<x。", "因为 1/(1+ξ) < 1，所以 ln(1+x) < x。"],
        answer: "由拉格朗日中值定理得证"
      }
    ],
    formulas: [
      { name: "导数定义", formula: "f′(x₀) = lim(Δx→0) [f(x₀+Δx) − f(x₀)] / Δx", note: "判断可导、求极限两用" },
      { name: "拉格朗日中值定理", formula: "f(b) − f(a) = f′(ξ)(b − a)", note: "证明不等式、存在性的主力" },
      { name: "曲率", formula: "K = |y″| / (1 + y′²)^(3/2)", note: "数一选填偶有考查" }
    ],
    pitfalls: ["把可导与连续互相推导，忽略 |x| 这类反例。", "极值点与驻点混同：极值点也可能在不可导点。", "中值定理证明题硬凑辅助函数，不从结论逆推。"],
    drills: ["g2-1", "g2-2", "g2-3", "g2-4"]
  },
  g3: {
    id: "g3", subject: "高数", no: "03", title: "一元函数积分学",
    score: 15, stars: 5, freq: "必考", module: "gaoshu-1.html", moduleName: "高数（上）",
    intro: "积分是「把无数薄片加起来」：定积分算曲线下的有向面积，不定积分是找谁求导能得到它。变限积分则是「一边切、一边累加」的函数。",
    blocks: [
      {
        title: "不定积分三板斧",
        html: "<p>先看能不能凑微分（f′(x)dx = df(x)）；不能凑就换元，换元三件事：换被积函数、换 dx、换上下限；两类不同函数相乘优先分部积分。有理函数先拆部分分式。</p><div class='formula'><span class='fx-label'>分部积分</span>∫u dv = uv − ∫v du<span class='small'>选 u 顺序：反、对、幂、指、三。</span></div>"
      },
      {
        title: "定积分与变限积分",
        html: "<p>定积分先看对称性和奇偶性；变限积分求导时，上下限都是函数要分别乘内层导数。反常积分先判断敛散性，再套牛顿—莱布尼茨。</p><div class='formula'><span class='fx-label'>变限积分求导</span>d/dx ∫φ(x)^ψ(x) f(t)dt = f(ψ(x))ψ′(x) − f(φ(x))φ′(x)<span class='small'>上限为 x² 时，最容易漏乘 2x。</span></div>"
      },
      {
        title: "定积分的应用",
        html: "<p>面积、旋转体体积、弧长、物理量。绕 x 轴体积 V = π∫f²dx；绕 y 轴用柱壳法 V = 2π∫x|f(x)|dx。先画图，确认半径与积分变量。</p>"
      }
    ],
    examples: [
      {
        title: "分部积分 + 反常端点",
        question: "求 ∫₀¹ x ln x dx。",
        logic: "对数求导会变成有理式，幂函数容易积分；所以让 ln x 当 u、x dx 当 dv，这是「对反幂三指」的顺序。",
        steps: ["取 u=ln x，dv=x dx，则 du=dx/x，v=x²/2。", "原式 = [x²/2·ln x]₀¹ − ∫₀¹ x/2 dx。", "x→0⁺ 时 x²ln x→0，第一项为 0；第二项为 1/4，所以结果为 −1/4。"],
        answer: "−1/4"
      },
      {
        title: "换元要换上下限",
        question: "求 ∫₀¹ x/(1+x²) dx。",
        logic: "看到分母是 1+x²、分子有 x，先想「凑微分」：x dx 正好是 d(1+x²) 的一半；换元后必须同时换上下限。",
        steps: ["令 u=1+x²，则 du=2x dx，x dx=du/2。", "x=0 时 u=1，x=1 时 u=2。", "原式 = 1/2∫₁² du/u = 1/2 ln2。"],
        answer: "1/2 ln 2"
      }
    ],
    formulas: [
      { name: "变限积分求导", formula: "d/dx ∫φ(x)^ψ(x) f(t)dt = f(ψ)ψ′ − f(φ)φ′", note: "上下限都是函数时两项都要乘" },
      { name: "华里士公式", formula: "∫₀^(π/2) sinⁿx dx = (n−1)!!/n!! · (n 偶乘 π/2，n 奇乘 1)", note: "定积分速算" },
      { name: "旋转体体积", formula: "绕 x 轴：V = π∫f²(x)dx；绕 y 轴：V = 2π∫x|f(x)|dx", note: "先画图确认半径" }
    ],
    pitfalls: ["换元后忘记改积分上下限，或忘记把 dx 换成 du。", "变限积分求导漏乘内层导数。", "反常积分直接套牛顿—莱布尼茨，没先判敛散性。"],
    drills: ["g3-1", "g3-2", "g3-3", "g3-4"]
  }
});
