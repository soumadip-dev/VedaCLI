'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth-client';
import {
  Terminal,
  Cpu,
  Sparkles,
  Brain,
  Zap,
  CpuIcon,
  Network,
  Satellite,
  Orbit,
  CircuitBoard,
  CpuCog,
  BrainCircuit,
  NetworkIcon,
  Bot,
  icons,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Pre-defined positions to avoid hydration mismatch
const FLOATING_PARTICLES = [
  { left: '10%', top: '20%', delay: '0s', duration: '20s' },
  { left: '25%', top: '60%', delay: '1s', duration: '18s' },
  { left: '40%', top: '30%', delay: '2s', duration: '22s' },
  { left: '55%', top: '80%', delay: '0.5s', duration: '19s' },
  { left: '70%', top: '40%', delay: '1.5s', duration: '21s' },
  { left: '85%', top: '70%', delay: '2.5s', duration: '17s' },
  { left: '15%', top: '85%', delay: '0.8s', duration: '23s' },
  { left: '30%', top: '15%', delay: '1.2s', duration: '16s' },
  { left: '45%', top: '55%', delay: '2.2s', duration: '20s' },
  { left: '60%', top: '25%', delay: '0.3s', duration: '24s' },
  { left: '75%', top: '65%', delay: '1.8s', duration: '18s' },
  { left: '90%', top: '35%', delay: '2.8s', duration: '22s' },
  { left: '20%', top: '75%', delay: '0.7s', duration: '19s' },
  { left: '35%', top: '45%', delay: '1.3s', duration: '21s' },
  { left: '50%', top: '10%', delay: '2.3s', duration: '17s' },
  { left: '65%', top: '50%', delay: '0.9s', duration: '23s' },
  { left: '80%', top: '20%', delay: '1.7s', duration: '16s' },
  { left: '95%', top: '60%', delay: '2.1s', duration: '20s' },
  { left: '5%', top: '40%', delay: '0.4s', duration: '24s' },
  { left: '95%', top: '90%', delay: '1.1s', duration: '18s' },
];

const LoginForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex flex-col gap-6 justify-center items-center min-h-screen bg-gradient-to-br from-gray-950 via-[#050508] to-black relative overflow-hidden">
      {/* Enhanced Neural Network Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_70%)] animate-grid-flow"></div>

      
      <div className="absolute inset-0 opacity-[0.15] bg-[radial-gradient(circle_at_1px_1px,rgba(6,182,212,0.2)_1px,transparent_0)] bg-[length:30px_30px]"></div>

      
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent"
            initial={{ x: '-100%', y: `${(i + 1) * 12}%` }}
            animate={{ x: '100%' }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.7,
              ease: 'linear',
            }}
            style={{ width: '30%', left: `${i * 15}%` }}
          />
        ))}
      </div>

      
      {mounted && (
        <div className="absolute inset-0">
          {FLOATING_PARTICLES.map((particle, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full shadow-lg shadow-cyan-400/30"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1, 0.5, 1],
                opacity: [0, 1, 0.8, 0],
                y: [0, -100, -50, -150],
                x: [0, 50, -30, 20],
              }}
              transition={{
                duration: parseFloat(particle.duration),
                repeat: Infinity,
                delay: parseFloat(particle.delay),
                ease: 'easeInOut',
              }}
              style={{
                left: particle.left,
                top: particle.top,
              }}
            />
          ))}
        </div>
      )}

      
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.4, 0.2, 0.4],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />

      
      <motion.div
        className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-2xl shadow-cyan-400/30"
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-2xl shadow-blue-400/30"
        animate={{ x: ['100%', '-100%'] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay: 1 }}
      />

      <div className="flex flex-col gap-8 justify-center items-center max-w-4xl w-full relative z-10">
        
        <motion.div
          className="flex flex-col items-center justify-center space-y-6 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative">
            
            <motion.div
              className="absolute -inset-6 bg-gradient-to-r from-cyan-400 via-purple-500 to-blue-400 rounded-3xl blur-3xl opacity-20"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            />

            <motion.div
              className="relative flex items-center gap-6 bg-gray-900/80 backdrop-blur-2xl rounded-3xl p-8 border border-gray-800 shadow-2xl group hover:border-cyan-400/50 transition-all duration-500"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-400/20 rounded-2xl blur-xl" />
                <Bot className="h-20 w-20 text-cyan-400 relative drop-shadow-2xl" />
              </div>

              
              <div className="flex flex-col">
                <motion.h1
                  className="text-7xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400 bg-clip-text text-transparent drop-shadow-2xl tracking-tighter"
                  animate={{ backgroundPosition: ['0%', '100%'] }}
                  transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
                  style={{ backgroundSize: '200% 200%' }}
                >
                  VEDA CLI
                </motion.h1>
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex gap-1.5">
                    <motion.div
                      className="w-2.5 h-2.5 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <motion.div
                      className="w-2.5 h-2.5 bg-purple-400 rounded-full shadow-lg shadow-purple-400"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                    />
                    <motion.div
                      className="w-2.5 h-2.5 bg-blue-400 rounded-full shadow-lg shadow-blue-400"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                    />
                  </div>
                  <motion.p
                    className="text-sm text-gray-300 font-mono tracking-widest bg-gray-800/50 px-4 py-2 rounded-full border border-gray-700 shadow-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    QUANTUM_AI_INTERFACE
                  </motion.p>
                </div>
              </div>
            </motion.div>
          </div>

        
          <motion.div
            className="flex items-center gap-4 text-gray-300 bg-gray-800/60 backdrop-blur-xl rounded-3xl px-8 py-4 border border-gray-700 shadow-2xl group hover:border-cyan-400/40 transition-all duration-300"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Brain className="h-7 w-7 text-cyan-400 drop-shadow-lg" />
            </motion.div>
            <div className="flex items-center gap-3">
              <p className="text-xl font-semibold tracking-wide font-mono drop-shadow-lg">
                Neural-Powered CLI
              </p>
            </div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <NetworkIcon className="h-7 w-7 text-purple-400 drop-shadow-lg" />
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="w-full max-w-lg border-gray-800 bg-gray-900/80 backdrop-blur-2xl shadow-2xl relative overflow-hidden group hover:border-cyan-400/40 transition-all duration-500">
            
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/10 to-cyan-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rounded-2xl"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />

            
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(6,182,212,0.05)_0%,transparent_50%),radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.05)_0%,transparent_50%)]" />

            
            <motion.div
              className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-cyan-400 via-purple-500 to-blue-400 shadow-2xl shadow-cyan-400/30"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />

            
            <motion.div
              className="absolute -bottom-16 -right-16 w-40 h-40 border border-cyan-400/20 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute -top-12 -left-12 w-28 h-28 border border-purple-400/20 rounded-full"
              animate={{ rotate: -360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            />

            <CardContent className="p-8">
              <div className="flex flex-col gap-6">
                
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="outline"
                    className="w-full h-20 border-gray-700 bg-gray-800/50 hover:bg-gray-700/70 transition-all duration-300 group/btn relative overflow-hidden hover:border-cyan-400/50 rounded-2xl shadow-lg"
                    type="button"
                    onClick={() =>
                      authClient.signIn.social({
                        provider: 'github',
                        callbackURL: 'http://localhost:3000',
                      })
                    }
                  >
                    
                    <motion.div
                      className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(6,182,212,0.1)_50%,transparent_100%)] opacity-0 group-hover/btn:opacity-100 rounded-2xl"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />

                    <div className="relative flex items-center justify-center gap-5">
                      
                      <motion.div
                        className="p-4 bg-gray-700/50 rounded-2xl group-hover/btn:bg-cyan-400/20 transition-all duration-300 border border-gray-600 group-hover/btn:border-cyan-400/50 relative shadow-lg"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="absolute inset-0 bg-cyan-400/10 rounded-2xl opacity-0 group-hover/btn:opacity-100" />
                        <Image
                          src={'/github.svg'}
                          alt="Github"
                          height={28}
                          width={28}
                          className="size-7 invert relative drop-shadow-lg"
                        />
                      </motion.div>

                      <div className="flex flex-col items-start">
                        <span className="font-bold text-white drop-shadow-lg tracking-wider group-hover/btn:text-cyan-300 transition-colors text-xl">
                          INITIATE_SYSTEM
                        </span>
                        <span className="text-sm text-gray-400 group-hover/btn:text-cyan-200 transition-colors drop-shadow">
                          Authenticate via GitHub
                        </span>
                      </div>
                    </div>
                  </Button>
                </motion.div>

                <div className="grid grid-cols-2 gap-4 pt-8 border-t border-gray-700/50">
                  {[
                    { name: 'AI Chat', icon: '🙏', color: 'cyan' },
                    { name: 'Code Gen', icon: '🙏', color: 'purple' },
                    { name: 'Cloud AI', icon: '🙏', color: 'blue' },
                    { name: 'Write Code', icon: '🙏', color: 'cyan' },
                  ].map((feature, index) => (
                    <motion.div
                      key={feature.name}
                      className="flex items-center gap-4 text-sm text-gray-300 hover:text-cyan-300 transition-all duration-200 group/feature p-4 rounded-xl bg-gray-800/30 hover:bg-gray-700/50 border border-transparent hover:border-cyan-400/20 shadow-lg"
                      whileHover={{ scale: 1.05 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                    >
                      <motion.div
                        className={`w-3 h-3 bg-${feature.color}-400 rounded-full shadow-lg shadow-${feature.color}-400`}
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                      />
                      <span className="font-mono tracking-wider text-base">{feature.name}</span>
                      <motion.span
                        className="text-sm opacity-0 group-hover/feature:opacity-100 transition-opacity duration-300 ml-auto"
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                      >
                        {feature.icon}
                      </motion.span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          className="text-sm text-gray-400 text-center max-w-md bg-gray-800/40 backdrop-blur-xl rounded-2xl px-8 py-5 border border-gray-700/50 relative overflow-hidden font-mono shadow-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <motion.div
            className="absolute left-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-cyan-400 via-purple-500 to-blue-400 shadow-lg shadow-cyan-400/30"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="absolute right-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-blue-400 via-purple-500 to-cyan-400 shadow-lg shadow-blue-400/30"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          />
          <span className="drop-shadow">
            Authenticate to access quantum neural networks and begin AI operations
          </span>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginForm;
