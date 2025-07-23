import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PoolCard from "@/components/PoolCard";
import {
  DollarSign,
  TrendingUp,
  Shield,
  Info,
  Sparkles,
  ArrowRight,
  Timer,
} from "lucide-react";

interface Pool {
  id: string;
  token: {
    name: string;
    symbol: string;
    logo: string;
    color: string;
  };
  yieldSource: string;
  weeklyPrize: string;
  apr: string;
  totalDeposits: {
    usd: string;
    token: string;
  };
  userStreak: number;
  boostApplied: boolean;
  participants: number;
  timeLeft: string;
  status: "active" | "ended";
}

const pools: Pool[] = [
  {
    id: "1",
    token: {
      name: "Sui",
      symbol: "SUI",
      logo: "💧",
      color: "electric",
    },
    yieldSource: "Powered by Scallop",
    weeklyPrize: "$1,500",
    apr: "3.2%",
    totalDeposits: {
      usd: "$35,000",
      token: "28,100 SUI",
    },
    userStreak: 7,
    boostApplied: true,
    participants: 156,
    timeLeft: "2d 14h",
    status: "active",
  },
  {
    id: "2",
    token: {
      name: "USD Coin",
      symbol: "USDC",
      logo: "💵",
      color: "teal",
    },
    yieldSource: "Powered by Navi Lend",
    weeklyPrize: "$2,200",
    apr: "4.1%",
    totalDeposits: {
      usd: "$52,400",
      token: "52,400 USDC",
    },
    userStreak: 0,
    boostApplied: false,
    participants: 203,
    timeLeft: "4d 8h",
    status: "active",
  },
  {
    id: "3",
    token: {
      name: "Wrapped BTC",
      symbol: "WBTC",
      logo: "₿",
      color: "reward",
    },
    yieldSource: "Powered by Scallop",
    weeklyPrize: "$3,800",
    apr: "2.8%",
    totalDeposits: {
      usd: "$89,200",
      token: "1.42 WBTC",
    },
    userStreak: 3,
    boostApplied: false,
    participants: 89,
    timeLeft: "1d 22h",
    status: "active",
  },
  {
    id: "4",
    token: {
      name: "Ethereum",
      symbol: "ETH",
      logo: "♦️",
      color: "electric",
    },
    yieldSource: "Powered by Navi Lend",
    weeklyPrize: "$980",
    apr: "3.5%",
    totalDeposits: {
      usd: "$18,600",
      token: "7.8 ETH",
    },
    userStreak: 0,
    boostApplied: false,
    participants: 67,
    timeLeft: "Ended",
    status: "ended",
  },
];


const Pools = () => {
  const [activeTab, setActiveTab] = useState("all");

  const filteredPools = pools.filter((pool) => {
    if (activeTab === "all") return true;
    if (activeTab === "active") return pool.status === "active";
    if (activeTab === "ended") return pool.status === "ended";
    return true;
  });

  return (
    <div className="min-h-screen bg-web3-dark">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2 glass rounded-full px-4 py-2">
                <div className="w-2 h-2 bg-web3-success rounded-full animate-pulse"></div>
                <span className="text-gray-300 font-mono-crypto">
                  {filteredPools.filter((p) => p.status === "active").length}{" "}
                  Active
                </span>
              </div>
              <div className="flex items-center space-x-2 glass rounded-full px-4 py-2">
                <span className="text-gray-300 font-mono-crypto">
                  $2.4M TVL
                </span>
              </div>
            </div>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            DeFi Prize Pools
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Decentralized no-loss savings with on-chain yield farming
          </p>
        </div>

        {/* Information Banner */}
        <div className="card-web3 card-glow rounded-2xl p-6 mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-electric/10 rounded-xl flex items-center justify-center border border-electric/20">
              <Shield className="w-5 h-5 text-electric" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">
                Non-Custodial Protocol
              </h3>
              <p className="text-gray-400">
                Winners rewarded from on-chain yield. All deposits remain fully
                accessible. Smart contracts audited and verified.
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 bg-web3-surface border border-web3-border">
              <TabsTrigger
                value="all"
                className="text-gray-400 data-[state=active]:text-white data-[state=active]:bg-electric"
              >
                All Pools
              </TabsTrigger>
              <TabsTrigger
                value="active"
                className="text-gray-400 data-[state=active]:text-white data-[state=active]:bg-electric"
              >
                Active
              </TabsTrigger>
              <TabsTrigger
                value="ended"
                className="text-gray-400 data-[state=active]:text-white data-[state=active]:bg-electric"
              >
                Ended
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Pool Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPools.map((pool) => (
            <PoolCard key={pool.id} pool={pool} />
          ))}
        </div>

        {/* Empty State */}
        {filteredPools.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No pools found
            </h3>
            <p className="text-gray-600 mb-6">
              {activeTab === "ended"
                ? "No ended pools to display"
                : "Check back soon for new pools"}
            </p>
            <Button
              className="bg-electric hover:bg-electric/90"
              onClick={() => setActiveTab("all")}
            >
              View All Pools
            </Button>
          </div>
        )}

        {/* Coming Soon Section */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 max-w-2xl mx-auto">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-electric/10 to-teal/10 rounded-2xl flex items-center justify-center mb-4">
              <Timer className="w-8 h-8 text-electric" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              More Pools Coming Soon
            </h3>
            <p className="text-gray-600 mb-6">
              We're adding support for more tokens and yield sources. Stay tuned
              for updates!
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {["USDT", "DAI", "WETH", "MATIC"].map((token) => (
                <Badge key={token} variant="outline" className="text-gray-500">
                  {token}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pools;
