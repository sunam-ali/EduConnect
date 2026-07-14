"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useState } from "react";
import { toast } from "sonner";

import { updateUserInfo } from "@/app/actions/account";

const ContactInfo = ({ userInfo }) => {
  // Initialize state using the nested schema structure
  const [contactState, setContactState] = useState({
    phone: userInfo?.phone || "",
    // You can use the LinkedIn field or add a generic website tracker here
    linkedin: userInfo?.socialMedia?.linkedin || "",
    twitter: userInfo?.socialMedia?.twitter || "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setContactState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async (event) => {
    event.preventDefault();

    // Reconstruct the payload to match your exact DB structure
    const updatedPayload = {
      phone: contactState.phone,
      socialMedia: {
        ...userInfo?.socialMedia, // Keep existing social media keys if any (like facebook)
        linkedin: contactState.linkedin,
        twitter: contactState.twitter,
      },
    };

    try {
      await updateUserInfo(userInfo?.email, updatedPayload);
      toast.success("Contact info updated successfully.");
    } catch (error) {
      console.error(error);
      toast.error(
        `Error: ${error.message || "Failed to update contact info."}`,
      );
    }
  };

  return (
    <div className="p-6 rounded-md shadow dark:shadow-gray-800 bg-white dark:bg-slate-900">
      <h5 className="text-lg font-semibold mb-4">Contact Info :</h5>
      <form onSubmit={handleUpdate}>
        <div className="grid grid-cols-1 gap-5">
          <div>
            <Label className="mb-2 block" htmlFor="phone">
              Phone No. :
            </Label>
            <Input
              name="phone"
              id="phone"
              type="tel"
              placeholder="Phone :"
              value={contactState.phone}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label className="mb-2 block" htmlFor="linkedin">
              LinkedIn Profile :
            </Label>
            <Input
              name="linkedin"
              id="linkedin"
              type="text"
              placeholder="linkedin.com/in/username"
              value={contactState.linkedin}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label className="mb-2 block" htmlFor="twitter">
              Twitter / X :
            </Label>
            <Input
              name="twitter"
              id="twitter"
              type="text"
              placeholder="@username"
              value={contactState.twitter}
              onChange={handleChange}
            />
          </div>
        </div>
        {/*end grid*/}

        <Button className="mt-5 cursor-pointer" asChild>
          <input type="submit" value="Save Changes" />
        </Button>
      </form>
    </div>
  );
};

export default ContactInfo;
