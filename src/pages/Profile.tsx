import { useState } from "react";
import { User, Mail, Phone, Lock, Bell, Palette, Globe, LogOut, Camera, Save } from "lucide-react";
import { currentUser } from "@/lib/mock-data";

export default function Profile() {
  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Avatar */}
      <div className="rounded-2xl border border-border bg-card p-6 flex flex-col items-center">
        <div className="relative mb-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold">
            RS
          </div>
          <button className="absolute bottom-0 right-0 rounded-full bg-accent p-1.5 border border-border hover:bg-muted transition-colors">
            <Camera className="h-3.5 w-3.5 text-foreground" />
          </button>
        </div>
        <p className="text-lg font-semibold text-card-foreground">{currentUser.name}</p>
        <p className="text-sm text-muted-foreground">{currentUser.role} • {currentUser.employeeId}</p>
      </div>

      {/* Personal Info */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <h3 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
          <User className="h-5 w-5 text-primary" /> Personal Information
        </h3>
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-card-foreground">Full Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm text-foreground focus:border-primary focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-card-foreground">Phone</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm text-foreground focus:border-primary focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-card-foreground">Email</label>
            <input value={currentUser.email} disabled className="w-full rounded-lg border border-input bg-muted px-4 py-2 text-sm text-muted-foreground cursor-not-allowed" />
          </div>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          <Save className="h-4 w-4" /> Save Changes
        </button>
      </div>

      {/* Security */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <h3 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
          <Lock className="h-5 w-5 text-primary" /> Security
        </h3>
        <button className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-accent transition-colors">
          Change Password
        </button>
      </div>

      {/* Preferences */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <h3 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
          <Palette className="h-5 w-5 text-primary" /> Preferences
        </h3>
        <div className="space-y-3">
          {[
            { icon: Bell, label: "Email Notifications", desc: "Receive email updates" },
            { icon: Palette, label: "Theme", desc: "Dark mode (default)" },
            { icon: Globe, label: "Language", desc: "English" },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between rounded-lg bg-accent/30 p-3">
              <div className="flex items-center gap-3">
                <item.icon className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-card-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
              <div className="h-5 w-9 rounded-full bg-primary/20 p-0.5">
                <div className="h-4 w-4 rounded-full bg-primary translate-x-4" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Logout */}
      <button className="flex w-full items-center justify-center gap-2 rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors">
        <LogOut className="h-4 w-4" /> Logout
      </button>
    </div>
  );
}
