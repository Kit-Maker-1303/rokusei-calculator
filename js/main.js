import { generateStarProfile } from './core/calculator.js';
import { STARS } from './data/constants.js';
import { renderFortune } from './features/fortune.js';
import { calculateCompatibility, renderCompatibilityResult } from './features/compatibility.js';
import { exportElementToImage } from './features/export.js';

let currentProfile = null; // 儲存當前 Person A 的計算結果

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

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  
  // 1. 主要命格計算
  const calculateBtn = document.getElementById('calculate-btn');
  calculateBtn.addEventListener('click', () => {
    const year = parseInt(document.getElementById('year').value);
    const month = parseInt(document.getElementById('month').value);
    const day = parseInt(document.getElementById('day').value);

    if (!year || !month || !day || year < 1900 || year > 2050 || month < 1 || month > 12 || day < 1 || day > 31) {
      alert('請輸入有效的出生年月日！');
      return;
    }

    currentProfile = generateStarProfile(year, month, day);
    
    // 渲染基礎命盤
    document.getElementById('result').style.display = 'block';
    const fullStarName = `${currentProfile.star.name} (${currentProfile.inyoShort})`;
    document.getElementById('result-badge').textContent = `${currentProfile.star.emoji} ${fullStarName}`;
    document.getElementById('result-name').textContent = fullStarName;
    
    // 靈合星人判定
    const reigouBadge = document.getElementById('result-reigou');
    const reigouBox = document.getElementById('reigou-box');
    if (currentProfile.reigou) {
      reigouBadge.style.display = 'inline-flex';
      reigouBox.style.display = 'block';
      reigouBox.innerHTML = `<strong>✦ 靈合星人（${currentProfile.star.name} × ${currentProfile.reigouSubName}）</strong><br>${currentProfile.reigouDesc}`;
    } else {
      reigouBadge.style.display = 'none';
      reigouBox.style.display = 'none';
    }

    document.getElementById('trait-unmei').textContent = currentProfile.unmei;
    document.getElementById('trait-hoshi').textContent = currentProfile.hoshi;
    document.getElementById('trait-junishi').textContent = currentProfile.junName;
    document.getElementById('trait-inyo').textContent = currentProfile.inyoPlus ? '+ (陽)' : '- (陰)';
    document.getElementById('personality-text').innerHTML = currentProfile.personality;

    // 大殺界與流年渲染
    const dsBadges = currentProfile.dsYears.map(y => `<span class="year-tag">${y}年</span>`).join('');
    document.getElementById('daissakkai-years').innerHTML = `<strong>大殺界生肖：${currentProfile.dskNames.join('、')}</strong><br><div style="margin-top:0.5rem;">近期大殺界年份：${dsBadges}</div>`;
    
    renderFortune(currentProfile);

    // 重設並隱藏上一次的合盤結果
    document.getElementById('compat-result-container').style.display = 'none';
    document.getElementById('yearB').value = '';
    document.getElementById('monthB').value = '';
    document.getElementById('dayB').value = '';

    setTimeout(() => document.getElementById('result').scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  });

  // 2. 相性合盤計算
  const compatBtn = document.getElementById('compat-btn');
  compatBtn.addEventListener('click', () => {
    if (!currentProfile) {
      alert('請先計算您自己的主要命格！');
      return;
    }
    const yB = parseInt(document.getElementById('yearB').value);
    const mB = parseInt(document.getElementById('monthB').value);
    const dB = parseInt(document.getElementById('dayB').value);

    if (!yB || !mB || !dB || yB < 1900 || yB > 2050 || mB < 1 || mB > 12 || dB < 1 || dB > 31) {
      alert('請輸入合盤對象有效的出生年月日！');
      return;
    }

    const compatData = calculateCompatibility(currentProfile, yB, mB, dB);
    renderCompatibilityResult(compatData);
  });

  // 3. 圖片匯出事件綁定
  const exportBtn = document.getElementById('btn-export');
  exportBtn.addEventListener('click', () => {
    // 匯出整個 "result" 卡片區域
    exportElementToImage('result');
  });
});
