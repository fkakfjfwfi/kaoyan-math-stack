/* 研数 · 分级题库：60 题，章节页与练习场共用 */
window.MATH_BANK = [
  /* ── 高等数学（上） ── */
  {
    id: "g1-1", subject: "高数", chapterId: "g1", chapter: "极限与连续", level: "mid",
    q: "lim(x→0) (tan x − sin x) / x³ = ?",
    options: ["1/6", "1/3", "1/2", "1"],
    answer: 2,
    exp: "tan x − sin x = tan x(1 − cos x)。x→0 时 tan x ~ x，1 − cos x ~ x²/2，所以原式 = (x · x²/2) / x³ = 1/2。"
  },
  {
    id: "g1-2", subject: "高数", chapterId: "g1", chapter: "极限与连续", level: "basic",
    q: "lim(x→0) (1 − cos x) / x² = ?",
    options: ["1/2", "1", "0", "2"],
    answer: 0,
    exp: "1 − cos x ~ x²/2，所以极限为 1/2。这是等价无穷小里最高频的一条。"
  },
  {
    id: "g1-3", subject: "高数", chapterId: "g1", chapter: "极限与连续", level: "basic",
    q: "设 lim(x→0) sin(ax) / x = 2，则 a = ?",
    options: ["1", "2", "1/2", "4"],
    answer: 1,
    exp: "sin(ax) ~ ax，所以 sin(ax)/x → a。由 a = 2 得答案。"
  },
  {
    id: "g2-1", subject: "高数", chapterId: "g2", chapter: "一元微分学", level: "basic",
    q: "设 y = x eˣ，则 y′(0) = ?",
    options: ["0", "1", "2", "e"],
    answer: 1,
    exp: "y′ = eˣ + x eˣ = eˣ(1 + x)，代入 x = 0 得 y′(0) = 1。"
  },
  {
    id: "g2-2", subject: "高数", chapterId: "g2", chapter: "一元微分学", level: "mid",
    q: "曲线 y = x³ − 3x 的极大值点是？",
    options: ["x = −1", "x = 1", "x = 0", "x = 3"],
    answer: 0,
    exp: "y′ = 3x² − 3 = 0 得 x = ±1。y″ = 6x，在 x = −1 处 y″ < 0，取得极大值；在 x = 1 处取得极小值。"
  },
  {
    id: "g2-3", subject: "高数", chapterId: "g2", chapter: "一元微分学", level: "basic",
    q: "曲线 y = 1/(x − 1) 的渐近线是？",
    options: ["x = 1 与 y = 0", "x = 0 与 y = 1", "x = 1 与 y = 1", "没有渐近线"],
    answer: 0,
    exp: "x→1 时分母趋于 0、函数趋于无穷，得垂直渐近线 x = 1；x→∞ 时 y→0，得水平渐近线 y = 0。"
  },
  {
    id: "g3-1", subject: "高数", chapterId: "g3", chapter: "一元积分学", level: "mid",
    q: "∫₀¹ x ln x dx = ?",
    options: ["−1/4", "1/4", "−1/2", "1/2"],
    answer: 0,
    exp: "分部积分：原式 = [x²/2 · ln x]₀¹ − ∫₀¹ x/2 dx = 0 − 1/4 = −1/4。注意 x→0⁺ 时 x² ln x → 0。"
  },
  {
    id: "g3-2", subject: "高数", chapterId: "g3", chapter: "一元积分学", level: "basic",
    q: "∫ x eˣ dx = ?",
    options: ["(x − 1)eˣ + C", "(x + 1)eˣ + C", "x eˣ + C", "eˣ + C"],
    answer: 0,
    exp: "分部积分，取 u = x、dv = eˣdx，得 x eˣ − ∫eˣdx = (x − 1)eˣ + C。"
  },
  {
    id: "g3-3", subject: "高数", chapterId: "g3", chapter: "一元积分学", level: "basic",
    q: "d/dx ∫₀ˣ sin(t²) dt = ?",
    options: ["sin(x²)", "2x sin(x²)", "cos(x²)", "sin x"],
    answer: 0,
    exp: "变限积分求导：上限是 x，直接将被积函数中的 t 换成 x，得 sin(x²)。若上限是 x²，才需要再乘 2x。"
  },

  /* ── 高等数学（下） ── */
  {
    id: "g4-1", subject: "高数", chapterId: "g4", chapter: "向量代数与空间解析几何", level: "basic",
    q: "过点 (1, 0, 0) 且法向量为 (1, 1, 1) 的平面方程是？",
    options: ["x + y + z = 1", "x + y + z = 0", "x − y + z = 1", "x + y − z = 1"],
    answer: 0,
    exp: "点法式：1(x − 1) + 1(y − 0) + 1(z − 0) = 0，整理得 x + y + z = 1。"
  },
  {
    id: "g4-2", subject: "高数", chapterId: "g4", chapter: "向量代数与空间解析几何", level: "basic",
    q: "直线 (x − 1)/1 = y/2 = (z + 1)/3 的方向向量是？",
    options: ["(1, 2, 3)", "(1, 0, −1)", "(1, 2, −3)", "(2, 1, 3)"],
    answer: 0,
    exp: "对称式分母即方向向量，因此方向向量为 (1, 2, 3)；点 (1, 0, −1) 是直线上的点，不是方向向量。"
  },
  {
    id: "g5-1", subject: "高数", chapterId: "g5", chapter: "多元函数微分学", level: "basic",
    q: "设 z = x²y，则 ∂z/∂x 在点 (1, 2) 处的值为？",
    options: ["2", "4", "1", "0"],
    answer: 1,
    exp: "∂z/∂x = 2xy，代入 (1, 2) 得 4。"
  },
  {
    id: "g5-2", subject: "高数", chapterId: "g5", chapter: "多元函数微分学", level: "mid",
    q: "函数 f(x, y) = x² + y² − 2x − 4y 的极小值点是？",
    options: ["(1, 2)", "(0, 0)", "(−1, −2)", "(2, 1)"],
    answer: 0,
    exp: "令 f_x = 2x − 2 = 0、f_y = 2y − 4 = 0，得驻点 (1, 2)。Hessian 为 [[2,0],[0,2]] 正定，因此是极小值点。"
  },
  {
    id: "g6-1", subject: "高数", chapterId: "g6", chapter: "多元函数积分学", level: "mid",
    q: "设 D 为单位圆 x² + y² ≤ 1，则 ∬_D (x² + y²) dσ = ?",
    options: ["π/2", "π", "2π", "π/4"],
    answer: 0,
    exp: "用极坐标：∫₀^{2π}∫₀¹ r² · r dr dθ = 2π · 1/4 = π/2。关键别漏掉雅可比 r。"
  },
  {
    id: "g6-2", subject: "高数", chapterId: "g6", chapter: "多元函数积分学", level: "real",
    q: "设 L 为单位圆周 x² + y² = 1，取正向，则 ∮_L x dy − y dx = ?",
    options: ["0", "π", "2π", "4π"],
    answer: 2,
    exp: "P = −y，Q = x，由格林公式：∂Q/∂x − ∂P/∂y = 1 − (−1) = 2，所以积分 = 2 · 圆面积 = 2π。"
  },
  {
    id: "g6-3", subject: "高数", chapterId: "g6", chapter: "多元函数积分学", level: "real",
    q: "设 Σ 为单位球面 x² + y² + z² = 1 的外侧，则 ∯_Σ x dy dz + y dz dx + z dx dy = ?",
    options: ["4π/3", "4π", "2π", "0"],
    answer: 1,
    exp: "由高斯公式，散度 ∂P/∂x + ∂Q/∂y + ∂R/∂z = 1 + 1 + 1 = 3，积分 = 3 × 球体积 = 3 × 4π/3 = 4π。"
  },
  {
    id: "g6-4", subject: "高数", chapterId: "g6", chapter: "多元函数积分学", level: "mid",
    q: "交换积分次序：∫₀¹ dx ∫ₓ¹ f(x, y) dy = ?",
    options: ["∫₀¹ dy ∫₀ʸ f(x, y) dx", "∫₀¹ dy ∫_y¹ f(x, y) dx", "∫₀¹ dy ∫₀¹ f(x, y) dx", "∫₀¹ dy ∫ₓ¹ f(x, y) dx"],
    answer: 0,
    exp: "原区域为 0 ≤ x ≤ 1、x ≤ y ≤ 1，即 0 ≤ y ≤ 1、0 ≤ x ≤ y，所以交换后是 ∫₀¹ dy ∫₀ʸ f dx。画图最稳。"
  },
  {
    id: "g7-1", subject: "高数", chapterId: "g7", chapter: "无穷级数", level: "mid",
    q: "级数 Σ(n=1→∞) (−1)ⁿ / n 的敛散性是？",
    options: ["绝对收敛", "条件收敛", "发散", "无法判定"],
    answer: 1,
    exp: "取绝对值后为调和级数，发散；原级数为交错级数，1/n 单调递减趋于 0，由莱布尼茨判别法收敛，因此条件收敛。"
  },
  {
    id: "g7-2", subject: "高数", chapterId: "g7", chapter: "无穷级数", level: "real",
    q: "幂级数 Σ(n=1→∞) xⁿ / n 的收敛域是？",
    options: ["[−1, 1)", "(−1, 1)", "[−1, 1]", "(−1, 1]"],
    answer: 0,
    exp: "收敛半径 R = 1。x = 1 时为调和级数，发散；x = −1 时为交错调和级数，收敛。因此收敛域是 [−1, 1)。"
  },
  {
    id: "g8-1", subject: "高数", chapterId: "g8", chapter: "常微分方程", level: "mid",
    q: "微分方程 y′ + y = e⁻ˣ，y(0) = 1 的解是？",
    options: ["y = (x + 1)e⁻ˣ", "y = (x − 1)e⁻ˣ", "y = e⁻ˣ", "y = x e⁻ˣ"],
    answer: 0,
    exp: "积分因子 eˣ，两边相乘得 (y eˣ)′ = 1，积分得 y eˣ = x + C。代入 y(0) = 1 得 C = 1，所以 y = (x + 1)e⁻ˣ。"
  },
  {
    id: "g8-2", subject: "高数", chapterId: "g8", chapter: "常微分方程", level: "basic",
    q: "微分方程 y″ − 3y′ + 2y = 0 的通解是？",
    options: ["C₁eˣ + C₂e²ˣ", "C₁e⁻ˣ + C₂e⁻²ˣ", "(C₁ + C₂x)eˣ", "eˣ(C₁cos 2x + C₂sin 2x)"],
    answer: 0,
    exp: "特征方程 r² − 3r + 2 = 0，根为 r = 1、2，因此通解为 C₁eˣ + C₂e²ˣ。"
  },

  /* ── 线性代数 ── */
  {
    id: "x1-1", subject: "线代", chapterId: "x1", chapter: "行列式", level: "basic",
    q: "行列式 |1 2; 3 4| = ?",
    options: ["−2", "2", "4", "−4"],
    answer: 0,
    exp: "二阶行列式等于主对角线乘积减副对角线乘积：1×4 − 2×3 = −2。"
  },
  {
    id: "x2-1", subject: "线代", chapterId: "x2", chapter: "矩阵", level: "basic",
    q: "设 A 为 3 阶矩阵，|A| = 2，则 |2A| = ?",
    options: ["4", "8", "16", "2"],
    answer: 2,
    exp: "|kA| = kⁿ|A|，n = 3，所以 |2A| = 2³ × 2 = 16。"
  },
  {
    id: "x2-2", subject: "线代", chapterId: "x2", chapter: "矩阵", level: "basic",
    q: "设 A 可逆，则 (Aᵀ)⁻¹ = ?",
    options: ["(A⁻¹)ᵀ", "Aᵀ", "A⁻¹", "A"],
    answer: 0,
    exp: "转置与求逆可交换顺序：(Aᵀ)⁻¹ = (A⁻¹)ᵀ。"
  },
  {
    id: "x3-1", subject: "线代", chapterId: "x3", chapter: "向量", level: "basic",
    q: "向量组 α₁ = (1,0,0)，α₂ = (0,1,0)，α₃ = (1,1,0) 的秩为？",
    options: ["1", "2", "3", "0"],
    answer: 1,
    exp: "α₃ = α₁ + α₂，三个向量都在 xy 平面内，极大无关组可取 α₁、α₂，因此秩为 2。"
  },
  {
    id: "x4-1", subject: "线代", chapterId: "x4", chapter: "线性方程组", level: "basic",
    q: "设 A 是 4×5 矩阵，r(A) = 3，则 Ax = 0 的基础解系含几个向量？",
    options: ["1", "2", "3", "4"],
    answer: 1,
    exp: "未知数个数 n = 5，基础解系向量个数为 n − r(A) = 5 − 3 = 2。"
  },
  {
    id: "x4-2", subject: "线代", chapterId: "x4", chapter: "线性方程组", level: "basic",
    q: "非齐次线性方程组 Ax = b 有解的充要条件是？",
    options: ["r(A) = r(A|b)", "|A| ≠ 0", "r(A) = n", "b = 0"],
    answer: 0,
    exp: "系数矩阵的秩等于增广矩阵的秩，是 Ax = b 有解的充要条件（Rouché–Capelli 定理）。"
  },
  {
    id: "x5-1", subject: "线代", chapterId: "x5", chapter: "特征值与特征向量", level: "basic",
    q: "矩阵 A = [[2,1],[1,2]] 的特征值是？",
    options: ["1, 3", "−1, 3", "2, 2", "0, 4"],
    answer: 0,
    exp: "|λE − A| = (λ − 2)² − 1 = (λ − 1)(λ − 3)，所以特征值为 1 和 3。"
  },
  {
    id: "x5-2", subject: "线代", chapterId: "x5", chapter: "特征值与特征向量", level: "basic",
    q: "设 3 阶矩阵 A 的特征值为 1、2、3，则 |A| = ?",
    options: ["5", "6", "0", "1"],
    answer: 1,
    exp: "行列式等于全部特征值之积：1 × 2 × 3 = 6。"
  },
  {
    id: "x6-1", subject: "线代", chapterId: "x6", chapter: "二次型", level: "basic",
    q: "二次型 f = x₁² + 2x₂² + 3x₃² 的正惯性指数是？",
    options: ["1", "2", "3", "0"],
    answer: 2,
    exp: "标准形中三个平方项系数都为正，正惯性指数为 3，二次型正定。"
  },
  {
    id: "x6-2", subject: "线代", chapterId: "x6", chapter: "二次型", level: "basic",
    q: "实对称矩阵 A 正定的充要条件是？",
    options: ["顺序主子式全大于 0", "|A| > 0", "特征值有正有负", "r(A) = n"],
    answer: 0,
    exp: "顺序主子式全大于 0 是正定的充要条件；|A| > 0 只是必要条件，秩满也只是必要条件。"
  },

  /* ── 概率论与数理统计 ── */
  {
    id: "p1-1", subject: "概率", chapterId: "p1", chapter: "随机事件与概率", level: "mid",
    q: "已知 P(A) = 0.5，P(B) = 0.4，P(A∪B) = 0.7，则 P(A|B) = ?",
    options: ["0.25", "0.4", "0.5", "0.6"],
    answer: 2,
    exp: "P(AB) = P(A) + P(B) − P(A∪B) = 0.5 + 0.4 − 0.7 = 0.2，所以 P(A|B) = P(AB)/P(B) = 0.2/0.4 = 0.5。"
  },
  {
    id: "p2-1", subject: "概率", chapterId: "p2", chapter: "一维随机变量及其分布", level: "basic",
    q: "设 X ~ N(1, 4)，则 P(X ≤ 1) = ?",
    options: ["0.25", "0.5", "0.75", "1"],
    answer: 1,
    exp: "正态分布关于均值 μ = 1 对称，因此 P(X ≤ μ) = 1/2。"
  },
  {
    id: "p2-2", subject: "概率", chapterId: "p2", chapter: "一维随机变量及其分布", level: "basic",
    q: "设 X 服从参数为 λ 的指数分布，则 E(X) = ?",
    options: ["λ", "1/λ", "λ²", "1/λ²"],
    answer: 1,
    exp: "指数分布 E(λ) 的期望为 1/λ，方差为 1/λ²。注意参数 λ 在分母上。"
  },
  {
    id: "p3-1", subject: "概率", chapterId: "p3", chapter: "多维随机变量及其分布", level: "basic",
    q: "设 X ~ N(0, 1)，Y ~ N(1, 1)，且 X、Y 独立，则 X + Y ~ ?",
    options: ["N(1, 2)", "N(0, 2)", "N(1, 1)", "N(0, 1)"],
    answer: 0,
    exp: "独立正态变量之和仍为正态：均值相加 0 + 1 = 1，方差相加 1 + 1 = 2，所以 X + Y ~ N(1, 2)。"
  },
  {
    id: "p3-2", subject: "概率", chapterId: "p3", chapter: "多维随机变量及其分布", level: "basic",
    q: "设 (X, Y) 在单位正方形 [0,1]² 上服从均匀分布，则 P(X ≤ 0.5, Y ≤ 0.5) = ?",
    options: ["0.25", "0.5", "0.75", "1"],
    answer: 0,
    exp: "二维均匀分布的概率等于面积比：左下角小正方形面积为 0.5 × 0.5 = 0.25，总面积 1，所以概率为 0.25。"
  },
  {
    id: "p4-1", subject: "概率", chapterId: "p4", chapter: "随机变量的数字特征", level: "mid",
    q: "设 D(X) = 4，D(Y) = 9，Cov(X, Y) = 2，则 D(X + Y) = ?",
    options: ["13", "17", "15", "9"],
    answer: 1,
    exp: "D(X + Y) = D(X) + D(Y) + 2Cov(X, Y) = 4 + 9 + 4 = 17。"
  },
  {
    id: "p4-2", subject: "概率", chapterId: "p4", chapter: "随机变量的数字特征", level: "basic",
    q: "设 X ~ B(10, 0.4)，则 E(X) = ?",
    options: ["2.4", "4", "6", "0.4"],
    answer: 1,
    exp: "二项分布 B(n, p) 的期望为 np = 10 × 0.4 = 4。"
  },
  {
    id: "p5-1", subject: "概率", chapterId: "p5", chapter: "大数定律与中心极限定理", level: "mid",
    q: "设 X₁,…,Xₙ 独立同分布，E(X) = μ，D(X) = σ²，当 n 充分大时，ΣXᵢ 近似服从？",
    options: ["N(nμ, nσ²)", "N(μ, σ²)", "N(nμ, σ²)", "N(μ, nσ²)"],
    answer: 0,
    exp: "中心极限定理：ΣXᵢ 的均值为 nμ，方差为 nσ²，标准化后趋于 N(0,1)，所以近似分布为 N(nμ, nσ²)。"
  },
  {
    id: "p6-1", subject: "概率", chapterId: "p6", chapter: "数理统计的基本概念", level: "mid",
    q: "设 X₁,…,Xₙ 来自正态总体 N(μ, σ²)，则 (n − 1)S² / σ² 服从？",
    options: ["χ²(n − 1)", "χ²(n)", "t(n − 1)", "F(1, n − 1)"],
    answer: 0,
    exp: "正态总体样本方差的抽样分布：(n − 1)S²/σ² ~ χ²(n − 1)，自由度是 n − 1。"
  },
  {
    id: "p7-1", subject: "概率", chapterId: "p7", chapter: "参数估计", level: "basic",
    q: "设 X ~ B(1, p)，X₁,…,Xₙ 为样本，则 p 的矩估计量为？",
    options: ["X̄", "S²", "X̄²", "1 − X̄"],
    answer: 0,
    exp: "总体一阶矩 E(X) = p，令样本一阶矩 X̄ = p，得 p 的矩估计量为 X̄。"
  },
  {
    id: "p8-1", subject: "概率", chapterId: "p8", chapter: "假设检验", level: "basic",
    q: "在假设检验中，第一类错误的概率等于？",
    options: ["α", "1 − α", "β", "1 − β"],
    answer: 0,
    exp: "第一类错误是“原假设为真却拒绝”，其概率就是显著性水平 α；第二类错误概率记为 β。"
  },

  /* ── 扩充题库：补高频章节的常考角度 ── */
  {
    id: "g1-4", subject: "高数", chapterId: "g1", chapter: "极限与连续", level: "basic",
    q: "lim(x→0) (1 + 2x)^(1/x) = ?",
    options: ["e", "e²", "2e", "1"],
    answer: 1,
    exp: "凑第二个重要极限：(1+2x)^(1/x) = [(1+2x)^(1/(2x))]² → e²。"
  },
  {
    id: "g2-4", subject: "高数", chapterId: "g2", chapter: "一元微分学", level: "basic",
    q: "设 f(x) 在 x = 0 处可导，且 f(0) = 0，则 lim(x→0) f(x)/x = ?",
    options: ["f′(0)", "0", "f(0)", "不存在"],
    answer: 0,
    exp: "由导数定义：f′(0) = lim(x→0) [f(x) − f(0)]/(x − 0) = lim f(x)/x。"
  },
  {
    id: "g3-4", subject: "高数", chapterId: "g3", chapter: "一元积分学", level: "basic",
    q: "∫₀¹ 1/√x dx = ?",
    options: ["1", "2", "1/2", "发散"],
    answer: 1,
    exp: "这是瑕点积分：∫ x^(−1/2) dx = 2√x，代入 0、1 得 2 − 0 = 2，收敛。"
  },
  {
    id: "g4-3", subject: "高数", chapterId: "g4", chapter: "向量代数与空间解析几何", level: "basic",
    q: "点 (1, 2, 3) 到平面 x + y + z = 0 的距离是？",
    options: ["√3", "2√3", "6", "3"],
    answer: 1,
    exp: "点到平面距离 d = |1+2+3| / √(1²+1²+1²) = 6/√3 = 2√3。"
  },
  {
    id: "g5-3", subject: "高数", chapterId: "g5", chapter: "多元函数微分学", level: "mid",
    q: "f(x, y) = x² + y² 在点 (1, 1) 处沿方向 (1, 1) 的方向导数是？",
    options: ["2", "2√2", "√2", "4"],
    answer: 1,
    exp: "梯度 grad f = (2x, 2y)，在 (1,1) 处为 (2,2)；方向 (1,1) 的单位向量为 (1/√2, 1/√2)，方向导数 = 2/√2 + 2/√2 = 2√2。"
  },
  {
    id: "g6-5", subject: "高数", chapterId: "g6", chapter: "多元函数积分学", level: "mid",
    q: "设 Ω 为柱体 0 ≤ z ≤ 1，x² + y² ≤ 1，则 ∭_Ω z dv = ?",
    options: ["π/2", "π", "2π", "π/4"],
    answer: 0,
    exp: "先对 z 积分：∫₀¹ z dz = 1/2；底面单位圆面积为 π，所以结果为 π/2。"
  },
  {
    id: "g6-6", subject: "高数", chapterId: "g6", chapter: "多元函数积分学", level: "basic",
    q: "设 L 为从 (0,0) 到 (1,1) 的直线段，则 ∫_L x dy + y dx = ?",
    options: ["0", "1", "2", "1/2"],
    answer: 1,
    exp: "x dy + y dx = d(xy) 是全微分，积分与路径无关，等于 xy 在端点处的差：1×1 − 0×0 = 1。"
  },
  {
    id: "g7-3", subject: "高数", chapterId: "g7", chapter: "无穷级数", level: "basic",
    q: "幂级数 Σ(n=0→∞) xⁿ / 2ⁿ 的收敛半径是？",
    options: ["1", "2", "1/2", "4"],
    answer: 1,
    exp: "由比值法 |aₙ₊₁/aₙ| = 1/2，所以 R = 2。也可看成公比为 x/2 的几何级数，|x/2| < 1。"
  },
  {
    id: "g8-3", subject: "高数", chapterId: "g8", chapter: "常微分方程", level: "mid",
    q: "欧拉方程 x²y″ + xy′ − y = 0，令 x = eᵗ 后化为？",
    options: ["y″ − y = 0", "y″ + y = 0", "y″ − 2y = 0", "y″ + 2y = 0"],
    answer: 0,
    exp: "令 x=eᵗ，则 xy′ = dy/dt，x²y″ = d²y/dt² − dy/dt。代回得 (y_tt − y_t) + y_t − y = y_tt − y = 0。"
  },
  {
    id: "x1-2", subject: "线代", chapterId: "x1", chapter: "行列式", level: "basic",
    q: "行列式 |1 1 1; a b c; a² b² c²| = ?",
    options: ["(b−a)(c−a)(c−b)", "(a−b)(a−c)(b−c)", "0", "abc"],
    answer: 0,
    exp: "这是范德蒙德行列式，值为 ∏(x_j − x_i)（j > i），即 (b−a)(c−a)(c−b)。"
  },
  {
    id: "x3-2", subject: "线代", chapterId: "x3", chapter: "向量", level: "mid",
    q: "设 α₁ = (1,1,0)，α₂ = (1,0,1)，用施密特正交化得到的 β₂ 与下列哪个向量同向？",
    options: ["(1, −1, 2)", "(1, 1, 2)", "(1, −1, 0)", "(2, 1, −1)"],
    answer: 0,
    exp: "β₂ = α₂ − (α₂,α₁)/(α₁,α₁)·α₁ = (1,0,1) − 1/2(1,1,0) = (1/2, −1/2, 1)，与 (1,−1,2) 同向。"
  },
  {
    id: "x4-3", subject: "线代", chapterId: "x4", chapter: "线性方程组", level: "basic",
    q: "方程组 x + y + z = 1，2x + 2y + 2z = 2 的解的情况是？",
    options: ["唯一解", "无解", "无穷多解", "无法判断"],
    answer: 2,
    exp: "第二个方程是第一个的 2 倍，系数矩阵秩为 1，未知数 3 个，所以有无穷多解（自由变量 2 个）。"
  },
  {
    id: "p1-2", subject: "概率", chapterId: "p1", chapter: "随机事件与概率", level: "basic",
    q: "设 A、B 相互独立，P(A) = 0.5，P(B) = 0.4，则 P(A∪B) = ?",
    options: ["0.7", "0.9", "0.2", "0.1"],
    answer: 0,
    exp: "独立时 P(AB) = 0.5×0.4 = 0.2，所以 P(A∪B) = 0.5 + 0.4 − 0.2 = 0.7。"
  },
  {
    id: "p3-3", subject: "概率", chapterId: "p3", chapter: "多维随机变量及其分布", level: "basic",
    q: "设 X、Y 独立且都服从 U(0,1)，则 P(max(X,Y) ≤ 0.5) = ?",
    options: ["0.25", "0.5", "0.75", "1"],
    answer: 0,
    exp: "max(X,Y) ≤ 0.5 等价于 X ≤ 0.5 且 Y ≤ 0.5，由独立性概率为 0.5×0.5 = 0.25。"
  },
  {
    id: "p4-3", subject: "概率", chapterId: "p4", chapter: "随机变量的数字特征", level: "mid",
    q: "若 X、Y 的相关系数 ρ = 0，则下列正确的是？",
    options: ["X、Y 一定独立", "X、Y 一定不独立", "X、Y 不相关", "X、Y 方差一定相等"],
    answer: 2,
    exp: "ρ=0 只说明 X、Y 不相关（无线性关系），不代表独立；只有当联合分布为二维正态时，不相关才等价于独立。"
  },
  {
    id: "p5-2", subject: "概率", chapterId: "p5", chapter: "大数定律与中心极限定理", level: "mid",
    q: "设 D(X) = 1，由切比雪夫不等式，P{|X − E(X)| ≥ 3} ≤ ?",
    options: ["1/3", "1/9", "1", "3"],
    answer: 1,
    exp: "切比雪夫不等式：P{|X−EX| ≥ ε} ≤ DX/ε² = 1/9。"
  },
  {
    id: "p6-2", subject: "概率", chapterId: "p6", chapter: "数理统计的基本概念", level: "basic",
    q: "正态总体均值 μ 的检验中，若 σ² 未知，应使用？",
    options: ["U 检验", "t 检验", "χ² 检验", "F 检验"],
    answer: 1,
    exp: "σ² 未知时用样本方差 S² 代替，统计量 (X̄−μ₀)/(S/√n) ~ t(n−1)，即 t 检验。"
  },
  {
    id: "p7-2", subject: "概率", chapterId: "p7", chapter: "参数估计", level: "mid",
    q: "设 X ~ E(λ)，X₁,…,Xₙ 为样本，则 λ 的最大似然估计是？",
    options: ["1/X̄", "X̄", "X̄²", "1/X̄²"],
    answer: 0,
    exp: "似然 L(λ) = λⁿe^(−λΣxᵢ)，对数求导 n/λ − Σxᵢ = 0，得 λ̂ = n/Σxᵢ = 1/X̄。"
  }
];
