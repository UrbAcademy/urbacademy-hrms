import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { UserPlus, Loader2 } from "lucide-react";

export default function RegisterEmployee() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    department: "Frontend",
    role: "Junior Developer",
  });

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Generate a random temporary password
      const tempPassword = "Urb" + Math.floor(Math.random() * 10000) + "!";
      
      // 2. Generate the next Employee ID (In a real app, you'd fetch the highest ID from the DB and add 1)
      const newEmpId = `EDV-2024-${Math.floor(Math.random() * 900 + 100)}`; 
      const email = `${newEmpId}@urbacademy.com`;

      // 3. Create the user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: tempPassword,
        options: {
          data: {
            full_name: formData.fullName,
            employee_id: newEmpId,
          }
        }
      });

      if (authError) throw authError;

      // 4. Save their professional details to your 'employees' table
      const { error: dbError } = await supabase
        .from('employees')
        .insert([
          { 
            user_id: authData.user?.id, 
            employee_id: newEmpId,
            full_name: formData.fullName,
            department: formData.department,
            role: formData.role
          }
        ]);

      if (dbError) throw dbError;

      // 5. Success! Show HR the credentials to give to the employee
      alert(`Success! Employee Created. \n\nGive this to the new hire:\nID: ${newEmpId}\nTemp Password: ${tempPassword}`);
      
    } catch (error: any) {
      alert("Error creating employee: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-card border border-border rounded-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 bg-primary/20 text-primary rounded-lg flex items-center justify-center">
          <UserPlus size={20} />
        </div>
        <h2 className="text-xl font-bold">Onboard New Employee</h2>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block text-sm text-muted-foreground mb-1">Full Name</label>
          <input 
            type="text" required
            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
            className="w-full p-3 bg-background border border-border rounded-xl"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Department</label>
            <select 
              onChange={(e) => setFormData({...formData, department: e.target.value})}
              className="w-full p-3 bg-background border border-border rounded-xl"
            >
              <option>Frontend</option>
              <option>Backend</option>
              <option>Sales</option>
              <option>HR</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Role</label>
            <input 
              type="text" required placeholder="e.g. Senior Dev"
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              className="w-full p-3 bg-background border border-border rounded-xl"
            />
          </div>
        </div>

        <button 
          type="submit" disabled={loading}
          className="w-full bg-primary text-primary-foreground p-3 rounded-xl font-bold mt-4 flex justify-center items-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" /> : "Generate ID & Create Account"}
        </button>
      </form>
    </div>
  );
}