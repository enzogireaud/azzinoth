'use client';

import { CheckCircle, ArrowRight, Zap, Crown } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/context';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const planId = searchParams.get('plan') || 'simple';
  
  // Get plan-specific content
  const planKey = planId as keyof typeof t.success.plans;
  const planData = t.success.plans[planKey] || t.success.plans.simple;

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-green-900 relative overflow-hidden flex items-center justify-center p-4">
      {/* Language Switcher */}
      <div className="absolute top-4 right-4 z-20">
        <LanguageSwitcher />
      </div>

      {/* Storm Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-transparent to-green-400/10"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-green-400/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
      
      {/* Lightning Accents */}
      <div className="absolute top-10 right-10 text-green-400/30">
        <Zap className="h-8 w-8 animate-pulse" />
      </div>
      <div className="absolute bottom-20 left-10 text-green-500/20">
        <Zap className="h-6 w-6 animate-pulse delay-500" />
      </div>

      <div className="relative z-10 max-w-2xl w-full bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-2xl border-2 border-green-500/30 p-8 text-center">
        {/* Success animation effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent rounded-2xl"></div>
        
        <div className="relative z-10">
          <div className="mb-8">
            <div className="relative mb-6 flex justify-center">
              <CheckCircle className="h-20 w-20 text-green-400 animate-pulse" />
              <div className="absolute inset-0 bg-green-400/20 rounded-full blur-xl animate-pulse"></div>
            </div>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Crown className="h-6 w-6 text-green-400" />
              <h1 className="text-3xl font-bold text-white">
                {t.success.subtitle}
              </h1>
              <Crown className="h-6 w-6 text-green-400" />
            </div>
            <p className="text-gray-300 text-lg mb-4">
              {t.success.orderComplete}
            </p>
            <div className="bg-gradient-to-br from-cyan-500/10 to-teal-500/5 border border-cyan-400/30 rounded-xl p-4 mb-6">
              <h2 className="text-xl font-bold text-cyan-400 mb-2">
                {planData.title}
              </h2>
              <p className="text-green-400 text-sm">
                {t.success.checkEmail}
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-900/20 to-green-800/10 border border-green-500/30 rounded-xl p-6 mb-8">
            <h3 className="font-bold text-green-400 text-xl mb-4 flex items-center justify-center gap-2">
              <Zap className="h-5 w-5" />
              {t.success.nextSteps}
            </h3>
            <div className="text-gray-300 mb-4">
              <p className="text-sm text-center">{t.success.contactInfo}</p>
            </div>
            <ul className="text-sm text-gray-300 space-y-3 text-left">
              {planData.instructions.map((instruction, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>{instruction}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-br from-purple-900/20 to-blue-800/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <h3 className="font-bold text-purple-400 text-lg mb-3 flex items-center justify-center gap-2">
              <Crown className="h-5 w-5" />
              {t.success.discordAccess}
            </h3>
            <p className="text-gray-300 text-sm text-center mb-4">
              {t.success.discordInstructions}
            </p>
            <ol className="text-sm text-gray-300 space-y-2 mb-4">
              {t.success.discordSteps.map((step, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="bg-purple-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <div className="text-center">
              <a 
                href="https://discord.gg/YOUR_INVITE_CODE_HERE"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-xl font-bold text-sm hover:from-purple-400 hover:to-blue-400 transition-all duration-300 shadow-lg shadow-purple-500/30"
              >
                <Crown className="h-4 w-4" />
                {t.success.joinDiscord}
              </a>
            </div>
          </div>

          <div className="text-center mb-6">
            <p className="text-green-400 font-semibold mb-2">
              {t.success.thankYou}
            </p>
            <p className="text-gray-400 text-sm">
              {t.success.support}
            </p>
          </div>

          <Link 
            href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-400 text-black px-8 py-4 rounded-xl font-bold text-lg hover:from-green-400 hover:to-green-300 transition-all duration-300 shadow-lg shadow-green-500/30 cursor-pointer"
          >
            <ArrowRight className="h-5 w-5" />
            {t.success.backToHome}
            <Zap className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-green-900 relative overflow-hidden flex items-center justify-center p-4">
        <div className="relative z-10 max-w-2xl w-full bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-2xl border-2 border-green-500/30 p-8 text-center">
          <div className="animate-pulse">
            <div className="h-20 w-20 bg-green-400/20 rounded-full mx-auto mb-6"></div>
            <div className="h-8 bg-gray-700 rounded mb-4"></div>
            <div className="h-4 bg-gray-700 rounded mb-8"></div>
            <div className="h-32 bg-gray-700 rounded"></div>
          </div>
        </div>
      </main>
    }>
      <SuccessContent />
    </Suspense>
  );
}