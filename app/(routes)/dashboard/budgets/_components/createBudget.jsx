"use client";
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogClose,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import EmojiPicker from 'emoji-picker-react';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { useUser } from '@clerk/nextjs';
import { toast } from '@/components/ui/use-toast';

function CreateBudget({ refreshData }) {
  const [emoji, setEmoji] = useState("😄");
  const [openPicker, setOpenPicker] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useUser();

  /** Create new budget */
  const onCreateBudget = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await fetch('/api/budgets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          amount: Number(amount),
          icon: emoji,
          createdBy: user.primaryEmailAddress.emailAddress,
          category: category || null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        refreshData();
        toast({
          title: "New Budget Created",
          description: "Success!",
        });

        // Reset form
        setName("");
        setAmount("");
        setCategory("");
        setEmoji("😄");
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to create budget",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error creating budget:', error);
      toast({
        title: "Error",
        description: "Failed to create budget",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <div className='bg-slate-100 p-10 rounded-md items-center flex flex-col border-2 border-dashed cursor-pointer hover:shadow-md'>
            <h2 className='text-3xl'>+</h2>
            <h2>Create new Budget</h2>
          </div>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create new Budget</DialogTitle>

            {/* Emoji picker */}
            <div className='mt-5 relative'>
              <Button
                className="text-lg"
                variant="outline"
                onClick={() => setOpenPicker(!openPicker)}
              >
                {emoji}
              </Button>
              {openPicker && (
                <div className='absolute z-20'>
                  <EmojiPicker
                    onEmojiClick={(e) => {
                      setEmoji(e.emoji);
                      setOpenPicker(false);
                    }}
                  />
                </div>
              )}
            </div>

            {/* Budget Name */}
            <div className='mt-2'>
              <h2 className='text-black bold'>Budget Name</h2>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="eg. College Fee"
              />
            </div>

            {/* Amount */}
            <div className='mt-2'>
              <h2 className='text-black bold'>Amount</h2>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="eg. 2000000"
              />
            </div>

            {/* Category */}
            <div className='mt-2'>
              <h2 className='text-black bold'>Category (optional)</h2>
              <Input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="eg. Education"
              />
            </div>

            <DialogDescription />
          </DialogHeader>

          <DialogFooter>
            <DialogClose asChild>
              <Button
                onClick={() => onCreateBudget()}
                disabled={!(name && amount) || loading}
                className="mt-5"
              >
                {loading ? "Creating..." : "Create Budget"}
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateBudget;
