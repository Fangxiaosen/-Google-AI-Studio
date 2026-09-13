import React, { useState, useEffect, useRef } from 'react';
import { Copy, Check, Globe, Network, ServerCrash, RefreshCw, Sun, Moon, Languages, MapPin, Server, Shield, ShieldAlert, Gauge, ArrowDown, ArrowUp, Activity, Play, Square, ChevronDown, Zap, RotateCw, Fingerprint, Clock, Compass, Monitor, Cpu, Waves, Battery, BatteryCharging, Wifi, SignalHigh } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface IpState {
  ip: string | null;
  loading: boolean;
  hasError: boolean;
}

interface IpDetails {
  country?: string;
  city?: string;
  isp?: string;
  vpn?: boolean;
  asn?: string;
  timezone?: string;
  latitude?: number;
  longitude?: number;
}

const translations = {
  en: {
    title: "Network Identity",
    subtitles: [
      "Your public IP addresses, automatically detected.",
      "Real-time network security and performance analysis.",
      "Comprehensive diagnostic tools for your connection."
    ],
    ipv4: "IPv4 Address",
    ipv6: "IPv6 Address",
    refresh: "Refresh",
    copy: "Copy to clipboard",
    footer: "Data provided by ipify, ipwhois & Cloudflare",
    errIpv4: "IPv4 unavailable or blocked.",
    errIpv6: "IPv6 is not available on your network.",
    networkInfo: "Network Info",
    location: "Location",
    isp: "ISP",
    security: "Security",
    vpnDetected: "VPN/Proxy Detected",
    noVpn: "Clean Network",
    speedTest: "Speed Test",
    startTest: "Start",
    stop: "Stop",
    download: "Download",
    upload: "Upload",
    ping: "Ping",
    jitter: "Jitter",
    testing: "Testing...",
    mbps: "Mbps",
    ms: "ms",
    unknown: "Unknown",
    notAvailable: "N/A",
    dynamicPing: "Dynamic Latency",
    pause: "Pause",
    resume: "Resume",
    advancedInfo: "Advanced Details",
    tapToFlip: "Tap card to flip",
    asn: "ASN",
    timezone: "Timezone",
    coordinates: "Coordinates",
    pingNotice: "* 'Err' typically means the target is blocked by local firewalls or strict network policies.",
    avgLatency: "Avg Latency",
    status: "Health",
    excellent: "Excellent",
    good: "Good",
    poor: "Poor",
    clientInfo: "Client Info",
    timeInfo: "Time Information",
    localTime: "Local Time",
    beijingTime: "Beijing Time",
    utcTime: "UTC Time",
    deviceInfo: "Device & Browser",
    screenResolution: "Screen Resolution",
    colorDepth: "Color Depth",
    browserLang: "Browser Language",
    cpuCores: "Logical Cores",
    deviceMemory: "Device Memory",
    platform: "Platform",
    localIp: "Local IP",
    connectionStatus: "Network Connection",
    networkType: "Network Type",
    downlink: "Downlink",
    rtt: "Latency (RTT)",
    batteryStatus: "Battery Status",
    batteryLevel: "Battery Level",
    charging: "Charging",
    discharging: "Discharging",
    saveData: "Data Saver",
    on: "On",
    off: "Off",
  },
  zh: {
    title: "网络标识",
    subtitles: [
      "您的公网 IP 地址，由系统从当前网络连接中自动检测。",
      "实时的网络安全与性能分析工具。",
      "为您的网络连接提供全面的诊断信息。"
    ],
    ipv4: "IPv4 地址",
    ipv6: "IPv6 地址",
    refresh: "刷新",
    copy: "复制到剪贴板",
    footer: "数据由 ipify、ipwhois 和 Cloudflare 提供",
    errIpv4: "IPv4 不可用或被阻止。",
    errIpv6: "您的网络暂不支持 IPv6。",
    networkInfo: "网络信息",
    location: "地理位置",
    isp: "运营商",
    security: "网络安全",
    vpnDetected: "疑似 VPN / 代理",
    noVpn: "未检测到代理",
    speedTest: "网络测速",
    startTest: "开始",
    stop: "停止",
    download: "下载",
    upload: "上传",
    ping: "延迟",
    jitter: "网络抖动",
    testing: "测速中...",
    mbps: "Mbps",
    ms: "ms",
    unknown: "未知",
    notAvailable: "暂无",
    dynamicPing: "动态延迟检测",
    pause: "暂停",
    resume: "继续",
    advancedInfo: "高级网络信息",
    tapToFlip: "点击卡片翻转",
    asn: "自治系统号",
    timezone: "所在时区",
    coordinates: "地理坐标",
    pingNotice: "* 提示：部分海外节点（如 Google）显示 Err 通常是因为被当前网络防火墙拦截或跨域限制。",
    avgLatency: "平均延迟",
    status: "网络健康度",
    excellent: "极佳",
    good: "良好",
    poor: "较差",
    clientInfo: "客户端环境",
    timeInfo: "时间信息",
    localTime: "本地时间",
    beijingTime: "北京时间",
    utcTime: "标准时间 (UTC)",
    deviceInfo: "设备与浏览器指纹",
    screenResolution: "屏幕分辨率",
    colorDepth: "色彩深度",
    browserLang: "浏览器语言",
    cpuCores: "逻辑核心数",
    deviceMemory: "设备内存",
    platform: "系统平台",
    localIp: "局域网 IP",
    connectionStatus: "网络连接状态",
    networkType: "网络类型",
    downlink: "下行带宽",
    rtt: "往返延迟 (RTT)",
    batteryStatus: "电池状态",
    batteryLevel: "电池电量",
    charging: "充电中",
    discharging: "未充电",
    saveData: "省流量模式",
    on: "开启",
    off: "关闭",
  }
};

function getClientInfo() {
  if (typeof window === 'undefined') return { os: 'Unknown', browser: 'Unknown' };
  const ua = navigator.userAgent;
  let os = "Unknown";
  if (ua.indexOf("Win") !== -1) os = "Windows";
  else if (ua.indexOf("Mac") !== -1) os = "MacOS";
  else if (ua.indexOf("Linux") !== -1) os = "Linux";
  else if (/Android/.test(ua)) os = "Android";
  else if (/iPhone|iPad|iPod/.test(ua)) os = "iOS";
  
  let browser = "Unknown";
  if (ua.indexOf("Edg") !== -1) browser = "Edge";
  else if (ua.indexOf("Chrome") !== -1) browser = "Chrome";
  else if (ua.indexOf("Safari") !== -1) browser = "Safari";
  else if (ua.indexOf("Firefox") !== -1) browser = "Firefox";
  
  return { os, browser };
}

export default function App() {
  const [ipv4, setIpv4] = useState<IpState>({ ip: null, loading: true, hasError: false });
  const [ipv6, setIpv6] = useState<IpState>({ ip: null, loading: true, hasError: false });
  const [details, setDetails] = useState<IpDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(true);
  
  const [lang, setLang] = useState<'en' | 'zh'>('zh');
  const [isDark, setIsDark] = useState(false);
  const clientInfo = getClientInfo();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  const t = translations[lang];

  const fetchIpv4 = async () => {
    setIpv4({ ip: null, loading: true, hasError: false });
    try {
      const response = await fetch('https://api4.ipify.org?format=json');
      if (!response.ok) throw new Error('Failed');
      const data = await response.json();
      setIpv4({ ip: data.ip, loading: false, hasError: false });
    } catch (err) {
      setIpv4({ ip: null, loading: false, hasError: true });
    }
  };

  const fetchIpv6 = async () => {
    setIpv6({ ip: null, loading: true, hasError: false });
    try {
      const response = await fetch('https://api6.ipify.org?format=json');
      if (!response.ok) throw new Error('Failed');
      const data = await response.json();
      setIpv6({ ip: data.ip, loading: false, hasError: false });
    } catch (err) {
      setIpv6({ ip: null, loading: false, hasError: true });
    }
  };

  const fetchDetails = async () => {
    setDetailsLoading(true);
    try {
      const response = await fetch(`https://ipwho.is/`);
      const data = await response.json();
      if (data.success) {
        setDetails({
          country: data.country,
          city: data.city,
          isp: data.connection?.isp,
          vpn: data.security?.vpn || data.security?.proxy || data.security?.tor || false,
          asn: data.connection?.asn ? `AS${data.connection.asn}` : undefined,
          timezone: data.timezone?.id,
          latitude: data.latitude,
          longitude: data.longitude
        });
      } else {
        setDetails(null);
      }
    } catch (err) {
      setDetails(null);
    } finally {
      setDetailsLoading(false);
    }
  };

  useEffect(() => {
    fetchIpv4();
    fetchIpv6();
    fetchDetails();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50 font-sans transition-colors duration-500 flex flex-col items-center p-4 md:p-8 relative overflow-x-hidden overflow-y-auto">
      {/* Liquid Glass Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none fixed">
        <motion.div 
          animate={{ 
            x: [0, 50, 0, -50, 0], 
            y: [0, 30, -20, 20, 0], 
            scale: [1, 1.1, 1, 0.9, 1],
            backgroundColor: isDark 
              ? ['rgba(37,99,235,0.3)', 'rgba(79,70,229,0.3)', 'rgba(37,99,235,0.3)'] 
              : ['rgba(96,165,250,0.3)', 'rgba(129,140,248,0.3)', 'rgba(96,165,250,0.3)']
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-[5%] left-[10%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full blur-[80px] mix-blend-multiply dark:mix-blend-screen" 
        />
        <motion.div 
          animate={{ 
            x: [0, -40, 20, -10, 0], 
            y: [0, -30, 40, -20, 0], 
            scale: [1, 0.9, 1.1, 1, 1],
            backgroundColor: isDark 
              ? ['rgba(147,51,234,0.3)', 'rgba(192,38,211,0.3)', 'rgba(147,51,234,0.3)'] 
              : ['rgba(192,132,252,0.3)', 'rgba(232,121,249,0.3)', 'rgba(192,132,252,0.3)']
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute top-[30%] right-[10%] w-[45vw] h-[45vw] max-w-[600px] max-h-[600px] rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen" 
        />
         <motion.div 
          animate={{ 
            x: [0, 30, -30, 20, 0], 
            y: [0, 50, -10, 30, 0], 
            scale: [1, 1.2, 0.9, 1.1, 1],
            backgroundColor: isDark 
              ? ['rgba(13,148,136,0.3)', 'rgba(5,150,105,0.3)', 'rgba(13,148,136,0.3)'] 
              : ['rgba(45,212,191,0.3)', 'rgba(52,211,153,0.3)', 'rgba(45,212,191,0.3)']
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[10%] left-[20%] w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen" 
        />
        <motion.div 
          animate={{ 
            x: [0, -50, 30, -20, 0], 
            y: [0, -40, 20, -30, 0], 
            scale: [1, 0.8, 1.2, 0.9, 1],
            backgroundColor: isDark 
              ? ['rgba(225,29,72,0.2)', 'rgba(217,119,6,0.2)', 'rgba(225,29,72,0.2)'] 
              : ['rgba(251,113,133,0.3)', 'rgba(251,191,36,0.3)', 'rgba(251,113,133,0.3)']
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[10%] right-[20%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen" 
        />
        <motion.div 
          animate={{ 
            x: [0, 60, -40, 30, 0], 
            y: [0, 40, -30, 50, 0], 
            scale: [1, 1.3, 0.8, 1.2, 1],
            backgroundColor: isDark 
              ? ['rgba(8,145,178,0.2)', 'rgba(2,132,199,0.2)', 'rgba(8,145,178,0.2)'] 
              : ['rgba(34,211,238,0.3)', 'rgba(56,189,248,0.3)', 'rgba(34,211,238,0.3)']
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          className="absolute top-[40%] left-[40%] w-[35vw] h-[35vw] max-w-[400px] max-h-[400px] rounded-full blur-[90px] mix-blend-multiply dark:mix-blend-screen" 
        />
      </div>

      {/* Top Actions Bar */}
      <div className="absolute top-4 right-4 md:top-8 md:right-8 flex items-center gap-3 z-20">
        <button 
          onClick={() => setLang(l => l === 'en' ? 'zh' : 'en')}
          className="flex items-center gap-2 px-4 py-2 bg-white/40 dark:bg-black/20 backdrop-blur-xl border border-white/50 dark:border-white/10 rounded-full text-sm font-medium hover:bg-white/50 dark:hover:bg-white/10 transition-all shadow-[0_4px_16px_0_rgba(0,0,0,0.05)] dark:shadow-[0_4px_16px_0_rgba(0,0,0,0.2)]"
        >
          <Languages size={16} />
          <span>{lang === 'en' ? '中文' : 'EN'}</span>
        </button>
        <button 
          onClick={() => setIsDark(d => !d)}
          className="p-2.5 bg-white/40 dark:bg-black/20 backdrop-blur-xl border border-white/50 dark:border-white/10 rounded-full hover:bg-white/50 dark:hover:bg-white/10 transition-all shadow-[0_4px_16px_0_rgba(0,0,0,0.05)] dark:shadow-[0_4px_16px_0_rgba(0,0,0,0.2)]"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-6xl space-y-6 relative z-10 pt-16 md:pt-12 pb-12"
      >
        <div className="flex flex-col items-center justify-center space-y-6 mb-12">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5, type: "spring", stiffness: 200 }}
            className="flex items-center gap-3 px-5 py-2.5 bg-white/30 dark:bg-black/20 backdrop-blur-xl rounded-full border border-white/50 dark:border-white/10 shadow-sm"
          >
            <Globe size={18} className="text-indigo-500" />
            <span className="text-sm font-bold tracking-wider text-neutral-700 dark:text-neutral-200 uppercase">
              <Typewriter text={t.title} speed={100} />
            </span>
          </motion.div>
          <div className="space-y-4">
            <div className="h-28 md:h-20 lg:h-16 flex items-center justify-center px-4">
               <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-neutral-800 dark:text-neutral-100 drop-shadow-sm text-center">
                 <Typewriter texts={t.subtitles} delay={800} />
               </h1>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-3 pt-2"
            >
              <div className="flex items-center gap-2 px-4 py-2 bg-white/40 dark:bg-black/20 backdrop-blur-md rounded-full border border-white/50 dark:border-white/10 shadow-sm text-sm font-medium text-neutral-700 dark:text-neutral-300">
                 <Monitor size={16} className="text-indigo-500" /> <Typewriter text={clientInfo.os} delay={1500} />
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/40 dark:bg-black/20 backdrop-blur-md rounded-full border border-white/50 dark:border-white/10 shadow-sm text-sm font-medium text-neutral-700 dark:text-neutral-300">
                 <Cpu size={16} className="text-rose-500" /> <Typewriter text={clientInfo.browser} delay={2000} />
              </div>
            </motion.div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div className="md:col-span-1 lg:col-span-1" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.1 }} transition={{ duration: 0.5, ease: "easeOut" }}>
            <IpCard title={t.ipv4} state={ipv4} errorMsg={t.errIpv4} onRefresh={fetchIpv4} icon={<Network size={28} strokeWidth={1.5} />} tooltipRefresh={t.refresh} tooltipCopy={t.copy} versionLabel="IPv4" delay={500} />
          </motion.div>
          <motion.div className="md:col-span-1 lg:col-span-2" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.1 }} transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}>
            <IpCard title={t.ipv6} state={ipv6} errorMsg={t.errIpv6} onRefresh={fetchIpv6} icon={<Globe size={28} strokeWidth={1.5} />} tooltipRefresh={t.refresh} tooltipCopy={t.copy} versionLabel="IPv6" delay={600} isLong={true} />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div className="md:col-span-1" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.1 }} transition={{ duration: 0.5, ease: "easeOut" }}>
            <DetailsCard t={t} details={details} loading={detailsLoading} />
          </motion.div>
          <motion.div className="md:col-span-2" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.1 }} transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}>
            <SpeedTestCard t={t} />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div className="lg:col-span-2" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.1 }} transition={{ duration: 0.5, ease: "easeOut" }}>
            <DynamicPingCard t={t} />
          </motion.div>
          <motion.div className="lg:col-span-1" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.1 }} transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}>
            <TimeInfoCard t={t} />
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.1 }} transition={{ duration: 0.5, ease: "easeOut" }}>
            <DeviceInfoCard t={t} />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.1 }} transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}>
            <HardwareStatusCard t={t} />
          </motion.div>
        </div>

      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mb-8 text-sm font-medium text-neutral-500 dark:text-neutral-400 flex items-center justify-center gap-2 relative z-10 bg-white/20 dark:bg-black/20 backdrop-blur-md px-6 py-2 rounded-full border border-white/30 dark:border-white/5"
      >
        <span className="h-5 flex items-center justify-center"><Typewriter text={t.footer} delay={2500} /></span>
      </motion.div>
    </div>
  );
}

function IpCard({ title, state, errorMsg, onRefresh, icon, tooltipRefresh, tooltipCopy, versionLabel, delay, isLong }: any) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (state.ip) {
      navigator.clipboard.writeText(state.ip);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const textSize = isLong ? 'text-lg md:text-xl lg:text-2xl font-mono tracking-tighter' : 'font-mono text-2xl md:text-3xl tracking-tight';

  return (
    <div className="relative group h-full min-h-[220px]">
      <div className="absolute inset-0 bg-white/40 dark:bg-white/5 rounded-[2rem] blur-xl group-hover:blur-2xl transition-all duration-500 opacity-50 dark:opacity-20" />
      <div className="relative p-8 rounded-[2rem] bg-white/40 dark:bg-black/30 backdrop-blur-2xl border border-white/60 dark:border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.05)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] h-full flex flex-col transition-transform duration-300 group-hover:-translate-y-1">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/50 dark:bg-white/10 rounded-2xl shadow-inner border border-white/60 dark:border-white/10 text-neutral-700 dark:text-neutral-200 backdrop-blur-md">
              {icon}
            </div>
            <div className="flex flex-col">
              <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100 flex items-center"><Typewriter text={title} delay={delay} /></h2>
              <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mt-0.5">{versionLabel} Protocol</span>
            </div>
          </div>
          <button 
            onClick={onRefresh}
            disabled={state.loading}
            className="p-2.5 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10 rounded-xl backdrop-blur-md transition-all disabled:opacity-50 border border-transparent hover:border-white/40 dark:hover:border-white/10 shadow-sm"
            title={tooltipRefresh}
          >
            <RefreshCw size={20} className={state.loading ? "animate-spin" : ""} />
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-center min-h-[80px]">
          <AnimatePresence mode="wait">
            {state.loading ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                <div className="h-8 bg-black/5 dark:bg-white/5 rounded-xl w-3/4 animate-pulse backdrop-blur-sm" />
                <div className="h-5 bg-black/5 dark:bg-white/5 rounded-xl w-1/2 animate-pulse backdrop-blur-sm" />
              </motion.div>
            ) : state.hasError ? (
              <motion.div key="error" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-start space-x-3 text-neutral-600 dark:text-neutral-300 bg-red-500/10 dark:bg-red-500/10 p-5 rounded-2xl border border-red-500/20 backdrop-blur-md">
                <ServerCrash size={24} className="text-red-500 flex-shrink-0 mt-0.5" />
                <span className="text-base font-medium leading-relaxed">{errorMsg}</span>
              </motion.div>
            ) : (
              <motion.div key="success" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="flex items-center justify-between gap-4">
                  <div className={`${textSize} font-semibold text-neutral-900 dark:text-white break-all drop-shadow-sm`}>
                    {state.ip}
                  </div>
                  <button onClick={handleCopy} className="flex-shrink-0 p-3.5 bg-white/60 dark:bg-white/10 backdrop-blur-md border border-white/60 dark:border-white/10 hover:bg-white/80 dark:hover:bg-white/20 rounded-2xl text-neutral-700 dark:text-neutral-200 transition-all active:scale-95 shadow-sm" title={tooltipCopy}>
                    {copied ? <Check size={22} className="text-emerald-600 dark:text-emerald-400" /> : <Copy size={22} />}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function DetailsCard({ t, details, loading }: { t: any, details: IpDetails | null, loading: boolean }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="relative group h-full min-h-[340px] [perspective:1000px] cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
      <div className="absolute inset-0 bg-white/40 dark:bg-white/5 rounded-[2rem] blur-xl group-hover:blur-2xl transition-all duration-500 opacity-50 dark:opacity-20" />
      
      <motion.div 
        className="relative w-full h-full [transform-style:preserve-3d] transition-all duration-700 shadow-[0_8px_32px_0_rgba(0,0,0,0.05)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] rounded-[2rem]"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 60, damping: 15 }}
      >
        {/* Front Face */}
        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] p-8 rounded-[2rem] bg-white/40 dark:bg-black/30 backdrop-blur-2xl border border-white/60 dark:border-white/10 flex flex-col group-hover:-translate-y-1 transition-transform duration-300 z-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/50 dark:bg-white/10 rounded-2xl shadow-inner border border-white/60 dark:border-white/10 text-neutral-700 dark:text-neutral-200 backdrop-blur-md">
                <Activity size={28} strokeWidth={1.5} />
              </div>
              <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100"><Typewriter text={t.networkInfo} delay={800} /></h2>
            </div>
            <div className="flex items-center gap-1.5 text-neutral-400 dark:text-neutral-500 text-xs font-medium">
              <RotateCw size={14} /> <span className="hidden sm:inline">{t.tapToFlip}</span>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center space-y-6">
            {loading ? (
              <div className="space-y-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center justify-between">
                     <div className="flex items-center space-x-3">
                       <div className="w-5 h-5 bg-black/5 dark:bg-white/5 rounded-full animate-pulse" />
                       <div className="w-20 h-4 bg-black/5 dark:bg-white/5 rounded-md animate-pulse" />
                     </div>
                     <div className="w-28 h-4 bg-black/5 dark:bg-white/5 rounded-md animate-pulse" />
                  </div>
                ))}
              </div>
            ) : (
              <>
                 <InfoRow icon={<MapPin size={20}/>} label={t.location} value={details?.city ? `${details.city}, ${details.country}` : t.unknown} />
                 <InfoRow icon={<Server size={20}/>} label={t.isp} value={details?.isp || t.unknown} />
                 <InfoRow 
                   icon={details?.vpn ? <ShieldAlert size={20} className="text-amber-500" /> : <Shield size={20} className="text-emerald-500"/>} 
                   label={t.security} 
                   value={details?.vpn ? t.vpnDetected : t.noVpn} 
                   valueColor={details?.vpn ? "text-amber-600 dark:text-amber-400 font-semibold" : "text-emerald-600 dark:text-emerald-400 font-semibold"}
                 />
              </>
            )}
          </div>
        </div>

        {/* Back Face */}
        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] p-8 rounded-[2rem] bg-indigo-50/80 dark:bg-indigo-950/40 backdrop-blur-2xl border border-indigo-200/50 dark:border-indigo-500/20 flex flex-col group-hover:-translate-y-1 transition-transform duration-300 z-0">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/60 dark:bg-indigo-900/40 rounded-2xl shadow-inner border border-white/60 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-300 backdrop-blur-md">
                <Fingerprint size={28} strokeWidth={1.5} />
              </div>
              <h2 className="text-xl font-semibold text-indigo-900 dark:text-indigo-100">{t.advancedInfo}</h2>
            </div>
            <div className="flex items-center gap-1.5 text-indigo-400 dark:text-indigo-500 text-xs font-medium">
              <RotateCw size={14} /> <span className="hidden sm:inline">{t.tapToFlip}</span>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center space-y-6">
            {loading ? (
               <div className="flex items-center justify-center h-full">
                 <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin" />
               </div>
            ) : (
              <>
                 <InfoRow icon={<Network size={20} className="text-indigo-500"/>} label={t.asn} value={details?.asn || t.unknown} valueColor="text-indigo-900 dark:text-indigo-100" />
                 <InfoRow icon={<Clock size={20} className="text-indigo-500"/>} label={t.timezone} value={details?.timezone || t.unknown} valueColor="text-indigo-900 dark:text-indigo-100" />
                 <InfoRow icon={<Compass size={20} className="text-indigo-500"/>} label={t.coordinates} value={details?.latitude ? `${details.latitude}, ${details.longitude}` : t.unknown} valueColor="text-indigo-900 dark:text-indigo-100 font-mono text-sm" />
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function SpeedTestCard({ t }: { t: any }) {
  const [testing, setTesting] = useState(false);
  const [download, setDownload] = useState<number | null>(null);
  const [upload, setUpload] = useState<number | null>(null);
  const [ping, setPing] = useState<number | null>(null);
  const [jitter, setJitter] = useState<number | null>(null);
  const [source, setSource] = useState('cloudflare');
  
  const abortControllerRef = useRef<AbortController | null>(null);

  const sources = [
    { id: 'cloudflare', name: 'Cloudflare', dl: 'https://speed.cloudflare.com/__down?bytes=10000000' },
    { id: 'jsdelivr', name: 'jsDelivr', dl: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.44.0/min/vs/editor/editor.main.js' },
    { id: 'bytedance', name: 'ByteDance', dl: 'https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/monaco-editor/0.33.0/min/vs/editor/editor.main.js' }
  ];

  const stopTest = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setTesting(false);
    }
  }

  const startTest = async () => {
    setTesting(true);
    setDownload(null);
    setUpload(null);
    setPing(null);
    setJitter(null);

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;
    const selectedSource = sources.find(s => s.id === source) || sources[0];

    try {
      // Ping & Jitter Test
      let pingsArray = [];
      for(let i=0; i<3; i++) {
        if (signal.aborted) throw new Error('Aborted');
        const pingStart = performance.now();
        await fetch(selectedSource.dl + (selectedSource.dl.includes('?') ? '&' : '?') + 'ping=' + Math.random(), { cache: 'no-store', mode: 'no-cors', signal });
        pingsArray.push(Math.round(performance.now() - pingStart));
      }
      if (signal.aborted) throw new Error('Aborted');
      const avgPing = Math.round(pingsArray.reduce((a,b)=>a+b,0)/pingsArray.length);
      setPing(avgPing);
      setJitter(Math.round(Math.max(...pingsArray) - Math.min(...pingsArray)));

      // Download Test
      let totalBytes = 0;
      const dlStart = performance.now();
      
      if (source === 'cloudflare') {
         const res = await fetch(selectedSource.dl, { cache: 'no-store', signal });
         const blob = await res.blob();
         totalBytes = blob.size;
      } else {
         for (let i = 0; i < 4; i++) {
           if (signal.aborted) throw new Error('Aborted');
           const res = await fetch(selectedSource.dl + '?t=' + Math.random(), { cache: 'no-store', mode: 'cors', signal });
           const blob = await res.blob();
           totalBytes += blob.size;
         }
      }

      if (signal.aborted) throw new Error('Aborted');
      const duration = (performance.now() - dlStart) / 1000;
      setDownload(Math.round(((totalBytes * 8) / (1024 * 1024)) / duration));

      // Upload Test
      if (source === 'cloudflare') {
        const upBytes = 2000000;
        const data = new Uint8Array(upBytes);
        const upStart = performance.now();
        await fetch('https://speed.cloudflare.com/__up', { method: 'POST', body: data, cache: 'no-store', signal });
        const upDuration = (performance.now() - upStart) / 1000;
        setUpload(Math.round(((upBytes * 8) / (1024 * 1024)) / upDuration));
      } else {
        setUpload(-1); 
      }

    } catch (e: any) {
      if (e.message !== 'Aborted' && e.name !== 'AbortError') {
        if (ping === null) setPing(-1);
        if (jitter === null) setJitter(-1);
        if (download === null) setDownload(-1);
        if (upload === null) setUpload(-1);
      }
    }

    setTesting(false);
  };

  const displayVal = (val: number | null, unit: string) => {
    if (val === null) return '-';
    if (val === -1) return t.notAvailable;
    return `${val} ${unit}`;
  }

  return (
    <div className="relative group h-full min-h-[340px]">
      <div className="absolute inset-0 bg-white/40 dark:bg-white/5 rounded-[2rem] blur-xl group-hover:blur-2xl transition-all duration-500 opacity-50 dark:opacity-20" />
      <div className="relative p-8 rounded-[2rem] bg-white/40 dark:bg-black/30 backdrop-blur-2xl border border-white/60 dark:border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.05)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] h-full flex flex-col transition-transform duration-300 group-hover:-translate-y-1 overflow-hidden">
        
        {/* Subtle animated background while testing */}
        {testing && (
          <motion.div 
            className="absolute inset-0 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-[2rem]"
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}

        <div className="relative z-10 flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/50 dark:bg-white/10 rounded-2xl shadow-inner border border-white/60 dark:border-white/10 text-neutral-700 dark:text-neutral-200 backdrop-blur-md">
                <Gauge size={28} strokeWidth={1.5} />
              </div>
              <div className="flex flex-col">
                 <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100 flex items-center"><Typewriter text={t.speedTest} delay={1000} /></h2>
                 <div className="relative mt-1 w-fit">
                   <select 
                     value={source} 
                     onChange={(e) => setSource(e.target.value)}
                     disabled={testing}
                     className="appearance-none bg-transparent text-xs font-medium text-neutral-500 dark:text-neutral-400 outline-none pr-5 cursor-pointer hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
                   >
                     {sources.map(s => <option key={s.id} value={s.id} className="text-black dark:text-black">{s.name}</option>)}
                   </select>
                   <ChevronDown size={12} className="absolute right-0 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                 </div>
              </div>
            </div>
            <button 
              onClick={testing ? stopTest : startTest}
              className={`px-4 py-2 ${testing ? 'bg-red-500/90 hover:bg-red-600' : 'bg-indigo-500/90 hover:bg-indigo-600'} text-white text-sm font-medium rounded-xl shadow-sm transition-all active:scale-95 flex items-center gap-2`}
            >
              {testing ? <><Square size={14} fill="currentColor" /> {t.stop}</> : <><Play size={14} fill="currentColor" /> {t.startTest}</>}
            </button>
        </div>

        <div className="relative z-10 flex-1 grid grid-cols-2 gap-4 gap-y-6 content-center">
           <InfoRow icon={<Activity size={20} className="text-blue-500"/>} label={t.ping} value={displayVal(ping, t.ms)} vertical />
           <InfoRow icon={<Waves size={20} className="text-amber-500"/>} label={t.jitter} value={displayVal(jitter, t.ms)} vertical />
           <InfoRow icon={<ArrowDown size={20} className="text-emerald-500"/>} label={t.download} value={displayVal(download, t.mbps)} vertical />
           <InfoRow icon={<ArrowUp size={20} className="text-purple-500"/>} label={t.upload} value={displayVal(upload, t.mbps)} vertical />
        </div>
      </div>
    </div>
  )
}

function DynamicPingCard({ t }: { t: any }) {
  const [pings, setPings] = useState<Record<string, number | null>>({});
  const [isRunning, setIsRunning] = useState(true);

  const targets = [
    { id: 'baidu', name: 'Baidu', url: 'https://www.baidu.com/favicon.ico' },
    { id: 'taobao', name: 'Taobao', url: 'https://www.taobao.com/favicon.ico' },
    { id: 'qq', name: 'Tencent', url: 'https://www.qq.com/favicon.ico' },
    { id: 'bilibili', name: 'Bilibili', url: 'https://www.bilibili.com/favicon.ico' },
    { id: 'google', name: 'Google', url: 'https://www.google.com/favicon.ico' },
    { id: 'cloudflare', name: 'Cloudflare', url: 'https://www.cloudflare.com/favicon.ico' },
    { id: 'github', name: 'GitHub', url: 'https://github.com/favicon.ico' },
    { id: 'apple', name: 'Apple', url: 'https://www.apple.com/favicon.ico' },
  ];

  useEffect(() => {
    let interval: any;
    if (isRunning) {
      const pingAll = () => {
        targets.forEach(async (target) => {
          try {
            const start = performance.now();
            await fetch(target.url + '?t=' + Math.random(), { mode: 'no-cors', cache: 'no-store' });
            setPings(prev => ({ ...prev, [target.id]: Math.round(performance.now() - start) }));
          } catch (e) {
            setPings(prev => ({ ...prev, [target.id]: -1 }));
          }
        });
      };
      pingAll();
      interval = setInterval(pingAll, 3000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const getPingColor = (val: number | null) => {
    if (val === null) return 'bg-neutral-200 dark:bg-neutral-700';
    if (val === -1) return 'bg-red-500';
    if (val < 80) return 'bg-emerald-500';
    if (val < 200) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const getTextColor = (val: number | null) => {
    if (val === null) return 'text-neutral-400';
    if (val === -1) return 'text-red-500';
    if (val < 80) return 'text-emerald-600 dark:text-emerald-400';
    if (val < 200) return 'text-amber-600 dark:text-amber-400';
    return 'text-rose-600 dark:text-rose-400';
  }

  const validPings = Object.values(pings).filter((p): p is number => p !== null && p !== -1);
  const avgLatency = validPings.length > 0 ? Math.round(validPings.reduce((a,b)=>a+b,0)/validPings.length) : null;
  let statusText = t.unknown;
  let statusColor = "text-neutral-500 bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-400";
  
  if (avgLatency !== null) {
    if(avgLatency < 80) { statusText = t.excellent; statusColor = "text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/30"; }
    else if (avgLatency < 200) { statusText = t.good; statusColor = "text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30"; }
    else { statusText = t.poor; statusColor = "text-rose-600 bg-rose-100 dark:text-rose-400 dark:bg-rose-900/30"; }
  }

  return (
    <div className="relative group w-full h-full min-h-[340px]">
      <div className="absolute inset-0 bg-white/40 dark:bg-white/5 rounded-[2rem] blur-xl group-hover:blur-2xl transition-all duration-500 opacity-50 dark:opacity-20" />
      <div className="relative p-8 rounded-[2rem] bg-white/40 dark:bg-black/30 backdrop-blur-2xl border border-white/60 dark:border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.05)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] flex flex-col h-full transition-transform duration-300 group-hover:-translate-y-1">
        
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/50 dark:bg-white/10 rounded-2xl shadow-inner border border-white/60 dark:border-white/10 text-neutral-700 dark:text-neutral-200 backdrop-blur-md">
                <Zap size={28} strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100 flex items-center gap-3">
                   <Typewriter text={t.dynamicPing} delay={1200} />
                   {avgLatency !== null && (
                     <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${statusColor}`}>
                       {statusText}
                     </span>
                   )}
                </h2>
                <div className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                  {t.avgLatency}: <span className="font-medium text-neutral-700 dark:text-neutral-300">{avgLatency !== null ? `${avgLatency}ms` : '...'}</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsRunning(!isRunning)}
              className={`px-3 py-1.5 bg-white/50 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/20 border border-white/40 dark:border-white/10 text-neutral-700 dark:text-neutral-200 text-xs font-medium rounded-lg transition-all active:scale-95 flex items-center gap-1.5`}
            >
              {isRunning ? <><Square size={12} fill="currentColor" /> {t.pause}</> : <><Play size={12} fill="currentColor" /> {t.resume}</>}
            </button>
        </div>

        <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-4 content-start">
           {targets.map(target => {
             const val = pings[target.id];
             return (
               <div key={target.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/50 dark:bg-black/40 border border-white/60 dark:border-white/10 backdrop-blur-md shadow-sm transition-colors duration-300">
                 <div className="flex items-center space-x-2.5">
                   <div className={`w-2 h-2 rounded-full shadow-sm ${getPingColor(val)}`} />
                   <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{target.name}</span>
                 </div>
                 <span className={`text-sm font-semibold font-mono ${getTextColor(val)}`}>
                   {val === null ? '...' : val === -1 ? 'Err' : `${val}ms`}
                 </span>
               </div>
             )
           })}
        </div>
        <div className="mt-6 text-xs text-neutral-500 dark:text-neutral-500 text-center">
           {t.pingNotice}
        </div>
      </div>
    </div>
  )
}

function InfoRow({ icon, label, value, valueColor = "text-neutral-900 dark:text-neutral-100", vertical = false }: any) {
  if (vertical) {
    return (
      <div className="flex flex-col space-y-2 p-4 rounded-2xl bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/10">
        <div className="flex items-center space-x-2 text-neutral-500 dark:text-neutral-400">
          {icon}
          <span className="text-sm font-medium">{label}</span>
        </div>
        <div className={`font-semibold text-xl ${valueColor}`}>
          {value}
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3 text-neutral-500 dark:text-neutral-400">
        {icon}
        <span className="font-medium">{label}</span>
      </div>
      <div className={`font-semibold text-right ${valueColor}`}>
        {value}
      </div>
    </div>
  )
}

function Typewriter({ text, texts, loop = false, delay = 0, speed = 60 }: { text?: string, texts?: string[], loop?: boolean, delay?: number, speed?: number }) {
  const items = React.useMemo(() => texts || (text ? [text] : []), [texts, text]);
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  useEffect(() => {
    if (!started || items.length === 0 || finished) return;

    const currentText = items[textIndex];
    let timeoutId: NodeJS.Timeout;

    if (isDeleting) {
      if (charIndex > 0) {
        timeoutId = setTimeout(() => setCharIndex(c => c - 1), speed / 2);
      } else {
        setIsDeleting(false);
        setTextIndex((prev) => (prev + 1) % items.length);
      }
    } else {
      if (charIndex < currentText.length) {
        timeoutId = setTimeout(() => setCharIndex(c => c + 1), speed);
      } else {
        if (loop || items.length > 1) {
           timeoutId = setTimeout(() => setIsDeleting(true), 3000);
        } else {
           setFinished(true);
        }
      }
    }

    return () => clearTimeout(timeoutId);
  }, [charIndex, isDeleting, textIndex, items, started, finished, loop, speed]);

  if (items.length === 0) return null;

  return (
    <span className="inline-flex items-center relative">
      <span>{items[textIndex].substring(0, charIndex)}</span>
      {(!finished || loop) && (
        <span className="inline-block w-[2px] h-[0.9em] bg-current ml-1 align-middle animate-pulse" />
      )}
    </span>
  );
}

function AnimatedTime({ time, tz, suffix }: { time: Date, tz?: string, suffix?: string }) {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false,
    timeZone: tz
  };
  const formatter = new Intl.DateTimeFormat('sv-SE', options);
  const formatted = formatter.format(time); // "YYYY-MM-DD HH:mm:ss"
  
  const datePart = formatted.substring(0, 10);
  const timeBase = formatted.substring(11, 17); // "HH:mm:"
  const secs = formatted.substring(17, 19);

  return (
    <div className="flex items-center text-xl md:text-2xl font-mono font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
      <span className="text-neutral-600 dark:text-neutral-400">{datePart}</span>
      <span className="mx-2 text-neutral-300 dark:text-neutral-700/50">|</span>
      <span>{timeBase}</span>
      <div className="relative inline-flex items-center justify-center min-w-[1.4em] h-[1em] text-indigo-500 dark:text-indigo-400">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={secs}
            initial={{ opacity: 0, y: -15, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, zIndex: 10 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {/* The old number dissolving */}
            <motion.span
              exit={{ opacity: 0, scale: 1.5, filter: "blur(8px)" }}
              transition={{ duration: 0.4 }}
            >
              {secs}
            </motion.span>
            
            {/* The particle burst */}
            <motion.div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {Array.from({ length: 8 }).map((_, i) => {
                const angle = (i / 8) * Math.PI * 2;
                const distance = 12 + Math.random() * 15;
                return (
                  <motion.div
                    key={i}
                    initial={{ x: 0, y: 0, opacity: 0 }}
                    exit={{ 
                      x: Math.cos(angle) * distance, 
                      y: Math.sin(angle) * distance, 
                      opacity: [0, 1, 0], 
                      scale: [1, 0.5, 0] 
                    }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="absolute w-1 h-1 rounded-full bg-indigo-500 dark:bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.8)]"
                  />
                );
              })}
            </motion.div>
          </motion.div>
        </AnimatePresence>
        <span className="invisible">{secs}</span>
      </div>
      {suffix && <span className="ml-2 text-sm text-neutral-500 dark:text-neutral-500 font-sans tracking-normal font-medium">{suffix}</span>}
    </div>
  )
}

function TimeInfoCard({ t }: { t: any }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative group w-full h-full min-h-[340px]">
      <div className="absolute inset-0 bg-white/40 dark:bg-white/5 rounded-[2rem] blur-xl group-hover:blur-2xl transition-all duration-500 opacity-50 dark:opacity-20" />
      <div className="relative p-8 rounded-[2rem] bg-white/40 dark:bg-black/30 backdrop-blur-2xl border border-white/60 dark:border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.05)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] flex flex-col transition-transform duration-300 group-hover:-translate-y-1 h-full">
        <div className="flex items-center space-x-4 mb-8">
          <div className="p-3 bg-white/50 dark:bg-white/10 rounded-2xl shadow-inner border border-white/60 dark:border-white/10 text-neutral-700 dark:text-neutral-200 backdrop-blur-md">
            <Clock size={28} strokeWidth={1.5} />
          </div>
          <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100 flex items-center"><Typewriter text={t.timeInfo} delay={1400} /></h2>
        </div>

        <div className="flex flex-col justify-center space-y-8 flex-1">
          <div className="flex flex-col space-y-2">
             <div className="flex items-center gap-2 text-sm font-medium text-neutral-500 dark:text-neutral-400">
               <Clock size={16} className="text-sky-500" /> {t.localTime}
             </div>
             <AnimatedTime time={time} />
          </div>

          <div className="flex flex-col space-y-2">
             <div className="flex items-center gap-2 text-sm font-medium text-neutral-500 dark:text-neutral-400">
               <MapPin size={16} className="text-rose-500" /> {t.beijingTime}
             </div>
             <AnimatedTime time={time} tz="Asia/Shanghai" />
          </div>

          <div className="flex flex-col space-y-2">
             <div className="flex items-center gap-2 text-sm font-medium text-neutral-500 dark:text-neutral-400">
               <Globe size={16} className="text-indigo-500" /> {t.utcTime}
             </div>
             <AnimatedTime time={time} tz="UTC" suffix="UTC" />
          </div>
        </div>
      </div>
    </div>
  )
}

function DeviceInfoCard({ t }: { t: any }) {
  const [info, setInfo] = useState<any>({});
  
  useEffect(() => {
    const data = getClientInfo();
    const resolution = `${window.screen.width}x${window.screen.height}`;
    const colorDepth = `${window.screen.colorDepth}-bit`;
    const language = navigator.language;
    // @ts-ignore
    const platform = navigator.userAgentData?.platform || navigator.platform;
    const hardwareConcurrency = navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency}` : 'Unknown';
    // @ts-ignore
    const deviceMemory = navigator.deviceMemory ? `${navigator.deviceMemory} GB` : 'Unknown';
    
    setInfo((prev: any) => ({
      ...prev,
      ...data,
      resolution,
      colorDepth,
      language,
      platform,
      hardwareConcurrency,
      deviceMemory
    }));

    // WebRTC Local IP
    try {
      const RTCPeerConnection = window.RTCPeerConnection || (window as any).webkitRTCPeerConnection || (window as any).mozRTCPeerConnection;
      if (RTCPeerConnection) {
        const pc = new RTCPeerConnection({ iceServers: [] });
        pc.createDataChannel("");
        pc.createOffer().then(offer => pc.setLocalDescription(offer)).catch(() => {});
        pc.onicecandidate = (event) => {
          if (event.candidate && event.candidate.candidate) {
            const ipMatch = event.candidate.candidate.match(/([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7}|(?:[a-zA-Z0-9-]+\.local))/);
            if (ipMatch) {
              setInfo((prev: any) => ({ ...prev, localIp: ipMatch[1] }));
              pc.onicecandidate = null;
            }
          }
        };
      }
    } catch(e) {}
  }, []);

  return (
    <div className="relative group w-full h-full">
      <div className="absolute inset-0 bg-white/40 dark:bg-white/5 rounded-[2rem] blur-xl group-hover:blur-2xl transition-all duration-500 opacity-50 dark:opacity-20" />
      <div className="relative p-8 rounded-[2rem] bg-white/40 dark:bg-black/30 backdrop-blur-2xl border border-white/60 dark:border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.05)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] transition-transform duration-300 group-hover:-translate-y-1 h-full flex flex-col">
        <div className="flex items-center space-x-4 mb-8">
          <div className="p-3 bg-white/50 dark:bg-white/10 rounded-2xl shadow-inner border border-white/60 dark:border-white/10 text-neutral-700 dark:text-neutral-200 backdrop-blur-md">
            <Fingerprint size={28} strokeWidth={1.5} />
          </div>
          <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100 flex items-center"><Typewriter text={t.deviceInfo} delay={800} /></h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-2">
          <InfoRow label={t.platform} value={info.platform} icon={<Monitor className="text-indigo-500" size={16} />} />
          <InfoRow label={t.browserLang} value={info.language} icon={<Languages className="text-sky-500" size={16} />} />
          <InfoRow label={t.screenResolution} value={info.resolution} icon={<Monitor className="text-rose-500" size={16} />} />
          <InfoRow label={t.colorDepth} value={info.colorDepth} icon={<Waves className="text-emerald-500" size={16} />} />
          <InfoRow label={t.cpuCores} value={info.hardwareConcurrency} icon={<Cpu className="text-amber-500" size={16} />} />
          <InfoRow label={t.deviceMemory} value={info.deviceMemory} icon={<Server className="text-purple-500" size={16} />} />
          {info.localIp && (
            <div className="col-span-1 lg:col-span-2 mt-2 pt-2 border-t border-black/5 dark:border-white/5">
              <InfoRow label={t.localIp} value={info.localIp} icon={<Network className="text-sky-400" size={16} />} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function HardwareStatusCard({ t }: { t: any }) {
  const [batteryInfo, setBatteryInfo] = useState<any>(null);
  const [networkInfo, setNetworkInfo] = useState<any>(null);

  useEffect(() => {
    // Battery Status
    // @ts-ignore
    if (navigator.getBattery) {
      // @ts-ignore
      navigator.getBattery().then(battery => {
        const updateBattery = () => {
          setBatteryInfo({
            level: Math.round(battery.level * 100) + '%',
            charging: battery.charging,
          });
        };
        updateBattery();
        battery.addEventListener('levelchange', updateBattery);
        battery.addEventListener('chargingchange', updateBattery);
      }).catch(() => {
        setBatteryInfo(null);
      });
    }

    // Network Information
    // @ts-ignore
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
      const updateConnection = () => {
        setNetworkInfo({
          effectiveType: connection.effectiveType || t.unknown,
          downlink: connection.downlink ? `${connection.downlink} Mbps` : t.unknown,
          rtt: connection.rtt ? `${connection.rtt} ms` : t.unknown,
          saveData: connection.saveData ? t.on : t.off
        });
      };
      updateConnection();
      connection.addEventListener('change', updateConnection);
      return () => connection.removeEventListener('change', updateConnection);
    }
  }, [t.unknown, t.on, t.off]);

  return (
    <div className="relative group w-full h-full">
      <div className="absolute inset-0 bg-white/40 dark:bg-white/5 rounded-[2rem] blur-xl group-hover:blur-2xl transition-all duration-500 opacity-50 dark:opacity-20" />
      <div className="relative p-8 rounded-[2rem] bg-white/40 dark:bg-black/30 backdrop-blur-2xl border border-white/60 dark:border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.05)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] transition-transform duration-300 group-hover:-translate-y-1 h-full flex flex-col">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 bg-white/50 dark:bg-white/10 rounded-2xl shadow-inner border border-white/60 dark:border-white/10 text-neutral-700 dark:text-neutral-200 backdrop-blur-md">
            <Activity size={28} strokeWidth={1.5} />
          </div>
          <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100 flex items-center">
             <Typewriter text={t.connectionStatus} delay={800} />
          </h2>
        </div>

        <div className="flex flex-col space-y-6 flex-grow justify-center">
          {networkInfo ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-2 gap-x-8">
              <InfoRow label={t.networkType} value={networkInfo.effectiveType} icon={<Wifi className="text-blue-500" size={16} />} />
              <InfoRow label={t.downlink} value={networkInfo.downlink} icon={<ArrowDown className="text-emerald-500" size={16} />} />
              <InfoRow label={t.rtt} value={networkInfo.rtt} icon={<SignalHigh className="text-purple-500" size={16} />} />
              <InfoRow label={t.saveData} value={networkInfo.saveData} icon={<Shield className="text-indigo-500" size={16} />} />
            </div>
          ) : (
            <div className="text-sm text-neutral-500 dark:text-neutral-400 italic">
               Network Information API not available.
            </div>
          )}
          
          {batteryInfo && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-2 gap-x-8">
               <InfoRow label={t.batteryLevel} value={batteryInfo.level} icon={<Battery className={batteryInfo.charging ? "text-emerald-500" : "text-amber-500"} size={16} />} />
               <InfoRow label={batteryInfo.charging ? t.charging : t.discharging} value={batteryInfo.charging ? "Yes" : "No"} icon={batteryInfo.charging ? <BatteryCharging className="text-emerald-500" size={16} /> : <Battery className="text-neutral-500" size={16} />} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
