'use client';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { authClient } from '@/lib/auth-client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { CheckCircle, XCircle, Smartphone, Cpu, Satellite, BrainCircuit } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const DeviceApprovalContent = () => {
  const { data, isPending } = authClient.useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const userCode = searchParams.get('user_code');
  const [isProcessing, setIsProcessing] = useState({
    approve: false,
    deny: false,
  });

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]"></div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          <Spinner className="w-8 h-8 text-cyan-400" />
        </motion.div>
      </div>
    );
  }

  if (!data?.session && !data?.user) {
    router.push('/sign-in');
    return null;
  }

  const handleApprove = async () => {
    setIsProcessing({ approve: true, deny: false });
    try {
      toast.loading('Approving device...', { id: 'loading' });
      await authClient.device.approve({ userCode: userCode! });
      toast.dismiss('loading');
      toast.success('Device approved successfully!');
      router.push('/');
    } catch (error) {
      toast.error('Failed to approve device');
    }
    setIsProcessing({ approve: false, deny: false });
  };

  const handleDeny = async () => {
    setIsProcessing({ approve: false, deny: true });
    try {
      toast.loading('Denying device...', { id: 'deny' });
      await authClient.device.deny({ userCode: userCode! });
      toast.dismiss('deny');
      toast.success('Device access denied!');
      router.push('/');
    } catch (error) {
      toast.error('Failed to deny device');
    }
    setIsProcessing({ approve: false, deny: false });
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden py-8">
      {/* Modern Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]"></div>

      {/* Subtle Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.3)_1px,transparent_0)] bg-[length:40px_40px]"></div>

      {/* Animated Scan Lines */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-[1px] bg-gradient-to-r from-transparent via-gray-700/20 to-transparent"
            initial={{ x: '-100%', y: `${(i + 1) * 20}%` }}
            animate={{ x: '100%' }}
            transition={{
              duration: 6 + i * 0.5,
              repeat: Infinity,
              delay: i * 1,
              ease: 'linear',
            }}
            style={{ width: '30%', left: `${i * 25}%` }}
          />
        ))}
      </div>

      {/* Animated Background Orbs */}
      <motion.div
        className="absolute top-10 left-10 w-64 h-64 bg-gray-800/5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.05, 0.1, 0.05],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-56 h-56 bg-gray-700/5 rounded-full blur-3xl"
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.08, 0.05, 0.08],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      />

      <div className="flex flex-col gap-6 justify-center items-center w-full max-w-md relative z-10 px-4">
        {/* Header Section - Compact */}
        <motion.div
          className="flex flex-col items-center justify-center text-center w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative w-full">
            <motion.div
              className="absolute -inset-3 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-500 rounded-2xl blur-2xl opacity-5"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            />

            <motion.div
              className="relative flex flex-col items-center gap-3 bg-gray-900/95 backdrop-blur-2xl rounded-2xl p-6 border border-gray-800 shadow-2xl group hover:border-gray-600 transition-all duration-500"
              whileHover={{ scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-500/10 rounded-xl blur-lg" />
                <Smartphone className="h-12 w-12 text-cyan-400 relative drop-shadow-xl" />
              </div>

              <div className="flex flex-col items-center">
                <motion.h1
                  className="text-2xl font-black bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-clip-text text-transparent drop-shadow-xl tracking-tight text-center"
                  animate={{ backgroundPosition: ['0%', '100%'] }}
                  transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse' }}
                  style={{ backgroundSize: '200% 200%' }}
                >
                  AUTHORIZE DEVICE
                </motion.h1>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex gap-1">
                    <motion.div
                      className="w-1.5 h-1.5 bg-cyan-500 rounded-full shadow-md shadow-cyan-500/50"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <motion.div
                      className="w-1.5 h-1.5 bg-purple-500 rounded-full shadow-md shadow-purple-500/50"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                    />
                    <motion.div
                      className="w-1.5 h-1.5 bg-blue-500 rounded-full shadow-md shadow-blue-500/50"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                    />
                  </div>
                  <motion.p
                    className="text-xs text-gray-400 font-mono tracking-widest bg-gray-800/80 px-2 py-1 rounded-full border border-gray-700 shadow-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    PENDING_APPROVAL
                  </motion.p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Main Content Container - Compact */}
        <motion.div
          className="w-full border border-gray-800 bg-gray-900/95 backdrop-blur-2xl rounded-2xl p-6 shadow-2xl relative overflow-hidden group hover:border-gray-600 transition-all duration-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-gray-700/0 via-gray-700/5 to-gray-700/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rounded-2xl"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />

          <div className="space-y-4 relative z-10">
            {/* Device Code Display */}
            <div>
              <motion.label
                className="block text-sm font-medium text-gray-300 mb-2 font-mono tracking-wider"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                DEVICE_CODE
              </motion.label>
              <motion.div
                className="w-full px-4 py-3 bg-gray-800/80 border-2 border-gray-700 rounded-xl text-white font-mono text-center text-lg tracking-widest backdrop-blur-sm transition-all duration-300 shadow-lg group/code hover:border-cyan-500"
                whileHover={{ scale: 1.01 }}
              >
                <motion.p
                  className="text-cyan-400 font-bold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {userCode || 'XXXX-XXXX'}
                </motion.p>
              </motion.div>
            </div>

            {/* Account Info */}
            <div>
              <motion.label
                className="block text-sm font-medium text-gray-300 mb-2 font-mono tracking-wider"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                ACCOUNT
              </motion.label>
              <motion.div
                className="w-full px-3 py-2 bg-gray-800/60 border border-gray-700 rounded-xl text-white font-mono text-center text-sm backdrop-blur-sm transition-all duration-300 shadow-lg"
                whileHover={{ backgroundColor: 'rgba(31, 41, 55, 0.8)' }}
              >
                <p className="text-gray-300 truncate text-xs">{data?.user?.email}</p>
              </motion.div>
            </div>

            {/* Security Warning */}
            <motion.div
              className="p-3 bg-gray-800/80 border border-gray-700 rounded-xl backdrop-blur-sm shadow-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <p className="text-xs text-gray-400 leading-relaxed font-mono tracking-wide text-center">
                Only approve if you initiated this request. Never share authorization codes.
              </p>
            </motion.div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-1">
              {/* Approve Button */}
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={handleApprove}
                  disabled={isProcessing.approve}
                  className="w-full py-3 px-4 bg-gradient-to-r from-green-900/80 to-green-800/80 text-white font-bold rounded-xl hover:from-green-800 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 relative overflow-hidden group/btn shadow-xl font-mono tracking-wider text-sm border border-green-700/50 cursor-pointer"
                >
                  <motion.div
                    className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.1)_50%,transparent_100%)] opacity-0 group-hover/btn:opacity-100 rounded-xl"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <AnimatePresence mode="wait">
                    {isProcessing.approve ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2 relative"
                      >
                        <Spinner className="w-4 h-4" />
                        <span>APPROVING...</span>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="default"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2 relative"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>APPROVE_DEVICE</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>

              {/* Deny Button */}
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={handleDeny}
                  disabled={isProcessing.deny}
                  className="w-full py-3 px-4 bg-gradient-to-r from-gray-800 to-gray-700 text-white font-bold rounded-xl hover:from-gray-700 hover:to-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 relative overflow-hidden group/btn shadow-xl font-mono tracking-wider text-sm border border-gray-700 cursor-pointer"
                >
                  <motion.div
                    className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.1)_50%,transparent_100%)] opacity-0 group-hover/btn:opacity-100 rounded-xl"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <AnimatePresence mode="wait">
                    {isProcessing.deny ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2 relative"
                      >
                        <Spinner className="w-4 h-4" />
                        <span>DENYING...</span>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="default"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2 relative"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>DENY_ACCESS</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Footer Note - Compact */}
        <motion.div
          className="text-xs text-gray-500 text-center w-full bg-gray-800/80 backdrop-blur-xl rounded-xl px-4 py-3 border border-gray-700/50 relative overflow-hidden font-mono shadow-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <BrainCircuit className="h-3 w-3 text-cyan-400 inline-block mr-2" />
          <span className="drop-shadow">Secure device authentication</span>
        </motion.div>
      </div>
    </div>
  );
};

export default DeviceApprovalContent;
