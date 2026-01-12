"use client";
import * as React from "react";

export function Dialog({ open: controlledOpen, onOpenChange, children }: any){
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  
  const handleOpenChange = React.useCallback((newOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpen);
    }
    if (!isControlled) {
      setInternalOpen(newOpen);
    }
  }, [onOpenChange, isControlled]);

  // Extract trigger and content from children
  const trigger = React.Children.toArray(children).find((child: any) => child?.type === DialogTrigger);
  const content = React.Children.toArray(children).filter((child: any) => child?.type !== DialogTrigger);

  return (
    <>
      {trigger && React.cloneElement(trigger as React.ReactElement, { onClick: () => handleOpenChange(true) })}
      {open && (
        <div onClick={() => handleOpenChange(false)} className="fixed inset-0 z-40 bg-black/40 flex items-center justify-center p-4">
          {content}
        </div>
      )}
    </>
  );
}

export function DialogContent({ children, className }: any){
  return <div onClick={(e)=> e.stopPropagation()} className={`bg-white rounded-2xl border border-black/10 shadow-xl max-w-lg w-full ${className||''}`}>{children}</div>;
}
export function DialogHeader({ children }: any){ return <div className="px-4 pt-4">{children}</div>; }
export function DialogTitle({ children }: any){ return <div className="text-lg font-semibold">{children}</div>; }
export function DialogDescription({ children }: any){ return <div className="text-sm text-neutral-600">{children}</div>; }
export function DialogFooter({ children }: any){ return <div className="px-4 pb-4 flex items-center justify-end gap-2">{children}</div>; }
export function DialogTrigger({ children, asChild, onClick: externalOnClick, ...props }: any){ 
  const handleClick = (e: React.MouseEvent) => {
    if (externalOnClick) {
      externalOnClick(e);
    }
  };
  
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, { ...props, onClick: handleClick } as any);
  }
  return <div {...props} onClick={handleClick}>{children}</div>;
}

