import SEO from "@/components/common/SEO";

const images = Array.from({ length: 12 }).map((_, i) => ({
  id: i,
  h: [220, 260, 300, 340][i % 4],
}));

const Mural = () => {
  return (
    <main>
      <SEO title="RunBro: Mural da Comunidade" description="Memórias em movimento. Veja e partilhe fotos da comunidade de corredores urbanos." />
      <section className="container mx-auto px-4 py-10 md:py-14">
        <header className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black">Memórias em Movimento</h1>
            <p className="text-muted-foreground">Partilhe seus momentos épicos de corrida.</p>
          </div>
          <button className="inline-flex items-center justify-center rounded-md border border-primary/30 px-4 h-10 bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-none hover:shadow-neon transition-colors">Envie Sua Foto</button>
        </header>
        <div className="columns-1 sm:columns-2 md:columns-3 gap-4 [column-fill:_balance]"><div className="space-y-4">
          {images.map((img) => (
            <div key={img.id} style={{ height: img.h }} className="w-full rounded-xl glass shadow-card break-inside-avoid p-2">
              <div className="h-full w-full rounded-md bg-gradient-to-br from-primary/40 to-accent/40" />
              <div className="mt-2 text-xs text-muted-foreground">Squad X • Corredor Y • Cidade Z</div>
            </div>
          ))}
        </div></div>
      </section>
    </main>
  );
};

export default Mural;
