import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Camera, Search, Heart, Download } from 'lucide-react';

interface Photo {
  id: string;
  url: string;
  caption: string;
  isTagged: boolean;
  tags: string[];
}

export const PhotoGallery = () => {
  const [authName, setAuthName] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'personal'>('general');

  // Mock photo data
  const mockPhotos: Photo[] = [
    {
      id: '1',
      url: '/api/placeholder/300/300',
      caption: 'Beautiful ceremony moments',
      isTagged: false,
      tags: []
    },
    {
      id: '2', 
      url: '/api/placeholder/300/300',
      caption: 'Family celebration',
      isTagged: true,
      tags: ['john', 'mary']
    },
    // Add more mock photos...
  ];

  const handleAuth = () => {
    if (authName.length >= 3) {
      setIsAuthenticated(true);
    }
  };

  const generalPhotos = mockPhotos.filter(photo => !photo.isTagged);
  const personalPhotos = mockPhotos.filter(photo => 
    photo.isTagged && photo.tags.some(tag => 
      tag.toLowerCase().includes(authName.toLowerCase().slice(0, 3))
    )
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-soft flex items-center justify-center">
        <Card className="w-full max-w-md shadow-elegant border-0 bg-white/90 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-gold rounded-full flex items-center justify-center mx-auto mb-6">
              <Camera className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-2xl font-bold text-wedding-primary mb-4 font-poppins">
              Access Photo Gallery
            </h2>
            
            <p className="text-muted-foreground mb-6">
              Enter the first three letters of your name to view photos
            </p>
            
            <div className="space-y-4">
              <Input
                value={authName}
                onChange={(e) => setAuthName(e.target.value)}
                placeholder="First 3 letters of your name"
                maxLength={3}
                className="text-center text-lg border-wedding-sage/50 focus:border-wedding-gold"
              />
              
              <Button
                onClick={handleAuth}
                disabled={authName.length < 3}
                className="w-full bg-gradient-gold text-white font-semibold shadow-gold"
              >
                Access Gallery
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-soft py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-wedding-primary mb-4 font-poppins">
            Photo Gallery
          </h1>
          <p className="text-xl text-muted-foreground">
            Capturing precious memories from MJ's special day
          </p>
        </div>

        {/* Gallery tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-soft">
            <Button
              variant={activeTab === 'general' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('general')}
              className={activeTab === 'general' ? 'bg-wedding-gold text-white shadow-gold' : 'text-wedding-primary'}
            >
              General Gallery
            </Button>
            <Button
              variant={activeTab === 'personal' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('personal')}
              className={activeTab === 'personal' ? 'bg-wedding-gold text-white shadow-gold' : 'text-wedding-primary'}
            >
              Your Photos
            </Button>
          </div>
        </div>

        {/* Photo grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {(activeTab === 'general' ? generalPhotos : personalPhotos).map((photo) => (
            <Card key={photo.id} className="group overflow-hidden border-0 shadow-soft hover:shadow-elegant transition-all duration-300">
              <CardContent className="p-0 relative">
                <div className="aspect-square bg-wedding-sage/20 flex items-center justify-center">
                  <Camera className="w-12 h-12 text-wedding-primary/50" />
                </div>
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="space-x-2">
                    <Button size="sm" variant="secondary" className="bg-white/90 text-wedding-primary">
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="secondary" className="bg-white/90 text-wedding-primary">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="p-3">
                  <p className="text-sm text-muted-foreground">{photo.caption}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty state */}
        {activeTab === 'personal' && personalPhotos.length === 0 && (
          <div className="text-center py-12">
            <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-wedding-primary mb-2">No Personal Photos Yet</h3>
            <p className="text-muted-foreground">
              Personal photos will appear here once they're uploaded and tagged
            </p>
          </div>
        )}
      </div>
    </div>
  );
};