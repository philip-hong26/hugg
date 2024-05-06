"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "@/trpc/react";

export function CreateWorkflow() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const createWorkflow = api.workflow.create.useMutation({
    onSuccess: () => {
      router.refresh();
      setName("");
      setEmail("");
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createWorkflow.mutate({ candidateEmail: email, name });
      }}
      className="flex flex-col gap-2"
    >
      <input
        type="text"
        placeholder="Title"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-full px-4 py-2 text-black"
      />
      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded-full px-4 py-2 text-black"
      />
      <button
        type="submit"
        className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
        disabled={createWorkflow.isPending}
      >
        {createWorkflow.isPending ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
