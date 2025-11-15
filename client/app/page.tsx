'use client';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Bot, Cpu, Network, Satellite, BrainCircuit, Zap, CircuitBoard, Mail } from 'lucide-react';
import Image from 'next/image';

// Same particle configuration from login
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
];

export default function Home() {
  const { data, isPending } = authClient.useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle redirect in useEffect instead of during render
  useEffect(() => {
    if (!isPending && !data?.session && !data?.user) {
      router.push('/sign-in');
    }
  }, [data, isPending, router]);

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-950 via-[#050508] to-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_70%)]"></div>
        <Spinner className="h-8 w-8 border-cyan-400" />
        <motion.p
          className="mt-4 text-gray-400 font-mono"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          LOADING_NEURAL_INTERFACE...
        </motion.p>
      </div>
    );
  }

  // Return null if no session and redirect is pending
  if (!data?.session && !data?.user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-[#050508] to-black relative overflow-hidden font-sans">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)] animate-grid-flow"></div>

      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-[1px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"
            initial={{ x: '-100%', y: `${(i + 1) * 15}%` }}
            animate={{ x: '100%' }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.5,
              ease: 'linear',
            }}
            style={{ width: '40%', left: `${i * 20}%` }}
          />
        ))}
      </div>

      {/* Floating Particles */}
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
                y: [0, -80, -40, -120],
                x: [0, 40, -20, 15],
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

      {/* Animated Glow Spots */}
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

      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Header Card */}
            <motion.div
              className="border border-gray-800 bg-gray-900/80 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl relative overflow-hidden group hover:border-cyan-400/40 transition-all duration-500"
              whileHover={{ scale: 1.02 }}
            >
              {/* Animated Border */}
              <motion.div
                className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-cyan-400 via-purple-500 to-blue-400 shadow-2xl shadow-cyan-400/30"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />

              {/* Background Glow */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(6,182,212,0.05)_0%,transparent_50%),radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.05)_0%,transparent_50%)]" />

              <div className="flex items-center gap-6">
                {/* Avatar with Tech Border */}
                <div className="relative">
                  <motion.div
                    className="absolute -inset-4 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full blur-lg opacity-20"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                  />
                  <div className="relative z-10 rounded-full border-2 border-cyan-400/50 shadow-2xl overflow-hidden w-32 h-32">
                    <Image
                      src={data?.user?.image || '/vercel.svg'}
                      alt={data?.user?.name || 'User'}
                      width={128}
                      height={128}
                      className="object-cover w-full h-full"
                      priority
                    />
                  </div>
                </div>

                <div className="flex-1 space-y-3">
                  <motion.h1
                    className="text-4xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400 bg-clip-text text-transparent drop-shadow-2xl"
                    animate={{ backgroundPosition: ['0%', '100%'] }}
                    transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
                    style={{ backgroundSize: '200% 200%' }}
                  >
                    Welcome, {data?.user?.name || 'Neural User'}
                  </motion.h1>
                  <div className="flex items-center gap-3">
                    <motion.div
                      className="flex gap-1.5"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <div className="w-2 h-2 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full shadow-lg shadow-purple-400"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full shadow-lg shadow-blue-400"></div>
                    </motion.div>
                    <motion.p
                      className="text-sm text-gray-300 font-mono tracking-widest bg-gray-800/50 px-4 py-2 rounded-full border border-gray-700"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                    >
                      NEURAL_INTERFACE_ACTIVE
                    </motion.p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* User Details Card */}
            <motion.div
              className="border border-gray-800 bg-gray-900/80 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl relative overflow-hidden group hover:border-purple-400/40 transition-all duration-500"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {/* Animated Border */}
              <motion.div
                className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 shadow-2xl shadow-purple-400/30"
                animate={{ x: ['100%', '-100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay: 1 }}
              />

              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Mail className="h-6 w-6 text-purple-400" />
                  <h2 className="text-xl font-bold text-gray-200 font-mono tracking-wider">
                    Email Address
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <motion.p
                      className="text-lg text-gray-100 font-medium break-all bg-gray-800/50 p-4 rounded-2xl border border-gray-700 font-mono"
                      whileHover={{ scale: 1.01 }}
                    >
                      {data?.user?.email}
                    </motion.p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="flex gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Button
                onClick={() =>
                  authClient.signOut({
                    fetchOptions: {
                      onError: ctx => console.log(ctx),
                      onSuccess: () => router.push('/sign-in'),
                    },
                  })
                }
                className="flex-1 h-14 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-bold rounded-2xl transition-all duration-300 relative overflow-hidden group/btn border-0 shadow-2xl"
              >
                {/* Animated background sweep */}
                <motion.div
                  className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.1)_50%,transparent_100%)] opacity-0 group-hover/btn:opacity-100 rounded-2xl"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className="relative font-mono tracking-wider">TERMINATE_SESSION</span>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
