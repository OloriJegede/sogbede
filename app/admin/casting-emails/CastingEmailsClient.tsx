"use client";

import React, { useState, useCallback, useRef } from "react";
import {
  Search,
  Send,
  Mail,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Plus,
  X,
  RefreshCw,
  Clapperboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
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

// ============================================================
// Types
// ============================================================

interface Recipient {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  mediaUrl: string | null;
  filmingDate: string | null;
}

interface EmailHistoryEntry {
  recipientKey: string;
  applicationId: number | null;
  email: string;
  lastStatus: string;
  lastError: string | null;
  lastSubject: string | null;
  attemptCount: number;
  successCount: number;
  lastAttemptAt: string | null;
  lastSuccessAt: string | null;
  application: { firstName: string; lastName: string } | null;
}

interface ManualRecipient {
  name: string;
  email: string;
}

interface Props {
  recipients: Recipient[];
  emailHistory: EmailHistoryEntry[];
}

// ============================================================
// Skeleton Loaders
// ============================================================

function SkeletonTableRows({
  cols,
  rows = 5,
}: {
  cols: number;
  rows?: number;
}) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRow key={i}>
          {Array.from({ length: cols }).map((_, j) => (
            <TableCell key={j}>
              <Skeleton className="h-4 w-full" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

function SkeletonForm() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i}>
          <Skeleton className="h-3 w-24 mb-2" />
          <Skeleton className="h-[42px] w-full rounded-md" />
        </div>
      ))}
    </div>
  );
}

function SkeletonRecipientList() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-8 w-full" />
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-2">
          <Skeleton className="h-4 w-4 rounded" />
          <div className="flex-1">
            <Skeleton className="h-4 w-32 mb-1" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// Main Component
// ============================================================

export default function CastingEmailsClient({
  recipients,
  emailHistory,
}: Props) {
  const router = useRouter();

  // Tab state
  const [activeTab, setActiveTab] = useState<
    "setup" | "recipients" | "history"
  >("setup");
  const [loading, setLoading] = useState(false);

  // Email setup form
  const [shootDate, setShootDate] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [subject, setSubject] = useState(
    "You're officially selected for ṢoGbédè!",
  );
  const [studio, setStudio] = useState("ORIIA STUDIOS - 10990 FM740");
  const [studioMapLink, setStudioMapLink] = useState(
    "https://maps.app.goo.gl/qaxuHeU",
  );
  const [greeting, setGreeting] = useState("Ẹ kú u dédé lwóyì o");
  const [senderName, setSenderName] = useState("");
  const [closingSignature, setClosingSignature] = useState(
    "Ẹ ṣeun lójúlọ́jú,\nThe ṢoGbédè Team",
  );

  // Recipients
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [manualRecipients, setManualRecipients] = useState<ManualRecipient[]>(
    [],
  );
  const [manualName, setManualName] = useState("");
  const [manualEmail, setManualEmail] = useState("");

  // Search states
  const [recipientSearch, setRecipientSearch] = useState("");
  const [historySearch, setHistorySearch] = useState("");

  // Pagination states
  const [recipientPage, setRecipientPage] = useState(1);
  const [historyPage, setHistoryPage] = useState(1);

  // Preview & send
  const [previewHtml, setPreviewHtml] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [sending, setSending] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [result, setResult] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  // ============================================================
  // Helpers
  // ============================================================

  const filteredRecipients = recipients.filter((r) => {
    if (!recipientSearch) return true;
    const q = recipientSearch.toLowerCase();
    return (
      r.firstName.toLowerCase().includes(q) ||
      r.lastName.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      (r.phone && r.phone.includes(q))
    );
  });

  const paginatedRecipients = filteredRecipients.slice(
    (recipientPage - 1) * PAGE_SIZE,
    recipientPage * PAGE_SIZE,
  );

  const filteredHistory = emailHistory.filter((h) => {
    if (!historySearch) return true;
    const q = historySearch.toLowerCase();
    const name = h.application
      ? `${h.application.firstName} ${h.application.lastName}`.toLowerCase()
      : "";
    return (
      name.includes(q) ||
      h.email.toLowerCase().includes(q) ||
      (h.lastSubject && h.lastSubject.toLowerCase().includes(q))
    );
  });

  const paginatedHistory = filteredHistory.slice(
    (historyPage - 1) * PAGE_SIZE,
    historyPage * PAGE_SIZE,
  );

  const toggleRecipient = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const selectAll = () => {
    if (selectedIds.length === filteredRecipients.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredRecipients.map((r) => r.id));
    }
  };

  const clearSelection = () => setSelectedIds([]);

  const addManualRecipient = () => {
    if (!manualName.trim() || !manualEmail.trim()) return;
    if (
      manualRecipients.some(
        (m) => m.email.toLowerCase() === manualEmail.toLowerCase(),
      )
    )
      return;
    setManualRecipients((prev) => [
      ...prev,
      { name: manualName.trim(), email: manualEmail.trim() },
    ]);
    setManualName("");
    setManualEmail("");
  };

  const removeManualRecipient = (email: string) => {
    setManualRecipients((prev) => prev.filter((m) => m.email !== email));
  };

  const handleRefresh = useCallback(() => {
    setLoading(true);
    router.refresh();
    setTimeout(() => setLoading(false), 1500);
  }, [router]);

  // ============================================================
  // Preview
  // ============================================================

  const handlePreview = async () => {
    try {
      const res = await fetch("/api/casting-emails/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shootDate: shootDate || "TBD",
          arrivalTime: arrivalTime || "TBD",
          subject,
          studio,
          studioMapLink,
          greeting,
          senderName,
          closingSignature,
          sampleName: "John Doe",
        }),
      });
      const data = await res.json();
      if (data.html) {
        setPreviewHtml(data.html);
        setShowPreview(true);
      }
    } catch {
      setResult({ type: "error", msg: "Failed to load preview." });
    }
  };

  // ============================================================
  // Send
  // ============================================================

  const handleSend = async () => {
    const totalRecipients = selectedIds.length + manualRecipients.length;
    if (totalRecipients === 0) {
      setResult({
        type: "error",
        msg: "Select at least one recipient or add a manual recipient.",
      });
      return;
    }
    if (!shootDate || !arrivalTime || !studio) {
      setResult({
        type: "error",
        msg: "Shoot date, arrival time, and studio are required.",
      });
      return;
    }

    setSending(true);
    setResult(null);

    try {
      const res = await fetch("/api/casting-emails/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientIds: selectedIds,
          manualRecipients,
          shootDate,
          arrivalTime,
          subject,
          studio,
          studioMapLink,
          greeting,
          senderName,
          closingSignature,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to send");
      }

      const data = await res.json();
      setResult({
        type: "success",
        msg: `Sent ${data.sent} email${data.sent !== 1 ? "s" : ""} successfully!${data.failed > 0 ? ` ${data.failed} failed.` : ""}`,
      });
      setSelectedIds([]);
      setManualRecipients([]);
      // Refresh delivery history
      router.refresh();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to send emails.";
      setResult({ type: "error", msg: message });
    } finally {
      setSending(false);
    }
  };

  // ============================================================
  // Render
  // ============================================================

  return (
    <div className="p-8 bg-[#FAF7F3] min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[32px] text-[#1C1A1A] montserrat-semibold mb-2">
          Casting Email Manager
        </h1>
        <p className="text-[#615552] text-[14px]">
          Configure and send casting invitation emails to approved applicants
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={activeTab === "setup" ? "default" : "outline"}
          className={activeTab === "setup" ? "bg-[#3A2B27] text-white" : ""}
          onClick={() => setActiveTab("setup")}
        >
          <Clapperboard className="w-4 h-4 mr-2" />
          Setup & Send
        </Button>
        <Button
          variant={activeTab === "recipients" ? "default" : "outline"}
          className={
            activeTab === "recipients" ? "bg-[#3A2B27] text-white" : ""
          }
          onClick={() => setActiveTab("recipients")}
        >
          <Users className="w-4 h-4 mr-2" />
          Ready to Shine ({recipients.length})
        </Button>
        <Button
          variant={activeTab === "history" ? "default" : "outline"}
          className={activeTab === "history" ? "bg-[#3A2B27] text-white" : ""}
          onClick={() => setActiveTab("history")}
        >
          <Clock className="w-4 h-4 mr-2" />
          Delivery History ({emailHistory.length})
        </Button>
      </div>

      {/* Result Banner */}
      {result && (
        <div
          className={`mb-4 p-3 rounded text-sm ${
            result.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {result.msg}
        </div>
      )}

      {/* ============== SETUP & SEND TAB ============== */}
      {activeTab === "setup" && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left — Email Setup */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-[20px] text-[#1C1A1A] flex items-center">
                    <Mail className="w-5 h-5 mr-2" />
                    Email Setup
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {loading ? (
                    <SkeletonForm />
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-[#777676] text-[12px] mb-1">
                            Shoot Date
                          </Label>
                          <Input
                            type="date"
                            className="bg-[#FAF9F8] border-[#ECE8E4] h-[42px]"
                            value={shootDate}
                            onChange={(e) => setShootDate(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label className="text-[#777676] text-[12px] mb-1">
                            Arrival Time
                          </Label>
                          <Input
                            type="time"
                            className="bg-[#FAF9F8] border-[#ECE8E4] h-[42px]"
                            value={arrivalTime}
                            onChange={(e) => setArrivalTime(e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-[#777676] text-[12px] mb-1">
                          Email Subject
                        </Label>
                        <Input
                          className="bg-[#FAF9F8] border-[#ECE8E4] h-[42px]"
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-[#777676] text-[12px] mb-1">
                            Studio
                          </Label>
                          <Input
                            className="bg-[#FAF9F8] border-[#ECE8E4] h-[42px]"
                            value={studio}
                            onChange={(e) => setStudio(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label className="text-[#777676] text-[12px] mb-1">
                            Studio Map Link
                          </Label>
                          <Input
                            className="bg-[#FAF9F8] border-[#ECE8E4] h-[42px]"
                            value={studioMapLink}
                            onChange={(e) => setStudioMapLink(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-[#777676] text-[12px] mb-1">
                            Opening Greeting (first line)
                          </Label>
                          <Input
                            className="bg-[#FAF9F8] border-[#ECE8E4] h-[42px]"
                            placeholder="e.g. Ẹ kú u dédé lwóyì o"
                            value={greeting}
                            onChange={(e) => setGreeting(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label className="text-[#777676] text-[12px] mb-1">
                            Sender Name (optional)
                          </Label>
                          <Input
                            className="bg-[#FAF9F8] border-[#ECE8E4] h-[42px]"
                            placeholder="e.g. Latifat, Casting Team"
                            value={senderName}
                            onChange={(e) => setSenderName(e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-[#777676] text-[12px] mb-1">
                          Closing Signature
                        </Label>
                        <Textarea
                          className="bg-[#FAF9F8] border-[#ECE8E4] min-h-[80px]"
                          value={closingSignature}
                          onChange={(e) => setClosingSignature(e.target.value)}
                        />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Manual Recipients */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-[16px] text-[#1C1A1A]">
                    Manual Recipients (optional)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      className="bg-[#FAF9F8] border-[#ECE8E4] h-[42px] flex-1"
                      placeholder="Recipient Name"
                      value={manualName}
                      onChange={(e) => setManualName(e.target.value)}
                    />
                    <Input
                      className="bg-[#FAF9F8] border-[#ECE8E4] h-[42px] flex-1"
                      placeholder="email@example.com"
                      type="email"
                      value={manualEmail}
                      onChange={(e) => setManualEmail(e.target.value)}
                    />
                    <Button
                      className="bg-[#3A2B27] text-white h-[42px]"
                      onClick={addManualRecipient}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-[12px] text-[#777676]">
                    You can send using DB checkboxes, manual list, or both at
                    once. Duplicate emails are sent once.
                  </p>
                  {manualRecipients.length === 0 ? (
                    <p className="text-[13px] text-[#615552] bg-[#FAF9F8] p-3 rounded border border-[#ECE8E4]">
                      No manual recipients added yet.
                    </p>
                  ) : (
                    <div className="border border-[#ECE8E4] rounded-md divide-y divide-[#ECE8E4]">
                      {manualRecipients.map((m) => (
                        <div
                          key={m.email}
                          className="flex items-center justify-between p-2 px-3"
                        >
                          <div>
                            <p className="text-sm text-[#1C1A1A]">{m.name}</p>
                            <p className="text-xs text-[#777676]">{m.email}</p>
                          </div>
                          <button
                            onClick={() => removeManualRecipient(m.email)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right — Recipient Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[20px] text-[#1C1A1A] flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Ready To Shine Recipients
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Actions row */}
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    className="text-[13px]"
                  >
                    <RefreshCw className="w-3.5 h-3.5 mr-1" />
                    Refresh List
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={selectAll}
                    className="text-[13px]"
                  >
                    {selectedIds.length === filteredRecipients.length &&
                    filteredRecipients.length > 0
                      ? "Deselect All"
                      : "Select All"}
                  </Button>
                  {selectedIds.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearSelection}
                      className="text-[13px] text-red-600 border-red-200 hover:bg-red-50"
                    >
                      Clear
                    </Button>
                  )}
                </div>

                <p className="text-[13px] text-[#615552]">
                  {recipients.length} approved applicant
                  {recipients.length !== 1 ? "s" : ""}
                  {selectedIds.length > 0 && (
                    <span className="ml-1 text-[#3A2B27] font-semibold">
                      · {selectedIds.length} selected
                    </span>
                  )}
                </p>

                {/* Search within recipients */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#777676] w-4 h-4" />
                  <Input
                    placeholder="Search recipients..."
                    className="pl-10 bg-[#FAF9F8] border-[#ECE8E4] h-[38px] text-[13px]"
                    value={recipientSearch}
                    onChange={(e) => setRecipientSearch(e.target.value)}
                  />
                </div>

                {/* Recipient list */}
                {loading ? (
                  <SkeletonRecipientList />
                ) : (
                  <div className="max-h-[500px] overflow-y-auto border border-[#ECE8E4] rounded-md divide-y divide-[#ECE8E4]">
                    {filteredRecipients.map((r) => (
                      <label
                        key={r.id}
                        className="flex items-center gap-3 p-2.5 hover:bg-[#FAF9F8] cursor-pointer"
                      >
                        <Checkbox
                          checked={selectedIds.includes(r.id)}
                          onCheckedChange={() => toggleRecipient(r.id)}
                        />
                        {r.mediaUrl ? (
                          <img
                            src={r.mediaUrl}
                            alt=""
                            className="w-8 h-8 rounded-full object-cover bg-[#ECE8E4]"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-[#ECE8E4] flex items-center justify-center text-[11px] text-[#615552] font-semibold">
                            {r.firstName.charAt(0)}
                            {r.lastName.charAt(0)}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-[#1C1A1A] truncate">
                            {r.firstName} {r.lastName}
                          </p>
                          <p className="text-xs text-[#777676] truncate">
                            {r.email}
                          </p>
                        </div>
                        <span className="text-[11px] text-[#615552] whitespace-nowrap">
                          {r.filmingDate
                            ? new Date(r.filmingDate).toLocaleDateString()
                            : "Not selected"}
                        </span>
                      </label>
                    ))}
                    {filteredRecipients.length === 0 && (
                      <p className="text-sm text-[#777676] p-4 text-center">
                        {recipientSearch
                          ? "No recipients match your search."
                          : "No approved applicants found."}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Preview & Send row */}
          <Card className="mt-6">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-3 items-start">
                <Button
                  variant="outline"
                  className="h-[42px]"
                  onClick={handlePreview}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview Email
                </Button>
                <Button
                  className="bg-[#3A2B27] text-white h-[42px]"
                  onClick={() => {
                    const totalRecipients =
                      selectedIds.length + manualRecipients.length;
                    if (totalRecipients === 0) {
                      setResult({
                        type: "error",
                        msg: "Select at least one recipient or add a manual recipient.",
                      });
                      return;
                    }
                    if (!shootDate || !arrivalTime || !studio) {
                      setResult({
                        type: "error",
                        msg: "Shoot date, arrival time, and studio are required.",
                      });
                      return;
                    }
                    setShowConfirm(true);
                  }}
                  disabled={sending}
                >
                  {sending ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send To Selected (
                      {selectedIds.length + manualRecipients.length})
                    </>
                  )}
                </Button>
                {selectedIds.length + manualRecipients.length > 0 && (
                  <p className="text-[13px] text-[#615552] self-center">
                    {selectedIds.length} from DB
                    {manualRecipients.length > 0
                      ? ` + ${manualRecipients.length} manual`
                      : ""}
                  </p>
                )}
              </div>

              {/* Loaded count badge */}
              {recipients.length > 0 && (
                <p className="mt-3 text-[13px] text-green-700 bg-green-50 border border-green-200 rounded p-2 inline-block">
                  Loaded {recipients.length} Ready to Shine recipient
                  {recipients.length !== 1 ? "s" : ""}.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Preview Panel */}
          {showPreview && previewHtml && (
            <Card className="mt-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-[18px] text-[#1C1A1A]">
                    Preview (sample)
                  </CardTitle>
                  <button
                    onClick={() => setShowPreview(false)}
                    className="text-[#615552] hover:text-[#1C1A1A]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border border-[#ECE8E4] rounded-lg overflow-hidden bg-white">
                  <iframe
                    ref={iframeRef}
                    srcDoc={previewHtml}
                    className="w-full border-0"
                    style={{ minHeight: 600 }}
                    title="Email Preview"
                    sandbox="allow-same-origin"
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* ============== RECIPIENT LIST TAB ============== */}
      {activeTab === "recipients" && (
        <>
          {/* Search bar */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#777676] w-4 h-4" />
                  <Input
                    placeholder="Search by name, email or phone..."
                    className="pl-10 bg-[#FAF9F8] border-[#ECE8E4] h-[42px]"
                    value={recipientSearch}
                    onChange={(e) => {
                      setRecipientSearch(e.target.value);
                      setRecipientPage(1);
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto w-full">
                {loading ? (
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-[#FAF9F8]">
                        {[
                          "Photo",
                          "Name",
                          "Email",
                          "Phone",
                          "Filming Date",
                        ].map((h) => (
                          <TableHead
                            key={h}
                            className="text-[12px] font-semibold text-[#615552]"
                          >
                            {h}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <SkeletonTableRows cols={5} />
                    </TableBody>
                  </Table>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-[#FAF9F8]">
                        <TableHead className="text-[12px] font-semibold text-[#615552] w-16">
                          Photo
                        </TableHead>
                        <TableHead className="text-[12px] font-semibold text-[#615552]">
                          Name
                        </TableHead>
                        <TableHead className="text-[12px] font-semibold text-[#615552]">
                          Email
                        </TableHead>
                        <TableHead className="text-[12px] font-semibold text-[#615552]">
                          Phone
                        </TableHead>
                        <TableHead className="text-[12px] font-semibold text-[#615552]">
                          Filming Date
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRecipients.length === 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="text-center text-[14px] text-[#615552] py-8"
                          >
                            {recipientSearch
                              ? "No recipients match your search."
                              : "No approved applicants found."}
                          </TableCell>
                        </TableRow>
                      )}
                      {paginatedRecipients.map((r) => (
                        <TableRow
                          key={r.id}
                          className="hover:bg-[#FAF9F8] transition-colors"
                        >
                          <TableCell>
                            {r.mediaUrl ? (
                              <img
                                src={r.mediaUrl}
                                alt=""
                                className="w-10 h-10 rounded-full object-cover bg-[#ECE8E4]"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-[#ECE8E4] flex items-center justify-center text-[12px] text-[#615552] font-semibold">
                                {r.firstName.charAt(0)}
                                {r.lastName.charAt(0)}
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-[14px] text-[#1C1A1A] font-medium">
                            {r.firstName} {r.lastName}
                          </TableCell>
                          <TableCell className="text-[14px] text-[#615552]">
                            {r.email}
                          </TableCell>
                          <TableCell className="text-[14px] text-[#615552]">
                            {r.phone || "—"}
                          </TableCell>
                          <TableCell className="text-[14px] text-[#615552]">
                            {r.filmingDate
                              ? new Date(r.filmingDate).toLocaleDateString()
                              : "Not selected"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </CardContent>
          </Card>
          <TablePagination
            currentPage={recipientPage}
            totalItems={filteredRecipients.length}
            pageSize={PAGE_SIZE}
            onPageChange={setRecipientPage}
            noun="recipient"
          />
        </>
      )}

      {/* ============== DELIVERY HISTORY TAB ============== */}
      {activeTab === "history" && (
        <>
          {/* Search bar */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#777676] w-4 h-4" />
                  <Input
                    placeholder="Search by name, email or subject..."
                    className="pl-10 bg-[#FAF9F8] border-[#ECE8E4] h-[42px]"
                    value={historySearch}
                    onChange={(e) => {
                      setHistorySearch(e.target.value);
                      setHistoryPage(1);
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto w-full">
                {loading ? (
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-[#FAF9F8]">
                        {[
                          "Recipient",
                          "Email",
                          "Subject",
                          "Status",
                          "Attempts",
                          "Last Attempt",
                        ].map((h) => (
                          <TableHead
                            key={h}
                            className="text-[12px] font-semibold text-[#615552]"
                          >
                            {h}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <SkeletonTableRows cols={6} />
                    </TableBody>
                  </Table>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-[#FAF9F8]">
                        <TableHead className="text-[12px] font-semibold text-[#615552]">
                          Recipient
                        </TableHead>
                        <TableHead className="text-[12px] font-semibold text-[#615552]">
                          Email
                        </TableHead>
                        <TableHead className="text-[12px] font-semibold text-[#615552]">
                          Subject
                        </TableHead>
                        <TableHead className="text-[12px] font-semibold text-[#615552]">
                          Status
                        </TableHead>
                        <TableHead className="text-[12px] font-semibold text-[#615552]">
                          Attempts
                        </TableHead>
                        <TableHead className="text-[12px] font-semibold text-[#615552]">
                          Last Attempt
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredHistory.length === 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="text-center text-[14px] text-[#615552] py-8"
                          >
                            {historySearch
                              ? "No records match your search."
                              : "No email delivery records yet."}
                          </TableCell>
                        </TableRow>
                      )}
                      {paginatedHistory.map((h) => (
                        <TableRow
                          key={h.recipientKey}
                          className="hover:bg-[#FAF9F8] transition-colors"
                        >
                          <TableCell className="text-[14px] text-[#1C1A1A]">
                            {h.application
                              ? `${h.application.firstName} ${h.application.lastName}`
                              : "Unknown"}
                          </TableCell>
                          <TableCell className="text-[14px] text-[#615552]">
                            {h.email}
                          </TableCell>
                          <TableCell className="text-[14px] text-[#615552] max-w-[200px] truncate">
                            {h.lastSubject || "—"}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[12px] ${
                                h.lastStatus === "success"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {h.lastStatus === "success" ? (
                                <CheckCircle className="w-3 h-3" />
                              ) : (
                                <XCircle className="w-3 h-3" />
                              )}
                              {h.lastStatus}
                            </span>
                          </TableCell>
                          <TableCell className="text-[14px] text-[#615552]">
                            {h.attemptCount} ({h.successCount} ok)
                          </TableCell>
                          <TableCell className="text-[14px] text-[#615552]">
                            {h.lastAttemptAt
                              ? new Date(h.lastAttemptAt).toLocaleString()
                              : "—"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </CardContent>
          </Card>
          <TablePagination
            currentPage={historyPage}
            totalItems={filteredHistory.length}
            pageSize={PAGE_SIZE}
            onPageChange={setHistoryPage}
            noun="record"
          />
        </>
      )}

      {/* Send confirmation dialog */}
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Send casting emails?</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to send emails to{" "}
              <strong>{selectedIds.length + manualRecipients.length}</strong>{" "}
              recipient
              {selectedIds.length + manualRecipients.length !== 1 ? "s" : ""}.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-[#3A2B27] text-white hover:bg-[#4e3a34]"
              onClick={() => {
                setShowConfirm(false);
                handleSend();
              }}
            >
              Yes, send now
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
