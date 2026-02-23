"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function SettingsSecurityPage() {
  const [twoFaEnabled, setTwoFaEnabled] = useState(false);
  const [open2Fa, setOpen2Fa] = useState(false);

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[56px] font-black leading-none">Settings</h1>
          <p className="pt-2 text-lg text-[#667391]">Manage your data, security protocols, and notification preferences.</p>
        </div>
        <div className="rounded-xl border border-[#d7efe3] bg-[#ecfaf2] px-4 py-2 text-sm font-semibold text-[#0f9f61]">
          Settings updated successfully.
        </div>
      </div>

      <div className="flex items-center gap-6 border-b border-[#e6ebf5] pb-2 text-sm font-bold">
        <button className="text-[#8b97af]">Profile</button>
        <button className="border-b-2 border-[#7b2ff7] pb-1 text-[#7b2ff7]">Security</button>
      </div>

      <Card className="border-[#e4eaf4]">
        <CardContent className="space-y-5 p-5">
          <div className="flex flex-wrap items-center justify-between rounded-2xl border border-[#e4eaf4] p-4">
            <div>
              <p className="text-[34px] font-black">Two-Factor Authentication</p>
              <p className="text-base text-[#667391]">Add an extra layer of security by requiring a code from your mobile device.</p>
              <p className="pt-2 text-sm font-bold text-[#6f7b97]">• Status: {twoFaEnabled ? "Enabled" : "Currently Disabled"}</p>
            </div>
            <button
              className={`relative h-8 w-14 rounded-full ${twoFaEnabled ? "bg-[#7b2ff7]" : "bg-[#d7ddea]"}`}
              onClick={() => setOpen2Fa(true)}
            >
              <span className={`absolute top-1 h-6 w-6 rounded-full bg-white transition-all ${twoFaEnabled ? "right-1" : "left-1"}`} />
            </button>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <Card className="border-[#e4eaf4]">
              <CardContent className="space-y-3 p-4">
                <p className="text-[32px] font-black">Change Password</p>
                <div className="space-y-2">
                  <Label>Current Password</Label>
                  <Input type="password" defaultValue="********" />
                </div>
                <div className="space-y-2">
                  <Label>New Password</Label>
                  <Input placeholder="At least 8 characters" />
                </div>
                <div className="space-y-2">
                  <Label>Confirm New Password</Label>
                  <Input placeholder="At least 8 characters" />
                </div>
                <Button className="w-full">Update Password</Button>
              </CardContent>
            </Card>

            <Card className="border-[#e4eaf4]">
              <CardContent className="space-y-3 p-4">
                <p className="text-[32px] font-black">Data Privacy</p>
                <p className="text-sm text-[#6f7b97]">EduVault anonymization ensures student identities are masked in reporting.</p>
                <div className="rounded-xl border border-[#e4eaf4] bg-[#fafcff] p-3">
                  <div className="flex items-center justify-between">
                    <p className="font-bold">EduVault Anonymization</p>
                    <div className="h-6 w-11 rounded-full bg-[#7b2ff7] p-1"><div className="ml-auto h-4 w-4 rounded-full bg-white" /></div>
                  </div>
                  <p className="mt-2 text-xs text-[#7b87a2]">Recommended for compliance.</p>
                </div>
                <div className="rounded-xl border border-[#f2e4ff] bg-[#fbf5ff] p-3 text-xs text-[#7b2ff7]">
                  Student records will be replaced with UUIDs for non-essential administrative queries.
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-[#e4eaf4]">
            <CardContent className="space-y-2 p-4">
              <div className="flex items-center justify-between">
                <p className="text-[30px] font-black">Connected Applications</p>
                <button className="text-sm font-bold text-[#7b2ff7]">Link New App</button>
              </div>
              {[
                "Google Classroom",
                "Canvas LMS",
                "EduVault API v2",
              ].map((app) => (
                <div key={app} className="flex items-center justify-between rounded-xl border border-[#e4eaf4] p-3">
                  <div>
                    <p className="font-bold text-[#27314a]">{app}</p>
                    <p className="text-sm text-[#7e89a4]">Last synced 2 hours ago</p>
                  </div>
                  <Button variant="ghost" size="sm">Revoke</Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button variant="secondary">Discard</Button>
            <Button onClick={() => toast.success("Settings updated")}>Save Changes</Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open2Fa} onOpenChange={setOpen2Fa}>
        <DialogContent className="max-w-[760px] p-0">
          <div className="p-6">
            <DialogHeader>
              <DialogTitle>Set up 2FA</DialogTitle>
            </DialogHeader>

            <div className="mt-4 flex items-center gap-3 text-sm font-bold text-[#8d97af]">
              <span className="rounded-full bg-[#7b2ff7] px-2 py-1 text-white">1 Connect</span>
              <span>—</span>
              <span className="rounded-full bg-[#eef2f8] px-2 py-1">2 Verify</span>
              <span>—</span>
              <span className="rounded-full bg-[#eef2f8] px-2 py-1">3 Backup</span>
            </div>

            <p className="mt-4 text-base text-[#667391]">Scan the QR code with your authenticator app.</p>
            <div className="mt-4 rounded-2xl border border-dashed border-[#d4dcea] bg-[#fafcff] p-6 text-center">
              <div className="mx-auto mb-3 grid h-32 w-32 place-items-center rounded-xl bg-[#fde7cc] text-[#1f2941]">QR</div>
              <button className="text-sm font-semibold text-[#7b2ff7]">Enter code manually</button>
            </div>

            <div className="mt-4 space-y-2">
              <p className="text-xs font-bold uppercase tracking-wide text-[#7d88a2]">Enter 6-digit verification code</p>
              <div className="flex gap-2">
                {Array.from({ length: 6 }).map((_, index) => (
                  <input key={index} className="h-12 w-12 rounded-xl border border-[#d7ddea] text-center text-xl font-bold" defaultValue={index < 3 ? ["4", "8", "2"][index] : "-"} />
                ))}
              </div>
              <p className="text-sm text-[#95a0b8]">Waiting for your 6-digit code from the app...</p>
            </div>

            <div className="mt-5 flex justify-between border-t border-[#edf1f8] pt-4">
              <Button variant="secondary" onClick={() => setOpen2Fa(false)}>Cancel</Button>
              <Button
                onClick={() => {
                  setTwoFaEnabled(true);
                  setOpen2Fa(false);
                  toast.success("2FA enabled");
                }}
              >
                Verify & Continue
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
