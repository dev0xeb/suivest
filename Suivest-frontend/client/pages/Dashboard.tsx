import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import icons from "../lib/icons";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DepositModal from "@/components/DepositModal";
import WithdrawModal from "@/components/WithdrawModal";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Ticket,
  Coins,
  TrendingUp,
  Trophy,
  Flame,
  Zap,
  Plus,
  Minus,
  Target,
  Clock,
  Star,
  Gift,
  ArrowUpRight,
  TrendingDown,
  Calendar,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface UserPool {
  id: string;
  token: {
    name: string;
    symbol: string;
    logo: string;
    color: string;
  };
  deposited: string;
  weeklyPrize: string;
  streakWeeks: number;
  isActive: boolean;
  nextDraw: string;
}

interface RewardHistoryItem {
  id: string;
  week: string;
  pool: string;
  prize: string;
  claimed: boolean;
  date: string;
}

const userPools: UserPool[] = [
  {
    id: "1",
    token: {
      name: "SUI",
      symbol: "SUI",
      logo: icons.SUI,
      color: "electric",
    },
    deposited: "$0.00",
    weeklyPrize: "$0",
    streakWeeks: 7,
    isActive: true,
    nextDraw: "0d 0h",
  },
  {
    id: "2",
    token: {
      name: "USDC",
      symbol: "USDC",
      logo: icons.USDC,
      color: "teal",
    },
    deposited: "$0.00",
    weeklyPrize: "$0",
    streakWeeks: 3,
    isActive: true,
    nextDraw: "0d 0h",
  },
];

const rewardHistory: RewardHistoryItem[] = [
  {
    id: "1",
    week: "Week 1",
    pool: "USDC Pool",
    prize: "$0.00",
    claimed: true,
    date: "2024-01-15",
  },
  {
    id: "2",
    week: "Week 1",
    pool: "SUI Pool",
    prize: "$0.00",
    claimed: true,
    date: "2024-01-01",
  },
  {
    id: "3",
    week: "Week 1",
    pool: "USDC Pool",
    prize: "$0.00",
    claimed: false,
    date: "2023-12-18",
  },
];

const Dashboard = () => {
  const [username] = useState("0x1234...5678");
  const totalTickets = 0;
  const svtTokens = 0;
  const totalDeposited = 0.0;
  const rewardsEarned = 0.0;

  const streakWeeks = [
    { week: 1, completed: true },
    { week: 2, completed: true },
    { week: 3, completed: true },
    { week: 4, completed: true },
    { week: 5, completed: true },
    { week: 6, completed: true },
    { week: 7, completed: true },
    { week: 8, completed: false },
    { week: 9, completed: false },
    { week: 10, completed: false },
  ];

  return (
    <div className="min-h-screen bg-web3-dark">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Protocol Dashboard
              </h1>
              <div className="flex items-center space-x-4">
                <p className="text-lg text-gray-400">Welcome back,</p>
                <code className="address text-sm">{username}</code>
              </div>
            </div>
            <div className="text-right text-sm space-y-1">
              <div className="text-gray-400">Connected Network:</div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-web3-success rounded-full"></div>
                <span className="text-white font-mono-crypto">Sui Mainnet</span>
              </div>
              <div className="text-gray-500 font-mono-crypto">
                Block: #2,847,391
              </div>
            </div>
          </div>
        </div>

        {/* Account Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Tickets Card */}
          <Card className="card-web3 card-glow hover:border-electric/40 transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-lg text-white">
                <div className="w-10 h-10 bg-electric/10 rounded-xl flex items-center justify-center border border-electric/20">
                  <Ticket className="w-5 h-5 text-electric" />
                </div>
                <span>Tickets</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-3xl font-bold text-white">
                  {totalTickets}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Streak Progress</span>
                    <span className="font-medium text-electric">
                      0/10 weeks
                    </span>
                  </div>
                  <div className="w-full bg-web3-border rounded-full h-2">
                    <div
                      className="h-2 bg-gradient-to-r from-electric to-purple rounded-full"
                      style={{ width: "70%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SVT Tokens Card */}
          <Card className="card-web3 card-glow hover:border-reward/40 transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-lg text-white">
                <div className="w-10 h-10 bg-reward/10 rounded-xl flex items-center justify-center border border-reward/20">
                  <Coins className="w-5 h-5 text-reward" />
                </div>
                <span>$SVT Tokens</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-white">
                  {svtTokens.toLocaleString()}
                </div>
                <div className="flex items-center space-x-1 text-sm">
                  <TrendingUp className="w-4 h-4 text-teal" />
                  <span className="text-teal font-medium">+0 this week</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Deposited Card */}
          <Card className="card-web3 card-glow hover:border-teal/40 transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-lg text-white">
                <div className="w-10 h-10 bg-teal/10 rounded-xl flex items-center justify-center border border-teal/20">
                  <TrendingUp className="w-5 h-5 text-teal" />
                </div>
                <span>Total Value Locked</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-white">
                  ${totalDeposited.toFixed(2)}
                </div>
                <div className="text-sm text-gray-400 font-mono-crypto">
                  Across - pools
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rewards Earned Card */}
          <Card className="card-web3 card-glow hover:border-purple/40 transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-lg text-white">
                <div className="w-10 h-10 bg-purple/10 rounded-xl flex items-center justify-center border border-purple/20">
                  <Trophy className="w-5 h-5 text-purple" />
                </div>
                <span>Protocol Rewards</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-white">
                  ${rewardsEarned.toFixed(2)}
                </div>
                <div className="flex items-center space-x-1 text-sm">
                  <Trophy className="w-4 h-4 text-purple" />
                  <span className="text-purple font-medium">0 wins total</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Active Pools Section */}
          <div className="lg:col-span-2">
            <Card className="card-web3 card-glow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <div className="w-8 h-8 bg-electric/10 rounded-lg flex items-center justify-center border border-electric/20">
                    <TrendingUp className="w-4 h-4 text-electric" />
                  </div>
                  <span>Active Pools</span>
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Pools you're currently participating in
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {userPools.map((pool) => (
                  <div
                    key={pool.id}
                    className="card-web3 rounded-xl p-4 space-y-4 border border-web3-border hover:border-electric/30 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-12 h-12 rounded-xl bg-${pool.token.color}/10 flex items-center justify-center text-2xl border border-${pool.token.color}/20`}
                        >
                          <img
                            src={pool.token.logo}
                            alt={pool.token.symbol + " logo"}
                            className="w-8 h-8"
                          />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">
                            {pool.token.name}
                          </h4>
                          <p className="text-sm text-gray-400 font-mono-crypto">
                            {pool.deposited} deposited
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-electric">
                          {pool.weeklyPrize}
                        </div>
                        <div className="text-sm text-gray-400">
                          weekly prize
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Flame className="w-4 h-4 text-reward" />
                        <span className="text-sm font-medium text-white">
                          {pool.streakWeeks} weeks active
                        </span>
                        <Badge
                          variant="outline"
                          className="text-teal border-teal/30 bg-teal/10"
                        >
                          <Clock className="w-3 h-3 mr-1" />
                          {pool.nextDraw}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <DepositModal pool={pool} />
                      <WithdrawModal pool={pool} />
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-electric/30 text-electric hover:bg-electric hover:text-white rounded-full bg-electric/5"
                            >
                              <Target className="w-4 h-4 mr-1" />
                              Boost Odds
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Burn $SVT tokens to increase winning chances</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                ))}

                {userPools.length === 0 && (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto bg-web3-surface rounded-2xl flex items-center justify-center mb-4 border border-web3-border">
                      <Plus className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      No Active Pools
                    </h3>
                    <p className="text-gray-400 mb-4">
                      Start your savings journey by joining a pool!
                    </p>
                    <Button className="bg-gradient-to-r from-electric to-purple hover:from-electric/90 hover:to-purple/90 btn-glow">
                      <Plus className="w-4 h-4 mr-2" />
                      Join a Pool
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Streak Meter */}
          <div>
            <Card className="card-web3 card-glow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <div className="w-8 h-8 bg-reward/10 rounded-lg flex items-center justify-center border border-reward/20">
                    <Flame className="w-4 h-4 text-reward" />
                  </div>
                  <span>Streak Progress</span>
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Don't break your streak to earn bonus tickets!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-5 gap-2">
                  {streakWeeks.map((week) => (
                    <TooltipProvider key={week.week}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition-all cursor-pointer border ${
                              week.completed
                                ? "bg-gradient-to-br from-reward to-electric text-white border-reward/30 animate-pulse-glow"
                                : "bg-web3-surface text-gray-400 hover:bg-web3-border border-web3-border hover:border-electric/30"
                            }`}
                          >
                            {week.week}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Week {week.week}:{" "}
                            {week.completed ? "Completed" : "Pending"}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>

                <div className="bg-gradient-to-r from-reward/10 to-electric/10 rounded-xl p-4 border border-reward/20">
                  <div className="flex items-center space-x-2 mb-2">
                    <Star className="w-4 h-4 text-reward" />
                    <span className="text-sm font-medium text-white">
                      Next Milestone
                    </span>
                  </div>
                  <p className="text-sm text-gray-300">
                    Complete 3 more weeks to earn{" "}
                    <span className="font-bold text-gradient">
                      +5 bonus tickets
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Rewards History */}
        <Card className="card-web3 card-glow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <div className="w-8 h-8 bg-purple/10 rounded-lg flex items-center justify-center border border-purple/20">
                <Trophy className="w-4 h-4 text-purple" />
              </div>
              <span>Rewards History</span>
            </CardTitle>
            <CardDescription className="text-gray-400">
              Your past wins and prizes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {rewardHistory.length > 0 ? (
              <div className="space-y-3">
                {rewardHistory.map((reward) => (
                  <div
                    key={reward.id}
                    className="flex items-center justify-between p-3 bg-web3-surface/50 rounded-lg border border-web3-border hover:border-purple/30 transition-all duration-300"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple/10 rounded-lg flex items-center justify-center border border-purple/20">
                        <Gift className="w-5 h-5 text-purple" />
                      </div>
                      <div>
                        <p className="font-medium text-white">
                          {reward.week} - {reward.pool}
                        </p>
                        <p className="text-sm text-gray-400 font-mono-crypto">
                          {reward.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="font-bold text-lg text-gradient">
                        {reward.prize}
                      </span>
                      {reward.claimed ? (
                        <CheckCircle className="w-5 h-5 text-teal" />
                      ) : (
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-purple to-electric hover:from-purple/90 hover:to-electric/90 text-white rounded-full btn-glow"
                        >
                          Claim
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto bg-web3-surface rounded-2xl flex items-center justify-center mb-4 border border-web3-border">
                  <Trophy className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  No Rewards Yet
                </h3>
                <p className="text-gray-400">
                  Keep saving consistently to increase your winning chances!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
