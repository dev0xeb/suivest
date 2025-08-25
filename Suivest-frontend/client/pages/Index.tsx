import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Lock,
  Globe,
  Code,
  Coins,
  Target,
  CheckCircle,
  ExternalLink,
  BarChart3,
  Wallet,
  Star,
} from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-web3-dark">
      {/* Hero Section with Web3 Design */}
      <section className="relative overflow-hidden pt-8 pb-24 bg-crypto-mesh">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-electric/10 rounded-full blur-3xl animate-pulse-glow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple/10 rounded-full blur-3xl animate-pulse-glow delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-teal/10 rounded-full blur-2xl animate-pulse-glow delay-500"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Trust Indicators */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2 glass rounded-full px-4 py-2">
                <CheckCircle className="w-4 h-4 text-web3-success" />
                <span className="text-gray-300 font-mono-crypto">
                  Audited by CertiK
                </span>
              </div>
              <div className="flex items-center space-x-2 glass rounded-full px-4 py-2">
                <Globe className="w-4 h-4 text-electric" />
                <span className="text-gray-300 font-mono-crypto">
                  Deployed on Sui
                </span>
              </div>
              <div className="flex items-center space-x-2 glass rounded-full px-4 py-2">
                <Lock className="w-4 h-4 text-teal" />
                <span className="text-gray-300 font-mono-crypto">
                  Non-custodial
                </span>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <Badge
                  variant="outline"
                  className="bg-electric/10 border-electric/30 text-electric px-4 py-2 text-sm font-medium"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Verified Smart Contracts
                </Badge>

                <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                  <span className="text-white">Decentralized</span>{" "}
                  <span className="text-gradient">No-Loss</span>{" "}
                  <span className="text-white">Savings</span>{" "}
                  <span className="text-gradient-electric">Protocol</span>
                </h1>

                <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-3xl">
                  Transform your crypto savings into winning streaks. Built
                  on-chain with battle-tested DeFi protocols. Your funds, your
                  keys, your rewards.
                </p>

                {/* Key Stats */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="card-web3 p-4 rounded-xl">
                    <div className="text-2xl font-bold text-electric">
                      $0
                    </div>
                    <div className="text-xs text-gray-400 font-mono-crypto">
                      Total Value Locked
                    </div>
                  </div>
                  <div className="card-web3 p-4 rounded-xl">
                    <div className="text-2xl font-bold text-teal">0</div>
                    <div className="text-xs text-gray-400 font-mono-crypto">
                      Active Wallets
                    </div>
                  </div>
                  <div className="card-web3 p-4 rounded-xl">
                    <div className="text-2xl font-bold text-reward">$0</div>
                    <div className="text-xs text-gray-400 font-mono-crypto">
                      Distributed Rewards
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-electric via-purple to-teal hover:from-electric/90 hover:via-purple/90 hover:to-teal/90 text-white px-8 py-4 text-lg rounded-xl transition-all duration-300 btn-glow border border-electric/20"
                >
                  <Link to="/pools">
                    <Target className="w-5 h-5 mr-2" />
                    Enter Protocol
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-2 border-white/20 text-white hover:bg-white/10 glass px-8 py-4 text-lg rounded-xl transition-all duration-300"
                >
                  <Link to="/docs">
                    <Code className="w-5 h-5 mr-2" />
                    Smart Contracts
                  </Link>
                </Button>
              </div>

              {/* Contract Address */}
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-gray-400">Protocol:</span>
                <code className="address">
                  {/* 0x742d35Cc6E3a8c2F0F7C5B9a5b7F8c3d1E9a2B4F */}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-gray-400 hover:text-electric"
                >
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {/* Animated DeFi Interface */}
            <div className="relative">
              <div className="card-web3 rounded-3xl p-8 relative overflow-hidden border-glow">
                <div className="absolute inset-0 bg-gradient-to-br from-electric/5 to-teal/5 animate-pulse"></div>

                {/* Live Pool Interface */}
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-electric to-purple rounded-lg flex items-center justify-center">
                        <Coins className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <span className="text-white font-semibold">
                          SUI Savings Pool
                        </span>
                        <div className="text-xs text-gray-400 font-mono-crypto">
                          Deployed • Verified • Audited
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-web3-success rounded-full animate-pulse"></div>
                      <span className="text-xs text-web3-success font-mono-crypto">
                        LIVE
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="card-web3 rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-gray-400">
                          Weekly Prize Pool
                        </span>
                        <div className="flex items-center space-x-1">
                          <Trophy className="w-4 h-4 text-reward" />
                          <span className="text-sm font-bold text-reward">
                            +15% APY
                          </span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-3xl font-bold text-white">
                            $12,450
                          </span>
                          <div className="text-right">
                            <div className="text-sm text-gray-400">
                              7-day streak
                            </div>
                            <div className="streak-bar h-2 rounded-full w-24"></div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-400 font-mono-crypto">
                          Next draw in 2d 14h 23m
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="card-web3 rounded-xl p-4 animate-float">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-teal/10 rounded-lg flex items-center justify-center">
                            <BarChart3 className="w-4 h-4 text-teal" />
                          </div>
                          <div>
                            <div className="text-xs text-gray-400">
                              Yield Earned
                            </div>
                            <div className="font-bold text-teal">+$127</div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="card-web3 rounded-xl p-4 animate-float"
                        style={{ animationDelay: "0.5s" }}
                      >
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-reward/10 rounded-lg flex items-center justify-center">
                            <Star className="w-4 h-4 text-reward" />
                          </div>
                          <div>
                            <div className="text-xs text-gray-400">
                              $SVT Rewards
                            </div>
                            <div className="font-bold text-reward">+250</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button className="w-full bg-gradient-to-r from-electric to-purple hover:from-electric/90 hover:to-purple/90 text-white py-3 rounded-xl btn-glow">
                      Connect Wallet to Participate
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Web3 Style */}
      <section className="py-24 bg-web3-surface">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              On-Chain Savings Protocol
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Decentralized, transparent, and verified by code
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Deposit Assets",
                description: "Deposit SUI, USDC, or other supported tokens",
                icon: Wallet,
                color: "electric",
                tech: "Smart Contract",
              },
              {
                step: "2",
                title: "Earn Yield",
                description: "Auto-deployed to battle-tested DeFi protocols",
                icon: TrendingUp,
                color: "teal",
                tech: "DeFi Integration",
              },
              {
                step: "3",
                title: "Build Streaks",
                description: "Consistent deposits earn $SVT tokens & bonuses",
                icon: Zap,
                color: "purple",
                tech: "Gamification",
              },
              {
                step: "4",
                title: "Win Rewards",
                description: "Prizes from yield, principal always protected",
                icon: Trophy,
                color: "reward",
                tech: "Prize Distribution",
              },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="card-web3 rounded-2xl p-6 card-glow h-full">
                  <div className="text-center space-y-4">
                    <div
                      className={`w-16 h-16 mx-auto rounded-xl bg-${item.color}/10 flex items-center justify-center border border-${item.color}/20`}
                    >
                      <item.icon className={`w-8 h-8 text-${item.color}`} />
                    </div>
                    <div
                      className={`w-8 h-8 mx-auto rounded-full bg-gradient-to-r from-${item.color} to-${item.color}/80 text-web3-bg flex items-center justify-center font-bold`}
                    >
                      {item.step}
                    </div>
                    <h3 className="text-xl font-bold text-white">
                      {item.title}
                    </h3>
                    <p className="text-gray-400">{item.description}</p>
                    <Badge
                      variant="outline"
                      className="border-gray-600 text-gray-400 text-xs"
                    >
                      {item.tech}
                    </Badge>
                  </div>
                </div>
                {index < 3 && (
                  <div className=" md:block absolute top-1/2 -right-4 w-8 h-8 bg-web3-border rounded-full flex items-center justify-center z-10">
                    <ArrowRight className="w-4 h-4 text-gray-500" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-electric to-purple hover:from-electric/90 hover:to-purple/90 text-white px-8 py-4 text-lg rounded-xl btn-glow"
            >
              <Link to="/pools">Explore Pools</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why SUIVEST - Crypto Native Features */}
      <section className="py-24 bg-web3-dark">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Built for Web3 Natives
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Decentralized infrastructure meets gamified savings
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Non-Custodial",
                description: "You own your keys, you own your crypto. Always.",
                icon: Lock,
                color: "electric",
                badge: "Self-Sovereign",
              },
              {
                title: "On-Chain Verified",
                description:
                  "Every transaction verified by blockchain consensus",
                icon: CheckCircle,
                color: "web3-success",
                badge: "Transparent",
              },
              {
                title: "DeFi Native",
                description: "Integrated with leading protocols for max yield",
                icon: Coins,
                color: "teal",
                badge: "Battle-Tested",
              },
              {
                title: "Sui Powered",
                description: "Lightning fast finality with minimal gas fees",
                icon: Zap,
                color: "purple",
                badge: "High Performance",
              },
            ].map((item, index) => (
              <div key={index} className="card-web3 rounded-2xl p-6 card-glow">
                <div className="space-y-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-${item.color}/10 flex items-center justify-center border border-${item.color}/20`}
                  >
                    <item.icon className={`w-6 h-6 text-${item.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-white">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                  <Badge
                    variant="outline"
                    className="border-gray-600 text-gray-400"
                  >
                    {item.badge}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Protocol Stats */}
      <section className="py-24 bg-web3-surface">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Protocol Metrics
            </h2>
            <p className="text-gray-400">
              Real-time data from the Sui blockchain
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                metric: "$0",
                label: "Total Value Locked",
                icon: DollarSign,
                color: "electric",
                change: "+0%",
                period: "30d",
              },
              {
                metric: "$0",
                label: "Total Rewards Distributed",
                icon: Trophy,
                color: "reward",
                change: "+0%",
                period: "7d",
              },
              {
                metric: "0",
                label: "Active Participants",
                icon: Users,
                color: "teal",
                change: "+0%",
                period: "30d",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="card-web3 rounded-2xl p-8 text-center card-glow"
              >
                <div
                  className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-${stat.color}/10 flex items-center justify-center border border-${stat.color}/20`}
                >
                  <stat.icon className={`w-8 h-8 text-${stat.color}`} />
                </div>
                <div className="text-4xl font-bold text-white mb-2">
                  {stat.metric}
                </div>
                <div className="text-gray-400 font-medium mb-2">
                  {stat.label}
                </div>
                <div className="flex items-center justify-center space-x-1 text-sm">
                  <TrendingUp className="w-4 h-4 text-web3-success" />
                  <span className="text-web3-success font-medium">
                    {stat.change}
                  </span>
                  <span className="text-gray-500">{stat.period}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement - Web3 Focused */}
      <section className="py-24 bg-web3-dark">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card-glow rounded-3xl p-12 text-center bg-gradient-to-r from-electric/10 to-purple/10 border border-electric/20">
            <blockquote className="text-2xl lg:text-3xl font-bold mb-6 text-white">
              "Building the future of decentralized savings. No intermediaries.
              No custody. Just code, consensus, and community."
            </blockquote>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-electric to-purple hover:from-electric/90 hover:to-purple/90 text-white px-8 py-4 text-lg rounded-xl btn-glow"
              >
                <Link to="/pools">
                  Enter Protocol <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-2 border-white/20 text-white hover:bg-white/10 glass px-8 py-4 text-lg rounded-xl"
              >
                <Link to="/docs">
                  Read Docs <ExternalLink className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Web3 Style */}
      <footer className="bg-web3-bg text-white py-16 border-t border-web3-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <img 
                  src="/ChatGPT_Image_Jul_23__2025__04_20_53_PM-removebg-preview.png" 
                  alt="Suivest Logo" 
                  className="w-[70px] h-[70px] object-contain"
                />
                <div>
                  <div className="text-xs text-gray-400 font-mono-crypto">
                    Decentralized Savings Protocol
                  </div>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                Built on Sui blockchain. Verified by code. Powered by community.
              </p>
              <div className="address">
                {/* 0x742d35Cc6E3a8c2F0F7C5B9a5b7F8c3d1E9a2B4F */}
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-white">Protocol</h4>
              <div className="space-y-2">
                {["Dashboard", "Pools", "Governance", "Analytics"].map(
                  (link) => (
                    <Link
                      key={link}
                      to={`/${link.toLowerCase()}`}
                      className="block text-gray-400 hover:text-electric transition-colors"
                    >
                      {link}
                    </Link>
                  ),
                )}
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-white">Developers</h4>
              <div className="space-y-2">
                {["Documentation", "Smart Contracts", "API", "SDK"].map(
                  (link) => (
                    <Link
                      key={link}
                      to={`/${link.toLowerCase().replace(" ", "-")}`}
                      className="block text-gray-400 hover:text-electric transition-colors"
                    >
                      {link}
                    </Link>
                  ),
                )}
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-white">Community</h4>
              <div className="flex space-x-4 mb-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-electric transition-colors p-2 rounded-lg hover:bg-electric/10"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                {/* <a
                  href="#"
                  className="text-gray-400 hover:text-electric transition-colors p-2 rounded-lg hover:bg-electric/10"
                >
                  <MessageCircle className="w-5 h-5" />
                </a> */}
                <a
                  href="#"
                  className="text-gray-400 hover:text-electric transition-colors p-2 rounded-lg hover:bg-electric/10"
                >
                  <Github className="w-5 h-5" />
                </a>
              </div>
              <div className="text-xs text-gray-500 space-y-1">
                <div>Audited by CertiK</div>
                <div>Insured by Nexus</div>
                <div>Built with ❤️ on Sui</div>
              </div>
            </div>
          </div>

          <div className="border-t border-web3-border mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SUIVEST Protocol. Decentralized by design.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
