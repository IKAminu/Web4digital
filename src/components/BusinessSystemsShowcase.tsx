import{useEffect,useState}from'react';
import{Activity,ArrowDown,ArrowDownRight,ArrowRight,BarChart3,Bot,Check,CheckCircle2,ChevronRight,CircleDot,ClipboardCheck,Database,Globe2,Mail,Megaphone,MessageCircle,MousePointerClick,PackageCheck,RefreshCw,ShoppingCart,Users,Wallet,Workflow,Zap}from'lucide-react';

const nodes=[
 {id:'ads',number:'01',title:'Campaigns & ads',kind:'ACQUISITION',icon:Megaphone,detail:'Campaigns bring the right people into the business through paid advertising, landing pages and clear offers.',tasks:['Campaign and creative published','Audience begins engaging','Traffic reaches the landing page'],output:'New visitor captured'},
 {id:'website',number:'02',title:'Website & landing page',kind:'DIGITAL FRONT DOOR',icon:Globe2,detail:'A focused website or landing page explains the offer, builds trust and gives visitors a clear next step.',tasks:['Offer and service information displayed','Enquiry form or chat opened','Visitor submits their details'],output:'Enquiry submitted'},
 {id:'engage',number:'03',title:'Engagement automation',kind:'CONVERSATION',icon:MessageCircle,detail:'Chat and messaging automations acknowledge enquiries, collect missing details and route conversations to the right place.',tasks:['Instant acknowledgement sent','Customer details collected','Conversation routed for follow-up'],output:'Lead profile created'},
 {id:'crm',number:'04',title:'Central CRM',kind:'SOURCE OF TRUTH',icon:Database,detail:'The CRM keeps customer records, enquiry history and pipeline status organised so the team can see what needs attention.',tasks:['Contact record created or updated','Lead source and interest tagged','Owner and next action assigned'],output:'Lead organised'},
 {id:'qualify',number:'05',title:'Qualification & follow-up',kind:'DECISION POINT',icon:ClipboardCheck,detail:'Rules and sales agents determine what happens next: immediate sales attention, a scheduled follow-up or a nurture sequence.',tasks:['Enquiry checked against criteria','Priority and next action determined','Follow-up scheduled where needed'],output:'Lead ready for sales'},
 {id:'sales',number:'06',title:'Sales & payment',kind:'CONVERSION',icon:Wallet,detail:'The sales process keeps quotes, proposals, approvals and payment updates connected to the customer record.',tasks:['Quote or proposal prepared','Sales follow-up recorded','Payment or order confirmation logged'],output:'Sale confirmed'},
 {id:'delivery',number:'07',title:'Operations & delivery',kind:'FULFILMENT',icon:PackageCheck,detail:'Once the sale is confirmed, the system can create tasks, notify the team and track the work required to deliver.',tasks:['Fulfilment task created','Team member notified','Delivery progress recorded'],output:'Service delivered'},
 {id:'insights',number:'08',title:'Analytics & retention',kind:'CONTINUOUS IMPROVEMENT',icon:BarChart3,detail:'Reporting connects campaign performance, conversion, revenue and customer activity. Insights help improve the next cycle.',tasks:['Performance data brought together','Results and bottlenecks reviewed','Insights feed the next campaign'],output:'Next cycle improved'}
];
const agents=[{name:'Marketing agent',sub:'Campaigns & acquisition',icon:Megaphone},{name:'Engagement agent',sub:'Enquiries & conversations',icon:MessageCircle},{name:'Sales agent',sub:'Qualification & conversion',icon:Bot},{name:'Operations agent',sub:'Tasks & fulfilment',icon:PackageCheck},{name:'Analytics agent',sub:'Reporting & optimisation',icon:BarChart3}];

export default function BusinessSystemsShowcase(){
 const[active,setActive]=useState(0);
 const[selected,setSelected]=useState<number|null>(null);
 const[paused,setPaused]=useState(false);
 const[cycle,setCycle]=useState(1);
 useEffect(()=>{if(paused||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;const timer=window.setInterval(()=>setActive(value=>{if(value===nodes.length-1){setCycle(c=>c+1);return 0}return value+1}),2050);return()=>window.clearInterval(timer)},[paused]);
 const current=selected===null?active:selected;
 const StageIcon=nodes[current].icon;
 return <section className="business-flow-section" aria-label="Interactive business systems workflow">
  <div className="business-flow-intro"><div><div className="eyebrow"><i/> A CLOSER LOOK / 02</div><h2>One business.<br/><em>Connected end to end.</em></h2></div><p>See how advertising, customer engagement, sales and delivery can work as one coordinated system, with the right tools and people connected at every step.</p></div>
  <div className="business-flow-shell">
   <div className="business-flow-topbar"><div className="business-flow-brand"><Workflow size={15}/><span>WEB4 / BUSINESS SYSTEMS CANVAS</span><small>WORKFLOW 001</small></div><div className="business-flow-controls"><span className="business-flow-live"><i/> {paused?'PAUSED':'DEMO RUNNING'}</span><button type="button" onClick={()=>setPaused(v=>!v)}>{paused?'Resume':'Pause'} <span>{paused?'▶':'Ⅱ'}</span></button><button type="button" onClick={()=>{setActive(0);setSelected(null);setCycle(c=>c+1);setPaused(false)}} aria-label="Restart workflow"><RefreshCw size={13}/></button></div></div>
   <div className="business-flow-canvas" onMouseLeave={()=>{}}>
    <div className="business-flow-canvas-grid"/>
    <div className="business-flow-stage-label"><span>EXECUTION / {String(current+1).padStart(2,'0')} OF 08</span><b>{nodes[current].kind}</b><span>RUN #{String(cycle).padStart(3,'0')}</span></div>
    <div className="business-flow-track">
     <div className="business-flow-row business-flow-row-primary">
      {nodes.slice(0,4).map((node,index)=>{const Icon=node.icon;const status=index<active?'done':index===active?'running':'waiting';return <div className="business-flow-item-wrap" key={node.id}>
       <button type="button" className={'business-flow-node '+status+(selected===index?' inspected':'')} onClick={()=>setSelected(selected===index?null:index)} aria-pressed={selected===index}>
        <span className="business-flow-node-head"><small>{node.number} / {node.kind}</small><span className={'business-flow-status '+status}>{status==='done'?<Check size={10}/>:status==='running'?<i/>:<CircleDot size={10}/>}</span></span>
        <span className="business-flow-node-icon"><Icon size={19}/></span><strong>{node.title}</strong><small className="business-flow-node-output">{status==='done'?'✓ '+node.output:status==='running'?'Executing workflow…':'Waiting for input'}</small>
        {status==='running'&&<span className="business-flow-progress"><i/></span>}
       </button>
       {index<3&&<div className={'business-flow-connector '+(active>index?'passed':'')}><i/></div>}
      </div>})}
     </div>
     <div className="business-flow-branch">
      <div className="business-flow-branch-line"/>
      <div className="business-flow-branch-agent"><div className="business-flow-branch-icon"><Bot size={16}/></div><div><b>AI / AUTOMATION AGENTS</b><small>Parallel tasks, routing and human hand-offs</small></div><span className="business-flow-agent-pulse"/></div>
      <div className="business-flow-agent-list">{agents.map((agent,i)=>{const Icon=agent.icon;const isActive=(active>=2&&active<=6)&&((i===1&&active===2)||(i===2&&active>=3&&active<=5)||(i===3&&active===6)||(i===4&&active>=6));return <div className={'business-flow-agent '+(isActive?'agent-active':'')} key={agent.name}><Icon size={13}/><span><b>{agent.name}</b><small>{agent.sub}</small></span><i>{isActive?'ACTIVE':'READY'}</i></div>})}</div>
     </div>
     <div className="business-flow-row business-flow-row-secondary">
      {nodes.slice(4).map((node,index)=>{const realIndex=index+4;const Icon=node.icon;const status=realIndex<active?'done':realIndex===active?'running':'waiting';return <div className="business-flow-item-wrap" key={node.id}>
       <button type="button" className={'business-flow-node '+status+(selected===realIndex?' inspected':'')} onClick={()=>setSelected(selected===realIndex?null:realIndex)} aria-pressed={selected===realIndex}>
        <span className="business-flow-node-head"><small>{node.number} / {node.kind}</small><span className={'business-flow-status '+status}>{status==='done'?<Check size={10}/>:status==='running'?<i/>:<CircleDot size={10}/>}</span></span>
        <span className="business-flow-node-icon"><Icon size={19}/></span><strong>{node.title}</strong><small className="business-flow-node-output">{status==='done'?'✓ '+node.output:status==='running'?'Executing workflow…':'Waiting for input'}</small>
        {status==='running'&&<span className="business-flow-progress"><i/></span>}
       </button>
       {index<3&&<div className={'business-flow-connector '+(active>realIndex?'passed':'')}><i/></div>}
      </div>})}
     </div>
     <div className="business-flow-feedback"><span><RefreshCw size={13}/> FEEDBACK LOOP</span><div/><small>Insights improve the next campaign</small><ArrowRight size={13}/></div>
    </div>
    {selected!==null&&<aside className="business-flow-detail"><div className="business-flow-detail-heading"><div><small>{nodes[selected].number} / {nodes[selected].kind}</small><b>{nodes[selected].title}</b></div><button type="button" onClick={()=>setSelected(null)} aria-label="Close stage details">×</button></div><p>{nodes[selected].detail}</p><div className="business-flow-detail-tasks">{nodes[selected].tasks.map(task=><span key={task}><CheckCircle2 size={12}/>{task}</span>)}</div><div className="business-flow-detail-output"><span>STAGE OUTPUT</span><b>{nodes[selected].output}</b></div></aside>}
   </div>
   <div className="business-flow-footer"><div className="business-flow-current"><span className="pulse-dot"/><span>NOW EXECUTING</span><b>{nodes[active].title}</b></div><div className="business-flow-steps">{nodes.map((node,index)=><button type="button" key={node.id} onClick={()=>{setActive(index);setSelected(index)}} className={index===active?'current':index<active?'complete':''} aria-label={'Show stage '+node.title}/>)}</div><span className="business-flow-disclaimer">ILLUSTRATIVE WORKFLOW / NOT A LIVE INTEGRATION</span></div>
  </div>
  <div className="business-flow-bottom"><div className="business-flow-agent-summary"><span>CONNECTED SPECIALISTS</span>{agents.map(agent=><span key={agent.name}><i/>{agent.name}</span>)}</div><p>Every business is different. We design the right combination of software, integrations, automation and human oversight around the way yours works.</p></div>
 </section>
}
