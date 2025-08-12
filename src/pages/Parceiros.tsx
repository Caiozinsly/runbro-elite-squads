import SEO from "@/components/common/SEO";

const Parceiros = () => {
  return (
    <main>
      <SEO title="RunBro: Parceiros de Elite" description="Impulsione sua marca patrocinando a elite da corrida urbana. Conheça benefícios e nossos parceiros." />
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <h1 className="text-3xl md:text-4xl font-black max-w-3xl">
            Impulsione sua Marca. <span className="gradient-text">Patrocine o Futuro da Corrida.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Seja parte do movimento. Ofereça benefícios reais à comunidade e conecte-se com corredores de alta performance.
          </p>
          <div className="mt-8">
            <a href="#parceria" className="inline-flex items-center justify-center rounded-md border border-primary/30 px-6 h-12 bg-gradient-to-r from-primary to-accent text-primary-foreground hover:shadow-neon transition-all">Seja um Parceiro</a>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16 md:pb-24">
        <h2 className="text-2xl font-black mb-6">Vitrine de Parceiros</h2>
        <div className="space-y-10">
          {["Parceiros Elite", "Parceiros Premium"].map((tier) => (
            <div key={tier}>
              <h3 className="text-lg font-semibold mb-4">{tier}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <article key={i} className="glass rounded-xl p-6 text-center">
                    <div className="mx-auto mb-3 h-12 w-12 rounded-md bg-secondary/60" />
                    <div className="font-semibold">Marca {i + 1}</div>
                    <div className="mt-1 text-sm text-muted-foreground">Descontos, brindes e experiências.</div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Parceiros;
