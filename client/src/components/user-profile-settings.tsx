import React, { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

export default function UserProfileSettings() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    email: user?.username || '',
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      // TODO: Call API to update profile
      setIsEditing(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">👤 Profile Settings</h2>

      <Card className="p-6 space-y-4">
        <div>
          <Label>Display Name</Label>
          {isEditing ? (
            <Input
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              className="mt-2"
            />
          ) : (
            <p className="mt-2 text-slate-600 dark:text-slate-400">{formData.displayName}</p>
          )}
        </div>

        <div>
          <Label>Email</Label>
          <p className="mt-2 text-slate-600 dark:text-slate-400">{formData.email}</p>
        </div>

        <div className="pt-4 border-t flex gap-2">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          ) : (
            <>
              <Button onClick={handleSave} disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            </>
          )}
        </div>
      </Card>

      <Card className="p-6 mt-6">
        <h3 className="font-bold mb-4">📧 Notification Preferences</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-2">
            <input type="checkbox" defaultChecked className="w-4 h-4" />
            <span>Email notifications</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" defaultChecked className="w-4 h-4" />
            <span>Study reminders</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" defaultChecked className="w-4 h-4" />
            <span>Course updates</span>
          </label>
        </div>
      </Card>
    </div>
  );
}
