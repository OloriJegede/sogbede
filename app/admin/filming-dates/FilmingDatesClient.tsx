"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Loader2, Search, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CreateEpisodeDialog from "./CreateEpisodeDialog";
import AddContestantDialog from "./AddContestantDialog";
import TablePagination from "@/components/ui/table-pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const PAGE_SIZE = 10;

interface EpisodeMember {
  id: number;
  fullNameSnapshot: string;
  emailSnapshot: string | null;
  photoUrlSnapshot: string | null;
  teamNumber: number;
  seatNumber: number;
  application: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
}

interface Episode {
  id: number;
  episodeNumber: number | null;
  title: string | null;
  shootDate: string | null;
  status: string;
  notes: string | null;
  members: EpisodeMember[];
}

interface Props {
  episodes: Episode[];
}

export default function FilmingDatesClient({ episodes }: Props) {
  const router = useRouter();
  const [updatingEpisode, setUpdatingEpisode] = useState<number | null>(null);
  const [removingMember, setRemovingMember] = useState<number | null>(null);
  const [deletingEpisode, setDeletingEpisode] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [episodeSearch, setEpisodeSearch] = useState("");
  const [episodePage, setEpisodePage] = useState(1);

  const filteredEpisodes = episodes.filter((ep) => {
    if (!episodeSearch) return true;
    const q = episodeSearch.toLowerCase();
    const epNum = ep.episodeNumber != null ? String(ep.episodeNumber) : "";
    const memberNames = ep.members
      .map((m) => m.fullNameSnapshot.toLowerCase())
      .join(" ");
    return (
      epNum.includes(q) ||
      ep.status.toLowerCase().includes(q) ||
      (ep.notes && ep.notes.toLowerCase().includes(q)) ||
      memberNames.includes(q)
    );
  });

  const paginatedEpisodes = filteredEpisodes.slice(
    (episodePage - 1) * PAGE_SIZE,
    episodePage * PAGE_SIZE,
  );

  const getEpisodeStatusColor = (status: string) => {
    switch (status) {
      case "shot":
        return "text-green-700";
      case "cancelled":
        return "text-red-700";
      default:
        return "text-[#615552]";
    }
  };

  const updateEpisode = async (
    episodeId: number,
    data: { status?: string; shootDate?: string | null },
  ) => {
    setUpdatingEpisode(episodeId);
    try {
      await fetch("/api/episodes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: episodeId, ...data }),
      });
      router.refresh();
    } catch {
      // silent
    } finally {
      setUpdatingEpisode(null);
    }
  };

  const removeMember = async (episodeId: number, memberId: number) => {
    setRemovingMember(memberId);
    try {
      await fetch(`/api/episodes/${episodeId}/members`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId }),
      });
      router.refresh();
    } catch {
      // silent
    } finally {
      setRemovingMember(null);
    }
  };

  const deleteEpisode = async (episodeId: number) => {
    setDeletingEpisode(episodeId);
    try {
      await fetch("/api/episodes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: episodeId }),
      });
      router.refresh();
    } catch {
      // silent
    } finally {
      setDeletingEpisode(null);
    }
  };

  const getMember = (ep: Episode, team: number, seat: number) =>
    ep.members.find((m) => m.teamNumber === team && m.seatNumber === seat);

  const exportToCSV = () => {
    const sorted = [...episodes].sort((a, b) => {
      if (!a.shootDate && !b.shootDate) return 0;
      if (!a.shootDate) return 1;
      if (!b.shootDate) return -1;
      return new Date(a.shootDate).getTime() - new Date(b.shootDate).getTime();
    });

    const headers = [
      "Episode",
      "Shoot Date",
      "Status",
      "Notes",
      "Team 1 – Seat 1 Name",
      "Team 1 – Seat 1 Email",
      "Team 1 – Seat 2 Name",
      "Team 1 – Seat 2 Email",
      "Team 2 – Seat 1 Name",
      "Team 2 – Seat 1 Email",
      "Team 2 – Seat 2 Name",
      "Team 2 – Seat 2 Email",
    ];

    const escape = (val: string | null | undefined) => {
      if (val == null) return "";
      const s = String(val).replace(/"/g, '""');
      return /[,"\n]/.test(s) ? `"${s}"` : s;
    };

    const rows = sorted.map((ep) => {
      const shootDateStr = ep.shootDate
        ? new Date(ep.shootDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "";
      const cells: (string | null | undefined)[] = [
        ep.episodeNumber != null ? String(ep.episodeNumber) : "",
        shootDateStr,
        ep.status,
        ep.notes,
      ];
      for (const team of [1, 2]) {
        for (const seat of [1, 2]) {
          const m = getMember(ep, team, seat);
          cells.push(m ? m.fullNameSnapshot : "");
          cells.push(m ? (m.emailSnapshot ?? "") : "");
        }
      }
      return cells.map(escape).join(",");
    });

    const csv = [headers.map(escape).join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `filming-schedule-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8 bg-[#FAF7F3] min-h-screen">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-[32px] text-[#1C1A1A] montserrat-semibold mb-2">
            Episode Planner
          </h1>
          <p className="text-[#615552] text-[14px]">
            Manage episodes, schedule filming, and assign participants
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={exportToCSV}
            className="border-[#ECE8E4] text-[#615552] hover:bg-[#ECE8E4]"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <CreateEpisodeDialog onCreated={() => router.refresh()} />
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#777676] w-4 h-4" />
            <Input
              placeholder="Search episodes, status, contestant names..."
              className="pl-10 bg-[#FAF9F8] border-[#ECE8E4] h-[42px]"
              value={episodeSearch}
              onChange={(e) => {
                setEpisodeSearch(e.target.value);
                setEpisodePage(1);
              }}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {paginatedEpisodes.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="py-8 text-center text-[#615552] text-sm">
              {episodeSearch
                ? "No episodes match your search."
                : "No episodes found. Create one to get started."}
            </CardContent>
          </Card>
        )}

        {paginatedEpisodes.map((ep) => {
          const memberCount = ep.members.length;
          const isUpdating = updatingEpisode === ep.id;

          return (
            <Card key={ep.id} className="relative overflow-hidden">
              <CardHeader className="bg-[#3A2B27] text-white py-3 px-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-[16px] font-semibold">
                    Episode {ep.episodeNumber ?? "—"}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-medium opacity-80">
                      {memberCount}/4
                    </span>
                    <button
                      onClick={() => setConfirmDeleteId(ep.id)}
                      disabled={deletingEpisode === ep.id}
                      className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/20 transition-colors"
                      title="Delete episode"
                    >
                      {deletingEpisode === ep.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-4 space-y-4">
                <div className="flex gap-2 items-center">
                  <Input
                    type="date"
                    defaultValue={
                      ep.shootDate
                        ? new Date(ep.shootDate).toISOString().split("T")[0]
                        : ""
                    }
                    disabled={isUpdating}
                    onChange={(e) => {
                      const val = e.target.value;
                      updateEpisode(ep.id, { shootDate: val || null });
                    }}
                    className="h-[36px] bg-[#FAF9F8] border-[#ECE8E4] text-[13px] flex-1"
                  />
                  <Select
                    defaultValue={ep.status}
                    disabled={isUpdating}
                    onValueChange={(val) =>
                      updateEpisode(ep.id, { status: val })
                    }
                  >
                    <SelectTrigger
                      className={`h-[36px] w-[120px] text-[13px] capitalize border-[#ECE8E4] bg-[#FAF9F8] ${getEpisodeStatusColor(ep.status)}`}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planned">Planned</SelectItem>
                      <SelectItem value="shot">Shot</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  {isUpdating && (
                    <Loader2 className="w-4 h-4 animate-spin text-[#3A2B27] flex-shrink-0" />
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[1, 2].map((team) => (
                    <div key={team}>
                      <p className="text-[12px] font-semibold text-[#615552] mb-2">
                        Team {team}
                      </p>
                      <div className="space-y-2">
                        {[1, 2].map((seat) => {
                          const member = getMember(ep, team, seat);

                          if (member) {
                            return (
                              <div
                                key={`${team}-${seat}`}
                                className="relative group"
                              >
                                <div className="flex flex-col items-center p-2 bg-[#FAF9F8] rounded-lg border border-[#ECE8E4]">
                                  <button
                                    onClick={() =>
                                      removeMember(ep.id, member.id)
                                    }
                                    disabled={removingMember === member.id}
                                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10"
                                  >
                                    {removingMember === member.id ? (
                                      <Loader2 className="w-3 h-3 animate-spin" />
                                    ) : (
                                      <X className="w-3 h-3" />
                                    )}
                                  </button>

                                  {member.photoUrlSnapshot ? (
                                    /* eslint-disable-next-line @next/next/no-img-element */
                                    <img
                                      src={member.photoUrlSnapshot}
                                      alt={member.fullNameSnapshot}
                                      className="w-16 h-16 rounded-lg object-cover mb-1"
                                    />
                                  ) : (
                                    <div className="w-16 h-16 rounded-lg bg-[#3A2B27] flex items-center justify-center text-white text-sm font-semibold mb-1">
                                      {member.fullNameSnapshot
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")
                                        .slice(0, 2)}
                                    </div>
                                  )}
                                  <p className="text-[12px] text-[#1C1A1A] font-medium text-center leading-tight">
                                    {member.fullNameSnapshot}
                                  </p>
                                </div>
                              </div>
                            );
                          }

                          return (
                            <AddContestantDialog
                              key={`${team}-${seat}`}
                              episodeId={ep.id}
                              teamNumber={team}
                              seatNumber={seat}
                              existingMemberAppIds={ep.members
                                .filter((m) => m.application)
                                .map((m) =>
                                  m.application ? m.application.id : 0,
                                )}
                              onAdded={() => router.refresh()}
                            />
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {ep.notes && (
                  <p className="text-[11px] text-[#777676] italic">
                    {ep.notes}
                  </p>
                )}
                <p className="text-[11px] text-[#999]">
                  ID {ep.id}
                  {ep.shootDate && (
                    <> &middot; {new Date(ep.shootDate).toLocaleDateString()}</>
                  )}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <TablePagination
        currentPage={episodePage}
        totalItems={filteredEpisodes.length}
        pageSize={PAGE_SIZE}
        onPageChange={setEpisodePage}
        noun="episode"
      />

      <AlertDialog
        open={confirmDeleteId !== null}
        onOpenChange={(o) => !o && setConfirmDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this episode?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the episode and remove all its
              contestants. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={() => {
                if (confirmDeleteId !== null) {
                  deleteEpisode(confirmDeleteId);
                  setConfirmDeleteId(null);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
