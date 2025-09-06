import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Camera, Download, Copy, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface GalleryPhoto {
  _id: string;
  url: string;
  isGeneral: boolean;
  isConfirmed: boolean;
}

interface GuestLink {
  invitationCardUrl: string;
  guestUrl: string;
}

interface Guest {
  title: string;
  firstName: string;
  lastName: string;
  link: GuestLink;
}

export const PhotoGallery = () => {
  const [activeTab, setActiveTab] = useState<
    "invitation" | "general" | "personal"
  >("invitation");
  const [guest, setGuest] = useState<Guest | null>(null);
  const [loading, setLoading] = useState(true);

  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhoto[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(16); // Will be updated from API
  const [totalPages, setTotalPages] = useState(1);

  const [viewModal, setViewModal] = useState<{
    open: boolean;
    url: string | null;
  }>({ open: false, url: null });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Link copied!", description: text });
  };

  // Fetch guest
  useEffect(() => {
    const fetchGuest = async () => {
      try {
        setLoading(true);
        const path = window.location.pathname;
        const code = path.split("/").pop();
        if (!code) return (window.location.href = "/");

        const query = `
          query Guest($input: FetchGuestInput!) {
            guest(input: $input) {
              title
              firstName
              lastName
              link {
                invitationCardUrl
                guestUrl
              }
            }
          }
        `;
        const variables = { input: { code } };

        const API_URL = import.meta.env.VITE_API_URL;

        const response = await axios.post(
          API_URL,
          { query, variables },
          { headers: { "Content-Type": "application/json" } }
        );
        const data = response.data?.data?.guest;

        if (!data || !data.link?.invitationCardUrl || !data.link?.guestUrl)
          window.location.href = "/";
        else
          setGuest({
            title: data.title,
            firstName: data.firstName,
            lastName: data.lastName,
            link: data.link,
          });
      } catch {
        window.location.href = "/";
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === "invitation") fetchGuest();
  }, [activeTab]);

  // Fetch gallery with pagination
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setGalleryLoading(true);
        const path = window.location.pathname;
        console.log(window.location);
        const code = path.split("/").pop();
        if (!code) return;

        const query = `
          query Query($input: FetchGalleryInput!, $limit: Int!, $page: Int!) {
            galleryFiles(input: $input, limit: $limit, page: $page) {
              items {
                _id
                url
                isGeneral
                isConfirmed
              }
              limit
              page
            }
          }
        `;

        const variables = { input: { code }, limit, page };
        const API_URL = import.meta.env.VITE_API_URL;

        const response = await axios.post(
          API_URL,
          { query, variables },
          { headers: { "Content-Type": "application/json" } }
        );

        const galleryData = response.data?.data?.galleryFiles;
        const items: GalleryPhoto[] = galleryData?.items || [];
        setGalleryPhotos(items);

        // Update limit and current page dynamically
        setLimit(galleryData?.limit || 16);
        setPage(galleryData?.page || 1);

        // Determine if Next button is needed
        setTotalPages(
          items.length < (galleryData?.limit || 16) ? page : page + 1
        );
      } catch (err) {
        console.error("Error fetching gallery:", err);
      } finally {
        setGalleryLoading(false);
      }
    };

    if (activeTab === "general" || activeTab === "personal") fetchGallery();
  }, [activeTab, page]);

  const generalPhotos = galleryPhotos.filter((p) => p.isGeneral);
  const personalPhotos = galleryPhotos.filter((p) => !p.isGeneral);

  const renderGallery = (photos: GalleryPhoto[]) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {galleryLoading ? (
        <p className="text-center col-span-full text-muted-foreground">
          Loading gallery...
        </p>
      ) : photos.length > 0 ? (
        photos.map((photo) => (
          <Card
            key={photo._id}
            className="group overflow-hidden border-0 shadow-soft hover:shadow-elegant transition-all duration-300 relative"
          >
            <CardContent className="p-0 relative">
              <img
                src={photo.url}
                alt="Gallery"
                className="aspect-square object-cover w-full"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setViewModal({ open: true, url: photo.url })}
                >
                  <Camera className="w-4 h-4 text-white" /> View
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => window.open(photo.url, "_blank")}
                >
                  <Download className="w-4 h-4 text-white" /> Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <p className="text-center col-span-full text-muted-foreground">
          No photos available yet
        </p>
      )}

      {/* Pagination */}
      {photos.length === limit && (
        <div className="col-span-full flex justify-center mt-6 gap-2">
          <Button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="flex items-center px-2">{page}</span>
          <Button
            onClick={() => setPage((p) => p + 1)}
            disabled={photos.length < limit}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-soft py-12">
      <div className="container mx-auto px-4">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-wedding-primary mb-4 font-poppins">
            MJ25
          </h1>
          <p className="text-xl text-muted-foreground">
            Access your RSVP and captured moments from MJ&apos;s special day!
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-soft flex">
            <Button
              variant={activeTab === "invitation" ? "default" : "ghost"}
              onClick={() => setActiveTab("invitation")}
              className={
                activeTab === "invitation"
                  ? "bg-wedding-gold text-white shadow-gold"
                  : "text-wedding-primary"
              }
            >
              Invitation
            </Button>
            <Button
              variant={activeTab === "general" ? "default" : "ghost"}
              onClick={() => setActiveTab("general")}
              className={
                activeTab === "general"
                  ? "bg-wedding-gold text-white shadow-gold"
                  : "text-wedding-primary"
              }
            >
              General Gallery
            </Button>
            <Button
              variant={activeTab === "personal" ? "default" : "ghost"}
              onClick={() => setActiveTab("personal")}
              className={
                activeTab === "personal"
                  ? "bg-wedding-gold text-white shadow-gold"
                  : "text-wedding-primary"
              }
            >
              Your Photos
            </Button>
          </div>
        </div>

        {/* Invitation */}
        {activeTab === "invitation" && (
          <div className="text-center max-w-3xl mx-auto">
            {loading ? (
              <p className="text-muted-foreground">Loading invitation...</p>
            ) : guest ? (
              <div>
                <h2 className="text-2xl font-bold text-wedding-primary mb-4">
                  {guest.title} {guest.firstName} {guest.lastName}, you are
                  invited!
                </h2>
                <img
                  src={guest.link.invitationCardUrl}
                  alt="Invitation"
                  className="rounded-lg shadow-lg mx-auto mb-6 w-full max-w-md"
                />
                <div className="flex justify-center gap-4">
                  <Button
                    onClick={() =>
                      window.open(guest.link.invitationCardUrl, "_blank")
                    }
                    className="bg-wedding-gold text-white shadow-gold"
                  >
                    <Download className="w-4 h-4 mr-2" /> Download
                  </Button>
                  <Button
                    onClick={() => copyToClipboard(guest.link.guestUrl)}
                    className="bg-wedding-gold text-white shadow-gold"
                  >
                    <Copy className="w-4 h-4 mr-2" /> Copy Link
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-red-500 font-semibold">Guest not found</p>
            )}
          </div>
        )}

        {/* Galleries */}
        {activeTab === "general" && renderGallery(generalPhotos)}
        {activeTab === "personal" && renderGallery(personalPhotos)}

        {/* View Modal */}
        {viewModal.open && viewModal.url && (
          <div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
            onClick={() => setViewModal({ open: false, url: null })} // Click outside closes modal
          >
            <div
              className="relative bg-white rounded-lg shadow-lg p-4 max-w-[90vw] max-h-[80vh] flex justify-center items-center"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
              <Button
                className="absolute top-2 right-2"
                onClick={() => setViewModal({ open: false, url: null })}
              >
                <X className="w-5 h-5" />
              </Button>
              <img
                src={viewModal.url}
                alt="Preview"
                className="max-w-full max-h-[70vh] object-contain rounded"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
