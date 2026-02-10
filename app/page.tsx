export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 relative overflow-hidden">
      {/* BACKGROUND DECOR */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-orange-300/40 rounded-full blur-3xl"></div>
      <div className="absolute top-1/3 -right-32 w-[500px] h-[500px] bg-red-300/40 rounded-full blur-3xl"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#fb923c_1px,transparent_0)] [background-size:40px_40px] opacity-10"></div>

      {/* HERO SECTION */}
      <section className="relative max-w-6xl mx-auto px-6 py-32 text-center">
        <span className="inline-block mb-6 px-5 py-2 text-sm font-semibold text-orange-700 bg-orange-100 rounded-full shadow">
          🚀 Fast • Fresh • Delicious
        </span>

        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight text-gray-900">
          Fresh Pizza <br />
          <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Delivered Hot
          </span>
        </h1>

        <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Handcrafted pizzas made with premium ingredients, baked to perfection
          and delivered straight to your door 🍕
        </p>

        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-5">
          <a
            href="/menu"
            className="px-10 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-2xl font-semibold shadow-xl hover:scale-105 transition-transform"
          >
            Order Now
          </a>

          <a
            href="/auth/login"
            className="px-10 py-4 bg-white/80 backdrop-blur border border-orange-600 text-orange-600 rounded-2xl font-semibold hover:bg-orange-50 transition"
          >
            Login
          </a>
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative bg-white py-20">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <div className="p-8 rounded-2xl shadow-md hover:shadow-xl transition">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-black font-bold mb-2">Fast Delivery</h3>
            <p className="text-gray-600">
              Hot and fresh pizzas delivered in under 30 minutes.
            </p>
          </div>

          <div className="p-8 rounded-2xl shadow-md hover:shadow-xl transition">
            <div className="text-4xl mb-4">🧀</div>
            <h3 className="text-black font-bold mb-2">Premium Ingredients</h3>
            <p className="text-gray-600">
              Finest cheese, fresh veggies, and authentic sauces.
            </p>
          </div>

          <div className="p-8 rounded-2xl shadow-md hover:shadow-xl transition">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-black font-bold mb-2">Easy Ordering</h3>
            <p className="text-gray-600">
              Simple, smooth, and secure online ordering experience.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
