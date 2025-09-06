import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Plus,
  Trash2,
  Users,
  Mail,
  Phone,
  User,
  Copy,
  Download,
} from "lucide-react"; // ✅ added icons
import { useToast } from "@/hooks/use-toast";
import countryCodes from "@/lib/CountryCodes.json";

interface Guest {
  id: string;
  title: string;
  firstName: string;
  lastName: string;
  phone: string;
  dialCode: string;
  email: string;
}

interface RSVPFormProps {
  maxGuests?: number;
  guestId?: string;
  invitationLinkId?: string;
}

export const RSVPForm = ({
  maxGuests = 4,
  guestId,
  invitationLinkId,
}: RSVPFormProps) => {
  const [guests, setGuests] = useState<Guest[]>([
    {
      id: "1",
      title: "",
      firstName: "",
      lastName: "",
      phone: "",
      dialCode: "+234",
      email: "",
    },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedInvites, setSubmittedInvites] = useState<any[]>([]); // ✅ hold RSVP response
  const { toast } = useToast();

  const addGuest = () => {
    if (guests.length < maxGuests) {
      setGuests([
        ...guests,
        {
          id: Date.now().toString(),
          title: "",
          firstName: "",
          lastName: "",
          phone: "",
          dialCode: "+234",
          email: "",
        },
      ]);
    }
  };

  const removeGuest = (id: string) => {
    if (guests.length > 1) {
      setGuests(guests.filter((guest) => guest.id !== id));
    }
  };

  const updateGuest = (id: string, field: keyof Guest, value: string) => {
    setGuests(
      guests.map((guest) =>
        guest.id === id ? { ...guest, [field]: value } : guest
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const hasValidGuests = guests.every(
      (guest) =>
        guest.title.trim() &&
        guest.firstName.trim() &&
        guest.lastName.trim() &&
        guest.phone.trim() &&
        guest.email.trim()
    );

    if (!hasValidGuests) {
      toast({
        title: "Please fill in all required fields",
        description:
          "Title, name, phone, and email are required for all guests",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Utility to convert to Title Case
    const toTitleCase = (str: string) =>
      str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());

    try {
      const formattedGuests = guests.map((g) => ({
        title: toTitleCase(g.title),
        firstName: toTitleCase(g.firstName),
        lastName: toTitleCase(g.lastName),
        phone: `${g.dialCode}-${g.phone}`,
        email: g.email,
      }));

      const query = `
        mutation Rsvp($input: CreateGuestInput!) {
          rsvp(input: $input) {
            _id
            phone
            firstName
            lastName
            email
            link {
              invitationCardUrl
              guestUrl
            }
          }
        }
      `;

      const variables = {
        input: {
          guests: formattedGuests,
          invitationLinkId,
        },
      };

       const API_URL = import.meta.env.VITE_API_URL;


      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables }),
      });

      const result = await res.json();
      if (result.errors) throw new Error(result.errors[0].message);

      const rsvpData = Array.isArray(result.data.rsvp)
        ? result.data.rsvp
        : [result.data.rsvp]; // normalize in case single guest is returned

      setSubmittedInvites(rsvpData); // ✅ save invites for display

      toast({
        title: "RSVP Submitted Successfully!",
        description: "Your invitation has been created 🎉",
      });
    } catch (error: any) {
      toast({
        title: "Error submitting RSVP",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ helper functions
  const handleCopy = (link: string) => {
    navigator.clipboard.writeText(link);
    toast({ title: "Link copied!", description: link });
  };

  const handleDownload = (url: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = "invitation.jpg";
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-soft py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="shadow-elegant border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="w-16 h-16 bg-gradient-gold rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-wedding-primary font-poppins">
              MJ25
            </CardTitle>
            <p className="text-muted-foreground">
              Please provide details for all guests attending ({guests.length}/
              {maxGuests})
            </p>
          </CardHeader>

          <CardContent>
            {submittedInvites.length === 0 ? (
              // ✅ show form until submitted
              <form onSubmit={handleSubmit} className="space-y-6">
                {guests.map((guest, index) => (
                  <Card
                    key={guest.id}
                    className="border border-wedding-sage/30 bg-wedding-cream/50"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-wedding-primary flex items-center gap-2">
                          <User className="w-5 h-5" />
                          Guest {index + 1}
                        </h3>
                        {guests.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeGuest(guest.id)}
                            className="text-destructive border-destructive hover:bg-destructive hover:text-white"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>

                      {/* --- guest fields... (same as before) */}
                      <div className="grid gap-4">
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <Label>Title *</Label>
                            <Input
                              value={guest.title}
                              onChange={(e) =>
                                updateGuest(guest.id, "title", e.target.value)
                              }
                              placeholder="Mr, Mrs, Miss, Dr..."
                              required
                            />
                          </div>
                          <div>
                            <Label>First Name *</Label>
                            <Input
                              value={guest.firstName}
                              onChange={(e) =>
                                updateGuest(
                                  guest.id,
                                  "firstName",
                                  e.target.value
                                )
                              }
                              placeholder="Enter first name"
                              required
                            />
                          </div>
                          <div>
                            <Label>Last Name *</Label>
                            <Input
                              value={guest.lastName}
                              onChange={(e) =>
                                updateGuest(
                                  guest.id,
                                  "lastName",
                                  e.target.value
                                )
                              }
                              placeholder="Enter last name"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label>
                              <Phone className="w-4 h-4 inline mr-1" />
                              Phone Number *
                            </Label>
                            <div className="flex gap-2">
                              <select
                                value={guest.dialCode}
                                onChange={(e) =>
                                  updateGuest(
                                    guest.id,
                                    "dialCode",
                                    e.target.value
                                  )
                                }
                                className="border rounded px-2 min-w-[100px] bg-white text-sm"
                              >
                                {countryCodes.map((c) => (
                                  <option key={c.code} value={c.dial_code}>
                                    {c.code} ({c.dial_code})
                                  </option>
                                ))}
                              </select>
                              <Input
                                className="flex-1"
                                value={guest.phone}
                                onChange={(e) =>
                                  updateGuest(guest.id, "phone", e.target.value)
                                }
                                placeholder="Phone Number"
                                required
                              />
                            </div>
                          </div>

                          <div>
                            <Label>
                              <Mail className="w-4 h-4 inline mr-1" />
                              Email Address *
                            </Label>
                            <Input
                              type="email"
                              value={guest.email}
                              onChange={(e) =>
                                updateGuest(guest.id, "email", e.target.value)
                              }
                              placeholder="guest@example.com"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {guests.length < maxGuests && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addGuest}
                    className="w-full border-wedding-gold text-wedding-gold hover:bg-wedding-gold hover:text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Another Guest
                  </Button>
                )}

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-gradient-gold text-white font-semibold py-3 shadow-gold"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting RSVP..." : "Submit RSVP"}
                </Button>
              </form>
            ) : (
              // ✅ show invites after submission
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-wedding-primary">
                  🎉 Your Invitation(s)
                </h3>
                {submittedInvites.map((invite, idx) => (
                  <div
                    key={idx}
                    className="border rounded-lg p-4 flex flex-col gap-4"
                  >
                    <img
                      src={invite.link.invitationCardUrl}
                      alt="Invitation"
                      className="rounded-lg shadow-md"
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={() =>
                          handleDownload(invite.link.invitationCardUrl)
                        }
                        className="bg-wedding-gold text-white"
                      >
                        <Download className="w-4 h-4 mr-2" /> Download
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleCopy(invite.link.guestUrl)}
                      >
                        <Copy className="w-4 h-4 mr-2" /> Copy Link
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
