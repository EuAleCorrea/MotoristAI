import { Link } from 'react-router-dom';

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-card py-4">
      <div className="max-w-lg mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <Link to="/politicas/termos" className="hover:text-foreground transition-colors">Termos de Uso</Link>
          <span className="text-border">·</span>
          <Link to="/politicas/privacidade" className="hover:text-foreground transition-colors">Privacidade</Link>
          <span className="text-border">·</span>
          <Link to="/politicas/lgpd" className="hover:text-foreground transition-colors">LGPD</Link>
        </div>
      </div>
    </footer>
  );
}
