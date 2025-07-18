import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Shield,
  Zap,
  TrendingUp,
  Users,
  DollarSign,
  Trophy,
  Sparkles,
  Twitter,
  Github,
  MessageCircle,
} from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Turn Saving Into a{" "}
                  <span className="text-gradient">Streak</span>. Grow Wealth.
                  Win Rewards.
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Suivest makes saving feel like winning — no-loss savings
                  pools, streak rewards, and community-powered bonuses.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-electric hover:bg-electric/90 text-white px-8 py-4 text-lg rounded-xl transition-all duration-200 hover:scale-105"
                >
                  <Link to="/pools">Join a Pool</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-2 border-electric text-electric hover:bg-electric hover:text-white px-8 py-4 text-lg rounded-xl transition-all duration-200"
                >
                  <Link to="/how-it-works">How It Works</Link>
                </Button>
              </div>
            </div>

            {/* Animated Visual */}
            <div className="relative">
              <div className="bg-gradient-to-br from-electric/10 to-teal/10 rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-electric/5 to-teal/5 animate-pulse"></div>

                {/* Vault Animation */}
                <div className="relative z-10 space-y-6">
                  <div className="bg-white rounded-2xl p-6 shadow-lg card-hover">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-gray-600">
                        Weekly Savings Pool
                      </span>
                      <div className="flex items-center space-x-1">
                        <Sparkles className="w-4 h-4 text-reward" />
                        <span className="text-sm font-bold text-reward">
                          +15%
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-2xl font-bold text-gray-900">
                          $12,450
                        </span>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">
                            7-day streak
                          </div>
                          <div className="streak-bar h-2 rounded-full w-20"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl p-4 shadow-lg animate-float">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-teal/10 rounded-lg flex items-center justify-center">
                          <TrendingUp className="w-4 h-4 text-teal" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-600">Rewards</div>
                          <div className="font-bold text-teal">+$127</div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="bg-white rounded-xl p-4 shadow-lg animate-float"
                      style={{ animationDelay: "0.5s" }}
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-reward/10 rounded-lg flex items-center justify-center">
                          <Trophy className="w-4 h-4 text-reward" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-600">
                            $SVT Tokens
                          </div>
                          <div className="font-bold text-reward">+250</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How Suivest Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Four simple steps to turn your savings into a rewarding journey
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Join a Pool",
                description: "Choose from USDC or SUI weekly savings pools",
                icon: Users,
                color: "electric",
              },
              {
                step: "2",
                title: "Win or Streak",
                description: "Keep saving consistently to build your streak",
                icon: Zap,
                color: "teal",
              },
              {
                step: "3",
                title: "Boost Odds with $SVT",
                description: "Use $SVT tokens to increase your winning chances",
                icon: TrendingUp,
                color: "reward",
              },
              {
                step: "4",
                title: "Claim Rewards",
                description: "Win prizes and earn streak-based token rewards",
                icon: Trophy,
                color: "electric",
              },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-2xl p-6 card-hover">
                  <div className="text-center space-y-4">
                    <div
                      className={`w-16 h-16 mx-auto rounded-xl bg-${item.color}/10 flex items-center justify-center`}
                    >
                      <item.icon className={`w-8 h-8 text-${item.color}`} />
                    </div>
                    <div
                      className={`w-8 h-8 mx-auto rounded-full bg-${item.color} text-white flex items-center justify-center font-bold`}
                    >
                      {item.step}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {item.title}
                    </h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
                {index < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gray-300"></div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              asChild
              size="lg"
              className="bg-electric hover:bg-electric/90 text-white px-8 py-4 text-lg rounded-xl"
            >
              <Link to="/pools">See Pools</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Suivest Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Suivest?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The future of decentralized saving is here
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "No-Loss Savings",
                description:
                  "Your principal is always safe while you compete for rewards",
                icon: Shield,
                color: "electric",
              },
              {
                title: "Streak Rewards",
                description: "Earn $SVT tokens for consistent saving habits",
                icon: Zap,
                color: "teal",
              },
              {
                title: "Boost with $SVT",
                description: "Use tokens to increase your winning odds",
                icon: TrendingUp,
                color: "reward",
              },
              {
                title: "Web3 Simplicity",
                description:
                  "Built on Sui blockchain for fast, low-cost transactions",
                icon: Sparkles,
                color: "electric",
              },
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 card-hover">
                <div className="space-y-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-${item.color}/10 flex items-center justify-center`}
                  >
                    <item.icon className={`w-6 h-6 text-${item.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Stats Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Suivest by the Numbers
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                value: "$2.4M",
                label: "Total Saved",
                icon: DollarSign,
                color: "electric",
              },
              {
                value: "$127K",
                label: "Total Rewards Paid",
                icon: Trophy,
                color: "reward",
              },
              {
                value: "1,248",
                label: "Active Savers",
                icon: Users,
                color: "teal",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 text-center card-hover"
              >
                <div
                  className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-${stat.color}/10 flex items-center justify-center`}
                >
                  <stat.icon className={`w-8 h-8 text-${stat.color}`} />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-electric to-teal rounded-3xl p-12 text-center text-white">
            <blockquote className="text-2xl lg:text-3xl font-bold mb-6 italic">
              "Suivest empowers the next generation to build wealth by saving
              consistently and being rewarded along the way."
            </blockquote>
            <Button
              asChild
              size="lg"
              className="bg-white text-electric hover:bg-gray-100 px-8 py-4 text-lg rounded-xl"
            >
              <Link to="/pools">
                Start Your Journey <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-electric to-teal rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">S</span>
                </div>
                <span className="text-xl font-bold">Suivest</span>
              </div>
              <p className="text-gray-400">
                Suivest is the future of decentralized saving.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Navigation</h4>
              <div className="space-y-2">
                {["Home", "Pools", "Streaks", "Rewards"].map((link) => (
                  <Link
                    key={link}
                    to={`/${link.toLowerCase()}`}
                    className="block text-gray-400 hover:text-white transition-colors"
                  >
                    {link}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <div className="space-y-2">
                {["About", "Docs", "FAQ", "Terms"].map((link) => (
                  <Link
                    key={link}
                    to={`/${link.toLowerCase()}`}
                    className="block text-gray-400 hover:text-white transition-colors"
                  >
                    {link}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4">Community</h4>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Twitter className="w-6 h-6" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <MessageCircle className="w-6 h-6" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Github className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Suivest. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
