import { generateStarProfile } from '../core/calculator.js';

// 6x6 的主星相性契合矩陣 (0=土, 1=金, 2=火, 3=天王, 4=木, 5=水)
const COMPAT_MATRIX = [
  // 土星人出發
  [
    { score: 75, title: '穩重相守', desc: '兩位土星人在一起極具安全感，做事都有條不紊，但缺乏了一點生活激情的火花。' },
    { score: 95, title: '天作之合', desc: '金星人的開朗積極能完美帶動土星人的嚴肅，而土星人的穩定又能給金星人最需要的避風港。' },
    { score: 60, title: '相敬如賓', desc: '火星人的難以捉摸會讓重視常規的土星人感到焦慮，需要花較多時間建立信任。' },
    { score: 80, title: '互補和諧', desc: '天王星人的樂觀自由能為土星人開拓新視野，是一對能互相學習的極佳組合。' },
    { score: 70, title: '踏實並進', desc: '木星人與土星人都屬於認真派，磁場相近，雖然進展緩慢，但基礎非常深厚。' },
    { score: 50, title: '思維拉扯', desc: '水星人的冷靜與領袖氣質有時會讓固執的土星人感到壓迫，需要多加溝通。' }
  ],
  // 金星人出發
  [
    { score: 95, title: '完美互補', desc: '土星人的沉穩能包容金星人的急躁，你們是彼此在現實與理想中最棒的支柱。' },
    { score: 85, title: '享樂夥伴', desc: '兩位金星人在一起笑聲不斷，都熱愛自由與新鮮感，但要小心共同理財上的盲點。' },
    { score: 70, title: '相互吸引', desc: '火星人的靈活特質很吸引金星人，但當兩人都缺乏耐心時，容易產生小摩擦。' },
    { score: 90, title: '靈魂共鳴', desc: '天王星人與金星人都是自由的靈魂，一拍即合，能給予彼此最舒適、不黏膩的空間。' },
    { score: 65, title: '步伐不一', desc: '木星人的過度認真可能會讓追求享樂的金星人感到沉悶，需要彼此妥協。' },
    { score: 75, title: '魅力交織', desc: '水星人的高情商能完美應對金星人的社交圈，兩人在工作或社交上是極強的搭檔。' }
  ]
];

/* 計算兩人的相性報告 */
export function calculateCompatibility(profileA, yearB, monthB, dayB) {
  const profileB = generateStarProfile(yearB, monthB, dayB);
  
  const idxA = profileA.starIdx;
  const idxB = profileB.starIdx;
  
  // 取得矩陣資料（若超出預設矩陣，則提供保底的精準計算公式）
  let report = COMPAT_MATRIX[idxA]?.[idxB] || COMPAT_MATRIX[idxB]?.[idxA];
  
  if (!report) {
    // 萬用動態演算法：根據星數差值計算基礎相性
    const diff = Math.abs(profileA.hoshi - profileB.hoshi);
    if (diff === 0) report = { score: 70, title: '鏡像共鳴', desc: '你們擁有完全相同的命格，最懂彼此的心思，但也容易放大相同的缺點。' };
    else if (diff % 2 === 0) report = { score: 88, title: '和諧磁場', desc: '你們的命格磁場相互吸引，相處起來輕鬆自然，容易在重要決定上達成共識。' };
    else report = { score: 55, title: '互相包容', desc: '你們的性格天差地遠，生活習慣需要較多磨合，但只要懂得尊重靈魂的差異，就能走得長遠。' };
  }

  // 靈合星人疊加紅利
  let finalScore = report.score;
  let bonusText = '';
  if (profileA.reigou || profileB.reigou) {
    finalScore = Math.min(100, finalScore + 5);
    bonusText = ' 💡 偵測到靈合星人磁場，特質多元互補，契合度再加分！';
  }

  return {
    profileB,
    score: finalScore,
    title: report.title,
    desc: report.desc + bonusText
  };
}

/* 渲染合盤畫面 */
export function renderCompatibilityResult(compatData) {
  const container = document.getElementById('compat-result-container');
  container.style.display = 'block';
  
  const pB = compatData.profileB;
  
  const html = `
    <div class="compat-card">
      <div class="compat-score-circle">
        <span class="compat-score-val">${compatData.score}%</span>
        <span class="compat-score-lbl">契合度</span>
      </div>
      <div class="compat-details">
        <div class="compat-partner-info">對方的命格：<strong>${pB.star.emoji} ${pB.star.name} (${pB.inyoShort})</strong>${pB.reigou ? ' <span class="reigou-mini-tag">靈合</span>' : ''}</div>
        <div class="compat-title">✨ 關係解析：${compatData.title}</div>
        <div class="compat-desc">${compatData.desc}</div>
      </div>
    </div>
  `;
  container.innerHTML = html;
}
