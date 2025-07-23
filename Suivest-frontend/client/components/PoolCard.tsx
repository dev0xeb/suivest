import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Clock, Users, Flame, Zap, Target } from "lucide-react";
import PoolsDepositModal from "./PoolsDepositModal";

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
              <img src={pool.token.logo} alt={pool.token.symbol + " logo"} className="w-8 h-8" />
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
              <PoolsDepositModal pool={pool} />
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

export default PoolCard;
