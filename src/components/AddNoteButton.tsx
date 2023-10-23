import { DocumentPlusIcon } from "@heroicons/react/24/outline";
import React from "react";
import { apiClient } from "~/trpc/react";

const AddNoteButton = ({ parentFolderId }: { parentFolderId: string }) => {
  const utils = apiClient.useUtils();
  const createNote = apiClient.note.create.useMutation({
    onMutate: async ({ id, parentFolderId }) => {
      await utils.note.getAll.cancel();
      const previousNotes = utils.note.getAll.getData();
      if (previousNotes) {
        utils.note.getAll.setData(undefined, [
          ...previousNotes,
          {
            id,
            parentFolderId,
            createdAt: new Date(),
            updatedAt: new Date(),
            userId: "",
            name: `New note ${new Date().toLocaleDateString()}`,
            textJson: JSON.stringify({}),
          },
        ]);
      }
      return previousNotes;
    },
    onError: (error, variables, context) => {
      utils.note.getAll.setData(undefined, context);
    },
    onSuccess: () => {
      void utils.note.getAll.invalidate();
    },
  });
  return (
    <button
      className="rounded bg-slate-700 p-2"
      onClick={() =>
        createNote.mutate({
          id: crypto.randomUUID(),
          parentFolderId,
        })
      }
    >
      <DocumentPlusIcon className="h-6 w-6" />
    </button>
  );
};

export default AddNoteButton;
