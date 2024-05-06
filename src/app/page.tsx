import { CreateWorkflow } from "@/app/_components/create-post";
import { api } from "@/trpc/server";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Welcome to the <span className="text-[hsl(280,100%,70%)]">Hugg</span>{" "}
          App
        </h1>
        <CrudShowcase />
      </div>
    </main>
  );
}

async function CrudShowcase() {
  const allFlows = await api.workflow.getAll();

  return (
    <div className="w-full max-w-xs space-y-2">
      <CreateWorkflow />
      {allFlows.length > 0 ? (
        <table className="w-full">
          <caption className="text-xl font-bold">All Workflows</caption>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {allFlows.map((flow) => (
              <tr key={flow.id}>
                <td>{flow.name}</td>
                <td>{flow.candidateEmail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>You have no workflows yet.</p>
      )}
    </div>
  );
}
