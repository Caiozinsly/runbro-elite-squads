import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-muted-foreground/20">
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <p>© 2025 RunBro. O asfalto é o nosso playground.</p>
        <nav className="flex items-center gap-6">
          <Link to="#termos" className="hover:text-primary transition-colors">Termos</Link>
          <Link to="#privacidade" className="hover:text-primary transition-colors">Privacidade</Link>
          <Link to="#contacto" className="hover:text-primary transition-colors">Contacto</Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
