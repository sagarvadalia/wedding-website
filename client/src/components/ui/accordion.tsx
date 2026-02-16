import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccordionContextValue {
  openItems: string[];
  toggleItem: (value: string) => void;
  type: 'single' | 'multiple';
}

const AccordionContext = React.createContext<AccordionContextValue | undefined>(
  undefined
);

interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: 'single' | 'multiple';
  defaultValue?: string | string[];
  collapsible?: boolean;
}

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ className, type = 'single', defaultValue, children, ...props }, ref) => {
    const [openItems, setOpenItems] = React.useState<string[]>(() => {
      if (defaultValue) {
        return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
      }
      return [];
    });

    const toggleItem = React.useCallback(
      (value: string) => {
        setOpenItems((prev) => {
          if (type === 'single') {
            return prev.includes(value) ? [] : [value];
          }
          return prev.includes(value)
            ? prev.filter((item) => item !== value)
            : [...prev, value];
        });
      },
      [type]
    );

    return (
      <AccordionContext.Provider value={{ openItems, toggleItem, type }}>
        <div ref={ref} className={cn('space-y-2', className)} {...props}>
          {children}
        </div>
      </AccordionContext.Provider>
    );
  }
);
Accordion.displayName = 'Accordion';

interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, value, children, ...props }, ref) => {
    const context = React.useContext(AccordionContext);
    if (!context) throw new Error('AccordionItem must be used within Accordion');

    const isOpen = context.openItems.includes(value);

    return (
      <div
        ref={ref}
        data-state={isOpen ? 'open' : 'closed'}
        className={cn(
          'border border-sand-driftwood/30 rounded-lg overflow-hidden',
          className
        )}
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { value, isOpen } as Record<string, unknown>);
          }
          return child;
        })}
      </div>
    );
  }
);
AccordionItem.displayName = 'AccordionItem';

interface AccordionTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value?: string;
  isOpen?: boolean;
}

const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  AccordionTriggerProps
>(({ className, children, value, isOpen, ...props }, ref) => {
  const context = React.useContext(AccordionContext);
  if (!context)
    throw new Error('AccordionTrigger must be used within Accordion');

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => value && context.toggleItem(value)}
      className={cn(
        'flex w-full items-center justify-between px-4 py-4 font-medium text-ocean-deep bg-sand-pearl hover:bg-sand-light transition-colors text-left',
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown
        className={cn(
          'h-5 w-5 shrink-0 text-sand-dark transition-transform duration-200',
          isOpen && 'rotate-180'
        )}
      />
    </button>
  );
});
AccordionTrigger.displayName = 'AccordionTrigger';

interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean;
}

const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, children, isOpen, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'overflow-hidden transition-all duration-200',
          isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        )}
        {...props}
      >
        <div className={cn('px-4 pb-4 pt-0 bg-sand-pearl text-ocean-deep', className)}>
          {children}
        </div>
      </div>
    );
  }
);
AccordionContent.displayName = 'AccordionContent';

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
