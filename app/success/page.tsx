import { CheckCircle, ArrowRight, Zap, Crown } from 'lucide-react';
import Link from 'next/link';

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-green-900 relative overflow-hidden flex items-center justify-center p-4">
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

      <div className="relative z-10 max-w-lg w-full bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-2xl border-2 border-green-500/30 p-8 text-center">
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
                Toplane Mastery Unlocked!
              </h1>
              <Crown className="h-6 w-6 text-green-400" />
            </div>
            <p className="text-gray-300 text-lg">
              Your coaching session has been purchased. Get ready to dominate the toplane with Master-level strategies!
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-900/20 to-green-800/10 border border-green-500/30 rounded-xl p-6 mb-8">
            <h2 className="font-bold text-green-400 text-xl mb-4 flex items-center justify-center gap-2">
              <Zap className="h-5 w-5" />
              Next Steps to Toplane Glory
            </h2>
            <ul className="text-sm text-gray-300 space-y-3 text-left">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                Check your email for detailed instructions from Azzinoth
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                Share your OP.GG and recent toplane replays
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                Live session packages: you'll receive a Calendly link to book your time
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                All coaching delivered within 24-48 hours as promised
              </li>
            </ul>
          </div>

          <Link 
            href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-400 text-black px-8 py-4 rounded-xl font-bold text-lg hover:from-green-400 hover:to-green-300 transition-all duration-300 shadow-lg shadow-green-500/30"
          >
            <ArrowRight className="h-5 w-5" />
            Return to Base
            <Zap className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </main>
  );
}
