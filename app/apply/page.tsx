"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import React, { useState, useRef } from "react";

export default function ApplyPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    country: "",
    age: "",
    occupation: "",
    interests: "",
    filmingDate: "",
    hasPartner: "",
    partnerFirstName: "",
    partnerLastName: "",
    instagramHandle: "",
    tiktokHandle: "",
    additionalNotes: "",
    agreeTerms: false,
    agreeConsent: false,
  });

  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [termsOpen, setTermsOpen] = useState(false);
  const [consentOpen, setConsentOpen] = useState(false);

  const set = (key: string, value: string | boolean) =>
    setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = async () => {
    // Validate
    if (!form.firstName || !form.lastName || !form.email || !form.phone) {
      setResult({ type: "error", msg: "Please fill in all required fields." });
      return;
    }
    if (!form.agreeTerms || !form.agreeConsent) {
      setResult({
        type: "error",
        msg: "You must agree to the terms and consent agreement.",
      });
      return;
    }

    setSubmitting(true);
    setResult(null);

    try {
      // Upload media file first if present
      let mediaUrl = null;
      let mediaFilename = null;
      let mediaSize = null;
      let mediaType = null;

      if (mediaFile) {
        const uploadForm = new FormData();
        uploadForm.append("file", mediaFile);
        uploadForm.append("folder", "applications");

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadForm,
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          mediaUrl = uploadData.url;
          mediaFilename = mediaFile.name;
          mediaSize = String(mediaFile.size);
          mediaType = mediaFile.type;
        }
      }

      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          city: form.city,
          state: form.state,
          country: form.country,
          age: form.age,
          occupation: form.occupation,
          interests: form.interests,
          filmingDate: form.filmingDate || null,
          partnerFirstName:
            form.hasPartner === "yes" ? form.partnerFirstName : null,
          partnerLastName:
            form.hasPartner === "yes" ? form.partnerLastName : null,
          mediaUrl,
          mediaFilename,
          mediaSize,
          mediaType,
          instagramHandle: form.instagramHandle,
          tiktokHandle: form.tiktokHandle,
          additionalNotes: form.additionalNotes,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Submission failed");
      }

      setResult({
        type: "success",
        msg: "Application submitted successfully! We'll review it and get back to you.",
      });
      // Reset form
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        city: "",
        state: "",
        country: "",
        age: "",
        occupation: "",
        interests: "",
        filmingDate: "",
        hasPartner: "",
        partnerFirstName: "",
        partnerLastName: "",
        instagramHandle: "",
        tiktokHandle: "",
        additionalNotes: "",
        agreeTerms: false,
        agreeConsent: false,
      });
      setMediaFile(null);
    } catch (err: unknown) {
      setResult({
        type: "error",
        msg: err instanceof Error ? err.message : "Submission failed.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="bg-[#FAF7F3] py-14">
        <div className="max-w-[960px] rounded-[16px] bg-white mx-auto py-14 px-4 md:px-8 space-y-8">
          <section className="space-y-3 pt-10">
            <h2 className="text-[#1C1A1A] text-[32px] md:text-[48px] text-center skranji">
              Ìforúkosílè Fún SoGbédè
            </h2>
            <div className="text-[#615552] text-[16px] md:text-[24px] text-center">
              (ṢoGbédè Casting Application)
            </div>
            <div className="text-[#615552] text-[14px] md:text-[24px] text-center">
              For inquiries, contact us:{" "}
              <span className="montserrat-semibold">iwadi@sogbede.com</span>
            </div>
          </section>

          {result && (
            <div
              className={`p-4 rounded-lg text-sm ${
                result.type === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {result.msg}
            </div>
          )}

          <section>
            <div className="text-[#1C1A1A] text-[32px] montserrat-semibold mb-4">
              Personal Information
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-[#777676] text-[12px] mb-1">
                  Orúkọ Àkọ́kọ́ (First Name) *
                </Label>
                <Input
                  className="bg-[#FAF9F8] border-[#ECE8E4] h-[42px]"
                  value={form.firstName}
                  onChange={(e) => set("firstName", e.target.value)}
                />
              </div>
              <div>
                <Label className="text-[#777676] text-[12px] mb-1">
                  Orúkọ Ìdílé (Last Name) *
                </Label>
                <Input
                  className="bg-[#FAF9F8] border-[#ECE8E4] h-[42px]"
                  value={form.lastName}
                  onChange={(e) => set("lastName", e.target.value)}
                />
              </div>
              <div>
                <Label className="text-[#777676] text-[12px] mb-1">
                  Ímeèlì (Email) *
                </Label>
                <Input
                  className="bg-[#FAF9F8] border-[#ECE8E4] h-[42px]"
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                />
              </div>
              <div>
                <Label className="text-[#777676] text-[12px] mb-1">
                  Ẹ̀rọ Ìbánisọ̀rọ̀ (Phone Number) *
                </Label>
                <Input
                  className="bg-[#FAF9F8] border-[#ECE8E4] h-[42px]"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                />
              </div>
              <div>
                <Label className="text-[#777676] text-[12px] mb-1">
                  Ìlú (City) *
                </Label>
                <Input
                  className="bg-[#FAF9F8] border-[#ECE8E4] h-[42px]"
                  value={form.city}
                  onChange={(e) => set("city", e.target.value)}
                />
              </div>
              <div>
                <Label className="text-[#777676] text-[12px] mb-1">
                  Ìpínlẹ̀ (State) *
                </Label>
                <Input
                  className="bg-[#FAF9F8] border-[#ECE8E4] h-[42px]"
                  value={form.state}
                  onChange={(e) => set("state", e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <Label className=" text-[#777676] text-[12px] mb-1">
                  Orílẹ̀-èdè (Country) *
                </Label>
                <Input
                  className="bg-[#FAF9F8] border-[#ECE8E4] h-[42px]"
                  value={form.country}
                  onChange={(e) => set("country", e.target.value)}
                />
              </div>
            </div>
          </section>
          <section>
            <div className="text-[#1C1A1A] text-[32px] montserrat-semibold mb-4">
              About You
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-[#777676] text-[12px] mb-1">
                  Ọjọ́ Orí (Age) *
                </Label>
                <Input
                  className="bg-[#FAF9F8] border-[#ECE8E4] h-[42px]"
                  type="number"
                  value={form.age}
                  onChange={(e) => set("age", e.target.value)}
                />
              </div>
              <div>
                <Label className="text-[#777676] text-[12px] mb-1">
                  Iṣẹ́ (Occupation)
                </Label>
                <Input
                  className="bg-[#FAF9F8] border-[#ECE8E4] h-[42px]"
                  value={form.occupation}
                  onChange={(e) => set("occupation", e.target.value)}
                />
              </div>
            </div>
            <div className="pt-5">
              <div>
                <Label className="text-[#777676] text-[12px] mb-1">
                  Àwòrán Ara Rẹ (Upload Photo/Video)
                </Label>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={(e) => setMediaFile(e.target.files?.[0] ?? null)}
                />
                <Button
                  type="button"
                  className="bg-[#F5EEE8] text-[#605F5F] border border-[#EBDDD1]"
                  onClick={() => fileRef.current?.click()}
                >
                  <Image
                    src={"/upload-icon.svg"}
                    width={20}
                    height={20}
                    alt="upload icon"
                    className="mr-2"
                  />
                  {mediaFile ? mediaFile.name : "Choose file"}
                </Button>
              </div>
            </div>
            <div className="text-[#777676] text-[12px] mt-5">
              Sọ fún wa nípa ohun tí o fẹ́ràn. Ohunkóhun. *
            </div>
            <Label className="text-[#777676] text-[12px] mb-2">
              Tell us about your interests, hobbies, passions, or what makes you
              unique. We want to know you.
            </Label>
            <Textarea
              className="bg-[#FAF9F8] border-[#ECE8E4] h-[254px]"
              value={form.interests}
              onChange={(e) => set("interests", e.target.value)}
            />
          </section>
          <section>
            <div className="text-[#1C1A1A] text-[32px] montserrat-semibold mb-4">
              Partner Information
            </div>
            <div className="mb-3">
              <Label className="text-[#777676] text-[12px] mb-1">
                Are you coming with a partner? *
              </Label>
              <RadioGroup
                value={form.hasPartner}
                onValueChange={(v) => set("hasPartner", v)}
                className="flex items-center space-x-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="partner-yes" />
                  <label
                    htmlFor="partner-yes"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Yes
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="partner-no" />
                  <label
                    htmlFor="partner-no"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    No
                  </label>
                </div>
              </RadioGroup>
            </div>
            {form.hasPartner === "yes" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div>
                  <Label className="text-[#777676] text-[12px] mb-1">
                    Partner First Name
                  </Label>
                  <Input
                    className="bg-[#FAF9F8] border-[#ECE8E4] h-[42px]"
                    value={form.partnerFirstName}
                    onChange={(e) => set("partnerFirstName", e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-[#777676] text-[12px] mb-1">
                    Partner Last Name
                  </Label>
                  <Input
                    className="bg-[#FAF9F8] border-[#ECE8E4] h-[42px]"
                    value={form.partnerLastName}
                    onChange={(e) => set("partnerLastName", e.target.value)}
                  />
                </div>
              </div>
            )}
          </section>
          <section>
            <div className="text-[#1C1A1A] text-[32px] montserrat-semibold mb-4">
              Social Media
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-[#777676] text-[12px] mb-1">
                  Instagram Handle
                </Label>
                <Input
                  className="bg-[#FAF9F8] border-[#ECE8E4] h-[42px]"
                  placeholder="@username"
                  value={form.instagramHandle}
                  onChange={(e) => set("instagramHandle", e.target.value)}
                />
              </div>
              <div>
                <Label className="text-[#777676] text-[12px] mb-1">
                  TikTok Handle
                </Label>
                <Input
                  className="bg-[#FAF9F8] border-[#ECE8E4] h-[42px]"
                  placeholder="@username"
                  value={form.tiktokHandle}
                  onChange={(e) => set("tiktokHandle", e.target.value)}
                />
              </div>
            </div>
          </section>
          <section>
            <div className="text-[#1C1A1A] text-[32px] montserrat-semibold mb-4">
              Additional Notes
            </div>
            <Label className="text-[#777676] text-[12px] mb-2">
              Anything else you&apos;d like us to know?
            </Label>
            <Textarea
              className="bg-[#FAF9F8] border-[#ECE8E4] h-[150px]"
              value={form.additionalNotes}
              onChange={(e) => set("additionalNotes", e.target.value)}
            />
          </section>
          <section>
            <div className="text-[#1C1A1A] text-[32px] montserrat-semibold mb-4">
              Filming Dates
            </div>
            <div className="pt-2">
              <div>
                <Label className="text-[#777676] text-[12px] mb-1">
                  Ọjọ́ tí o fẹ́ kópa (Preferred Filming Date) *
                </Label>
                <select
                  className="w-full bg-[#FAF9F8] border border-[#ECE8E4] h-[42px] rounded-md px-3 text-[14px] text-[#1C1A1A]"
                  value={form.filmingDate}
                  onChange={(e) => set("filmingDate", e.target.value)}
                >
                  <option value="">Select a Saturday...</option>
                  {(() => {
                    const saturdays: string[] = [];
                    const d = new Date();
                    // Advance to next Saturday
                    d.setDate(d.getDate() + ((6 - d.getDay() + 7) % 7 || 7));
                    for (let i = 0; i < 16; i++) {
                      const iso = d.toISOString().split("T")[0];
                      const label = d.toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      });
                      saturdays.push(`${iso}|${label}`);
                      d.setDate(d.getDate() + 7);
                    }
                    return saturdays.map((s) => {
                      const [val, label] = s.split("|");
                      return (
                        <option key={val} value={val}>
                          {label}
                        </option>
                      );
                    });
                  })()}
                </select>
              </div>
            </div>
          </section>
          <section>
            <div className="text-[#1C1A1A] text-[32px] montserrat-semibold mb-4">
              Consent
            </div>
            <div className="mb-3 space-y-4">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="agree-terms"
                  checked={form.agreeTerms}
                  onChange={(e) => set("agreeTerms", e.target.checked)}
                  className="w-4 h-4 mt-1 rounded border-gray-300 shrink-0"
                />
                <label
                  htmlFor="agree-terms"
                  className="text-[16px] text-[#1C1A1A] montserrat-semibold"
                >
                  I agree to the{" "}
                  <button
                    type="button"
                    onClick={() => setTermsOpen(true)}
                    className="underline text-[#3A2B27] hover:text-[#756B68]"
                  >
                    Terms and Conditions
                  </button>{" "}
                  *
                </label>
              </div>
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="agree-consent"
                  checked={form.agreeConsent}
                  onChange={(e) => set("agreeConsent", e.target.checked)}
                  className="w-4 h-4 mt-1 rounded border-gray-300 shrink-0"
                />
                <label
                  htmlFor="agree-consent"
                  className="text-[16px] text-[#1C1A1A] montserrat-semibold"
                >
                  I agree to the{" "}
                  <button
                    type="button"
                    onClick={() => setConsentOpen(true)}
                    className="underline text-[#3A2B27] hover:text-[#756B68]"
                  >
                    Filming Consent Agreement
                  </button>{" "}
                  *
                </label>
              </div>
            </div>
          </section>
          <Button
            className="bg-[#3A2B27] text-white w-full h-[72px]"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Application / Firánsé"}
          </Button>
        </div>
      </div>

      {/* Terms & Conditions Dialog */}
      <Dialog open={termsOpen} onOpenChange={setTermsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="skranji text-[28px] text-[#1C1A1A]">
              Terms &amp; Conditions
            </DialogTitle>
            <p className="text-[#615552] text-[13px]">
              Last Updated: December 2024
            </p>
          </DialogHeader>
          <div className="space-y-4 text-[14px]">
            <div className="bg-[#F5EEE8] border-l-4 border-[#756B68] p-4 space-y-2">
              <div className="skranji text-[#1C1A1A] text-[22px]">
                Important Casting Notice
              </div>
              <p className="text-[#333131]">
                Date selection is contingent upon being cast for the show -
                selecting availability does not guarantee participation or
                confirm your casting status. Final filming schedules will be
                confirmed only after the casting process is complete.
              </p>
              <p className="text-[#333131]">
                Selected guest will receive confirmation prior to filming
              </p>
              <p className="text-[#333131]">
                Alternative dates may be offered based on availability
              </p>
              <p className="text-[#333131]">
                Casting decisions are at the sole discretion of the production
                team
              </p>
            </div>
            <div className="space-y-2">
              <div className="skranji text-[#1C1A1A] text-[22px]">
                SMS and Communication Consent
              </div>
              <p className="text-[#333131]">
                By agreeing to these terms, you consent to receive text messages
                and communications related to the show.
              </p>
              <p className="montserrat-semibold text-[#615552]">
                Communication Terms
              </p>
              <p className="text-[#333131]">
                Messages sent via autodialer for show updates · Max 4
                messages/month · Message &amp; Data rates may apply · Text STOP
                to opt out · Text HELP for assistance
              </p>
              <div className="bg-[#F5EEE8] rounded p-3 montserrat-bold text-[13px]">
                This agreement is not a condition of purchase or participation.
              </div>
            </div>
            <div className="space-y-2">
              <div className="skranji text-[#1C1A1A] text-[22px]">
                Background Check &amp; Release Forms
              </div>
              <p className="text-[#333131]">
                Background check authorization for selected guests · Identity
                verification · Signed release forms required before filming ·
                Media consent for filming, broadcasting, and promotional use
              </p>
            </div>
            <div className="space-y-2">
              <div className="skranji text-[#1C1A1A] text-[22px]">
                Privacy Policy
              </div>
              <p className="montserrat-semibold text-[#615552]">
                Information Collection
              </p>
              <p className="text-[#333131]">
                Contact information · Personal details for casting ·
                Photos/videos submitted · Availability preferences
              </p>
              <p className="montserrat-semibold text-[#615552] pt-2">
                Data Protection
              </p>
              <p className="text-[#333131]">
                No mobile information shared with third parties for marketing ·
                Application data used solely for casting · Secure storage of all
                submitted materials · Right to request data deletion
              </p>
            </div>
            <div className="space-y-2">
              <div className="skranji text-[#1C1A1A] text-[22px]">
                Eligibility
              </div>
              <p className="text-[#333131]">
                Must be 18+ · Valid ID required · No legal disputes preventing
                participation · Agreement to all show rules
              </p>
            </div>
            <div className="space-y-2">
              <div className="skranji text-[#1C1A1A] text-[22px]">
                Production Rights &amp; Media Usage
              </div>
              <p className="text-[#333131]">
                By participating, you grant ṢOGBÉDÈ the right to record, film,
                and photograph your participation · Use your name, likeness, and
                voice · Edit and distribute content across media platforms ·
                Retain rights to all recorded material in perpetuity
              </p>
            </div>
            <div className="space-y-2">
              <div className="skranji text-[#1C1A1A] text-[22px]">
                Limitation of Liability
              </div>
              <p className="text-[#333131]">
                ṢOGBÉDÈ and affiliated parties are not liable for injury during
                travel · Personal property damage · Emotional distress from
                competitive outcomes · Technical failures affecting prizes
              </p>
            </div>
            <div className="space-y-2">
              <div className="skranji text-[#1C1A1A] text-[22px]">
                Prize Terms
              </div>
              <p className="text-[#333131]">
                Winners responsible for applicable taxes · Prizes
                non-transferable · Fulfillment within 90 days · Additional terms
                may apply
              </p>
            </div>
            <div className="bg-[#3A2B27] p-4 rounded">
              <p className="text-[#FAFAFA] text-[13px]">
                <span className="montserrat-bold">Email:</span>{" "}
                iwadi@sogbede.com
              </p>
            </div>
            <div className="bg-[#F5EEE8] border border-[#89807D] p-4 rounded text-center montserrat-semibold text-[#3A2B27] text-[13px]">
              By applying, you acknowledge that you have read, understood, and
              agree to be bound by these Terms and Conditions.
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Filming Consent Agreement Dialog */}
      <Dialog open={consentOpen} onOpenChange={setConsentOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="skranji text-[28px] text-[#1C1A1A]">
              Filming Consent Agreement
            </DialogTitle>
            <p className="text-[#615552] text-[13px]">
              This Consent &amp; Release Agreement is for your appearance on
              ṢOGBÉDÈ, produced by ORIIA LLC.
            </p>
          </DialogHeader>
          <div className="space-y-4 text-[14px]">
            <div className="space-y-2">
              <div className="skranji text-[#1C1A1A] text-[22px]">
                1. Filming &amp; Photography
              </div>
              <p className="text-[#333131]">
                The show will be filmed, photographed, and otherwise recorded
                during production. Your voice, image, name, performance, and
                likeness may appear in such recordings.
              </p>
            </div>
            <div className="space-y-2">
              <div className="skranji text-[#1C1A1A] text-[22px]">
                2. Right of Use
              </div>
              <p className="text-[#333131]">
                You grant Producer the full, perpetual, worldwide, irrevocable
                right to use, reproduce, edit, adapt, modify, distribute,
                broadcast, publish, exhibit, and publicly display the
                recordings. This includes television, streaming, YouTube, social
                media, marketing, and advertising. You waive the right to
                inspect or approve the final version.
              </p>
            </div>
            <div className="space-y-2">
              <div className="skranji text-[#1C1A1A] text-[22px]">
                3. Ownership
              </div>
              <p className="text-[#333131]">
                All recordings, photographs, audio, video, and related content
                are the sole and exclusive property of ORIIA LLC. You have no
                ownership, copyright, or other rights to such content.
              </p>
            </div>
            <div className="space-y-2">
              <div className="skranji text-[#1C1A1A] text-[22px]">
                4. Compensation &amp; Prizes
              </div>
              <p className="text-[#333131]">
                Participation is voluntary with no compensation for appearing.
                If your team wins, you&apos;ll receive the prize amount earned
                (up to $2,000 per team). Prize money must be requested before
                leaving the set on filming day. Maximum available prize may vary
                by episode.
              </p>
            </div>
            <div className="space-y-2">
              <div className="skranji text-[#1C1A1A] text-[22px]">
                5. Waiver of Claims
              </div>
              <p className="text-[#333131]">
                You release and hold harmless ORIIA LLC from any claims arising
                from your participation, including claims for defamation,
                invasion of privacy, infringement of publicity rights, or
                misrepresentation.
              </p>
            </div>
            <div className="space-y-2">
              <div className="skranji text-[#1C1A1A] text-[22px]">
                6. Production Rights
              </div>
              <p className="text-[#333131]">
                The Producer has no obligation to use your appearance,
                recordings, or name in the final show. Editing and content
                decisions are at the sole discretion of the production team.
              </p>
            </div>
            <div className="space-y-2">
              <div className="skranji text-[#1C1A1A] text-[22px]">
                7. Confidentiality
              </div>
              <p className="text-[#333131]">
                You agree not to disclose show outcomes, production details, or
                confidential information until officially released by the
                Producer.
              </p>
            </div>
            <div className="space-y-2">
              <div className="skranji text-[#1C1A1A] text-[22px]">
                8. Entire Agreement
              </div>
              <p className="text-[#333131]">
                This Agreement represents the entire understanding between you
                and ORIIA LLC and supersedes all prior discussions or
                agreements.
              </p>
            </div>
            <div className="bg-[#3A2B27] p-4 rounded">
              <p className="text-[#E8E8E8] text-[13px]">
                <span className="montserrat-bold">Acknowledgment: </span>By
                checking the filming consent checkbox and submitting your
                application, you confirm that you have read, understood, and
                voluntarily agreed to all the terms above.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
