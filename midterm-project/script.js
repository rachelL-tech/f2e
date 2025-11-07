document.addEventListener('DOMContentLoaded', () => {
  initDrawer();
  initNewsSwitcher();
});

// ========== 左側抽屜選單 ==========
function initDrawer() {
  const drawer   = document.getElementById('offcanvasNav');
  const openBtn  = document.getElementById('menuToggle');
  const closeBtn = document.getElementById('drawerClose');
  if (!drawer || !openBtn || !closeBtn) return;

  const backdrop = drawer.querySelector('.backdrop');
  let lastFocus = null;

  const focusables = () =>
    drawer.querySelectorAll('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])');

  function open() {
    lastFocus = document.activeElement;
    drawer.classList.add('is-open');
    drawer.removeAttribute('aria-hidden');
    openBtn.setAttribute('aria-expanded', 'true');
    setTimeout(() => closeBtn.focus(), 0);
    document.addEventListener('keydown', onKeydown);
  }
  function close() {
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    openBtn.setAttribute('aria-expanded', 'false');
    document.removeEventListener('keydown', onKeydown);
    if (lastFocus) lastFocus.focus();
  }
  function onKeydown(e) {
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    if (e.key === 'Tab' && drawer.classList.contains('is-open')) {
      const els = Array.from(focusables());
      if (!els.length) return;
      const first = els[0], last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  openBtn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  backdrop?.addEventListener('click', close);
}

// ========== 首頁：分類 Pills → 清單切換 ==========
function initNewsSwitcher() {
  const tabs = document.getElementById('news-tabs');
  const trendingList = document.getElementById('trending-list');
  const latestList   = document.getElementById('latest-list');
  const more = document.getElementById('news-more-link');
  if (!tabs || !trendingList || !latestList || !more) return;  // 這頁沒有此區塊就跳過（例如for-you頁）

  // 靜態資料（之後換成 API 回傳）
  const DATA = {
    law: [
      {date:'2025-11-06', tag:'證期', title:'提升公司辦理買回本公司股份申報作業效率 金管會預告修正辦法', url:'#'},
      {date:'2025-11-06', tag:'賦稅', title:'國家住宅中心辦理社會住宅業務取得房屋 具公益性免徵契稅', url:'#'},
      {date:'2025-11-05', tag:'刑事', title:'退休刑警為上方利益持槍殺人一審判無期 高分院 7 大理由改判 12 年 6 月', url:'#'},
      {date:'2025-11-05', tag:'賦稅', title:'機關團體編列結餘款使用計畫應注意事項 以結餘款發生次年度起算 4 年內為使用期間', url:'#'},
      {date:'2025-11-04', tag:'勞動', title:'新增雇主聘僱國內勞工的薪資定期查核規定 勞動部修正標準', url:'#'},
      {date:'2025-11-04', tag:'戶政', title:'申請回復臺灣身分須對國家具正面影響 內政部修正許可辦法', url:'#'},
      {date:'2025-11-03', tag:'環保', title:'環境檢驗測定法草案 檢測管理專法化', url:'#'},
      {date:'2025-11-03', tag:'行政', title:'自益信託委託人主張行政處分侵害信託財產 法院：得提起撤銷訴訟', url:'#'},
    ],
    reg: [
      {date:'2025-11-06', tag:'法規', title:'公司法施行細則修正草案 預告訂於明年上路', url:'#'},
      {date:'2025-11-05', tag:'證券', title:'公開發行公司內控準則增訂 AI 風險控管條款', url:'#'},
      {date:'2025-11-05', tag:'交通', title:'道路交通管理處罰條例部份條文修正', url:'#'},
      {date:'2025-11-04', tag:'衛福', title:'長照機構評鑑辦法調整 評鑑週期改為三年', url:'#'},
      {date:'2025-11-04', tag:'金融', title:'洗錢防制法配合國際規範再修正', url:'#'},
      {date:'2025-11-03', tag:'能源', title:'再生能源躉購費率公告草案', url:'#'},
      {date:'2025-11-03', tag:'勞動', title:'最低工資審議基準草案 送請勞動會審議', url:'#'},
      {date:'2025-11-02', tag:'環境', title:'環評作業規範新增碳排揭露要件', url:'#'},
    ],
    case: [
      {date:'2025-11-06', tag:'民事', title:'房東未告知瑕疵致租客受損 上訴二審改判', url:'#'},
      {date:'2025-11-05', tag:'刑事', title:'酒駕致死量刑爭議 最高法院發回更審', url:'#'},
      {date:'2025-11-05', tag:'智慧財產', title:'外觀設計侵權要件再釐清 智財法院判決重點', url:'#'},
      {date:'2025-11-04', tag:'公法', title:'機關招標不當決標 行政法院撤銷處分', url:'#'},
      {date:'2025-11-04', tag:'刑事', title:'妨害名譽之「相當理由」判準', url:'#'},
      {date:'2025-11-03', tag:'民事', title:'區分所有權人會議決議無效之認定', url:'#'},
      {date:'2025-11-03', tag:'勞動', title:'試用期解僱需具體理由 勞工勝訴', url:'#'},
      {date:'2025-11-02', tag:'公法', title:'警察臨檢之比例原則審查', url:'#'},
    ],
    letter: [
      {date:'2025-11-06', tag:'財政部', title:'股利所得申報實務疑義回覆', url:'#'},
      {date:'2025-11-05', tag:'法務部', title:'告訴代理權限範圍釋示', url:'#'},
      {date:'2025-11-05', tag:'內政部', title:'土地變更使用申請要件函釋', url:'#'},
      {date:'2025-11-04', tag:'金管會', title:'證券商風控模型檢核函', url:'#'},
      {date:'2025-11-04', tag:'交通部', title:'旅運契約定型化條款說明', url:'#'},
      {date:'2025-11-03', tag:'教育部', title:'學位學程名稱變更審查原則', url:'#'},
      {date:'2025-11-03', tag:'衛福部', title:'醫療器材廣告審查補充規定', url:'#'},
      {date:'2025-11-02', tag:'勞動部', title:'工時彈性調整函釋', url:'#'},
    ],
    draft: [
      {date:'2025-11-06', tag:'環保', title:'氣候變遷應對法修正草案 重點條文釋疑', url:'#'},
      {date:'2025-11-05', tag:'能源', title:'電業法草案：綠電交易市場機制', url:'#'},
      {date:'2025-11-05', tag:'刑事', title:'刑法部分條文修正草案 聚焦數位犯罪', url:'#'},
      {date:'2025-11-04', tag:'衛福', title:'醫療法草案 新增遠距醫療規範', url:'#'},
      {date:'2025-11-04', tag:'交通', title:'大眾運輸發展法草案', url:'#'},
      {date:'2025-11-03', tag:'財政', title:'稅捐稽徵法草案 罰則調整', url:'#'},
      {date:'2025-11-03', tag:'教育', title:'高教深耕條例草案', url:'#'},
      {date:'2025-11-02', tag:'農業', title:'農地管理條例草案', url:'#'},
    ],
  };
  const LABEL = { law:'法律新聞', reg:'法規', case:'判例解釋', letter:'函釋', draft:'草案' };

  function formatMMDD(dateStr){
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr || '');
    return m ? `${m[2]}/${m[3]}` : 'xx/xx'; // 'YYYY-MM-DD' → 'MM/DD'；不符合格式就回傳 'xx/xx'
  }
  function render(cat='law'){
    let src = DATA[cat];
    if (!src) { cat = 'law'; src = DATA[cat] || []; }
    const trend = src.slice(0,8); // 取前8筆做示意
    const late  = src.slice(0,8);
    // Trending：<li><span class="num">1..8</span><a>title</a></li>
    trendingList.innerHTML = trend.map((item, i) => `
      <li>
        <span class="num">${i+1}</span>
        <a href="${item.url || '#'}">${item.title}</a>
      </li>
    `).join('');
    // Latest：<li><span class="date">MM/DD</span><a>title</a></li>
    latestList.innerHTML = late.map(item => `
      <li>
        <span class="date">${formatMMDD(item.date)}</span>
        <a href="${item.url || '#'}">${item.title}</a>
      </li>
    `).join('');
    more.textContent = '更多' + LABEL[cat];
    more.href = '#'; // TODO: 有對應列表頁時改成實際網址
  }

  tabs.addEventListener('click', (e) => {
    const pill = e.target.closest('.pill');
    if (!pill) return;
    e.preventDefault();
    tabs.querySelectorAll('.pill').forEach(x => x.classList.remove('is-active'));
    pill.classList.add('is-active');
    render(pill.dataset.cat);
  });

  render('law'); // 預設載入法律新聞

  // ========== 首頁：trending文字淡入上移 ==========
  const trending = document.getElementById('trending');
  const items = trending.querySelectorAll('.reveal');

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      // 讓該區塊的所有 .reveal 依序顯示
      items.forEach((el, i) => {
        el.style.transitionDelay = `${i * 60}ms`;
        el.classList.add('is-visible');
      });
      io.unobserve(entry.target); // 觸發一次就不再觀察
    });
  }, {
    root: null,
    threshold: 0.2,           // 區塊有 20% 進入視窗就觸發
    rootMargin: '0px 0px -10% 0px'
  });

  io.observe(trending);
}
