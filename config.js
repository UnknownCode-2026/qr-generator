// config.js

const AppConfig = {
  // 1. ข้อมูลทั่วไปของเว็บไซต์ (Branding)
  siteName: "QR-GENERATOR",
  brandName: "QR-GENERATOR",
  headerBadge: "PRO",
  windowTitle: "QR-GENERATOR",
  
  // 2. ข้อความส่วนท้าย (Footer)
  footerText: "© 2026 QR-GENERATOR",

  // 3. การตั้งค่าเริ่มต้น (Default Values)
  defaultTab: "url", // url, text, email, phone, sms, wifi, vcard
  defaultUrl: "https://example.com",
  defaultWifiSSID: "XX_Cafe_Free_WiFi", // ชื่อ WiFi เริ่มต้นของร้าน
  defaultResolution: 1000,
  
  // 4. การตั้งค่าระบบ
  maxUploadSizeMB: 2, // ขนาดไฟล์โลโก้สูงสุด (MB)
  defaultTheme: "cyber", // ธีมสีเริ่มต้น: cyber, emerald, sunset, rose
};
