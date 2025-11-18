'use client';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ShieldAlert, Cpu, Network, Satellite, BrainCircuit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Spinner } from '@/components/ui/spinner';

const DeviceAuthorizationPage = () => {
  const [userCode, setUserCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  // Fix: Use useEffect to handle mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    setIsLoading(true);
    setError(null);

    try {
      const formattedCode = userCode.trim().replace(/-/g, '').toUpperCase();

      const response = await authClient.device({
        query: { user_code: formattedCode },
      });

      if (response.data) {
        router.push(`/approve?user_code=${formattedCode}`);
      }
    } catch (error) {
      setError('Invalid or expired code');
    } finally {
      setIsLoading(false);
    }
  }

  function handleCodeChange(event: React.ChangeEvent<HTMLInputElement>) {
    let value = event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (value.length > 4) {
      value = value.slice(0, 4) + '-' + value.slice(4, 8);
    }
    setUserCode(value);
  }

  // Fix: Prevent rendering mismatched content during hydration
  if (!isMounted) {
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

  return (
    <div className="flex flex-col gap-6 justify-center items-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Modern Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]"></div>

      {/* Subtle Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.3)_1px,transparent_0)] bg-[length:40px_40px]"></div>

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
              delay: i * 0.8,
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
          duration: 10,
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
          duration: 8,
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

      <div className="flex flex-col gap-8 justify-center items-center max-w-4xl w-full relative z-10">
        <motion.div
          className="flex flex-col items-center justify-center space-y-6 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative">
            <motion.div
              className="absolute -inset-4 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-500 rounded-3xl blur-3xl opacity-10"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            />

            <motion.div
              className="relative flex items-center gap-4 bg-gray-900/95 backdrop-blur-2xl rounded-2xl p-6 border border-gray-800 shadow-2xl group hover:border-gray-600 transition-all duration-500"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-500/10 rounded-xl blur-lg" />
                <ShieldAlert className="h-12 w-12 text-cyan-400 relative drop-shadow-xl" />
              </div>

              <div className="flex flex-col">
                <motion.h1
                  className="text-5xl font-black bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-clip-text text-transparent drop-shadow-xl tracking-tight"
                  animate={{ backgroundPosition: ['0%', '100%'] }}
                  transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse' }}
                  style={{ backgroundSize: '200% 200%' }}
                >
                  DEVICE AUTH
                </motion.h1>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex gap-1">
                    <motion.div
                      className="w-2 h-2 bg-cyan-500 rounded-full shadow-md shadow-cyan-500/50"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-purple-500 rounded-full shadow-md shadow-purple-500/50"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-blue-500 rounded-full shadow-md shadow-blue-500/50"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                    />
                  </div>
                  <motion.p
                    className="text-xs text-gray-400 font-mono tracking-widest bg-gray-800/80 px-3 py-1 rounded-full border border-gray-700 shadow-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    SECURE_VERIFICATION
                  </motion.p>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="flex items-center gap-3 text-gray-300 bg-gray-800/90 backdrop-blur-xl rounded-xl px-6 py-3 border border-gray-700 shadow-xl group hover:border-gray-500 transition-all duration-300"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Cpu className="h-5 w-5 text-cyan-400 drop-shadow" />
            </motion.div>
            <div className="flex items-center gap-2">
              <p className="text-base font-semibold tracking-wide font-mono drop-shadow">
                Device Authorization Required
              </p>
            </div>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Satellite className="h-5 w-5 text-purple-400 drop-shadow" />
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md border border-gray-800 bg-gray-900/95 backdrop-blur-2xl rounded-2xl p-6 shadow-2xl relative overflow-hidden group hover:border-gray-600 transition-all duration-500"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-gray-700/0 via-gray-700/8 to-gray-700/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rounded-2xl"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.02)_0%,transparent_50%),radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.02)_0%,transparent_50%)]" />

            <motion.div
              className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />

            <motion.div
              className="absolute -bottom-12 -right-12 w-32 h-32 border border-cyan-500/5 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute -top-8 -left-8 w-20 h-20 border border-purple-500/5 rounded-full"
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            />

            <div className="space-y-6 relative z-10">
              {/* Code Input */}
              <div>
                <motion.label
                  htmlFor="code"
                  className="block text-sm font-medium text-gray-300 mb-3 font-mono tracking-wider"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  DEVICE_CODE
                </motion.label>
                <motion.input
                  id="code"
                  type="text"
                  value={userCode}
                  onChange={handleCodeChange}
                  placeholder="XXXX-XXXX"
                  maxLength={9}
                  className="w-full px-4 py-3 bg-gray-800/80 border-2 border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 font-mono text-center text-lg tracking-widest backdrop-blur-sm transition-all duration-300 shadow-lg"
                  whileFocus={{ scale: 1.02 }}
                />
                <motion.p
                  className="text-xs text-gray-500 mt-2 font-mono tracking-wide"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  Locate this code on the device requiring authorization
                </motion.p>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-3 rounded-xl bg-gray-800/90 border border-gray-700 text-gray-200 text-sm font-mono backdrop-blur-sm shadow-lg"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                type="submit"
                disabled={isLoading || userCode.length < 9}
                className="w-full py-3 px-4 bg-gradient-to-r from-gray-800 to-gray-700 text-white font-bold rounded-xl hover:from-gray-700 hover:to-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 relative overflow-hidden group/btn shadow-xl font-mono tracking-wider text-base border border-gray-700 cursor-pointer"
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.1)_50%,transparent_100%)] opacity-0 group-hover/btn:opacity-100 rounded-xl"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="relative flex items-center justify-center gap-2">
                  {isLoading && <Spinner className="h-4 w-4 border-white" />}
                  {isLoading ? 'VERIFYING...' : 'AUTHORIZE_DEVICE'}
                </span>
              </motion.button>

              <motion.div
                className="p-4 bg-gray-800/80 border border-gray-700 rounded-xl backdrop-blur-sm shadow-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <p className="text-xs text-gray-400 leading-relaxed font-mono tracking-wide">
                  This authorization code is uniquely generated for your device and will expire
                  shortly. Maintain confidentiality and do not share with unauthorized parties.
                </p>
              </motion.div>
            </div>
          </form>
        </motion.div>

        <motion.div
          className="text-sm text-gray-500 text-center max-w-md bg-gray-800/80 backdrop-blur-xl rounded-xl px-6 py-4 border border-gray-700/50 relative overflow-hidden font-mono shadow-xl"
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
          <span className="drop-shadow">
            Secure device authentication required for neural network access
          </span>
        </motion.div>
      </div>
    </div>
  );
};

export default DeviceAuthorizationPage;
