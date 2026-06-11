"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { resolveStartParamRoute } from "@/lib/startapp";

type StartappRouterProps = {
  startParam: string | null;
};

export function StartappRouter({ startParam }: StartappRouterProps) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const target = resolveStartParamRoute(startParam);
    if (!target) return;
    if (pathname !== "/") return;
    if (target === pathname) return;
    router.replace(target);
  }, [pathname, router, startParam]);

  return null;
}
