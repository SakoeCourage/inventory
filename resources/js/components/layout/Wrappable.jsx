import React, { useState, useEffect, useRef } from 'react'


export default function Wrapable({ children, className, title, autoColapse = false, asmodal = true ,hasSubTree =false}) {
  const [scrollHeight, setScrollHeight] = useState(0)
  const [isModal, setIsModal] = useState(false)
  const content = useRef();

  const handleResize = () => {
    if (window.innerWidth > 768) {
      setScrollHeight(content.current?.scrollHeight);
      content.current.style.height = `${content.current?.scrollHeight}px`
      setIsModal(false)
    } else {
      setScrollHeight(0);
      setIsModal(false);
      content.current.style.height = `0px`
    }
  };

  const handleOnheightToggle = () => {
    setIsModal(asmodal)
    if (content.current.style.height == '0px') {
      setScrollHeight(content.current?.scrollHeight);
      content.current.style.height = `${content.current?.scrollHeight}px`
    } else {
      setScrollHeight(0);
      setIsModal(false);
      content.current.style.height = `0px`
    }
  }

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);

    const observer = new MutationObserver(() => {
    //  if(autoColapse) 
     handleResize();
    });


    observer.observe(content.current, { childList: true, subtree: hasSubTree });

    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, []);

  return <div className={`${isModal && !(scrollHeight === 0) && 'fixed flex flex-col inset-0 z-50 isolate bg-black/50 backdrop-blur-[1px]  '} ${className} `}>
    <nav onClick={() => handleOnheightToggle()} className={`md:hidden cursor-pointer font-semibold flex items-center justify-between    p-2 rounded-md shadow-md border  ${scrollHeight === 0 ?'bg-info-100/50 text-info-500 border-info-400/70': 'bg-red-50 text-red-500  '}`}>
      <nav className='h-8 sticky top-0 md:h-auto px-2'>
        {title ? `${scrollHeight === 0 ? 'Show' : 'Hide'} ${title} ` : "No title"}
      </nav>
      <svg className={`cursor-pointer z-10 transition-transform ${scrollHeight === 0 ? ' ' : 'rotate-180'}`} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m17 10l-5 5l-5-5"/></svg>
    </nav>
    <div onClick={() => {  if(autoColapse)handleResize() }} ref={content} className={`${isModal && scrollHeight !== 0 && 'fixed inset-x-0 top-[7vh]  w-full !max-h-[92vh] bottom-3  z-50 bg-white rounded-md p-1 '} overflow-y-scroll md:h-full md:overflow-hidden  wrappable-content transition-all duration-300`}>
      {children}
    </div>
  </div>

}