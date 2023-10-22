import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import { apiServer } from "~/trpc/server";
import PageContent from "./PageContent";

export default async function Home() {
  const session = await getServerAuthSession();
  if (!session || !session.user) {
    // This is already done in middleware, but we need this for typesafety
    redirect("/login");
  }

  const [foldersData, notesData] = await Promise.all([
    apiServer.folder.getAll.query(),
    apiServer.note.getAll.query(),
  ]);

  return (
    <PageContent
      foldersData={foldersData}
      notesData={notesData}
      userId={session.user.id}
    />
  );
}
