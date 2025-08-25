import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Target,
  Ticket,
  Shield,
  Zap,
  Lock,
  Brain,
  Users,
  Globe,
  Code,
  Coins,
  TrendingUp,
  DollarSign,
  Star,
  ArrowRight,
  Sparkles,
  Eye,
  GitBranch,
  Wallet,
  FileText,
  ExternalLink,
  CheckCircle,
  Trophy,
  Flame,
} from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-web3-dark">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 bg-crypto-mesh">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-electric/10 rounded-full blur-3xl animate-pulse-glow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple/10 rounded-full blur-3xl animate-pulse-glow delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-teal/10 rounded-full blur-2xl animate-pulse-glow delay-500"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="space-y-8">
              <div className="space-y-6">
                <Badge
                  variant="outline"
                  className="bg-white/10 backdrop-blur-sm border-electric/20 text-electric px-4 py-2 text-sm font-medium"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Powered by Sui Blockchain
                </Badge>

                <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                  <span className="text-white">Save.</span>{" "}
                  <span className="text-gradient">Earn.</span>{" "}
                  <span className="text-white">Win.</span>{" "}
                  <span className="text-gradient">Repeat.</span>
                </h1>

                <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
                  SUIVEST is the no-loss savings protocol that turns saving into
                  a game you can win.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-electric hover:bg-electric/90 text-white px-8 py-4 text-lg rounded-xl transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-electric/25"
                >
                  <Link to="/pools">Start Saving Now</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-2 border-white/20 text-white hover:bg-white/10 backdrop-blur-sm px-8 py-4 text-lg rounded-xl transition-all duration-200"
                >
                  <Link to="/dashboard">View Dashboard</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-24 bg-web3-surface">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8">
              Protocol Mission
            </h2>
            <p className="text-2xl lg:text-3xl text-gray-300 leading-relaxed font-medium">
              Building the future of{" "}
              <span className="text-gradient font-bold">
                decentralized savings
              </span>
              . SUIVEST empowers users to{" "}
              <span className="text-electric font-bold">build wealth</span>,{" "}
              <span className="text-teal font-bold">earn yield</span>, and{" "}
              <span className="text-reward font-bold">win rewards</span> without
              custodial risk.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three simple steps to start your gamified savings journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                step: "1",
                title: "Deposit",
                description:
                  "Users deposit tokens into a prize pool (SUI, USDC, WBTC)",
                icon: DollarSign,
                color: "electric",
                details: "Your funds are always safe and accessible",
              },
              {
                step: "2",
                title: "Earn Yield",
                description:
                  "Deposits earn yield via trusted DeFi protocols like Scallop and Navi",
                icon: TrendingUp,
                color: "teal",
                details: "Powered by battle-tested yield strategies",
              },
              {
                step: "3",
                title: "Win Prizes",
                description:
                  "Yield funds weekly prize draws, users never lose their principal",
                icon: Trophy,
                color: "reward",
                details: "Winners take home the generated yield",
              },
            ].map((item, index) => (
              <div key={index} className="relative">
                <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 h-full">
                  <CardHeader className="text-center pb-4">
                    <div
                      className={`w-20 h-20 mx-auto rounded-2xl bg-${item.color}/10 flex items-center justify-center mb-4`}
                    >
                      <item.icon className={`w-10 h-10 text-${item.color}`} />
                    </div>
                    <div
                      className={`w-12 h-12 mx-auto rounded-full bg-${item.color} text-white flex items-center justify-center font-bold text-xl mb-4`}
                    >
                      {item.step}
                    </div>
                    <CardTitle className="text-2xl text-gray-900">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    <p className="text-gray-600 leading-relaxed">
                      {item.description}
                    </p>
                    <div className={`bg-${item.color}/5 rounded-lg p-3`}>
                      <p className="text-sm font-medium text-gray-700">
                        {item.details}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {index < 2 && (
                  <div className=" md:block absolute top-1/2 -right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center z-10">
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              What Makes Us Different
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built for the future of decentralized finance
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "No-Loss Savings",
                description:
                  "Your principal is always protected. Win or lose, your money stays yours.",
                icon: Shield,
                color: "electric",
                highlight: "100% Capital Protection",
              },
              {
                title: "Gamified Tickets",
                description:
                  "Build streaks, earn tickets, and boost your odds with $SVT tokens.",
                icon: Ticket,
                color: "reward",
                highlight: "Streak-Based Rewards",
              },
              {
                title: "Always Accessible",
                description:
                  "Withdraw your funds anytime. No lock-ups, no penalties.",
                icon: Lock,
                color: "teal",
                highlight: "Full Liquidity",
              },
              {
                title: "Sui-Powered Speed",
                description:
                  "Lightning-fast transactions with minimal fees on the Sui blockchain.",
                icon: Zap,
                color: "electric",
                highlight: "Sub-Second Finality",
              },
              {
                title: "Transparent Contracts",
                description:
                  "Open-source smart contracts you can verify and trust.",
                icon: Eye,
                color: "teal",
                highlight: "Fully Audited",
              },
              {
                title: "Community-First",
                description:
                  "Governed by users, built for users, owned by users.",
                icon: Users,
                color: "reward",
                highlight: "Decentralized Governance",
              },
            ].map((item, index) => (
              <Card
                key={index}
                className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
              >
                <CardHeader>
                  <div
                    className={`w-16 h-16 rounded-2xl bg-${item.color}/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <item.icon className={`w-8 h-8 text-${item.color}`} />
                  </div>
                  <CardTitle className="text-xl text-gray-900 mb-2">
                    {item.title}
                  </CardTitle>
                  <Badge
                    variant="outline"
                    className={`text-${item.color} border-${item.color}/20 w-fit`}
                  >
                    {item.highlight}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SUIVEST Ecosystem */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              The SUIVEST Ecosystem
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Understanding how $SVT tokens and tickets work together
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <Card className="bg-gradient-to-br from-electric/10 to-teal/10 border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-reward/10 rounded-xl flex items-center justify-center">
                        <Coins className="w-6 h-6 text-reward" />
                      </div>
                      <span>$SVT Tokens</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-700">
                      The native token that powers the SUIVEST ecosystem:
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-teal" />
                        <span className="text-sm">
                          Earned through consistent saving streaks
                        </span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-teal" />
                        <span className="text-sm">
                          Used to boost winning odds in pools
                        </span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-teal" />
                        <span className="text-sm">
                          Future governance rights
                        </span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-100 to-electric/10 border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-electric/10 rounded-xl flex items-center justify-center">
                        <Ticket className="w-6 h-6 text-electric" />
                      </div>
                      <span>Tickets System</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-700">
                      Your chances to win are based on tickets:
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-electric" />
                        <span className="text-sm">1 ticket = $1 deposited</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-electric" />
                        <span className="text-sm">
                          Bonus tickets from saving streaks
                        </span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-electric" />
                        <span className="text-sm">
                          More tickets = higher winning probability
                        </span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                    Ecosystem Flow
                  </h3>

                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-electric/10 rounded-full flex items-center justify-center">
                        <span className="text-electric font-bold">1</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          Deposit & Get Tickets
                        </p>
                        <p className="text-sm text-gray-600">
                          $100 deposit = 100 tickets
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-teal/10 rounded-full flex items-center justify-center">
                        <span className="text-teal font-bold">2</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          Build Streaks
                        </p>
                        <p className="text-sm text-gray-600">
                          Earn $SVT + bonus tickets
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-reward/10 rounded-full flex items-center justify-center">
                        <span className="text-reward font-bold">3</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Boost Odds</p>
                        <p className="text-sm text-gray-600">
                          Burn $SVT for better chances
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <Trophy className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Win Prizes</p>
                        <p className="text-sm text-gray-600">
                          Take home the yield rewards
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Backed by Web3 Principles */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Backed by Web3 Principles
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built on the foundation of decentralization, transparency, and
              user empowerment
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Decentralized",
                description:
                  "No central authority controls your funds or the protocol",
                icon: Globe,
                stat: "100% On-Chain",
              },
              {
                title: "Open Source",
                description:
                  "All smart contracts are publicly auditable and verifiable",
                icon: Code,
                stat: "Fully Transparent",
              },
              {
                title: "User-First Economics",
                description:
                  "Protocol fees go back to users and ecosystem growth",
                icon: Users,
                stat: "0% Platform Fees",
              },
              {
                title: "Sui-Powered",
                description: "Built on Sui for unmatched speed and efficiency",
                icon: Zap,
                stat: "<400ms Finality",
              },
            ].map((principle, index) => (
              <Card
                key={index}
                className="text-center bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <CardHeader>
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-electric/10 to-teal/10 rounded-2xl flex items-center justify-center mb-4">
                    <principle.icon className="w-8 h-8 text-electric" />
                  </div>
                  <CardTitle className="text-xl text-gray-900">
                    {principle.title}
                  </CardTitle>
                  <Badge
                    variant="outline"
                    className="text-teal border-teal/20 mx-auto"
                  >
                    {principle.stat}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{principle.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Footer */}
      <section className="py-24 bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to make saving a game worth playing?
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Join thousands of users who are already earning rewards while
              building their savings habits.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-electric hover:bg-electric/90 text-white px-8 py-4 text-lg rounded-xl transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-electric/25"
              >
                <Link to="/pools">
                  <Target className="w-5 h-5 mr-2" />
                  Join a Pool
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-2 border-white/20 text-white hover:bg-white/10 backdrop-blur-sm px-8 py-4 text-lg rounded-xl transition-all duration-200"
              >
                <Link to="/docs">
                  <FileText className="w-5 h-5 mr-2" />
                  View Whitepaper
                </Link>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-2 border-teal/20 text-teal hover:bg-teal/10 backdrop-blur-sm px-8 py-4 text-lg rounded-xl transition-all duration-200"
              >
                <Wallet className="w-5 h-5 mr-2" />
                Connect Wallet
              </Button>
            </div>

            <div className="mt-12 pt-8 border-t border-white/10">
              <p className="text-gray-400 text-sm">
                SUIVEST is powered by the Sui blockchain and audited by leading
                security firms.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
