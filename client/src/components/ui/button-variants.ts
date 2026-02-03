import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-ocean-deep text-sand-pearl hover:bg-ocean-deep/90 shadow-sm',
        secondary:
          'bg-ocean-caribbean text-sand-pearl hover:bg-ocean-caribbean/90 shadow-sm',
        outline:
          'border-2 border-ocean-deep text-ocean-deep bg-transparent hover:bg-ocean-deep hover:text-sand-pearl',
        ghost:
          'text-ocean-deep hover:bg-sand-warm/50',
        link:
          'text-ocean-caribbean underline-offset-4 hover:underline',
        gold:
          'bg-gold text-ocean-deep hover:bg-gold-light shadow-sm font-semibold',
        destructive:
          'bg-coral text-sand-pearl hover:bg-coral/90 shadow-sm',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3 text-xs',
        lg: 'h-12 rounded-md px-8 text-base',
        xl: 'h-14 rounded-lg px-10 text-lg',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);
