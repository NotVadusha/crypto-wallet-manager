"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { fileToDataUrl } from "@/lib/image-utils";
import { getStoredAvatar, setStoredAvatar } from "@/lib/wallet-storage";

interface AvatarSetProps {
  address: string;
}

export const AvatarSet = ({ address }: AvatarSetProps) => {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setAvatar(getStoredAvatar(address));
  }, [address]);

  const triggerFileSelect = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = "";

      if (!file || !file.type.startsWith("image/")) return;

      setLoading(true);
      try {
        const dataUrl = await fileToDataUrl(file);
        setStoredAvatar(address, dataUrl);
        setAvatar(dataUrl);
        setDialogOpen(false);
      } catch {
      } finally {
        setLoading(false);
      }
    },
    [address]
  );

  const clearAvatar = useCallback(() => {
    setStoredAvatar(address, null);
    setAvatar(null);
    setDialogOpen(false);
  }, [address]);

  const wrapperClass =
    "size-10 rounded-full overflow-hidden cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        aria-hidden
        onChange={handleFileSelect}
      />
      <button
        type="button"
        onClick={() => setDialogOpen(true)}
        className={wrapperClass}
        aria-label={avatar ? "Change avatar" : "Set avatar"}
      >
        <Avatar className="size-full">
          <AvatarImage
            src={avatar ?? "/assets/upload-button.png"}
            alt=""
            className="size-full rounded-full object-cover"
          />
        </Avatar>
      </button>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Wallet avatar</DialogTitle>
            <DialogDescription>
              Choose an image from your device. It will be saved locally for
              this wallet.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter showCloseButton={false}>
            {avatar && (
              <Button variant="outline" onClick={clearAvatar}>
                Remove avatar
              </Button>
            )}
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={triggerFileSelect} disabled={loading}>
              {loading ? "Loading…" : "Choose image"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
