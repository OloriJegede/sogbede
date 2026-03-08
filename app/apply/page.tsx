"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
              <Input
                className="bg-[#FAF9F8] border-[#ECE8E4] h-[42px]"
                type="date"
                value={form.filmingDate}
                onChange={(e) => set("filmingDate", e.target.value)}
              />
            </div>
          </div>
        </section>
        <section>
          <div className="text-[#1C1A1A] text-[32px] montserrat-semibold mb-4">
            Consent
          </div>
          <div className="mb-3 space-y-3">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="agree-terms"
                checked={form.agreeTerms}
                onChange={(e) => set("agreeTerms", e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <label
                htmlFor="agree-terms"
                className="text-[16px] text-[#777676]"
              >
                I agree to the Terms and Conditions *
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="agree-consent"
                checked={form.agreeConsent}
                onChange={(e) => set("agreeConsent", e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <label
                htmlFor="agree-consent"
                className="text-[16px] text-[#777676]"
              >
                I agree to the Filming Consent Agreement *
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
  );
}
