import { Kaushan_Script } from "next/font/google";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import EmailLoginButton from "./EmailLoginButton";
import GitHubLoginButton from "./GitHubLoginButton";

const kaushan = Kaushan_Script({ weight: "400", subsets: ["latin"] });

export default async function LoginPage() {
  const session = await getServerAuthSession();
  if (session && session.user) {
    redirect("/");
  }

  return (
    <>
      <div className="flex w-full grow flex-col items-center justify-center gap-8 bg-slate-200 p-2 dark:bg-slate-800 lg:flex-row lg:gap-16">
        <section className="flex flex-col items-center gap-4">
          <h1 className={`select-none text-8xl ${kaushan.className}`}>
            fiorNote
          </h1>
        </section>
        <section className="flex w-full max-w-md flex-col items-center gap-4 rounded-2xl bg-slate-300 p-6 font-medium shadow-2xl dark:bg-slate-700">
          <div className="w-full">
            <p className="text-2xl font-bold">Log in</p>
            <div className="font-thinn">
              <p>Use one of your already existing passwords:</p>
            </div>
          </div>
          <EmailLoginButton />
          <div className="flex w-full gap-2">
            <i className="bg-border my-auto h-[1px] shrink-0 grow border-b opacity-40" />
            <p className="">or continue with</p>
            <i className="bg-border my-auto h-[1px] shrink-0 grow border-b opacity-40" />
          </div>
          <GitHubLoginButton />
        </section>
      </div>
    </>
  );
}
