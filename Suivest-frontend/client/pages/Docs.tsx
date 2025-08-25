import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BookOpen,
  Menu,
  X,
  Sun,
  Moon,
  ChevronRight,
  ChevronDown,
  Code,
  Shield,
  Zap,
  Users,
  ExternalLink,
  Copy,
  Check,
  Github,
  FileText,
  Coins,
  Target,
  Lock,
  Globe,
  AlertTriangle,
  Info,
  HelpCircle,
  Settings,
  Clock,
} from "lucide-react";

interface Section {
  id: string;
  title: string;
  icon: any;
  subsections?: { id: string; title: string }[];
}

const sections: Section[] = [
  { id: "overview", title: "Overview", icon: BookOpen },
  { id: "how-it-works", title: "How SUIVEST Works", icon: Zap },
  {
    id: "prize-pool",
    title: "Prize Pool Architecture",
    icon: Code,
    subsections: [
      { id: "smart-contracts", title: "Smart Contracts" },
      { id: "yield-integration", title: "Yield Integration" },
      { id: "winner-selection", title: "Winner Selection" },
    ],
  },
  { id: "streak-tickets", title: "Streak & Tickets System", icon: Target },
  {
    id: "svt-token",
    title: "SVT Token Utility",
    icon: Coins,
    subsections: [
      { id: "tokenomics", title: "Tokenomics" },
      { id: "governance", title: "Governance" },
    ],
  },
  { id: "boost-feature", title: "Boost Feature", icon: Zap },
  { id: "supported-tokens", title: "Supported Tokens", icon: Globe },
  {
    id: "security",
    title: "Security & Audits",
    icon: Shield,
    subsections: [
      { id: "audits", title: "Audits" },
      { id: "emergency", title: "Emergency Procedures" },
    ],
  },
  { id: "faqs", title: "FAQs", icon: HelpCircle },
  {
    id: "api",
    title: "API & SDK",
    icon: Code,
    subsections: [
      { id: "endpoints", title: "API Endpoints" },
      { id: "sdk", title: "SDK Usage" },
    ],
  },
  { id: "contributing", title: "Contributing", icon: Users },
  { id: "changelog", title: "Changelog", icon: Clock },
];

const CodeBlock = ({
  children,
  language = "typescript",
}: {
  children: string;
  language?: string;
}) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative bg-gray-900 rounded-lg p-4 my-4">
      <div className="flex items-center justify-between mb-2">
        <Badge variant="outline" className="text-xs">
          {language}
        </Badge>
        <Button
          size="sm"
          variant="ghost"
          onClick={copyToClipboard}
          className="h-6 w-6 p-0"
        >
          {copied ? (
            <Check className="w-3 h-3 text-green-400" />
          ) : (
            <Copy className="w-3 h-3" />
          )}
        </Button>
      </div>
      <pre className="text-sm text-gray-100 overflow-x-auto">
        <code>{children}</code>
      </pre>
    </div>
  );
};

const Docs = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "prize-pool",
    "svt-token",
    "security",
    "api",
  ]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("[data-section]");
      let current = "";

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100) {
          current = section.getAttribute("data-section") || "";
        }
      });

      if (current) {
        setActiveSection(current);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId],
    );
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-white text-navy">
      <div className="flex">
        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-80 bg-white text-navy border-r border-gray-200 transform transition-transform duration-300 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 lg:static lg:inset-0`}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-electric rounded-lg flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg text-navy">
                SUIVEST Docs
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="h-8 w-8 p-0 text-navy"
            >
              {isDarkMode ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
            </Button>
          </div>

          <ScrollArea className="h-[calc(100vh-80px)] p-4">
            <nav className="space-y-2">
              {sections.map((section) => (
                <div key={section.id}>
                  <Button
                    variant={
                      activeSection === section.id ? "secondary" : "ghost"
                    }
                    className="w-full justify-start text-left h-auto p-3"
                    onClick={() => {
                      if (section.subsections) {
                        toggleSection(section.id);
                      } else {
                        scrollToSection(section.id);
                      }
                    }}
                  >
                    <section.icon className="w-4 h-4 mr-2 flex-shrink-0 text-navy" />
                    <span className="flex-1">{section.title}</span>
                    {section.subsections && (
                      <div className="ml-2">
                        {expandedSections.includes(section.id) ? (
                          <ChevronDown className="w-4 h-4 text-navy" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-navy" />
                        )}
                      </div>
                    )}
                  </Button>

                  {section.subsections &&
                    expandedSections.includes(section.id) && (
                      <div className="ml-6 mt-1 space-y-1">
                        {section.subsections.map((subsection) => (
                          <Button
                            key={subsection.id}
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-left text-sm text-navy"
                            onClick={() => scrollToSection(subsection.id)}
                          >
                            {subsection.title}
                          </Button>
                        ))}
                      </div>
                    )}
                </div>
              ))}
            </nav>
          </ScrollArea>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-80">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <span className="font-semibold text-navy">Documentation</span>
            <div className="w-5" />
          </div>

          <div className="max-w-4xl mx-auto p-6 lg:p-8">
            {/* Overview */}
            <section id="overview" data-section="overview" className="mb-16">
              <h1 className="text-4xl font-bold mb-6 text-navy">
                SUIVEST Technical Documentation
              </h1>
              <div className="space-y-6">
                <Card className="bg-white border border-gray-200">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-navy">
                      <Info className="w-5 h-5 text-electric" />
                      <span>What is SUIVEST?</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-navy leading-relaxed">
                      SUIVEST is a no-loss savings platform that gamifies the
                      savings experience using prize pools powered by
                      yield-generating DeFi protocols on the Sui blockchain.
                      Users deposit supported tokens, earn yield through
                      battle-tested protocols, and have the chance to win weekly
                      prizes—all while maintaining access to their principal.
                    </p>
                    <div className="bg-electric/10 rounded-lg p-4 border-l-4 border-electric">
                      <h4 className="font-semibold text-electric mb-2">
                        Mission
                      </h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Transform traditional saving habits by making them
                        engaging, rewarding, and risk-free while providing users
                        with the opportunity to earn additional rewards through
                        gamified mechanics.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-6 text-center">
                      <Shield className="w-8 h-8 text-electric mx-auto mb-2" />
                      <h3 className="font-semibold mb-1">No-Loss</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Principal is always protected
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 text-center">
                      <Zap className="w-8 h-8 text-teal mx-auto mb-2" />
                      <h3 className="font-semibold mb-1">Yield-Powered</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Rewards from DeFi protocols
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 text-center">
                      <Target className="w-8 h-8 text-reward mx-auto mb-2" />
                      <h3 className="font-semibold mb-1">Gamified</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Streaks and boosted odds
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </section>

            {/* How SUIVEST Works */}
            <section
              id="how-it-works"
              data-section="how-it-works"
              className="mb-16"
            >
              <h2 className="text-3xl font-bold mb-6 dark:text-white">
                How SUIVEST Works
              </h2>
              <div className="space-y-6">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  SUIVEST operates on a simple yet powerful mechanism that
                  combines DeFi yield farming with gamified prize distribution.
                </p>

                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        1. Deposit Supported Tokens
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 dark:text-gray-300 mb-3">
                        Users can deposit any of the supported tokens:{" "}
                        <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                          SUI
                        </code>
                        ,
                        <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded ml-1">
                          USDC
                        </code>
                        ,
                        <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded ml-1">
                          suiUSDC
                        </code>
                        ,
                        <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded ml-1">
                          WALRUS
                        </code>
                        ,
                        <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded ml-1">
                          DEEP
                        </code>
                        .
                      </p>
                      <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-1">
                        <li>Each $1 deposited = 1 ticket</li>
                        <li>Deposits are pooled with other users</li>
                        <li>Funds can be withdrawn at any time</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        2. Earn Yield from DeFi Protocols
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 dark:text-gray-300 mb-3">
                        Deposited funds are automatically deployed to
                        yield-generating strategies:
                      </p>
                      <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-1">
                        <li>
                          <strong>Scallop Protocol:</strong> Lending and
                          borrowing yields
                        </li>
                        <li>
                          <strong>DeepBook:</strong> Market making and liquidity
                          provision
                        </li>
                        <li>
                          <strong>Navi Protocol:</strong> Additional lending
                          opportunities
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        3. Weekly Prize Distribution
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 dark:text-gray-300 mb-3">
                        All generated yield is collected and distributed as
                        prizes:
                      </p>
                      <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-1">
                        <li>3 winners selected randomly each week</li>
                        <li>Winners determined by verifiable randomness</li>
                        <li>Prize amounts based on total yield generated</li>
                        <li>All participants retain their principal</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </section>

            {/* Prize Pool Architecture */}
            <section
              id="prize-pool"
              data-section="prize-pool"
              className="mb-16"
            >
              <h2 className="text-3xl font-bold mb-6 dark:text-white">
                Prize Pool Architecture
              </h2>

              <div id="smart-contracts" className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 dark:text-white">
                  Smart Contracts
                </h3>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      The SUIVEST protocol consists of several interconnected
                      smart contracts built on Sui's Move language:
                    </p>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">PrizePool Module</h4>
                        <CodeBlock language="move">
                          {`module suivest::prize_pool {
    use sui::object::{Self, UID};
    use sui::balance::{Self, Balance};
    use sui::coin::{Self, Coin};
    
    struct PrizePool<phantom T> has key, store {
        id: UID,
        deposits: Balance<T>,
        total_tickets: u64,
        current_week: u64,
        yield_balance: Balance<T>,
    }
}`}
                        </CodeBlock>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">
                          Ticket Management
                        </h4>
                        <CodeBlock language="move">
                          {`struct UserTickets has key, store {
    id: UID,
    owner: address,
    pool_id: ID,
    ticket_count: u64,
    streak_weeks: u64,
    boost_multiplier: u64,
}`}
                        </CodeBlock>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div id="yield-integration" className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 dark:text-white">
                  Yield Integration
                </h3>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      SUIVEST integrates with multiple DeFi protocols to
                      generate yield safely:
                    </p>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">
                          Scallop Integration
                        </h4>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                          <li>• Automated lending strategies</li>
                          <li>• Dynamic interest rate optimization</li>
                          <li>• Risk-managed exposure</li>
                        </ul>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">
                          DeepBook Integration
                        </h4>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                          <li>• Market making revenue</li>
                          <li>• Liquidity provision rewards</li>
                          <li>• Automated rebalancing</li>
                        </ul>
                      </div>
                    </div>

                    <CodeBlock language="typescript">
                      {`// Example yield strategy integration
const depositToYieldSource = async (
  amount: bigint,
  token: string,
  strategy: 'scallop' | 'deepbook'
) => {
  const txb = new TransactionBlock();
  
  if (strategy === 'scallop') {
    txb.moveCall({
      target: \`\${PACKAGE_ID}::scallop_adapter::deposit\`,
      arguments: [
        txb.object(POOL_ID),
        txb.pure(amount),
        txb.object(SCALLOP_MARKET)
      ],
      typeArguments: [token]
    });
  }
  
  return await signAndExecuteTransactionBlock({ transactionBlock: txb });
};`}
                    </CodeBlock>
                  </CardContent>
                </Card>
              </div>

              <div id="winner-selection" className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 dark:text-white">
                  Winner Selection
                </h3>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Fair and verifiable randomness ensures transparent winner
                      selection:
                    </p>

                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 mb-4">
                      <div className="flex">
                        <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">
                            Randomness Source
                          </h4>
                          <p className="text-sm text-yellow-700 dark:text-yellow-300">
                            Uses Sui's native randomness beacon for
                            cryptographically secure random number generation.
                          </p>
                        </div>
                      </div>
                    </div>

                    <CodeBlock language="move">
                      {`public entry fun select_winners<T>(
    pool: &mut PrizePool<T>,
    random: &Random,
    ctx: &mut TxContext
) {
    let total_tickets = pool.total_tickets;
    let mut winners = vector::empty<address>();
    
    let mut i = 0;
    while (i < 3) {
        let random_number = random::generate_u64_in_range(
            random, 1, total_tickets
        );
        let winner = find_ticket_owner(pool, random_number);
        vector::push_back(&mut winners, winner);
        i = i + 1;
    };
    
    distribute_prizes(pool, winners, ctx);
}`}
                    </CodeBlock>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Streak & Tickets System */}
            <section
              id="streak-tickets"
              data-section="streak-tickets"
              className="mb-16"
            >
              <h2 className="text-3xl font-bold mb-6 dark:text-white">
                Streak & Tickets System
              </h2>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Ticket Mechanics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-electric/10 rounded-lg p-4">
                        <h4 className="font-semibold text-electric mb-2">
                          Basic Formula
                        </h4>
                        <code className="text-sm">
                          Tickets = Deposit Amount (USD) × Streak Multiplier
                        </code>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2">Streak Bonuses</h4>
                          <ul className="text-sm space-y-1">
                            <li>• Week 1-2: 1x multiplier</li>
                            <li>• Week 3-5: 1.1x multiplier</li>
                            <li>• Week 6-10: 1.2x multiplier</li>
                            <li>• Week 11+: 1.3x multiplier</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Streak Rules</h4>
                          <ul className="text-sm space-y-1">
                            <li>• Must maintain deposits weekly</li>
                            <li>• Withdrawal resets streak</li>
                            <li>• Missing a week breaks streak</li>
                            <li>• Bonus tickets awarded retroactively</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* SVT Token Utility */}
            <section id="svt-token" data-section="svt-token" className="mb-16">
              <h2 className="text-3xl font-bold mb-6 dark:text-white">
                SVT Token Utility
              </h2>

              <div id="tokenomics" className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 dark:text-white">
                  Tokenomics
                </h3>
                <Card>
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">
                          Token Distribution
                        </h4>
                        <ul className="space-y-2 text-sm">
                          <li className="flex justify-between">
                            <span>Streak Rewards:</span>
                            <span className="font-medium">40%</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Liquidity Mining:</span>
                            <span className="font-medium">25%</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Team & Development:</span>
                            <span className="font-medium">20%</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Community Treasury:</span>
                            <span className="font-medium">15%</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">Earning SVT</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• 10 SVT per week of streak maintenance</li>
                          <li>• Bonus SVT for milestone achievements</li>
                          <li>• Additional rewards for longer streaks</li>
                          <li>• Community participation rewards</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div id="governance" className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 dark:text-white">
                  Governance (Future)
                </h3>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      SVT tokens will enable decentralized governance of the
                      SUIVEST protocol:
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li>• Voting on yield strategy changes</li>
                      <li>• Protocol parameter adjustments</li>
                      <li>• New token integration proposals</li>
                      <li>• Treasury management decisions</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Boost Feature */}
            <section
              id="boost-feature"
              data-section="boost-feature"
              className="mb-16"
            >
              <h2 className="text-3xl font-bold mb-6 dark:text-white">
                Boost Feature
              </h2>
              <Card>
                <CardContent className="p-6">
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Users can burn SVT tokens to increase their winning odds for
                    specific draws:
                  </p>

                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-electric/10 to-teal/10 rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Boost Formula</h4>
                      <code className="text-sm">
                        Boost Multiplier = 1 + (SVT Burned / 1000) × 0.1
                      </code>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                        Maximum boost: 2x (requires 10,000 SVT)
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">Boost Limits</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Maximum 2x multiplier per draw</li>
                          <li>• SVT tokens are burned (deflationary)</li>
                          <li>• Boost applies to one week only</li>
                          <li>• Must be applied before draw</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">
                          Example Calculations
                        </h4>
                        <ul className="text-sm space-y-1">
                          <li>
                            • 100 tickets + 1000 SVT = 110 effective tickets
                          </li>
                          <li>
                            • 100 tickets + 5000 SVT = 150 effective tickets
                          </li>
                          <li>
                            • 100 tickets + 10000 SVT = 200 effective tickets
                          </li>
                        </ul>
                      </div>
                    </div>

                    <CodeBlock language="typescript">
                      {`const applyBoost = async (poolId: string, svtAmount: bigint) => {
  const txb = new TransactionBlock();
  
  txb.moveCall({
    target: \`\${PACKAGE_ID}::boost::apply_boost\`,
    arguments: [
      txb.object(poolId),
      txb.pure(svtAmount),
      txb.object(SVT_TREASURY)
    ],
    typeArguments: ['0x2::sui::SUI']
  });
  
  return await signAndExecuteTransactionBlock({ transactionBlock: txb });
};`}
                    </CodeBlock>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Supported Tokens */}
            <section
              id="supported-tokens"
              data-section="supported-tokens"
              className="mb-16"
            >
              <h2 className="text-3xl font-bold mb-6 dark:text-white">
                Supported Tokens
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    symbol: "SUI",
                    name: "Sui Token",
                    yieldSource: "Scallop Lending",
                    apy: "3.2%",
                  },
                  {
                    symbol: "USDC",
                    name: "USD Coin",
                    yieldSource: "DeepBook + Scallop",
                    apy: "4.1%",
                  },
                  {
                    symbol: "suiUSDC",
                    name: "Sui USDC",
                    yieldSource: "Navi Protocol",
                    apy: "3.8%",
                  },
                  {
                    symbol: "WALRUS",
                    name: "Walrus Token",
                    yieldSource: "Scallop",
                    apy: "5.2%",
                  },
                  {
                    symbol: "DEEP",
                    name: "DeepBook Token",
                    yieldSource: "DeepBook Staking",
                    apy: "6.5%",
                  },
                ].map((token) => (
                  <Card key={token.symbol}>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-electric/10 rounded-full flex items-center justify-center">
                          <Coins className="w-5 h-5 text-electric" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{token.symbol}</h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {token.name}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">
                            Est. APY:
                          </span>
                          <span className="font-medium text-teal">
                            {token.apy}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">
                            Yield Source:
                          </span>
                          <p className="font-medium">{token.yieldSource}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Security & Audits */}
            <section id="security" data-section="security" className="mb-16">
              <h2 className="text-3xl font-bold mb-6 dark:text-white">
                Security & Audits
              </h2>

              <div id="audits" className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 dark:text-white">
                  Security Audits
                </h3>
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-400 p-4">
                        <div className="flex">
                          <Shield className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-green-800 dark:text-green-200">
                              Audit Status
                            </h4>
                            <p className="text-sm text-green-700 dark:text-green-300">
                              Smart contracts audited by leading blockchain
                              security firms.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2">
                            Security Measures
                          </h4>
                          <ul className="text-sm space-y-1">
                            <li>• Multi-signature treasury management</li>
                            <li>• Timelock contracts for upgrades</li>
                            <li>• Emergency pause functionality</li>
                            <li>• Formal verification of core logic</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">
                            Risk Management
                          </h4>
                          <ul className="text-sm space-y-1">
                            <li>• Diversified yield sources</li>
                            <li>• Slippage protection</li>
                            <li>• Automated monitoring systems</li>
                            <li>• Insurance fund for edge cases</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div id="emergency" className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 dark:text-white">
                  Emergency Procedures
                </h3>
                <Card>
                  <CardContent className="p-6">
                    <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 p-4 mb-4">
                      <div className="flex">
                        <AlertTriangle className="w-5 h-5 text-red-600 mr-2 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-red-800 dark:text-red-200">
                            Emergency Withdrawal
                          </h4>
                          <p className="text-sm text-red-700 dark:text-red-300">
                            In case of smart contract issues, users can always
                            withdraw their principal directly.
                          </p>
                        </div>
                      </div>
                    </div>

                    <CodeBlock language="move">
                      {`public entry fun emergency_withdraw<T>(
    pool: &mut PrizePool<T>,
    user_tickets: &mut UserTickets,
    ctx: &mut TxContext
) {
    assert!(pool.emergency_mode == true, ERROR_NOT_EMERGENCY);
    
    let withdrawal_amount = calculate_user_share(pool, user_tickets);
    let withdrawn_coin = coin::take(&mut pool.deposits, withdrawal_amount, ctx);
    
    transfer::public_transfer(withdrawn_coin, tx_context::sender(ctx));
    reset_user_tickets(user_tickets);
}`}
                    </CodeBlock>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* FAQs */}
            <section id="faqs" data-section="faqs" className="mb-16">
              <h2 className="text-3xl font-bold mb-6 dark:text-white">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {[
                  {
                    question: "How do I deposit tokens into a prize pool?",
                    answer:
                      "Connect your wallet, select a supported token pool, enter the amount you want to deposit, and confirm the transaction. You'll receive tickets equal to your deposit amount in USD.",
                  },
                  {
                    question: "What happens if I don't win a prize?",
                    answer:
                      "Your principal remains completely safe and accessible. You can withdraw your funds at any time, maintain your streak for bonus tickets, and continue participating in future draws.",
                  },
                  {
                    question: "What yield sources does SUIVEST use?",
                    answer:
                      "SUIVEST integrates with battle-tested DeFi protocols including Scallop for lending, DeepBook for market making, and Navi Protocol for additional yield strategies.",
                  },
                  {
                    question: "How does the boost feature work?",
                    answer:
                      "You can burn SVT tokens to increase your winning odds for a specific draw. The boost multiplier ranges from 1x to 2x based on the amount of SVT burned (up to 10,000 SVT for maximum boost).",
                  },
                  {
                    question: "How are prizes distributed fairly?",
                    answer:
                      "Winners are selected using Sui's native randomness beacon, ensuring cryptographically secure and verifiable random selection. The smart contract logic is transparent and auditable.",
                  },
                  {
                    question: "Can I withdraw my funds at any time?",
                    answer:
                      "Yes, your funds are always accessible. However, withdrawing will reset your streak progress and you'll lose any accumulated streak bonuses for future draws.",
                  },
                  {
                    question: "How do I earn SVT tokens?",
                    answer:
                      "SVT tokens are earned by maintaining consistent saving streaks. You receive 10 SVT per week of streak maintenance, with bonus rewards for reaching milestones.",
                  },
                  {
                    question: "What are the risks involved?",
                    answer:
                      "SUIVEST is designed to be no-loss, meaning your principal is always protected. The main risks are smart contract risks (mitigated by audits) and yield source risks (mitigated by diversification).",
                  },
                ].map((faq, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">{faq.question}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 dark:text-gray-300">
                        {faq.answer}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* API & SDK */}
            <section id="api" data-section="api" className="mb-16">
              <h2 className="text-3xl font-bold mb-6 dark:text-white">
                API & SDK
              </h2>

              <div id="endpoints" className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 dark:text-white">
                  API Endpoints
                </h3>
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold mb-2">
                          Get Pool Statistics
                        </h4>
                        <CodeBlock language="bash">
                          {`GET /api/pools/{poolId}/stats

Response:
{
  "poolId": "0x123...",
  "tokenType": "SUI",
  "totalDeposits": "150000.00",
  "totalTickets": 150000,
  "currentPrize": "1250.50",
  "participants": 234,
  "nextDraw": "2024-02-01T00:00:00Z"
}`}
                        </CodeBlock>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Get User Tickets</h4>
                        <CodeBlock language="bash">
                          {`GET /api/users/{address}/tickets?poolId={poolId}

Response:
{
  "userAddress": "0xabc...",
  "poolId": "0x123...",
  "ticketCount": 500,
  "streakWeeks": 7,
  "boostMultiplier": 1.2,
  "effectiveTickets": 600
}`}
                        </CodeBlock>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">
                          Get Prize History
                        </h4>
                        <CodeBlock language="bash">
                          {`GET /api/prizes/history?limit=10

Response:
{
  "prizes": [
    {
      "week": "2024-W05",
      "poolId": "0x123...",
      "winners": ["0xabc...", "0xdef...", "0x789..."],
      "amounts": ["800.00", "300.00", "150.50"],
      "totalYield": "1250.50"
    }
  ]
}`}
                        </CodeBlock>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div id="sdk" className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 dark:text-white">
                  SDK Usage
                </h3>
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Installation</h4>
                        <CodeBlock language="bash">
                          {`npm install @suivest/sdk
# or
yarn add @suivest/sdk`}
                        </CodeBlock>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Basic Usage</h4>
                        <CodeBlock language="typescript">
                          {`import { SuivestClient } from '@suivest/sdk';

const client = new SuivestClient({
  network: 'mainnet',
  privateKey: process.env.PRIVATE_KEY
});

// Deposit to a pool
const depositTx = await client.deposit({
  poolId: '0x123...',
  amount: '100000000', // 0.1 SUI in MIST
  tokenType: 'SUI'
});

// Get user statistics
const userStats = await client.getUserStats('0xabc...');
console.log(\`User has \${userStats.totalTickets} tickets\`);

// Apply boost
const boostTx = await client.applyBoost({
  poolId: '0x123...',
  svtAmount: '1000000000' // 1000 SVT
});`}
                        </CodeBlock>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Contributing */}
            <section
              id="contributing"
              data-section="contributing"
              className="mb-16"
            >
              <h2 className="text-3xl font-bold mb-6 dark:text-white">
                Contributing
              </h2>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-300">
                      SUIVEST is committed to open-source development and
                      community contributions. Here's how you can get involved:
                    </p>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center">
                          <Github className="w-4 h-4 mr-2" />
                          Development
                        </h4>
                        <ul className="text-sm space-y-1">
                          <li>• Report bugs and security issues</li>
                          <li>• Submit feature proposals</li>
                          <li>• Contribute to smart contract development</li>
                          <li>• Improve documentation</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center">
                          <Users className="w-4 h-4 mr-2" />
                          Community
                        </h4>
                        <ul className="text-sm space-y-1">
                          <li>• Join Discord for discussions</li>
                          <li>• Participate in governance votes</li>
                          <li>• Share feedback and suggestions</li>
                          <li>• Help other users</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Getting Started</h4>
                      <CodeBlock language="bash">
                        {`# Clone the repository
git clone https://github.com/suivest/protocol.git

# Install dependencies
cd protocol
npm install

# Run tests
npm test

# Build contracts
npm run build`}
                      </CodeBlock>
                    </div>

                    <div className="flex space-x-4">
                      <Button
                        variant="outline"
                        className="flex items-center space-x-2"
                      >
                        <Github className="w-4 h-4" />
                        <span>View on GitHub</span>
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="outline"
                        className="flex items-center space-x-2"
                      >
                        <Users className="w-4 h-4" />
                        <span>Join Discord</span>
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Changelog */}
            <section id="changelog" data-section="changelog" className="mb-16">
              <h2 className="text-3xl font-bold mb-6 dark:text-white">
                Changelog
              </h2>
              <div className="space-y-4">
                {[
                  {
                    version: "v1.2.0",
                    date: "2024-01-15",
                    type: "Feature",
                    changes: [
                      "Added WALRUS and DEEP token support",
                      "Implemented boost feature with SVT token burning",
                      "Enhanced streak mechanics with milestone rewards",
                      "Updated UI for better mobile experience",
                    ],
                  },
                  {
                    version: "v1.1.0",
                    date: "2024-01-01",
                    type: "Update",
                    changes: [
                      "Integrated DeepBook yield source",
                      "Improved randomness mechanism",
                      "Added emergency withdrawal functionality",
                      "Fixed streak calculation edge cases",
                    ],
                  },
                  {
                    version: "v1.0.0",
                    date: "2023-12-15",
                    type: "Release",
                    changes: [
                      "Initial mainnet launch",
                      "SUI and USDC pools available",
                      "Basic streak and ticket system",
                      "Scallop yield integration",
                      "Smart contract security audit completed",
                    ],
                  },
                ].map((release) => (
                  <Card key={release.version}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          {release.version}
                        </CardTitle>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant={
                              release.type === "Release"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {release.type}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {release.date}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1">
                        {release.changes.map((change, index) => (
                          <li
                            key={index}
                            className="text-sm text-navy flex items-start"
                          >
                            <span className="w-1.5 h-1.5 bg-electric rounded-full mt-2 mr-2 flex-shrink-0"></span>
                            {change}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Docs;
