export default function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) { return <div className={`glass rounded-[28px] ${className}`}>{children}</div>; }
