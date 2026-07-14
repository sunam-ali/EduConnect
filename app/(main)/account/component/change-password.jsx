"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useState } from "react";
import { toast } from "sonner";

import { changePassword } from "@/app/actions/account";

const ChangePassword = ({ email }) => {
  const [passwordState, setPasswordState] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "", // Added state field
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setPasswordState((prev) => ({ ...prev, [name]: value }));
  }

  async function doPasswordChange(event) {
    event.preventDefault();

    // Client side check: Do new passwords match?
    if (passwordState.newPassword !== passwordState.confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    if (passwordState.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    try {
      const response = await changePassword(
        email,
        passwordState.oldPassword,
        passwordState.newPassword,
      );

      if (response && !response.success) {
        toast.error(response.error);
      } else {
        toast.success(`Password changed successfully.`);
        // Reset form fields
        setPasswordState({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        event.target.reset();
      }
    } catch (err) {
      toast.error("A network error occurred.");
    }
  }

  return (
    <div>
      <h5 className="text-lg font-semibold mb-4">Change password :</h5>
      <form onSubmit={doPasswordChange}>
        <div className="grid grid-cols-1 gap-5">
          <div>
            <Label className="mb-2 block">Old password :</Label>
            <Input
              type="password"
              placeholder="Old password"
              id="oldPassword"
              name="oldPassword"
              value={passwordState.oldPassword}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label className="mb-2 block">New password :</Label>
            <Input
              type="password"
              placeholder="New password"
              id="newPassword"
              name="newPassword"
              value={passwordState.newPassword}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label className="mb-2 block">Re-type New password :</Label>
            <Input
              type="password"
              placeholder="Re-type New password"
              id="confirmPassword"
              name="confirmPassword"
              value={passwordState.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <Button className="mt-5 cursor-pointer" type="submit">
          Save password
        </Button>
      </form>
    </div>
  );
};

export default ChangePassword;
