import React from 'react';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className="min-h-screen w-full bg-black">{children}</div>;
};

export default AuthLayout;
