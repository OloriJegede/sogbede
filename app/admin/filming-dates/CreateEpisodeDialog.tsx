"use client";

import React, { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

interface Props {
  onCreated: () => void;
}

export default function CreateEpisodeDialog({ onCreated }: Props) {
  const [open, setOpen] = useState(false);
  const [episodeNumber, setEpisodeNumber] = useState("");
  const [shootDate, setShootDate] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const resetForm = () => {
    setEpisodeNumber("");
    setShootDate("");
    setNotes("");
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/episodes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          episodeNumber: episodeNumber ? Number(episodeNumber) : null,
          shootDate: shootDate || null,
          notes: notes.trim() || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create episode");
        return;
      }

      resetForm();
      setOpen(false);
      onCreated();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button className="bg-[#3A2B27] hover:bg-[#4A3B37] text-white">
          <Plus className="w-4 h-4 mr-2" />
          Create Episode
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle className="text-[20px] text-[#1C1A1A] montserrat-semibold">
            Create Episode
          </DialogTitle>
          <p className="text-[13px] text-[#615552]">
            Each episode has 2 teams, 2 contestants each (4 total).
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-[13px]">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <Label className="text-[12px] text-[#777676]">Episode Number</Label>
            <Input
              type="number"
              min={1}
              placeholder="Auto if empty"
              value={episodeNumber}
              onChange={(e) => setEpisodeNumber(e.target.value)}
              className="h-[42px] bg-[#FAF9F8] border-[#ECE8E4]"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-[12px] text-[#777676]">Shoot Date</Label>
            <Input
              type="date"
              value={shootDate}
              onChange={(e) => setShootDate(e.target.value)}
              className="h-[42px] bg-[#FAF9F8] border-[#ECE8E4]"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-[12px] text-[#777676]">
              Notes (optional)
            </Label>
            <Textarea
              placeholder="Anything important for this episode"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-[#FAF9F8] border-[#ECE8E4] resize-none"
              rows={3}
            />
          </div>

          <DialogFooter className="gap-2 pt-2">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="border-[#ECE8E4] text-[#615552]"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#3A2B27] hover:bg-[#4A3B37] text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating…
                </>
              ) : (
                "Create Episode"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
