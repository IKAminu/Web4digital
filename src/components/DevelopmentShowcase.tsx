import{useEffect,useRef,useState,type ChangeEvent}from'react';
import{ArrowRight,Check,Code2,Eye,FileImage,Globe2,Layers3,LockKeyhole,Monitor,Upload}from'lucide-react';

type DemoDetails={name:string;email:string;company:string;logoName:string;logoData:string};
const STORAGE_KEY='web4-development-demo';
const EMPTY:DemoDetails={name:'',email:'',company:'',logoName:'',logoData:''};

export default function DevelopmentShowcase(){
 const root=useRef<HTMLElement|null>(null);
 const [mode,setMode]=useState<'code'|'preview'>('code');
 const [started,setStarted]=useState(false);
 const [typed,setTyped]=useState(0);
 const [details,setDetails]=useState<DemoDetails>(()=>{try{return {...EMPTY,...JSON.parse(sessionStorage.getItem(STORAGE_KEY)||'{}')}}catch{return EMPTY}});
 const [notice,setNotice]=useState('');
 const codeIntro='// Add your details below to configure this workspace';
 useEffect(()=>{const node=root.current;if(!node)return;const observer=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)){setStarted(true);observer.disconnect()}},{threshold:.2});observer.observe(node);return()=>observer.disconnect()},[]);
 useEffect(()=>{if(!started)return;const timer=window.setInterval(()=>setTyped(n=>Math.min(n+2,codeIntro.length)),18);return()=>window.clearInterval(timer)},[started]);
 const update=(key:keyof DemoDetails,value:string)=>setDetails(old=>{const next={...old,[key]:value};try{sessionStorage.setItem(STORAGE_KEY,JSON.stringify(next))}catch{}return next});
 const onLogo=(event:ChangeEvent<HTMLInputElement>)=>{const file=event.target.files?.[0];if(!file)return;if(!file.type.startsWith('image/')){setNotice('Choose an image file for your logo.');return}if(file.size>1_500_000){setNotice('Use a logo smaller than 1.5 MB for this temporary preview.');return}const reader=new FileReader();reader.onload=()=>{setDetails(old=>{const next={...old,logoName:file.name,logoData:String(reader.result||'')};try{sessionStorage.setItem(STORAGE_KEY,JSON.stringify(next))}catch{}return next});setNotice('Logo loaded into the preview.')};reader.onerror=()=>setNotice('The logo could not be read. Try another file.');reader.readAsDataURL(file)};
 const makeReal=()=>{try{sessionStorage.setItem('web4-development-handoff',JSON.stringify({...details,service:'Digital development'}))}catch{}window.location.hash='#/contact'};
 const lines=codeIntro.slice(0,typed);
 return <section ref={root} className="dev-showcase" aria-label="Digital development interactive demonstration">
  <div className="dev-showcase-heading"><div><div className="eyebrow"><i/> A CLOSER LOOK / 01</div><h2>From first line<br/><em>to working experience.</em></h2></div><p>Fill in the highlighted values directly inside the code preview. Switch to Preview and the workspace will be personalised with the same details.</p></div>
  <div className="dev-demo-shell glass-panel">
   <div className="dev-demo-toolbar"><div className="dev-window-dots"><i/><i/><i/></div><span>WEB4 / DIGITAL DEVELOPMENT LAB</span><div className="dev-mode-switch"><button type="button" className={mode==='code'?'active':''} onClick={()=>setMode('code')}><Code2 size={13}/> Code</button><button type="button" className={mode==='preview'?'active':''} onClick={()=>setMode('preview')}><Eye size={13}/> Preview</button></div></div>
   {mode==='code'?<div className="dev-code-view"><div className="dev-code-sidebar"><span>EXPLORER</span><b><Layers3 size={13}/> workspace</b><small>setup.tsx</small><small>dashboard.tsx</small><small>theme.css</small><div className="dev-code-status"><span/><small>EDIT WORKSPACE DETAILS</small></div></div><div className="dev-code-editor"><div className="dev-code-file"><Code2 size={13}/> setup.tsx <span>TSX</span></div><div className="dev-editable-code">
    <div className="dev-code-comment"><span className="dev-line-no">01</span>{lines||codeIntro}</div>
    <div className="dev-code-object"><span className="dev-line-no">02</span><span className="dev-code-token">const workspace = {'{'}</span></div>
    <label className="dev-code-input-row"><span className="dev-line-no">03</span><span className="dev-code-key">name:</span><input aria-label="Your name" value={details.name} onChange={e=>update('name',e.target.value)} placeholder="ENTER YOUR NAME"/><span className="dev-code-comma">,</span><b>YOUR NAME</b></label>
    <label className="dev-code-input-row"><span className="dev-line-no">04</span><span className="dev-code-key">email:</span><input aria-label="Email address" type="email" value={details.email} onChange={e=>update('email',e.target.value)} placeholder="ENTER YOUR EMAIL ADDRESS"/><span className="dev-code-comma">,</span><b>EMAIL ADDRESS</b></label>
    <label className="dev-code-input-row"><span className="dev-line-no">05</span><span className="dev-code-key">company:</span><input aria-label="Company name" value={details.company} onChange={e=>update('company',e.target.value)} placeholder="ENTER YOUR COMPANY NAME"/><span className="dev-code-comma">,</span><b>COMPANY NAME</b></label>
    <div className="dev-code-input-row dev-code-logo-row"><span className="dev-line-no">06</span><span className="dev-code-key">logo:</span><label className="dev-code-upload"><Upload size={13}/>{details.logoName||'UPLOAD YOUR COMPANY LOGO'}<input aria-label="Upload company logo" type="file" accept="image/*" onChange={onLogo}/></label><span className="dev-code-comma">,</span><b>COMPANY LOGO</b></div>
    <div className="dev-code-object"><span className="dev-line-no">07</span><span className="dev-code-token">{'}'};</span></div>
    <div className="dev-code-object dev-code-render"><span className="dev-line-no">08</span><span className="dev-code-token">render( workspace );</span></div>
    <div className="dev-code-helper"><LockKeyhole size={12}/> Values update the preview instantly. Details stay in this browser session.</div>
    {notice&&<p className="dev-notice" role="status">{notice}</p>}
   </div><div className="dev-code-footer"><span>● LIVE DATA BINDING</span><span>{Object.values(details).filter(Boolean).length}/5 VALUES</span></div></div></div>:<div className="dev-preview-full"><div className="dev-cms-preview"><div className="dev-cms-top"><div className="dev-cms-brand">{details.logoData?<img src={details.logoData} alt="Company logo"/>:<span className="dev-cms-brand-placeholder">{details.company?details.company.slice(0,1).toUpperCase():'W'}</span>}<b>{details.company||'Your company workspace'}</b></div><span>CONTENT STUDIO <i/></span></div><div className="dev-cms-body"><aside><span className="selected"><Monitor size={13}/> Overview</span><span><FileImage size={13}/> Media library</span><span><Globe2 size={13}/> Pages</span><span><Layers3 size={13}/> Collections</span></aside><div className="dev-cms-main"><small>WORKSPACE / OVERVIEW</small><h4>{details.name?'Welcome, '+details.name.split(' ')[0]:'Your content, organised.'}</h4><p>{details.email||'Your email address will appear here.'}</p><div className="dev-cms-metrics"><div><small>PUBLISHED PAGES</small><b>08</b></div><div><small>MEDIA ASSETS</small><b>24</b></div><div><small>COLLECTIONS</small><b>03</b></div></div><div className="dev-cms-content"><b>Recent content</b><span><i/> Homepage <small>Published</small></span><span><i/> About us <small>Draft</small></span><span><i/> Services <small>Published</small></span></div><div className="dev-cms-personalized"><Check size={14}/> Preview uses the details entered in Code</div></div></div><div className="dev-preview-actions"><span><LockKeyhole size={12}/> CONCEPT ONLY / NO LIVE DATA SENT</span><button type="button" onClick={makeReal}>Make it real <ArrowRight size={14}/></button></div></div></div>}
  </div>
  <div className="dev-demo-foot"><span><LockKeyhole size={12}/> YOUR DETAILS STAY IN THIS BROWSER SESSION</span><span>CONCEPTUAL DEMO / NOT A LIVE CMS</span></div>
 </section>
}
