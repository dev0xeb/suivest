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
import { Minus } from "lucide-react";

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

export default WithdrawModal;
