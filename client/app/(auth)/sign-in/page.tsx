'use client';
import LoginForm from '@/components/login-form';
import { Spinner } from '@/components/ui/spinner';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';

const Page = () => {
  const { data, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (data?.session && data?.user) {
      router.push('/');
    }
  }, [data, router]);

  return <LoginForm isLoading={isPending} />;
};

export default Page;
