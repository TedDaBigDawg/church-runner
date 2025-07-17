"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  blockParishionerByID,
  unblockParishionerByID,
} from "@/actions/parishioners";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

export default function BlockButton({
  id,
  isBlocked,
}: {
  id: string;
  isBlocked: boolean;
}) {
  //   const [isblocked, setIsBlocked] = useState<boolean>(false);
  const router = useRouter();
  const onBlock = async () => {
    try {
      const block = await blockParishionerByID(id);
      router.refresh();
      return block;
    } catch (e: any) {
      console.log(e);
    }
  };

  const onUnBlock = async () => {
    try {
      const block = await unblockParishionerByID(id);
      router.refresh();
      return block;
    } catch (e: any) {
      console.log(e);
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-red-600 hover:text-red-800"
        >
          {isBlocked === true ? "Unblock" : "Block"}
        </Button>
      </DialogTrigger>
      <DialogContent className=" text-black bg-white">
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogDescription>
          {isBlocked === true
            ? "Are you sure you want to unblock this parishioner?"
            : "Are you sure you want to block this parishioner?"}
        </DialogDescription>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={isBlocked === true ? onUnBlock : onBlock}
              className="text-red-600 hover:text-red-800"
            >
              {isBlocked === true ? "Unblock" : "Block"}
            </Button>
          </DialogClose>

          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
