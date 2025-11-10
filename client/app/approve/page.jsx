import { Suspense } from 'react';
import { Spinner } from '@/components/ui/spinner';
// import DeviceApprovalContent from '@/components/approve-content';

export default function DeviceApprovalPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <h1>APPROVED</h1>
    </Suspense>
  );
}
