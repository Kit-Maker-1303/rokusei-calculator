import { STARS, JUNISHI, INYO_YANG, DSK_JUNISHI, DSK_NAMES, REIGOU_SUB, PERSONALITIES, REIGOU_DESC } from '../data/constants.js';

// 計算運命數
export function getUnmeiSu(year, month) {
  const base = new Date(2000, 0, 1);
  const target = new Date(year, month - 1, 1);
  const delta = Math.round((target - base) / 86400000);
  return (((19 - 1 + delta) % 60) + 60) % 60 + 1;
}

// 計算星數
export function calcHoshi(unmei, day) {
  let h = (unmei - 1) + day;
  while (h > 60) h -= 60;
  return h;
}

// 計算生肖 (以立春為界)
export function getJunishi(year, month, day) {
  let gYear = year;
  if (month < 2 || (month === 2 && day < 4)) gYear = year - 1;
  return ((gYear - 1984) % 12 + 12) % 12;
}

// 判斷是否為靈合星人
export function isReigou(starIdx, junishiIdx, inyoPlus) {
  const dsk = DSK_JUNISHI[starIdx];
  return inyoPlus ? junishiIdx === dsk[0] : junishiIdx === dsk[1];
}

// 計算大殺界年份
export function getDaissakkai(starIdx, currentYear) {
  const dsk = DSK_JUNISHI[starIdx];
  const result = [];
  for (let y = currentYear - 2; y <= currentYear + 12; y++) {
    const j = ((y - 1984) % 12 + 12) % 12;
    if (dsk.includes(j)) result.push(y);
  }
  return result;
}

// 產生完整命盤報告
export function generateStarProfile(year, month, day) {
  const unmei = getUnmeiSu(year, month);
  const hoshi = calcHoshi(unmei, day);
  const junIdx = getJunishi(year, month, day);
  const junName = JUNISHI[junIdx];
  const inyoPlus = INYO_YANG.includes(junIdx);
  const inyoShort = inyoPlus ? '+' : '-';
  const starIdx = Math.floor((hoshi - 1) / 10);
  const star = STARS[starIdx];
  const reigou = isReigou(starIdx, junIdx, inyoPlus);
  const currentYear = new Date().getFullYear();
  const dsYears = getDaissakkai(starIdx, currentYear);

  return {
    year, month, day, unmei, hoshi, junName, inyoPlus, inyoShort,
    starIdx, star, reigou, dsYears,
    dskNames: DSK_NAMES[starIdx],
    personality: PERSONALITIES[starIdx],
    reigouSubName: REIGOU_SUB[starIdx],
    reigouDesc: REIGOU_DESC[starIdx]
  };
}
