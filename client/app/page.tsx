'use client';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Bot, Cpu, Network, Satellite, BrainCircuit, Zap, CircuitBoard, Mail } from 'lucide-react';
import Image from 'next/image';

const Home = () => {
  const { data, isPending } = authClient.useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    if (!isPending && !data?.session && !data?.user) {
      router.push('/sign-in');
    }
  }, [data, isPending, router]);

  const handleSignOut = () => {
    setIsSigningOut(true);
    authClient.signOut({
      fetchOptions: {
        onError: ctx => {
          console.log(ctx);
          setIsSigningOut(false);
        },
        onSuccess: () => {
          router.push('/sign-in');
        },
      },
    });
  };

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_70%)]"></div>
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

  if (!data?.session && !data?.user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden font-sans">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]"></div>

      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-[1px] bg-gradient-to-r from-transparent via-gray-700/30 to-transparent"
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

      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-gray-800/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gray-700/10 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.15, 0.1, 0.15],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      />

      <motion.div
        className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-700 to-transparent"
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-600 to-transparent"
        animate={{ x: ['100%', '-100%'] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear', delay: 1 }}
      />

      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="border border-gray-800 bg-gray-900/95 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl relative overflow-hidden group hover:border-gray-600 transition-all duration-500"
              whileHover={{ scale: 1.02 }}
            >
              <motion.div
                className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />

              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.02)_0%,transparent_50%),radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.02)_0%,transparent_50%)]" />

              <div className="flex items-center gap-6">
                <div className="relative">
                  <motion.div
                    className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full blur-lg"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                  />
                  <div className="relative z-10 rounded-full border-2 border-cyan-400/30 shadow-2xl overflow-hidden w-32 h-32">
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
                    className="text-4xl font-black bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-clip-text text-transparent drop-shadow-2xl"
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
                      <div className="w-2 h-2 bg-cyan-500 rounded-full shadow-lg shadow-cyan-500/50"></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full shadow-lg shadow-purple-500/50"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50"></div>
                    </motion.div>
                    <motion.p
                      className="text-sm text-gray-300 font-mono tracking-widest bg-gray-800/80 px-4 py-2 rounded-full border border-gray-700"
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

            <motion.div
              className="border border-gray-800 bg-gray-900/95 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl relative overflow-hidden group hover:border-gray-600 transition-all duration-500"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <motion.div
                className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700"
                animate={{ x: ['100%', '-100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay: 1 }}
              />

              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Mail className="h-6 w-6 text-cyan-400" />
                  <h2 className="text-xl font-bold text-gray-200 font-mono tracking-wider">
                    Email Address
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <motion.p
                      className="text-lg text-gray-100 font-medium break-all bg-gray-800/80 p-4 rounded-2xl border border-gray-700 font-mono"
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
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="flex-1 h-14 bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-white font-bold rounded-2xl transition-all duration-300 relative overflow-hidden group/btn border border-gray-700 shadow-2xl disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                <motion.div
                  className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.1)_50%,transparent_100%)] opacity-0 group-hover/btn:opacity-100 rounded-2xl "
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <div className="relative font-mono tracking-wider flex items-center justify-center gap-2">
                  {isSigningOut && <Spinner className="h-4 w-4 border-white" />}
                  <span>{isSigningOut ? 'TERMINATING...' : 'TERMINATE_SESSION'}</span>
                </div>
              </Button>
            </motion.div>

            <motion.div
              className="text-sm text-gray-500 text-center bg-gray-800/80 backdrop-blur-xl rounded-xl px-6 py-4 border border-gray-700/50 relative overflow-hidden font-mono shadow-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <motion.div
                className="absolute left-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-cyan-500/50 via-purple-500/50 to-blue-500/50"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div
                className="absolute right-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-blue-500/50 via-purple-500/50 to-cyan-500/50"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              />
              <BrainCircuit className="h-4 w-4 text-cyan-400 inline-block mr-2" />
              <span className="drop-shadow">Neural interface operational • System secure</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Home;
