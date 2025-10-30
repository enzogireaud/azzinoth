'use client';

import { Check, Star, Zap, Shield, Swords, Crown, Quote } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/context';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}



export default function HomePage() {
  const { t } = useLanguage();
  const mainRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const plansRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Header Animation
      const heroTitle = headerRef.current?.querySelector('.hero-title');
      if (heroTitle) {
        gsap.from(heroTitle, {
          y: -50,
          opacity: 0,
          duration: 1,
          delay: 0.3,
          ease: 'power3.out',
        });
      }

      // Plan Cards Animation
      gsap.from('.plan-card', {
        scrollTrigger: {
          trigger: plansRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
        y: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
      });

      // How It Works Steps
      gsap.from('.step-card', {
        scrollTrigger: {
          trigger: howItWorksRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
        y: 80,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out',
      });

      // About Section
      gsap.from('.about-content', {
        scrollTrigger: {
          trigger: aboutRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power2.out',
      });

      // Testimonials
      gsap.from('.testimonial-card', {
        scrollTrigger: {
          trigger: testimonialsRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
        scale: 0.8,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'back.out(1.2)',
      });

      // Floating animation for icons
      gsap.to('.floating-icon', {
        y: -10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.3,
      });

      // Removed parallax effect on background to keep it fixed
    });

    return () => ctx.revert();
  }, []);

  const plans = [
    {
      id: 'medium' as const,
      name: t.plans.medium.name,
      price: '15€',
      description: t.plans.simple.description,
      icon: Shield,
      features: t.plans.simple.features,
      popular: false,
      hasBooking: false,
      rankImage: '/images/DIAMOND.png',
      backgroundImage: '/images/DIAMOND_BACKGROUND.jpg',
      gradientFrom: 'from-blue-600',
      gradientTo: 'to-cyan-400'
    },
    {
      id: 'premium' as const,
      name: t.plans.premium.name,
      price: '25€',
      description: t.plans.medium.description,
      icon: Swords,
      features: t.plans.medium.features,
      popular: true,
      hasBooking: false,
      rankImage: '/images/CHALLENGER.png',
      backgroundImage: '/images/CHALLENGER_BACKGROUND.png',
      gradientFrom: 'from-purple-600',
      gradientTo: 'to-pink-500'
    }
    // Premium and Premium+ plans temporarily hidden
    // {
    //   id: 'premium' as const,
    //   name: t.plans.premium.name,
    //   price: '40€',
    //   description: t.plans.premium.description,
    //   icon: Zap,
    //   features: t.plans.premium.features,
    //   popular: true,
    //   hasBooking: true
    // },
    // {
    //   id: 'premium-plus' as const,
    //   name: t.plans.premiumPlus.name,
    //   price: '60€',
    //   description: t.plans.premiumPlus.description,
    //   icon: Crown,
    //   features: t.plans.premiumPlus.features,
    //   popular: false,
    //   hasBooking: true
    // }
  ];

  return (
    <main ref={mainRef} className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
        style={{
          backgroundImage: `url('/images/background.webp')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundAttachment: 'fixed'
        }}
      />
      
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/75 via-gray-900/60 to-black/70"></div>

      {/* Header */}
      <header ref={headerRef} className="relative z-10 pt-8 pb-4">
        {/* Language Switcher */}
        <div className="absolute top-6 right-6 z-20">
          <LanguageSwitcher />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8">
          <div className="flex items-center justify-center">
            <h1 className="hero-title text-5xl sm:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-cyan-400 via-teal-300 to-green-400 bg-clip-text text-transparent">
              {t.title}
            </h1>
          </div>
        </div>
      </header>

      {/* Pricing Plans */}
      <section ref={plansRef} id="coaching-plans" className="relative z-10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              <span className="text-cyan-400">{t.plansTitle}</span>
            </h2>
            <p className="text-xl text-cyan-100 max-w-4xl mx-auto">
              {t.plansSubtitle}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto px-4">
            {plans.map((plan) => {
              const IconComponent = plan.icon;
              return (
                <div key={plan.id} className="plan-card relative">
                  {/* 3D Card */}
                  <div className="card-3d">
                    {/* Card Wrapper with background */}
                    <div className="card-wrapper">
                      <img 
                        src={plan.backgroundImage} 
                        alt={`${plan.name} background`}
                        className="cover-image"
                      />
                    </div>

                    {/* Rank Character Image (appears on hover) */}
                    <img 
                      src={plan.rankImage} 
                      alt={`${plan.name} rank`}
                      className="rank-character"
                    />

                    {/* Card Content */}
                    <div className="card-content">
                      {/* Title & Price - Hidden on hover */}
                      <div className="card-title-section text-center mb-6">
                        <div className="flex justify-center items-center gap-3 mb-4">
                          <IconComponent className="h-10 w-10 text-cyan-400" />
                          <h3 className="text-4xl font-bold text-white">
                            {plan.name}
                          </h3>
                        </div>
                        <div className="text-6xl font-black bg-gradient-to-r from-cyan-400 via-teal-300 to-green-400 bg-clip-text text-transparent">
                          {plan.price}
                        </div>
                      </div>

                      {/* CTA Button */}
                      <button 
                        className={`w-full py-4 px-8 rounded-xl font-bold text-base transition-all duration-200 cursor-pointer shadow-xl ${
                          plan.popular
                            ? 'bg-gradient-to-r from-cyan-500 to-teal-400 text-black hover:from-cyan-400 hover:to-teal-300 shadow-cyan-500/50 hover:shadow-cyan-400/70 hover:scale-105'
                            : 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-500 hover:to-cyan-400 hover:scale-105'
                        }`}
                        onClick={async () => {
                          try {
                            const response = await fetch('/api/stripe/checkout', {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify({
                                planId: plan.id,
                                hasBooking: plan.hasBooking || false,
                              }),
                            });

                            if (!response.ok) {
                              throw new Error(`HTTP error! status: ${response.status}`);
                            }

                            const data = await response.json();
                            if (data.url) {
                              window.location.href = data.url;
                            } else {
                              console.error('No URL received from checkout');
                            }
                          } catch (error) {
                            console.error('Error creating checkout session:', error);
                            alert('Sorry, there was an error. Please try again or contact support.');
                          }
                        }}
                      >
                        <span className="flex items-center justify-center gap-2">
                          <Zap className="h-4 w-4" />
                          {plan.hasBooking ? t.buttons.bookSession : t.buttons.getCoaching}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section ref={howItWorksRef} className="relative py-20 bg-gradient-to-br from-gray-900 via-black to-gray-800">
        {/* Storm effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-transparent to-green-400/10"></div>
        <div className="absolute top-1/2 left-0 w-32 h-32 bg-green-400/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-green-500/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              <span className="text-cyan-400">{t.howItWorks.title}</span>
            </h2>
            <p className="text-lg text-cyan-100 max-w-3xl mx-auto">
              {t.howItWorks.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {t.howItWorks.steps.map((step, index) => (
              <div key={index} className="step-card text-center group">
                <div className="relative mb-6 flex justify-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:shadow-cyan-400/50 transition-all duration-300">
                    <span className="text-2xl font-bold text-black">{index + 1}</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors">
                  {step.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Me Section */}
      <section ref={aboutRef} className="relative z-10 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              <span className="text-cyan-400">{t.aboutMe.title}</span>
            </h2>
          </div>

          <div className="about-content bg-gradient-to-br from-gray-900/90 to-black/80 backdrop-blur-sm border border-gray-600 rounded-2xl p-8 lg:p-12">
            <div className="space-y-6 text-center">
              <p className="text-gray-200 text-lg leading-relaxed">
                {t.aboutMe.content.intro}
              </p>
              <p className="text-gray-200 text-lg leading-relaxed">
                {t.aboutMe.content.transformation}
              </p>
              <p className="text-gray-200 text-lg leading-relaxed">
                {t.aboutMe.content.passion}
              </p>
              <p className="text-cyan-400 text-lg leading-relaxed font-semibold">
                {t.aboutMe.content.philosophy}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section ref={testimonialsRef} className="relative py-20 bg-gradient-to-br from-black via-gray-900 to-black">
        {/* Storm Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-transparent to-green-400/10"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-green-400/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
        
        {/* Lightning Accents */}
        <div className="floating-icon absolute top-10 right-10 text-green-400/20">
          <Zap className="h-8 w-8 animate-pulse" />
        </div>
        <div className="floating-icon absolute bottom-20 left-10 text-green-500/15">
          <Crown className="h-6 w-6 animate-pulse delay-700" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <Star className="h-8 w-8 text-green-400 mr-3 animate-pulse" />
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                  {t.testimonials.title}
                </span>
              </h2>
              <Star className="h-8 w-8 text-green-400 ml-3 animate-pulse" />
            </div>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              {t.testimonials.subtitle}
            </p>
          </div>

          {/* Testimonials Grid - 2x2 Layout for 4 testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {t.testimonials.examples.map((testimonial, index) => (
              <div key={index} className="testimonial-card group relative">
                {/* Discord-style Message Card */}
                <div className="bg-gradient-to-br from-gray-900/80 to-black/70 rounded-xl border border-gray-700/50 p-6 hover:border-gray-600 transition-all duration-300 shadow-lg h-80 flex flex-col">
                  {/* Discord Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{testimonial.name.charAt(0)}</span>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{testimonial.name}</h4>
                    </div>
                  </div>
                  
                  {/* Message Content */}
                  <div className="p-4 flex-1 overflow-y-auto">
                    <p className="text-gray-300 leading-relaxed text-sm">{testimonial.feedback}</p>
                  </div>

                </div>
              </div>
            ))}
          </div>

          {/* Translation Note */}
          <div className="text-center mt-8">
            <p className="text-gray-500 text-xs italic">{t.testimonials.translationNote}</p>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <p className="text-lg text-gray-300 mb-6">
              {t.testimonials.readyResults} 🚀
            </p>
            <button 
              onClick={() => {
                const plansSection = document.getElementById('coaching-plans');
                plansSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-400 text-black px-8 py-4 rounded-xl font-bold text-lg hover:from-green-400 hover:to-green-300 transition-all duration-300 shadow-lg shadow-green-500/30 cursor-pointer"
            >
              <Crown className="h-5 w-5" />
              {t.testimonials.choosePlan}
              <Zap className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      <footer className="relative bg-black border-t border-green-900/30">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-transparent to-green-400/5"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <Swords className="h-10 w-10 text-cyan-400 mr-4 animate-pulse" />
              <span className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">{t.footer.title}</span>
              <Swords className="h-10 w-10 text-cyan-400 ml-4 animate-pulse" />
            </div>
            <p className="text-cyan-400 text-lg mb-6">
              {t.footer.subtitle}
            </p>
            
            {/* Discord Support Link */}
            <div className="mb-6">
              <p className="text-gray-300 text-sm mb-3">
                {t.footer.support}
              </p>
              <a 
                href="https://discord.gg/TFhZcYHb"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-lg shadow-blue-500/20"
              >
                <Crown className="h-4 w-4" />
                {t.footer.joinCommunity}
                <Zap className="h-4 w-4" />
              </a>
            </div>
            
            <p className="text-gray-500 text-sm">
              {t.footer.copyright}
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
