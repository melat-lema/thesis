// app/sign-up/page.js
import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <SignUp
        // Temporary page
        appearance={{
          elements: {
            formButtonPrimary: 'bg-blue-600 hover:bg-blue-700',
          },
        }}
      />
    </div>
  );
}