import { useState } from "react";
import { Copy, Check, Minus, Plus, Phone } from "lucide-react";
import { scholarshipBookings } from "@/lib/mock-data";

export default function ScholarshipSlots() {
  const [slots, setSlots] = useState(5);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("https://eduveda.com/scholarship/rahul-sharma");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* URL Section */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-3">Your Scholarship URL</h3>
        <div className="flex items-center gap-2">
          <div className="flex-1 rounded-lg border border-input bg-background px-4 py-2 text-sm text-muted-foreground truncate">
            https://eduveda.com/scholarship/rahul-sharma
          </div>
          <button onClick={handleCopy} className="flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>

      {/* Slots control */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-3">Available Slots</h3>
        <div className="flex items-center gap-4">
          <button onClick={() => setSlots(Math.max(0, slots - 1))} className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-accent transition-colors">
            <Minus className="h-4 w-4" />
          </button>
          <span className="text-4xl font-bold text-card-foreground w-16 text-center">{slots}</span>
          <button onClick={() => setSlots(slots + 1)} className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-accent transition-colors">
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{slots} slots currently available</p>
      </div>

      {/* Bookings */}
      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <div className="px-4 py-3 border-b border-border">
          <p className="text-sm text-muted-foreground">166 bookings found</p>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-accent/30">
              {["ID", "Name", "Email", "Phone", "Date", "Slot", "Call Status"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {scholarshipBookings.map((b) => (
              <tr key={b.id} className="border-b border-border/50 hover:bg-accent/20 transition-colors">
                <td className="px-4 py-3 font-medium text-card-foreground">{b.id}</td>
                <td className="px-4 py-3 text-card-foreground">{b.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{b.email}</td>
                <td className="px-4 py-3 text-card-foreground flex items-center gap-1">
                  <Phone className="h-3 w-3 text-muted-foreground" /> {b.phone}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{b.date}</td>
                <td className="px-4 py-3 text-card-foreground">{b.slot}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">{b.callStatus}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
