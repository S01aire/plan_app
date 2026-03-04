export function Button({ children, variant = 'primary', size = 'md', onClick, disabled, className = '', type = 'button' }) {
  const base = 'inline-flex items-center justify-center gap-2 font-medium transition-all rounded-full cursor-pointer border-none outline-none'

  const variants = {
    primary: 'bg-warm-400 text-white shadow-warm-sm hover:bg-warm-500 active:scale-95',
    ghost:   'bg-transparent text-text-secondary hover:bg-warm-50',
    danger:  'bg-coral text-white hover:opacity-90 active:scale-95',
    outline: 'bg-transparent border-2 border-warm-400 text-warm-400 hover:bg-warm-50',
    mint:    'bg-mint-200 text-white hover:bg-mint-300 active:scale-95',
  }

  const sizes = {
    sm: 'px-4 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  const disabledClass = disabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${disabledClass} ${className}`}
    >
      {children}
    </button>
  )
}
