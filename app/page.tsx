export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* HERO SECTION */}
      <section className="max-w-6xl mx-auto px-6 py-24 flex flex-col md:flex-row items-center gap-12">
        {/* LEFT CONTENT */}
        <div className="flex-1">
          <span className="inline-block mb-4 px-4 py-1 text-sm font-semibold text-orange-600 bg-orange-100 rounded-full">
            🚀 Fast • Fresh • Delicious
          </span>

          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-gray-900">
            Fresh Pizza <br />
            <span className="text-orange-600">Delivered Hot</span>
          </h1>

          <p className="mt-6 text-lg text-gray-600 max-w-xl">
            Order handcrafted pizzas made with premium ingredients. Delivered to
            your doorstep in minutes 🍕
          </p>

          <div className="mt-8 flex gap-4">
            <a
              href="/menu"
              className="px-8 py-4 bg-orange-600 text-white rounded-xl font-semibold shadow-lg hover:bg-orange-700 transition"
            >
              Order Now
            </a>

            <a
              href="/auth/login"
              className="px-8 py-4 border border-orange-600 text-orange-600 rounded-xl font-semibold hover:bg-orange-50 transition"
            >
              Login
            </a>
          </div>
        </div>

        {/* RIGHT VISUAL */}
        <div className="flex-1 flex justify-center">
          <div className="relative">
            <div className="w-80 h-80 rounded-full bg-orange-200 blur-3xl absolute -top-10 -left-10"></div>
            <img
              src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=80"
              alt="Pizza"
              className="relative w-96 rounded-3xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <div className="p-8 rounded-2xl shadow-md">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-black font-bold mb-2">Fast Delivery</h3>
            <p className="text-gray-600">
              Hot and fresh pizzas delivered in under 30 minutes.
            </p>
          </div>

          <div className="p-8 rounded-2xl shadow-md">
            <div className="text-4xl mb-4">🧀</div>
            <h3 className="text-black font-bold mb-2">Premium Ingredients</h3>
            <p className="text-gray-600">
              Finest cheese, fresh veggies, and authentic sauces.
            </p>
          </div>

          <div className="p-8 rounded-2xl shadow-md">
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
