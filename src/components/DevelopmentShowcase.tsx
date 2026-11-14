import{useEffect,useRef,useState,type ChangeEvent,type FormEvent}from'react';
import{ArrowRight,Check,Code2,Eye,FileImage,Globe2,Layers3,LockKeyhole,Monitor,Upload}from'lucide-react';

type DemoDetails={name:string;email:string;company:string;logoName:string;logoData:string};
const STORAGE_KEY='web4-development-demo';
const EMPTY:DemoDetails={name:'',email:'',company:'',logoName:'',logoData:''};
const codeSample=[
'// A simplified look at a client workspace setup',
'// Conceptual preview only. This code is not executed.',
'',
'const workspace = createWorkspace({',
'  // HIGHLIGHTED: who is this workspace for?',
'  name: form.name,',
'  email: form.email,',
'',
'  // HIGHLIGHTED: the organisation behind it',
'  company: form.company,',
'',
'  // HIGHLIGHTED: temporary brand asset',
'  logo: upload.logo, // session-only preview',
'',
'  storage: {',
'    profile: "browser session",',
'    logo: "temporary client-side file"',
'  }',
'});',
'',
'render(<ContentManagementDashboard',
'  workspace={workspace}',
'  theme="web4"',
'  mode="preview"',
'/>);'
].join('\n');
export default function DevelopmentShowcase(){
 const root=useRef<HTMLElement|null>(null);
 const [mode,setMode]=useState<'code'|'preview'>('code');
 const [started,setStarted]=useState(false);
 const [typed,setTyped]=useState(0);
 const [details,setDetails]=useState<DemoDetails>(()=>{try{return {...EMPTY,...JSON.parse(sessionStorage.getItem(STORAGE_KEY)||'{}')}}catch{return EMPTY}});
 const [submitted,setSubmitted]=useState(false);
 const [notice,setNotice]=useState('');
 useEffect(()=>{const node=root.current;if(!node)return;const observer=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)){setStarted(true);observer.disconnect()}},{threshold:.2});observer.observe(node);return()=>observer.disconnect()},[]);
 useEffect(()=>{if(!started)return;const timer=window.setInterval(()=>setTyped(n=>Math.min(n+3,codeSample.length)),12);return()=>window.clearInterval(timer)},[started]);
 const update=(key:keyof DemoDetails,value:string)=>setDetails(old=>({...old,[key]:value}));
 const save=(payload:DemoDetails)=>{try{sessionStorage.setItem(STORAGE_KEY,JSON.stringify(payload));return true}catch{return false}};
 const onLogo=(event:ChangeEvent<HTMLInputElement>)=>{const file=event.target.files?.[0];if(!file)return;if(!file.type.startsWith('image/')){setNotice('Please choose an image file.');return}if(file.size>1_500_000){setNotice('Please use a logo smaller than 1.5 MB for this temporary preview.');return}const reader=new FileReader();reader.onload=()=>{update('logoName',file.name);update('logoData',String(reader.result||''));setNotice('Logo loaded for this browser session.')};reader.onerror=()=>setNotice('The logo could not be read. Try another file.');reader.readAsDataURL(file)};
 const submit=(event:FormEvent<HTMLFormElement>)=>{event.preventDefault();if(save(details)){setSubmitted(true);setNotice('Preview details saved in this browser session.')}else setNotice('Browser storage is full. Remove the logo or use a smaller file and try again.')};
 const makeReal=()=>{save(details);sessionStorage.setItem('web4-development-handoff',JSON.stringify({...details,service:'Digital development'}));window.location.hash='#/contact'};
 const lines=codeSample.slice(0,typed).split('\n');
 return <section ref={root} className="dev-showcase" aria-label="Digital development interactive demonstration">
  <div className="dev-showcase-heading"><div><div className="eyebrow"><i/> A CLOSER LOOK / 01</div><h2>From first line<br/><em>to working experience.</em></h2></div><p>We turn an idea into a useful digital product. Here's a small interactive demonstration of how a project can take shape.</p></div>
  <div className="dev-demo-shell glass-panel">
   <div className="dev-demo-toolbar"><div className="dev-window-dots"><i/><i/><i/></div><span>WEB4 / DIGITAL DEVELOPMENT LAB</span><div className="dev-mode-switch"><button type="button" className={mode==='code'?'active':''} onClick={()=>setMode('code')}><Code2 size={13}/> Code</button><button type="button" className={mode==='preview'?'active':''} onClick={()=>setMode('preview')}><Eye size={13}/> Preview</button></div></div>
   {mode==='code'?<div className="dev-code-view"><div className="dev-code-sidebar"><span>EXPLORER</span><b><Layers3 size={13}/> workspace</b><small>setup.tsx</small><small>dashboard.tsx</small><small>theme.css</small><div className="dev-code-status"><span/><small>{started?'WRITING PREVIEW':'SCROLL TO START'}</small></div></div><div className="dev-code-editor"><div className="dev-code-file"><Code2 size={13}/> setup.tsx <span>TSX</span></div><pre aria-label="Decorative code being typed"><code>{lines.map((line,i)=><div key={i} className={/name:|email:|company:|logo:/.test(line)?'highlight-line':''}><span className="dev-line-no">{String(i+1).padStart(2,'0')}</span>{line||' '}</div>)}{typed<codeSample.length&&<span className="dev-caret"/>}</code></pre><div className="dev-code-footer"><span>● {typed>=codeSample.length?'PREVIEW READY':'BUILDING THE EXPERIENCE'}</span><span>{Math.round(typed/codeSample.length*100)}%</span></div></div></div>:<div className="dev-preview-view"><div className="dev-preview-intro"><div className="eyebrow"><i/> INTERACTIVE CONCEPT</div><h3>Build your workspace preview.</h3><p>Enter a few details and see how they could appear in a simple content management workspace.</p><form className="dev-onboarding-form" onSubmit={submit}><label>Your name<input required value={details.name} onChange={e=>update('name',e.target.value)} placeholder="e.g. Alex Morgan"/></label><label>Email address<input required type="email" value={details.email} onChange={e=>update('email',e.target.value)} placeholder="you@company.com"/></label><label>Company name<input required value={details.company} onChange={e=>update('company',e.target.value)} placeholder="Your organisation"/></label><label className="dev-upload-label">Company logo<span className="dev-upload-control"><Upload size={15}/>{details.logoName||'Choose an image'}<input type="file" accept="image/*" onChange={onLogo}/></span><small>Used only in this browser preview. Not uploaded to a Web4 server.</small></label><button className="button button-light dev-submit" type="submit">Generate preview <ArrowRight size={14}/></button>{notice&&<p className="dev-notice" role="status">{notice}</p>}</form></div><div className="dev-cms-preview"><div className="dev-cms-top"><div className="dev-cms-brand">{details.logoData?<img src={details.logoData} alt="Company logo"/>:<span className="dev-cms-brand-placeholder">{details.company?details.company.slice(0,1).toUpperCase():'C'}</span>}<b>{details.company||'Your workspace'}</b></div><span>CONTENT STUDIO <i/></span></div><div className="dev-cms-body"><aside><span className="selected"><Monitor size={13}/> Overview</span><span><FileImage size={13}/> Media library</span><span><Globe2 size={13}/> Pages</span><span><Layers3 size={13}/> Collections</span></aside><div className="dev-cms-main"><small>WORKSPACE / OVERVIEW</small><h4>{details.name?'Welcome, '+details.name.split(' ')[0]:'Your content, organised.'}</h4><p>{details.email||'A clear place to manage your digital presence.'}</p><div className="dev-cms-metrics"><div><small>PUBLISHED PAGES</small><b>08</b></div><div><small>MEDIA ASSETS</small><b>24</b></div><div><small>COLLECTIONS</small><b>03</b></div></div><div className="dev-cms-content"><b>Recent content</b><span><i/> Homepage <small>Published</small></span><span><i/> About us <small>Draft</small></span><span><i/> Services <small>Published</small></span></div>{submitted&&<div className="dev-cms-ready"><Check size={13}/> PREVIEW PERSONALIZED</div>}</div></div>{submitted&&<button type="button" className="dev-make-real" onClick={makeReal}>Make it real <ArrowRight size={14}/></button>}</div></div>}
  </div>
  <div className="dev-demo-foot"><span><LockKeyhole size={12}/> YOUR DETAILS STAY IN THIS BROWSER SESSION</span><span>CONCEPTUAL DEMO / NOT A LIVE CMS</span></div>
 </section>
}