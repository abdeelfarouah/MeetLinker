import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Video, Users, Shield, Globe } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Connect Instantly with <span className="text-blue-500">MeetLinker</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            High-quality video meetings made simple. Join or host meetings with crystal-clear video and audio quality.
          </p>
          <Link to="/auth/login">
            <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-6 text-lg">
              Get Started Now
            </Button>
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<Video className="w-10 h-10 text-blue-500" />}
            title="HD Video Calls"
            description="Crystal clear video quality for seamless communication"
          />
          <FeatureCard
            icon={<Users className="w-10 h-10 text-blue-500" />}
            title="Group Meetings"
            description="Host meetings with multiple participants easily"
          />
          <FeatureCard
            icon={<Shield className="w-10 h-10 text-blue-500" />}
            title="Secure Meetings"
            description="End-to-end encryption for your privacy"
          />
          <FeatureCard
            icon={<Globe className="w-10 h-10 text-blue-500" />}
            title="Accessible"
            description="Join from anywhere, on any device"
          />
        </div>
      </div>

      {/* Call to Action */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Ready to experience better video meetings?
        </h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          Join thousands of users who have already made the switch to MeetLinker.
        </p>
        <Link to="/auth/register">
          <Button size="lg" variant="secondary" className="px-8 py-6 text-lg">
            Create Free Account
          </Button>
        </Link>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-16">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-gray-400">
            © 2024 MeetLinker. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => {
  return (
    <div className="p-6 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
};

export default LandingPage;