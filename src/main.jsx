import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import QRCode from 'qrcode';
import { ArrowDown, ArrowRight, Bike, Check, CheckCircle2, Download, HeartPulse, Info, LockKeyhole, Pencil, QrCode, RotateCcw, ShieldCheck, UserRound } from 'lucide-react';
import './style.css';

const empty = { name: '', contact: '', phone: '', allergies: '', conditions: '', medications: '' };
const fields = [
  ['name', 'Nombre completo', 'Como aparece en tu identificación', true],
  ['contact', 'Contacto de emergencia', 'Nombre de la persona a contactar'],
  ['phone', 'Teléfono de emergencia', 'Incluye el código de país, ej. +52'],
  ['allergies', 'Alergias', 'Medicamentos, alimentos u otras alergias'],
  ['conditions', 'Condiciones médicas', 'Información relevante en una emergencia'],
  ['medications', 'Medicamentos', 'Nombre y dosis, si aplica'],
];
function payload(data) {
  return ['INFORMACIÓN DE EMERGENCIA', ...fields.filter(([key]) => data[key].trim()).map(([key, label]) => `${label}: ${data[key].trim()}`)].join('\n');
}
function App() {
  const [data, setData] = useState(empty);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  async function generate(event) {
    event.preventDefault();
    if (!data.name.trim()) { setError('Escribe tu nombre para crear el QR.'); document.getElementById('name').focus(); return; }
    setBusy(true); setError('');
    try {
      const image = await QRCode.toDataURL(payload(data), { width: 1200, margin: 4, errorCorrectionLevel: 'M', color: { dark: '#112a25', light: '#ffffff' } });
      setResult({ image, data: { ...data } }); setDownloaded(false);
    } catch { setError('No pudimos crear el QR. Reduce la cantidad de texto e inténtalo de nuevo.'); }
    finally { setBusy(false); }
  }
  function clear() { setData({ ...empty }); setResult(null); setError(''); setDownloaded(false); document.getElementById('name').focus(); }
  function download() {
    const link = document.createElement('a'); link.href = result.image; link.download = 'commit-qr-emergencia.png'; link.click(); setDownloaded(true);
  }
  return <>
    <header className="border-b border-white/10 bg-forest text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-12">
        <a href="#" aria-label="Commit, inicio" className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-lime text-forest"><Bike size={25}/></span><div><span className="brand block text-2xl leading-none">commit<span className="text-lime">.</span></span><span className="text-[9px] font-semibold uppercase tracking-[.25em] text-white/60">Cycling collective</span></div></a>
        <span className="flex items-center gap-2 text-xs text-white/75"><ShieldCheck size={16} className="text-lime"/><span className="hidden sm:inline">Tu seguridad también rueda contigo</span><span className="sm:hidden">Rodamos seguros</span></span>
      </div>
    </header>
    <main>
      <section className="relative overflow-hidden bg-forest text-white">
        <div className="road-art" aria-hidden="true"><div/><div/><div/></div>
        <div className="relative mx-auto grid max-w-7xl gap-8 px-6 pb-14 pt-12 lg:grid-cols-[1.35fr_1fr] lg:px-12 lg:pb-16 lg:pt-14">
          <div><div className="mb-5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.18em] text-lime"><span className="h-1.5 w-1.5 rounded-full bg-lime"/> Preparados para cada kilómetro</div>
            <h1 className="display max-w-xl text-5xl leading-[1.02] sm:text-6xl">Tú disfruta la ruta.<br/><span className="text-lime">Lleva tu tranquilidad.</span></h1>
            <p className="mt-6 max-w-lg text-sm leading-7 text-white/70 sm:text-base">Convierte tus datos de emergencia en un QR que puedes llevar contigo. Una pequeña acción antes de salir, una gran ayuda cuando importa.</p>
            <a href="#formulario" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-lime">Crea tu QR de emergencia <ArrowDown size={16}/></a>
          </div>
          <div className="relative hidden items-center justify-center lg:flex" aria-hidden="true">
            <div className="hero-card"><div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest"><span>Commit / Ride safe</span><HeartPulse size={18}/></div><div className="mt-5 flex gap-5"><div className="flex h-24 w-24 items-center justify-center rounded-lg bg-white text-forest"><QrCode size={78} strokeWidth={1.4}/></div><div className="pt-2"><div className="display text-2xl">Cada ruta.<br/>Más tranquilidad.</div><div className="mt-3 flex items-center gap-1 text-[10px] text-forest/60"><ShieldCheck size={13}/> Información de emergencia</div></div></div><div className="mt-5 border-t border-forest/15 pt-3 text-[9px] uppercase tracking-[.2em]">Llévalo contigo. Rueda con confianza.</div></div>
            <span className="absolute bottom-0 right-5 flex items-center gap-2 rounded-full border border-white/15 bg-forest px-4 py-2 text-xs text-white/80"><LockKeyhole size={13} className="text-lime"/> 100% en tu navegador</span>
          </div>
        </div>
      </section>
      <div className="border-b border-stone-200 bg-white"><div className="mx-auto grid max-w-7xl grid-cols-1 gap-3 px-6 py-5 text-xs font-medium text-forest sm:grid-cols-3 lg:px-12">{[[Pencil,'Completa tus datos'],[QrCode,'Genera tu QR'],[Download,'Descárgalo y llévalo contigo']].map(([Icon,label],i)=><div key={label} className="flex items-center gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cream text-xs font-bold">0{i+1}</span><Icon size={16}/><span>{label}</span></div>)}</div></div>
      <section id="formulario" className="mx-auto max-w-7xl scroll-mt-6 px-6 py-10 lg:px-12 lg:py-12">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-3"><div><p className="mb-2 text-[10px] font-bold uppercase tracking-[.2em] text-muted">Tu compañero de ruta</p><h2 className="display text-3xl text-forest">Tu información, a la mano.</h2></div><span className="flex items-center gap-1.5 text-xs text-muted"><LockKeyhole size={13}/> Sin registros. Sin base de datos.</span></div>
        <div className="grid items-start gap-6 lg:grid-cols-[1.35fr_1fr]">
          <form onSubmit={generate} className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3"><span className="rounded-lg bg-cream p-2.5 text-forest"><UserRound size={20}/></span><div><h3 className="font-bold text-forest">Datos de emergencia</h3><p className="mt-1 text-xs text-muted">Solo el nombre es obligatorio. Tú decides qué compartir.</p></div></div>
            <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">{fields.map(([key,label,placeholder,required],i)=><div key={key} className={i===0 || i>2 ? 'sm:col-span-2' : ''}><label htmlFor={key} className="mb-2 flex items-center justify-between text-xs font-semibold text-forest"><span>{label}{required && <span className="ml-1 text-forest">*</span>}</span>{!required && <span className="text-[10px] font-normal text-muted">Opcional</span>}</label>{i>2 ? <textarea id={key} maxLength={250} rows={2} placeholder={placeholder} value={data[key]} onChange={e=>{setData({...data,[key]:e.target.value});setResult(null);}}/> : <input id={key} type={key==='phone'?'tel':'text'} required={required} maxLength={key==='phone'?40:100} autoComplete="off" placeholder={placeholder} value={data[key]} onChange={e=>{setData({...data,[key]:e.target.value});setResult(null);}}/>}</div>)}</div>
            <div className="mt-6 flex gap-2.5 rounded-lg bg-cream p-3 text-xs leading-5 text-muted"><Info size={16} className="mt-0.5 shrink-0 text-forest"/><p>Incluye únicamente información útil en una emergencia. Si dejas un campo vacío, no aparecerá en tu QR.</p></div>
            {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
            <div className="mt-6 flex flex-wrap gap-3"><button disabled={busy} className="primary flex flex-1 items-center justify-center gap-2 rounded-lg px-5 py-3.5 text-sm font-bold"><QrCode size={18}/>{busy?'Generando…':'Generar mi QR'}<ArrowRight size={17} className="ml-auto"/></button><button type="button" onClick={clear} className="flex items-center justify-center gap-2 rounded-lg border border-stone-200 px-4 py-3 text-xs font-semibold text-muted hover:bg-cream"><RotateCcw size={14}/> Limpiar</button></div>
          </form>
          <div className="space-y-5">
            <section className="overflow-hidden rounded-2xl border border-stone-200 bg-white" aria-label="Resultado del QR" aria-live="polite"><div className="flex items-center justify-between border-b border-stone-100 px-6 py-5"><h3 className="font-bold text-forest">Tu QR de emergencia</h3><span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${result?'bg-lime/40 text-forest':'bg-cream text-muted'}`}>{result?'Listo para llevar':'Vista previa'}</span></div><div className="px-6 py-7 text-center">
              {result ? <><img src={result.image} alt="Código QR con tus datos de emergencia" className="mx-auto aspect-square w-60 max-w-full"/><h4 className="mt-3 font-bold text-forest">{result.data.name}</h4><p className="mt-2 text-xs leading-5 text-muted">Escanéalo para comprobar tus datos antes de salir.</p><button onClick={download} className="primary mt-5 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3.5 text-sm font-bold"><Download size={17}/> Descargar QR en PNG</button><p className="mt-3 flex items-center justify-center gap-1 text-[11px] text-muted">{downloaded ? <><Check size={13}/> Descarga iniciada</> : 'Imagen de alta resolución · 1200 × 1200 px'}</p><details className="mt-5 text-left"><summary className="cursor-pointer text-xs font-semibold text-forest">Revisar los datos incluidos</summary><pre className="mt-3 whitespace-pre-wrap break-words rounded-lg bg-cream p-3 font-sans text-xs leading-6 text-muted">{payload(result.data)}</pre></details></> : <><div className="qr-placeholder mx-auto flex h-48 w-48 items-center justify-center rounded-xl border border-dashed border-stone-300 bg-cream"><QrCode size={110} strokeWidth={1} className="text-stone-300"/></div><h4 className="mt-6 text-sm font-semibold text-forest">Un QR, más tranquilidad.</h4><p className="mx-auto mt-2 max-w-64 text-xs leading-6 text-muted">Completa el formulario y tu código aparecerá aquí, listo para descargar.</p><div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-muted"><Download size={14}/> Descarga en formato PNG</div></>}
            </div></section>
            <div className="rounded-xl border border-forest/10 bg-[#eaf0e8] p-5"><div className="mb-2 flex items-center gap-2 text-sm font-bold text-forest"><ShieldCheck size={18}/> Tu privacidad va primero</div><p className="text-xs leading-6 text-forest/75">No guardamos ni enviamos tu información. El QR se genera en tu navegador y tus datos se borran al recargar o cerrar la página.</p><p className="mt-3 border-t border-forest/10 pt-3 text-xs leading-5 text-forest/75"><strong>Compártelo con cuidado:</strong> cualquiera que escanee tu QR podrá leer la información que incluyas. La imagen descargada conserva esos datos.</p></div>
            <div className="flex gap-3 px-1 text-xs leading-6 text-muted"><Bike size={20} className="mt-1 shrink-0 text-forest"/><p><strong className="text-forest">Hazlo parte de tu equipo.</strong> Guárdalo en tu teléfono o imprímelo y llévalo en tu casco, bicicleta o cartera.</p></div>
          </div>
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[11px] text-muted">{['Sin crear una cuenta','Sin conexión al escanear','Hecho para acompañarte'].map(t=><span key={t} className="flex items-center gap-2"><CheckCircle2 size={14} className="text-forest"/>{t}</span>)}</div>
      </section>
    </main>
    <footer className="border-t border-stone-200"><div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-6 text-[11px] text-muted sm:flex-row lg:px-12"><span><strong className="text-forest">commit.</strong> Cycling collective</span><span>Rodamos juntos. Nos cuidamos juntos.</span><span className="flex items-center gap-1.5"><HeartPulse size={13}/> Cada kilómetro cuenta.</span></div></footer>
  </>;
}
createRoot(document.getElementById('root')).render(<App/>);
