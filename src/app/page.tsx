'use client'
import Title from "@/components/Title";
import Words from "@/components/Words";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    const params = new URLSearchParams(document.location.search);
    const need_refresh = params.get("refresh");
    if (need_refresh) {
      router.push("/")
      router.refresh()
    }
  }, [])

  return (
    <>
      {/* spacing */}
      <Title />
      {/* words xxx */}
      <Words num={40} />
    </>
  );
}
