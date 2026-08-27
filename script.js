/* ===================== APPLY CONFIG ===================== */
function initConfig() {
  if (typeof AppConfig === 'undefined') return;
  
  if (document.getElementById('doc-title')) document.getElementById('doc-title').textContent = AppConfig.windowTitle;
  if (document.getElementById('ui-brand-name')) document.getElementById('ui-brand-name').textContent = AppConfig.siteName;
  if (document.getElementById('ui-badge')) document.getElementById('ui-badge').textContent = AppConfig.headerBadge;
  if (document.getElementById('ui-footer')) document.getElementById('ui-footer').textContent = AppConfig.footerText;
  if (document.getElementById('upload-limit-text')) document.getElementById('upload-limit-text').textContent = `ขนาดไม่เกิน ${AppConfig.maxUploadSizeMB}MB`;

  document.getElementById('f-url').value = AppConfig.defaultUrl;
  document.getElementById('f-wifi-ssid').value = AppConfig.defaultWifiSSID;
  document.getElementById('res-slider').value = AppConfig.defaultResolution;
  
  state.type = AppConfig.defaultTab;
  state.resolution = AppConfig.defaultResolution;
  
  const defaultThemeBtn = document.querySelector(`.preset-btn[data-preset="${AppConfig.defaultTheme}"]`);
  if (defaultThemeBtn) defaultThemeBtn.click();
  
  const defaultTabBtn = document.querySelector(`.tab-btn[data-type="${AppConfig.defaultTab}"]`);
  if (defaultTabBtn) defaultTabBtn.click();
}

/* ===================== STATE MANAGEMENT ===================== */
const state = {
  type: 'url',
  fgMode: 'solid',
  fg1: '#7C5CFF',
  fg2: '#2FD180',
  eyeFrame: '#FFFFFF',
  eyeBall: '#7C5CFF',
  bg: '#0F0F15',
  dotShape: 'square',
  eyeFrameShape: 'square',
  eyeBallShape: 'square',
  logoImg: null,
  logoKnockout: true,
  resolution: 1000
};

/* ===================== PRESETS CONFIG ===================== */
const presets = {
  cyber: { fg1: '#7C5CFF', fg2: '#2FD180', bg: '#0F0F15', eyeFrame: '#FFFFFF', eyeBall: '#7C5CFF' },
  emerald: { fg1: '#10B981', fg2: '#3B82F6', bg: '#064E3B', eyeFrame: '#A7F3D0', eyeBall: '#10B981' },
  sunset: { fg1: '#F59E0B', fg2: '#EC4899', bg: '#1C1917', eyeFrame: '#FDE68A', eyeBall: '#F59E0B' },
  rose: { fg1: '#F43F5E', fg2: '#8B5CF6', bg: '#0F172A', eyeFrame: '#FECDD3', eyeBall: '#F43F5E' }
};

document.querySelectorAll('.preset-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const p = presets[btn.dataset.preset];
    Object.assign(state, p);
    
    document.getElementById('c-fg1').value = p.fg1;
    document.getElementById('c-fg2').value = p.fg2;
    document.getElementById('c-bg').value = p.bg;
    document.getElementById('c-eye-frame').value = p.eyeFrame;
    document.getElementById('c-eye-ball').value = p.eyeBall;
    
    scheduleRender();
  });
});

/* ===================== TAB & UI SWITCHING ===================== */
document.querySelectorAll('#type-tabs .tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#type-tabs .tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.type = btn.dataset.type;
    document.querySelectorAll('.content-pane').forEach(p => p.classList.remove('active'));
    document.querySelector(`.content-pane[data-pane="${state.type}"]`).classList.add('active');
    scheduleRender();
  });
});

document.querySelectorAll('.segmented-control button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.segmented-control button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.fgMode = btn.dataset.fgmode;
    document.getElementById('row-fg2').style.display = state.fgMode === 'gradient' ? 'flex' : 'none';
    scheduleRender();
  });
});

const colorMap = { 'c-fg1':'fg1', 'c-fg2':'fg2', 'c-eye-frame':'eyeFrame', 'c-eye-ball':'eyeBall', 'c-bg':'bg' };
Object.keys(colorMap).forEach(id => {
  document.getElementById(id).addEventListener('input', e => {
    state[colorMap[id]] = e.target.value;
    scheduleRender();
  });
});

function bindShapeGrid(gridId, stateKey, dataAttr) {
  document.querySelectorAll('#' + gridId + ' .shape-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('#' + gridId + ' .shape-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      state[stateKey] = card.dataset[dataAttr];
      scheduleRender();
    });
  });
}
bindShapeGrid('dot-shapes', 'dotShape', 'dot');
bindShapeGrid('eyeframe-shapes', 'eyeFrameShape', 'eyeframe');

/* ===================== LOGO UPLOAD ===================== */
const uploadBox = document.getElementById('upload-box');
const logoInput = document.getElementById('logo-input');
const logoRow = document.getElementById('logo-preview-row');

uploadBox.addEventListener('click', () => logoInput.click());
logoInput.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  
  const limitMB = typeof AppConfig !== 'undefined' ? AppConfig.maxUploadSizeMB : 2;
  if (file.size > limitMB * 1024 * 1024) { alert(`ขนาดไฟล์เกิน ${limitMB}MB`); return; }
  
  const reader = new FileReader();
  reader.onload = ev => {
    const img = new Image();
    img.onload = () => {
      state.logoImg = img;
      document.getElementById('logo-preview-img').src = ev.target.result;
      document.getElementById('logo-preview-name').textContent = file.name;
      logoRow.style.display = 'flex';
      scheduleRender();
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
});

document.getElementById('logo-remove').addEventListener('click', () => {
  state.logoImg = null;
  logoInput.value = '';
  logoRow.style.display = 'none';
  scheduleRender();
});

document.getElementById('logo-knockout').addEventListener('change', e => {
  state.logoKnockout = e.target.checked;
  scheduleRender();
});

const resSlider = document.getElementById('res-slider');
resSlider.addEventListener('input', e => {
  state.resolution = parseInt(e.target.value, 10);
  document.getElementById('res-value').textContent = `${state.resolution} × ${state.resolution} px`;
  scheduleRender();
});

/* ===================== EVENT LISTENERS FOR INPUTS ===================== */
['f-url','f-text','f-wifi-ssid','f-wifi-pass','f-wifi-enc','f-phone','f-sms-phone','f-sms-text','f-vc-first','f-vc-org','f-vc-phone']
 .forEach(id => {
   const el = document.getElementById(id);
   if (el) {
     el.addEventListener('input', scheduleRender);
     el.addEventListener('change', scheduleRender);
   }
 });

/* ===================== PAYLOAD & RENDER ===================== */
function getPayload() {
  switch(state.type) {
    case 'url': return document.getElementById('f-url').value.trim();
    case 'text': return document.getElementById('f-text').value;
    case 'phone': return document.getElementById('f-phone').value.trim() ? `tel:${document.getElementById('f-phone').value.trim()}` : '';
    case 'sms': {
      const p = document.getElementById('f-sms-phone').value.trim();
      return p ? `SMSTO:${p}:${document.getElementById('f-sms-text').value}` : '';
    }
    case 'wifi': {
      const ssid = document.getElementById('f-wifi-ssid').value.trim();
      return ssid ? `WIFI:T:${document.getElementById('f-wifi-enc').value};S:${ssid};P:${document.getElementById('f-wifi-pass').value};;` : '';
    }
    case 'vcard': {
      const name = document.getElementById('f-vc-first').value.trim();
      const org = document.getElementById('f-vc-org').value.trim();
      const phone = document.getElementById('f-vc-phone').value.trim();
      if (!name && !org && !phone) return '';
      return `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nORG:${org}\nTEL:${phone}\nEND:VCARD`;
    }
  }
  return '';
}

const canvas = document.getElementById('qr-canvas');
const ctx = canvas.getContext('2d');
let debounceTimer = null;

function scheduleRender() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(render, 100);
}

function render() {
  const payload = getPayload();
  const btnPng = document.getElementById('btn-png');
  const statusEl = document.getElementById('status');
  const statusText = document.getElementById('status-text');
  const emptyMsg = document.getElementById('empty-msg');

  if (!payload) {
    canvas.style.display = 'none';
    emptyMsg.style.display = 'block';
    statusEl.className = 'status-indicator invalid';
    statusText.textContent = 'ข้อมูลไม่ครบถ้วน';
    btnPng.disabled = true;
    return;
  }

  try {
    const ecl = state.logoImg ? 'H' : 'M';
    const qr = qrcode(0, ecl);
    qr.addData(payload);
    qr.make();
    
    const count = qr.getModuleCount();
    const size = state.resolution;
    canvas.width = size;
    canvas.height = size;

    const quiet = 4;
    const modSize = size / (count + quiet * 2);
    const offset = quiet * modSize;

    ctx.fillStyle = state.bg;
    ctx.fillRect(0, 0, size, size);

    let fgFill = state.fg1;
    if (state.fgMode === 'gradient') {
      const grad = ctx.createLinearGradient(0, 0, size, size);
      grad.addColorStop(0, state.fg1);
      grad.addColorStop(1, state.fg2);
      fgFill = grad;
    }
    ctx.fillStyle = fgFill;

    for (let r = 0; r < count; r++) {
      for (let c = 0; c < count; c++) {
        if (!qr.isDark(r, c)) continue;
        if ((r < 7 && c < 7) || (r < 7 && c >= count - 7) || (r >= count - 7 && c < 7)) continue;

        const x = offset + c * modSize;
        const y = offset + r * modSize;

        if (state.dotShape === 'dots') {
          ctx.beginPath();
          ctx.arc(x + modSize / 2, y + modSize / 2, modSize * 0.45, 0, Math.PI * 2);
          ctx.fill();
        } else if (state.dotShape === 'rounded') {
          ctx.beginPath();
          ctx.roundRect(x, y, modSize, modSize, modSize * 0.3);
          ctx.fill();
        } else {
          ctx.fillRect(x, y, modSize, modSize);
        }
      }
    }

    // Function วาดตา
    function drawEye(r, c) {
      const x = offset + c * modSize;
      const y = offset + r * modSize;
      const s = modSize * 7;
      
      // กรอบตา
      ctx.fillStyle = state.eyeFrame;
      ctx.beginPath();
      if (state.eyeFrameShape === 'rounded') {
        ctx.roundRect(x, y, s, s, s * 0.25);
        ctx.roundRect(x + modSize, y + modSize, s - modSize*2, s - modSize*2, (s - modSize*2) * 0.25);
      } else if (state.eyeFrameShape === 'circle') {
        ctx.arc(x + s/2, y + s/2, s/2, 0, Math.PI * 2);
        ctx.arc(x + s/2, y + s/2, s/2 - modSize, 0, Math.PI * 2);
      } else {
        ctx.rect(x, y, s, s);
        ctx.rect(x + modSize, y + modSize, s - modSize*2, s - modSize*2);
      }
      ctx.fill('evenodd');

      // ลูกตาด้านใน
      ctx.fillStyle = state.eyeBall;
      const ballS = modSize * 3;
      const ballX = x + modSize * 2;
      const ballY = y + modSize * 2;
      
      ctx.beginPath();
      ctx.rect(ballX, ballY, ballS, ballS);
      ctx.fill();
    }

    drawEye(0, 0);
    drawEye(0, count - 7);
    drawEye(count - 7, 0);

    // วาดโลโก้
    if (state.logoImg) {
      const logoRatio = 0.24;
      const logoSize = size * logoRatio;
      const lx = (size - logoSize) / 2;
      const ly = (size - logoSize) / 2;
      
      if (state.logoKnockout) {
        const pad = logoSize * 0.15;
        ctx.fillStyle = state.bg;
        ctx.beginPath();
        ctx.roundRect(lx - pad, ly - pad, logoSize + pad * 2, logoSize + pad * 2, (logoSize + pad * 2) * 0.15);
        ctx.fill();
      }
      ctx.drawImage(state.logoImg, lx, ly, logoSize, logoSize);
    }

    canvas.style.display = 'block';
    emptyMsg.style.display = 'none';
    statusEl.className = 'status-indicator good';
    statusText.textContent = 'พร้อมดาวน์โหลด';
    btnPng.disabled = false;

  } catch(e) {
    canvas.style.display = 'none';
    emptyMsg.style.display = 'block';
    emptyMsg.innerHTML = '<p>ข้อมูลยาวเกินไป กรุณาลดจำนวนข้อความลง</p>';
    statusEl.className = 'status-indicator invalid';
    statusText.textContent = 'เกิดข้อผิดพลาด';
    btnPng.disabled = true;
  }
}

document.getElementById('btn-png').addEventListener('click', () => {
  const a = document.createElement('a');
  a.download = 'qrcode.png';
  a.href = canvas.toDataURL('image/png');
  a.click();
});

// Init
window.addEventListener('DOMContentLoaded', () => {
  initConfig();
  scheduleRender();
});
