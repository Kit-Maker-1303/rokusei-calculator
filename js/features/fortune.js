import { FORTUNES } from '../data/constants.js';

/**
 * 核心流年計算公式
 * @param {number} starIdx 星人索引 (0~5)
 * @param {boolean} inyoPlus 是否為陽性
 * @param {number} year 查詢年份
 */
export function getYearFortuneIndex(starIdx, inyoPlus, year) {
    // 將西元年轉換為 0~11 的生肖循環 (1984甲子年為基準)
    const zhi = ((year - 1984) % 12 + 12) % 12; 
    
    // 陰性星人運勢會比陽性晚一年 (offset = -1)
    const offset = inyoPlus ? 0 : -1;
    
    // 利用星人陣列差值與生肖年份推算 12 運勢索引
    return (zhi + (starIdx * 2) + offset + 12) % 12;
}

/**
 * 渲染運勢 UI
 */
export function renderFortune(profile) {
    const currentYear = new Date().getFullYear(); // 自動抓取今年
    const fortuneIdx = getYearFortuneIndex(profile.starIdx, profile.inyoPlus, currentYear);
    const fortune = FORTUNES[fortuneIdx];

    // 主星運勢 HTML
    let html = `
        <div class="fortune-card">
            <div class="f-year">${currentYear} 年流年運勢</div>
            <div class="f-name f-type-${fortune.type}">${fortune.name}</div>
            <div class="f-desc">${fortune.desc}</div>
        </div>
    `;

    // 如果是靈合星人，追加副星運勢
    if (profile.reigou) {
        const subStarIdx = (profile.starIdx + 3) % 6; // 對向星的索引
        const subFortuneIdx = getYearFortuneIndex(subStarIdx, profile.inyoPlus, currentYear);
        const subFortune = FORTUNES[subFortuneIdx];

        html += `
        <div class="fortune-card sub-fortune">
            <div class="f-year">副星 (${profile.reigouSubName}) 疊加影響</div>
            <div class="f-name f-type-${subFortune.type}">${subFortune.name}</div>
            <div class="f-desc">${subFortune.desc}</div>
        </div>
        `;
    }

    document.getElementById('fortune-container').innerHTML = html;
}
