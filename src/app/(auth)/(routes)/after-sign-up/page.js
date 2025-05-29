import { Suspense } from "react";
import { SetupHandler } from "./SetUpHandler";

export default function AfterSignUpPage() {
  return (
    <Suspense fallback={<div className="text-center mt-20 text-xl">Loading...</div>}>
      <SetupHandler />
    </Suspense>
  );
}
