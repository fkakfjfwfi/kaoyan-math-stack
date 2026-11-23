/* 研数 · 外部题库试跑：大观园 16 题 + 本站补充 4 题，共 20 题 */
window.MATH_BANK = (window.MATH_BANK || []).concat([
  /* ── 高等数学：一元微分（大观园） ── */
  {
    id: "ext-g2-1", subject: "高数", chapterId: "g2", chapter: "一元函数微分学", level: "basic", source: "大观园",
    q: "设 f(x) = −f(−x)，且在 (0, +∞) 内 f′(x) > 0，f″(x) > 0，则在 (−∞, 0) 内（ ）",
    options: ["f′(x) < 0，f″(x) < 0", "f′(x) < 0，f″(x) > 0", "f′(x) > 0，f″(x) < 0", "f′(x) > 0，f″(x) > 0"],
    answer: 2,
    exp: "f 为奇函数，所以 f′ 为偶函数、f″ 为奇函数。x<0 时令 t=−x>0，f′(x)=f′(t)>0，f″(x)=−f″(t)<0，选 C。"
  },
  {
    id: "ext-g2-2", subject: "高数", chapterId: "g2", chapter: "一元函数微分学", level: "basic", source: "大观园",
    q: "设 f(−x) = f(x)（x∈R），且在 (−∞, 0) 内 f′(x) > 0，f″(x) < 0，则在 (0, +∞) 内（ ）",
    options: ["f′(x) > 0，f″(x) < 0", "f′(x) > 0，f″(x) > 0", "f′(x) < 0，f″(x) < 0", "f′(x) < 0，f″(x) > 0"],
    answer: 2,
    exp: "f 为偶函数，所以 f′ 为奇函数、f″ 为偶函数。x>0 时令 t=−x<0，f′(x)=−f′(t)<0，f″(x)=f″(t)<0，选 C。"
  },
  {
    id: "ext-g2-3", subject: "高数", chapterId: "g2", chapter: "一元函数微分学", level: "mid", source: "大观园",
    q: "若 f(x)=f(−x)，g(x)=−g(−x)，且在 (0,+∞) 内 f′>0、f″>0、g′>0、g″<0，则在 (−∞,0) 内恒成立的是（ ）",
    options: ["f′(x) > g′(x)", "f′(x) < g′(x)", "f″(x) > g″(x)", "f″(x) < g″(x)"],
    answer: 1,
    exp: "x<0 时令 t=−x>0。f 偶 ⇒ f′ 奇，f′(x)=−f′(t)<0；g 奇 ⇒ g′ 偶，g′(x)=g′(t)>0，所以 f′<g′，选 B。"
  },
  {
    id: "ext-g2-4", subject: "高数", chapterId: "g2", chapter: "一元函数微分学", level: "mid", source: "大观园",
    q: "设 f(x) 与 g(x) 在 R 上可导，且 f(x) < g(x)，则必有（ ）",
    options: ["f(−x) > g(−x)", "f′(x) < g′(x)", "lim(x→x₀) f(x) < lim(x→x₀) g(x)", "∫₀ˣ f(t)dt < ∫₀ˣ g(t)dt"],
    answer: 2,
    exp: "可导必连续，所以 f(x₀)<g(x₀)，取极限得严格不等式，C 正确。A 方向相反；B 导数大小没有必然关系；D 在 x<0 时不等号会反向。"
  },
  {
    id: "ext-g2-5", subject: "高数", chapterId: "g2", chapter: "一元函数微分学", level: "mid", source: "大观园",
    q: "设 f、g 在 (a,b) 上可导，考虑：① 若 f(x)>g(x)，则 f′(x)>g′(x)；② 若 f′(x)>g′(x)，则 f(x)>g(x)。则（ ）",
    options: ["①② 都正确", "①② 都不正确", "① 正确，② 不正确", "① 不正确，② 正确"],
    answer: 1,
    exp: "①反例：f=e⁻ˣ，g=0（x>0 时 f>g，但 f′<0=g′）；②反例：f=0，g=−x（x>0 时 f′>g′，但 f<g）。所以都不正确。"
  },

  /* ── 高等数学：一元积分（1 题来自大观园，4 题本站补充） ── */
  {
    id: "ext-g3-1", subject: "高数", chapterId: "g3", chapter: "一元函数积分学", level: "mid", source: "大观园",
    q: "曲线 y = x(x−1)(2−x) 与 x 轴所围平面图形的面积 A =（ ）",
    options: ["−∫₀² x(x−1)(2−x)dx", "∫₀¹ x(x−1)(2−x)dx − ∫₁² x(x−1)(2−x)dx", "−∫₀¹ x(x−1)(2−x)dx + ∫₁² x(x−1)(2−x)dx", "∫₀² x(x−1)(2−x)dx"],
    answer: 2,
    exp: "根为 0、1、2；0<x<1 时 y<0，1<x<2 时 y>0。面积要分段取绝对值：−∫₀¹ + ∫₁²，选 C。"
  },
  {
    id: "ext-g3-2", subject: "高数", chapterId: "g3", chapter: "一元函数积分学", level: "basic", source: "本站补充",
    q: "∫₀^π sin x dx =（ ）",
    options: ["0", "1", "2", "π"],
    answer: 2,
    exp: "原函数为 −cos x，代入 0、π 得 (−cosπ)−(−cos0)=1+1=2。"
  },
  {
    id: "ext-g3-3", subject: "高数", chapterId: "g3", chapter: "一元函数积分学", level: "basic", source: "本站补充",
    q: "∫₀¹ dx/(1+x²) =（ ）",
    options: ["π/4", "π/2", "1", "π"],
    answer: 0,
    exp: "原函数为 arctan x，代入 1、0 得 arctan1 − arctan0 = π/4。"
  },
  {
    id: "ext-g3-4", subject: "高数", chapterId: "g3", chapter: "一元函数积分学", level: "basic", source: "本站补充",
    q: "曲线 y = x² 与 y = x 围成的平面图形面积是（ ）",
    options: ["1/6", "1/3", "1/2", "1"],
    answer: 0,
    exp: "交点 x=0、1；在 (0,1) 上 x>x²，面积 ∫₀¹(x−x²)dx = 1/2 − 1/3 = 1/6。"
  },
  {
    id: "ext-g3-5", subject: "高数", chapterId: "g3", chapter: "一元函数积分学", level: "basic", source: "本站补充",
    q: "设 F(x) = ∫₀ˣ t² dt，则 F′(1) =（ ）",
    options: ["0", "1", "2", "3"],
    answer: 1,
    exp: "变限积分求导：F′(x)=x²，所以 F′(1)=1。"
  },

  /* ── 线性代数：线性方程组（大观园，个别选项已改写） ── */
  {
    id: "ext-x4-1", subject: "线代", chapterId: "x4", chapter: "线性方程组", level: "basic", source: "大观园",
    q: "设 A 为 m×n 矩阵，齐次方程组 Ax=0 仅有零解的充分条件是（ ）",
    options: ["A 的列向量线性无关", "A 的列向量线性相关", "A 的行向量线性无关", "A 的行向量线性相关"],
    answer: 0,
    exp: "Ax=0 只有零解 ⇔ r(A)=n ⇔ 列向量线性无关。行向量无关只能说明 r(A)=m，不一定等于 n。"
  },
  {
    id: "ext-x4-2", subject: "线代", chapterId: "x4", chapter: "线性方程组", level: "mid", source: "大观园",
    q: "设 A 是 m×n 矩阵，则非齐次方程组 Ax=b 有无穷多解的充要条件是（ ）",
    options: ["r(A|b) < n", "Ax=0 有非零解", "Ax=b 有两个不同解", "A 的列向量组线性相关"],
    answer: 2,
    exp: "若 Ax=b 有两个不同解，它们的差是 Ax=0 的非零解，解不唯一；有解且不唯一就是无穷多解。A 缺少有解条件，B、D 只说明齐次方程有非零解。"
  },
  {
    id: "ext-x4-3", subject: "线代", chapterId: "x4", chapter: "线性方程组", level: "mid", source: "大观园",
    q: "设 A 为 n 阶正定矩阵，α 为 n 维非零列向量，则齐次方程组 [[A, α],[αᵀ, 0]]x=0（ ）",
    options: ["基础解系含 1 个向量", "基础解系含 n−1 个向量", "基础解系含 n 个向量", "只有零解"],
    answer: 3,
    exp: "分块矩阵行列式 = −αᵀA⁻¹α < 0（A 正定、α≠0），矩阵可逆，所以齐次方程组只有零解。"
  },
  {
    id: "ext-x4-4", subject: "线代", chapterId: "x4", chapter: "线性方程组", level: "mid", source: "大观园",
    q: "设 A 为 m×n 矩阵，B 为 n×m 矩阵，则（ ）",
    options: ["m>n 时 AB 必可逆", "m>n 时必有 |AB|=0", "n>m 时必有 r(AB)<m", "n>m 时 ABx=0 必有唯一解"],
    answer: 1,
    exp: "AB 为 m 阶矩阵，r(AB)≤min{r(A),r(B)}≤n<m，所以 |AB|=0。C 中 r(AB)≤m，不一定严格小于 m；D 也不一定。"
  },
  {
    id: "ext-x4-5", subject: "线代", chapterId: "x4", chapter: "线性方程组", level: "mid", source: "大观园（改写）",
    q: "设 A=[[1,1,1],[1,3,2a],[2,4,a³+2a+2]]，b=(2,d,d²)ᵀ。当 a=−1 且 d≠−1、d≠2 时，方程组 Ax=b（ ）",
    options: ["有唯一解", "无解", "有无穷多解", "无法判断"],
    answer: 1,
    exp: "|A|=2(a+1)(a²−a+1)，a=−1 时 |A|=0。对增广矩阵行变换得一致性条件 (d−2)(d+1)=0；d≠−1 且 d≠2 时无解。"
  },

  /* ── 概率统计：随机事件与概率（大观园，个别选项已改写） ── */
  {
    id: "ext-p1-1", subject: "概率", chapterId: "p1", chapter: "随机事件与概率", level: "basic", source: "大观园",
    q: "若 P(AB) = 0，则（ ）",
    options: ["A 与 B 互斥", "AB 是不可能事件", "AB 未必是不可能事件", "P(A)=0 或 P(B)=0"],
    answer: 2,
    exp: "P(AB)=0 只说明交事件概率为 0；连续型模型中非空事件也可能概率为 0，所以 AB 未必是不可能事件。"
  },
  {
    id: "ext-p1-2", subject: "概率", chapterId: "p1", chapter: "随机事件与概率", level: "mid", source: "大观园（改写）",
    q: "设事件 A、B 满足 P(B|A)=1，则（ ）",
    options: ["A 是必然事件", "P(B|Ā)=0", "A ⊆ B（在概率意义下）", "B ⊆ A"],
    answer: 2,
    exp: "P(B|A)=1 ⇒ P(AB)=P(A)，即 A 中几乎所有的点都在 B 中，因此 A 在概率意义下包含于 B；不能推出 A 是必然事件或 B⊆A。"
  },
  {
    id: "ext-p1-3", subject: "概率", chapterId: "p1", chapter: "随机事件与概率", level: "mid", source: "大观园",
    q: "已知 0<P(B)<1，且 P((A₁∪A₂)|B)=P(A₁|B)+P(A₂|B)，则（ ）",
    options: ["P((A₁∪A₂)|B̄)=P(A₁|B̄)+P(A₂|B̄)", "P(A₁B∪A₂B)=P(A₁B)+P(A₂B)", "P(A₁∪A₂)=P(A₁|B)+P(A₂|B)", "P(B)=P(A₁)P(B|A₁)+P(A₂)P(B|A₂)"],
    answer: 1,
    exp: "条件概率的加法公式取等号 ⇒ P(A₁A₂|B)=0 ⇒ P(A₁A₂B)=0，所以 A₁B 与 A₂B 互斥，B 正确。"
  },
  {
    id: "ext-p1-4", subject: "概率", chapterId: "p1", chapter: "随机事件与概率", level: "mid", source: "大观园",
    q: "设 A、B 为随机事件，P(B)>0，P(A|B)=1，则必有（ ）",
    options: ["P(A∪B) > P(A)", "P(A∪B) > P(B)", "P(A∪B) = P(A)", "P(A∪B) = P(B)"],
    answer: 2,
    exp: "P(A|B)=1 ⇒ P(AB)=P(B) ⇒ P(B−A)=0，所以 P(A∪B)=P(A)+P(B)−P(AB)=P(A)。"
  },
  {
    id: "ext-p1-5", subject: "概率", chapterId: "p1", chapter: "随机事件与概率", level: "mid", source: "大观园",
    q: "设 A、B 为随机事件，0<P(A)<1，0<P(B)<1，且 P(A|B)=1，则（ ）",
    options: ["P(B̄|Ā)=1", "P(A|B̄)=0", "P(A∪B)=1", "P(B|A)=1"],
    answer: 0,
    exp: "P(A|B)=1 ⇒ P(AB)=P(B) ⇒ P(ĀB)=0。于是 P(B̄|Ā)=P(ĀB̄)/P(Ā)=[P(Ā)−P(ĀB)]/P(Ā)=1。"
  }
]);
