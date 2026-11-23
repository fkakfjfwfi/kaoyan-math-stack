/* 高数（下）章节课程数据：g4 - g8 */
window.MATH_CHAPTERS = window.MATH_CHAPTERS || {};
Object.assign(window.MATH_CHAPTERS, {
  g4: {
    id: "g4", subject: "高数", no: "04", title: "向量代数与空间解析几何",
    score: 5, stars: 3, freq: "常考", module: "gaoshu-2.html", moduleName: "高数（下）",
    intro: "空间几何只做两件事：找一个点、找一个方向。平面靠法向量确定，直线靠方向向量确定，剩下的距离和夹角都是套公式。",
    blocks: [
      {
        title: "平面与直线",
        html: "<p>平面由「一个点 + 一个法向量」唯一确定：点法式 A(x−x₀) + B(y−y₀) + C(z−z₀) = 0，展开就是一般式 Ax + By + Cz + D = 0，其中 (A, B, C) 就是法向量 n。</p><p>直线由「一个点 + 一个方向向量」确定，对称式 (x−x₀)/l = (y−y₀)/m = (z−z₀)/n 的分母 (l, m, n) 就是方向向量 s，分子里的 (x₀, y₀, z₀) 才是直线上的点。</p><div class='formula'><span class='fx-label'>先找向量，再写方程</span>平面：n 垂直于平面；直线：s 平行于直线<span class='small'>题目给两个平面求交线时，交线方向向量取两个法向量的叉积 s = n₁ × n₂。</span></div>"
      },
      {
        title: "距离与夹角",
        html: "<p>点到平面的距离：把点代入平面方程，除以法向量的模，分子一定要加绝对值。</p><p>夹角题先认清是哪两个向量的夹角：线线角看 s₁ 与 s₂，面面角看 n₁ 与 n₂，这两种都用 cos；线面角看 s 与 n，直线与平面的夹角是它们夹角的余角，所以用 sin。</p><div class='formula'><span class='fx-label'>两个必背公式</span>点到平面：d = |Ax₀ + By₀ + Cz₀ + D| / √(A² + B² + C²)<br>线面角：sin θ = |s · n| / (|s||n|)<span class='small'>线面角用 sin，线线角和面面角用 cos，这是选填题的常设陷阱。</span></div>"
      },
      {
        title: "常见曲面",
        html: "<p>先认方程的样子：球面 (x−a)² + (y−b)² + (z−c)² = R²；母线平行 z 轴的柱面 x² + y² = R²；圆锥面 z² = x² + y²。</p><p>旋转曲面看「谁保持不变」：曲线绕 z 轴旋转时，z 不变，把 x 换成 ±√(x²+y²)。这一步的主要用途是认出图形、写出投影区域，给后面的三重积分定限。</p>"
      }
    ],
    examples: [
      {
        title: "点法式写平面",
        question: "求过点 (1, 0, 0) 且法向量为 (1, 1, 1) 的平面方程。",
        steps: ["法向量已知，直接套点法式：1(x − 1) + 1(y − 0) + 1(z − 0) = 0。", "展开：x − 1 + y + z = 0。", "移项整理得 x + y + z = 1。"],
        answer: "x + y + z = 1"
      },
      {
        title: "点到平面的距离",
        question: "求点 (1, 2, 3) 到平面 x + y + z = 0 的距离。",
        steps: ["把平面写成 Ax + By + Cz + D = 0：x + y + z + 0 = 0，所以 A=B=C=1，D=0。", "代入点坐标：|1 + 2 + 3 + 0| = 6。", "除以法向量模 √(1²+1²+1²) = √3，得 d = 6/√3 = 2√3。"],
        answer: "2√3"
      }
    ],
    formulas: [
      { name: "平面点法式", formula: "A(x−x₀) + B(y−y₀) + C(z−z₀) = 0，法向量 n=(A,B,C)", note: "写平面前先确认法向量" },
      { name: "点到平面距离", formula: "d = |Ax₀ + By₀ + Cz₀ + D| / √(A²+B²+C²)", note: "分子必须加绝对值" },
      { name: "数量积与叉积", formula: "a·b = |a||b|cos θ；|a×b| = |a||b|sin θ", note: "叉积模长等于平行四边形面积" }
    ],
    pitfalls: ["把直线对称式里的点 (x₀, y₀, z₀) 当成方向向量。", "线面角用 cos 计算，忘记它应是方向向量与法向量夹角的余角。", "点到平面距离忘记分子取绝对值，算成负数。"],
    drills: ["g4-1", "g4-2", "g4-3"]
  },
  g5: {
    id: "g5", subject: "高数", no: "05", title: "多元函数微分学",
    score: 9, stars: 4, freq: "高频", module: "gaoshu-2.html", moduleName: "高数（下）",
    intro: "偏导是「固定其他人，只看一个人怎么变」：纬度不动，只往东走一步，温度变多少。梯度则告诉你往哪个方向走，函数上升最快。",
    blocks: [
      {
        title: "偏导与全微分",
        html: "<p>求 ∂z/∂x 时把 y 当常数，按一元函数求导即可；求 ∂z/∂y 时反过来。二阶混合偏导在连续条件下相等，即 z_xy = z_yx。</p><div class='formula'><span class='fx-label'>全微分</span>dz = f_x dx + f_y dy<span class='small'>偏导存在推不出可微；但偏导连续可以推出可微。判定可微要用定义，看 Δz 与全微分之差是否为 ρ 的高阶无穷小。</span></div>"
      },
      {
        title: "复合函数与隐函数",
        html: "<p>复合函数先画变量依赖图：z 依赖 u、v，u、v 又依赖 x、y，则沿每条路径相乘，最后相加，即 z_x = f_u u_x + f_v v_x。</p><p>隐函数 F(x, y, z) = 0 确定 z = z(x, y) 时，两边对 x 求导、把 z 看成 z(x, y)，整理出 z_x。</p><div class='formula'><span class='fx-label'>隐函数求导</span>z_x = −F_x / F_z，z_y = −F_y / F_z<span class='small'>分母是 F_z，不是 F_x；写反是高频错误，也别忘了负号。</span></div>"
      },
      {
        title: "梯度、方向导数与极值",
        html: "<p>梯度 grad f = (f_x, f_y, f_z) 指向函数增长最快的方向，它的模就是最大方向导数。沿单位向量 e_l 的方向导数为 ∂f/∂l = grad f · e_l。</p><p>无条件极值：先解 f_x = 0、f_y = 0 得驻点，再记 A = f_xx、B = f_xy、C = f_yy：AC − B² &gt; 0 且 A &gt; 0 为极小，A &lt; 0 为极大；AC − B² &lt; 0 不是极值。带约束的极值用拉格朗日乘数法，令 L = f + λφ。</p>"
      }
    ],
    examples: [
      {
        title: "偏导就是把别人当常数",
        question: "设 z = x²y，求 ∂z/∂x 在点 (1, 2) 处的值。",
        steps: ["求 ∂z/∂x 时把 y 看成常数，对 x 求导得 2xy。", "代入 x = 1、y = 2。", "2 × 1 × 2 = 4。"],
        answer: "4"
      },
      {
        title: "方向导数要单位化",
        question: "求 f(x, y) = x² + y² 在点 (1, 1) 处沿方向 (1, 1) 的方向导数。",
        steps: ["梯度 grad f = (2x, 2y)，在 (1, 1) 处为 (2, 2)。", "方向 (1, 1) 的单位向量 e = (1/√2, 1/√2)。", "方向导数 = grad f · e = 2/√2 + 2/√2 = 2√2。"],
        answer: "2√2"
      }
    ],
    formulas: [
      { name: "全微分", formula: "dz = f_x dx + f_y dy", note: "近似计算与可微性判断" },
      { name: "梯度与方向导数", formula: "grad f = (f_x, f_y, f_z)；∂f/∂l = grad f · e_l", note: "方向向量必须先单位化" },
      { name: "隐函数求导", formula: "z_x = −F_x / F_z", note: "分母为 F_z，别漏负号" }
    ],
    pitfalls: ["认为偏导存在就一定可微，忽略可微要用定义验证。", "求方向导数时没把方向向量单位化，直接点乘。", "复合函数求偏导漏项，或隐函数求导忘记 y′ 与负号。"],
    drills: ["g5-1", "g5-2", "g5-3"]
  },
  g6: {
    id: "g6", subject: "高数", no: "06", title: "多元函数积分学",
    score: 16, stars: 5, freq: "必考", module: "gaoshu-2.html", moduleName: "高数（下）",
    intro: "二重积分是「把平面切成小格累加」，曲面积分是「把曲面切成小片累加」。格林、高斯、斯托克斯的作用，是把边界上的积分换成内部区域的积分。",
    blocks: [
      {
        title: "二重积分与极坐标",
        html: "<p>直角坐标先画区域图：X 型区域对 x 定限、内层对 y 积分；Y 型反过来。区域是圆、扇形、环形时，优先用极坐标。</p><div class='formula'><span class='fx-label'>极坐标下的面积元</span>x = r cos θ，y = r sin θ，dσ = r dr dθ<span class='small'>那个多出来的 r 是雅可比，不是系数的笔误；漏掉 r 是最常见的丢分点。</span></div><p>能利用对称性和奇偶性就别硬算：区域关于 x 轴对称、被积函数关于 y 为奇函数时，积分为 0。</p>"
      },
      {
        title: "三重积分",
        html: "<p>投影法：把立体投影到 xOy 平面，先对 z 积分，再对 x、y 积分；截面法：先固定 z，对截面 D_z 做二重积分，再对 z 积分。</p><div class='formula'><span class='fx-label'>两种常用坐标</span>柱面坐标：dv = r dr dθ dz<br>球面坐标：dv = r² sin φ dr dφ dθ<span class='small'>柱面坐标适合旋转体、柱体；球面坐标适合球体、锥体。</span></div>"
      },
      {
        title: "曲线曲面积分与三大公式",
        html: "<p>第一类曲线/曲面积分看弧长、面积，没有方向；第二类看方向，方向取反结果就变号。第二类平面闭曲线用格林公式，闭曲面用高斯公式，空间闭曲线用斯托克斯公式。</p><div class='formula'><span class='fx-label'>格林与高斯</span>格林：∮_L P dx + Q dy = ∬_D (Q_x − P_y) dxdy<br>高斯：∯_Σ P dydz + Q dzdx + R dxdy = ∭_Ω (P_x + Q_y + R_z) dv<span class='small'>用之前先问三句：闭不闭合？方向对不对？不闭合能不能补面、补线？单位球面外侧用高斯，散度为 3 时积分 = 3 × 4π/3 = 4π。</span></div>"
      }
    ],
    examples: [
      {
        title: "极坐标的二重积分",
        question: "设 D 为单位圆 x² + y² ≤ 1，求 ∬_D (x² + y²) dσ。",
        steps: ["区域是圆，用极坐标：x² + y² = r²，dσ = r dr dθ。", "定限：0 ≤ θ ≤ 2π，0 ≤ r ≤ 1。", "积分：∫₀^{2π} dθ ∫₀¹ r² · r dr = 2π · 1/4 = π/2。"],
        answer: "π/2"
      },
      {
        title: "格林公式算闭曲线积分",
        question: "设 L 为单位圆周 x² + y² = 1 取正向，求 ∮_L x dy − y dx。",
        steps: ["对照标准形式：P = −y，Q = x。", "算 Q_x − P_y = 1 − (−1) = 2。", "L 正向且区域 D 是单位圆，面积为 π，由格林公式积分 = 2 × π = 2π。"],
        answer: "2π"
      }
    ],
    formulas: [
      { name: "极坐标面积元", formula: "dσ = r dr dθ", note: "圆形区域优先使用，别漏 r" },
      { name: "格林公式", formula: "∮_L P dx + Q dy = ∬_D (Q_x − P_y) dxdy", note: "L 取正向，区域在左侧" },
      { name: "高斯公式", formula: "∯_Σ P dydz + Q dzdx + R dxdy = ∭_Ω (P_x + Q_y + R_z) dv", note: "Σ 为闭曲面外侧" }
    ],
    pitfalls: ["极坐标漏乘雅可比 r，或球坐标漏乘 r² sin φ。", "第二类曲线/曲面积分方向取反，整题符号全错。", "高斯公式用于不封闭曲面，补面后忘记减去补面上的积分。"],
    drills: ["g6-1", "g6-2", "g6-3", "g6-4", "g6-5", "g6-6"]
  },
  g7: {
    id: "g7", subject: "高数", no: "07", title: "无穷级数",
    score: 12, stars: 4, freq: "高频", module: "gaoshu-2.html", moduleName: "高数（下）",
    intro: "级数是「无限个数相加」：1/2 + 1/4 + 1/8 + … 越加越接近 1，叫收敛；1 + 1/2 + 1/3 + … 越加越大，叫发散。幂级数则是带 x 的级数，收敛范围就是收敛域。",
    blocks: [
      {
        title: "判敛的路线",
        html: "<p>先看通项是否趋于 0：不趋于 0 一定发散，这一步能秒掉不少题。正项级数再选工具：比较、比值、根值、积分。记住 p 级数 Σ1/nᵖ 在 p &gt; 1 时收敛，p ≤ 1 时发散。</p><p>交错级数用莱布尼茨判别法：通项单调递减且趋于 0，则收敛。判断绝对/条件收敛，先对绝对值级数判一次。</p><div class='formula'><span class='fx-label'>比值法</span>lim |a_{n+1}/a_n| = ρ &lt; 1 收敛，ρ &gt; 1 发散，ρ = 1 失效<span class='small'>ρ = 1 时换比较法，不要硬下结论。</span></div>"
      },
      {
        title: "幂级数：先半径，再端点",
        html: "<p>幂级数 Σa_n xⁿ 的收敛半径由比值法给出，先得到开区间 (−R, R)，再把 x = ±R 分别代回原级数，判断端点敛散性。端点是最容易漏的一步。</p><div class='formula'><span class='fx-label'>收敛半径</span>R = lim |a_n / a_{n+1}|<span class='small'>算完半径只完成一半，端点必须单独讨论。</span></div><p>求和函数先凑三个标准展开式，再逐项求导或逐项积分。注意求导后端点敛散性可能改变，要单独说明。</p>"
      },
      {
        title: "傅里叶级数",
        html: "<p>周期为 2π 的函数展开为 a₀/2 + Σ(a_n cos nx + b_n sin nx)，系数由积分公式给出。奇函数只有正弦项，偶函数只有余弦项，先用奇偶性可以省一半计算。</p><div class='formula'><span class='fx-label'>系数公式</span>a_n = (1/π)∫_{−π}^{π} f(x)cos nx dx，b_n = (1/π)∫_{−π}^{π} f(x)sin nx dx<span class='small'>狄利克雷定理：连续点处和函数等于 f(x)，间断点处等于左右极限的平均值。</span></div>"
      }
    ],
    examples: [
      {
        title: "收敛域要判端点",
        question: "求幂级数 Σ(n=1→∞) xⁿ/n 的收敛域。",
        steps: ["由比值法 |a_{n+1}/a_n| = n/(n+1) → 1，得收敛半径 R = 1，开区间 (−1, 1) 内绝对收敛。", "x = 1 时为调和级数 Σ1/n，发散。", "x = −1 时为交错调和级数，由莱布尼茨判别法收敛，所以收敛域是 [−1, 1)。"],
        answer: "[−1, 1)"
      },
      {
        title: "逐项求导再积分求和函数",
        question: "求幂级数 Σ(n=1→∞) xⁿ/n 在收敛区间内的和函数。",
        steps: ["设 S(x) = Σ xⁿ/n，逐项求导得 S′(x) = Σ xⁿ⁻¹ = 1/(1−x)，|x| &lt; 1。", "从 0 到 x 积分：S(x) = ∫₀ˣ dt/(1−t) = −ln(1−x)。", "S(0) = 0 与积分下限一致，故 S(x) = −ln(1−x)；x = −1 时级数收敛且和为 −ln2。"],
        answer: "S(x) = −ln(1−x)，−1 ≤ x &lt; 1"
      }
    ],
    formulas: [
      { name: "三个标准展开", formula: "1/(1−x) = Σxⁿ；eˣ = Σxⁿ/n!；ln(1+x) = Σ(−1)ⁿ⁻¹xⁿ/n", note: "求和函数先凑它们" },
      { name: "收敛半径", formula: "R = lim |a_n / a_{n+1}|", note: "算完还要判两个端点" },
      { name: "p 级数", formula: "Σ1/nᵖ：p > 1 收敛，p ≤ 1 发散", note: "比较法的基准" }
    ],
    pitfalls: ["收敛域只写开区间，忘记单独判断两个端点。", "通项不趋于 0 仍套比值法，得出收敛的错误结论。", "求和函数逐项求导后，没检查端点敛散性是否改变。"],
    drills: ["g7-1", "g7-2", "g7-3"]
  },
  g8: {
    id: "g8", subject: "高数", no: "08", title: "常微分方程",
    score: 9, stars: 4, freq: "高频", module: "gaoshu-2.html", moduleName: "高数（下）",
    intro: "微分方程是「知道变化率，反求函数」：知道速度怎么变，能不能反推出位置。解不是数而是函数，通解带常数，特解由初始条件定。",
    blocks: [
      {
        title: "一阶方程先分类",
        html: "<p>能写成 dy/dx = f(x)g(y) 的是可分离变量，两边分离后各自积分。形如 dy/dx = φ(y/x) 的是齐次方程，令 u = y/x 化为可分离。y′ + P(x)y = Q(x) 是一阶线性方程，直接套通解公式。</p><div class='formula'><span class='fx-label'>一阶线性通解</span>y = e^(−∫P dx) ( ∫Q e^(∫P dx) dx + C )<span class='small'>用之前必须先化成标准形 y′ + P(x)y = Q(x)，P、Q 只含 x。</span></div>"
      },
      {
        title: "二阶常系数方程",
        html: "<p>先解特征方程 r² + pr + q = 0：两个不同实根 r₁、r₂ 时通解 C₁e^(r₁x) + C₂e^(r₂x)；重根 r 时通解 (C₁ + C₂x)e^(rx)；共轭复根 α ± βi 时通解 e^(αx)(C₁cos βx + C₂sin βx)。</p><p>非齐次方程的解 = 齐次通解 + 一个特解。特解形式照自由项猜，但要先看自由项对应的数是不是特征根，重合就要多乘一个 x。</p>"
      },
      {
        title: "欧拉方程（数一独有）",
        html: "<p>形如 x²y″ + pxy′ + qy = f(x) 的方程叫欧拉方程。令 x = eᵗ（即 t = ln x），可化为常系数方程。</p><div class='formula'><span class='fx-label'>代换关系</span>xy′ = dy/dt，x²y″ = d²y/dt² − dy/dt<span class='small'>千万别把 y′ 直接当成 dy/dt，少减那一项是这章最典型的错误。</span></div>"
      }
    ],
    examples: [
      {
        title: "一阶线性方程",
        question: "求 y′ + y = e⁻ˣ，y(0) = 1 的解。",
        steps: ["已是标准形，P(x) = 1，积分因子 e^(∫1 dx) = eˣ，两边同乘得 (y eˣ)′ = 1。", "积分得 y eˣ = x + C，即 y = (x + C)e⁻ˣ。", "代入 y(0) = 1 得 C = 1，所以 y = (x + 1)e⁻ˣ。"],
        answer: "y = (x + 1)e⁻ˣ"
      },
      {
        title: "欧拉方程化常系数",
        question: "求欧拉方程 x²y″ + xy′ − y = 0（x > 0）的通解。",
        steps: ["令 x = eᵗ，则 xy′ = dy/dt，x²y″ = d²y/dt² − dy/dt。", "代回得 (y_tt − y_t) + y_t − y = 0，即 y_tt − y = 0，特征根为 ±1。", "所以 y = C₁eᵗ + C₂e⁻ᵗ，再把 eᵗ 换回 x，得 y = C₁x + C₂/x。"],
        answer: "y = C₁x + C₂/x"
      }
    ],
    formulas: [
      { name: "一阶线性通解", formula: "y = e^(−∫P dx)(∫Q e^(∫P dx) dx + C)", note: "先化成标准形再套" },
      { name: "二阶常系数齐次", formula: "r²+pr+q=0：两实根 C₁e^(r₁x)+C₂e^(r₂x)；重根 (C₁+C₂x)e^(rx)；复根 e^(αx)(C₁cos βx+C₂sin βx)", note: "按特征根分三种情形" },
      { name: "欧拉方程代换", formula: "x = eᵗ：xy′ = dy/dt，x²y″ = d²y/dt² − dy/dt", note: "数一独有，注意链式求导" }
    ],
    pitfalls: ["没化成 y′ + P(x)y = Q(x) 的标准形就套通解公式。", "非齐次特解形式没检查自由项与特征根是否重合，漏乘 x。", "欧拉方程把 y′ 直接当成 dy/dt，忘记 x²y″ 要减一项。"],
    drills: ["g8-1", "g8-2", "g8-3"]
  }
});
