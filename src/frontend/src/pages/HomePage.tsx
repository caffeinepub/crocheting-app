import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Image as ImageIcon, TrendingUp, Package } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function HomePage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const features = [
    {
      icon: BookOpen,
      title: 'Learn & Create',
      description: 'Access step-by-step tutorials for various crochet patterns and techniques.',
      action: () => navigate({ to: '/tutorials' }),
      buttonText: 'Browse Tutorials',
    },
    {
      icon: ImageIcon,
      title: 'Share Your Work',
      description: 'Publish your completed projects and inspire others in the community.',
      action: () => navigate({ to: isAuthenticated ? '/publish' : '/projects' }),
      buttonText: isAuthenticated ? 'Publish Project' : 'View Gallery',
    },
    {
      icon: TrendingUp,
      title: 'Track Progress',
      description: 'Monitor your active projects with completion tracking and time logs.',
      action: () => navigate({ to: isAuthenticated ? '/my-projects' : '/tutorials' }),
      buttonText: isAuthenticated ? 'My Projects' : 'Get Started',
    },
    {
      icon: Package,
      title: 'Materials Guide',
      description: 'Find detailed materials lists for every pattern and project.',
      action: () => navigate({ to: '/tutorials' }),
      buttonText: 'Explore Patterns',
    },
  ];

  return (
    <main className="container mx-auto px-4 py-8 space-y-12">
      <HeroSection />

      <section className="text-center space-y-4">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
          Your Creative Crochet Companion
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Whether you're a beginner or an experienced crocheter, Crochet Craft Hub provides everything you need to bring
          your creative visions to life.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <article key={index}>
            <Card className="hover:shadow-lg transition-shadow h-full">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="font-serif text-2xl">{feature.title}</CardTitle>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={feature.action} className="w-full">
                  {feature.buttonText}
                </Button>
              </CardContent>
            </Card>
          </article>
        ))}
      </section>

      <section
        className="relative rounded-2xl overflow-hidden p-8 md:p-12 text-center"
        style={{
          backgroundImage: 'url(/assets/generated/background-texture.dim_800x600.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-primary/90"></div>
        <div className="relative z-10 space-y-4">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary-foreground">
            Ready to Start Creating?
          </h2>
          <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">
            Join our community of makers and start your crochet journey today. All features are completely free!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate({ to: '/tutorials' })}
              className="font-semibold"
            >
              Explore Tutorials
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate({ to: '/projects' })}
              className="font-semibold bg-white/10 hover:bg-white/20 text-white border-white/30"
            >
              View Gallery
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
