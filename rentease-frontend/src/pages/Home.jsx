export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero" style={{ padding: 'var(--space-24) var(--space-6)' }}>
        <div className="hero-content" style={{ maxWidth: '900px' }}>
          <div className="hero-badge">
            <span>✨</span> Trusted by 10,000+ students & professionals across India
          </div>
          <h1 style={{ fontSize: '3.75rem', fontWeight: 800, color: '#fff', margin: '0 0 var(--space-4)', lineHeight: 1.1, letterSpacing: '-0.025em' }}>
            Premium Furniture<br/>
            <span style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              on Monthly Rental
            </span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.9)', margin: '0 0 var(--space-8)', maxWidth: '650px', lineHeight: 1.7 }}>
            Move into your new place without the hassle of buying. Quality furniture, free delivery, and maintenance — all included.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', justifyContent: 'center' }}>
            <a href="/products" style={{ background: 'var(--gray-50)', color: 'var(--primary-700)', padding: '1.125rem 2.5rem', borderRadius: 'var(--radius-lg)', fontWeight: 700, textDecoration: 'none', fontSize: '1.0625rem', boxShadow: '0 10px 40px rgba(0,0,0,0.2)', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 15px 50px rgba(0,0,0,0.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.2)'; }}>
              Browse Catalog →
            </a>
            <a href="/register" style={{ background: 'transparent', color: 'var(--gray-50)', padding: '1.125rem 2.5rem', borderRadius: 'var(--radius-lg)', fontWeight: 700, textDecoration: 'none', fontSize: '1.0625rem', border: '2px solid rgba(255,255,255,0.4)', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'var(--gray-50)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; }}>
              Get Started Free
            </a>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <div style={{ background: 'var(--gray-50)', borderBottom: '1px solid var(--gray-200)', padding: 'var(--space-10) 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 'var(--space-8)' }}>
          {[
            { icon: '🏠', value: '10,000+', label: 'Happy Renters' },
            { icon: '📦', value: '500+', label: 'Products Available' },
            { icon: '🏙️', value: '12', label: 'Cities Covered' },
            { icon: '⭐', value: '4.8/5', label: 'Average Rating' }
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.25rem', marginBottom: 'var(--space-1)' }}>{stat.icon}</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--gray-900)', lineHeight: 1 }}>{stat.value}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)', fontWeight: 500 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="container" style={{ padding: 'var(--space-20) 0' }}>
        <div className="section-header">
          <h2 style={{ fontSize: '2.5rem', marginBottom: 'var(--space-3)' }}>Why Choose RentEase?</h2>
          <p style={{ color: 'var(--gray-500)', fontSize: '1.125rem', maxWidth: '600px', margin: '0 auto' }}>
            We make renting furniture simple, affordable, and stress-free
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-6)' }}>
          {[
            { icon: '💰', title: 'Affordable Monthly Plans', desc: 'Pay just a fraction of the purchase price. Choose from 3, 6, or 12-month plans that fit your budget.' },
            { icon: '🚚', title: 'Free Delivery & Assembly', desc: 'Professional delivery at your doorstep. When you move out, we handle the pickup — absolutely free.' },
            { icon: '🔧', title: 'Maintenance Included', desc: 'Anything breaks? We fix it. No extra costs, no hassle. Just report the issue and we take care of it.' },
            { icon: '📱', title: 'Easy Online Management', desc: 'Manage your rentals, schedule deliveries, and request maintenance — all from your phone or laptop.' },
            { icon: '🔄', title: 'Flexible Tenure', desc: 'Need it for a month or a year? Choose the rental duration that works for you. Extend anytime, no penalties.' },
            { icon: '✅', title: 'Quality Guaranteed', desc: 'All products are professionally cleaned, inspected, and maintained. You get like-new items every time.' }
          ].map((feature, i) => (
            <div key={i} style={{ background: 'var(--gray-50)', padding: 'var(--space-8)', borderRadius: 'var(--radius-2xl)', border: '1px solid var(--gray-200)', transition: 'all 0.3s ease', cursor: 'default' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 25px 50px rgba(0,0,0,0.12)'; e.currentTarget.style.borderColor = 'var(--primary-300)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--gray-200)'; }}>
              <div style={{ width: '72px', height: '72px', background: 'linear-gradient(135deg, var(--primary-50) 0%, var(--primary-100) 100%)', borderRadius: 'var(--radius-xl)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', marginBottom: 'var(--space-5)', boxShadow: '0 4px 12px rgb(37 99 235 / 0.15)' }}>
                {feature.icon}
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 'var(--space-3)', color: 'var(--gray-900)' }}>{feature.title}</h3>
              <p style={{ color: 'var(--gray-500)', fontSize: '0.9375rem', lineHeight: 1.7 }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div style={{ background: 'var(--gray-100)', padding: 'var(--space-20) 0' }}>
        <div className="container">
          <div className="section-header">
            <h2 style={{ fontSize: '2.5rem', marginBottom: 'var(--space-3)' }}>Browse by Category</h2>
            <p style={{ color: 'var(--gray-500)', fontSize: '1.125rem' }}>Find exactly what you need for your new home</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-6)' }}>
            {[
              { name: 'Furniture', sub: 'Beds, Sofas, Tables & Storage', icon: '🛋️', color1: '#667eea', color2: '#764ba2', link: '/products?category=furniture' },
              { name: 'Appliances', sub: 'Fridges, Washing Machines & TVs', icon: '📺', color1: '#f093fb', color2: '#f5576c', link: '/products?category=appliances' },
              { name: 'Kitchen', sub: 'Microwaves, Cooktops & More', icon: '🍳', color1: '#4facfe', color2: '#00f2fe', link: '/products' },
              { name: 'Cooling', sub: 'Fans, Air Coolers & ACs', icon: '❄️', color1: '#43e97b', color2: '#38f9d7', link: '/products' }
            ].map((cat, i) => (
              <a key={i} href={cat.link} style={{ textDecoration: 'none', color: 'inherit' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}>
                <div style={{ background: 'var(--gray-50)', borderRadius: 'var(--radius-2xl)', border: '1px solid var(--gray-200)', padding: 'var(--space-8)', display: 'flex', alignItems: 'center', gap: 'var(--space-6)', transition: 'all 0.3s ease', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                  <div style={{ width: '110px', height: '110px', background: `linear-gradient(135deg, ${cat.color1}, ${cat.color2})`, borderRadius: 'var(--radius-xl)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem', flexShrink: 0, boxShadow: `0 8px 24px ${cat.color1}40` }}>
                    {cat.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-600)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 'var(--space-1)' }}>{cat.sub}</div>
                    <h3 style={{ fontSize: '1.875rem', fontWeight: 700, margin: '0 0 var(--space-2)', color: 'var(--gray-900)' }}>{cat.name}</h3>
                    <span style={{ color: 'var(--primary-600)', fontWeight: 600, fontSize: '0.9375rem' }}>Explore Collection →</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="container" style={{ padding: 'var(--space-20) 0' }}>
        <div className="section-header">
          <h2 style={{ fontSize: '2.5rem', marginBottom: 'var(--space-3)' }}>How It Works</h2>
          <p style={{ color: 'var(--gray-500)', fontSize: '1.125rem' }}>Get started in just 4 simple steps</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-6)' }}>
          {[
            { step: '01', icon: '🔍', title: 'Browse & Select', desc: 'Explore our catalog and pick the furniture and appliances you need for your home.' },
            { step: '02', icon: '📅', title: 'Choose Plan', desc: 'Select your rental tenure — 3, 6, or 12 months — and schedule your delivery date.' },
            { step: '03', icon: '🚚', title: 'We Deliver', desc: 'Our team delivers, assembles, and sets up everything at your doorstep — completely free.' },
            { step: '04', icon: '🏠', title: 'Enjoy Living', desc: 'Move in and enjoy your new home. Need anything? Our support team is just a call away.' }
          ].map((item, i) => (
            <div key={i} style={{ textAlign: 'center', position: 'relative', padding: 'var(--space-6)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-600)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 'var(--space-3)' }}>Step {item.step}</div>
              <div style={{ fontSize: '4rem', marginBottom: 'var(--space-4)' }}>{item.icon}</div>
              <h4 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 'var(--space-3)', color: 'var(--gray-900)' }}>{item.title}</h4>
              <p style={{ color: 'var(--gray-500)', fontSize: '0.9375rem', lineHeight: 1.7 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--primary-800) 50%, #1e1b4b 100%)', padding: 'var(--space-20) var(--space-6)', textAlign: 'center', color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 50%, rgba(255,255,255,0.1) 0%, transparent 60%)' }}></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: '3rem', color: '#fff', marginBottom: 'var(--space-4)', fontWeight: 800, letterSpacing: '-0.02em' }}>Ready to Move In?</h2>
          <p style={{ fontSize: '1.25rem', opacity: 0.9, marginBottom: 'var(--space-10)', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.7 }}>
            Join thousands of students and professionals who trust RentEase for affordable, hassle-free furniture rentals.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/register" style={{ background: 'var(--gray-50)', color: 'var(--primary-700)', padding: '1.125rem 2.5rem', borderRadius: 'var(--radius-lg)', fontWeight: 700, textDecoration: 'none', fontSize: '1.0625rem', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
              Get Started Free
            </a>
            <a href="/products" style={{ background: 'transparent', color: '#fff', padding: '1.125rem 2.5rem', borderRadius: 'var(--radius-lg)', fontWeight: 700, textDecoration: 'none', fontSize: '1.0625rem', border: '2px solid rgba(255,255,255,0.4)' }}>
              View Catalog
            </a>
          </div>
        </div>
      </div>
    </>
  );
}