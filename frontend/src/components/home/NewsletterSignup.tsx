'use client';

import { useState, FormEvent } from 'react';
 import { motion } from 'framer-motion';
 import { Mail, ArrowRight, Lock, Check } from 'lucide-react';
 import { Button } from '@/components/ui/Button';
 import { Input } from '@/components/ui/Input';

 export function NewsletterSignup() {
   const [email, setEmail] = useState('');
   const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

   const handleSubmit = async (e: FormEvent) => {
     e.preventDefault();
     setStatus('loading');
     await new Promise(resolve => setTimeout(resolve, 1000));
     setStatus('success');
     setEmail('');
   };

   return (
     <section className="py-20 bg-dark-900 border-t border-dark-800">
       <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
         <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6 }}
         >
           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/20 text-primary-300 text-sm font-medium mb-6">
             <Mail className="h-4 w-4" />
             <span>Stay Updated</span>
           </div>

           <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
             Get the latest AI economy insights
           </h2>
           <p className="text-dark-400 text-lg mb-8 max-w-xl mx-auto">
             Join 10,000+ subscribers receiving weekly updates on funding rounds, new products, investor moves, and market trends.
           </p>

           <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
             <div className="flex-1">
               <Input
                 type="email"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 placeholder="your@email.com"
                 required
                 disabled={status === 'loading' || status === 'success'}
                 className="bg-dark-800 border-dark-700 text-white placeholder-dark-500 focus:ring-primary-500"
                 aria-label="Email address"
               />
             </div>
             <Button
               type="submit"
               size="lg"
               loading={status === 'loading'}
               disabled={status === 'success'}
               className="whitespace-nowrap"
             >
               {status === 'success' ? (
                 <>
                   <Check className="h-5 w-5" />
                   Subscribed!
                 </>
               ) : (
                 <>
                   Subscribe
                   <ArrowRight className="h-4 w-4" />
                 </>
               )}
             </Button>
           </form>

           {status === 'success' && (
             <motion.p
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="mt-4 text-green-400 text-sm flex items-center justify-center gap-2"
             >
               <Check className="h-4 w-4" />
               Thanks for subscribing! Check your inbox for a confirmation.
             </motion.p>
           )}

           <p className="mt-6 text-dark-500 text-sm flex items-center justify-center gap-2">
             <Lock className="h-4 w-4" />
             <span>No spam. Unsubscribe anytime. <a href="/privacy" className="text-primary-400 hover:underline">Privacy Policy</a></span>
           </p>

           {/* Trust indicators */}
           <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-dark-500 text-sm">
             <span>Trusted by teams at</span>
             <div className="flex items-center gap-4 opacity-60">
               <span className="font-semibold text-white">OpenAI</span>
               <span className="font-semibold text-white">Anthropic</span>
               <span className="font-semibold text-white">Sequoia</span>
               <span className="font-semibold text-white">a16z</span>
             </div>
           </div>
         </motion.div>
       </div>
     </section>
   );
 }