import { generateStarProfile } from './core/calculator.js';
import { STARS } from './data/constants.js';

// 初始化主題切換
function initTheme() {
  const btn = document.querySelector('[data-theme-toggle]');
  const root = document.documentElement;
  let theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  root.setAttribute('data-theme', theme);
  
  if(btn) {
    btn.addEventListener('click', () => {
      theme = theme === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', theme);
    });
  }
}

// 渲染計算結果
function renderResult(profile) {
  const resultEl = document.getElementById('result');
  resultEl.style.display = 'block';

  // 基本標題渲染
  const fullStarName = `${profile.star.name} (${profile.inyoShort})`;
  document.getElementById('result-badge').textContent = `${profile.star.emoji} ${fullStarName}`;
  document.getElementById('result-name').textContent = fullStarName;
  
  // 靈合星人渲染
  const reigouBadge = document.getElementById('result-reigou');
  const reigouBox = document.getElementById('reigou-box');
  if (profile.reigou) {
    reigouBadge.style.display = 'inline-flex';
    reigouBox.style.display = 'block';
    reigouBox.innerHTML = `<strong>✦ 靈合星人（${profile.star.name} × ${profile.reigouSubName}）</strong><br>${profile.reigouDesc}<br><br>靈合星人同時兼具兩種星人的特質，個性比一般星人更多元複雜。好的時候比別人好一倍，低潮時也比別人更需要耐心——了解這點，就能把兩種特質的優點都發揮出來。`;
  } else {
    reigouBadge.style.display = 'none';
    reigouBox.style.display = 'none';
  }

  // 特徵數據渲染
  document.getElementById('trait-unmei').textContent = profile.unmei;
  document.getElementById('trait-hoshi').textContent = profile.hoshi;
  document.getElementById('trait-junishi').textContent = profile.junName;
  document.getElementById('trait-inyo').textContent = profile.inyoPlus ? '+ (陽)' : '- (陰)';
  document.getElementById('personality-text').innerHTML = profile.personality;

  // 大殺界渲染
  const dsBadges = profile.dsYears.map(y => `<span class="year-tag">${y}年</span>`).join('');
  document.getElementById('daissakkai-years').innerHTML = `<strong>大殺界生肖：${profile.dskNames.join('、')}</strong><br><div style="margin-top:0.5rem;">近期大殺界年份：${dsBadges}</div>`;

  // 步驟渲染
  const hoshiRaw = (profile.unmei - 1) + profile.day;
  const stepsHTML = `
    <div class="step-item"><div class="step-num">1</div><div class="step-text"><strong>查運命數</strong>：${profile.year}年${profile.month}月 → 運命數 = <strong>${profile.unmei}</strong></div></div>
    <div class="step-item"><div class="step-num">2</div><div class="step-text"><strong>計算星數</strong>：(${profile.unmei} - 1) + ${profile.day} = ${hoshiRaw}${hoshiRaw > 60 ? ` → 超過60，減60 = <strong>${profile.hoshi}</strong>` : ` = <strong>${profile.hoshi}</strong>`}</div></div>
    <div class="step-item"><div class="step-num">3</div><div class="step-text"><strong>對應星人</strong>：星數 ${profile.hoshi} 在 ${profile.star.range} → <strong>${profile.star.name}</strong></div></div>
  `;
  document.getElementById('step-list').innerHTML = stepsHTML;

  // 星數對照表渲染
  document.getElementById('range-table').innerHTML = STARS.map((s, i) => {
    return `<tr ${i === profile.starIdx ? 'class="active"' : ''}><td>${s.range}</td><td>${s.emoji} ${s.name}</td></tr>`;
  }).join('');

  // 平滑滾動到結果
  setTimeout(() => resultEl.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
}

// 綁定事件
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  
  const calculateBtn = document.getElementById('calculate-btn');
  calculateBtn.addEventListener('click', () => {
    const year = parseInt(document.getElementById('year').value);
    const month = parseInt(document.getElementById('month').value);
    const day = parseInt(document.getElementById('day').value);

    if (!year || !month || !day || year < 1900 || year > 2050 || month < 1 || month > 12 || day < 1 || day > 31) {
      alert('請輸入有效的出生年月日！');
      return;
    }

    const profile = generateStarProfile(year, month, day);
    renderResult(profile);
  });
});
