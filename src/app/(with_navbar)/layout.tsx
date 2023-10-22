import Navbar from "~/components/Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex w-full grow flex-col items-center p-2">
        {children}
      </main>
    </>
  );
}
