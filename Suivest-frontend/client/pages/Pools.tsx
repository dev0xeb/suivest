import { useState } from "react";
import icons from "../lib/icons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DollarSign,
  TrendingUp,
  Zap,
  Clock,
  Users,
  Shield,
  Info,
  Sparkles,
  ArrowRight,
  Timer,
  Target,
  Flame,
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
      name: "SUI",
      symbol: "SUI",
      logo: icons.SUI,
      color: "electric",
    },
    yieldSource: "Powered by Navi Protocol",
    weeklyPrize: "$0",
    apr: "0%",
    totalDeposits: {
      usd: "$0",
      token: "0 SUI",
    },
    userStreak: 0,
    boostApplied: true,
    participants: 0,
    timeLeft: "0",
    status: "active",
  },
  {
    id: "2",
    token: {
      name: "USDC",
      symbol: "USDC",
      logo: icons.USDC,
      color: "teal",
    },
    yieldSource: "Powered by Navi Protocol",
    weeklyPrize: "$0",
    apr: "0%",
    totalDeposits: {
      usd: "$0",
      token: "0 USDC",
    },
    userStreak: 0,
    boostApplied: false,
    participants: 0,
    timeLeft: "",
    status: "active",
  },
  {
    id: "3",
    token: {
      name: "Walrus",
      symbol: "WAL",
      logo: icons.Wal,
      color: "reward",
    },
    yieldSource: "Powered by Navi Protocol",
    weeklyPrize: "$0",
    apr: "%",
    totalDeposits: {
      usd: "$0",
      token: "0 WAL",
    },
    userStreak: 0,
    boostApplied: false,
    participants: 0,
    timeLeft: "0",
    status: "active",
  },
  {
    id: "4",
    token: {
      name: "DEEP",
      symbol: "DEEP",
      logo: icons.DEEP,
      color: "electric",
    },
    yieldSource: "Powered by Navi Protocol",
    weeklyPrize: "$0",
    apr: "0%",
    totalDeposits: {
      usd: "$0",
      token: "0 DEEP",
    },
    userStreak: 0,
    boostApplied: false,
    participants: 0,
    timeLeft: "0",
    status: "active",
  },
];

const DepositModal = ({ pool }: { pool: Pool }) => {
  const [amount, setAmount] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-electric hover:bg-electric/90 text-white rounded-full px-6 py-2 transition-all duration-200 hover:scale-105">
          Deposit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span className="text-2xl">{pool.token.logo}</span>
            <span>Deposit {pool.token.symbol}</span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount to Deposit</Label>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pr-16"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-500">
                {pool.token.symbol}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <h4 className="font-semibold text-gray-900">Deposit Preview</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Weekly Prize Pool</span>
                <span className="font-medium">{pool.weeklyPrize}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estimated APR</span>
                <span className="font-medium text-teal">{pool.apr}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Your Current Streak</span>
                <div className="flex items-center space-x-1">
                  <Flame className="w-4 h-4 text-reward" />
                  <span className="font-medium">{pool.userStreak} weeks</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Streak Bonus Potential</span>
                <span className="font-medium text-reward">+25 $SVT</span>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-electric hover:bg-electric/90"
              disabled={!amount}
            >
              Confirm Deposit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const PoolCard = ({ pool }: { pool: Pool }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg card-hover border border-gray-100">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div
              className={`w-12 h-12 rounded-xl bg-${pool.token.color}/10 flex items-center justify-center text-2xl`}
            >
              <img
                src={pool.token.logo}
                alt={pool.token.symbol + " logo"}
                className="w-8 h-8"
              />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900">
                {pool.token.name}
              </h3>
              <p className="text-sm text-gray-600">{pool.yieldSource}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {pool.status === "active" && (
              <Badge variant="outline" className="text-teal border-teal">
                <div className="w-2 h-2 bg-teal rounded-full mr-1"></div>
                Active
              </Badge>
            )}
            {pool.status === "ended" && (
              <Badge
                variant="outline"
                className="text-gray-500 border-gray-300"
              >
                Ended
              </Badge>
            )}
          </div>
        </div>

        {/* Prize and APR */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-gray-600">Weekly Prize</p>
            <p className="text-2xl font-bold text-gray-900">
              {pool.weeklyPrize}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-600">Est. APR</p>
            <p className="text-xl font-bold text-teal">{pool.apr}</p>
          </div>
        </div>

        {/* Total Deposits */}
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Total Deposits</p>
          <div className="flex items-center justify-between">
            <span className="font-bold text-gray-900">
              {pool.totalDeposits.usd}
            </span>
            <span className="text-sm text-gray-600">
              ({pool.totalDeposits.token})
            </span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>{pool.participants} participants</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{pool.timeLeft}</span>
          </div>
        </div>

        {/* User Status */}
        {pool.userStreak > 0 && (
          <div className="bg-gradient-to-r from-reward/10 to-electric/10 rounded-xl p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Flame className="w-4 h-4 text-reward" />
                <span className="text-sm font-medium">
                  {pool.userStreak} Week Streak
                </span>
              </div>
              {pool.boostApplied && (
                <div className="flex items-center space-x-1">
                  <Zap className="w-4 h-4 text-electric" />
                  <span className="text-xs font-medium text-electric">
                    Boosted
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-3 pt-2">
          {pool.status === "active" ? (
            <>
              <DepositModal pool={pool} />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex-1 border-electric text-electric hover:bg-electric hover:text-white rounded-full transition-all duration-200"
                    >
                      <Target className="w-4 h-4 mr-2" />
                      Boost Odds
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Use $SVT tokens to increase your winning chances</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          ) : (
            <Button disabled className="w-full rounded-full">
              Pool Ended
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

const Pools = () => {
  const [activeTab, setActiveTab] = useState("all");

  const filteredPools = pools.filter((pool) => {
    if (activeTab === "all") return true;
    if (activeTab === "active") return pool.status === "active";
    if (activeTab === "ended") return pool.status === "ended";
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Weekly Pools
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your gateway to gamified savings and streak-based rewards
          </p>
        </div>

        {/* Information Banner */}
        <div className="bg-gradient-to-r from-electric/10 to-teal/10 rounded-2xl p-6 mb-8 border border-electric/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-electric/10 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-electric" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Your Deposits Are Safe
              </h3>
              <p className="text-gray-600">
                Winners are rewarded from yield. Everyone else builds a streak
                and earns $SVT tokens.
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
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
              <TabsTrigger value="all">All Pools</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="ended">Ended</TabsTrigger>
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
              {["USDT", "NAVX", "WETH", "NS"].map((token) => (
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
