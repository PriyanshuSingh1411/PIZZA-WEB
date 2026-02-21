export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      {/* FULL PAGE VIDEO BACKGROUND */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="fixed top-0 left-0 w-full h-full object-cover -z-10"
      >
        <source src="/pizza-bg.mp4" type="video/mp4" />
      </video>

      {/* DARK OVERLAY */}
      <div className="fixed inset-0  -z-10"></div>

      {/* HERO SECTION */}
      <section className="min-h-screen flex items-center justify-center text-center px-6">
        <div>
          <span className="inline-block mb-6 px-5 py-2 text-sm font-semibold bg-white/20 backdrop-blur rounded-full">
            🚀 Fast • Fresh • Delicious
          </span>

          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
            Fresh Pizza <br />
            <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              Delivered Hot
            </span>
          </h1>

          <p className="mt-6 text-lg md:text-xl max-w-2xl mx-auto">
            Handcrafted pizzas made with premium ingredients, baked to
            perfection and delivered straight to your door 🍕
          </p>

          <div className="mt-10">
            <a
              href="/menu"
              className="px-10 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-2xl font-semibold shadow-xl hover:scale-105 transition-transform"
            >
              Order Now
            </a>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <div className="p-8 rounded-2xl bg-white/10 backdrop-blur shadow-lg">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="font-bold mb-2">Fast Delivery</h3>
            <p className="text-gray-200">
              Hot and fresh pizzas delivered in under 30 minutes.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white/10 backdrop-blur shadow-lg">
            <div className="text-4xl mb-4">🧀</div>
            <h3 className="font-bold mb-2">Premium Ingredients</h3>
            <p className="text-gray-200">
              Finest cheese, fresh veggies, and authentic sauces.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white/10 backdrop-blur shadow-lg">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="font-bold mb-2">Easy Ordering</h3>
            <p className="text-gray-200">
              Simple, smooth, and secure online ordering experience.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
