"use client";

import React, { useState } from "react";
import {
  Send,
  Mail,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TablePagination from "@/components/ui/table-pagination";

const PAGE_SIZE = 10;

interface Recipient {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
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

interface Props {
  applications: Recipient[];
  emailHistory: EmailHistoryEntry[];
}

const templates = [
  {
    key: "applicationReceived",
    title: "Application Received",
    desc: "Confirm application submission",
  },
  {
    key: "applicationApproved",
    title: "Application Approved",
    desc: "Notify applicant of approval",
  },
  {
    key: "applicationRejected",
    title: "Application Rejected",
    desc: "Politely decline application",
  },
  {
    key: "filmingReminder",
    title: "Filming Date Reminder",
    desc: "Remind about upcoming filming",
  },
];

export default function MessagesClient({ applications, emailHistory }: Props) {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [recipientFilter, setRecipientFilter] = useState("all");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [templateType, setTemplateType] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<"compose" | "history">("compose");
  const [recipientSearch, setRecipientSearch] = useState("");
  const [historySearch, setHistorySearch] = useState("");
  const [historyPage, setHistoryPage] = useState(1);

  const filteredApps = (() => {
    let list =
      recipientFilter === "all"
        ? applications
        : applications.filter((a) => a.status === recipientFilter);
    if (recipientSearch) {
      const q = recipientSearch.toLowerCase();
      list = list.filter(
        (a) =>
          `${a.firstName} ${a.lastName}`.toLowerCase().includes(q) ||
          a.email.toLowerCase().includes(q),
      );
    }
    return list;
  })();

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
    if (selectedIds.length === filteredApps.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredApps.map((a) => a.id));
    }
  };

  const handleTemplateClick = (key: string) => {
    setTemplateType(key);
    setSubject("");
    setMessage("");
  };

  const handleSend = async () => {
    if (selectedIds.length === 0) {
      setResult({
        type: "error",
        msg: "Please select at least one recipient.",
      });
      return;
    }
    if (!templateType && (!subject || !message)) {
      setResult({
        type: "error",
        msg: "Please provide a subject and message, or select a template.",
      });
      return;
    }

    setSending(true);
    setResult(null);

    try {
      const res = await fetch("/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientIds: selectedIds,
          templateType: templateType || undefined,
          customSubject: subject || undefined,
          customMessage: message || undefined,
        }),
      });

      if (!res.ok) throw new Error("Failed to send");
      setResult({
        type: "success",
        msg: `Emails sent to ${selectedIds.length} recipient(s)!`,
      });
      setSelectedIds([]);
      setSubject("");
      setMessage("");
      setTemplateType("");
    } catch {
      setResult({ type: "error", msg: "Failed to send emails. Try again." });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-8 bg-[#FAF7F3] min-h-screen">
      <div className="mb-8">
        <h1 className="text-[32px] text-[#1C1A1A] montserrat-semibold mb-2">
          Messages
        </h1>
        <p className="text-[#615552] text-[14px]">
          Send emails to applicants and view delivery history
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={activeTab === "compose" ? "default" : "outline"}
          className={activeTab === "compose" ? "bg-[#3A2B27] text-white" : ""}
          onClick={() => setActiveTab("compose")}
        >
          <Mail className="w-4 h-4 mr-2" />
          Compose
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

      {activeTab === "compose" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Compose Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-[20px] text-[#1C1A1A] flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Recipients ({selectedIds.length} selected)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2 items-center">
                  <Select
                    value={recipientFilter}
                    onValueChange={setRecipientFilter}
                  >
                    <SelectTrigger className="w-[160px] bg-[#FAF9F8] border-[#ECE8E4] h-[36px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Applicants</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm" onClick={selectAll}>
                    {selectedIds.length === filteredApps.length
                      ? "Deselect All"
                      : "Select All"}
                  </Button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#777676] w-4 h-4" />
                  <Input
                    placeholder="Search recipients..."
                    className="pl-10 bg-[#FAF9F8] border-[#ECE8E4] h-[36px] text-[13px]"
                    value={recipientSearch}
                    onChange={(e) => setRecipientSearch(e.target.value)}
                  />
                </div>
                <div className="max-h-[250px] overflow-y-auto border border-[#ECE8E4] rounded-md divide-y divide-[#ECE8E4]">
                  {filteredApps.map((app) => (
                    <label
                      key={app.id}
                      className="flex items-center gap-3 p-2 hover:bg-[#FAF9F8] cursor-pointer"
                    >
                      <Checkbox
                        checked={selectedIds.includes(app.id)}
                        onCheckedChange={() => toggleRecipient(app.id)}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[#1C1A1A] truncate">
                          {app.firstName} {app.lastName}
                        </p>
                        <p className="text-xs text-[#777676] truncate">
                          {app.email}
                        </p>
                      </div>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded capitalize ${
                          app.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : app.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {app.status}
                      </span>
                    </label>
                  ))}
                  {filteredApps.length === 0 && (
                    <p className="text-sm text-[#777676] p-4 text-center">
                      No applicants match the filter.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-[20px] text-[#1C1A1A] flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  {templateType
                    ? `Template: ${templateType}`
                    : "Custom Message"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {templateType ? (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
                    Using template &ldquo;{templateType}&rdquo;. Recipients will
                    receive personalized emails.
                    <Button
                      variant="link"
                      size="sm"
                      className="ml-2 text-blue-700 underline p-0 h-auto"
                      onClick={() => setTemplateType("")}
                    >
                      Use custom instead
                    </Button>
                  </div>
                ) : (
                  <>
                    <div>
                      <Label className="text-[#777676] text-[12px] mb-1">
                        Subject
                      </Label>
                      <Input
                        className="bg-[#FAF9F8] border-[#ECE8E4] h-[42px]"
                        placeholder="Email subject..."
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-[#777676] text-[12px] mb-1">
                        Message (HTML supported)
                      </Label>
                      <Textarea
                        className="bg-[#FAF9F8] border-[#ECE8E4] h-[200px]"
                        placeholder="Type your message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      />
                    </div>
                  </>
                )}
                <Button
                  className="bg-[#3A2B27] text-white w-full h-[42px]"
                  onClick={handleSend}
                  disabled={sending}
                >
                  {sending ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send to {selectedIds.length} Recipient
                      {selectedIds.length !== 1 ? "s" : ""}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Templates Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[20px] text-[#1C1A1A]">
                Email Templates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {templates.map((t) => (
                <div
                  key={t.key}
                  onClick={() => handleTemplateClick(t.key)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    templateType === t.key
                      ? "border-[#3A2B27] bg-[#F5EEE8]"
                      : "bg-[#FAF9F8] border-[#ECE8E4] hover:border-[#3A2B27]"
                  }`}
                >
                  <h3 className="text-[14px] text-[#1C1A1A] font-semibold mb-1">
                    {t.title}
                  </h3>
                  <p className="text-[12px] text-[#615552]">{t.desc}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Delivery History Tab */}
      {activeTab === "history" && (
        <>
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="relative">
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
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto w-full">
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
                      <TableRow key={h.recipientKey}>
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
    </div>
  );
}
