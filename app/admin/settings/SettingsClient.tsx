"use client";

import React, { useState } from "react";
import { User, Bell, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface Props {
  admin: { id: number; email: string; name: string };
  settings: Record<string, string>;
}

export default function SettingsClient({ admin, settings }: Props) {
  const [name, setName] = useState(admin.name);
  const [email, setEmail] = useState(admin.email);
  const [profileMsg, setProfileMsg] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);

  const [notifyNewApp, setNotifyNewApp] = useState(
    settings["notify_new_application"] !== "false",
  );
  const [notifyFilming, setNotifyFilming] = useState(
    settings["notify_filming_reminder"] !== "false",
  );
  const [notifyWeekly, setNotifyWeekly] = useState(
    settings["notify_weekly_summary"] === "true",
  );
  const [notifySaving, setNotifySaving] = useState(false);
  const [notifyMsg, setNotifyMsg] = useState("");

  const handleProfileSave = async () => {
    setProfileSaving(true);
    setProfileMsg("");
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }
      setProfileMsg("Profile updated successfully.");
    } catch (err: unknown) {
      setProfileMsg(
        err instanceof Error ? err.message : "Failed to save profile.",
      );
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordMsg("New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg("Password must be at least 6 characters.");
      return;
    }
    setPasswordSaving(true);
    setPasswordMsg("");
    try {
      const res = await fetch("/api/admin/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to change password");
      }
      setPasswordMsg("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      setPasswordMsg(
        err instanceof Error ? err.message : "Failed to change password.",
      );
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleNotifySave = async () => {
    setNotifySaving(true);
    setNotifyMsg("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notify_new_application: notifyNewApp ? "true" : "false",
          notify_filming_reminder: notifyFilming ? "true" : "false",
          notify_weekly_summary: notifyWeekly ? "true" : "false",
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setNotifyMsg("Notification preferences saved.");
    } catch {
      setNotifyMsg("Failed to save preferences.");
    } finally {
      setNotifySaving(false);
    }
  };

  return (
    <div className="p-8 bg-[#FAF7F3] min-h-screen">
      <div className="mb-8">
        <h1 className="text-[32px] text-[#1C1A1A] montserrat-semibold mb-2">
          Settings
        </h1>
        <p className="text-[#615552] text-[14px]">
          Manage your admin preferences
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[20px] text-[#1C1A1A] flex items-center">
              <User className="w-5 h-5 mr-2" />
              Profile Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-[#777676] text-[12px] mb-1">Name</Label>
              <Input
                className="bg-[#FAF9F8] border-[#ECE8E4] h-[42px]"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <Label className="text-[#777676] text-[12px] mb-1">Email</Label>
              <Input
                className="bg-[#FAF9F8] border-[#ECE8E4] h-[42px]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {profileMsg && (
              <p
                className={`text-sm ${profileMsg.includes("success") ? "text-green-600" : "text-red-600"}`}
              >
                {profileMsg}
              </p>
            )}
            <Button
              className="bg-[#3A2B27] text-white h-[42px]"
              onClick={handleProfileSave}
              disabled={profileSaving}
            >
              {profileSaving ? "Saving..." : "Save Changes"}
            </Button>
          </CardContent>
        </Card>

        {/* Password */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[20px] text-[#1C1A1A] flex items-center">
              <Lock className="w-5 h-5 mr-2" />
              Change Password
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-[#777676] text-[12px] mb-1">
                Current Password
              </Label>
              <Input
                type="password"
                className="bg-[#FAF9F8] border-[#ECE8E4] h-[42px]"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div>
              <Label className="text-[#777676] text-[12px] mb-1">
                New Password
              </Label>
              <Input
                type="password"
                className="bg-[#FAF9F8] border-[#ECE8E4] h-[42px]"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div>
              <Label className="text-[#777676] text-[12px] mb-1">
                Confirm New Password
              </Label>
              <Input
                type="password"
                className="bg-[#FAF9F8] border-[#ECE8E4] h-[42px]"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            {passwordMsg && (
              <p
                className={`text-sm ${passwordMsg.includes("success") ? "text-green-600" : "text-red-600"}`}
              >
                {passwordMsg}
              </p>
            )}
            <Button
              className="bg-[#3A2B27] text-white h-[42px]"
              onClick={handlePasswordChange}
              disabled={passwordSaving}
            >
              {passwordSaving ? "Updating..." : "Update Password"}
            </Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[20px] text-[#1C1A1A] flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[14px] text-[#1C1A1A]">
                  New Application Notifications
                </p>
                <p className="text-[12px] text-[#615552]">
                  Receive email when new applications are submitted
                </p>
              </div>
              <Switch
                checked={notifyNewApp}
                onCheckedChange={setNotifyNewApp}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[14px] text-[#1C1A1A]">
                  Filming Date Reminders
                </p>
                <p className="text-[12px] text-[#615552]">
                  Get notified about upcoming filming dates
                </p>
              </div>
              <Switch
                checked={notifyFilming}
                onCheckedChange={setNotifyFilming}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[14px] text-[#1C1A1A]">Weekly Summary</p>
                <p className="text-[12px] text-[#615552]">
                  Receive weekly application summary
                </p>
              </div>
              <Switch
                checked={notifyWeekly}
                onCheckedChange={setNotifyWeekly}
              />
            </div>
            {notifyMsg && (
              <p
                className={`text-sm ${notifyMsg.includes("saved") ? "text-green-600" : "text-red-600"}`}
              >
                {notifyMsg}
              </p>
            )}
            <Button
              className="bg-[#3A2B27] text-white h-[42px]"
              onClick={handleNotifySave}
              disabled={notifySaving}
            >
              {notifySaving ? "Saving..." : "Save Preferences"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
