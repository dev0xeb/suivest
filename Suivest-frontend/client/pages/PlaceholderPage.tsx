import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Construction } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description?: string;
}

const PlaceholderPage = ({ title, description }: PlaceholderPageProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center space-y-8">
          <div className="w-20 h-20 mx-auto bg-gray-100 rounded-2xl flex items-center justify-center">
            <Construction className="w-10 h-10 text-gray-400" />
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-gray-900">{title}</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {description ||
                `The ${title} page is coming soon. Continue exploring Suivest or let us know what you'd like to see here!`}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="outline" size="lg" className="rounded-xl">
              <Link to="/">
                <ArrowLeft className="mr-2 w-5 h-5" />
                Back to Home
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-electric hover:bg-electric/90 rounded-xl"
            >
              <Link to="/pools">Explore Pools</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceholderPage;
