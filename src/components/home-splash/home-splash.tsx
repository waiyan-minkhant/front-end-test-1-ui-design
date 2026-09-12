"use client";

import { useEffect, useState, type ReactNode } from "react";
import { LoadingScreen } from "@/components/loading-screen/loading-screen";

type HomeSplashProps = {
  loadingClassName?: string;
  children: ReactNode;
};

export function HomeSplash({ loadingClassName, children }: HomeSplashProps) {
  const [showHome, setShowHome] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setShowHome(true), 3000);
    return () => window.clearTimeout(id);
  }, []);

  if (!showHome) {
    return <LoadingScreen className={loadingClassName} />;
  }

  return children;
}
