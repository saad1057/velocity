const stats = [
  { value: "10x", label: "Faster Hiring" },
  { value: "95%", label: "Match Accuracy" },
  { value: "60%", label: "Cost Reduction" },
  { value: "24/7", label: "AI Availability" },
];

export const Stats = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, index) => (
            <div 
              key={stat.label} 
              className="text-center animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="mb-2 text-4xl font-bold text-primary md:text-5xl">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground md:text-base">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
