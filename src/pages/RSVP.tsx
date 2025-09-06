import { useParams } from "react-router-dom";
import { RSVPForm } from "@/components/RSVPForm";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import axios from "axios";

const RSVP = () => {
  const { id } = useParams(); // inviteCode comes as :id
  const [isValidLink, setIsValidLink] = useState<boolean | null>(null);
  const [guestData, setGuestData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const validateLink = async () => {
      if (!id) {
        setIsValidLink(false);
        setErrorMessage("Invitation code is missing.");
        return;
      }

      try {
        const query = `
          query InvitationLink($input: SimpleInput!) {
            invitationLink(input: $input) {
              _id
              code
              guestSize
              guestPerEntry
              guestsRegistered
              type
              status
              inviteUrl
            }
          }
        `;

        const variables = { input: { code: id } };

        const response = await axios.post(
          "/graphql", // proxy handles base URL
          { query, variables },
          { headers: { "Content-Type": "application/json" } }
        );

        const invitation = response.data?.data?.invitationLink;

        if (!invitation) {
          setIsValidLink(false);
          setErrorMessage("This invitation link was not found.");
          return;
        }

        // Allowed statuses
        const allowedStatuses = ["IN_PROGRESS", "UNUSED", "SHARED"];
        if (!allowedStatuses.includes(invitation.status)) {
          setIsValidLink(false);
          setErrorMessage(
            `This invitation link is no longer valid (Status: ${invitation.status}).`
          );
          return;
        }

        // valid link
        setIsValidLink(true);
        setGuestData({
          maxGuests: invitation.guestPerEntry,
          ...invitation,
        });
      } catch (error) {
        console.error("Error validating RSVP link:", error);
        setIsValidLink(false);
        setErrorMessage("Something went wrong while validating your invitation.");
      }
    };

    validateLink();
  }, [id]);

  if (isValidLink === null) {
    return (
      <div className="min-h-screen bg-gradient-soft flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-wedding-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-wedding-primary">Validating your invitation...</p>
        </div>
      </div>
    );
  }

  if (!isValidLink) {
    return (
      <div className="min-h-screen bg-gradient-soft flex items-center justify-center">
        <Card className="w-full max-w-md shadow-elegant border-0 bg-white/90 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>

            <h2 className="text-2xl font-bold text-wedding-primary mb-4 font-poppins">
              Invalid Invitation Link
            </h2>

            <p className="text-muted-foreground mb-6">
              {errorMessage ||
                "This invitation link is not valid or may have expired. Please contact the event organizers for assistance."}
            </p>

            <a href="/" className="text-wedding-gold hover:underline">
              Return to Home
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <RSVPForm
      maxGuests={guestData?.maxGuests || 1}
      guestId={id}
      invitationLinkId={guestData?._id}
    />
  );
};

export default RSVP;
