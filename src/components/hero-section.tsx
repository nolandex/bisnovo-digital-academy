export function HeroSection() {
  return (
    <section className="relative w-full px-4 py-2 mt-0">
      <div className="relative w-full h-[180px] md:h-[250px] lg:h-[300px] overflow-hidden rounded-xl shadow-lg">
        <img
          src="https://ik.imagekit.io/nf7nyedso/Blue%20Marketing%20Basic%20Course%20Banner_20250918_023808_0000.jpg?updatedAt=1758138006252"
          alt="Hero Banner"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
    </section>
  );
}
