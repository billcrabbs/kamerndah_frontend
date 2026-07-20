export function DashboardPageHeader({ pill, title, highlight, description, children }) {
  return (
    <div className="space-y-1">
      {pill && (
        <div className="inline-flex items-center gap-2 bg-primary/[0.08] border border-primary/[0.15] px-4 py-1.5 rounded-full mb-4">
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span className="text-[10px] font-bold text-primary tracking-wider uppercase">
            {pill}
          </span>
        </div>
      )}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight">
            {title}{' '}
            {highlight && (
              <span className="text-primary">{highlight}</span>
            )}
          </h1>
          {description && (
            <p className="text-sm text-white/40 font-medium mt-1.5 max-w-xl">
              {description}
            </p>
          )}
        </div>
        {children && <div className="flex-shrink-0">{children}</div>}
      </div>
    </div>
  );
}
