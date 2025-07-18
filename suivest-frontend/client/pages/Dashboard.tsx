import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
      name: "Sui",
      symbol: "SUI",
      logo: "💧",
      color: "electric",
    },
    deposited: "$350.00",
    weeklyPrize: "$1,500",
    streakWeeks: 7,
    isActive: true,
    nextDraw: "2d 14h",
  },
  {
    id: "2",
    token: {
      name: "USD Coin",
      symbol: "USDC",
      logo: "💵",
      color: "teal",
    },
    deposited: "$500.00",
    weeklyPrize: "$2,200",
    streakWeeks: 3,
    isActive: true,
    nextDraw: "4d 8h",
  },
];

const rewardHistory: RewardHistoryItem[] = [
  {
    id: "1",
    week: "Week 42",
    pool: "USDC Pool",
    prize: "$22.50",
    claimed: true,
    date: "2024-01-15",
  },
  {
    id: "2",
    week: "Week 38",
    pool: "SUI Pool",
    prize: "$19.80",
    claimed: true,
    date: "2024-01-01",
  },
  {
    id: "3",
    week: "Week 35",
    pool: "USDC Pool",
    prize: "$31.20",
    claimed: false,
    date: "2023-12-18",
  },
];

const DepositModal = ({ pool }: { pool: UserPool }) => {
  const [amount, setAmount] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="bg-electric hover:bg-electric/90 text-white rounded-full"
        >
          <Plus className="w-4 h-4 mr-1" />
          Deposit More
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span className="text-2xl">{pool.token.logo}</span>
            <span>Add to {pool.token.symbol} Pool</span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Additional Deposit Amount</Label>
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
              Add Deposit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const WithdrawModal = ({ pool }: { pool: UserPool }) => {
  const [amount, setAmount] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="border-gray-300 text-gray-600 hover:bg-gray-50 rounded-full"
        >
          <Minus className="w-4 h-4 mr-1" />
          Withdraw
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span className="text-2xl">{pool.token.logo}</span>
            <span>Withdraw from {pool.token.symbol} Pool</span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              ⚠️ Withdrawing will reset your streak for this pool
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="withdraw-amount">Withdrawal Amount</Label>
            <div className="relative">
              <Input
                id="withdraw-amount"
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
            <p className="text-xs text-gray-500">Available: {pool.deposited}</p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" className="flex-1" disabled={!amount}>
              Confirm Withdrawal
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Dashboard = () => {
  const [username] = useState("0x1234...5678");
  const totalTickets = 43;
  const svtTokens = 1500;
  const totalDeposited = 850.0;
  const rewardsEarned = 73.5;

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-lg text-gray-600">Welcome back, {username}!</p>
        </div>

        {/* Account Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Tickets Card */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <div className="w-10 h-10 bg-electric/10 rounded-xl flex items-center justify-center">
                  <Ticket className="w-5 h-5 text-electric" />
                </div>
                <span>Tickets</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-3xl font-bold text-gray-900">
                  {totalTickets}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Streak Progress</span>
                    <span className="font-medium">7/10 weeks</span>
                  </div>
                  <Progress value={70} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SVT Tokens Card */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <div className="w-10 h-10 bg-reward/10 rounded-xl flex items-center justify-center">
                  <Coins className="w-5 h-5 text-reward" />
                </div>
                <span>SVT Tokens</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-gray-900">
                  {svtTokens.toLocaleString()}
                </div>
                <div className="flex items-center space-x-1 text-sm">
                  <TrendingUp className="w-4 h-4 text-teal" />
                  <span className="text-teal font-medium">+125 this week</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Deposited Card */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <div className="w-10 h-10 bg-teal/10 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-teal" />
                </div>
                <span>Total Deposited</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-gray-900">
                  ${totalDeposited.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">Across 2 pools</div>
              </div>
            </CardContent>
          </Card>

          {/* Rewards Earned Card */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-purple-600" />
                </div>
                <span>Rewards Earned</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-gray-900">
                  ${rewardsEarned.toFixed(2)}
                </div>
                <div className="flex items-center space-x-1 text-sm">
                  <Trophy className="w-4 h-4 text-purple-600" />
                  <span className="text-purple-600 font-medium">
                    3 wins total
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Active Pools Section */}
          <div className="lg:col-span-2">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-electric/10 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-electric" />
                  </div>
                  <span>Active Pools</span>
                </CardTitle>
                <CardDescription>
                  Pools you're currently participating in
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {userPools.map((pool) => (
                  <div
                    key={pool.id}
                    className="bg-gray-50/50 rounded-xl p-4 space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-12 h-12 rounded-xl bg-${pool.token.color}/10 flex items-center justify-center text-2xl`}
                        >
                          {pool.token.logo}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {pool.token.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {pool.deposited} deposited
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">
                          {pool.weeklyPrize}
                        </div>
                        <div className="text-sm text-gray-600">
                          weekly prize
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Flame className="w-4 h-4 text-reward" />
                        <span className="text-sm font-medium">
                          {pool.streakWeeks} weeks active
                        </span>
                        <Badge
                          variant="outline"
                          className="text-teal border-teal"
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
                              className="border-electric text-electric hover:bg-electric hover:text-white rounded-full"
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
                    <div className="w-16 h-16 mx-auto bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                      <Plus className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No Active Pools
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Start your savings journey by joining a pool!
                    </p>
                    <Button className="bg-electric hover:bg-electric/90">
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
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-reward/10 rounded-lg flex items-center justify-center">
                    <Flame className="w-4 h-4 text-reward" />
                  </div>
                  <span>Streak Progress</span>
                </CardTitle>
                <CardDescription>
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
                            className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition-all cursor-pointer ${
                              week.completed
                                ? "bg-gradient-to-br from-reward to-electric text-white"
                                : "bg-gray-100 text-gray-400 hover:bg-gray-200"
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

                <div className="bg-gradient-to-r from-reward/10 to-electric/10 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Star className="w-4 h-4 text-reward" />
                    <span className="text-sm font-medium">Next Milestone</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Complete 3 more weeks to earn{" "}
                    <span className="font-bold text-reward">
                      +5 bonus tickets
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Rewards History */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Trophy className="w-4 h-4 text-purple-600" />
              </div>
              <span>Rewards History</span>
            </CardTitle>
            <CardDescription>Your past wins and prizes</CardDescription>
          </CardHeader>
          <CardContent>
            {rewardHistory.length > 0 ? (
              <div className="space-y-3">
                {rewardHistory.map((reward) => (
                  <div
                    key={reward.id}
                    className="flex items-center justify-between p-3 bg-gray-50/50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Gift className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {reward.week} - {reward.pool}
                        </p>
                        <p className="text-sm text-gray-600">{reward.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="font-bold text-lg text-gray-900">
                        {reward.prize}
                      </span>
                      {reward.claimed ? (
                        <CheckCircle className="w-5 h-5 text-teal" />
                      ) : (
                        <Button
                          size="sm"
                          className="bg-purple-600 hover:bg-purple-700 text-white rounded-full"
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
                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                  <Trophy className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Rewards Yet
                </h3>
                <p className="text-gray-600">
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
