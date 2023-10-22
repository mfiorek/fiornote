import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import { serverApi } from "~/trpc";
import PageContent from "./PageContent";

export default async function Home() {
  const session = await getServerAuthSession();
  if (!session || !session.user) {
    // This is already done in middleware, but we need this for typesafety
    redirect("/login");
  }

  // const foldersData = await serverApi.folder.getAll.query();
  // const notesData = await serverApi.note.getAll.query();
  const [foldersData, notesData] = await Promise.all([
    serverApi.folder.getAll.query(),
    serverApi.note.getAll.query(),
  ]);

  return (
    <PageContent
      foldersData={foldersData}
      notesData={notesData}
      userId={session.user.id}
    />
  );
}
