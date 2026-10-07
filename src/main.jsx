import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import QRCode from 'qrcode';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowRight, Check, Download, Info, QrCode, RotateCcw, ShieldCheck, UserRound, WifiOff } from 'lucide-react';
import './style.css';

const fields = [
  ['name', 'Nombre completo', 'Como aparece en tu identificacion', true, 'text', true],
  ['birthDate', 'Fecha de nacimiento', '', false, 'date'],
  ['bloodType', 'Tipo de sangre', '', false, 'select'],
  ['contact', 'Contacto de emergencia 1', 'Nombre de la persona a contactar', true, 'text'],
  ['phone', 'Telefono de emergencia 1', 'Codigo de pais, ej. +52', true, 'tel'],
  ['contact2', 'Contacto de emergencia 2', 'Nombre de otro contacto', false, 'text'],
  ['phone2', 'Telefono de emergencia 2', 'Codigo de pais, ej. +52', false, 'tel'],
  ['allergies', 'Alergias', 'Medicamentos, alimentos u otras alergias', false, 'textarea', true],
  ['conditions', 'Condiciones medicas', 'Informacion relevante en una emergencia', false, 'textarea', true],
  ['medications', 'Medicamentos', 'Nombre y dosis, si aplica', false, 'textarea', true],
  ['notes', 'Notas', 'Otros datos utiles en una emergencia', false, 'textarea', true],
];
const empty = Object.fromEntries(fields.map(([key]) => [key, '']));
const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'No lo se'];
function localToday() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}
const today = localToday();
const formSchema = z.object(Object.fromEntries(fields.map(([key,label,,required,type]) => {
  let rule = z.string().trim().max(type==='textarea'?200:type==='tel'?40:100, 'Reduce la cantidad de texto.');
  if (required) rule = rule.min(1, `Completa ${label.toLowerCase()}.`);
  if (type==='select') rule = rule.refine(value => value==='' || bloodTypes.includes(value), 'Selecciona un tipo de sangre valido.');
  if (type==='date') rule = rule.refine(value => {
    if (!value) return true;
    const date = new Date(`${value}T00:00:00Z`);
    return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(date.getTime()) && date.toISOString().slice(0,10)===value && value<=localToday();
  }, 'Ingresa una fecha de nacimiento valida que no sea futura.');
  return [key, rule];
})));
function payload(data) {
  return ['INFORMACION DE EMERGENCIA', ...fields.filter(([key]) => data[key].trim()).map(([key, label]) => `${label}: ${data[key].trim()}`)].join('\n');
}
function App() {
  const { register, handleSubmit, reset, setFocus, formState: { errors, isSubmitting } } = useForm({ defaultValues: empty, resolver: zodResolver(formSchema) });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [downloaded, setDownloaded] = useState(false);
  async function generate(data) {
    setError('');
    try {
      const image = await QRCode.toDataURL(payload(data), { width: 1200, margin: 4, errorCorrectionLevel: 'M', color: { dark: '#000000', light: '#ffffff' } });
      setResult({ image, data: { ...data } }); setDownloaded(false);
    } catch { setError('No pudimos crear el QR. Reduce la cantidad de texto e intentalo de nuevo.'); }
  }
  function clear() { reset(empty); setResult(null); setError(''); setDownloaded(false); setFocus('name'); }
  function download() {
    const link = document.createElement('a'); link.href = result.image; link.download = 'comit-qr-emergencia.png'; link.click(); setDownloaded(true);
  }
  return <>
    <header className="bg-black text-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-2 sm:px-8">
        <a href="#" aria-label="Comit, inicio"><img src="/logo_rosa.png" alt="Comit Cycling Collective" className="h-16 w-16 object-contain"/></a>
        <span className="text-sm font-semibold italic tracking-wide">Nobody Rides Alone<span className="text-pink">.</span></span>
      </div>
    </header>
    <main>
      <section id="formulario" className="mx-auto max-w-5xl px-5 py-7 sm:px-8 sm:py-9">
        <div className="mb-6"><h1 className="display text-3xl text-black sm:text-4xl">Tu QR de emergencia</h1><p className="mt-2 text-sm leading-6 text-muted">Completa tus datos, genera tu QR y llevalo en cada rodada.</p></div>
        <div className="grid items-start gap-6 lg:grid-cols-[1.35fr_1fr]">
          <form noValidate onSubmit={handleSubmit(generate)} className="rounded-xl border border-stone-200 bg-white p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-3"><span className="rounded-lg bg-cream p-2.5 text-black"><UserRound size={20}/></span><div><h3 className="font-bold text-black">Datos de emergencia</h3><p className="mt-1 text-xs text-muted">Nombre y primer contacto con telefono son obligatorios. El resto es opcional.</p></div></div>
            <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">{fields.map(([key,label,placeholder,required,type,fullWidth])=>{
              const common = { id: key, ...register(key, { onChange: () => { setResult(null); setError(''); } }), required, 'aria-invalid': !!errors[key], 'aria-describedby': errors[key] ? `${key}-error` : undefined };
              return <div key={key} className={fullWidth ? 'sm:col-span-2' : ''}>
                <label htmlFor={key} className="mb-2 flex items-center justify-between text-xs font-semibold text-black"><span>{label}{required && <span className="ml-1">*</span>}</span>{!required && <span className="text-[10px] font-normal text-muted">Opcional</span>}</label>
                {type==='select' ? <select {...common}><option value="">Selecciona una opcion</option>{bloodTypes.map(value=><option key={value} value={value}>{value}</option>)}</select>
                  : type==='textarea' ? <textarea {...common} maxLength={200} rows={2} placeholder={placeholder}/>
                  : <input {...common} type={type} max={type==='date'?today:undefined} maxLength={type==='tel'?40:100} autoComplete="off" placeholder={placeholder}/>}
                {errors[key] && <p id={`${key}-error`} role="alert" className="mt-1.5 text-xs text-pink">{errors[key].message}</p>}
              </div>;
            })}</div>
            <div className="mt-6 flex gap-2.5 rounded-lg bg-cream p-3 text-xs leading-5 text-muted"><Info size={16} className="mt-0.5 shrink-0 text-black"/><p>Cuanta mas informacion relevante y actualizada compartas, mejor podra un paramedico conocer tu situacion en una emergencia. Incluye alergias, condiciones medicas y medicamentos si los conoces. Los campos vacios no apareceran en tu QR.</p></div>
            {error && <p role="alert" className="mt-3 text-sm text-pink">{error}</p>}
            <div className="mt-6 flex flex-wrap gap-3"><button disabled={isSubmitting} className="primary flex flex-1 items-center justify-center gap-2 rounded-lg px-5 py-3.5 text-sm font-bold"><QrCode size={18}/>{isSubmitting?'Generando…':'Generar mi QR'}<ArrowRight size={17} className="ml-auto"/></button><button type="button" onClick={clear} className="flex items-center justify-center gap-2 rounded-lg border border-stone-200 px-4 py-3 text-xs font-semibold text-muted hover:bg-cream"><RotateCcw size={14}/> Limpiar</button></div>
          </form>
          <div className="space-y-5">
            <section className="overflow-hidden rounded-xl border border-stone-200 bg-white" aria-label="Resultado del QR" aria-live="polite"><div className="flex items-center justify-between border-b border-stone-100 px-6 py-5"><h3 className="font-bold text-black">Tu QR de emergencia</h3><span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${result?'bg-pink/10 text-black':'bg-cream text-muted'}`}>{result?'Listo para llevar':'Vista previa'}</span></div><div className="px-6 py-7 text-center">
              {result ? <><img src={result.image} alt="Codigo QR con tus datos de emergencia" className="mx-auto aspect-square w-60 max-w-full"/><h4 className="mt-3 font-bold text-black">{result.data.name}</h4><p className="mt-2 text-xs leading-5 text-muted">Escanealo para comprobar tus datos antes de salir.</p><button onClick={download} className="primary mt-5 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3.5 text-sm font-bold"><Download size={17}/> Descargar QR en PNG</button><p className="mt-3 flex items-center justify-center gap-1 text-[11px] text-muted">{downloaded ? <><Check size={13}/> Descarga iniciada</> : 'Imagen de alta resolucion · 1200 × 1200 px'}</p><details className="mt-5 text-left"><summary className="cursor-pointer text-xs font-semibold text-black">Revisar los datos incluidos</summary><pre className="mt-3 whitespace-pre-wrap break-words rounded-lg bg-cream p-3 font-sans text-xs leading-6 text-muted">{payload(result.data)}</pre></details></> : <><div className="qr-placeholder mx-auto flex h-48 w-48 items-center justify-center rounded-xl border border-dashed border-stone-300 bg-cream"><QrCode size={110} strokeWidth={1} className="text-stone-300"/></div><h4 className="mt-6 text-sm font-semibold text-black">Tu QR aparecera aqui.</h4><p className="mx-auto mt-2 max-w-64 text-xs leading-6 text-muted">Genera tu codigo y descargalo para llevarlo contigo.</p><div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-muted"><Download size={14}/> Descarga en formato PNG</div></>}
              <div className="mt-5 rounded-lg bg-cream p-3 text-xs leading-5 text-muted"><p className="flex items-center justify-center gap-2 font-semibold text-black"><WifiOff size={15}/> Consulta sin internet</p><p className="mt-1">Los datos estan dentro del QR. Puedes leerlos con un lector QR sin conexion a internet.</p></div>
            </div></section>
            <div className="rounded-xl border border-black/10 bg-white p-5"><div className="mb-2 flex items-center gap-2 text-sm font-bold text-black"><ShieldCheck size={18}/> Tu privacidad va primero</div><p className="text-xs leading-6 text-black/75">No guardamos ni enviamos tu informacion. El QR se genera en tu navegador y tus datos se borran al recargar o cerrar la pagina.</p><p className="mt-3 border-t border-black/10 pt-3 text-xs leading-5 text-black/75"><strong>Compartelo con cuidado:</strong> cualquiera que escanee tu QR podra leer la informacion que incluyas. La imagen descargada conserva esos datos.</p></div>
          </div>
        </div>
      </section>
    </main>
    <footer className="border-t border-black/10"><div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-5 py-4 text-xs text-muted sm:px-8"><span><strong className="text-black">Comit</strong> Cycling Collective</span><span>Nobody Rides Alone.</span></div></footer>
  </>;
}
createRoot(document.getElementById('root')).render(<App/>);
