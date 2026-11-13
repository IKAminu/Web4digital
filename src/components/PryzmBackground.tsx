import{useEffect,useState}from'react';
import{createElement,type ComponentType}from'react';
const PRYZM_URL='https://framer.com/m/PryzmBackground-o5wYCh.js@fuvET9xNhqEw6N71KGD9';
type RemoteModule={default?:ComponentType<Record<string,unknown>>;PryzmBackground?:ComponentType<Record<string,unknown>>;Pryzm?:ComponentType<Record<string,unknown>>};
export default function PryzmBackground(){
 const[visible,setVisible]=useState(false);
 const[Remote,setRemote]=useState<ComponentType<Record<string,unknown>>|null>(null);
 const[failed,setFailed]=useState(false);
 useEffect(()=>{const node=document.querySelector('.pryzm-background');if(!node)return;const observer=new IntersectionObserver(entries=>{setVisible(entries.some(e=>e.isIntersecting))},{rootMargin:'160px'});observer.observe(node);return()=>observer.disconnect()},[]);
 useEffect(()=>{if(!visible||Remote||failed)return;const mobile=window.matchMedia('(max-width: 760px)').matches;const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;if(mobile||reduce){setFailed(true);return}let alive=true;(async()=>{try{const module=await import(/* @vite-ignore */ PRYZM_URL) as RemoteModule;const Component=module.default||module.PryzmBackground||module.Pryzm;if(!Component)throw new Error('Pryzm module did not expose a React component');if(alive)setRemote(()=>Component)}catch(error){console.warn('Pryzm background could not be loaded; using the local visual fallback.',error);if(alive)setFailed(true)}})();return()=>{alive=false}},[visible,Remote,failed]);
 return <div className="pryzm-background" aria-label="Animated glass prism background">{visible&&Remote&&!failed?createElement(Remote,{style:{width:'100%',height:'100%'}}):<div className="pryzm-fallback" aria-hidden="true"><i className="pryzm-ribbon"/><i className="pryzm-ribbon"/><i className="pryzm-ribbon"/><i className="pryzm-cursor-light"/></div>}</div>
}
