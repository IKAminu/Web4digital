import{useEffect,useState}from'react';
import{Activity,ArrowDown,ArrowRight,BarChart3,Bell,Bot,Check,ChevronRight,Clock,Database,FileText,Globe2,Mail,Megaphone,MessageCircle,MousePointer2,PackageCheck,RefreshCw,Send,ShoppingCart,Users,Wallet,Workflow,Zap}from'lucide-react';

const groups:any[]=[
{id:'campaigns',name:'Campaigns',color:'violet',icon:Megaphone,description:'Attract the right audience',nodes:[['Meta Ads','Campaign published',Megaphone],['Ad engagement','Clicks and enquiries',Activity],['Campaign analytics','Audience signals',BarChart3]],detail:'Paid campaigns, creative production, audience targeting and performance tracking bring new prospects into the business.'},
{id:'websites',name:'Websites',color:'blue',icon:Globe2,description:'Turn visits into enquiries',nodes:[['Landing page','Offer and content',Globe2],['Enquiry form','Details submitted',FileText],['Lead event','Conversion recorded',Zap]],detail:'Websites, landing pages, forms and conversion tracking give every visitor a clear path to take action.'},
{id:'engagement',name:'Engagement',color:'cyan',icon:MessageCircle,description:'Start the conversation',nodes:[['New enquiry','Trigger received',Bell],['WhatsApp / chat','Instant response',MessageCircle],['Details captured','Contact information',Users]],detail:'Messaging, chatbots and follow-up sequences respond quickly, collect useful information and keep conversations moving.'},
{id:'crm',name:'CRM',color:'green',icon:Database,description:'Keep every record connected',nodes:[['Create contact','New customer record',Users],['Update pipeline','Source and status',Database],['Assign owner','Team notification',Mail]],detail:'A central customer record stores the source, conversation history, pipeline stage, owner and next action.'},
{id:'qualification',name:'Qualification',color:'amber',icon:Activity,description:'Decide what happens next',nodes:[['Check requirements','Rules and criteria',ClipboardIcon],['Qualified?','Decision / route',Activity],['Nurture sequence','Follow-up reminder',Clock]],detail:'Rules and sales agents identify priority enquiries, route qualified prospects to sales and keep the rest warm with useful follow-ups.'},
{id:'sales',name:'Sales',color:'orange',icon:Wallet,description:'Move interest to payment',nodes:[['Prepare quote','Offer and pricing',FileText],['Sales follow-up','Human hand-off',MessageCircle],['Payment confirmed','Order created',Wallet]],detail:'Quotes, proposals, follow-ups, approvals and payment updates stay linked to the customer and their order.'},
{id:'operations',name:'Operations',color:'pink',icon:PackageCheck,description:'Deliver what was promised',nodes:[['Create job','Fulfilment task',PackageCheck],['Assign team','Internal notification',Users],['Delivery update','Customer notification',Send]],detail:'Confirmed sales can trigger fulfilment tasks, internal assignments, document preparation and customer updates.'},
{id:'analytics',name:'Analytics & retention',color:'violet',icon:BarChart3,description:'Learn, improve and repeat',nodes:[['Performance report','Results consolidated',BarChart3],['Customer feedback','Review and insight',MessageCircle],['Re-engagement','Next campaign signal',RefreshCw]],detail:'Dashboards and customer feedback reveal what is working, where prospects drop off and how to improve repeat business.'}
];
const displayOrder=[0,1,2,3,7,6,5,4];
const allNodes=displayOrder.flatMap(index=>groups[index].nodes.map((node,i)=>({id:groups[index].id+'-'+i,group:index,title:node[0],subtitle:node[1],icon:node[2]})));
function ClipboardIcon(props:any){return <FileText {...props}/>}

export default function BusinessSystemsShowcase(){
 const[active,setActive]=useState(0);const[selected,setSelected]=useState<string|null>(null);const[paused,setPaused]=useState(false);const[cycle,setCycle]=useState(1);
 useEffect(()=>{if(paused||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;const timer=window.setInterval(()=>setActive(v=>{if(v>=allNodes.length-1){setCycle(c=>c+1);return 0}return v+1}),1050);return()=>window.clearInterval(timer)},[paused]);
 const current=allNodes[active];const chosen=selected?allNodes.find(n=>n.id===selected):null;
 const selectGroup=(index:number)=>{const first=allNodes.findIndex(n=>n.group===index);setActive(first);setSelected(allNodes[first].id)};
 return <section className="business-flow-section" aria-label="Interactive business automation workspace">
  <div className="business-flow-intro"><div><div className="eyebrow"><i/> BUSINESS SYSTEMS / WORKFLOW VIEW</div><h2>Everything connected.<br/><em>Nothing working in isolation.</em></h2></div><p>From the first ad click to the final delivery, we connect the tools, people and processes that help a business run as one system.</p></div>
  <div className="business-flow-shell">
   <header className="business-flow-topbar"><div className="business-flow-brand"><Workflow size={15}/><span>WEB4 WORKSPACE</span><small>BUSINESS OPERATIONS / 001</small></div><div className="business-flow-controls"><span className="business-flow-live"><i/>{paused?'PAUSED':'WORKFLOW ACTIVE'}</span><button type="button" onClick={()=>setPaused(v=>!v)}>{paused?'Resume':'Pause'} <span>{paused?'▶':'Ⅱ'}</span></button><button type="button" onClick={()=>{setActive(0);setSelected(null);setCycle(v=>v+1);setPaused(false)}} aria-label="Restart workflow"><RefreshCw size={13}/></button></div></header>
   <div className="business-flow-toolbar"><div><span className="workspace-tab active">Editor</span><span className="workspace-tab">Workflow overview</span><span className="workspace-saved"><i/> All changes saved</span></div><span className="workspace-execution">DEMO EXECUTION <b>#{String(cycle).padStart(3,'0')}</b></span></div>
   <div className="business-flow-canvas">
    <div className="business-flow-canvas-grid"/>
    <div className="workspace-canvas-meta"><span>WORKFLOW / CUSTOMER ACQUISITION TO DELIVERY</span><span>8 GROUPS <i/> 24 AUTOMATION STEPS</span></div>
    <div className="workspace-groups">
     {displayOrder.map((groupIndex,position)=>{const group=groups[groupIndex];const Icon=group.icon;const groupNodes=allNodes.filter(n=>n.group===groupIndex);const groupActive=groupNodes.some(n=>n.id===current.id);const groupDone=groupNodes.every(n=>allNodes.indexOf(n)<active);return <div className={'workspace-group group-'+group.color+(groupActive?' group-running':'')+(groupDone?' group-done':'')} key={group.id}>
      <button type="button" className="workspace-group-heading" onClick={()=>selectGroup(groupIndex)}><span className="workspace-group-icon"><Icon size={14}/></span><span><b>{group.name}</b><small>{group.description}</small></span><span className="workspace-group-count">{String(groupIndex+1).padStart(2,'0')}</span></button>
      <div className="workspace-group-nodes">{groupNodes.map((node,i)=>{const index=allNodes.indexOf(node);const NodeIcon=node.icon;const status=index<active?'done':index===active?'running':'waiting';return <div className="workspace-node-wrap" key={node.id}>
       <button type="button" className={'workspace-node node-'+status+(selected===node.id?' node-selected':'')} onClick={()=>{setSelected(selected===node.id?null:node.id);setActive(index)}} aria-pressed={selected===node.id}>
        <span className="workspace-node-icon"><NodeIcon size={15}/></span><span className="workspace-node-copy"><b>{node.title}</b><small>{node.subtitle}</small></span><span className={'workspace-node-state state-'+status}>{status==='done'?<Check size={11}/>:status==='running'?<i/>:<span/>}</span>
       </button>
       {i<group.nodes.length-1&&<div className={'workspace-node-link '+(index<active?'link-done':'')}><i/></div>}
      </div>})}</div>
      <div className="workspace-group-foot"><span>{groupDone?'COMPLETED':groupActive?'RUNNING':'READY'}</span><span>{group.nodes.length} NODES</span></div>
      {position!==3&&position!==7&&<div className={'workspace-group-connector '+(position<3?'connector-forward':'connector-return')+(groupDone?' connector-done':'')}><i/></div>}
     </div>})}
    </div>
    <div className="workspace-loop-line"><RefreshCw size={12}/><span>INSIGHTS FEED BACK INTO CAMPAIGN STRATEGY</span><div/><span>CONTINUOUS IMPROVEMENT LOOP</span></div>
    <div className="workspace-canvas-controls"><button type="button" aria-label="Select mode"><MousePointer2 size={13}/></button><button type="button" onClick={()=>{setSelected(null);setActive(0)}} aria-label="Fit workflow"><Workflow size={13}/></button><span>−</span><span>100%</span><span>+</span></div>
   </div>
   {chosen&&<aside className="business-flow-detail"><div><small>WORKFLOW NODE / {chosen.id.toUpperCase()}</small><b>{chosen.title}</b></div><p>{groups[chosen.group].detail}</p><button type="button" onClick={()=>setSelected(null)} aria-label="Close node details">×</button></aside>}
   <footer className="business-flow-footer"><div className="business-flow-current"><i/><span>EXECUTING</span><b>{current.title}</b><small>{current.subtitle}</small></div><div className="business-flow-steps">{allNodes.map((node,index)=><button type="button" key={node.id} onClick={()=>{setActive(index);setSelected(node.id)}} className={index===active?'current':index<active?'complete':''} aria-label={'Run '+node.title}/>)}</div><span className="business-flow-disclaimer">ILLUSTRATIVE WORKFLOW / NOT A LIVE INTEGRATION</span></footer>
  </div>
  <div className="business-flow-bottom"><div><span className="business-flow-bottom-label">BUILT AROUND YOUR BUSINESS</span><p>Campaigns, websites, messaging, CRM, sales and delivery don't have to live in separate tools. We design the connections that make them work together.</p></div><div className="business-flow-legend"><span><i className="legend-done"/> Completed</span><span><i className="legend-active"/> Processing</span><span><i className="legend-wait"/> Waiting</span><span><i className="legend-connection"/> Connected workflow</span></div></div>
 </section>
}
