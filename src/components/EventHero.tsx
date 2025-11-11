import { useEffect, useState } from "react";
import axios from "axios";
import { CountdownTimer } from "./CountdownTimer";
import { Button } from "./ui/button";
import { Calendar, MapPin, Heart } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export const EventHero = () => {
  const eventDate = "2025-10-25T10:00:00";
  const navigate = useNavigate();
  const location = useLocation();

  const [inviteStatus, setInviteStatus] = useState<string | null>(null);
  const [inviteCode, setInviteCode] = useState<string | null>(null); 
  const [inviteSubmitted, setSubmitted] = useState<boolean | null>(null); 
  const [loading, setLoading] = useState(true);

  // Allowed statuses where button should show
  const allowedStatuses = ["IN_PROGRESS", "UNUSED", "SHARED"];

  useEffect(() => {
    const fetchInvitation = async () => {
      try {
        // Extract invite code from URL ?invite=xxxx
        const searchParams = new URLSearchParams(location.search);
        const inviteCode = searchParams.get("invite");

        setInviteCode(inviteCode);
        if (inviteCode) {
          const inviteSubmitted = localStorage.getItem(btoa("invite-submitted"));
          localStorage.setItem(btoa("invite-code"), btoa(inviteCode));
          if (inviteSubmitted && inviteSubmitted === btoa(inviteCode)) {
            setSubmitted(true);
          } else {
            setSubmitted(false);
          }
        }

        if (!inviteCode) {
          setInviteStatus(null);
          setLoading(false);
          return;
        }

        const query = `
          query InvitationLink($input: SimpleInput!) {
            invitationLink(input: $input) {
              status
              inviteUrl
            }
          }
        `;

        const variables = {
          input: {
            code: inviteCode,
          },
        };

       const API_URL = import.meta.env.VITE_API_URL;

        // ✅ Call proxy instead of remote URL
        const response = await axios.post(
          API_URL,
          { query, variables },
          { headers: { "Content-Type": "application/json" } }
        );

        const status = response.data?.data?.invitationLink?.status || null;
        setInviteStatus(status);
      } catch (error) {
        console.error("Error fetching invitation link:", error);
        setInviteStatus(null);
      } finally {
        setLoading(false);
      }
    };

    fetchInvitation();
  }, [location.search]);

  return (
    <section className="relative min-h-screen bg-gradient-hero flex items-center justify-center overflow-hidden py-16">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-wedding-gold rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-wedding-gold rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white rounded-full blur-2xl"></div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        {/* Heading */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-8">
          <div className="md:mb-0">
            <img
              src="/uploads/c1317d0c-7591-4640-9b42-865bd23e58f7.png"
              alt="MJ 25th Wedding Logo"
              className="w-32 h-32 md:w-40 md:h-40 drop-shadow-2xl"
            />
          </div>
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 font-poppins">
              Mary weds Johnvict
            </h1>
            <h2 className="text-2xl md:text-4xl text-white/90 font-light">
              Wedding Celebration
            </h2>
            <div className="flex items-center justify-center gap-2 mt-4">
              <Heart className="w-6 h-6 text-wedding-gold" />
              <span className="text-wedding-gold font-medium">
                A Love Journey Worth Celebrating
              </span>
              <Heart className="w-6 h-6 text-wedding-gold" />
            </div>
          </div>
        </div>

        {/* Event details */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center justify-center gap-2 text-white/90">
            <Calendar className="w-5 h-5" />
            <span className="text-lg">25th October, 2025</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-white/90">
            <MapPin className="w-5 h-5" />
            <span className="text-lg">Grand Celebration Venue, Abuja</span>
          </div>
        </div>

        {/* Countdown */}
        <div className="mb-12">
          {/* <h3 className="text-xl text-white/90 mb-6 font-medium">
            Celebration Begins In
          </h3> */}
          <CountdownTimer targetDate={eventDate} />
        </div>

        {/* RSVP button */}
        {!loading /*&& !inviteSubmitted */ && inviteStatus && allowedStatuses.includes(inviteStatus) && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="rounded-full bg-wedding-gold hover:bg-wedding-gold/90 text-wedding-primary font-semibold px-8 py-3 text-lg shadow-gold"
              onClick={() =>  navigate(`/rsvp/${inviteCode}`)}
            >
              RSVP Now
            </Button>
          </div>
        )}
        <Button
              size="lg"
              className="rounded-full bg-wedding-gold hover:bg-wedding-gold/90 text-wedding-primary font-semibold px-8 py-3 text-lg shadow-gold"
              onClick={() =>  navigate(`/gallery`)}
            >
              View Gallery
            </Button>
      </div>
    </section>
  );
};
