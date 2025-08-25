import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Flame } from "lucide-react";

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

const PoolsDepositModal = ({ pool }: { pool: Pool }) => {
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

export default PoolsDepositModal;
