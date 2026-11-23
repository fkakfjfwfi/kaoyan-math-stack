/* 概率统计章节课程数据：p1 - p8 */
window.MATH_CHAPTERS = window.MATH_CHAPTERS || {};
Object.assign(window.MATH_CHAPTERS, {
  p1: {
    id: "p1", subject: "概率", no: "15", title: "随机事件与概率",
    score: 4, stars: 4, freq: "高频", module: "gailv.html", moduleName: "概率统计",
    intro: "概率是给「不确定」打分：0 是不可能，1 是一定。先分清互斥与独立，再用全概率把复杂事件拆成好算的几块。",
    blocks: [
      {
        title: "互斥与独立：两个完全不同的概念",
        html: "<p>事件是「可能发生也可能不发生的结果」。互斥是「不能同时发生」，独立是「一个发生不改变另一个的概率」。这两件事没有必然联系，却是选择题最爱设的坑。</p><div class='formula'><span class='fx-label'>两个判定式</span>互斥：P(AB) = 0，此时 P(A∪B) = P(A) + P(B)<br>独立：P(AB) = P(A)P(B)<span class='small'>概率都不为 0 时：互斥一定不独立，独立一定不互斥。</span></div>"
      },
      {
        title: "四个基本公式",
        html: "<p>加法公式处理「至少一个发生」；条件概率把样本空间缩小到 B 内；全概率按「原因」把事件拆开；贝叶斯则由「结果」反推「原因」。做题先问：已知什么，要求谁。</p><div class='formula'><span class='fx-label'>加法与条件</span>P(A∪B) = P(A) + P(B) − P(AB)<br>P(A|B) = P(AB) / P(B)，P(B) &gt; 0<span class='small'>条件概率的分子是交集，不是 P(A)。</span></div>"
      },
      {
        title: "全概率与贝叶斯是一对",
        html: "<p>把样本空间分成完备事件组 A₁, A₂, …, Aₙ，全概率公式由各原因算结果，贝叶斯公式由结果反推某个原因。分母就是全概率，写一次就能复用。</p><div class='formula'><span class='fx-label'>两个公式</span>P(B) = ΣP(Aᵢ)P(B|Aᵢ)<br>P(Aᵢ|B) = P(Aᵢ)P(B|Aᵢ) / ΣP(Aⱼ)P(B|Aⱼ)</div>"
      }
    ],
    examples: [
      {
        title: "全概率 + 贝叶斯",
        question: "某厂产品由甲、乙两条生产线生产，甲线产量占 60%，次品率 2%；乙线占 40%，次品率 5%。任取一件为次品，求它来自甲线的概率。",
        steps: ["设 A=取自甲线，B=取到次品。P(A)=0.6，P(Ā)=0.4，P(B|A)=0.02，P(B|Ā)=0.05。", "全概率：P(B) = 0.6×0.02 + 0.4×0.05 = 0.012 + 0.02 = 0.032。", "贝叶斯：P(A|B) = 0.012 / 0.032 = 0.375。"],
        answer: "0.375（即 3/8）"
      },
      {
        title: "独立事件求「至少一个」",
        question: "三人独立破译一份密码，各自成功的概率为 1/3、1/4、1/5。求密码被破译的概率。",
        steps: ["「至少一人成功」的反面是「三人都失败」。", "由独立性，三人都失败的概率 = (2/3)×(3/4)×(4/5) = 24/60 = 0.4。", "所以被破译的概率 = 1 − 0.4 = 0.6。"],
        answer: "0.6（即 3/5）"
      }
    ],
    formulas: [
      { name: "加法与条件概率", formula: "P(A∪B) = P(A) + P(B) − P(AB)；P(A|B) = P(AB) / P(B)", note: "P(B) > 0 才能写条件概率" },
      { name: "全概率公式", formula: "P(B) = ΣP(Aᵢ)P(B|Aᵢ)", note: "Aᵢ 要构成完备事件组" },
      { name: "贝叶斯公式", formula: "P(Aᵢ|B) = P(Aᵢ)P(B|Aᵢ) / ΣP(Aⱼ)P(B|Aⱼ)", note: "由结果反推原因" }
    ],
    pitfalls: ["把互斥当成独立：互斥是 P(AB)=0，独立是 P(AB)=P(A)P(B)。", "写 P(A|B) 时忘记 P(B)>0 的前提。", "贝叶斯分母写成 P(B|Aᵢ)，正确应是全概率 ΣP(Aⱼ)P(B|Aⱼ)。"],
    drills: ["p1-1", "p1-2"]
  },
  p2: {
    id: "p2", subject: "概率", no: "16", title: "一维随机变量及其分布",
    score: 5, stars: 5, freq: "必考", module: "gailv.html", moduleName: "概率统计",
    intro: "随机变量是把「结果」翻译成「数」。分布函数 F(x)=P(X≤x) 是累积概率，密度则是概率的浓度——概率等于曲线下的面积。",
    blocks: [
      {
        title: "分布函数：累积到这里的概率",
        html: "<p>F(x)=P(X≤x) 表示 X 落在 (−∞,x] 的概率。它单调不减、右连续，且 F(−∞)=0、F(+∞)=1。离散型的 F 是阶梯，连续型的 F 是密度曲线下的面积。</p><div class='formula'><span class='fx-label'>由 F 求区间概率</span>P(a &lt; X ≤ b) = F(b) − F(a)<span class='small'>连续型端点开闭不影响概率；离散型必须分清。</span></div>"
      },
      {
        title: "离散型与连续型",
        html: "<p>离散型用分布律 pₖ=P(X=xₖ)，所有 pₖ 之和为 1；连续型用密度 f(x)，概率等于面积。密度可以大于 1，只有它的积分必须等于 1。</p><div class='formula'><span class='fx-label'>连续型的三个动作</span>归一化：∫f(x)dx = 1<br>求概率：P(a &lt; X &lt; b) = ∫ₐᵇ f(x)dx<br>求分布：F(x) = ∫₋∞ˣ f(t)dt</div>"
      },
      {
        title: "常见分布与随机变量函数的分布",
        html: "<ul><li><b>0-1 分布</b>：E=p，D=p(1−p)。</li><li><b>二项 B(n,p)</b>：E=np，D=np(1−p)。</li><li><b>泊松 P(λ)</b>：E=D=λ。</li><li><b>均匀 U(a,b)</b>：E=(a+b)/2，D=(b−a)²/12。</li><li><b>指数 E(λ)</b>：E=1/λ，D=1/λ²。</li><li><b>正态 N(μ,σ²)</b>：E=μ，D=σ²。</li></ul><p>求 Y=g(X) 的分布，最稳的是分布函数法：先写 F_Y(y)=P(g(X)≤y)，讨论 y 的范围解不等式，再求导得密度。</p>"
      }
    ],
    examples: [
      {
        title: "由密度求常数与概率",
        question: "设 X 的密度为 f(x)=Ax²（0&lt;x&lt;1），其余为 0。求 A 及 P(0&lt;X&lt;1/2)。",
        steps: ["归一化：∫₀¹ Ax² dx = A/3 = 1，所以 A = 3。", "求概率：P(0&lt;X&lt;1/2) = ∫₀^{1/2} 3x² dx。", "原函数为 x³，代入上下限得 (1/2)³ − 0 = 1/8。"],
        answer: "A = 3，P(0&lt;X&lt;1/2) = 1/8"
      },
      {
        title: "随机变量函数的分布",
        question: "设 X ~ U(0,1)，求 Y = X² 的概率密度。",
        steps: ["当 0&lt;y&lt;1 时，F_Y(y) = P(X² ≤ y) = P(X ≤ √y) = √y；y ≤ 0 时为 0，y ≥ 1 时为 1。", "对 F_Y(y) 求导：f_Y(y) = 1/(2√y)。", "其余区间密度为 0。"],
        answer: "f_Y(y) = 1/(2√y)（0&lt;y&lt;1），其余为 0"
      }
    ],
    formulas: [
      { name: "密度与分布函数", formula: "F(x) = ∫₋∞ˣ f(t)dt；∫₋∞^{+∞} f(x)dx = 1", note: "概率等于密度曲线下的面积" },
      { name: "正态标准化", formula: "X ~ N(μ,σ²) ⇒ (X − μ)/σ ~ N(0,1)", note: "查表前先标准化" },
      { name: "随机变量函数的分布", formula: "F_Y(y) = P(g(X) ≤ y)", note: "先定 y 的范围，再解不等式" }
    ],
    pitfalls: ["以为密度必须小于 1：密度可以大于 1，只有积分才等于 1。", "分布函数在分段点写错：必须右连续，且 F(−∞)=0、F(+∞)=1。", "求 Y=g(X) 的分布时直接套密度公式，没先确认 g 是否单调。"],
    drills: ["p2-1", "p2-2"]
  },
  p3: {
    id: "p3", subject: "概率", no: "17", title: "多维随机变量及其分布",
    score: 6, stars: 5, freq: "必考", module: "gailv.html", moduleName: "概率统计",
    intro: "二维随机变量要同时盯两个指标。联合分布是一张总表，边缘分布只看其中一行或一列；知道边缘不等于知道联合。",
    blocks: [
      {
        title: "联合分布与边缘分布",
        html: "<p>联合分布描述 (X,Y) 一起的规律。联合密度满足二重积分等于 1；把另一个变量积掉，就得到边缘密度。二维均匀分布的概率等于面积比。</p><div class='formula'><span class='fx-label'>两个动作</span>归一化：∬f(x,y)dxdy = 1<br>边缘：f_X(x) = ∫f(x,y)dy<span class='small'>边缘分布不能反推联合分布，这是最常考的反直觉结论。</span></div>"
      },
      {
        title: "独立性与条件分布",
        html: "<p>X、Y 独立，等价于联合分布等于两个边缘分布之积，且要对一切 (x,y) 成立。条件密度 f_{Y|X}(y|x)=f(x,y)/f_X(x)，表示已知 X=x 之后 Y 的分布。</p><div class='formula'><span class='fx-label'>独立判定</span>连续型：f(x,y) = f_X(x)f_Y(y)<br>离散型：pᵢⱼ = pᵢ·pⱼ<span class='small'>只要有一个点不相等，就不独立。</span></div>"
      },
      {
        title: "两个变量的函数",
        html: "<p>Z=X+Y 用卷积公式；Z=max(X,Y)、Z=min(X,Y) 用分布函数更方便。独立同分布时，max 的分布函数是 F(z)ⁿ，min 的是 1−[1−F(z)]ⁿ。</p><div class='formula'><span class='fx-label'>卷积公式</span>f_Z(z) = ∫f(x, z−x)dx<span class='small'>先画出积分区域，再按 z 的取值分段定限。</span></div>"
      }
    ],
    examples: [
      {
        title: "求边缘密度并判断独立",
        question: "设 (X,Y) 的联合密度 f(x,y)=x+y（0&lt;x&lt;1，0&lt;y&lt;1），其余为 0。求两个边缘密度，并判断是否独立。",
        steps: ["f_X(x) = ∫₀¹ (x+y)dy = x + 1/2（0&lt;x&lt;1）；同理 f_Y(y) = y + 1/2。", "若独立，应有 f(x,y) = f_X(x)f_Y(y)。", "但 (x+1/2)(y+1/2) = xy + x/2 + y/2 + 1/4，显然不等于 x+y，所以不独立。"],
        answer: "f_X(x)=x+1/2，f_Y(y)=y+1/2（均在 (0,1) 上）；X 与 Y 不独立"
      },
      {
        title: "两个独立均匀变量之和",
        question: "设 X、Y 独立且都服从 U(0,1)，求 Z=X+Y 的概率密度。",
        steps: ["由卷积 f_Z(z) = ∫f_X(x)f_Y(z−x)dx，被积函数在 0≤x≤1 且 0≤z−x≤1 时为 1。", "当 0&lt;z&lt;1 时，x 从 0 到 z，积分长度为 z，所以 f_Z(z)=z。", "当 1≤z&lt;2 时，x 从 z−1 到 1，积分长度为 2−z；其余 z 处密度为 0。"],
        answer: "f_Z(z)=z（0&lt;z&lt;1），f_Z(z)=2−z（1≤z&lt;2），其余为 0"
      }
    ],
    formulas: [
      { name: "边缘密度", formula: "f_X(x) = ∫f(x,y)dy；f_Y(y) = ∫f(x,y)dx", note: "把另一个变量积分积掉" },
      { name: "独立性判定", formula: "独立 ⇔ f(x,y) = f_X(x)f_Y(y)", note: "要对一切 (x,y) 成立" },
      { name: "和的卷积", formula: "f_Z(z) = ∫f(x, z−x)dx", note: "独立时可写成 ∫f_X(x)f_Y(z−x)dx" }
    ],
    pitfalls: ["用边缘分布反推联合分布，或由边缘独立判断联合独立。", "二维积分不画区域，定限的上下限写反。", "求 Z=X+Y 时直接写 f_X(z)f_Y(z)，那只有独立时才是卷积。"],
    drills: ["p3-1", "p3-2", "p3-3"]
  },
  p4: {
    id: "p4", subject: "概率", no: "18", title: "随机变量的数字特征",
    score: 5, stars: 5, freq: "必考", module: "gailv.html", moduleName: "概率统计",
    intro: "期望是长期平均，方差是波动大小，协方差看两个变量是否同涨同跌。它们把一整张分布压缩成几个数。",
    blocks: [
      {
        title: "期望：长期平均",
        html: "<p>离散型 E(X)=Σxₖpₖ，连续型 E(X)=∫xf(x)dx。期望有线性性，且不需要独立；但 E(g(X)) 一般不等于 g(E(X))。</p><div class='formula'><span class='fx-label'>线性性</span>E(aX + bY + c) = aE(X) + bE(Y) + c<span class='small'>求 E(X²) 要用 ∫x²f(x)dx 或 Σxₖ²pₖ，不能把 E(X) 平方。</span></div>"
      },
      {
        title: "方差：波动大小",
        html: "<p>D(X)=E(X²)−(EX)²。加常数不影响方差，乘系数要平方。两个变量相加减时，方差里会多出协方差项。</p><div class='formula'><span class='fx-label'>三条公式</span>D(aX + b) = a²D(X)<br>D(X ± Y) = D(X) + D(Y) ± 2Cov(X,Y)<span class='small'>只有独立时 Cov=0，才有 D(X±Y)=DX+DY。</span></div>"
      },
      {
        title: "协方差与相关系数",
        html: "<p>Cov(X,Y)=E(XY)−EX·EY，衡量同涨同跌。相关系数 ρ 是它的标准化版本，取值在 [−1,1]。ρ=0 只说明没有线性关系，不排除其他关系。</p><div class='formula'><span class='fx-label'>反直觉结论</span>Cov(X,Y) = E(XY) − E(X)E(Y)<br>ρ = Cov(X,Y) / (σ_X σ_Y)<span class='small'>ρ=0 推不出独立；只有二维正态时才等价。</span></div>"
      }
    ],
    examples: [
      {
        title: "用期望方差的性质算三个量",
        question: "已知 E(X)=2，D(X)=3。求 E(2X−1)、D(2X−1)、E(X²)。",
        steps: ["由线性性：E(2X−1) = 2E(X) − 1 = 2×2 − 1 = 3。", "由 D(aX+b)=a²D(X)：D(2X−1) = 4×3 = 12。", "由 D(X)=E(X²)−(EX)²：E(X²) = D(X) + (EX)² = 3 + 4 = 7。"],
        answer: "E(2X−1)=3，D(2X−1)=12，E(X²)=7"
      },
      {
        title: "协方差进入方差公式",
        question: "已知 D(X)=1，D(Y)=4，Cov(X,Y)=1。求 D(X+Y)、D(X−Y) 与相关系数 ρ。",
        steps: ["D(X+Y) = D(X) + D(Y) + 2Cov(X,Y) = 1 + 4 + 2 = 7。", "D(X−Y) = D(X) + D(Y) − 2Cov(X,Y) = 1 + 4 − 2 = 3。", "σ_X=1，σ_Y=2，所以 ρ = 1/(1×2) = 0.5。"],
        answer: "D(X+Y)=7，D(X−Y)=3，ρ=0.5"
      }
    ],
    formulas: [
      { name: "期望的线性性", formula: "E(aX + bY + c) = aE(X) + bE(Y) + c", note: "不需要独立性" },
      { name: "方差公式", formula: "D(X) = E(X²) − (EX)²；D(aX+b) = a²D(X)", note: "算 E(X²) 时最常用" },
      { name: "协方差与相关系数", formula: "Cov(X,Y) = E(XY) − EX·EY；ρ = Cov/(σ_Xσ_Y)", note: "|ρ|≤1，ρ=0 只表示不相关" }
    ],
    pitfalls: ["写成 E(g(X))=g(E(X))，例如 E(X²)≠(EX)²。", "D(X−Y) 漏项或写错符号：应为 DX+DY−2Cov。", "把 ρ=0 当成独立；只有二维正态下不相关才等价于独立。"],
    drills: ["p4-1", "p4-2", "p4-3"]
  },
  p5: {
    id: "p5", subject: "概率", no: "19", title: "大数定律与中心极限定理",
    score: 2, stars: 3, freq: "低频", module: "gailv.html", moduleName: "概率统计",
    intro: "大数定律说平均会稳，中心极限定理说平均会正态。一个是频率稳定，一个是近似计算，别混。",
    blocks: [
      {
        title: "切比雪夫不等式",
        html: "<p>只用期望和方差就能给概率一个界：偏离均值超过 ε 的概率不超过 DX/ε²。它不需要知道分布，代价是估计偏松。</p><div class='formula'><span class='fx-label'>两种写法</span>P{|X − E(X)| ≥ ε} ≤ D(X)/ε²<br>P{|X − E(X)| &lt; ε} ≥ 1 − D(X)/ε²<span class='small'>考试给「不超过」「至少」，先判断用哪一个方向。</span></div>"
      },
      {
        title: "大数定律与中心极限定理",
        html: "<p>大数定律说样本均值会稳定到总体均值，即频率稳定于概率；中心极限定理说标准化后的和趋近标准正态，用于近似计算概率。</p><div class='formula'><span class='fx-label'>中心极限定理</span>ΣXᵢ 近似服从 N(nμ, nσ²)<br>(ΣXᵢ − nμ)/(σ√n) 近似服从 N(0,1)<span class='small'>分母是 σ√n，不是 σn，也不是 σ，这是最高频的计算错误。</span></div>"
      }
    ],
    examples: [
      {
        title: "切比雪夫给下界",
        question: "已知 E(X)=10，D(X)=4，用切比雪夫不等式估计 P(6&lt;X&lt;14) 的下界。",
        steps: ["6&lt;X&lt;14 等价于 |X − 10| &lt; 4，即 ε=4。", "由切比雪夫：P{|X−10| &lt; 4} ≥ 1 − D(X)/ε²。", "代入得 1 − 4/16 = 3/4。"],
        answer: "P(6&lt;X&lt;14) ≥ 3/4"
      },
      {
        title: "中心极限定理做近似计算",
        question: "某元件寿命均值 100 小时，标准差 10 小时。抽取 100 个，求样本均值超过 102 小时的概率（用 Φ 表示）。",
        steps: ["由中心极限定理，X̄ 近似服从 N(μ, σ²/n)，标准差为 10/√100 = 1。", "标准化：P(X̄ &gt; 102) = P(Z &gt; (102−100)/1) = P(Z &gt; 2)。", "所以概率约为 1 − Φ(2) ≈ 0.0228。"],
        answer: "1 − Φ(2) ≈ 0.0228"
      }
    ],
    formulas: [
      { name: "切比雪夫不等式", formula: "P{|X − EX| ≥ ε} ≤ DX/ε²", note: "只给上界，不需要分布" },
      { name: "辛钦大数定律", formula: "独立同分布，E(X)=μ ⇒ X̄ 依概率收敛到 μ", note: "频率稳定于概率" },
      { name: "中心极限定理", formula: "(ΣXᵢ − nμ)/(σ√n) 近似 N(0,1)", note: "分母是 σ√n" }
    ],
    pitfalls: ["标准化时除以 σn，正确应为 σ√n。", "忽略「独立同分布、方差有限」的前提就套定理。", "把大数定律（频率稳定）和中心极限定理（近似正态）混为一谈。"],
    drills: ["p5-1", "p5-2"]
  },
  p6: {
    id: "p6", subject: "概率", no: "20", title: "数理统计的基本概念",
    score: 3, stars: 4, freq: "高频", module: "gailv.html", moduleName: "概率统计",
    intro: "统计量是从样本算出来的数。三大抽样分布都由正态样本按固定方式拼出来，记住构造式就能直接套。",
    blocks: [
      {
        title: "总体、样本与统计量",
        html: "<p>总体是全部研究对象，样本是抽出的 n 个独立同分布观测。统计量是只含样本、不含未知参数的函数，最常用的是样本均值与样本方差。</p><div class='formula'><span class='fx-label'>两个统计量</span>X̄ = (1/n)ΣXᵢ<br>S² = [1/(n−1)]Σ(Xᵢ − X̄)²<span class='small'>S² 分母是 n−1，这样才是 σ² 的无偏估计。</span></div>"
      },
      {
        title: "三大抽样分布的构造",
        html: "<p>χ² 是标准正态的平方和；t 是标准正态除以「χ² 除自由度」的平方根；F 是两个 χ² 各除自由度后的比值。构造时都要求相互独立。</p><ul><li><b>χ²(n)</b>：n 个独立标准正态变量的平方和。</li><li><b>t(n)</b>：X~N(0,1) 与 Y~χ²(n) 独立，构造 X/√(Y/n)。</li><li><b>F(n₁,n₂)</b>：两个独立 χ² 各除自由度后相除。</li></ul>"
      },
      {
        title: "正态总体的抽样分布",
        html: "<p>设 X₁,…,Xₙ 来自 N(μ,σ²)，样本均值与样本方差有固定分布。这三条结论是参数估计与假设检验的全部工具来源。</p><div class='formula'><span class='fx-label'>三条结论</span>X̄ ~ N(μ, σ²/n)<br>(n−1)S²/σ² ~ χ²(n−1)<br>(X̄ − μ)/(S/√n) ~ t(n−1)<span class='small'>第三个式子用 S 代替 σ，所以自由度是 n−1。</span></div>"
      }
    ],
    examples: [
      {
        title: "样本方差的分布与期望",
        question: "设 X₁,…,X₁₆ 来自正态总体 N(μ,σ²)。指出 (n−1)S²/σ² 的分布，并求 E(S²)。",
        steps: ["正态总体下 (n−1)S²/σ² ~ χ²(n−1)，这里 n=16，所以服从 χ²(15)。", "χ²(m) 的期望等于自由度 m，故 E[(n−1)S²/σ²] = n−1。", "提出常数：(n−1)E(S²)/σ² = n−1，所以 E(S²) = σ²。"],
        answer: "(n−1)S²/σ² ~ χ²(15)；E(S²) = σ²"
      },
      {
        title: "χ² 分布的期望与方差",
        question: "设 X₁,…,X₉ 独立且都服从 N(0,1)，令 Y = X₁² + … + X₉²。求 Y 的分布、E(Y) 与 D(Y)。",
        steps: ["9 个独立标准正态变量的平方和服从 χ²(9)。", "χ²(m) 的期望为 m，所以 E(Y) = 9。", "χ²(m) 的方差为 2m，所以 D(Y) = 18。"],
        answer: "Y ~ χ²(9)；E(Y)=9，D(Y)=18"
      }
    ],
    formulas: [
      { name: "χ² 分布构造", formula: "X₁,…,Xₙ ~ N(0,1) 独立 ⇒ ΣXᵢ² ~ χ²(n)", note: "自由度等于平方项个数" },
      { name: "t 与 F 的构造", formula: "X/√(Y/n) ~ t(n)；(U/n₁)/(V/n₂) ~ F(n₁,n₂)", note: "t 要求分子分母独立" },
      { name: "正态总体抽样分布", formula: "(n−1)S²/σ² ~ χ²(n−1)；(X̄−μ)/(S/√n) ~ t(n−1)", note: "S² 的分母是 n−1" }
    ],
    pitfalls: ["样本方差分母写成 n，正确应为 n−1。", "构造 t 统计量时忘记分子分母必须独立。", "χ² 的自由度写成 n，正态总体样本方差对应的是 n−1。"],
    drills: ["p6-1", "p6-2"]
  },
  p7: {
    id: "p7", subject: "概率", no: "21", title: "参数估计",
    score: 3, stars: 4, freq: "高频", module: "gailv.html", moduleName: "概率统计",
    intro: "参数估计是用样本猜总体。矩估计让样本矩等于总体矩；最大似然则找「最可能产生这组数据」的参数。",
    blocks: [
      {
        title: "矩估计：让矩相等",
        html: "<p>用样本矩代替总体矩。一个未知参数通常只需一阶矩：写出 E(X) 关于参数的表达式，令它等于 X̄，解出参数即可；参数多时再用二阶矩。</p><div class='formula'><span class='fx-label'>矩估计原则</span>E(X^k) = (1/n)ΣXᵢ^k<span class='small'>先算总体矩，再令其等于样本矩，不要反过来。</span></div>"
      },
      {
        title: "最大似然：找最可能的参数",
        html: "<p>把样本看作已经发生的事实，选一个参数使这组数据出现的概率最大。步骤固定：写似然、取对数、求导令零、解出并验证。</p><div class='formula'><span class='fx-label'>似然函数</span>L(θ) = ∏f(xᵢ;θ)，令 d(lnL)/dθ = 0<span class='small'>连乘先取对数，是最大似然的第一动作。</span></div>"
      },
      {
        title: "评价估计量的三个标准",
        html: "<p>无偏性看 E(θ̂) 是否等于 θ；有效性在都无偏的前提下比较方差，方差越小越有效；一致性看样本量趋于无穷时 θ̂ 是否依概率收敛到 θ。</p><div class='formula'><span class='fx-label'>两个最常考</span>无偏：E(θ̂) = θ<br>有效：D(θ̂₁) &lt; D(θ̂₂)<span class='small'>无偏不一定有效，两个标准要分开判断。</span></div>"
      }
    ],
    examples: [
      {
        title: "均匀分布的矩估计",
        question: "设 X ~ U(0,θ)，X₁,…,Xₙ 为样本，求 θ 的矩估计量。",
        steps: ["均匀分布 U(0,θ) 的期望为 E(X) = θ/2。", "令总体一阶矩等于样本一阶矩：θ/2 = X̄。", "解出 θ̂ = 2X̄。"],
        answer: "θ̂ = 2X̄"
      },
      {
        title: "指数分布的最大似然",
        question: "设 X ~ E(λ)，密度为 λe^{−λx}（x&gt;0），X₁,…,Xₙ 为样本，求 λ 的最大似然估计。",
        steps: ["似然函数 L(λ) = ∏λe^{−λxᵢ} = λⁿ e^{−λΣxᵢ}。", "取对数：lnL = n lnλ − λΣxᵢ。", "求导令零：n/λ − Σxᵢ = 0，得 λ̂ = n/Σxᵢ = 1/X̄。"],
        answer: "λ̂ = 1/X̄"
      }
    ],
    formulas: [
      { name: "矩估计", formula: "令 E(X^k) = (1/n)ΣXᵢ^k，解出参数", note: "一个参数用一个方程" },
      { name: "最大似然", formula: "L(θ) = ∏f(xᵢ;θ)，令 d(lnL)/dθ = 0", note: "先取对数再求导" },
      { name: "无偏性", formula: "E(θ̂) = θ", note: "无偏只保证平均对，不代表方差小" }
    ],
    pitfalls: ["最大似然不取对数就直接求导，或漏掉参数空间的限制。", "把估计量写成估计值，混淆 θ̂ 与具体数值。", "认为无偏就一定好，忽略有效性（方差大小）。"],
    drills: ["p7-1", "p7-2"]
  },
  p8: {
    id: "p8", subject: "概率", no: "22", title: "假设检验",
    score: 2, stars: 3, freq: "低频", module: "gailv.html", moduleName: "概率统计",
    intro: "假设检验是「先假定无罪，再看证据够不够推翻」。H₀ 通常设成没有差异，统计量落进拒绝域才拒绝。",
    blocks: [
      {
        title: "思想与两类错误",
        html: "<p>先设 H₀（通常是没有差异），再用样本算检验统计量，落进拒绝域就拒绝 H₀，否则只说证据不足。第一类错误是「H₀ 真却拒绝」，概率为 α；第二类错误是「H₀ 假却没拒绝」，概率为 β。</p><div class='formula'><span class='fx-label'>两类错误</span>α = P{拒绝 H₀ | H₀ 真}（弃真）<br>β = P{不拒绝 H₀ | H₀ 假}（取伪）<span class='small'>样本量固定时，α 减小通常使 β 增大。</span></div>"
      },
      {
        title: "三个常用检验",
        html: "<p>检验均值分两种情形：σ² 已知用 U 检验，σ² 未知用 t 检验；检验方差用 χ² 检验。双侧检验把 α 平分到两端，单侧检验把 α 全放在一侧。</p><ul><li><b>U 检验</b>：σ² 已知，U = (X̄−μ₀)/(σ/√n) ~ N(0,1)。</li><li><b>t 检验</b>：σ² 未知，t = (X̄−μ₀)/(S/√n) ~ t(n−1)。</li><li><b>χ² 检验</b>：检验 σ²，χ² = (n−1)S²/σ₀² ~ χ²(n−1)。</li></ul>"
      }
    ],
    examples: [
      {
        title: "U 检验（σ² 已知）",
        question: "某零件长度 X ~ N(μ, 0.04)，抽取 9 件得 X̄ = 10.2。在 α=0.05 下检验 H₀：μ=10（双侧，u_{0.025}=1.96）。",
        steps: ["σ = 0.2，σ/√n = 0.2/3 ≈ 0.0667。", "计算统计量：U = (10.2 − 10)/0.0667 ≈ 3。", "双侧临界值为 1.96，|U| = 3 &gt; 1.96，落在拒绝域内。"],
        answer: "拒绝 H₀，认为平均长度与 10 有显著差异"
      },
      {
        title: "t 检验（σ² 未知）",
        question: "某电池标称平均寿命 μ₀=50 小时，抽取 16 只测得 X̄=51.5，S=2。在 α=0.05 下检验（双侧，t_{0.025}(15)=2.131）。",
        steps: ["σ² 未知，用 t 检验：t = (X̄ − μ₀)/(S/√n)。", "S/√n = 2/4 = 0.5，所以 t = (51.5 − 50)/0.5 = 3。", "临界值 t_{0.025}(15) = 2.131，|t| = 3 &gt; 2.131，落入拒绝域。"],
        answer: "拒绝 H₀，认为平均寿命与 50 小时有显著差异"
      }
    ],
    formulas: [
      { name: "U 检验（σ² 已知）", formula: "U = (X̄ − μ₀)/(σ/√n) ~ N(0,1)", note: "双侧 |U| &gt; u_{α/2} 时拒绝" },
      { name: "t 检验（σ² 未知）", formula: "t = (X̄ − μ₀)/(S/√n) ~ t(n−1)", note: "用样本标准差 S 代替 σ" },
      { name: "χ² 检验（检验方差）", formula: "χ² = (n−1)S²/σ₀² ~ χ²(n−1)", note: "检验 σ² 时使用" }
    ],
    pitfalls: ["不拒绝 H₀ 说成「接受 H₀ 为真」，只能说证据不足。", "单侧与双侧的临界值混用，拒绝域写反。", "σ² 未知时仍用 U 检验，应改为 t 检验。"],
    drills: ["p8-1"]
  }
});
