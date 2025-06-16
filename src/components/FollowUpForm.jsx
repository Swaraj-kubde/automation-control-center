
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

export function FollowUpForm({ followUp, onSubmit, onClose, isLoading }) {
  const [formData, setFormData] = useState({
    client_name: "",
    email: "",
    followed_up: false,
    last_follow_up: "",
  });

  useEffect(() => {
    if (followUp) {
      setFormData(followUp);
    }
  }, [followUp]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="bg-white dark:bg-gray-800 w-full max-w-md mx-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold dark:text-gray-100">
            Edit Follow-up
          </CardTitle>
          <Button onClick={onClose} size="sm" variant="ghost">
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="client_name" className="dark:text-gray-100">Client Name</Label>
              <Input
                id="client_name"
                name="client_name"
                type="text"
                value={formData.client_name}
                onChange={handleChange}
                required
                className="dark:bg-gray-700 dark:text-gray-100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="dark:text-gray-100">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="dark:bg-gray-700 dark:text-gray-100"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                id="followed_up"
                name="followed_up"
                type="checkbox"
                checked={formData.followed_up}
                onChange={handleChange}
                className="rounded border-gray-300 dark:border-gray-600"
              />
              <Label htmlFor="followed_up" className="dark:text-gray-100">
                Followed Up
              </Label>
            </div>

            {formData.followed_up && (
              <div className="space-y-2">
                <Label htmlFor="last_follow_up" className="dark:text-gray-100">Last Follow-up Date</Label>
                <Input
                  id="last_follow_up"
                  name="last_follow_up"
                  type="date"
                  value={formData.last_follow_up}
                  onChange={handleChange}
                  className="dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
            )}

            <div className="flex space-x-2 pt-4">
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? "Updating..." : "Update"}
              </Button>
              <Button type="button" onClick={onClose} variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
