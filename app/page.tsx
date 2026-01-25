"use client";

import dynamic from "next/dynamic";

const VaultApp = dynamic(
  () => import("@/components/vault/vault-app").then((mod) => mod.VaultApp),
  { ssr: false }
);

export default function Page() {
  return <VaultApp />;
}
