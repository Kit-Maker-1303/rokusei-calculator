/**
 * 將指定 HTML 元素匯出為圖片並下載
 * @param {string} elementId 要截圖的元素 ID
 */
export function exportElementToImage(elementId) {
  const element = document.getElementById(elementId);
  if (!element) return;

  const btn = document.getElementById('btn-export');
  const originalText = btn.innerHTML;
  btn.innerHTML = '📸 正在產生精美圖片...';
  btn.disabled = true;

  // 取得當前主題底色
  const surfaceColor = getComputedStyle(document.documentElement).getPropertyValue('--color-surface').trim();

  // 呼叫 html2canvas 庫 (已在 index.html 經由 CDN 載入)
  window.html2canvas(element, {
    backgroundColor: surfaceColor || '#ffffff',
    useCORS: true,
    scale: 2, // 放大2倍提升解析度，手機分享更清晰
    logging: false,
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight
  }).then(canvas => {
    const dataUrl = canvas.toDataURL('image/png');
    
    // 建立虛擬下載鏈結
    const link = document.createElement('a');
    link.download = `六星占術命盤報告_${Date.now()}.png`;
    link.href = dataUrl;
    link.click();

    // 恢復按鈕狀態
    btn.innerHTML = originalText;
    btn.disabled = false;
  }).catch(error => {
    console.error('圖片匯出錯誤:', error);
    alert('圖片匯出失敗，請再試一次！');
    btn.innerHTML = originalText;
    btn.disabled = false;
  });
}
