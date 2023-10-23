"use client";

import { FolderPlusIcon } from "@heroicons/react/24/outline";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { apiClient } from "~/trpc/react";

const AddFolderButton = ({ parentFolderId }: { parentFolderId: string }) => {
  const utils = apiClient.useUtils();
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ name: string }>({ defaultValues: { name: "" } });

  const createFolder = apiClient.folder.create.useMutation({
    onMutate: async ({ id, name, parentFolderId }) => {
      await utils.folder.getAll.cancel();
      const previousFolders = utils.folder.getAll.getData();
      if (previousFolders) {
        utils.folder.getAll.setData(undefined, [
          ...previousFolders,
          {
            id,
            name,
            parentFolderId,
            createdAt: new Date(),
            updatedAt: new Date(),
            userId: "",
          },
        ]);
      }
      setOpen(false);
      return previousFolders;
    },
    onError: (error, variables, context) => {
      utils.folder.getAll.setData(undefined, context);
    },
    onSuccess: () => {
      void utils.folder.getAll.invalidate();
    },
  });

  const handleAddFolder: SubmitHandler<{ name: string }> = (data) => {
    createFolder.mutate({
      id: crypto.randomUUID(),
      name: data.name,
      parentFolderId: parentFolderId,
    });
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger className="rounded bg-slate-700 p-2">
        <FolderPlusIcon className="h-6 w-6" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New folder</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(handleAddFolder)}
          className="mt-4 flex flex-col"
        >
          <Input
            type="text"
            placeholder="Folder name"
            {...register("name", {
              required: {
                value: true,
                message: "Name can't be empty...",
              },
            })}
            className={`text-xll border-b border-slate-400 bg-transparent py-2 focus-visible:outline-none ${
              errors.name && "border-red-500"
            }`}
          />
          {errors.name && (
            <span className="pl-2 text-red-500">{errors.name.message}</span>
          )}
          <DialogFooter className="pt-8">
            <Button
              type="submit"
              disabled={createFolder.isLoading}
              className="px-8"
            >
              {createFolder.isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Add</span>
                </>
              ) : (
                <span>Add</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddFolderButton;
